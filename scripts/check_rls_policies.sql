-- Check RLS policies for athletes table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

-- 1. Check if RLS is enabled on athletes table
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'athletes';

-- 2. List all policies on athletes table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'athletes';

-- 3. Check athletes table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'athletes'
ORDER BY ordinal_position;

-- 4. Expected policies for athletes table (if missing, run Step 1d to create them):
--
-- Policy 1: "Users can read own athlete profile"
--   Command: SELECT
--   Using: (user_id = auth.uid())
--
-- Policy 2: "Users can insert own athlete profile"
--   Command: INSERT
--   Check: (user_id = auth.uid())
--
-- Policy 3: "Users can update own athlete profile"
--   Command: UPDATE
--   Using: (user_id = auth.uid())
--   Check: (user_id = auth.uid())
--
-- Policy 4: "Users can delete own athlete profile"
--   Command: DELETE
--   Using: (user_id = auth.uid())
