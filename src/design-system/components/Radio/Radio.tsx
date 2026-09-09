import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ id: customId, label, helperText, disabled, className, checked, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
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
            type="radio"
            id={id}
            disabled={disabled}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded-full border transition-all flex items-center justify-center',
              'border-[var(--color-border-strong)] bg-[var(--color-background-secondary)]',
              'peer-checked:border-[var(--color-action-primary)]',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-focus-default)] peer-focus-visible:outline-offset-2',
              className
            )}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--color-action-primary)] opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>

        {(label || helperText) && (
          <div className="flex flex-col">
            {label && <span className="font-medium text-xs sm:text-sm text-[var(--color-text-primary)]">{label}</span>}
            {helperText && <span className="text-[11px] sm:text-xs text-[var(--color-text-tertiary)]">{helperText}</span>}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
