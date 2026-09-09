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

const SESSION_START_KEY = 'scrillo_session_start_time';
const SESSION_LIFETIME_KEY = 'scrillo_session_lifetime_hours';
const SESSION_MESSAGE_KEY = 'scrillo_auth_message';

export const DEFAULT_SESSION_HOURS = 24; // 24 Hours default session lifetime

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
  sessionLifetimeHours: number;
  setSessionLifetimeHours: (hours: 24 | 48) => void;
  signIn: (email: string, password: string, rememberHours?: 24 | 48) => Promise<{ error: AuthError | Error | null }>;
  signOut: (expiredReason?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setDevRole?: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionLifetimeHours, setSessionLifetimeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SESSION_LIFETIME_KEY);
      return saved ? parseInt(saved, 10) : DEFAULT_SESSION_HOURS;
    } catch {
      return DEFAULT_SESSION_HOURS;
    }
  });

  const setSessionLifetimeHours = useCallback((hours: 24 | 48) => {
    setSessionLifetimeState(hours);
    try {
      localStorage.setItem(SESSION_LIFETIME_KEY, hours.toString());
    } catch {}
  }, []);

  // Check if active session has exceeded the 24/48 hour lifetime limit
  const isSessionExpired = useCallback((): boolean => {
    try {
      const startTimeStr = localStorage.getItem(SESSION_START_KEY);
      if (!startTimeStr) return false;
      const startTime = parseInt(startTimeStr, 10);
      if (isNaN(startTime)) return false;

      const durationMs = sessionLifetimeHours * 60 * 60 * 1000;
      const elapsed = Date.now() - startTime;
      return elapsed > durationMs;
    } catch {
      return false;
    }
  }, [sessionLifetimeHours]);

  // Fetch profile and role from Supabase 'profiles' table
  const loadProfile = useCallback(async (authUser: User | null): Promise<UserProfile | null> => {
    if (!authUser) return null;

    if (!isSupabaseConfigured) {
      // Offline/Local development fallback
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
        return {
          id: authUser.id,
          email: authUser.email || '',
          role: 'admin', // Default to admin for the sole project owner if profiles row not created
        };
      }

      const validRole: UserRole =
        data.role === 'admin' || data.role === 'editor' ? data.role : 'admin';

      return {
        id: data.id,
        email: data.email || authUser.email || '',
        role: validRole,
        displayName: data.display_name || data.full_name || 'Admin',
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
      };
    } catch {
      return {
        id: authUser.id,
        email: authUser.email || '',
        role: 'admin',
      };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await loadProfile(user);
      setProfile(p);
    }
  }, [user, loadProfile]);

  const signOut = useCallback(async (expiredReason?: string): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem(SESSION_START_KEY);
      if (expiredReason) {
        localStorage.setItem(SESSION_MESSAGE_KEY, expiredReason);
      }
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore signout transport errors
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
    }
  }, []);

  // Periodic and on-focus session lifetime watcher
  useEffect(() => {
    if (!user) return;

    const checkSessionExpiry = () => {
      if (isSessionExpired()) {
        console.warn(`[Auth] Session exceeded ${sessionLifetimeHours} hours. Performing automatic logout.`);
        signOut(`Your session expired after ${sessionLifetimeHours} hours. Please sign in again.`);
      }
    };

    // Check on window focus and visibility change
    window.addEventListener('focus', checkSessionExpiry);
    document.addEventListener('visibilitychange', checkSessionExpiry);

    // Periodic check every 30 seconds
    const interval = setInterval(checkSessionExpiry, 30000);

    return () => {
      window.removeEventListener('focus', checkSessionExpiry);
      document.removeEventListener('visibilitychange', checkSessionExpiry);
      clearInterval(interval);
    };
  }, [user, isSessionExpired, sessionLifetimeHours, signOut]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // First check if stored session expired
      if (isSessionExpired()) {
        console.warn('[Auth] Expired session detected during init. Signing out.');
        await signOut(`Your previous session has expired. Please sign in again.`);
        if (isMounted) setLoading(false);
        return;
      }

      if (isSupabaseConfigured) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (isMounted) {
            if (currentSession && !isSessionExpired()) {
              setSession(currentSession);
              const currentUser = currentSession.user;
              setUser(currentUser);
              if (currentUser) {
                const p = await loadProfile(currentUser);
                if (isMounted) setProfile(p);
              }
            } else if (currentSession && isSessionExpired()) {
              await signOut('Your session expired. Please log in again.');
            } else {
              setSession(null);
              setUser(null);
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
            if (currentSession && isSessionExpired()) {
              await signOut('Your session has expired. Please sign in again.');
              return;
            }
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
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [loadProfile, isSessionExpired, signOut]);

  const signIn = async (
    email: string,
    password: string,
    rememberHours?: 24 | 48
  ): Promise<{ error: AuthError | Error | null }> => {
    setLoading(true);
    const effectiveHours = rememberHours || sessionLifetimeHours || DEFAULT_SESSION_HOURS;

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
        localStorage.setItem(SESSION_START_KEY, Date.now().toString());
        localStorage.setItem(SESSION_LIFETIME_KEY, effectiveHours.toString());
        localStorage.removeItem(SESSION_MESSAGE_KEY);
        setSessionLifetimeState(effectiveHours);

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

      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
      localStorage.setItem(SESSION_LIFETIME_KEY, effectiveHours.toString());
      localStorage.removeItem(SESSION_MESSAGE_KEY);
      setSessionLifetimeState(effectiveHours);

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
        sessionLifetimeHours,
        setSessionLifetimeHours,
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
