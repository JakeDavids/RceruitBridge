-- Fix the schools table to allow TEXT for enrollment instead of INTEGER

-- Change enrollment column from INTEGER to TEXT
ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'schools';
