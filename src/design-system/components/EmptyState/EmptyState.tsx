import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-background-secondary)]/40',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-background-elevated)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-tertiary)] mb-4 shadow-2xs">
        {icon || <FolderOpen className="w-6 h-6" aria-hidden="true" />}
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
