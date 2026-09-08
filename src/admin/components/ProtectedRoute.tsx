import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccessDenied } from '../pages/AccessDenied';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'admin' | 'editor';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'editor',
}) => {
  const { user, role, isAdmin, isEditor, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 space-y-4 select-none">
        <div className="w-8 h-8 border border-border flex items-center justify-center bg-surface animate-spin">
          <Loader2 className="w-4 h-4 text-foreground" />
        </div>
        <p className="font-mono text-xs text-muted tracking-widest uppercase animate-pulse">
          VERIFYING ROLE PERMISSIONS...
        </p>
      </div>
    );
  }

  // 1. Not signed in at all -> redirect to Login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 2. User has no editor or admin clearance (e.g. viewer / unassigned)
  if (!isEditor) {
    return (
      <AccessDenied
        requiredRole="editor"
        title="Admin Portal Access Restricted"
        description="Your authenticated account does not have permission to access the SCRiLLO administration portal. An administrator must assign you an 'admin' or 'editor' role."
      />
    );
  }

  // 3. Route explicitly requires 'admin' (e.g. Settings, System Configuration) but user is an 'editor'
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <AccessDenied
        requiredRole="admin"
        title="Administrator Clearance Required"
        description="This section contains critical system settings and is restricted to accounts with Administrator privileges."
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
