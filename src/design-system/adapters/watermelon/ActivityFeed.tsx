import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Trash2,
  PlusCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';

export interface ActivityItem {
  id: string;
  action: string;
  item: string;
  section: string;
  user?: string;
  timestamp: string;
  status: 'Created' | 'Updated' | 'Deleted' | 'Published' | string;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  className?: string;
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case 'created':
      return <PlusCircle className="h-3.5 w-3.5 text-status-success" />;
    case 'updated':
      return <FileEdit className="h-3.5 w-3.5 text-status-info" />;
    case 'deleted':
      return <Trash2 className="h-3.5 w-3.5 text-status-error" />;
    case 'published':
      return <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />;
    default:
      return <Activity className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />;
  }
}

function getStatusBadgeVariant(status: string): 'success' | 'info' | 'error' | 'warning' | 'neutral' {
  switch (status.toLowerCase()) {
    case 'created':
    case 'published':
      return 'success';
    case 'updated':
      return 'info';
    case 'deleted':
      return 'error';
    default:
      return 'neutral';
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (isNaN(diffMs)) return 'Recently';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'System Activity Audit',
  maxItems = 10,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const sections = ['all', ...Array.from(new Set(activities.map((a) => a.section)))];

  const filtered = activities.filter((act) => {
    const matchesSearch =
      searchQuery === '' ||
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.section.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSection = selectedSection === 'all' || act.section === selectedSection;

    return matchesSearch && matchesSection;
  });

  const displayList = filtered.slice(0, maxItems);

  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-5 sm:p-6 space-y-5',
        className
      )}
    >
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--color-text-primary)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-sans">
            {title}
          </h3>
          <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
            {filtered.length} events
          </Badge>
        </div>

        {/* Quick Search */}
        <div className="w-full sm:w-56">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter audit log..."
            leftIcon={<Search className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />}
            className="text-xs h-8"
          />
        </div>
      </div>

      {/* Section Filter Pills */}
      {sections.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {sections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={cn(
                'px-2.5 py-1 rounded-lg font-mono text-[11px] capitalize transition-colors whitespace-nowrap',
                selectedSection === sec
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-background-primary)] font-semibold'
                  : 'bg-[var(--color-background-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:text-[var(--color-text-primary)]'
              )}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Activity Item List */}
      {displayList.length === 0 ? (
        <EmptyState
          title="No activity events found"
          description="Actions performed in the admin panel will appear here in chronological order."
          icon={<Clock className="h-8 w-8" />}
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-background-primary)] hover:border-[var(--color-border-default)] transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background-secondary)]">
                  {getStatusIcon(item.status)}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                    {item.action}: <span className="font-normal text-[var(--color-text-secondary)]">{item.item}</span>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-tertiary)] font-mono">
                    <span className="capitalize">{item.section}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.timestamp)}</span>
                    {item.user && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[120px]">{item.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Badge
                variant={getStatusBadgeVariant(item.status)}
                size="sm"
                className="font-mono text-[10px] shrink-0"
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
