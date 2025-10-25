// Supabase Client for RecruitBridge
// This replaces base44Client.js with Supabase backend

import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials! Make sure you have .env.local file with:');
  console.error('VITE_SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=eyJhbGc...');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Auth Helper Functions
// ============================================

// Hardcoded redirect URL to avoid apex domain issues
const REDIRECT_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5173/auth/callback'
  : 'https://www.recruitbridge.app/auth/callback';

const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!user) return null;

    // Get extended user data from users table
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return userData || {
      id: user.id,
      email: user.email,
      plan: 'free',
      onboarding_completed: false,
      tour_progress: 'not_started'
    };
  },

  async login() {
    // Sign in with Google OAuth (default)
    const { data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: REDIRECT_URL
      }
    });
    if (error) throw error;
    return data;
  },

  async signUp(email, password) {
    // Sign up with email/password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: REDIRECT_URL
      }
    });
    if (error) throw error;
    return data;
  },

  async signInWithEmail(email, password) {
    // Sign in with email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/';
  },

  async updateMyUserData(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================
// Entity Helper Functions (Generic CRUD)
// ============================================
function createEntityHelper(tableName) {
  return {
    async all() {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      if (error) throw error;
      return data || [];
    },

    async list(orderBy = 'created_at', limit = 100) {
      let query = supabase.from(tableName).select('*');

      if (orderBy.startsWith('-')) {
        query = query.order(orderBy.substring(1), { ascending: false });
      } else {
        query = query.order(orderBy, { ascending: true });
      }

      query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async filter(params) {
      let query = supabase.from(tableName).select('*');

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async get(id) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    async create(payload) {
      // Add created_by if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !payload.created_by) {
        payload.created_by = user.email;

        // Only add user_id for tables that have this column
        // Tables like coach_contacts use athlete_id instead
        const tablesWithUserId = ['targeted_schools', 'athletes', 'outreach'];
        if (tablesWithUserId.includes(tableName)) {
          payload.user_id = user.id;
        }
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id, payload) {
      const { data, error } = await supabase
        .from(tableName)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  };
}

// ============================================
// Export Entity Helpers
// ============================================
export const User = {
  ...auth,
  ...createEntityHelper('users')
};

export const Athlete = createEntityHelper('athletes');
export const School = createEntityHelper('schools');
export const Coach = createEntityHelper('coaches');
export const TargetedSchool = createEntityHelper('targeted_schools');
export const CoachContact = createEntityHelper('coach_contacts');
export const Outreach = createEntityHelper('outreach');
export const EmailIdentity = createEntityHelper('email_identities');
export const Mailbox = createEntityHelper('mailboxes');
export const MailThread = createEntityHelper('mail_threads');
export const Message = createEntityHelper('messages');

// ============================================
// Integration Helpers (for file upload, AI, etc.)
// ============================================
export const UploadFile = async ({ file }) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return { file_url: publicUrl };
};

// For AI integration - Using Claude API via Anthropic
export const InvokeLLM = async ({ prompt, add_context_from_internet, response_json_schema }) => {
  try {
    // Use Claude API key from environment
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.warn('No VITE_ANTHROPIC_API_KEY found in environment');
      // Return a helpful template instead
      return generateEmailTemplate(prompt);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.content[0].text;

    // If response_json_schema is provided, parse as JSON
    if (response_json_schema) {
      return JSON.parse(generatedText);
    }

    return generatedText;
  } catch (error) {
    console.error('InvokeLLM error:', error);
    // Fallback to template generation
    return generateEmailTemplate(prompt);
  }
};

// Helper function to generate email templates when AI is unavailable
function generateEmailTemplate(prompt) {
  // Extract athlete info from prompt if possible
  const nameMatch = prompt.match(/name is ([^,]+)/i);
  const sportMatch = prompt.match(/sport.*?:\s*([^\n]+)/i);
  const athleteName = nameMatch ? nameMatch[1] : '[Your Name]';
  const sport = sportMatch ? sportMatch[1] : '[Your Sport]';

  return `Subject: ${sport} Recruit - ${athleteName}

Dear Coach [Coach's Name],

My name is ${athleteName}, and I am a ${sport} athlete interested in your program at [College Name]. I am reaching out to express my strong interest in joining your team.

I believe my skills, work ethic, and dedication would make me a valuable addition to your program. I would love the opportunity to discuss how I can contribute to your team's success.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${athleteName}`;
}

// For email sending - needs to be implemented via Edge Functions or external service
export const SendEmail = async (params) => {
  console.warn('SendEmail needs to be implemented with Supabase Edge Functions or email service');
  return { success: true };
};

// ============================================
// Checkout function (for Stripe integration)
// ============================================
export const checkout = async ({ plan, userId, email }) => {
  // This needs to be implemented as a Supabase Edge Function
  // For now, redirect to Stripe payment page
  console.warn('Checkout needs to be implemented as Supabase Edge Function');
  return {
    data: {
      url: 'https://stripe.com' // Replace with actual Stripe checkout URL
    }
  };
};

// Export supabase client for direct access if needed
export { supabase };

// Export default object matching Base44 structure
export default {
  auth,
  entities: {
    Athlete,
    School,
    Coach,
    TargetedSchool,
    CoachContact,
    Outreach,
    EmailIdentity,
    Mailbox,
    MailThread,
    Message
  },
  integrations: {
    Core: {
      InvokeLLM,
      SendEmail,
      UploadFile
    }
  },
  functions: {
    checkout
  }
};
