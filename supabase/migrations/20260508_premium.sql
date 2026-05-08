-- Add is_premium column to profiles for freemium gating
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
