import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  className,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    neutral:
      'bg-[var(--color-background-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-default)]',
    success:
      'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success-border)]',
    warning:
      'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)] border-[var(--color-status-warning-border)]',
    error:
      'bg-[var(--color-status-error-bg)] text-[var(--color-status-error-text)] border-[var(--color-status-error-border)]',
    info:
      'bg-[var(--color-status-info-bg)] text-[var(--color-status-info-text)] border-[var(--color-status-info-border)]',
  };

  const dotStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-[var(--color-text-tertiary)]',
    success: 'bg-[var(--color-status-success-text)]',
    warning: 'bg-[var(--color-status-warning-text)]',
    error: 'bg-[var(--color-status-error-text)]',
    info: 'bg-[var(--color-status-info-text)]',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-1.5 py-0.2 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono font-medium border select-none tracking-tight shrink-0',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
