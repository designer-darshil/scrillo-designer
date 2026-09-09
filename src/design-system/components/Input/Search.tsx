import React, { useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  containerClassName?: string;
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = 'Search...',
      className,
      containerClassName,
      disabled,
      'aria-label': ariaLabel = 'Search',
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const hasValue = Boolean(value && String(value).length > 0);

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create synthetic event
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      if (internalRef.current) {
        internalRef.current.focus();
      }
    };

    return (
      <div className={cn('relative flex items-center w-full', containerClassName)}>
        <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--color-text-tertiary)] shrink-0">
          <SearchIcon className="w-4 h-4" aria-hidden="true" />
        </div>

        <input
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
          }}
          type="search"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            'w-full min-h-[40px] pl-10 pr-10 py-2 text-sm rounded-xl font-normal transition-all',
            'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]',
            'border border-[var(--color-border-default)]',
            'placeholder:text-[var(--color-text-tertiary)]/70',
            'focus:outline-2 focus:outline-[var(--color-focus-default)] focus:outline-offset-2 focus:border-[var(--color-border-strong)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />

        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Search.displayName = 'Search';
