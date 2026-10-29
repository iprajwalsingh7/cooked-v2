import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

from fastapi import HTTPException
from fastapi.testclient import TestClient

from server import get_settings


class DeploymentSettingsTests(unittest.TestCase):
    def test_production_origin_comes_from_vercel(self):
        with patch.dict(os.environ, {"VERCEL": "1", "VERCEL_PROJECT_PRODUCTION_URL": "cooked-v2.vercel.app"}, clear=True):
            config = get_settings()
        self.assertEqual(config.frontend_url, "https://cooked-v2.vercel.app")
        self.assertEqual(config.spotify_redirect, "https://cooked-v2.vercel.app/api/auth/callback")
        self.assertTrue(config.secure_cookies)

    def test_existing_spotify_callback_determines_cookie_origin(self):
        with patch.dict(os.environ, {"SPOTIFY_REDIRECT_URI": "https://cooked.test/api/auth/callback"}, clear=True):
            config = get_settings()
        self.assertEqual(config.frontend_url, "https://cooked.test")
        self.assertTrue(config.secure_cookies)

    def test_explicit_origin_takes_precedence(self):
        with patch.dict(os.environ, {"FRONTEND_URL": "https://custom.test/", "VERCEL_PROJECT_PRODUCTION_URL": "project.vercel.app"}, clear=True):
            config = get_settings()
        self.assertEqual(config.frontend_url, "https://custom.test")

    def test_vercel_never_falls_back_to_localhost(self):
        with patch.dict(os.environ, {"VERCEL": "1"}, clear=True):
            with self.assertRaises(HTTPException) as context:
                get_settings()
        self.assertEqual(context.exception.status_code, 503)

    def test_local_default_is_unchanged(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(get_settings().frontend_url, "http://localhost:3000")


class VercelEntrypointTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
        from api.index import app
        cls.app = app

    def test_bundled_function_serves_health(self):
        with TestClient(self.app) as client:
            response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_bundled_function_starts_spotify_auth_on_production_domain(self):
        with patch.dict(os.environ, {
            "VERCEL": "1",
            "VERCEL_PROJECT_PRODUCTION_URL": "cooked-v2.vercel.app",
            "SPOTIFY_CLIENT_ID": "test-client",
            "SPOTIFY_CLIENT_SECRET": "test-secret",
        }, clear=True):
            with TestClient(self.app) as client:
                response = client.get("/api/auth/login", follow_redirects=False)
        self.assertEqual(response.status_code, 302)
        target = urlparse(response.headers["location"])
        self.assertEqual(target.netloc, "accounts.spotify.com")
        query = parse_qs(target.query)
        self.assertEqual(query["redirect_uri"], ["https://cooked-v2.vercel.app/api/auth/callback"])
        self.assertEqual(response.cookies["spotify_oauth_state"], query["state"][0])
        self.assertIn("Secure", response.headers["set-cookie"])
        self.assertIn("HttpOnly", response.headers["set-cookie"])


if __name__ == "__main__":
    unittest.main()
