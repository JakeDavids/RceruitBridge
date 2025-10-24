-- Migration: Add server-side enforcement for target schools
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new
--
-- This migration:
-- 1. Ensures targeted_schools table has proper structure
-- 2. Adds RLS policies for user isolation
-- 3. Creates RPCs with server-side limit enforcement (3 for free, 7 for starter, 15 for core, unlimited for unlimited)

-- ============================================
-- STEP 1: Ensure table structure
-- ============================================

-- If table doesn't exist or needs columns, this will handle it
-- (assuming targeted_schools already exists based on code inspection)

-- Add user_id column if missing (links to auth.users for RLS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'targeted_schools' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE targeted_schools ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Backfill user_id from athlete_id if possible
    -- Assumes athletes table has user_id or created_by that maps to users
    UPDATE targeted_schools ts
    SET user_id = a.user_id
    FROM athletes a
    WHERE ts.athlete_id = a.id AND ts.user_id IS NULL;
  END IF;
END $$;

-- Ensure created_at exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'targeted_schools' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE targeted_schools ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Add composite unique constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'targeted_schools_user_school_unique'
  ) THEN
    ALTER TABLE targeted_schools
    ADD CONSTRAINT targeted_schools_user_school_unique
    UNIQUE (user_id, school_id);
  END IF;
END $$;

-- ============================================
-- STEP 2: Enable RLS and create policies
-- ============================================

ALTER TABLE targeted_schools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (clean slate)
DROP POLICY IF EXISTS "Users can read own targeted schools" ON targeted_schools;
DROP POLICY IF EXISTS "Users can insert own targeted schools" ON targeted_schools;
DROP POLICY IF EXISTS "Users can delete own targeted schools" ON targeted_schools;

-- Policy 1: Users can SELECT their own targeted schools
CREATE POLICY "Users can read own targeted schools"
  ON targeted_schools
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: Users can INSERT their own targeted schools
-- Note: actual limit enforcement happens in RPC, this just ensures user_id matches
CREATE POLICY "Users can insert own targeted schools"
  ON targeted_schools
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy 3: Users can DELETE their own targeted schools
CREATE POLICY "Users can delete own targeted schools"
  ON targeted_schools
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- STEP 3: Create server-side RPC functions
-- ============================================

-- Function to get user's plan and enforce limits
CREATE OR REPLACE FUNCTION get_target_school_limit(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan text;
  v_limit integer;
BEGIN
  -- Get user's plan from users table
  SELECT plan INTO v_plan
  FROM public.users
  WHERE id = p_user_id;

  -- Default to free if no plan found
  v_plan := COALESCE(v_plan, 'free');

  -- Determine limit based on plan
  CASE v_plan
    WHEN 'unlimited' THEN v_limit := 999999; -- Effectively unlimited
    WHEN 'core' THEN v_limit := 15;
    WHEN 'starter' THEN v_limit := 7;
    ELSE v_limit := 3; -- free or any other plan defaults to 3
  END CASE;

  RETURN v_limit;
END;
$$;

-- RPC: Add target school with server-side limit enforcement
CREATE OR REPLACE FUNCTION add_target_school(p_school_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_athlete_id uuid;
  v_current_count integer;
  v_limit integer;
  v_result json;
BEGIN
  -- Get authenticated user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED' USING HINT = 'User must be logged in';
  END IF;

  -- Get user's athlete_id (assuming one athlete per user)
  SELECT id INTO v_athlete_id
  FROM public.athletes
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_athlete_id IS NULL THEN
    RAISE EXCEPTION 'NO_ATHLETE_PROFILE' USING HINT = 'User must have an athlete profile';
  END IF;

  -- Count existing target schools for this user
  SELECT COUNT(*) INTO v_current_count
  FROM public.targeted_schools
  WHERE user_id = v_user_id;

  -- Get user's limit
  v_limit := get_target_school_limit(v_user_id);

  -- Check if limit reached (only enforce before insert)
  IF v_current_count >= v_limit THEN
    RAISE EXCEPTION 'TARGET_LIMIT_REACHED'
      USING HINT = format('Your plan allows %s target schools. Upgrade to add more.', v_limit);
  END IF;

  -- Insert (on conflict do nothing to make it idempotent)
  INSERT INTO public.targeted_schools (user_id, athlete_id, school_id, created_at)
  VALUES (v_user_id, v_athlete_id, p_school_id, now())
  ON CONFLICT (user_id, school_id) DO NOTHING;

  -- Return success with current count
  SELECT json_build_object(
    'success', true,
    'school_id', p_school_id,
    'current_count', (SELECT COUNT(*) FROM public.targeted_schools WHERE user_id = v_user_id),
    'limit', v_limit
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- RPC: Remove target school
CREATE OR REPLACE FUNCTION remove_target_school(p_school_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_result json;
BEGIN
  -- Get authenticated user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED' USING HINT = 'User must be logged in';
  END IF;

  -- Delete the target school
  DELETE FROM public.targeted_schools
  WHERE user_id = v_user_id AND school_id = p_school_id;

  -- Return success with current count
  SELECT json_build_object(
    'success', true,
    'school_id', p_school_id,
    'current_count', (SELECT COUNT(*) FROM public.targeted_schools WHERE user_id = v_user_id)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- RPC: Get user's targeted schools (joins with schools table)
CREATE OR REPLACE FUNCTION get_my_targeted_schools()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  athlete_id uuid,
  school_id uuid,
  created_at timestamptz,
  school_name text,
  school_city text,
  school_state text,
  school_division text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ts.id,
    ts.user_id,
    ts.athlete_id,
    ts.school_id,
    ts.created_at,
    s.name as school_name,
    s.city as school_city,
    s.state as school_state,
    s.division as school_division
  FROM public.targeted_schools ts
  JOIN public.schools s ON s.id = ts.school_id
  WHERE ts.user_id = auth.uid()
  ORDER BY ts.created_at DESC;
END;
$$;

-- ============================================
-- STEP 4: Grant permissions
-- ============================================

GRANT EXECUTE ON FUNCTION add_target_school(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_target_school(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_targeted_schools() TO authenticated;
GRANT EXECUTE ON FUNCTION get_target_school_limit(uuid) TO authenticated;

-- ============================================
-- Verification
-- ============================================

SELECT
  '✅ Migration complete!' as status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'targeted_schools') as policy_count,
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'targeted_schools') as rls_enabled;
