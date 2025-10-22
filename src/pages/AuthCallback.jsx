import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      console.log('[AuthCallback] Starting session exchange...');

      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.search
      );

      if (error) {
        console.error('[AuthCallback] Error:', error.message);
        navigate('/login');
        return;
      }

      console.log('[AuthCallback] Success! Session:', data.session?.user?.email);
      navigate('/dashboard');
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Signing you in…</p>
      </div>
    </div>
  );
}
