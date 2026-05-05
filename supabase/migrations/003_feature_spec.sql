-- 003_feature_spec.sql
-- Feature spec migration: featured mentors, nudges, ratings, session types

-- mentor_profiles additions
ALTER TABLE mentor_profiles
  ADD COLUMN IF NOT EXISTS is_featured     BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS featured_quote  TEXT,
  ADD COLUMN IF NOT EXISTS is_available    BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS field_category  TEXT,
  ADD COLUMN IF NOT EXISTS today_wisdom    TEXT,
  ADD COLUMN IF NOT EXISTS wisdom_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS availability_days TEXT[];

-- RLS for featured mentor
CREATE POLICY "Public can read featured mentor"
  ON mentor_profiles FOR SELECT
  USING (is_featured = true AND is_verified = true);

-- mentor_nudges table
CREATE TABLE IF NOT EXISTS mentor_nudges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id      UUID REFERENCES mentor_matches(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  read_at      TIMESTAMPTZ,
  response     TEXT
);

ALTER TABLE mentor_nudges ENABLE ROW LEVEL SECURITY;

-- session_ratings table
CREATE TABLE IF NOT EXISTS session_ratings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES mentor_sessions(id),
  rater_id     UUID REFERENCES profiles(id),
  score        INTEGER CHECK (score BETWEEN 1 AND 5),
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE session_ratings ENABLE ROW LEVEL SECURITY;

-- mentor_sessions addition
ALTER TABLE mentor_sessions
  ADD COLUMN IF NOT EXISTS student_commitment TEXT,
  ADD COLUMN IF NOT EXISTS session_type TEXT DEFAULT 'standard';
