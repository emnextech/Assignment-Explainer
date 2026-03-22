# Auth Email Templates

Paste these HTML templates into Supabase Dashboard -> Authentication -> Email Templates.

Recommended mapping:

- Confirm signup: `confirm-signup.html`
- Reset password: `reset-password.html`
- Change email address: `change-email.html`

Recommended Auth URL settings:

- Site URL: your deployed frontend URL
- Additional redirect URLs:
  - `http://localhost:5173/auth/callback`
  - `https://your-production-domain/auth/callback`

The frontend now expects auth links to return through `/auth/callback`, then routes users to either the dashboard or reset-password screen.
