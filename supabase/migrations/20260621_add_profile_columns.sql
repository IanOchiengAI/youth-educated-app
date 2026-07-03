-- ============================================================
-- Migration: Add missing profile columns
-- Date: 2026-06-21
-- jabari_voice is used by TTS voice selection but missing from profiles.
-- weekly_points tracked locally but useful to persist for leaderboard resets.
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS jabari_voice TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS weekly_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekly_points_reset_at DATE DEFAULT CURRENT_DATE;
