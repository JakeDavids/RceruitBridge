import { useState, useCallback } from 'react';
import { User } from '@/api/entities';
import { supabase } from '@/api/supabaseClient';

export function useRecruitBridgeIdentity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [identity, setIdentity] = useState(null);

  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIdentity(null);
        setLoading(false);
        return;
      }

      // Query email_identities table
      const { data, error: dbError } = await supabase
        .from('email_identities')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          // No identity found
          setIdentity(null);
        } else {
          console.error('Error fetching identity:', dbError);
          setError(dbError.message);
        }
      } else if (data) {
        // Format identity for UI
        setIdentity({
          id: data.id,
          address: `${data.username}@${data.domain}`,
          username: data.username,
          domain: data.domain,
          displayName: data.display_name,
          verified: data.verified
        });
      }
    } catch (err) {
      console.error('Error getting identity:', err);
      setError(err.message);
      setIdentity(null);
    }
    setLoading(false);
  }, []);

  const checkUsername = useCallback(async (username) => {
    try {
      // Validate username format
      const isValid = /^[a-z0-9._-]{3,64}$/.test(username);

      if (!isValid) {
        return {
          ok: true,
          available: false,
          error: 'Invalid username format'
        };
      }

      // Call Supabase Edge Function to check availability
      const { data, error } = await supabase.functions.invoke('check-username', {
        body: { username }
      });

      if (error) {
        console.error('Error checking username:', error);
        return { ok: false, error: error.message };
      }

      return {
        ok: true,
        available: data.available,
        username: data.username,
        message: data.message
      };
    } catch (err) {
      console.error('Error checking username:', err);
      return { ok: false, error: err.message };
    }
  }, []);

  const createIdentity = useCallback(async (username, displayName) => {
    try {
      // Call Supabase Edge Function to create identity in Mailgun and database
      const { data, error } = await supabase.functions.invoke('create-email-identity', {
        body: {
          username,
          displayName
        }
      });

      if (error) {
        console.error('Error creating identity:', error);
        return { ok: false, error: error.message };
      }

      if (!data.success) {
        return { ok: false, error: data.error || 'Failed to create email identity' };
      }

      // Refresh identity after creation
      await getMe();

      return {
        ok: true,
        identity: data.identity
      };
    } catch (err) {
      console.error('Error creating identity:', err);
      return { ok: false, error: err.message };
    }
  }, [getMe]);

  return {
    loading,
    error,
    identity,
    getMe,
    checkUsername,
    createIdentity
  };
}