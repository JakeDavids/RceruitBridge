#!/usr/bin/env node
/**
 * Supabase Signup Email Test
 *
 * This script triggers a signup confirmation email via Supabase's resend() method.
 * Used to diagnose if Supabase → Mailgun SMTP integration is working.
 *
 * Usage:
 *   VITE_SUPABASE_URL="https://xxx.supabase.co" \
 *   VITE_SUPABASE_ANON_KEY="eyJhbGc..." \
 *   TEST_INBOX="spamdasignups@gmail.com" \
 *   node scripts/supabase_resend_signup.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const testInbox = process.env.TEST_INBOX || 'spamdasignups@gmail.com';

console.log('🔧 Supabase Configuration:');
console.log(`   URL: ${supabaseUrl || '❌ MISSING'}`);
console.log(`   Anon Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : '❌ MISSING'}`);
console.log(`   Test Inbox: ${testInbox}`);
console.log();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Missing env vars');
  console.error('Required:');
  console.error('  VITE_SUPABASE_URL');
  console.error('  VITE_SUPABASE_ANON_KEY');
  console.error('  TEST_INBOX (optional, defaults to spamdasignups@gmail.com)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupEmail() {
  console.log('📧 Attempting to resend signup confirmation email...');
  console.log(`   Email: ${testInbox}`);
  console.log(`   Redirect URL: https://www.recruitbridge.app/auth/callback`);
  console.log();

  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: testInbox,
      options: {
        emailRedirectTo: 'https://www.recruitbridge.app/auth/callback'
      }
    });

    if (error) {
      console.error('❌ SUPABASE ERROR:');
      console.error('   Message:', error.message);
      console.error('   Status:', error.status);
      console.error('   Name:', error.name);
      console.error();
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.log();
      console.log('🔍 Diagnosis:');

      if (error.message.includes('User not found') || error.message.includes('not exist')) {
        console.log('   ⚠️  User does not exist or email not pending confirmation');
        console.log('   Action: Try signing up first at /signup, then run this test');
      } else if (error.message.includes('SMTP') || error.message.includes('email')) {
        console.log('   ⚠️  SMTP configuration issue in Supabase');
        console.log('   Action: Check Supabase Dashboard → Auth → SMTP Settings');
      } else if (error.message.includes('429') || error.message.includes('rate')) {
        console.log('   ⚠️  Rate limited - too many requests');
        console.log('   Action: Wait 60 seconds and try again');
      } else {
        console.log('   ⚠️  Unknown error - see details above');
      }

      process.exit(1);
    }

    console.log('✅ SUPABASE ACCEPTED THE REQUEST');
    console.log();
    console.log('📋 Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
    console.log('🔍 Next Steps:');
    console.log('   1. Check Mailgun Dashboard → Sending → Logs');
    console.log('   2. Look for a "Delivered" event for', testInbox);
    console.log('   3. Check the inbox at', testInbox);
    console.log('   4. If NO Mailgun log appears, the issue is Supabase → SMTP connectivity');
    console.log();
    console.log('⏳ Waiting for Mailgun event... (check dashboard now)');

  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:');
    console.error(error);
    process.exit(1);
  }
}

testSignupEmail();
