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
  // Extract athlete info from prompt
  const nameMatch = prompt.match(/Name:\s*([^\n]+)/i);
  const sportMatch = prompt.match(/Sport:\s*([^\n]+)/i);
  const positionMatch = prompt.match(/Position:\s*([^\n]+)/i);
  const gradYearMatch = prompt.match(/Grad Year:\s*([^\n]+)/i);
  const gpaMatch = prompt.match(/GPA:\s*([^\n]+)/i);
  const statsMatch = prompt.match(/Key Stats\/Achievements:\s*([^\n]+)/i);

  const athleteName = nameMatch ? nameMatch[1].trim() : '[Your Name]';
  const sport = sportMatch ? sportMatch[1].trim() : '[Your Sport]';
  const position = positionMatch ? positionMatch[1].trim() : '[Your Position]';
  const gradYear = gradYearMatch ? gradYearMatch[1].trim() : '[Grad Year]';
  const gpa = gpaMatch ? gpaMatch[1].trim() : '';
  const stats = statsMatch ? statsMatch[1].trim() : '';

  // Create attention-grabbing subject based on available info
  let subject = `${position} | ${athleteName} - Class of ${gradYear}`;
  if (stats && stats.length > 10) {
    subject = `${stats.substring(0, 40)}... | ${athleteName}`;
  }

  return `Subject: ${subject}

Dear Coach [Coach's Name],

${stats ? `${stats} - that's my track record, and I'm ready to bring that same intensity to [College Name].` : `I'm ${athleteName}, a ${position} from [High School], and I'm ready to make an impact at [College Name].`}

Your program's ${sport} style aligns perfectly with my strengths. ${gpa ? `I maintain a ${gpa} GPA while competing at the highest level,` : 'I excel both on the field and in the classroom,'} proving I can handle the demands of college athletics.

I'd love to send you my film and discuss how I can contribute to your program's success. When's a good time for a quick call this week?

Best regards,
${athleteName}
${position} | Class of ${gradYear}
[Your Phone] | [Your Email]`;
}

// For email sending - uses Supabase Edge Function with Mailgun
export const SendEmail = async ({ to, from, subject, text, html }) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, from, subject, text, html }
    });

    if (error) {
      console.error('SendEmail error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
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
