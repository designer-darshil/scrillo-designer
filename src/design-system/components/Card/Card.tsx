import React from 'react';
import { cn } from '../../utils/cn';

export type CardVariant = 'default' | 'interactive' | 'selected' | 'muted';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive = false, className, children, ...props }, ref) => {
    const isInteractive = interactive || variant === 'interactive';

    const variantStyles: Record<CardVariant, string> = {
      default:
        'bg-[var(--color-background-secondary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]',
      interactive:
        'bg-[var(--color-background-secondary)] border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] cursor-pointer transition-all',
      selected:
        'bg-[var(--color-background-secondary)] border-[var(--color-action-primary)] ring-1 ring-[var(--color-action-primary)] text-[var(--color-text-primary)]',
      muted:
        'bg-[var(--color-background-primary)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border p-5 shadow-xs transition-colors',
          variantStyles[variant],
          isInteractive &&
            'focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-2',
          className
        )}
        tabIndex={isInteractive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />;

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={cn('text-base font-semibold leading-none tracking-tight text-[var(--color-text-primary)]', className)}
    {...props}
  />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p className={cn('text-xs text-[var(--color-text-tertiary)]', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('pt-0', className)} {...props} />;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex items-center pt-4 border-t border-[var(--color-border-subtle)] mt-4', className)}
    {...props}
  />
);
