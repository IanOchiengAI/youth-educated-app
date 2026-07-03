-- Pilot-readiness hardening for student -> mentor connection requests.
--
-- Guarantees:
-- - Students can create only their own pending request to a verified mentor.
-- - Students can read only their own matches.
-- - Mentors can read/update only matches assigned to them.
-- - Non-admin callers cannot change match participants after creation.
-- - Admin/DSL users can audit matches.

ALTER TABLE mentor_matches ENABLE ROW LEVEL SECURITY;

ALTER TABLE mentor_matches
  ADD COLUMN IF NOT EXISTS jabari_goals TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS jabari_agenda TEXT DEFAULT '';

ALTER TABLE mentor_matches
  DROP CONSTRAINT IF EXISTS mentor_matches_status_check,
  ADD CONSTRAINT mentor_matches_status_check
    CHECK (status IN ('pending', 'active', 'ended'));

CREATE UNIQUE INDEX IF NOT EXISTS uq_mentor_matches_one_open_per_student
  ON mentor_matches (student_id)
  WHERE status IN ('pending', 'active');

CREATE OR REPLACE FUNCTION public.is_verified_mentor(mentor_profile_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.mentor_profiles mp
    JOIN public.profiles p ON p.id = mp.id
    WHERE mp.id = mentor_profile_id
      AND mp.is_verified = true
      AND p.role::text = 'mentor'
  );
$$;

REVOKE ALL ON FUNCTION public.is_verified_mentor(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_verified_mentor(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_mentor_match_participant_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_role text;
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role::text
  INTO requester_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF COALESCE(requester_role, 'student') <> 'admin'
    AND (
      NEW.student_id IS DISTINCT FROM OLD.student_id
      OR NEW.mentor_id IS DISTINCT FROM OLD.mentor_id
    )
  THEN
    RAISE EXCEPTION 'Only admins can change mentor match participants';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_mentor_match_participant_change_update ON mentor_matches;
CREATE TRIGGER prevent_mentor_match_participant_change_update
  BEFORE UPDATE ON mentor_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_mentor_match_participant_change();

DROP POLICY IF EXISTS "Students can create own mentor requests" ON mentor_matches;
DROP POLICY IF EXISTS "Students can insert own mentor request" ON mentor_matches;
DROP POLICY IF EXISTS "Student can create own pending mentor request" ON mentor_matches;
CREATE POLICY "Students can create own mentor requests"
  ON mentor_matches
  FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    AND status = 'pending'
    AND public.is_verified_mentor(mentor_id)
  );

DROP POLICY IF EXISTS "Students can read own mentor matches" ON mentor_matches;
CREATE POLICY "Students can read own mentor matches"
  ON mentor_matches
  FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Mentor sees own pending matches" ON mentor_matches;
DROP POLICY IF EXISTS "Mentors can read own mentor matches" ON mentor_matches;
CREATE POLICY "Mentors can read own mentor matches"
  ON mentor_matches
  FOR SELECT
  USING (auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Mentor can update own match status" ON mentor_matches;
DROP POLICY IF EXISTS "Mentors can update own mentor matches" ON mentor_matches;
CREATE POLICY "Mentors can update own mentor matches"
  ON mentor_matches
  FOR UPDATE
  USING (auth.uid() = mentor_id)
  WITH CHECK (
    auth.uid() = mentor_id
    AND status IN ('pending', 'active', 'ended')
  );

DROP POLICY IF EXISTS "Admins and DSL can read mentor matches" ON mentor_matches;
CREATE POLICY "Admins and DSL can read mentor matches"
  ON mentor_matches
  FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "Admins can update mentor matches" ON mentor_matches;
CREATE POLICY "Admins can update mentor matches"
  ON mentor_matches
  FOR UPDATE
  USING (public.current_user_has_role(ARRAY['admin']))
  WITH CHECK (public.current_user_has_role(ARRAY['admin']));
