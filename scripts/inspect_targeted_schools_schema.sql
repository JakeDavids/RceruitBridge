-- Inspect current targeted_schools table structure and policies
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

-- 1. Check table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'targeted_schools'
ORDER BY ordinal_position;

-- 2. Check constraints (primary key, foreign keys)
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(c.oid) as definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE n.nspname = 'public'
  AND cl.relname = 'targeted_schools';

-- 3. Check if RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'targeted_schools';

-- 4. List existing policies
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
WHERE tablename = 'targeted_schools';

-- 5. Check for existing RPC functions
SELECT
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%target%school%' OR routine_name LIKE '%add_school%')
ORDER BY routine_name;
