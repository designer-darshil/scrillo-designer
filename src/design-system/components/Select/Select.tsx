import React, { useId } from 'react';
import { ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  options?: SelectOption[];
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      success,
      optional = false,
      options,
      children,
      disabled,
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
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy || undefined}
            className={cn(
              'w-full min-h-[40px] pl-3.5 pr-10 py-2 text-sm rounded-xl font-normal transition-all appearance-none cursor-pointer',
              'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]',
              'border border-[var(--color-border-default)]',
              'focus:outline-2 focus:outline-[var(--color-focus-default)] focus:outline-offset-2 focus:border-[var(--color-border-strong)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-background-primary)]',
              hasError &&
                'border-[var(--color-status-error-text)] focus:outline-[var(--color-status-error-text)] bg-[var(--color-status-error-bg)]',
              hasSuccess &&
                'border-[var(--color-status-success-text)] focus:outline-[var(--color-status-success-text)]',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 flex items-center pointer-events-none text-[var(--color-text-tertiary)] shrink-0">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {hasError && (
          <p id={errorId} className="text-xs text-[var(--color-status-error-text)] flex items-center gap-1 font-medium mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        {!hasError && hasSuccess && (
          <p id={successId} className="text-xs text-[var(--color-status-success-text)] flex items-center gap-1 font-medium mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{success}</span>
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

Select.displayName = 'Select';
