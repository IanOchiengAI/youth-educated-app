-- ── Article Reactions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS article_reactions (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id  TEXT NOT NULL,
  reaction    TEXT NOT NULL CHECK (reaction IN ('helpful', 'not_helpful')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, article_id)
);
ALTER TABLE article_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reactions"
  ON article_reactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated read reactions"
  ON article_reactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── Mentor Reports ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentor_reports (
  id               BIGSERIAL PRIMARY KEY,
  reporter_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason           TEXT NOT NULL,
  details          TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE mentor_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reporter can insert"
  ON mentor_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admin/DSL read all reports"
  ON mentor_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'dsl')
    )
  );
CREATE POLICY "Admin/DSL update status"
  ON mentor_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'dsl')
    )
  );

-- ── Circle Post Reports ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_reports (
  id            BIGSERIAL PRIMARY KEY,
  reporter_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  response_id   BIGINT NOT NULL,
  reason        TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE circle_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reporter can insert circle report"
  ON circle_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admin/DSL read circle reports"
  ON circle_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'dsl')
    )
  );
