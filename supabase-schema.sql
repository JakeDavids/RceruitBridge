-- RecruitBridge Supabase Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'core', 'unlimited')),
  email_username TEXT,
  email_domain TEXT,
  gmail_linked BOOLEAN DEFAULT false,
  profile_picture_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  tour_progress TEXT DEFAULT 'not_started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ATHLETES TABLE
-- ============================================
CREATE TABLE public.athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by TEXT NOT NULL, -- user email
  user_id UUID REFERENCES public.users(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  height TEXT,
  weight INTEGER,
  position TEXT,
  sport TEXT DEFAULT 'football',
  graduation_year INTEGER,
  gpa DECIMAL(3,2),
  sat_score INTEGER,
  act_score INTEGER,
  forty_time DECIMAL(4,2),
  bench_press INTEGER,
  squat INTEGER,
  vertical_jump DECIMAL(4,1),
  broad_jump TEXT,
  pro_agility DECIMAL(4,2),
  stats JSONB,
  highlights_url TEXT,
  highlights_url_2 TEXT,
  highlights_url_3 TEXT,
  transcript_url TEXT,
  bio TEXT,
  preferred_regions TEXT[],
  target_levels TEXT[],
  academic_achievements TEXT,
  athletic_achievements TEXT,
  community_service TEXT,
  coach_references TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SCHOOLS TABLE
-- ============================================
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  division TEXT,
  conference TEXT,
  academic_ranking TEXT,
  enrollment INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COACHES TABLE
-- ============================================
CREATE TABLE public.coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES public.schools(id),
  name TEXT NOT NULL,
  title TEXT,
  position TEXT,
  email TEXT,
  phone TEXT,
  twitter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TARGETED SCHOOLS TABLE
-- ============================================
CREATE TABLE public.targeted_schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(athlete_id, school_id)
);

-- ============================================
-- COACH CONTACTS TABLE
-- ============================================
CREATE TABLE public.coach_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by TEXT NOT NULL,
  athlete_id UUID REFERENCES public.athletes(id),
  school_id UUID REFERENCES public.schools(id),
  coach_name TEXT NOT NULL,
  coach_title TEXT,
  coach_email TEXT,
  coach_phone TEXT,
  coach_twitter TEXT,
  response_status TEXT DEFAULT 'not_contacted',
  date_contacted DATE,
  last_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- OUTREACH TABLE
-- ============================================
CREATE TABLE public.outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by TEXT NOT NULL,
  athlete_id UUID REFERENCES public.athletes(id),
  school_id UUID REFERENCES public.schools(id),
  coach_contact_id UUID REFERENCES public.coach_contacts(id),
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'draft', -- draft, sent, opened, replied
  sent_date TIMESTAMP WITH TIME ZONE,
  opened_date TIMESTAMP WITH TIME ZONE,
  replied_date TIMESTAMP WITH TIME ZONE,
  next_follow_up DATE,
  priority TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EMAIL IDENTITIES TABLE
-- ============================================
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

-- ============================================
-- MAILBOX TABLES (for Response Center)
-- ============================================
CREATE TABLE public.mailboxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  email_address TEXT NOT NULL,
  provider TEXT DEFAULT 'gmail',
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.mail_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mailbox_id UUID REFERENCES public.mailboxes(id),
  thread_id TEXT,
  subject TEXT,
  participants TEXT[],
  last_message_date TIMESTAMP WITH TIME ZONE,
  unread BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES public.mail_threads(id),
  message_id TEXT,
  from_email TEXT,
  to_email TEXT[],
  subject TEXT,
  body TEXT,
  html_body TEXT,
  received_date TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.targeted_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Schools and Coaches are read-only public data
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Athletes policies
CREATE POLICY "Users can view own athletes" ON public.athletes
  FOR SELECT USING (created_by = auth.jwt()->>'email' OR user_id = auth.uid());

CREATE POLICY "Users can create own athletes" ON public.athletes
  FOR INSERT WITH CHECK (created_by = auth.jwt()->>'email' OR user_id = auth.uid());

CREATE POLICY "Users can update own athletes" ON public.athletes
  FOR UPDATE USING (created_by = auth.jwt()->>'email' OR user_id = auth.uid());

CREATE POLICY "Users can delete own athletes" ON public.athletes
  FOR DELETE USING (created_by = auth.jwt()->>'email' OR user_id = auth.uid());

-- Schools and Coaches are publicly readable
CREATE POLICY "Anyone can view schools" ON public.schools
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view coaches" ON public.coaches
  FOR SELECT USING (true);

-- Targeted Schools policies
CREATE POLICY "Users can manage own targeted schools" ON public.targeted_schools
  FOR ALL USING (
    athlete_id IN (
      SELECT id FROM public.athletes WHERE created_by = auth.jwt()->>'email' OR user_id = auth.uid()
    )
  );

-- Coach Contacts policies
CREATE POLICY "Users can manage own coach contacts" ON public.coach_contacts
  FOR ALL USING (created_by = auth.jwt()->>'email');

-- Outreach policies
CREATE POLICY "Users can manage own outreach" ON public.outreach
  FOR ALL USING (created_by = auth.jwt()->>'email');

-- Email Identities policies
CREATE POLICY "Users can manage own email identities" ON public.email_identities
  FOR ALL USING (user_id = auth.uid());

-- Mailbox policies
CREATE POLICY "Users can manage own mailboxes" ON public.mailboxes
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own mail threads" ON public.mail_threads
  FOR SELECT USING (
    mailbox_id IN (SELECT id FROM public.mailboxes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    thread_id IN (
      SELECT id FROM public.mail_threads WHERE mailbox_id IN (
        SELECT id FROM public.mailboxes WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_athletes_created_by ON public.athletes(created_by);
CREATE INDEX idx_athletes_user_id ON public.athletes(user_id);
CREATE INDEX idx_coach_contacts_created_by ON public.coach_contacts(created_by);
CREATE INDEX idx_outreach_created_by ON public.outreach(created_by);
CREATE INDEX idx_outreach_status ON public.outreach(status);
CREATE INDEX idx_schools_division ON public.schools(division);
CREATE INDEX idx_schools_state ON public.schools(state);
CREATE INDEX idx_coaches_school_id ON public.coaches(school_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON public.athletes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_contacts_updated_at BEFORE UPDATE ON public.coach_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outreach_updated_at BEFORE UPDATE ON public.outreach
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE!
-- ============================================
-- Next steps:
-- 1. Import your schools data
-- 2. Import your coaches data
-- 3. Set up Google OAuth in Supabase Authentication settings
-- 4. Update your app to use Supabase client
