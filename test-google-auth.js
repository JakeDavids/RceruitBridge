// Test Google OAuth Configuration
// Run: node test-google-auth.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load .env.local
const envFile = readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Configuration...\n');

// Test 1: Check environment variables
console.log('1. Environment Variables:');
console.log(`   URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`);
console.log(`   Anon Key: ${supabaseAnonKey ? '✅ Present (length: ' + supabaseAnonKey.length + ')' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing required environment variables!');
  process.exit(1);
}

// Test 2: Create Supabase client
console.log('\n2. Creating Supabase Client...');
try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('   ✅ Client created successfully');

  // Test 3: Check auth configuration
  console.log('\n3. Checking Auth Configuration...');

  // Try to get the OAuth URL (this will fail if Google isn't configured)
  const testOAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173/dashboard',
          skipBrowserRedirect: true // Don't actually redirect, just test
        }
      });

      if (error) {
        console.log('   ❌ OAuth Error:', error.message);
        console.log('\n📝 This means Google OAuth is NOT configured in Supabase!');
        console.log('   Follow these steps:');
        console.log('   1. Go to https://supabase.com/dashboard');
        console.log('   2. Select project: frabthrbowszsqsjykmy');
        console.log('   3. Go to Authentication → Providers');
        console.log('   4. Enable Google and add your Client ID and Secret');
        console.log('\n   See FIX_GOOGLE_AUTH.md for detailed instructions');
      } else if (data.url) {
        console.log('   ✅ Google OAuth is configured!');
        console.log('   OAuth URL:', data.url.substring(0, 50) + '...');
      } else {
        console.log('   ⚠️  Unexpected response:', data);
      }
    } catch (err) {
      console.log('   ❌ Error testing OAuth:', err.message);
    }
  };

  await testOAuth();

  // Test 4: Check if users table exists
  console.log('\n4. Checking Database Tables...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('   ⚠️  Users table does not exist');
        console.log('   This is OK - it will be created on first signup');
      } else {
        console.log('   ⚠️  Error querying users:', error.message);
      }
    } else {
      console.log('   ✅ Users table exists');
    }
  } catch (err) {
    console.log('   ⚠️  Could not check users table:', err.message);
  }

  console.log('\n✅ Test complete!');
  console.log('\nIf you see OAuth errors above, follow FIX_GOOGLE_AUTH.md to configure Google OAuth.');

} catch (error) {
  console.error('   ❌ Failed to create client:', error.message);
  process.exit(1);
}
