# Cooked

Cooked generates personalized roasts from GitHub profiles, Reddit activity, and authorized Spotify listening data.

## Stack

The frontend uses Next.js, React, TypeScript, and Tailwind CSS. All application API logic runs in Python with FastAPI and HTTPX. Gemini generates the roasts. There is no database.

## Run locally

Use Node.js 22+ and Python 3.12+.

From the repository root:

```text
npm ci
cp .env.example .env.local
npm run dev
```

In a second terminal:

```text
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
cp .env.example .env
.venv\Scripts\python.exe -m uvicorn server:app --reload --port 8000
```

On macOS and Linux, replace `.venv\Scripts\python.exe` with `.venv/bin/python`.

Open http://localhost:3000. The frontend proxies /api/* to FastAPI on port 8000. FastAPI documentation is at http://127.0.0.1:8000/docs.

Set GEMINI_API_KEY in backend/.env to generate live roasts. GITHUB_TOKEN is optional and increases GitHub's API limit. A Spotify developer app is required for the Spotify feature. Credentials stay in the Python backend.

## Configuration

| Variable              | Location                             | Purpose                                                       |
| --------------------- | ------------------------------------ | ------------------------------------------------------------- |
| API_BACKEND_URL       | Frontend .env.local or host settings | FastAPI origin, without /api                                  |
| FRONTEND_URL          | Backend .env or host settings        | Exact frontend origin for OAuth redirects and cookie security |
| GEMINI_API_KEY        | Backend only                         | Google Gemini API credential                                  |
| GEMINI_MODEL          | Backend only                         | Model available to your account; defaults to gemini-2.5-flash |
| GITHUB_TOKEN          | Backend only                         | Optional GitHub API credential                                |
| SPOTIFY_CLIENT_ID     | Backend only                         | Spotify app client ID                                         |
| SPOTIFY_CLIENT_SECRET | Backend only                         | Spotify app client secret                                     |
| SPOTIFY_REDIRECT_URI  | Backend only                         | Frontend origin plus /api/auth/callback                       |

Never put credentials in NEXT_PUBLIC_ variables. Gemini availability and free quotas depend on the model and account.

## Deploy on Vercel

Create two Vercel projects from this repository:

1. Backend: set Root Directory to backend, use FastAPI detection, and configure the backend variables above.
2. Frontend: use the repository root with the Next.js preset, and set API_BACKEND_URL to the backend deployment origin.
3. Set backend FRONTEND_URL to the frontend production origin and SPOTIFY_REDIRECT_URI to that origin plus /api/auth/callback.
4. Register the exact same callback URL in the Spotify developer dashboard.
5. Redeploy after changing configuration. API_BACKEND_URL is read during the frontend build.
6. Keep the backend reachable by the frontend proxy; Vercel authentication protection must not block public production API requests.

The frontend proxies API requests so cookies remain on the frontend origin. Spotify tokens are HTTP-only cookies, never URL parameters. OAuth state is cryptographically generated and checked against a short-lived cookie. Sessions expire after Spotify's access-token lifetime; reconnect when prompted.

Vercel Hobby supports personal, non-commercial use within plan limits. This repository does not provision hosting accounts or configure secrets automatically.

## Checks

```text
npm run build
cd backend
.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Backend tests mock external providers, covering successful roast responses, validation, provider errors, OAuth state protection, secure cookie behavior, and token handling. Live Gemini and Spotify checks require your credentials.

## Integration limits

Spotify development apps restrict account access. Reddit can reject server-hosted public JSON requests; the UI surfaces that error rather than fabricating a result. GitHub API limits apply, with a higher allowance when configured with a token.

## Data

Cooked sends a limited profile summary to Gemini. It does not persist roast history. Hosting providers and Gemini apply their own logging and data-retention policies.

## License

MIT.
