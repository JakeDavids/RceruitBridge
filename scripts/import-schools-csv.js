#!/usr/bin/env node
/**
 * Import 779 schools from CSV
 *
 * CSV Format:
 * Schools,City,State,Division,Conference,Academic_ranking,Enrollment
 *
 * Usage:
 *   node scripts/import-schools-csv.js path/to/schools.csv
 *
 * Example CSV row:
 *   "Harvard University","Cambridge","MA","FCS","Ivy League",1,23000
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Load env vars
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importSchools(csvPath) {
  console.log('📄 Reading CSV file:', csvPath);

  if (!fs.existsSync(csvPath)) {
    console.error('❌ File not found:', csvPath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`✅ Parsed ${records.length} schools from CSV`);
  console.log();

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const [index, record] of records.entries()) {
    const schoolData = {
      name: record.Schools || record.school || record.name,
      city: record.City || record.city,
      state: record.State || record.state,
      division: record.Division || record.division,
      conference: record.Conference || record.Confrence || record.conference, // Handle typo
      academic_ranking: parseInt(record.Academic_ranking || record.academic_ranking || 3), // Default to Tier 3
      enrollment: parseInt(record.Enrollment || record.enrollment || 0) || null
    };

    // Validate required fields
    if (!schoolData.name || !schoolData.state) {
      console.error(`⚠️  Row ${index + 1}: Missing required fields (name or state)`);
      errors++;
      continue;
    }

    try {
      // Check if school already exists
      const { data: existing } = await supabase
        .from('schools')
        .select('id')
        .eq('name', schoolData.name)
        .eq('state', schoolData.state)
        .single();

      if (existing) {
        // Update existing school
        const { error } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', existing.id);

        if (error) {
          console.error(`❌ Error updating ${schoolData.name}:`, error.message);
          errors++;
        } else {
          updated++;
          console.log(`🔄 Updated: ${schoolData.name} (${schoolData.state})`);
        }
      } else {
        // Insert new school
        const { error } = await supabase
          .from('schools')
          .insert(schoolData);

        if (error) {
          console.error(`❌ Error inserting ${schoolData.name}:`, error.message);
          errors++;
        } else {
          inserted++;
          console.log(`✅ Inserted: ${schoolData.name} (${schoolData.state})`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${schoolData.name}:`, error.message);
      errors++;
    }
  }

  console.log();
  console.log('═══════════════════════════════════════');
  console.log('📊 Import Summary:');
  console.log(`   ✅ Inserted: ${inserted} schools`);
  console.log(`   🔄 Updated: ${updated} schools`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total processed: ${records.length}`);
  console.log('═══════════════════════════════════════');
}

// Get CSV path from command line argument
const csvPath = process.argv[2];

if (!csvPath) {
  console.error('Usage: node scripts/import-schools-csv.js path/to/schools.csv');
  console.error();
  console.error('CSV Format:');
  console.error('  Schools,City,State,Division,Conference,Academic_ranking,Enrollment');
  console.error();
  console.error('Example:');
  console.error('  "Harvard University","Cambridge","MA","FCS","Ivy League",1,23000');
  process.exit(1);
}

importSchools(csvPath);
