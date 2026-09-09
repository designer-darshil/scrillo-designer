import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  statusAriaLabel?: string;
  fallbackIcon?: React.ReactNode;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeClasses: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-1.5',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2',
};

const statusColorClasses: Record<AvatarStatus, { bg: string; label: string }> = {
  online: { bg: 'bg-emerald-500', label: 'Online' },
  offline: { bg: 'bg-neutral-500', label: 'Offline' },
  busy: { bg: 'bg-red-500', label: 'Busy' },
  away: { bg: 'bg-amber-400', label: 'Away' },
};

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  statusAriaLabel,
  fallbackIcon,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const statusInfo = status ? statusColorClasses[status] : null;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full select-none shrink-0 font-medium font-mono',
        'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : fallbackIcon ? (
        <span aria-hidden="true">{fallbackIcon}</span>
      ) : (
        <User className="w-1/2 h-1/2 opacity-70" aria-hidden="true" />
      )}

      {statusInfo && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-[var(--color-background-primary)]',
            statusInfo.bg,
            statusSizeClasses[size]
          )}
          title={statusAriaLabel || statusInfo.label}
          aria-label={statusAriaLabel || statusInfo.label}
        />
      )}
    </div>
  );
};
