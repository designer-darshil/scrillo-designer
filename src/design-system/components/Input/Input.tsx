import React, { useId } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      success,
      optional = false,
      leftIcon,
      rightIcon,
      disabled,
      readOnly,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const successId = `${id}-success`;

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    const describedBy = [
      hasError ? errorId : null,
      hasSuccess ? successId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={id}
              className="text-xs font-semibold text-[var(--color-text-primary)] select-none flex items-center gap-1.5"
            >
              <span>{label}</span>
              {optional && (
                <span className="text-[11px] font-normal text-[var(--color-text-tertiary)] font-mono">
                  (Optional)
                </span>
              )}
            </label>
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[var(--color-text-tertiary)] shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={hasError}
            aria-describedby={describedBy || undefined}
            className={cn(
              'w-full min-h-[40px] px-3.5 py-2 text-sm rounded-xl font-normal transition-all',
              'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]',
              'border border-[var(--color-border-default)]',
              'placeholder:text-[var(--color-text-tertiary)]/70',
              'focus:outline-2 focus:outline-[var(--color-focus-default)] focus:outline-offset-2 focus:border-[var(--color-border-strong)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-background-primary)]',
              'read-only:bg-[var(--color-background-primary)] read-only:cursor-default',
              leftIcon ? 'pl-10' : '',
              rightIcon || hasError || hasSuccess ? 'pr-10' : '',
              hasError &&
                'border-[var(--color-status-error-text)] focus:outline-[var(--color-status-error-text)] bg-[var(--color-status-error-bg)]',
              hasSuccess &&
                'border-[var(--color-status-success-text)] focus:outline-[var(--color-status-success-text)]',
              className
            )}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1 pointer-events-none text-[var(--color-text-tertiary)] shrink-0">
            {hasError ? (
              <AlertCircle className="w-4 h-4 text-[var(--color-status-error-text)]" aria-hidden="true" />
            ) : hasSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-[var(--color-status-success-text)]" aria-hidden="true" />
            ) : (
              rightIcon
            )}
          </div>
        </div>

        {hasError && (
          <p id={errorId} className="text-xs text-[var(--color-status-error-text)] flex items-center gap-1 font-medium mt-0.5">
            <span aria-hidden="true">✕</span> {error}
          </p>
        )}

        {!hasError && hasSuccess && (
          <p id={successId} className="text-xs text-[var(--color-status-success-text)] flex items-center gap-1 font-medium mt-0.5">
            <span aria-hidden="true">✓</span> {success}
          </p>
        )}

        {!hasError && !hasSuccess && helperText && (
          <p id={helperId} className="text-[12px] text-[var(--color-text-tertiary)] mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
