// Supabase Edge Function to send emails via Mailgun
// Deploy with: supabase functions deploy send-email

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
    // Get request body
    const { to, from, subject, text, html } = await req.json()

    // Validate required fields
    if (!to || !from || !subject || (!text && !html)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, from, subject, and text/html' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare form data for Mailgun
    const formData = new FormData()
    formData.append('from', from)
    formData.append('to', to)
    formData.append('subject', subject)
    if (html) formData.append('html', html)
    if (text) formData.append('text', text)

    // Send email via Mailgun
    const mailgunUrl = `https://api.${MAILGUN_REGION === 'eu' ? 'eu.' : ''}mailgun.net/v3/${MAILGUN_DOMAIN}/messages`
    const mailgunResponse = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
      },
      body: formData
    })

    const responseData = await mailgunResponse.json()

    if (!mailgunResponse.ok) {
      console.error('Mailgun error:', responseData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: responseData }),
        { status: mailgunResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log successful send
    console.log('Email sent successfully:', responseData)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', id: responseData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
