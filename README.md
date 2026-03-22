# Assignment Explainer

Monorepo for a Supabase-backed assignment explanation app with a React frontend, Express API, and OpenAI Responses integration.

## Workspaces

- `frontend`: Vite + React + TypeScript + Tailwind app
- `backend`: Express + TypeScript API
- `shared`: shared API contracts and database types
- `supabase`: SQL migrations and RLS policies

## Quick start

1. Copy `frontend/.env.example` to `frontend/.env`
2. Copy `backend/.env.example` to `backend/.env`
3. Install dependencies with `npm install`
4. Put your AI provider key in `backend/.env`
5. Run the frontend with `npm run dev:frontend`
6. Run the backend with `npm run dev:backend`

## Notes

- Supabase email verification should remain enabled for the MVP flow.
- `shared/src/database.ts` is a checked-in type file that mirrors the SQL schema. If you connect the project to Supabase CLI later, you can replace it with generated output.
- The backend defaults to `LLM_PROVIDER=gemini`, which is a better fit for a free-tier MVP than OpenAI billing.
