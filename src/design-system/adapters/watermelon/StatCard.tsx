import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../../components/Badge';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  badgeText?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badgeText,
  badgeVariant = 'neutral',
  onClick,
  className,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-5 sm:p-6 transition-all duration-200',
        isClickable && 'cursor-pointer hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] active:scale-[0.99]',
        className
      )}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-action-primary)]/5 blur-2xl group-hover:bg-[var(--color-action-primary)]/10 transition-colors" />

      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] transition-transform group-hover:scale-105">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Center: Large Metric Value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[var(--color-text-primary)]">
          {value}
        </span>
        {badgeText && (
          <Badge variant={badgeVariant} size="sm" className="font-mono text-[10px]">
            {badgeText}
          </Badge>
        )}
      </div>

      {/* Bottom Footer: Subtitle / Trend */}
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-tertiary)] pt-3 border-t border-[var(--color-border-subtle)]">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold shrink-0',
                trend.direction === 'up' && 'text-status-success',
                trend.direction === 'down' && 'text-status-error',
                trend.direction === 'neutral' && 'text-[var(--color-text-tertiary)]'
              )}
            >
              {trend.direction === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
              {trend.direction === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
              {trend.direction === 'neutral' && <Minus className="h-3.5 w-3.5" />}
              <span>{trend.value}</span>
              {trend.label && <span className="text-[var(--color-text-tertiary)] font-normal ml-1">{trend.label}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
