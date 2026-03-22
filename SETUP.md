# Assignment Explainer Setup

## Environment variables

Frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`

Backend:

- `PORT`
- `FRONTEND_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LLM_PROVIDER`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `REQUEST_TIMEOUT_MS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

## Suggested setup order

1. Install dependencies with `npm install`.
2. Apply the Supabase migration.
3. In Supabase Auth, keep email confirmations enabled.
4. In Supabase Auth -> URL Configuration, add your app callback URL:
   - `http://localhost:5173/auth/callback`
5. In Supabase Auth -> Email Templates, paste the HTML files from `supabase/email-templates`.
6. Copy the example env files for frontend and backend.
7. Start the backend with `npm run dev:backend`.
8. Start the frontend with `npm run dev:frontend`.

## Current implementation notes

- The backend uses the OpenAI Responses API with a strict JSON schema and validates the returned payload again with `zod`.
- The backend defaults to Gemini free-tier friendly JSON-schema output and can still use OpenAI if `LLM_PROVIDER=openai`.
- Failed or refused model calls still persist an explanation row so the history page can show the outcome.
- The frontend protects dashboard routes until Supabase reports an authenticated and verified user session.
- The frontend now supports branded email confirmation, password reset, resend verification, and an auth callback route at `/auth/callback`.
