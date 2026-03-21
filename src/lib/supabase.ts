import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials missing! Copy .env.example to .env:\n' +
    '  cp .env.example .env\n' +
    'The app will run in offline/limited mode until configured.'
  )
}

// Use a safe placeholder URL when env vars are missing to prevent createClient from crashing
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyBwbGFjZWhvbGRlciB9'

export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY
)
