// Simple auth hook - easy to understand

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    checkUser();

    // Listen for login/logout
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // Check current session
  async function checkUser() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      loadProfile(data.session.user.id);
    } else {
      setLoading(false);
    }
  }

  // Load user profile from database
  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setUser(data);
    setLoading(false);
  }

  // Send OTP to email
  async function sendOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error };
  }

  // Verify OTP code
  async function verifyOtp(email: string, code: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    return { error };
  }

  // Sign out
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, sendOtp, verifyOtp, signOut };
}
