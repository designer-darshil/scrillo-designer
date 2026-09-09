import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Button, Card, Badge } from '../../design-system';

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
  const { user, role, signOut, setDevRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const currentRoleLabel = role ? role.toUpperCase() : 'UNASSIGNED (VIEWER)';

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between z-10 max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition-transform">
            SC
          </div>
          <span className="font-bold tracking-tight text-sm uppercase">SCRiLLO / SECURITY</span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Portfolio</span>
        </Link>
      </div>

      {/* Center Access Denied Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <Card className="p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden border-[var(--color-border-strong)]">
          {/* Icon Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] text-[var(--color-status-error-text)] flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--color-status-error-text)]">
                HTTP 403 • FORBIDDEN
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {title || 'Access Denied'}
              </h1>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {description ||
                `Your account does not have sufficient role clearance to access this area. Requires "${requiredRole.toUpperCase()}" privileges.`}
            </p>
          </div>

          {/* User Account Details Pill */}
          <div className="p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-primary)] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-tertiary)]">AUTHENTICATED USER</span>
              <span className="font-bold text-[var(--color-text-primary)] truncate max-w-[200px]">
                {user?.email || 'Authenticated User'}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-2">
              <span className="text-[var(--color-text-tertiary)]">ASSIGNED ROLE</span>
              <Badge
                variant={role === 'admin' ? 'success' : role === 'editor' ? 'info' : 'neutral'}
                size="sm"
              >
                {currentRoleLabel}
              </Badge>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[11px] text-[var(--color-text-secondary)] space-y-1">
            <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] shrink-0" />
              <span>Row Level Security (RLS) Active</span>
            </p>
            <p className="leading-relaxed">
              New accounts start in restricted Viewer mode. To grant access, an administrator must assign an <code>admin</code> or <code>editor</code> role in the <code>profiles</code> table.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSignOut}
              className="w-full text-xs font-bold uppercase tracking-wider gap-2"
              icon={<LogOut className="w-4 h-4" />}
            >
              Sign Out & Switch Account
            </Button>

            <Link to="/" className="block">
              <Button
                variant="secondary"
                size="md"
                className="w-full text-xs font-semibold gap-1.5"
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Return to Portfolio
              </Button>
            </Link>
          </div>

          {/* Development Role Switcher */}
          {!isSupabaseConfigured && setDevRole && (
            <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-2">
              <p className="text-[10px] font-mono text-[var(--color-text-tertiary)] uppercase text-center">
                Dev Environment Role Switcher
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['viewer', 'editor', 'admin'] as UserRole[]).map((r) => (
                  <Button
                    key={r}
                    variant={role === r ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setDevRole(r);
                      navigate(0);
                    }}
                    className="font-mono text-[10px] uppercase"
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] font-mono text-[var(--color-text-tertiary)] z-10">
        SCRiLLO Portfolio Architecture • Protected by Supabase Row Level Security
      </div>
    </div>
  );
};

export default AccessDenied;
