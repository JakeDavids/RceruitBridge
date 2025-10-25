-- Normalize division names in schools table
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new

-- Fix "Dll" (with lowercase L's) to "D2"
UPDATE schools
SET division = 'D2'
WHERE division = 'Dll' OR division = 'DII' OR division = 'D ll';

-- Fix "DIII" to "D3"
UPDATE schools
SET division = 'D3'
WHERE division = 'DIII';

-- Verify the fix
SELECT division, COUNT(*) as count
FROM schools
GROUP BY division
ORDER BY
  CASE division
    WHEN 'FBS' THEN 1
    WHEN 'FCS' THEN 2
    WHEN 'D2' THEN 3
    WHEN 'D3' THEN 4
    WHEN 'JUCO' THEN 5
    ELSE 99
  END;

SELECT '✅ Division names normalized successfully!' as status;
