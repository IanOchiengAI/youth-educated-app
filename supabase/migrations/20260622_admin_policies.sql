-- Migration: Allow Admins to manage roles and mentor profiles
-- Enables complete admin dashboard operations for changing roles, approving, rejecting, and deleting mentor profiles.

-- Profiles: Admin UPDATE policy
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Mentor Profiles: Admin SELECT/INSERT/UPDATE/DELETE policies
DROP POLICY IF EXISTS "Admins can view all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can view all mentor profiles"
  ON mentor_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can insert mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can insert mentor profiles"
  ON mentor_profiles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can update all mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can update all mentor profiles"
  ON mentor_profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete mentor profiles" ON mentor_profiles;
CREATE POLICY "Admins can delete mentor profiles"
  ON mentor_profiles FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
