-- Migration 006: Allow guest users to view mentors
-- This enables public discovery of mentors even for users who aren't logged in.

-- 1. Enable RLS on mentor_profiles (if not already enabled)
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Add policy to allow ANYONE to see verified mentor profiles
DROP POLICY IF EXISTS "Anyone can view verified mentor profiles" ON mentor_profiles;
CREATE POLICY "Anyone can view verified mentor profiles" 
  ON mentor_profiles FOR SELECT 
  USING (is_verified = true);

-- 3. Update profiles table RLS to allow guest users to see names/counties of MENTORS
DROP POLICY IF EXISTS "Anyone can view mentor basic info" ON profiles;
CREATE POLICY "Anyone can view mentor basic info" 
  ON profiles FOR SELECT 
  USING (role = 'mentor');
