# BriefLens

BriefLens is a full-stack assignment explainer built for students who want to understand a brief before they start writing. It turns a raw assignment prompt into a cleaner breakdown, surfaces what the lecturer is really asking for, suggests a workable structure, and saves each explanation for later review.

The project uses the same visual language as the app itself:

- `Sand` for the warm background: `#f6efe6`
- `Ink` for primary text and surfaces: `#152033`
- `Accent` for calls to action and energy: `#df6d2d`
- `Teal` for supportive highlights and calm feedback
- `White` for readable cards and content panels

## Table Of Contents

- [Project Overview](#project-overview)
- [What The App Does](#what-the-app-does)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Workspace Structure](#workspace-structure)
- [Tech Stack](#tech-stack)
- [Authentication Flow](#authentication-flow)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Development Scripts](#development-scripts)
- [Testing And Quality Checks](#testing-and-quality-checks)
- [Deployment](#deployment)
- [Database And Supabase Notes](#database-and-supabase-notes)
- [Current Product Notes](#current-product-notes)

## Project Overview

BriefLens is a monorepo with four main parts:

- `frontend`: a Vite + React + TypeScript interface
- `backend`: an Express + TypeScript API
- `shared`: shared Zod schemas and database types
- `supabase`: SQL migrations, RLS policies, and email templates

The app is designed around one core workflow:

1. A signed-in user submits an assignment brief.
2. The backend validates it, stores it, and generates a structured explanation with an AI model.
3. The result is saved in Supabase.
4. The frontend shows the explanation and keeps it in history for future review.

## What The App Does

BriefLens helps students:

- understand assignment wording faster
- see the likely lecturer intent behind the prompt
- break the task into manageable steps
- identify research priorities before drafting
- avoid common mistakes and weak reasoning
- return to past explanations from a history screen

It is intentionally positioned as study guidance, not ghostwriting.

## How It Works

### Student flow

1. Open the landing page and create an account.
2. Verify the email address through Supabase Auth.
3. Sign in and open the new explanation form.
4. Paste the assignment brief and optional details like course name or word count.
5. The API stores the request, generates a structured explanation, and saves the result.
6. The user can revisit the output later from the history page.

### Processing flow

1. The frontend sends a bearer token from the authenticated Supabase session.
2. The backend verifies the user token with Supabase.
3. The backend validates the assignment payload with shared Zod schemas.
4. The assignment and explanation rows are created in Supabase.
5. The selected AI provider generates a structured response.
6. The backend stores the completed, refused, or failed state.
7. The frontend fetches history and explanation details through the protected API.

## Architecture

```text
Frontend (React/Vite)
  -> Supabase Auth for sign up, login, email verification, password reset
  -> Express API for assignment generation and history

Express API
  -> Supabase database for assignments, explanations, profiles
  -> AI provider for structured explanation generation

Shared package
  -> Zod schemas
  -> TypeScript contracts
  -> Database type definitions
```

## Workspace Structure

```text
.
|-- frontend/
|   |-- src/
|   |-- .env.example
|   `-- vercel.json
|-- backend/
|   |-- api/
|   |-- src/
|   |-- .env.example
|   `-- vercel.json
|-- shared/
|   `-- src/
|-- supabase/
|   |-- migrations/
|   `-- email-templates/
|-- README.md
`-- SETUP.md
```

## Tech Stack

### Frontend

- React 18
- Vite
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- Supabase JS client

### Backend

- Express
- TypeScript
- Supabase JS client
- Zod
- `helmet`
- `cors`
- `express-rate-limit`

### Shared

- Zod schemas for request and response validation
- Database types shared across frontend and backend

### Platform services

- Supabase for Auth, Postgres, and Row Level Security
- Vercel for deployment
- OpenAI or Gemini as the AI provider

## Authentication Flow

Authentication is handled with Supabase Auth and reinforced by the frontend and backend.

### Signup

- User signs up with name, email, and password.
- Supabase sends a confirmation email.
- The app redirects the user to a dedicated verification page.

### Verification

- Email confirmation returns through `/auth/callback`.
- Unverified users are blocked from protected pages.
- The verification screen can resend signup verification emails.

### Login

- Verified users can sign in normally.
- Unverified users are redirected into the verification flow.

### Protected routes

- The frontend uses route guards to keep guests out of the dashboard and related pages.
- The backend separately checks the bearer token and rejects unverified users.

### Password recovery

- Users can request a reset email.
- Reset links return through `/auth/callback`.
- The app switches into recovery mode for password updates.

## API Overview

Base URL comes from `VITE_API_BASE_URL` in the frontend.

### Public route

- `GET /api/health`
  - Simple health check response

### Protected routes

- `POST /api/explain-assignment`
  - Validates input
  - Stores a pending explanation
  - Generates a structured explanation
  - Returns `completed`, `failed`, or `refused`

- `GET /api/history`
  - Returns saved explanation history for the signed-in user

- `GET /api/history/:id`
  - Returns one explanation detail record

All protected routes require a valid Supabase access token in the `Authorization` header.

## Environment Variables

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000
```

### Backend

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
REQUEST_TIMEOUT_MS=30000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
```

### Provider selection

- `LLM_PROVIDER=gemini` is the default
- `LLM_PROVIDER=openai` is supported as well
- the matching API key must be present for the selected provider

## Local Setup

### Prerequisites

- Node.js 22 or compatible modern Node runtime
- npm
- a Supabase project
- at least one AI provider key

### Install

```bash
npm install
```

### Configure Supabase

1. Create a Supabase project.
2. Keep email confirmations enabled.
3. Run the SQL migration in `supabase/migrations`.
4. Add your callback URL in Supabase Auth URL settings:
   - `http://localhost:5173/auth/callback`
5. Paste the templates from `supabase/email-templates` into Supabase Auth email templates.

### Configure environment files

1. Copy `frontend/.env.example` to `frontend/.env`
2. Copy `backend/.env.example` to `backend/.env`
3. Fill in your Supabase and AI provider values

### Start the app

```bash
npm run dev:backend
```

In a separate terminal:

```bash
npm run dev:frontend
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5000`.

## Development Scripts

### Root

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
npm run test
npm run typecheck
```

### Frontend

```bash
npm run dev --workspace frontend
npm run lint --workspace frontend
npm run format --workspace frontend
npm run format:check --workspace frontend
npm run typecheck --workspace frontend
npm run test --workspace frontend
npm run build --workspace frontend
```

### Backend

```bash
npm run dev --workspace backend
npm run typecheck --workspace backend
npm run test --workspace backend
npm run build --workspace backend
```

### Shared

```bash
npm run build --workspace shared
npm run typecheck --workspace shared
npm run test --workspace shared
```

## Testing And Quality Checks

The frontend CI workflow currently runs:

- dependency install
- shared package build
- frontend lint
- frontend formatting check
- frontend typecheck
- frontend tests
- frontend production build

Recommended local command sequence before pushing:

```bash
npm run format:check --workspace frontend
npm run lint --workspace frontend
npm run typecheck --workspace frontend
npm run test --workspace frontend
npm run build --workspace frontend
npm run typecheck --workspace backend
npm run build --workspace backend
```

## Deployment

### Recommended Vercel setup

Deploy frontend and backend as separate Vercel projects.

### Frontend on Vercel

- Root directory: `frontend`
- important env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_BASE_URL=https://your-backend-domain.vercel.app`

The frontend includes a `vercel.json` rewrite so React Router routes keep working on refresh.

### Backend on Vercel

- Root directory: `backend`
- important env vars:
  - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - provider key variables for Gemini or OpenAI

The backend includes:

- `backend/api/index.ts` as the Vercel function entry
- `backend/vercel.json` to route requests to the API function
- `.js` ESM import paths for Vercel runtime compatibility

### Supabase production settings

Add the production callback URL in Supabase Auth:

- `https://your-frontend-domain.vercel.app/auth/callback`

If you use a custom domain, add that exact callback URL too.

## Database And Supabase Notes

Supabase stores:

- user profiles
- assignment inputs
- generated explanation records

The migration in `supabase/migrations` sets up:

- table structure
- relationships
- row-level access rules

`shared/src/database.ts` mirrors the database schema so the app can use typed queries across packages.

## Current Product Notes

- Email verification is part of the intended MVP flow and should stay enabled.
- Failed and refused generations are still saved so users can see the outcome in history.
- The history and result pages now show real fetch errors instead of silently looking empty.
- The backend guards authenticated routes independently of the frontend.
- The app is built to guide student thinking and planning, not generate final coursework for submission.

---

Built with the warmth of `Sand`, the clarity of `Ink`, and the energy of `Accent`.
