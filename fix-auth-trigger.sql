-- Fix Auth Trigger for RecruitBridge
-- This creates a user profile automatically when someone signs up
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/frabthrbowszsqsjykmy/sql

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, onboarding_completed, tour_progress)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    false,
    'not_started'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Success message
SELECT 'Auth trigger created successfully! Users will now be auto-created in public.users table.' as result;
