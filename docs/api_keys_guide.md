# 🔑 API Keys Guide for Local Development

Since committing real API keys into GitHub is a security risk, the `.env.example` file contains placeholders. To run the app locally, you will need to generate your own free keys for **Supabase** (Database & Auth) and **Google Gemini** (Jabari AI).

Here is exactly how to do it:

## 1. Get Your Supabase Keys
Supabase powers the App's user accounts, profiles, and database syncing.

1. Go to [supabase.com](https://supabase.com/) and create a free account or log in.
2. Click **New Project** and assign it a name like `youth-educated-dev`.
3. Once the project dashboard loads, look for the **Project API** section on the home page.
4. Copy the **Project URL** and paste it into your local `.env` file as `VITE_SUPABASE_URL`.
5. Copy the **Project API Key (anon/public)** and paste it into your `.env` file as `VITE_SUPABASE_ANON_KEY`.
6. **Important Setup:** Go to the SQL Editor in your Supabase dashboard and run the entire script found in `supabase_schema.sql`. This will instantly create all the necessary tables and rules for the app.

## 2. Get Your Google Gemini Key
Gemini 2.0 Flash is the brain behind the Jabari AI Mentor.

1. Go to Google AI Studio at [aistudio.google.com](https://aistudio.google.com/).
2. Sign in with your Google account.
3. On the left sidebar, click **Get API Key**.
4. Click the blue **Create API Key** button.
5. Copy the generated string.
6. Paste it into your `.env` file as `VITE_GEMINI_API_KEY`.

That's it! Save your `.env` file, run `npm run dev`, and everything will run perfectly.
