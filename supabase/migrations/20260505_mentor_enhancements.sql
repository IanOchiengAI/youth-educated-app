-- Supabase SQL Migration — Run manually in Supabase SQL Editor
-- Run this AFTER all code changes are deployed

-- 1. Add is_available flag to mentor_profiles
ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
UPDATE mentor_profiles SET is_available = true WHERE is_verified = true;

-- 2. Add field_category for quick browsing (denormalised from expertise[0])
ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS field_category TEXT;

-- 3. Ensure mentor_matches has jabari columns (may already exist)
ALTER TABLE mentor_matches ADD COLUMN IF NOT EXISTS jabari_goals TEXT[] DEFAULT '{}';
ALTER TABLE mentor_matches ADD COLUMN IF NOT EXISTS jabari_agenda TEXT DEFAULT '';

-- 4. RLS: mentors can see their own pending requests
CREATE POLICY "Mentor sees own pending matches"
  ON mentor_matches FOR SELECT
  USING (mentor_id = auth.uid());

CREATE POLICY "Mentor can update own match status"
  ON mentor_matches FOR UPDATE
  USING (mentor_id = auth.uid());
