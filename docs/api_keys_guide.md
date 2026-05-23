# 🔑 API Keys Guide for Local Development

Since committing real API keys into GitHub is a security risk, the `.env.example` file contains placeholders. To run the app locally, you need Supabase public browser keys in `.env`. AI and premium TTS secrets belong only in Supabase Edge Function secrets.

Here is exactly how to do it:

## 1. Get Your Supabase Keys
Supabase powers the App's user accounts, profiles, and database syncing.

1. Go to [supabase.com](https://supabase.com/) and create a free account or log in.
2. Click **New Project** and assign it a name like `youth-educated-dev`.
3. Once the project dashboard loads, look for the **Project API** section on the home page.
4. Copy the **Project URL** and paste it into your local `.env` file as `VITE_SUPABASE_URL`.
5. Copy the **Project API Key (anon/public)** and paste it into your `.env` file as `VITE_SUPABASE_ANON_KEY`.
6. **Important Setup:** Go to the SQL Editor in your Supabase dashboard and run the entire script found in `supabase_schema.sql`. This will instantly create all the necessary tables and rules for the app.

## 2. Configure AI and TTS Edge Function Secrets

Set provider secrets in Supabase, not in `.env`:

```bash
npx supabase secrets set GEMINI_API_KEY=your_gemini_key
npx supabase secrets set ELEVENLABS_API_KEY=your_elevenlabs_key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
npx supabase secrets set FOLLOWUP_CRON_SECRET=your_long_random_cron_secret
```

Save your `.env` file, run `npm run dev`, and deploy Edge Functions with `npm run deploy:edge` when provider-backed features change.
