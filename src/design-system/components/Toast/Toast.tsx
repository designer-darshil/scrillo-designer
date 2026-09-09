import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const success = useCallback((message: string, title?: string) => showToast({ variant: 'success', message, title }), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast({ variant: 'error', message, title }), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast({ variant: 'warning', message, title }), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast({ variant: 'info', message, title }), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastSingle key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastSingle: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const duration = toast.duration ?? 4000;
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, isPaused, onDismiss]);

  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success-text)] shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-4 h-4 text-[var(--color-status-error-text)] shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning-text)] shrink-0" aria-hidden="true" />,
    info: <Info className="w-4 h-4 text-[var(--color-status-info-text)] shrink-0" aria-hidden="true" />,
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all',
        'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border-[var(--color-border-default)]',
        'animate-in slide-in-from-bottom-2 fade-in duration-200'
      )}
    >
      <div className="mt-0.5">{icons[toast.variant]}</div>

      <div className="flex-1 min-w-0">
        {toast.title && <h5 className="text-xs font-semibold tracking-tight">{toast.title}</h5>}
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] shrink-0"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
