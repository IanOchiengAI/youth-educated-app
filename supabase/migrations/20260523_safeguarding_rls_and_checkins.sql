-- Fix safeguarding writes and Jabari check-in schema drift.
-- Run before deploying frontend changes that depend on these policies.

ALTER TABLE safeguarding_flags
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'chat';

ALTER TABLE safeguarding_flags
  DROP CONSTRAINT IF EXISTS safeguarding_flags_category_check,
  ADD CONSTRAINT safeguarding_flags_category_check CHECK (category IN ('A', 'B', 'C'));

ALTER TABLE safeguarding_flags
  DROP CONSTRAINT IF EXISTS safeguarding_flags_status_check,
  ADD CONSTRAINT safeguarding_flags_status_check CHECK (status IN ('pending', 'reviewed', 'resolved'));

DROP POLICY IF EXISTS "Users cannot view safeguarding flags" ON safeguarding_flags;
DROP POLICY IF EXISTS "Users can insert own safeguarding flags" ON safeguarding_flags;
DROP POLICY IF EXISTS "DSL and Admin can update flags" ON safeguarding_flags;

CREATE POLICY "Users can insert own safeguarding flags"
  ON safeguarding_flags FOR INSERT
  WITH CHECK (auth.uid() = user_id AND category IN ('A', 'B', 'C'));

CREATE POLICY "DSL and Admin can update flags"
  ON safeguarding_flags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'dsl')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'dsl')
    )
  );

DROP POLICY IF EXISTS "DSLs can view flagged checkins" ON jabari_checkins;

ALTER TABLE jabari_checkins
  ALTER COLUMN pair_id DROP NOT NULL;

ALTER TABLE jabari_checkins
  DROP CONSTRAINT IF EXISTS jabari_checkins_pair_id_fkey,
  ADD CONSTRAINT jabari_checkins_pair_id_fkey
    FOREIGN KEY (pair_id) REFERENCES mentor_matches(id) ON DELETE SET NULL;

ALTER TABLE jabari_checkins
  DROP CONSTRAINT IF EXISTS jabari_checkins_safeguarding_flag_check;

ALTER TABLE jabari_checkins
  ALTER COLUMN safeguarding_flag TYPE BOOLEAN
  USING COALESCE(safeguarding_flag IN ('A', 'B', 'C', 'true'), FALSE);

ALTER TABLE jabari_checkins
  ALTER COLUMN safeguarding_flag SET DEFAULT FALSE;

CREATE POLICY "DSLs can view flagged checkins"
  ON jabari_checkins FOR SELECT
  USING (
    safeguarding_flag = TRUE
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'dsl'
    )
  );
