import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Initial session retrieval
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
        if (!error && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user ?? null);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      // 2. Listen to active auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // If Supabase is not configured yet, check for stored auth state or set loading false
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | Error | null }> => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return {
          error: new Error(
            'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
          ),
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      setSession(data.session);
      setUser(data.user);
      setLoading(false);
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: err || new Error('An unexpected authentication error occurred.') };
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore network errors on signOut
    } finally {
      setUser(null);
      setSession(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
