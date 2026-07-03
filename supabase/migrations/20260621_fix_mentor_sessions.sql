-- ============================================================
-- Migration: Fix mentor_sessions schema drift
-- Date: 2026-06-21
-- The app expects mentor_sessions to have: status, title,
-- mentor_id, mentee_id. The actual DB only has match_id.
-- This migration adds the missing columns.
-- ============================================================

ALTER TABLE mentor_sessions
  ADD COLUMN IF NOT EXISTS mentor_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS mentee_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status     TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  ADD COLUMN IF NOT EXISTS title      TEXT DEFAULT 'Mentoring Session';

-- Backfill mentor_id and mentee_id from mentor_matches for existing rows
UPDATE mentor_sessions ms
SET
  mentor_id = mm.mentor_id,
  mentee_id = mm.student_id
FROM mentor_matches mm
WHERE ms.match_id = mm.id
  AND (ms.mentor_id IS NULL OR ms.mentee_id IS NULL);

-- Index the new columns for dashboard queries
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentee_status
  ON mentor_sessions (mentee_id, status, scheduled_at DESC);

CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentor_id
  ON mentor_sessions (mentor_id);
