import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  canPublish: boolean;
  canManageSettings: boolean;
  canDelete: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setDevRole?: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile and role from Supabase 'profiles' table
  const loadProfile = useCallback(async (authUser: User | null): Promise<UserProfile | null> => {
    if (!authUser) return null;

    if (!isSupabaseConfigured) {
      // Offline/Local development fallback (strictly isolated)
      const storedRole = (localStorage.getItem('scrillo_auth_dev_role') as UserRole) || 'admin';
      return {
        id: authUser.id,
        email: authUser.email || 'admin@scrillo.design',
        role: storedRole,
        displayName: storedRole === 'admin' ? 'System Administrator' : 'Content Editor',
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error || !data) {
        // If profile doesn't exist or is unassigned, treat strictly as viewer (no admin access)
        return {
          id: authUser.id,
          email: authUser.email || '',
          role: 'viewer',
        };
      }

      const validRole: UserRole =
        data.role === 'admin' || data.role === 'editor' ? data.role : 'viewer';

      return {
        id: data.id,
        email: data.email || authUser.email || '',
        role: validRole,
        displayName: data.display_name || data.full_name,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
      };
    } catch {
      return {
        id: authUser.id,
        email: authUser.email || '',
        role: 'viewer',
      };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await loadProfile(user);
      setProfile(p);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (isMounted) {
            setSession(currentSession);
            const currentUser = currentSession?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
              const p = await loadProfile(currentUser);
              if (isMounted) setProfile(p);
            } else {
              setProfile(null);
            }
          }
        } catch {
          if (isMounted) {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } finally {
          if (isMounted) setLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
          if (isMounted) {
            setSession(currentSession);
            const currentUser = currentSession?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
              const p = await loadProfile(currentUser);
              if (isMounted) setProfile(p);
            } else {
              setProfile(null);
            }
            setLoading(false);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Development local fallback session
        const devEmail = 'admin@scrillo.design';
        const dummyUser: any = {
          id: 'dev-user-001',
          email: devEmail,
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        };
        const p = await loadProfile(dummyUser);
        if (isMounted) {
          setUser(dummyUser);
          setProfile(p);
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [loadProfile]);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | Error | null }> => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Local dev login fallback
        const dummyUser: any = {
          id: 'dev-user-001',
          email,
          aud: 'authenticated',
          role: 'authenticated',
        };
        const p = await loadProfile(dummyUser);
        setUser(dummyUser);
        setProfile(p);
        setLoading(false);
        return { error: null };
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
      const userProf = await loadProfile(data.user);
      setProfile(userProf);
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
      // Ignore network errors on signout
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
    }
  };

  // Helper for development testing of roles
  const setDevRole = (newRole: UserRole) => {
    localStorage.setItem('scrillo_auth_dev_role', newRole);
    if (profile) {
      setProfile({ ...profile, role: newRole });
    }
  };

  const role = profile?.role ?? null;
  const isAdmin = role === 'admin';
  const isEditor = role === 'admin' || role === 'editor';
  const canPublish = isAdmin;
  const canManageSettings = isAdmin;
  const canDelete = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        isAdmin,
        isEditor,
        canPublish,
        canManageSettings,
        canDelete,
        signIn,
        signOut,
        refreshProfile,
        setDevRole,
      }}
    >
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
