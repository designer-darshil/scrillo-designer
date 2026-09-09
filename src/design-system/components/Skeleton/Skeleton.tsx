import React from 'react';
import { cn } from '../../utils/cn';

export type SkeletonVariant = 'text' | 'avatar' | 'thumbnail' | 'card' | 'table-row';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
  style,
  ...props
}) => {
  const pulseClass = 'animate-pulse bg-[var(--color-border-subtle)]';

  if (variant === 'avatar') {
    return (
      <div
        className={cn('rounded-full shrink-0', pulseClass, className)}
        style={{ width: width ?? 40, height: height ?? 40, ...style }}
        aria-hidden="true"
        {...props}
      />
    );
  }

  if (variant === 'thumbnail') {
    return (
      <div
        className={cn('rounded-xl shrink-0', pulseClass, className)}
        style={{ width: width ?? '100%', height: height ?? 160, ...style }}
        aria-hidden="true"
        {...props}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'p-5 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] space-y-3',
          className
        )}
        aria-hidden="true"
        {...props}
      >
        <div className={cn('h-4 w-1/3 rounded-md', pulseClass)} />
        <div className={cn('h-3 w-3/4 rounded-md', pulseClass)} />
        <div className={cn('h-24 w-full rounded-xl mt-4', pulseClass)} />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <tr className={cn('border-b border-[var(--color-border-subtle)]', className)} aria-hidden="true" {...props}>
        <td className="p-4">
          <div className={cn('h-4 w-24 rounded-md', pulseClass)} />
        </td>
        <td className="p-4">
          <div className={cn('h-4 w-40 rounded-md', pulseClass)} />
        </td>
        <td className="p-4">
          <div className={cn('h-4 w-16 rounded-md', pulseClass)} />
        </td>
        <td className="p-4 text-right">
          <div className={cn('h-4 w-12 rounded-md ml-auto', pulseClass)} />
        </td>
      </tr>
    );
  }

  // Default 'text' variant
  if (lines > 1) {
    return (
      <div className={cn('space-y-2 w-full', className)} aria-hidden="true" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('h-3.5 rounded-md', pulseClass)}
            style={{
              width: i === lines - 1 ? '70%' : width ?? '100%',
              height: height ?? undefined,
              ...style,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('h-4 rounded-md', pulseClass, className)}
      style={{ width: width ?? '100%', height: height ?? undefined, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
};
