import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminLogin: React.FC = () => {
  const { user, signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('darshilbhuva4322@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter an authorized email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message || 'Invalid administrator credentials. Please check your email and password.');
    } else {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 select-none transition-colors duration-300">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,var(--text)_1px,transparent_1px),linear-gradient(to_bottom,var(--text)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-md border border-border bg-surface p-8 sm:p-10 space-y-8 shadow-2xl">
        {/* Header Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-foreground" />
              <span>SECURITY GATEWAY</span>
            </div>
            <span className="font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 uppercase">
              ADMIN v1.0
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold uppercase tracking-tight text-foreground">
            SCRiLLO ADMIN
          </h1>
          <p className="font-mono text-xs text-muted leading-relaxed">
            Authorized access only. Enter administrative credentials to manage portfolio content and repositories.
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/40 text-red-400 font-mono text-xs leading-relaxed animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wider">Authentication Error</p>
              <p className="text-red-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Supabase Not Configured Notice */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] leading-relaxed">
            <span className="font-bold block uppercase mb-1">Notice: Backend Configuration</span>
            Supabase environment variables (<code className="text-amber-200">VITE_SUPABASE_URL</code>) are not configured. Please add them to your <code className="text-amber-200">.env</code> file.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          <div className="space-y-2">
            <label className="text-muted uppercase tracking-wider block">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="darshilbhuva4322@gmail.com"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-background border border-border text-foreground focus:border-foreground focus:outline-none transition-colors rounded-none placeholder:text-muted/40"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-muted uppercase tracking-wider block">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="flex items-center gap-1 text-[11px] text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-background border border-border text-foreground focus:border-foreground focus:outline-none transition-colors rounded-none placeholder:text-muted/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 min-h-[48px] flex items-center justify-between px-6 py-3.5 bg-foreground text-background font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'SIGN IN'}</span>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>SUPABASE AUTH</span>
          </span>
          <a href="/" className="hover:text-foreground underline underline-offset-4 transition-colors">
            Return to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
