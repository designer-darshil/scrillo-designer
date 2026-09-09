import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  icon,
  onClose,
  children,
  className,
  ...props
}) => {
  const variantStyles: Record<AlertVariant, { container: string; text: string; icon: React.ReactNode }> = {
    info: {
      container: 'bg-[var(--color-status-info-bg)] border-[var(--color-status-info-border)]',
      text: 'text-[var(--color-status-info-text)]',
      icon: <Info className="w-4 h-4 text-[var(--color-status-info-text)] shrink-0" aria-hidden="true" />,
    },
    success: {
      container: 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success-border)]',
      text: 'text-[var(--color-status-success-text)]',
      icon: <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success-text)] shrink-0" aria-hidden="true" />,
    },
    warning: {
      container: 'bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)]',
      text: 'text-[var(--color-status-warning-text)]',
      icon: <AlertTriangle className="w-4 h-4 text-[var(--color-status-warning-text)] shrink-0" aria-hidden="true" />,
    },
    error: {
      container: 'bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)]',
      text: 'text-[var(--color-status-error-text)]',
      icon: <AlertCircle className="w-4 h-4 text-[var(--color-status-error-text)] shrink-0" aria-hidden="true" />,
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        'w-full p-4 rounded-xl border flex items-start gap-3 shadow-xs',
        current.container,
        className
      )}
      {...props}
    >
      <div className="mt-0.5">{icon || current.icon}</div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('text-sm font-semibold tracking-tight', current.text)}>
            {title}
          </h4>
        )}
        <div className={cn('text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed', !title && current.text)}>
          {children}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
