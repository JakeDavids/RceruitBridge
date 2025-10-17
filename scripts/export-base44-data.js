// Export all data from Base44 to JSON files
// Run this BEFORE migrating to Supabase to backup your data

import { createClient } from '@base44/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Base44 client with service role (admin access)
const base44 = createClient({
  appId: "6875a318a0b2d879d617363b",
  requiresAuth: false // Use service role for full access
});

// Output directory for exported data
const outputDir = path.join(__dirname, '../data-export');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// List of entities to export
const ENTITIES = [
  'athletes',
  'schools',
  'coaches',
  'coach_contacts',
  'targeted_schools',
  'outreach',
  'email_identities',
  'mailboxes',
  'mail_threads',
  'messages'
];

async function exportEntity(entityName) {
  console.log(`\n📦 Exporting ${entityName}...`);

  try {
    // Get all records for this entity
    const records = await base44.entities[entityName].all();

    console.log(`   Found ${records.length} records`);

    // Save to JSON file
    const filePath = path.join(outputDir, `${entityName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2));

    console.log(`   ✅ Saved to ${filePath}`);

    return { entity: entityName, count: records.length, success: true };
  } catch (error) {
    console.error(`   ❌ Error exporting ${entityName}:`, error.message);
    return { entity: entityName, count: 0, success: false, error: error.message };
  }
}

async function exportUsers() {
  console.log(`\n📦 Exporting users...`);

  try {
    // This might need special handling depending on Base44's user export API
    // For now, we'll try to get user data from the athletes table
    const athletes = await base44.entities.athletes.all();
    const uniqueEmails = [...new Set(athletes.map(a => a.created_by))];

    console.log(`   Found ${uniqueEmails.length} unique users`);

    const users = uniqueEmails.map(email => ({
      email,
      plan: 'free', // Default, update manually if needed
      onboarding_completed: true,
      created_from_export: true
    }));

    const filePath = path.join(outputDir, 'users.json');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    console.log(`   ✅ Saved to ${filePath}`);

    return { entity: 'users', count: users.length, success: true };
  } catch (error) {
    console.error(`   ❌ Error exporting users:`, error.message);
    return { entity: 'users', count: 0, success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Base44 Data Export\n');
  console.log('=' .repeat(60));

  const results = [];

  // Export users first
  results.push(await exportUsers());

  // Export all entities
  for (const entity of ENTITIES) {
    results.push(await exportEntity(entity));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 EXPORT SUMMARY\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful exports: ${successful.length}`);
  successful.forEach(r => {
    console.log(`   - ${r.entity}: ${r.count} records`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed exports: ${failed.length}`);
    failed.forEach(r => {
      console.log(`   - ${r.entity}: ${r.error}`);
    });
  }

  console.log(`\n📁 All data exported to: ${outputDir}`);
  console.log('\n✅ Export complete! You can now import this data to Supabase.\n');
}

// Run the export
main().catch(error => {
  console.error('\n❌ Fatal error during export:', error);
  process.exit(1);
});
