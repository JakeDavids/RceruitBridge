// Load FBS/FCS Schools into Supabase
// Run: node scripts/load-schools.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://frabthrbowszsqsjykmy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWJ0aHJib3dzenNxc2p5a215Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyOTkxMiwiZXhwIjoyMDc2MjA1OTEyfQ.DPzrbi_XbAZBs4cG97uUGvQGgmQf7CED5p3dty0sgUM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function loadSchools() {
  try {
    console.log('📚 Loading schools from CSV...');

    // Read CSV file
    const csvPath = '/Users/davidskids/Downloads/FBS_FCS Schools - Sheet1.csv';
    const csvContent = readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`Found ${records.length} schools in CSV`);

    // Transform data for Supabase
    const schools = records
      .filter(r => r.Schools && r.Schools.trim()) // Skip empty rows
      .map(record => ({
        name: record.Schools,
        city: record.City || null,
        state: record.State || null,
        division: record.Division || null,
        conference: record.Confrence || null, // Note: CSV has typo "Confrence"
        academic_ranking: record.Academic_ranking || null,
        enrollment: record.Enrollment || null, // Keep as string with all formatting
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    console.log(`Prepared ${schools.length} schools for import`);

    // Check if schools table exists
    const { data: tables, error: tablesError } = await supabase
      .from('schools')
      .select('id')
      .limit(1);

    if (tablesError && tablesError.code === '42P01') {
      console.error('❌ Schools table does not exist in Supabase!');
      console.log('\n📝 Please run this SQL in Supabase SQL Editor first:\n');
      console.log(`
-- First, check if you need to alter the existing table
-- If enrollment column exists as INTEGER, change it to TEXT:
-- ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;

CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  division TEXT,
  conference TEXT,
  academic_ranking TEXT,
  enrollment TEXT,  -- Must be TEXT not INTEGER (has values like "~4,000")
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schools_division ON schools(division);
CREATE INDEX IF NOT EXISTS idx_schools_conference ON schools(conference);
CREATE INDEX IF NOT EXISTS idx_schools_state ON schools(state);
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view schools" ON schools
  FOR SELECT USING (true);

-- Only authenticated users can insert/update
CREATE POLICY "Authenticated users can insert schools" ON schools
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update schools" ON schools
  FOR UPDATE TO authenticated USING (true);
      `);
      process.exit(1);
    }

    // First, let's check if we need to fix the enrollment column type
    console.log('🔧 Checking if enrollment column needs to be fixed...');
    const testSchool = schools[0];
    const { error: testError } = await supabase
      .from('schools')
      .insert([{
        ...testSchool,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (testError && testError.message.includes('invalid input syntax for type integer')) {
      console.error('\n❌ ERROR: The enrollment column is set to INTEGER but needs to be TEXT!');
      console.error('\n📝 QUICK FIX - Run this SQL in Supabase:');
      console.error('   1. Go to: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql/new');
      console.error('   2. Paste and run:');
      console.error('      ALTER TABLE schools ALTER COLUMN enrollment TYPE TEXT;');
      console.error('   3. Then re-run this script: node scripts/load-schools.js\n');
      process.exit(1);
    } else if (testError) {
      console.warn('Test insert error:', testError.message);
    } else {
      console.log('   ✅ Enrollment column is correct type (TEXT)');
    }

    // Clear existing schools (optional - comment out if you want to append)
    console.log('🗑️  Clearing existing schools...');
    const { error: deleteError } = await supabase
      .from('schools')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('Warning clearing schools:', deleteError.message);
    }

    // Insert schools in batches (Supabase has limits)
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < schools.length; i += batchSize) {
      const batch = schools.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('schools')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error);
        continue;
      }

      inserted += data.length;
      console.log(`✅ Inserted batch ${i / batchSize + 1} (${data.length} schools)`);
    }

    console.log(`\n🎉 Successfully imported ${inserted}/${schools.length} schools!`);

    // Show some stats
    const { data: stats } = await supabase
      .from('schools')
      .select('division')
      .not('division', 'is', null);

    const divisionCounts = stats.reduce((acc, school) => {
      acc[school.division] = (acc[school.division] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Schools by division:');
    Object.entries(divisionCounts).forEach(([div, count]) => {
      console.log(`  ${div}: ${count} schools`);
    });

  } catch (error) {
    console.error('❌ Error loading schools:', error);
    process.exit(1);
  }
}

loadSchools();
