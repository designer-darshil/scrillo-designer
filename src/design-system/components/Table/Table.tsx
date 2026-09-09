import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  loading?: boolean;
  emptyText?: string;
  isEmpty?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, loading = false, isEmpty = false, emptyText = 'No records found', children, ...props }, ref) => {
    return (
      <div className={cn('w-full overflow-x-auto rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] shadow-xs', containerClassName)}>
        <table ref={ref} className={cn('w-full text-left text-sm border-collapse', className)} {...props}>
          {children}
        </table>

        {loading && (
          <div className="flex items-center justify-center p-8 text-[var(--color-text-tertiary)] gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs">Loading records...</span>
          </div>
        )}

        {!loading && isEmpty && (
          <div className="p-8 text-center text-xs text-[var(--color-text-tertiary)]">
            {emptyText}
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('border-b border-[var(--color-border-default)] bg-[var(--color-background-primary)]/50 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider font-mono', className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('divide-y divide-[var(--color-border-subtle)]', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  interactive?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, interactive = false, ...props }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected}
      className={cn(
        'transition-colors',
        selected && 'bg-[var(--color-background-elevated)] font-medium',
        interactive && 'hover:bg-[var(--color-background-elevated)] cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable = false, sortDirection = null, onSort, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn('px-4 py-3 text-left align-middle font-medium select-none', className)}
        {...props}
      >
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] rounded-md px-1 py-0.5 -mx-1"
          >
            <span>{children}</span>
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>
        ) : (
          children
        )}
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-4 py-3 align-middle text-xs sm:text-sm text-[var(--color-text-primary)]', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
