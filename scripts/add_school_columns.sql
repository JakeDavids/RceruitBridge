-- Add academic_ranking and staff_directory_url columns to schools table
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

-- Add academic_ranking column (Tier 1-5)
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS academic_ranking integer;

-- Add staff_directory_url column
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS staff_directory_url text;

-- Add comment for academic_ranking
COMMENT ON COLUMN schools.academic_ranking IS 'Academic tier: 1=Most Competitive (Ivy League), 2=Highly Competitive, 3=Competitive, 4=Less Competitive, 5=Least Competitive';

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'schools'
  AND column_name IN ('academic_ranking', 'staff_directory_url');

SELECT '✅ Columns added successfully!' as status;
