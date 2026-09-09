import React, { useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id: customId, label, helperText, error, disabled, className, checked, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={id}
          className={cn(
            'inline-flex items-start gap-2.5 cursor-pointer select-none text-sm font-normal text-[var(--color-text-primary)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={id}
              disabled={disabled}
              checked={checked}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                'peer sr-only'
              )}
              {...props}
            />
            <div
              className={cn(
                'w-4 h-4 rounded-md border transition-all flex items-center justify-center',
                'border-[var(--color-border-strong)] bg-[var(--color-background-secondary)]',
                'peer-checked:bg-[var(--color-action-primary)] peer-checked:border-[var(--color-action-primary)] peer-checked:text-[var(--color-text-inverse)]',
                'peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-focus-default)] peer-focus-visible:outline-offset-2',
                error && 'border-[var(--color-status-error-text)]',
                className
              )}
            >
              <Check className="w-3 h-3 stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>

          {(label || helperText) && (
            <div className="flex flex-col">
              {label && <span className="font-medium text-xs sm:text-sm text-[var(--color-text-primary)]">{label}</span>}
              {helperText && <span className="text-[11px] sm:text-xs text-[var(--color-text-tertiary)]">{helperText}</span>}
            </div>
          )}
        </label>

        {error && (
          <p id={errorId} className="text-xs text-[var(--color-status-error-text)] ml-6 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
