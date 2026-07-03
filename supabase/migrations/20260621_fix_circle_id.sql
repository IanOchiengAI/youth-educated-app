-- ============================================================
-- Migration: Fix circle_responses schema
-- Date: 2026-06-21
-- The app uses county name (text) as circle_id, but the DB
-- has circle_id as UUID FK to the circles table.
-- Fix: Change circle_id to TEXT so county strings work directly.
-- ============================================================

-- Drop policy that depends on circle_id before altering type
DROP POLICY IF EXISTS "Users can select weekly circle responses after submitting" ON circle_responses;

-- Drop the FK constraint first
ALTER TABLE circle_responses
  DROP CONSTRAINT IF EXISTS circle_responses_circle_id_fkey;

-- Change circle_id from UUID to TEXT
ALTER TABLE circle_responses
  ALTER COLUMN circle_id TYPE TEXT USING circle_id::TEXT;

-- Also fix circle_members for consistency
ALTER TABLE circle_members
  DROP CONSTRAINT IF EXISTS circle_members_circle_id_fkey;

ALTER TABLE circle_members
  ALTER COLUMN circle_id TYPE TEXT USING circle_id::TEXT;

-- Re-create the policy now that the type has changed
CREATE POLICY "Users can select weekly circle responses after submitting" ON circle_responses FOR SELECT
  USING (EXISTS (SELECT 1 FROM circle_responses cr WHERE cr.user_id = auth.uid() AND cr.circle_id = circle_responses.circle_id AND cr.week_number = circle_responses.week_number));

-- Re-index circle_responses on the now-text circle_id
DROP INDEX IF EXISTS idx_circle_responses_circle_id;
CREATE INDEX IF NOT EXISTS idx_circle_responses_circle_id
  ON circle_responses (circle_id);

CREATE INDEX IF NOT EXISTS idx_circle_responses_week
  ON circle_responses (circle_id, week_number DESC);

-- Ensure week_number column exists
ALTER TABLE circle_responses
  ADD COLUMN IF NOT EXISTS week_number INTEGER;
