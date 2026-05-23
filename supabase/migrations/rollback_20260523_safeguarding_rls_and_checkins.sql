-- Manual rollback for 20260523_safeguarding_rls_and_checkins.sql.
-- Use only if the safety migration causes production issues.

DROP POLICY IF EXISTS "Users can insert own safeguarding flags" ON safeguarding_flags;
DROP POLICY IF EXISTS "DSL and Admin can update flags" ON safeguarding_flags;

CREATE POLICY "Users cannot view safeguarding flags"
  ON safeguarding_flags FOR ALL TO PUBLIC
  USING (FALSE);

ALTER TABLE safeguarding_flags
  DROP CONSTRAINT IF EXISTS safeguarding_flags_category_check;

ALTER TABLE safeguarding_flags
  DROP CONSTRAINT IF EXISTS safeguarding_flags_status_check;

ALTER TABLE safeguarding_flags
  DROP COLUMN IF EXISTS source;

DROP POLICY IF EXISTS "DSLs can view flagged checkins" ON jabari_checkins;

ALTER TABLE jabari_checkins
  DROP CONSTRAINT IF EXISTS jabari_checkins_pair_id_fkey,
  ADD CONSTRAINT jabari_checkins_pair_id_fkey
    FOREIGN KEY (pair_id) REFERENCES mentor_matches(id) ON DELETE CASCADE;

ALTER TABLE jabari_checkins
  ALTER COLUMN pair_id SET NOT NULL;

ALTER TABLE jabari_checkins
  ALTER COLUMN safeguarding_flag DROP DEFAULT;

ALTER TABLE jabari_checkins
  ALTER COLUMN safeguarding_flag TYPE TEXT
  USING CASE WHEN safeguarding_flag THEN 'A' ELSE NULL END;

ALTER TABLE jabari_checkins
  ADD CONSTRAINT jabari_checkins_safeguarding_flag_check
    CHECK (safeguarding_flag IS NULL OR safeguarding_flag IN ('A', 'B', 'C'));

CREATE POLICY "DSLs can view flagged checkins"
  ON jabari_checkins FOR SELECT
  USING (
    safeguarding_flag IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'dsl'
    )
  );
