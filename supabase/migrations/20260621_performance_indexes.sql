-- ============================================================
-- Migration: Performance indexes for 1,000+ user scale
-- Date: 2026-06-21
-- Purpose: Add missing indexes on all hot query paths.
--          Without these, every query past ~200 users will
--          result in full table scans, causing slow dashboards,
--          leaderboard timeouts, and safeguarding flag delays.
-- ============================================================

-- ---- profiles -----------------------------------------------
-- Used by leaderboard (by county), auth lookup, and DSL dashboard
CREATE INDEX IF NOT EXISTS idx_profiles_county
  ON profiles (county);

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON profiles (role);

CREATE INDEX IF NOT EXISTS idx_profiles_points
  ON profiles (points DESC);

-- ---- point_transactions ------------------------------------
-- Audit log — queried per user frequently
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id
  ON point_transactions (user_id);

CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at
  ON point_transactions (created_at DESC);

-- ---- user_module_progress ----------------------------------
-- Queried per user on dashboard and learn page
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_id
  ON user_module_progress (user_id);

-- ---- mood_logs ---------------------------------------------
-- Queried per user with date filter
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id_date
  ON mood_logs (user_id, log_date DESC);

-- ---- ai_conversations --------------------------------------
-- Queried per user, ordered by time
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id
  ON ai_conversations (user_id);

-- ---- circle_responses --------------------------------------
-- Filtered by circle_id (= county) and week — critical for circles feature
CREATE INDEX IF NOT EXISTS idx_circle_responses_circle_id
  ON circle_responses (circle_id);

CREATE INDEX IF NOT EXISTS idx_circle_responses_user_id
  ON circle_responses (user_id);

CREATE INDEX IF NOT EXISTS idx_circle_responses_week
  ON circle_responses (circle_id, week_number DESC);

-- ---- safeguarding_flags ------------------------------------
-- DSL dashboard reads these; status filter is critical
CREATE INDEX IF NOT EXISTS idx_safeguarding_flags_user_id
  ON safeguarding_flags (user_id);

CREATE INDEX IF NOT EXISTS idx_safeguarding_flags_status
  ON safeguarding_flags (status);

CREATE INDEX IF NOT EXISTS idx_safeguarding_flags_category
  ON safeguarding_flags (category);

-- ---- mentor_matches ----------------------------------------
-- Checked on every Mentor page load and dashboard
CREATE INDEX IF NOT EXISTS idx_mentor_matches_student_id
  ON mentor_matches (student_id);

CREATE INDEX IF NOT EXISTS idx_mentor_matches_mentor_id
  ON mentor_matches (mentor_id);

CREATE INDEX IF NOT EXISTS idx_mentor_matches_status
  ON mentor_matches (student_id, status);

-- ---- mentor_sessions ---------------------------------------
-- mentor_sessions links to users via match_id → mentor_matches
-- (no direct mentee_id/mentor_id columns on this table)
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_match_id
  ON mentor_sessions (match_id);

CREATE INDEX IF NOT EXISTS idx_mentor_sessions_scheduled_at
  ON mentor_sessions (match_id, scheduled_at DESC);

-- ---- goals -------------------------------------------------
-- Queried per user per week
CREATE INDEX IF NOT EXISTS idx_goals_user_week
  ON goals (user_id, week_number DESC);

-- ---- opportunities -----------------------------------------
-- Filtered by county, age, gender — personalisation queries
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline
  ON opportunities (deadline ASC);

-- ---- mentor_profiles ---------------------------------------
-- Browse page filters by is_verified and is_featured
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_verified
  ON mentor_profiles (is_verified);

CREATE INDEX IF NOT EXISTS idx_mentor_profiles_featured
  ON mentor_profiles (is_featured, featured_at DESC)
  WHERE is_featured = true;

-- ---- mentor_nudges -----------------------------------------
-- Dashboard reads unread nudges; filtered by read_at IS NULL
CREATE INDEX IF NOT EXISTS idx_mentor_nudges_read_at
  ON mentor_nudges (read_at)
  WHERE read_at IS NULL;

-- ============================================================
-- Leaderboard optimisation: partial index for top county scores
-- The leaderboard query: SELECT * FROM profiles WHERE county = $1
-- ORDER BY points DESC LIMIT 20  → benefits hugely from this
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_county_points
  ON profiles (county, points DESC);
