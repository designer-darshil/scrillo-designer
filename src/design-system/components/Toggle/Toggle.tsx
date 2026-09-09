import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  helperText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  helperText,
  disabled = false,
  size = 'md',
  id: customId,
  className,
  'aria-label': ariaLabel,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className={cn('inline-flex items-center justify-between gap-3', className)}>
      {(label || helperText) && (
        <label
          htmlFor={id}
          className={cn(
            'flex flex-col cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label && <span className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">{label}</span>}
          {helperText && <span className="text-[11px] sm:text-xs text-[var(--color-text-tertiary)]">{helperText}</span>}
        </label>
      )}

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={ariaLabel || (typeof label === 'string' ? label : 'Toggle')}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
          'focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isSmall ? 'h-5 w-9' : 'h-6 w-11',
          checked
            ? 'bg-[var(--color-action-primary)]'
            : 'bg-[var(--color-background-elevated)] border border-[var(--color-border-strong)]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-[var(--color-background-primary)] shadow-sm transform transition-transform duration-200 ease-in-out',
            checked ? 'bg-[var(--color-background-primary)]' : 'bg-[var(--color-text-primary)]',
            isSmall ? 'h-4 w-4 mt-0.5 ml-0.5' : 'h-5 w-5 mt-0.5 ml-0.5',
            checked
              ? isSmall
                ? 'translate-x-4'
                : 'translate-x-5'
              : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
