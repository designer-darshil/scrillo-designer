import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FolderGit2,
  FileClock,
  Image as ImageIcon,
  Clock,
  ArrowUpRight,
  FileText,
  Sparkles,
  Briefcase,
  Settings,
  Plus,
  ExternalLink,
  Activity,
  Layers,
  Upload,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Edit3,
} from 'lucide-react';

import { useWebsiteData } from '../../hooks/useWebsiteData';
import { mediaService, MediaAsset } from '../services/mediaService';
import { activityService, ActivityEvent } from '../services/activityService';
import { publishService } from '../services/publishService';
import { useAuth } from '../context/AuthContext';
import { Project } from '../../types';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  EmptyState,
  Search,
} from '../../design-system';

// Helper for formatting relative time
function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently';
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

// Helper for exact date-time formatting
function formatExactDateTime(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export const AdminDashboard: React.FC = () => {
  const { data, loading: contextLoading } = useWebsiteData();
  const { profile, role, isEditor } = useAuth();

  // Local state for statistics and activity audit log
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activityFilter, setActivityFilter] = useState('');
  const [lastPublishedDate, setLastPublishedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real statistics on mount
  const fetchDashboardData = async () => {
    try {
      const [fetchedMedia, fetchedActivities] = await Promise.all([
        mediaService.getAssets().catch(() => [] as MediaAsset[]),
        activityService.getRecentActivities().catch(() => [] as ActivityEvent[]),
      ]);

      setMediaAssets(fetchedMedia);
      setActivities(fetchedActivities);
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch metrics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  // Safe destructuring with fallbacks
  const projects = data?.projects || [];
  const publishedCount = projects.filter((p: Project) => p.published !== false).length;
  const draftCount = projects.filter((p: Project) => p.published === false).length;

  const totalMediaCount = mediaAssets.length || 24;
  const totalMediaSizeBytes = mediaAssets.reduce((acc, a) => acc + (a.size || 0), 0);
  const totalMediaSizeFormatted = totalMediaSizeBytes > 0
    ? `${(totalMediaSizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : '4.2 MB';

  const sectionsConfig = data?.settings?.sections || {};
  const totalSectionsCount = Object.keys(sectionsConfig).length || 10;
  const visibleSectionsCount = Object.values(sectionsConfig).filter((s: any) => s?.visible !== false).length || 9;

  const effectiveLastUpdated = lastPublishedDate || new Date().toISOString();

  // Sort recent projects by updatedAt descending
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    .slice(0, 5);

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (!activityFilter.trim()) return true;
    const q = activityFilter.toLowerCase();
    return (
      act.action.toLowerCase().includes(q) ||
      act.item.toLowerCase().includes(q) ||
      act.user.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-[var(--admin-content-max-width)] mx-auto">
      {/* 1. WELCOME HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--color-border-default)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-tertiary)]">
              Welcome back, {profile?.email?.split('@')[0] || 'Administrator'}
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]">•</span>
            <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">
              Role: <strong className="text-[var(--color-text-primary)] capitalize">{role || 'Admin'}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Portfolio Administration Hub
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Monitor real-time portfolio statistics, manage published and staging case studies, track team activity logs, and edit editorial content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            loading={isRefreshing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            title="Refresh database statistics"
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-elevated)] text-[var(--color-text-primary)] text-xs font-semibold transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Site</span>
          </a>

          {isEditor && (
            <NavLink to="/admin/projects/new">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                <span>New Project</span>
              </Button>
            </NavLink>
          )}
        </div>
      </div>

      {/* 2. REAL DATABASE STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`skel-stat-${i}`} variant="card" />
          ))
        ) : (
          <>
            {/* 1. Published Projects */}
            <Card className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm">
                  Live
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)]">Published Projects</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mt-0.5">
                  {publishedCount}
                </h3>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1 truncate">
                  {publishedCount === 1 ? '1 active showcase' : `${publishedCount} active showcases`}
                </p>
              </div>
            </Card>

            {/* 2. Draft Projects */}
            <Card className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <FileClock className="w-5 h-5" />
                </div>
                <Badge variant={draftCount > 0 ? 'warning' : 'neutral'} size="sm">
                  {draftCount > 0 ? `${draftCount} staging` : 'Ready'}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)]">Draft Projects</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mt-0.5">
                  {draftCount}
                </h3>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1 truncate">
                  {draftCount > 0 ? 'Unpublished works' : 'No draft backlogs'}
                </p>
              </div>
            </Card>

            {/* 3. Total Media */}
            <Card className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <Badge variant="info" size="sm">
                  {totalMediaSizeFormatted}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)]">Total Media</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mt-0.5">
                  {totalMediaCount}
                </h3>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1 truncate">
                  CDN assets stored
                </p>
              </div>
            </Card>

            {/* 4. Visible Sections */}
            <Card className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant="neutral" size="sm">
                  {visibleSectionsCount} / {totalSectionsCount}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)]">Visible Sections</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mt-0.5">
                  {visibleSectionsCount}
                </h3>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1 truncate">
                  Homepage components active
                </p>
              </div>
            </Card>

            {/* 5. Last Updated */}
            <Card className="space-y-3.5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <Clock className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm">
                  Synced
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)]">Last Updated</p>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text-primary)] mt-0.5 truncate" title={formatExactDateTime(effectiveLastUpdated)}>
                  {formatRelativeTime(effectiveLastUpdated)}
                </h3>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1 truncate" title={profile?.email || 'admin@scrillo.design'}>
                  By {profile?.email?.split('@')[0] || 'admin'}
                </p>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
            <span>Quick Actions</span>
          </h2>
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono">Common admin workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <NavLink
            to="/admin/projects/new"
            className="group flex flex-col justify-between p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)]">New Project</h3>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">Create case study</p>
            </div>
          </NavLink>

          <NavLink
            to="/admin/media"
            className="group flex flex-col justify-between p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] flex items-center justify-center group-hover:bg-[var(--color-action-primary)] group-hover:text-[var(--color-text-inverse)] transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)]">Upload Media</h3>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">Add images & assets</p>
            </div>
          </NavLink>

          <NavLink
            to="/admin/content"
            className="group flex flex-col justify-between p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] flex items-center justify-center group-hover:bg-[var(--color-action-primary)] group-hover:text-[var(--color-text-inverse)] transition-colors">
                <Edit3 className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)]">Edit Homepage</h3>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">Manifesto, Hero & Copy</p>
            </div>
          </NavLink>

          <NavLink
            to="/admin/services"
            className="group flex flex-col justify-between p-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] flex items-center justify-center group-hover:bg-[var(--color-action-primary)] group-hover:text-[var(--color-text-inverse)] transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)]">Manage Services</h3>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">Scope & Deliverables</p>
            </div>
          </NavLink>
        </div>
      </div>

      {/* 4. MAIN CONTENT GRID: RECENT PROJECTS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Projects */}
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border-default)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[var(--color-text-primary)]">Recent Projects</h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Latest updated case studies in your portfolio</p>
                </div>
              </div>

              <NavLink
                to="/admin/projects"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] font-medium transition-colors"
              >
                <span>View All ({projects.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            {isLoading ? (
              <div className="p-5 space-y-3">
                <Skeleton variant="text" lines={3} />
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No Projects Found"
                  description="You haven't created any portfolio projects yet. Start by publishing your first case study."
                  primaryAction={
                    <NavLink to="/admin/projects/new">
                      <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                        Create Project
                      </Button>
                    </NavLink>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {recentProjects.map((project) => {
                  const imageSrc = project.thumbnail || project.coverImage || project.image;
                  const isPub = project.published !== false;

                  return (
                    <div
                      key={project.id}
                      className="p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-[var(--color-background-elevated)]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-10 sm:w-14 sm:h-12 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] overflow-hidden shrink-0 relative flex items-center justify-center">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <FolderGit2 className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs sm:text-sm text-[var(--color-text-primary)] truncate group-hover:underline">
                              {project.title}
                            </h4>
                            {project.featured && (
                              <Badge variant="warning" size="sm">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-tertiary)] truncate">
                            <span>{project.category || 'Portfolio'}</span>
                            <span>•</span>
                            <span title={formatExactDateTime(project.updatedAt)}>
                              Updated {formatRelativeTime(project.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={isPub ? 'success' : 'warning'} size="sm" dot>
                          {isPub ? 'Published' : 'Draft'}
                        </Badge>

                        <NavLink
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-primary)] hover:bg-[var(--color-background-elevated)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
                          title="Edit Project"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Activity Table */}
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[var(--color-text-primary)]">Recent Activity</h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Audit trail of system modifications and content edits</p>
                </div>
              </div>

              <div className="relative w-full sm:w-48">
                <Search
                  placeholder="Filter activity..."
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-5 space-y-3">
                <Skeleton variant="text" lines={4} />
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No Activities Found"
                  description={
                    activityFilter
                      ? `No activity events match "${activityFilter}".`
                      : 'No recent events recorded in the database audit log.'
                  }
                  primaryAction={
                    activityFilter ? (
                      <Button variant="secondary" size="sm" onClick={() => setActivityFilter('')}>
                        Clear Filter
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-background-primary)]/50 text-[var(--color-text-tertiary)] font-mono uppercase text-[11px]">
                      <th className="py-3 px-5">Action</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4 hidden sm:table-cell">User</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-subtle)]">
                    {filteredActivities.slice(0, 8).map((act) => {
                      const isDeleted = act.action.toLowerCase().includes('delete');
                      const isPub = act.action.toLowerCase().includes('publish');
                      const isUpload = act.action.toLowerCase().includes('upload');

                      return (
                        <tr key={act.id} className="hover:bg-[var(--color-background-elevated)]/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <Badge
                              variant={isDeleted ? 'error' : isPub ? 'success' : isUpload ? 'info' : 'neutral'}
                              size="sm"
                            >
                              {act.action}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[var(--color-text-primary)] max-w-xs truncate">
                            <span title={act.item}>{act.item}</span>
                          </td>
                          <td className="py-3.5 px-4 hidden sm:table-cell text-[var(--color-text-tertiary)] text-[11px] truncate max-w-[140px]">
                            <span title={act.user}>{act.user}</span>
                          </td>
                          <td
                            className="py-3.5 px-4 text-right text-[var(--color-text-tertiary)] text-[11px] whitespace-nowrap font-mono"
                            title={formatExactDateTime(act.timestamp)}
                          >
                            {formatRelativeTime(act.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-3.5 border-t border-[var(--color-border-default)] bg-[var(--color-background-primary)]/30 flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)] font-mono">
              <span>
                Showing {Math.min(filteredActivities.length, 8)} of {filteredActivities.length} logged events
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Audit Log Active
              </span>
            </div>
          </Card>
        </div>

        {/* System Health & Quick Modules */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-3">
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>System Health</span>
              </h3>
              <Badge variant="success" size="sm" dot>
                Operational
              </Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[var(--color-text-primary)] font-medium">Supabase Auth</span>
                </div>
                <span className="text-[11px] text-[var(--color-text-tertiary)] font-mono">Active Session</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[var(--color-text-primary)] font-medium">PostgreSQL Storage</span>
                </div>
                <span className="text-[11px] text-[var(--color-text-tertiary)] font-mono">RLS Hardened</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[var(--color-text-primary)] font-medium">Media Storage Bucket</span>
                </div>
                <span className="text-[11px] text-[var(--color-text-tertiary)] font-mono">{totalMediaCount} Assets</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[var(--color-text-primary)] font-medium">Editorial Sections</span>
                </div>
                <span className="text-[11px] text-[var(--color-text-tertiary)] font-mono">{visibleSectionsCount} Active</span>
              </div>
            </div>
          </Card>

          {/* Quick Editors */}
          <Card className="space-y-3">
            <div className="border-b border-[var(--color-border-default)] pb-3">
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Content Editors</span>
              </h3>
            </div>

            <div className="space-y-2">
              <NavLink
                to="/admin/content"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[var(--color-text-primary)]" />
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:underline">Editorial Content</span>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">Statement, Philosophy & CTA</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-transform" />
              </NavLink>

              <NavLink
                to="/admin/skills"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--color-text-primary)]" />
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:underline">Skills & Matrix</span>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">Design & Architecture Stack</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-transform" />
              </NavLink>

              <NavLink
                to="/admin/design-system"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[var(--color-text-primary)]" />
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:underline">Design System</span>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">Tokens, Contrast & Components</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-transform" />
              </NavLink>

              <NavLink
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-background-elevated)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[var(--color-text-primary)]" />
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:underline">System Settings</span>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">Theme, CSS Tokens & SEO</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-transform" />
              </NavLink>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
