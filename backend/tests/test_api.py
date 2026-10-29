import json
import unittest
from dataclasses import replace
from urllib.parse import parse_qs, urlparse

import httpx
from fastapi.testclient import TestClient

from server import Settings, app, get_client, get_settings


class CookedApiTests(unittest.TestCase):
    def setUp(self):
        self.config = Settings("https://cooked.test", "test-gemini-key", "test-model", "", "spotify-id", "spotify-secret", "https://cooked.test/api/auth/callback")
        self.requests = []
        self.handler = self.respond
        self.client = TestClient(app)

        async def mock_client():
            async with httpx.AsyncClient(transport=httpx.MockTransport(self.capture)) as client:
                yield client

        app.dependency_overrides[get_client] = mock_client
        app.dependency_overrides[get_settings] = lambda: self.config

    def tearDown(self):
        self.client.close()
        app.dependency_overrides.clear()

    def capture(self, request):
        self.requests.append(request)
        return self.handler(request)

    def respond(self, request):
        if request.url.host == "generativelanguage.googleapis.com":
            return httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": "Your README does all the heavy lifting."}]}}]})
        if request.url.path.endswith("/repos"):
            return httpx.Response(200, json=[{"name": "demo", "language": "Python", "private": False}, {"name": "secret", "private": True}])
        if request.url.host == "api.github.com":
            return httpx.Response(200, json={"login": "octocat", "bio": "hello", "public_repos": 2})
        if request.url.path.endswith("/about.json"):
            return httpx.Response(200, json={"data": {"name": "test_user", "total_karma": 10}})
        if request.url.host == "www.reddit.com":
            return httpx.Response(200, json={"data": {"children": [{"data": {"body": "hello", "subreddit": "python"}}]}})
        if request.url.path == "/api/token":
            return httpx.Response(200, json={"access_token": "private-token", "expires_in": 3600})
        if request.url.path == "/v1/me":
            return httpx.Response(200, json={"display_name": "Listener"})
        if request.url.path == "/v1/me/top/artists":
            return httpx.Response(200, json={"items": [{"name": "Artist"}]})
        if request.url.path == "/v1/me/top/tracks":
            return httpx.Response(200, json={"items": [{"name": "Song", "artists": [{"name": "Artist"}]}]})
        if request.url.path == "/v1/me/player/recently-played":
            return httpx.Response(200, json={"items": []})
        raise AssertionError(str(request.url))

    def test_health_has_no_cache(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.json(), {"status": "ok"})
        self.assertEqual(response.headers["cache-control"], "no-store")

    def test_github_contract_and_private_repo_filter(self):
        response = self.client.post("/api/github/roast", json={"username": " octocat "})
        self.assertEqual(response.status_code, 200)
        self.assertIn("README", response.json()["roast"])
        ai_request = next(item for item in self.requests if item.method == "POST")
        data = json.loads(ai_request.content)
        profile_data = json.loads(data["contents"][0]["parts"][0]["text"])
        self.assertEqual([repo["name"] for repo in profile_data["repos"]], ["demo"])
        self.assertEqual(ai_request.headers["x-goog-api-key"], "test-gemini-key")

    def test_invalid_usernames_do_not_make_external_requests(self):
        for path, name in [("github", "../secret"), ("github", ""), ("reddit", "u/name"), ("reddit", "x" * 21)]:
            with self.subTest(path=path, name=name):
                response = self.client.post(f"/api/{path}/roast", json={"username": name})
                self.assertEqual(response.status_code, 422)
                self.assertIn("error", response.json())
        self.assertEqual(self.requests, [])

    def test_invalid_json_has_frontend_error_contract(self):
        response = self.client.post("/api/github/roast", content="{", headers={"content-type": "application/json"})
        self.assertEqual(response.status_code, 422)
        self.assertIn("error", response.json())

    def test_reddit_contract(self):
        response = self.client.post("/api/reddit/roast", json={"username": "test_user"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("roast", response.json())

    def test_upstream_rate_limit_is_not_reported_as_missing_user(self):
        self.handler = lambda request: httpx.Response(403, headers={"x-ratelimit-remaining": "0"}, json={})
        response = self.client.post("/api/github/roast", json={"username": "octocat"})
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.headers["retry-after"], "60")

    def test_reddit_access_denied_is_visible(self):
        self.handler = lambda request: httpx.Response(403, json={})
        response = self.client.post("/api/reddit/roast", json={"username": "test_user"})
        self.assertEqual(response.status_code, 403)
        self.assertIn("denied access", response.json()["error"])

    def test_missing_gemini_configuration(self):
        self.config = replace(self.config, gemini_key="")
        response = self.client.post("/api/github/roast", json={"username": "octocat"})
        self.assertEqual(response.status_code, 503)
        self.assertIn("not configured", response.json()["error"])

    def test_network_failure_is_sanitized(self):
        def timeout(request):
            raise httpx.ReadTimeout("private upstream diagnostics", request=request)
        self.handler = timeout
        response = self.client.post("/api/github/roast", json={"username": "octocat"})
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("private", response.text)

    def test_blocked_ai_output_has_clear_error(self):
        def blocked(request):
            return httpx.Response(200, json={"candidates": []}) if request.url.host == "generativelanguage.googleapis.com" else self.respond(request)
        self.handler = blocked
        response = self.client.post("/api/github/roast", json={"username": "octocat"})
        self.assertEqual(response.status_code, 502)

    def test_login_sets_secure_httponly_state_cookie(self):
        response = self.client.get("/api/auth/login", follow_redirects=False)
        query = parse_qs(urlparse(response.headers["location"]).query)
        self.assertTrue(len(query["state"][0]) >= 32)
        self.assertEqual(response.cookies["spotify_oauth_state"], query["state"][0])
        cookie = response.headers["set-cookie"]
        for attribute in ("HttpOnly", "Secure", "SameSite=lax"):
            self.assertIn(attribute, cookie)

    def test_callback_rejects_mismatched_state_without_token_exchange(self):
        response = self.client.get("/api/auth/callback?code=abc&state=wrong", headers={"cookie": "spotify_oauth_state=expected"}, follow_redirects=False)
        self.assertEqual(response.headers["location"], "https://cooked.test/spotify?error=state_mismatch")
        self.assertEqual(self.requests, [])

    def test_callback_exchanges_code_without_exposing_token_in_url(self):
        response = self.client.get("/api/auth/callback?code=abc&state=expected", headers={"cookie": "spotify_oauth_state=expected"}, follow_redirects=False)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["location"], "https://cooked.test/spotify/roast")
        self.assertEqual(response.cookies["spotify_access_token"], "private-token")
        self.assertIn("HttpOnly", response.headers.get_list("set-cookie")[-1])
        self.assertNotIn("private-token", response.headers["location"])

    def test_callback_denial_clears_state(self):
        response = self.client.get("/api/auth/callback?error=access_denied&state=expected", headers={"cookie": "spotify_oauth_state=expected"}, follow_redirects=False)
        self.assertIn("access_denied", response.headers["location"])
        self.assertIn("Max-Age=0", response.headers["set-cookie"])
        self.assertEqual(self.requests, [])

    def test_spotify_requires_session(self):
        response = self.client.get("/api/spotify/roast")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(self.requests, [])

    def test_spotify_fetches_authorized_data(self):
        response = self.client.get("/api/spotify/roast", headers={"cookie": "spotify_access_token=private-token"})
        self.assertEqual(response.status_code, 200)
        requests = [item for item in self.requests if item.url.host == "api.spotify.com"]
        self.assertEqual(len(requests), 4)
        self.assertTrue(all(item.headers["authorization"] == "Bearer private-token" for item in requests))

    def test_ai_rate_limit_does_not_leak_provider_details(self):
        def limited(request):
            return httpx.Response(429, json={"error": {"message": "private API key details"}}) if request.url.host == "generativelanguage.googleapis.com" else self.respond(request)
        self.handler = limited
        response = self.client.post("/api/github/roast", json={"username": "octocat"})
        self.assertEqual(response.status_code, 429)
        self.assertNotIn("private", response.text)


if __name__ == "__main__":
    unittest.main()
