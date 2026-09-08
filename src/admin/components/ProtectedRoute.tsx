import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 space-y-4 select-none">
        <div className="w-8 h-8 border border-border flex items-center justify-center bg-surface animate-spin">
          <Loader2 className="w-4 h-4 text-foreground" />
        </div>
        <p className="font-mono text-xs text-muted tracking-widest uppercase animate-pulse">
          VERIFYING SESSION...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
