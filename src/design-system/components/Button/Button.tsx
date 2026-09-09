import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'text'
  | 'icon'
  | 'outline'
  | 'danger'
  | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonContext = 'admin' | 'public';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  context?: ButtonContext;
  loading?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      context = 'admin',
      loading = false,
      isLoading = false,
      loadingText,
      icon,
      leftIcon,
      rightIcon,
      iconPosition = 'left',
      disabled,
      children,
      className,
      type = 'button',
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const isBusy = loading || isLoading;
    const isDisabled = disabled || isBusy;

    // Handle click to prevent double submissions when loading or disabled
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // Base Styles
    const baseClasses =
      'relative inline-flex items-center justify-center font-medium transition-all select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    // Size Classes
    const sizeClasses: Record<ButtonSize, string> = {
      xs: variant === 'icon' ? 'w-7 h-7 p-1 rounded-md' : 'min-h-[28px] px-2.5 py-0.5 text-[11px] rounded-lg gap-1',
      sm: variant === 'icon' ? 'w-8 h-8 p-1.5 rounded-lg' : 'min-h-[32px] px-3 py-1 text-xs rounded-lg gap-1.5',
      md: variant === 'icon' ? 'w-10 h-10 p-2 rounded-xl' : 'min-h-[40px] px-4 py-2 text-sm rounded-xl gap-2',
      lg: variant === 'icon' ? 'w-12 h-12 p-3 rounded-xl' : 'min-h-[48px] px-6 py-2.5 text-base rounded-xl gap-2.5',
    };

    // Variant Classes
    let variantClasses = '';
    if (variant === 'primary') {
      variantClasses =
        context === 'public'
          ? 'bg-[var(--color-text-primary)] text-[var(--color-background-primary)] hover:bg-[var(--color-action-primary-hover)] active:bg-[var(--color-action-primary-active)] font-semibold uppercase tracking-wider'
          : 'bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-action-primary-hover)] active:bg-[var(--color-action-primary-active)] shadow-xs font-semibold';
    } else if (variant === 'secondary' || variant === 'outline') {
      variantClasses =
        'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-background-elevated)] hover:border-[var(--color-border-strong)] active:bg-[var(--color-background-primary)]';
    } else if (variant === 'tertiary' || variant === 'ghost') {
      variantClasses =
        'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]';
    } else if (variant === 'destructive' || variant === 'danger') {
      variantClasses =
        'bg-[var(--color-status-error-bg)] text-[var(--color-status-error-text)] border border-[var(--color-status-error-border)] hover:bg-[var(--color-status-error-text)] hover:text-white active:opacity-90';
    } else if (variant === 'text') {
      variantClasses =
        'bg-transparent text-[var(--color-text-primary)] hover:underline p-0 min-h-0';
    } else if (variant === 'icon') {
      variantClasses =
        'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-background-elevated)] hover:border-[var(--color-border-strong)] active:bg-[var(--color-background-primary)] shrink-0';
    }

    const resolvedLeftIcon = leftIcon || (iconPosition === 'left' ? icon : null);
    const resolvedRightIcon = rightIcon || (iconPosition === 'right' ? icon : null);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isBusy}
        aria-label={variant === 'icon' ? ariaLabel || 'Action' : ariaLabel}
        onClick={handleClick}
        className={cn(baseClasses, sizeClasses[size], variantClasses, className)}
        {...props}
      >
        {isBusy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{loadingText || (variant !== 'icon' && children) || 'Loading...'}</span>
          </>
        ) : (
          <>
            {resolvedLeftIcon && <span className="shrink-0">{resolvedLeftIcon}</span>}
            {variant !== 'icon' && children && <span>{children}</span>}
            {variant === 'icon' && (resolvedLeftIcon || resolvedRightIcon || children)}
            {resolvedRightIcon && <span className="shrink-0">{resolvedRightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
