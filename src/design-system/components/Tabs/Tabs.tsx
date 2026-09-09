import React, { createContext, useContext, useId } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextValue {
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children, className }) => {
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ selectedTab: value, onSelectTab: onChange, baseId }}>
      <div className={cn('w-full flex flex-col space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  ariaLabel?: string;
}

export const TabList: React.FC<TabListProps> = ({
  ariaLabel = 'Navigation Tabs',
  className,
  children,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
    if (tabs.length === 0) return;

    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
      tabs[nextIndex]?.focus();
      tabs[nextIndex]?.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
      tabs[prevIndex]?.focus();
      tabs[prevIndex]?.click();
    } else if (e.key === 'Home') {
      e.preventDefault();
      tabs[0]?.focus();
      tabs[0]?.click();
    } else if (e.key === 'End') {
      e.preventDefault();
      tabs[tabs.length - 1]?.focus();
      tabs[tabs.length - 1]?.click();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] overflow-x-auto scrollbar-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({
  value,
  badge,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const isSelected = context.selectedTab === value;
  const tabId = `${context.baseId}-tab-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => context.onSelectTab(value)}
      className={cn(
        'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] focus-visible:outline-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isSelected
          ? 'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-semibold shadow-xs border border-[var(--color-border-strong)]'
          : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)]/50',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            'px-1.5 py-0.2 text-[10px] font-mono rounded-full',
            isSelected
              ? 'bg-[var(--color-text-primary)] text-[var(--color-background-primary)] font-bold'
              : 'bg-[var(--color-background-elevated)] text-[var(--color-text-tertiary)]'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const isSelected = context.selectedTab === value;
  const tabId = `${context.baseId}-tab-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn('focus-visible:outline-none animate-in fade-in duration-150', className)}
      {...props}
    >
      {children}
    </div>
  );
};
