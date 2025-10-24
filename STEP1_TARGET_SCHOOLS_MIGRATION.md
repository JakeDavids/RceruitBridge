# Step 1 — Target Schools Schema + RLS Migration

## Summary

This migration adds **server-side enforcement** for the target schools feature with a free-trial cap of 3 schools.

## What Was Created

### 1. Table Structure Enhancement (`targeted_schools`)

**Existing table** (from code inspection):
- `id` (uuid, primary key)
- `athlete_id` (uuid, foreign key to athletes)
- `school_id` (uuid, foreign key to schools)

**Added columns**:
```sql
ALTER TABLE targeted_schools ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE targeted_schools ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE targeted_schools ADD CONSTRAINT targeted_schools_user_school_unique UNIQUE (user_id, school_id);
```

**Why**: RLS policies require `user_id` to enforce "user can only see/modify their own targets". Unique constraint prevents duplicates.

---

### 2. Row Level Security (RLS) Policies

```sql
ALTER TABLE targeted_schools ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT - Users can only read their own targeted schools
CREATE POLICY "Users can read own targeted schools"
  ON targeted_schools
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: INSERT - Users can only insert their own targeted schools
CREATE POLICY "Users can insert own targeted schools"
  ON targeted_schools
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy 3: DELETE - Users can only delete their own targeted schools
CREATE POLICY "Users can delete own targeted schools"
  ON targeted_schools
  FOR DELETE
  USING (user_id = auth.uid());
```

**Result**: Users cannot read, modify, or delete other users' target schools.

---

### 3. Server-Side RPC Functions

#### a) `get_target_school_limit(p_user_id uuid) → integer`

**Purpose**: Determine user's allowed limit based on their plan.

**Logic**:
```sql
free      → 3 schools
starter   → 7 schools
core      → 15 schools
unlimited → 999999 schools (effectively unlimited)
```

**Returns**: Integer limit for the user.

---

#### b) `add_target_school(p_school_id uuid) → json`

**Purpose**: Add a school to user's targets **with server-side limit enforcement**.

**Logic**:
1. Get authenticated user ID (`auth.uid()`)
2. Get user's athlete_id from `athletes` table
3. Count existing targets for user
4. Get user's limit from `get_target_school_limit()`
5. **If count >= limit**: `RAISE EXCEPTION 'TARGET_LIMIT_REACHED'`
6. **Else**: Insert `(user_id, athlete_id, school_id)` with `ON CONFLICT DO NOTHING` (idempotent)
7. Return JSON: `{ success: true, school_id, current_count, limit }`

**Returns**:
```json
{
  "success": true,
  "school_id": "uuid-here",
  "current_count": 2,
  "limit": 3
}
```

**Error**: If limit reached, throws `TARGET_LIMIT_REACHED` exception.

---

#### c) `remove_target_school(p_school_id uuid) → json`

**Purpose**: Remove a school from user's targets.

**Logic**:
1. Get authenticated user ID
2. Delete where `user_id = auth.uid() AND school_id = p_school_id`
3. Return JSON with success and current_count

**Returns**:
```json
{
  "success": true,
  "school_id": "uuid-here",
  "current_count": 1
}
```

---

#### d) `get_my_targeted_schools() → TABLE`

**Purpose**: Get user's targeted schools with school details (replaces client-side join).

**Returns**: Table with columns:
- `id`, `user_id`, `athlete_id`, `school_id`, `created_at`
- `school_name`, `school_city`, `school_state`, `school_division` (joined from `schools` table)

**Ordered by**: `created_at DESC` (most recent first)

---

## Key Features

### ✅ Server-Side Enforcement
- **Cannot be bypassed** - limit check happens in database function with `SECURITY DEFINER`
- Client-side can still show UI hints, but server is authoritative

### ✅ Idempotent Operations
- `add_target_school()` uses `ON CONFLICT DO NOTHING` - safe to call multiple times
- No crash if school already targeted

### ✅ User Isolation (RLS)
- Users **cannot** read other users' targets via direct table queries
- All access must go through RLS-protected queries or RPCs

### ✅ Plan-Based Limits
```
Free Plan:      3 schools
Starter Plan:   7 schools
Core Plan:      15 schools
Unlimited Plan: Effectively unlimited (999999)
```

### ✅ Graceful Upgrade Path
- Limit constant can be adjusted in `get_target_school_limit()` function
- Frontend can catch `TARGET_LIMIT_REACHED` and show upsell modal

---

## SQL Files Created

1. **`scripts/inspect_targeted_schools_schema.sql`**
   - Diagnostic queries to inspect current table, constraints, policies, RPCs

2. **`scripts/migrate_targeted_schools_with_rls_and_rpcs.sql`**
   - Complete migration script to run in Supabase SQL Editor
   - Adds RLS, policies, and RPCs
   - Safe to run multiple times (idempotent)

---

## How to Apply

1. Go to: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new
2. Copy contents of `scripts/migrate_targeted_schools_with_rls_and_rpcs.sql`
3. Click **RUN**
4. Verify output shows: `✅ Migration complete!` with `policy_count: 3` and `rls_enabled: true`

---

## Next Steps (Step 2)

After running this migration, update frontend (`src/pages/Schools.jsx`):
- Replace `TargetedSchool.create()` with `supabase.rpc('add_target_school', { p_school_id })`
- Replace `TargetedSchool.delete()` with `supabase.rpc('remove_target_school', { p_school_id })`
- Catch `TARGET_LIMIT_REACHED` error and show upsell modal
- Use `supabase.rpc('get_my_targeted_schools')` for optimized queries (optional)

---

## Diff Summary

```diff
Table: targeted_schools
+ user_id uuid (FK to auth.users)
+ created_at timestamptz
+ UNIQUE constraint (user_id, school_id)
+ RLS enabled with 3 policies (SELECT, INSERT, DELETE)

Functions:
+ get_target_school_limit(uuid) → integer
+ add_target_school(uuid) → json
+ remove_target_school(uuid) → json
+ get_my_targeted_schools() → TABLE
```
