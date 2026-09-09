import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Button, Input, Alert, Badge, Card } from '../../design-system';

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
    <div className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] flex items-center justify-center p-6 select-none transition-colors duration-300">
      <Card className="relative z-10 w-full max-w-md p-8 sm:p-10 space-y-6 shadow-2xl">
        {/* Header Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-tertiary)] uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[var(--color-text-primary)]" />
              <span>SECURITY GATEWAY</span>
            </div>
            <Badge variant="neutral" size="sm">
              ADMIN v1.0
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
            SCRiLLO ADMIN
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Authorized access only. Enter administrative credentials to manage portfolio content and repositories.
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <Alert variant="error" title="Authentication Error">
            {errorMessage}
          </Alert>
        )}

        {/* Supabase Not Configured Notice */}
        {!isSupabaseConfigured && (
          <Alert variant="warning" title="Backend Configuration Required">
            Supabase environment variables (<code className="font-mono">VITE_SUPABASE_URL</code>) are not configured. Please add them to your <code className="font-mono">.env</code> file.
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Admin Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="darshilbhuva4322@gmail.com"
            disabled={isSubmitting}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-password-input" className="text-xs font-semibold text-[var(--color-text-primary)] select-none">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
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
            <Input
              id="admin-password-input"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="VERIFYING CREDENTIALS..."
            className="w-full mt-4 uppercase tracking-wider font-bold"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            SIGN IN
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between font-mono text-[11px] text-[var(--color-text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>SUPABASE AUTH</span>
          </span>
          <a href="/" className="hover:text-[var(--color-text-primary)] underline underline-offset-4 transition-colors">
            Return to Public Portfolio
          </a>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
