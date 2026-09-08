import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AccessDeniedProps {
  requiredRole?: 'admin' | 'editor';
  title?: string;
  description?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredRole = 'editor',
  title,
  description,
}) => {
  const { user, profile, role, signOut, setDevRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const currentRoleLabel = role ? role.toUpperCase() : 'UNASSIGNED (VIEWER)';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition-transform">
            SC
          </div>
          <span className="font-bold tracking-tight text-sm uppercase">SCRiLLO / SECURITY</span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Portfolio</span>
        </Link>
      </div>

      {/* Center Access Denied Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-3xl border border-border bg-surface p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />

          {/* Icon Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-500">
                HTTP 403 • FORBIDDEN
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {title || 'Access Denied'}
              </h1>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {description ||
                `Your account does not have sufficient role clearance to access this area. Requires "${requiredRole.toUpperCase()}" privileges.`}
            </p>
          </div>

          {/* User Account Details Pill */}
          <div className="p-4 rounded-2xl border border-border bg-background space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-muted">AUTHENTICATED USER</span>
              <span className="font-bold text-foreground truncate max-w-[200px]">
                {user?.email || 'Authenticated User'}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border/50 pt-2">
              <span className="text-muted">ASSIGNED ROLE</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  role === 'admin'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : role === 'editor'
                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                }`}
              >
                {currentRoleLabel}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-surface border border-border/80 text-[11px] text-muted space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-muted shrink-0" />
              <span>Row Level Security (RLS) Active</span>
            </p>
            <p className="leading-relaxed">
              New accounts start in restricted Viewer mode. To grant access, an administrator must assign an <code>admin</code> or <code>editor</code> role in the <code>profiles</code> table.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-3 px-4 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </button>

            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl border border-border bg-background text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>
          </div>

          {/* Development Role Switcher for Testing (when Supabase is offline/local) */}
          {!isSupabaseConfigured && setDevRole && (
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-[10px] font-mono text-muted uppercase text-center">
                Dev Environment Role Switcher
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['viewer', 'editor', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setDevRole(r);
                      navigate(0);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold uppercase border transition-all ${
                      role === r
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border bg-background text-muted hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] font-mono text-muted z-10">
        SCRiLLO Portfolio Architecture • Protected by Supabase Row Level Security
      </div>
    </div>
  );
};

export default AccessDenied;
