import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase.js'

import { registerUser, loginUser, logoutUser } from './src/services/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);
    });

    async function initializeSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('Session error', error.message);
      }

      setUser(data?.session?.user ?? null);
      setLoading(false);
    }

    initializeSession();

    return () => {
      mounter = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser
  }
}
