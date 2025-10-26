import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Read environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseServiceRole) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Insert contact
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ email }])
      .select();

    if (error) {
      console.error('Supabase insert failed:', error.message);
      return res.status(500).json({ error: 'Failed to add contact' });
    }

    console.log('Contact added successfully');
    return res.status(200).json({
      success: true,
      message: 'Contact added successfully',
      id: data[0]?.id
    });

  } catch (error) {
    console.error('Unexpected error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
