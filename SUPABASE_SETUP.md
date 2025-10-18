# Supabase Setup Instructions

## Fix Schools Table for CSV Import

The `enrollment` column in the `schools` table needs to be TEXT (not INTEGER) because it contains values like "~4,000" and "~80,000".

### Steps:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: frabthrbowszsqsjykmy
3. **Navigate to**: SQL Editor (left sidebar)
4. **Run this SQL command**:

```sql
ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;
```

5. **Verify the change** (optional):

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'schools';
```

6. **Then run the import script**:

```bash
node scripts/load-schools.js
```

This will load all 263 FBS and FCS schools from your CSV into the database.

---

## Schools Data Structure

The CSV contains:
- **265 total rows** (263 valid schools)
- **FBS schools**: ~130 schools
- **FCS schools**: ~133 schools

Columns:
- `Schools` → `name` (school name with mascot)
- `City` → `city`
- `State` → `state`
- `Division` → `division` (FBS or FCS)
- `Confrence` → `conference` (SEC, Big Ten, etc.)
- `Academic_ranking` → `academic_ranking` (Tier 1-4)
- `Enrollment` → `enrollment` (student population with special chars)

---

## After Import

The schools will be available in your RecruitBridge app on the Target Schools page where athletes can:
- Browse all FBS and FCS schools
- Filter by division, conference, state
- Add schools to their target list
- See school details (city, enrollment, academic tier)
