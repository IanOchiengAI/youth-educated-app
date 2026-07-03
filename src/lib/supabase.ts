import { createClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// In production, fail loudly if env vars are missing
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    '🚨 FATAL: Supabase credentials missing in production!\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (e.g. Vercel dashboard).'
  )
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials missing! Copy .env.example to .env:\n' +
    '  cp .env.example .env\n' +
    'The app will run in offline/limited mode until configured.'
  )
}

// Use a safe placeholder URL when env vars are missing to prevent createClient from crashing (dev only)
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyBwbGFjZWhvbGRlciB9'

const isNative = Capacitor.isNativePlatform()

export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY,
  {
    auth: {
      // On native Android the WebView URL is always https://localhost — never contains
      // OAuth tokens. Disabling URL detection prevents Supabase from accidentally
      // clearing an in-flight PKCE session when the app resumes after OAuth redirect.
      detectSessionInUrl: !isNative,
      // Keep PKCE (the default) — it is safe on native because both signInWithOAuth
      // and exchangeCodeForSession run in the same WebView storage context.
      flowType: 'pkce',
    }
  }
)

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
