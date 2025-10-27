// Supabase Edge Function to handle inbound emails from Mailgun
// Deploy with: supabase functions deploy handle-inbound-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Initialize Supabase with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the form data from Mailgun webhook
    const formData = await req.formData()

    const sender = formData.get('sender') as string
    const recipient = formData.get('recipient') as string
    const subject = formData.get('subject') as string
    const bodyPlain = formData.get('body-plain') as string
    const bodyHtml = formData.get('body-html') as string
    const messageId = formData.get('Message-Id') as string
    const timestamp = formData.get('timestamp') as string

    console.log('Received inbound email:', {
      from: sender,
      to: recipient,
      subject,
      messageId
    })

    // Extract username from recipient email
    const recipientUsername = recipient?.split('@')[0]

    if (!recipientUsername) {
      console.error('Could not extract username from recipient:', recipient)
      return new Response('OK', { status: 200 }) // Return 200 to prevent Mailgun retries
    }

    // Find the user who owns this email identity
    const { data: identity, error: identityError } = await supabaseClient
      .from('email_identities')
      .select('user_id, username')
      .eq('username', recipientUsername)
      .eq('domain', 'recruitbridge.net')
      .single()

    if (identityError || !identity) {
      console.error('Email identity not found for username:', recipientUsername)
      return new Response('OK', { status: 200 }) // Return 200 to prevent Mailgun retries
    }

    // Check if this is a reply to an existing thread
    // We'll look for the coach's email in our outreach records
    const { data: outreach } = await supabaseClient
      .from('outreaches')
      .select('id, coach_email')
      .eq('athlete_id', identity.user_id)
      .eq('coach_email', sender)
      .order('created_date', { ascending: false })
      .limit(1)
      .single()

    // Update outreach status if found
    if (outreach) {
      await supabaseClient
        .from('outreaches')
        .update({
          status: 'replied',
          last_response_date: timestamp
        })
        .eq('id', outreach.id)

      console.log('Updated outreach status to replied for:', outreach.id)
    }

    // Store the inbound message for the Response Center
    // First, find or create a mail thread
    let threadId = `thread-${sender}-${recipientUsername}`

    const { data: existingThread } = await supabaseClient
      .from('mail_threads')
      .select('id')
      .eq('user_id', identity.user_id)
      .contains('participants', [sender])
      .single()

    if (existingThread) {
      threadId = existingThread.id
    } else {
      // Create new thread
      const { data: newThread } = await supabaseClient
        .from('mail_threads')
        .insert({
          user_id: identity.user_id,
          external_id: threadId,
          subject,
          participants: [sender, recipient],
          last_message_date: new Date(parseInt(timestamp) * 1000).toISOString(),
          unread_count: 1
        })
        .select('id')
        .single()

      if (newThread) {
        threadId = newThread.id
      }
    }

    // Store the message
    await supabaseClient
      .from('messages')
      .insert({
        thread_id: threadId,
        external_id: messageId,
        from_address: sender,
        to_address: recipient,
        subject,
        body_text: bodyPlain,
        body_html: bodyHtml,
        received_date: new Date(parseInt(timestamp) * 1000).toISOString(),
        is_from_coach: true
      })

    console.log('Stored inbound message successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Email processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing inbound email:', error)
    // Always return 200 to prevent Mailgun from retrying
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
