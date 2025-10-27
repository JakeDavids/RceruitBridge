# RecruitBridge Email Identity System

## Overview

The RecruitBridge Email Identity System allows users to create professional `@recruitbridge.net` email addresses for coach outreach. This system integrates with Mailgun for email sending and receiving, and Supabase for data storage.

## Features

✅ **Username Validation & Availability Check**
- Real-time checking against the database
- Format validation (3-64 characters, lowercase, numbers, dots, dashes)
- Prevents duplicate usernames

✅ **Mailgun Integration**
- Creates email routes for inbound messages
- Enables professional email sending
- Handles email forwarding to webhook

✅ **Database Storage**
- Permanent storage in `email_identities` table
- Linked to user account via `user_id`
- Row Level Security (RLS) enabled

✅ **Inbound/Outbound Messaging**
- Inbound emails are captured via Mailgun webhook
- Stored in Response Center (`messages` and `mail_threads` tables)
- Outreach status automatically updated when coaches reply

## Architecture

### Database Schema

```sql
CREATE TABLE public.email_identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  username TEXT NOT NULL,
  domain TEXT DEFAULT 'recruitbridge.net',
  display_name TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, domain)
);
```

### Supabase Edge Functions

1. **check-username** (`/functions/v1/check-username`)
   - Validates username format
   - Checks database for availability
   - Returns `{ available: boolean, message: string }`

2. **create-email-identity** (`/functions/v1/create-email-identity`)
   - Validates user authentication
   - Checks username availability (double-check)
   - Creates Mailgun route for inbound emails
   - Saves identity to database
   - Updates user record
   - Sends welcome email
   - Returns `{ success: true, identity: {...} }`

3. **handle-inbound-email** (`/functions/v1/handle-inbound-email`)
   - Receives webhook from Mailgun
   - Identifies recipient's email identity
   - Updates outreach status to 'replied'
   - Creates/updates mail thread
   - Stores message in database

### React Hook

`useRecruitBridgeIdentity` provides:
- `getMe()` - Fetches current user's email identity
- `checkUsername(username)` - Checks if username is available
- `createIdentity(username, displayName)` - Creates new email identity
- `loading`, `error`, `identity` - State management

### UI Component

`IdentitySetup.jsx` provides:
- Display name input field
- Username input with real-time validation
- Visual feedback (available/taken/checking)
- Email preview
- Permanent address warning
- One-click creation button

## User Flow

### Creating an Email Address

1. User navigates to Profile or Outreach Center
2. System detects no email identity exists
3. IdentitySetup component is displayed
4. User enters:
   - Display Name: "Jake Davids"
   - Username: "jakedavids"
5. System validates format and checks availability
6. If available, "Create Email Address" button is enabled
7. User clicks button
8. Backend:
   - Creates Mailgun route
   - Saves to database
   - Updates user record
   - Sends welcome email
9. User sees success message
10. Email address `jakedavids@recruitbridge.net` is now active

### Sending Emails

1. User goes to Outreach Center
2. Composes email to coaches
3. Email is sent FROM their @recruitbridge.net address
4. System uses Mailgun API with their identity

### Receiving Emails

1. Coach replies to `jakedavids@recruitbridge.net`
2. Mailgun receives email
3. Mailgun forwards to webhook: `/functions/v1/handle-inbound-email`
4. System:
   - Identifies Jake's user account
   - Updates outreach status
   - Creates mail thread
   - Stores message
5. Message appears in Response Center

## Mailgun Configuration

### Environment Variables (Supabase Dashboard)

```
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=recruitbridge.net
MAILGUN_REGION=us
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Mailgun Routes

Routes are created automatically when user creates email identity:

```
Priority: 10
Expression: match_recipient("username@recruitbridge.net")
Actions:
  - forward("https://PROJECT.supabase.co/functions/v1/handle-inbound-email")
  - store(notify="https://PROJECT.supabase.co/functions/v1/handle-inbound-email")
```

## Security

✅ **Row Level Security**
```sql
CREATE POLICY "Users can manage own email identities"
ON public.email_identities
FOR ALL
USING (auth.uid() = user_id);
```

✅ **Username Validation**
- Only lowercase alphanumeric, dots, dashes, underscores
- Minimum 3 characters, maximum 64
- No SQL injection possible

✅ **Duplicate Prevention**
- Unique constraint on (username, domain)
- Double-check in create function

✅ **Authentication Required**
- All Edge Functions verify user authentication
- Service role key used only for inbound webhook

## Testing

### Manual Testing

1. **Create Email Identity**
```bash
# In browser console
const identity = await supabase.functions.invoke('create-email-identity', {
  body: {
    username: 'testuser',
    displayName: 'Test User'
  }
})
console.log(identity)
```

2. **Check Username**
```bash
const result = await supabase.functions.invoke('check-username', {
  body: { username: 'testuser' }
})
console.log(result) // { available: false }
```

3. **Send Test Email**
```bash
# Use Outreach Center to send email from testuser@recruitbridge.net
```

4. **Test Inbound**
```bash
# Send email TO testuser@recruitbridge.net from external address
# Check Response Center for incoming message
```

### Automated Testing

Create test script:
```javascript
// test-email-identity.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(URL, KEY)

async function test() {
  // Test username check
  const { data: check } = await supabase.functions.invoke('check-username', {
    body: { username: 'testuser123' }
  })
  console.log('Username available:', check.available)

  // Test create identity
  const { data: create } = await supabase.functions.invoke('create-email-identity', {
    body: {
      username: 'testuser123',
      displayName: 'Test User'
    }
  })
  console.log('Identity created:', create.success)
}

test()
```

## Deployment

### Deploy Edge Functions

```bash
chmod +x scripts/deploy-email-functions.sh
./scripts/deploy-email-functions.sh
```

Or manually:
```bash
supabase functions deploy check-username
supabase functions deploy create-email-identity
supabase functions deploy handle-inbound-email
```

### Set Environment Variables

In Supabase Dashboard > Edge Functions > Settings:
- Add all Mailgun credentials
- Add Supabase URLs and keys

### Verify Deployment

```bash
supabase functions logs check-username --follow
```

## Troubleshooting

### Username Check Not Working
- Verify Edge Function is deployed
- Check function logs for errors
- Verify RLS policies allow read access

### Email Creation Fails
- Check Mailgun API key is valid
- Verify domain is verified in Mailgun
- Check function logs for Mailgun errors
- Ensure username doesn't already exist

### Inbound Emails Not Received
- Verify Mailgun route is created
- Check webhook URL is correct
- Verify SERVICE_ROLE_KEY is set
- Check handle-inbound-email logs

### Messages Not Appearing in Response Center
- Verify `mail_threads` and `messages` tables exist
- Check RLS policies allow user to read their messages
- Verify user_id matches in email_identities

## Future Enhancements

- [ ] Email forwarding to personal email
- [ ] Custom email signatures
- [ ] Email templates
- [ ] Bulk email sending
- [ ] Email scheduling
- [ ] Read receipts/tracking
- [ ] Spam filtering
- [ ] Email search
- [ ] Attachment handling
- [ ] Rich text editor

## Support

For issues or questions:
- Check function logs: `supabase functions logs FUNCTION_NAME`
- Review Mailgun dashboard for delivery issues
- Check Supabase database for data integrity
- Contact support@recruitbridge.net
