-- Fix RLS policies for athletes table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

-- Enable RLS on athletes table (if not already enabled)
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Users can read own athlete profile" ON athletes;
DROP POLICY IF EXISTS "Users can insert own athlete profile" ON athletes;
DROP POLICY IF EXISTS "Users can update own athlete profile" ON athletes;
DROP POLICY IF EXISTS "Users can delete own athlete profile" ON athletes;

-- Policy 1: Users can SELECT their own athlete profile
CREATE POLICY "Users can read own athlete profile"
  ON athletes
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: Users can INSERT their own athlete profile
CREATE POLICY "Users can insert own athlete profile"
  ON athletes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy 3: Users can UPDATE their own athlete profile
CREATE POLICY "Users can update own athlete profile"
  ON athletes
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy 4: Users can DELETE their own athlete profile
CREATE POLICY "Users can delete own athlete profile"
  ON athletes
  FOR DELETE
  USING (user_id = auth.uid());

-- Verify policies were created
SELECT
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'athletes';

-- Success message
SELECT '✅ RLS policies for athletes table have been fixed!' as result;
