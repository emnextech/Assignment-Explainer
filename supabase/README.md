# Supabase Notes

1. Create a Supabase project and keep email verification enabled in Auth.
2. Run the SQL in `migrations/202603210001_init_assignment_explainer.sql`.
3. Set the frontend to use the anon key and the backend to use the service role key.
4. Add `http://localhost:5173/auth/callback` and your production callback URL under Auth -> URL Configuration.
5. Paste the HTML files in `email-templates/` into Supabase Auth -> Email Templates for signup confirmation, password recovery, and email change.
6. If you want generated database types later, run:
   - `supabase gen types typescript --project-id <project-ref> --schema public > shared/src/database.ts`
