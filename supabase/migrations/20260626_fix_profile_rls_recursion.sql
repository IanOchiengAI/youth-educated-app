-- Fix recursive RLS checks on profiles.
-- Policies on profiles cannot query profiles directly without causing
-- "infinite recursion detected in policy for relation profiles".

CREATE OR REPLACE FUNCTION public.current_user_has_role(allowed_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role::text = ANY (allowed_roles)
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_has_role(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_has_role(text[]) TO anon, authenticated;

DROP POLICY IF EXISTS "Admins/DSL can view all profiles" ON profiles;
CREATE POLICY "Admins/DSL can view all profiles"
  ON profiles FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (public.current_user_has_role(ARRAY['admin']))
  WITH CHECK (public.current_user_has_role(ARRAY['admin']));

DROP POLICY IF EXISTS "Admins can view all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can view all mentor profiles"
  ON mentor_profiles FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin']));

DROP POLICY IF EXISTS "Admins can insert mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can insert mentor profiles"
  ON mentor_profiles FOR INSERT
  WITH CHECK (public.current_user_has_role(ARRAY['admin']));

DROP POLICY IF EXISTS "Admins can update all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can update all mentor profiles"
  ON mentor_profiles FOR UPDATE
  USING (public.current_user_has_role(ARRAY['admin']))
  WITH CHECK (public.current_user_has_role(ARRAY['admin']));

DROP POLICY IF EXISTS "Admins can delete mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can delete mentor profiles"
  ON mentor_profiles FOR DELETE
  USING (public.current_user_has_role(ARRAY['admin']));

DROP POLICY IF EXISTS "DSL and Admin only view cases" ON safeguarding_cases;
CREATE POLICY "DSL and Admin only view cases"
  ON safeguarding_cases FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "DSL and Admin only view flags" ON safeguarding_flags;
CREATE POLICY "DSL and Admin only view flags"
  ON safeguarding_flags FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "DSL and Admin can update flags" ON safeguarding_flags;
CREATE POLICY "DSL and Admin can update flags"
  ON safeguarding_flags FOR UPDATE
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']))
  WITH CHECK (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "DSL can view flagged conversations" ON ai_conversations;
CREATE POLICY "DSL can view flagged conversations"
  ON ai_conversations FOR SELECT
  USING (safeguarding_flagged = true AND public.current_user_has_role(ARRAY['dsl']));

DROP POLICY IF EXISTS "Admins can view analytics" ON analytics_events;
CREATE POLICY "Admins can view analytics"
  ON analytics_events FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin']));

DROP POLICY IF EXISTS "Admin/DSL read all reports" ON mentor_reports;
CREATE POLICY "Admin/DSL read all reports"
  ON mentor_reports FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "Admin/DSL update status" ON mentor_reports;
CREATE POLICY "Admin/DSL update status"
  ON mentor_reports FOR UPDATE
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']))
  WITH CHECK (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "Admin/DSL read circle reports" ON circle_reports;
CREATE POLICY "Admin/DSL read circle reports"
  ON circle_reports FOR SELECT
  USING (public.current_user_has_role(ARRAY['admin', 'dsl']));

DROP POLICY IF EXISTS "DSLs can view flagged checkins" ON jabari_checkins;
CREATE POLICY "DSLs can view flagged checkins"
  ON jabari_checkins FOR SELECT
  USING (
    safeguarding_flag = TRUE
    AND public.current_user_has_role(ARRAY['dsl'])
  );
