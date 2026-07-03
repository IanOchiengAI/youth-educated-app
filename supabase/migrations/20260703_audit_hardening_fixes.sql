-- ============================================================
-- Migration: Expanded Security Hardening Fixes
-- Date: 2026-07-03
-- Author: Evelyn "Evie" Vance
-- ============================================================

-- 1. Profiles Onboarding and Updates Privilege check
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
    -- Check INSERTs
    IF TG_OP = 'INSERT' AND COALESCE(NEW.role::text, 'student') <> 'student' THEN
      RAISE EXCEPTION 'Only admins can assign privileged roles';
    END IF;

    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_premium, false) <> false THEN
      RAISE EXCEPTION 'Only admins can assign premium entitlement';
    END IF;

    -- Check UPDATEs
    IF TG_OP = 'UPDATE' THEN
      -- Role updates
      IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Allow verified mentors to switch their own profile role between student and mentor
        IF NEW.id = auth.uid() 
           AND ((OLD.role = 'student'::role_type AND NEW.role = 'mentor'::role_type) OR (OLD.role = 'mentor'::role_type AND NEW.role = 'student'::role_type))
           AND EXISTS (SELECT 1 FROM public.mentor_profiles WHERE id = NEW.id AND is_verified = true)
        THEN
          -- Switch is permitted
          NULL;
        ELSE
          RAISE EXCEPTION 'Only admins can change profile roles';
        END IF;
      END IF;

      -- Premium updates
      IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
        RAISE EXCEPTION 'Only admins can change premium entitlement';
      END IF;

      -- Points tempering validation (allow at most 200 points increment per update)
      IF NEW.points IS DISTINCT FROM OLD.points THEN
        IF NEW.points < OLD.points THEN
          RAISE EXCEPTION 'Points cannot decrease';
        ELSIF NEW.points - OLD.points > 200 THEN
          RAISE EXCEPTION 'Invalid points increment: cannot add more than 200 points in a single transaction';
        END IF;
      END IF;

      -- Weekly points tempering validation (allow resets, but limit increments to 200)
      IF NEW.weekly_points IS DISTINCT FROM OLD.weekly_points THEN
        IF NEW.weekly_points < 0 THEN
          RAISE EXCEPTION 'Weekly points cannot be negative';
        ELSIF NEW.weekly_points > OLD.weekly_points AND NEW.weekly_points - OLD.weekly_points > 200 THEN
          RAISE EXCEPTION 'Invalid weekly points increment: cannot add more than 200 points in a single transaction';
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Access Flags Trigger Hardening (runs on any INSERT or UPDATE on profiles)
DROP TRIGGER IF EXISTS tr_set_access_flags ON profiles;
CREATE TRIGGER tr_set_access_flags
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_access_flags();

-- 3. Mentor Matches student update RLS (allow disconnects)
DROP POLICY IF EXISTS "Students can update own mentor matches" ON mentor_matches;
CREATE POLICY "Students can update own mentor matches"
  ON mentor_matches
  FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (
    auth.uid() = student_id
    AND status = 'ended'
  );

-- 4. Mentor Sessions RLS & Triggers
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert mentor sessions for their matches" ON mentor_sessions;
CREATE POLICY "Users can insert mentor sessions for their matches"
  ON mentor_sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = match_id
        AND auth.uid() IN (mm.student_id, mm.mentor_id)
        AND mm.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users can update mentor sessions for their matches" ON mentor_sessions;
CREATE POLICY "Users can update mentor sessions for their matches"
  ON mentor_sessions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = match_id
        AND auth.uid() IN (mm.student_id, mm.mentor_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = match_id
        AND auth.uid() IN (mm.student_id, mm.mentor_id)
    )
  );

CREATE OR REPLACE FUNCTION public.check_mentor_session_update()
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

  -- Freeze IDs
  IF OLD.match_id IS DISTINCT FROM NEW.match_id THEN
    RAISE EXCEPTION 'match_id cannot be changed';
  END IF;
  IF OLD.mentor_id IS DISTINCT FROM NEW.mentor_id THEN
    RAISE EXCEPTION 'mentor_id cannot be changed';
  END IF;
  IF OLD.mentee_id IS DISTINCT FROM NEW.mentee_id THEN
    RAISE EXCEPTION 'mentee_id cannot be changed';
  END IF;

  -- Students can only set status to 'cancelled'
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = OLD.match_id AND mm.student_id = auth.uid()
    ) AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Students can only cancel sessions';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_mentor_session_update ON mentor_sessions;
CREATE TRIGGER tr_check_mentor_session_update
  BEFORE UPDATE ON mentor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_mentor_session_update();

-- 5. Session Ratings RLS gate
DROP POLICY IF EXISTS "Users can insert session ratings" ON session_ratings;
DROP POLICY IF EXISTS "Users can insert session ratings for their matches" ON session_ratings;
CREATE POLICY "Users can insert session ratings for their matches"
  ON session_ratings
  FOR INSERT
  WITH CHECK (
    auth.uid() = rater_id
    AND EXISTS (
      SELECT 1 FROM public.mentor_sessions ms
      JOIN public.mentor_matches mm ON ms.match_id = mm.id
      WHERE ms.id = session_id
        AND auth.uid() IN (mm.student_id, mm.mentor_id)
    )
  );

-- 6. Nudge Integrity trigger
CREATE OR REPLACE FUNCTION public.check_mentor_nudge_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Freeze IDs
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'id cannot be changed';
  END IF;
  IF OLD.mentor_id IS DISTINCT FROM NEW.mentor_id THEN
    RAISE EXCEPTION 'mentor_id cannot be changed';
  END IF;
  IF OLD.pair_id IS DISTINCT FROM NEW.pair_id THEN
    RAISE EXCEPTION 'pair_id cannot be changed';
  END IF;
  IF OLD.message IS DISTINCT FROM NEW.message THEN
    RAISE EXCEPTION 'message cannot be changed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_mentor_nudge_update ON mentor_nudges;
CREATE TRIGGER tr_check_mentor_nudge_update
  BEFORE UPDATE ON mentor_nudges
  FOR EACH ROW
  EXECUTE FUNCTION public.check_mentor_nudge_update();

-- 7. Circle Response INSERT enforcement
DROP POLICY IF EXISTS "Users can insert own circle response" ON circle_responses;
CREATE POLICY "Users can insert own circle response" ON circle_responses
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND circle_id = (SELECT county FROM public.profiles WHERE id = auth.uid())
  );

-- 8. AI Conversations DSL Read policy check
DROP POLICY IF EXISTS "DSL can view flagged conversations" ON ai_conversations;
CREATE POLICY "DSL can view flagged conversations" ON ai_conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('dsl', 'admin')
    ) AND EXISTS (
      SELECT 1 FROM public.safeguarding_flags sf
      WHERE sf.user_id = ai_conversations.user_id
    )
  );

-- 9. Admin Profile Update policy
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 10. Mentor Profiles RLS Policies (Users & Admins)
DROP POLICY IF EXISTS "Users can select own mentor profile" ON mentor_profiles;
CREATE POLICY "Users can select own mentor profile" ON mentor_profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own mentor profile" ON mentor_profiles;
CREATE POLICY "Users can insert own mentor profile" ON mentor_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can select all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can select all mentor profiles" ON mentor_profiles
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can insert all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can insert all mentor profiles" ON mentor_profiles
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can update all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can update all mentor profiles" ON mentor_profiles
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can delete all mentor profiles" ON mentor_profiles
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

