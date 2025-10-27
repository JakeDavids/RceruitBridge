// Supabase Edge Function to create email identity in Mailgun and database
// Deploy with: supabase functions deploy create-email-identity

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')!
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')!
const MAILGUN_REGION = Deno.env.get('MAILGUN_REGION') || 'us'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request body
    const { username, displayName } = await req.json()

    // Validate input
    if (!username || !displayName) {
      return new Response(
        JSON.stringify({ error: 'Username and display name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9._-]{3,64}$/
    if (!usernameRegex.test(username)) {
      return new Response(
        JSON.stringify({ error: 'Invalid username format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already has an email identity
    const { data: existing } = await supabaseClient
      .from('email_identities')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'User already has an email identity' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if username is available
    const { data: taken } = await supabaseClient
      .from('email_identities')
      .select('username')
      .eq('username', username)
      .eq('domain', 'recruitbridge.net')
      .single()

    if (taken) {
      return new Response(
        JSON.stringify({ error: 'Username is already taken. Please choose another.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create email route in Mailgun for inbound emails
    const emailAddress = `${username}@${MAILGUN_DOMAIN}`
    const mailgunUrl = `https://api.${MAILGUN_REGION === 'eu' ? 'eu.' : ''}mailgun.net/v3/routes`

    // Create route for forwarding inbound emails to our webhook
    const routeFormData = new FormData()
    routeFormData.append('priority', '10')
    routeFormData.append('description', `Route for ${emailAddress}`)
    routeFormData.append('expression', `match_recipient("${emailAddress}")`)
    routeFormData.append('action', `forward("https://${Deno.env.get('SUPABASE_URL')?.replace('https://', '')}/functions/v1/handle-inbound-email")`)
    routeFormData.append('action', `store(notify="https://${Deno.env.get('SUPABASE_URL')?.replace('https://', '')}/functions/v1/handle-inbound-email")`)

    const routeResponse = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
      },
      body: routeFormData
    })

    if (!routeResponse.ok) {
      const errorData = await routeResponse.json()
      console.error('Mailgun route creation error:', errorData)

      // Continue anyway - route creation is not critical for sending
      console.warn('Route creation failed but continuing with identity creation')
    } else {
      const routeData = await routeResponse.json()
      console.log('Mailgun route created:', routeData)
    }

    // Save email identity to database
    const { data: identity, error: dbError } = await supabaseClient
      .from('email_identities')
      .insert({
        user_id: user.id,
        username,
        domain: 'recruitbridge.net',
        display_name: displayName,
        verified: true // Auto-verify since we control the domain
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save email identity to database', details: dbError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user record with email info
    await supabaseClient
      .from('users')
      .update({
        email_username: username,
        email_domain: 'recruitbridge.net'
      })
      .eq('id', user.id)

    // Send welcome email
    try {
      const welcomeFormData = new FormData()
      welcomeFormData.append('from', `RecruitBridge <support@${MAILGUN_DOMAIN}>`)
      welcomeFormData.append('to', user.email!)
      welcomeFormData.append('subject', `Your RecruitBridge Email is Ready: ${emailAddress}`)
      welcomeFormData.append('html', `
        <h2>Welcome to RecruitBridge!</h2>
        <p>Your professional email address has been created:</p>
        <p><strong>${displayName} &lt;${emailAddress}&gt;</strong></p>
        <p>You can now use this email address to:</p>
        <ul>
          <li>Send professional emails to coaches</li>
          <li>Receive replies directly in your Response Center</li>
          <li>Track all your communications in one place</li>
        </ul>
        <p>Visit the Outreach Center to start sending emails!</p>
        <p>Best of luck with your recruiting journey!</p>
        <p>The RecruitBridge Team</p>
      `)

      const mailgunMessagesUrl = `https://api.${MAILGUN_REGION === 'eu' ? 'eu.' : ''}mailgun.net/v3/${MAILGUN_DOMAIN}/messages`
      await fetch(mailgunMessagesUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
        },
        body: welcomeFormData
      })
    } catch (emailError) {
      console.error('Welcome email error:', emailError)
      // Don't fail the request if welcome email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        identity: {
          id: identity.id,
          email: emailAddress,
          username,
          domain: 'recruitbridge.net',
          displayName,
          verified: true
        },
        message: 'Email identity created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating email identity:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
