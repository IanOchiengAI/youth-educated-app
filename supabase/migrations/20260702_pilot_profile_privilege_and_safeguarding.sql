-- Pilot-readiness hardening:
-- - A signed-in user may create/update their own onboarding profile, but cannot
--   self-promote role or premium entitlement through the public API.
-- - All safeguarding categories, including D, can be recorded as redacted flags.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

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

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role::text
  FROM public.profiles
  WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND COALESCE(role::text, 'student') = 'student'
    AND COALESCE(is_premium, false) = false
  );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND COALESCE(role::text, 'student') = COALESCE(public.current_user_role(), 'student')
  );

CREATE OR REPLACE FUNCTION public.prevent_self_profile_privilege_escalation()
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

  IF COALESCE(requester_role, 'student') <> 'admin' THEN
    IF TG_OP = 'INSERT' AND COALESCE(NEW.role::text, 'student') <> 'student' THEN
      RAISE EXCEPTION 'Only admins can assign privileged roles';
    END IF;

    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_premium, false) <> false THEN
      RAISE EXCEPTION 'Only admins can assign premium entitlement';
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Only admins can change profile roles';
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
      RAISE EXCEPTION 'Only admins can change premium entitlement';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_self_profile_privilege_escalation_insert ON profiles;
CREATE TRIGGER prevent_self_profile_privilege_escalation_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_profile_privilege_escalation();

DROP TRIGGER IF EXISTS prevent_self_profile_privilege_escalation_update ON profiles;
CREATE TRIGGER prevent_self_profile_privilege_escalation_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_profile_privilege_escalation();

ALTER TABLE safeguarding_flags
  DROP CONSTRAINT IF EXISTS safeguarding_flags_category_check,
  ADD CONSTRAINT safeguarding_flags_category_check CHECK (category IN ('A', 'B', 'C', 'D'));

DROP POLICY IF EXISTS "Users can insert own safeguarding flags" ON safeguarding_flags;
CREATE POLICY "Users can insert own safeguarding flags"
  ON safeguarding_flags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND category IN ('A', 'B', 'C', 'D'));
