-- Allow newly authenticated users to create their own profile row.
-- The auth trigger normally creates this row, but Google OAuth onboarding should
-- not get stuck if the trigger is missing, delayed, or was not applied.
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
