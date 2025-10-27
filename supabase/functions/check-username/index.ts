// Supabase Edge Function to check username availability
// Deploy with: supabase functions deploy check-username

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get request body
    const { username } = await req.json()

    // Validate username format
    if (!username || typeof username !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check username format: 3-64 characters, lowercase letters, numbers, dots, dashes
    const usernameRegex = /^[a-z0-9._-]{3,64}$/
    if (!usernameRegex.test(username)) {
      return new Response(
        JSON.stringify({
          available: false,
          error: 'Invalid username format. Use 3-64 characters: lowercase letters, numbers, dots, or dashes only.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if username exists in database
    const { data, error } = await supabaseClient
      .from('email_identities')
      .select('username')
      .eq('username', username)
      .eq('domain', 'recruitbridge.net')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database error checking username' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Username is taken if we found a record
    const available = !data

    return new Response(
      JSON.stringify({
        available,
        username,
        message: available ? 'Username is available' : 'Username is already taken'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error checking username:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
