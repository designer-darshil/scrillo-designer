import React, { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

export interface DropdownItemProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface DropdownProps {
  trigger: React.ReactElement;
  align?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  align = 'right',
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);

  // Keyboard navigation within the menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
    if (!items || items.length === 0) return;

    const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      items[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      items[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
      firstItem?.focus();
    }
  }, [isOpen]);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    onClick: (e: React.MouseEvent) => {
      trigger.props.onClick?.(e);
      setIsOpen(!isOpen);
    },
    onKeyDown: handleKeyDown,
  });

  return (
    <div ref={containerRef} className="relative inline-block text-left" onKeyDown={handleKeyDown}>
      {clonedTrigger}

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          tabIndex={-1}
          aria-orientation="vertical"
          className={cn(
            'absolute z-50 mt-1.5 w-56 rounded-xl border p-1 shadow-lg backdrop-blur-md',
            'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border-[var(--color-border-default)]',
            'animate-in fade-in zoom-in-95 duration-100 focus:outline-none',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            className
          )}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onSelect: () => setIsOpen(false),
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export const DropdownItem: React.FC<DropdownItemProps & { onSelect?: () => void }> = ({
  onClick,
  onSelect,
  icon,
  disabled = false,
  destructive = false,
  children,
  className,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    onSelect?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-left transition-colors font-medium cursor-pointer',
        'focus-visible:outline-none focus:bg-[var(--color-background-elevated)] focus:text-[var(--color-text-primary)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        destructive
          ? 'text-[var(--color-status-error-text)] hover:bg-[var(--color-status-error-bg)]'
          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)]',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
};

export const DropdownDivider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('h-px my-1 bg-[var(--color-border-subtle)]', className)} role="separator" />
);
