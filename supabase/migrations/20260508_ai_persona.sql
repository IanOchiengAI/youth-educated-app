-- Add ai_persona to profiles so users can choose between Jabari (male) and Amara (female) AI companion.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS ai_persona TEXT DEFAULT 'amara'
  CHECK (ai_persona IN ('amara', 'jabari'));
