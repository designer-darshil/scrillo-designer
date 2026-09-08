import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1 placeholder: navigate to dashboard
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md border border-border bg-surface p-8 sm:p-10 space-y-8 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest">
            <Shield className="w-4 h-4 text-foreground" />
            <span>AUTHENTICATION PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold uppercase tracking-tight text-foreground">
            SCRiLLO ADMIN
          </h1>
          <p className="font-mono text-xs text-muted leading-relaxed">
            Enter authorized credentials to manage portfolio content and assets.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs">
          <div className="space-y-2">
            <label className="text-muted uppercase tracking-wider block">Email Address</label>
            <input
              type="email"
              disabled
              value="admin@darshilbhuva.com"
              className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none cursor-not-allowed opacity-80"
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted uppercase tracking-wider block">Password</label>
            <input
              type="password"
              disabled
              value="••••••••••••"
              className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none cursor-not-allowed opacity-80"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-between px-6 py-4 bg-foreground text-background font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            <span>ENTER DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted">
          <span>SUPABASE AUTH READY</span>
          <a href="/" className="hover:text-foreground underline underline-offset-4">
            Return to Public Folio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
