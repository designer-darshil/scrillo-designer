import React from 'react';
import { cn } from '../../utils/cn';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  children: React.ReactNode;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max,
  children,
  className,
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const excessCount = max ? childArray.length - max : 0;

  return (
    <div
      className={cn('flex items-center -space-x-2 overflow-hidden', className)}
      {...props}
    >
      {visibleChildren.map((child, idx) => (
        <div key={idx} className="relative ring-2 ring-[var(--color-background-primary)] rounded-full">
          {child}
        </div>
      ))}
      {excessCount > 0 && (
        <div
          className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-background-elevated)] border border-[var(--color-border-default)] text-[11px] font-mono font-medium text-[var(--color-text-secondary)] ring-2 ring-[var(--color-background-primary)] shrink-0"
          aria-label={`${excessCount} more users`}
        >
          +{excessCount}
        </div>
      )}
    </div>
  );
};
