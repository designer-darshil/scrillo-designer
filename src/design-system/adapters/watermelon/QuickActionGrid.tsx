import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface QuickActionItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  badge?: string;
  shortcut?: string;
}

export interface QuickActionGridProps {
  actions: QuickActionItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  actions,
  columns = 3,
  className,
}) => {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={cn('grid gap-3.5 sm:gap-4', colClass, className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        const content = (
          <>
            {/* Top row: Icon and arrow / shortcut */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] transition-all duration-200 group-hover:border-[var(--color-action-primary)] group-hover:text-[var(--color-action-primary)] group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5">
                {action.shortcut && (
                  <span className="hidden font-mono text-[10px] uppercase text-[var(--color-text-tertiary)] border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)] px-1.5 py-0.5 rounded sm:inline-block">
                    {action.shortcut}
                  </span>
                )}
                {action.badge && (
                  <span className="font-mono text-[10px] uppercase font-semibold text-[var(--color-action-primary)] bg-[var(--color-action-primary)]/10 px-2 py-0.5 rounded-full">
                    {action.badge}
                  </span>
                )}
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-text-primary)]">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-3.5">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-action-primary)] transition-colors">
                {action.label}
              </h4>
              {action.description && (
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              )}
            </div>
          </>
        );

        if (action.href) {
          return (
            <a
              key={action.id}
              href={action.href}
              onClick={action.onClick}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-4.5 transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] active:scale-[0.99] text-left"
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-4.5 transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] active:scale-[0.99] text-left w-full"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};
