#!/usr/bin/env node
/**
 * SMTP Test Script - Prove Mailgun SMTP credentials work
 *
 * This script sends a test email directly via Mailgun SMTP to isolate
 * whether the issue is with Mailgun credentials or Supabase configuration.
 *
 * DO NOT COMMIT SECRETS - password is passed via env var
 *
 * Usage:
 *   MAILGUN_SMTP_PASSWORD="your-api-key" node scripts/smtp_prove_mailgun_send.js
 */

import nodemailer from 'nodemailer';

// Try port 465 with SSL if 587 times out
const USE_PORT = process.env.SMTP_PORT || '587';
const USE_SSL = USE_PORT === '465';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.mailgun.org';

const SMTP_CONFIG = {
  host: SMTP_HOST,
  port: parseInt(USE_PORT),
  secure: USE_SSL, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: 'postmaster@recruitbridge.net',
    pass: process.env.MAILGUN_SMTP_PASSWORD
  },
  ...(USE_SSL ? {} : { requireTLS: true, tls: { rejectUnauthorized: false } })
};

const TEST_EMAIL = {
  from: 'support@recruitbridge.net',
  to: 'spamdasignups@gmail.com',
  subject: `[SMTP Test] ${new Date().toISOString()}`,
  text: `This is a direct SMTP test from RecruitBridge.

If you receive this, Mailgun SMTP credentials are valid.

Sent at: ${new Date().toLocaleString()}
Host: ${SMTP_CONFIG.host}
Port: ${SMTP_CONFIG.port}
User: ${SMTP_CONFIG.auth.user}`,
  html: `<div style="font-family: sans-serif;">
  <h2>✅ SMTP Test Successful</h2>
  <p>This is a direct SMTP test from RecruitBridge.</p>
  <p>If you receive this, <strong>Mailgun SMTP credentials are valid</strong>.</p>
  <hr>
  <p style="color: #666; font-size: 12px;">
    Sent at: ${new Date().toLocaleString()}<br>
    Host: ${SMTP_CONFIG.host}<br>
    Port: ${SMTP_CONFIG.port}<br>
    User: ${SMTP_CONFIG.auth.user}
  </p>
</div>`
};

async function testSMTP() {
  console.log('🔧 SMTP Configuration:');
  console.log(`   Host: ${SMTP_CONFIG.host}`);
  console.log(`   Port: ${SMTP_CONFIG.port}`);
  console.log(`   User: ${SMTP_CONFIG.auth.user}`);
  console.log(`   Password: ${SMTP_CONFIG.auth.pass ? '***SET***' : '❌ MISSING'}`);
  console.log();

  if (!SMTP_CONFIG.auth.pass) {
    console.error('❌ ERROR: MAILGUN_SMTP_PASSWORD env var not set');
    console.error('Usage: MAILGUN_SMTP_PASSWORD="your-key" node scripts/smtp_prove_mailgun_send.js');
    process.exit(1);
  }

  console.log('📧 Creating transporter...');
  const transporter = nodemailer.createTransport(SMTP_CONFIG);

  console.log('🔐 Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }

  console.log();
  console.log('📨 Sending test email...');
  console.log(`   From: ${TEST_EMAIL.from}`);
  console.log(`   To: ${TEST_EMAIL.to}`);
  console.log(`   Subject: ${TEST_EMAIL.subject}`);
  console.log();

  try {
    const info = await transporter.sendMail(TEST_EMAIL);
    console.log('✅ EMAIL SENT SUCCESSFULLY');
    console.log();
    console.log('📋 Send Details:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log();
    console.log('🔍 Next Steps:');
    console.log('   1. Check Mailgun Dashboard → Sending → Logs');
    console.log('   2. Look for a "Delivered" event for spamdasignups@gmail.com');
    console.log('   3. Check the inbox at spamdasignups@gmail.com');
    console.log();
    console.log('✅ TEST PASSED - Mailgun SMTP credentials are VALID');
  } catch (error) {
    console.error('❌ EMAIL SEND FAILED');
    console.error('Error:', error.message);
    console.error('Full error:', error);
    console.log();
    console.log('🔍 Common Issues:');
    console.log('   - Wrong password (check Mailgun API key)');
    console.log('   - Domain not verified in Mailgun');
    console.log('   - Firewall blocking port 587');
    process.exit(1);
  }
}

testSMTP();
