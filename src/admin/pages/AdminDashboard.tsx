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
  Search,
  Upload,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit3,
} from 'lucide-react';

import { useWebsiteData } from '../../hooks/useWebsiteData';
import { mediaService, MediaAsset } from '../services/mediaService';
import { activityService, ActivityEvent } from '../services/activityService';
import { publishService } from '../services/publishService';
import { useAuth } from '../context/AuthContext';
import { Project } from '../../types';

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

// Helper to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const AdminDashboard: React.FC = () => {
  const { data, loading: dataLoading, refreshData } = useWebsiteData();
  const { profile, role, isEditor } = useAuth();

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState<string>('');
  const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(true);
  const [activityFilter, setActivityFilter] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Media Assets
      const assets = await mediaService.getAssets();
      setMediaAssets(assets);
      setLoadingMedia(false);

      // 2. Fetch Activities
      const acts = await activityService.getRecentActivities(15);
      setActivities(acts);
      setLoadingActivities(false);

      // 3. Get Last Published timestamp
      const snapshot = await publishService.getPublishedSnapshot();
      const diff = publishService.computeContentDiff(data, snapshot);
      setLastPublishedAt(diff.lastPublishedAt || new Date().toISOString());
    } catch {
      setLoadingMedia(false);
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [data]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshData(), fetchDashboardData()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // 1. Projects metrics
  const projects = data.projects || [];
  const publishedCount = projects.filter((p) => p.published !== false).length;
  const draftCount = projects.filter((p) => p.published === false).length;

  // 2. Media metrics
  const totalMediaCount = mediaAssets.length;
  const totalMediaBytes = mediaAssets.reduce((acc, m) => acc + (m.size || 0), 0);
  const totalMediaSizeFormatted = formatBytes(totalMediaBytes);

  // 3. Sections metrics
  const allSections = data.settings?.sections 
    ? (Array.isArray(data.settings.sections) 
        ? data.settings.sections 
        : Object.values(data.settings.sections))
    : [];
  const totalSectionsCount = allSections.length || 10;
  const visibleSectionsCount = allSections.filter((s: any) => s.visible !== false).length;

  // 4. Last Updated metrics
  // Find newest updatedAt among projects or fallback to lastPublishedAt
  const latestProjectUpdate = projects.reduce((latest, p) => {
    if (!p.updatedAt) return latest;
    const pTime = new Date(p.updatedAt).getTime();
    return pTime > latest ? pTime : latest;
  }, 0);

  const effectiveLastUpdated = latestProjectUpdate > 0 
    ? new Date(latestProjectUpdate).toISOString() 
    : (lastPublishedAt || new Date().toISOString());

  // 5. Recent Projects sorted by latest update
  const recentProjects: Project[] = [...projects]
    .sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  // Filtered activities
  const filteredActivities = activities.filter((act) => {
    if (!activityFilter.trim()) return true;
    const query = activityFilter.toLowerCase();
    return (
      act.action.toLowerCase().includes(query) ||
      act.item.toLowerCase().includes(query) ||
      act.user.toLowerCase().includes(query) ||
      act.section.toLowerCase().includes(query)
    );
  });

  const isLoading = dataLoading || loadingMedia || loadingActivities;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-14">
      {/* ========================================================================= */}
      {/* 1. WELCOME BANNER & TOP BAR */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-foreground/5 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Database Connected
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
              Role: <strong className="text-foreground capitalize">{role || 'Admin'}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Portfolio Administration Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Monitor real-time portfolio statistics, manage published and staging case studies, track team activity logs, and edit editorial content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Refresh database statistics"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-background hover:bg-surface text-foreground text-xs font-medium transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-surface text-foreground text-xs font-medium transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Site</span>
          </a>

          {isEditor && (
            <NavLink
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 text-xs font-semibold transition-opacity shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL DATABASE STATISTICS CARDS (WITH SKELETON LOADERS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {isLoading ? (
          // Skeleton placeholders
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skel-stat-${i}`}
              className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-xs animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-border/60" />
                <div className="w-14 h-5 rounded-md bg-border/40" />
              </div>
              <div className="space-y-2">
                <div className="w-20 h-3 bg-border/40 rounded-sm" />
                <div className="w-12 h-7 bg-border/70 rounded-md" />
                <div className="w-28 h-2.5 bg-border/30 rounded-sm" />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* 1. Published Projects */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3.5 shadow-xs hover:border-foreground/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Live
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Published Projects</p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {publishedCount}
                </h3>
                <p className="text-[11px] text-muted mt-1 truncate">
                  {publishedCount === 1 ? '1 active showcase' : `${publishedCount} active showcases`}
                </p>
              </div>
            </div>

            {/* 2. Draft Projects */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3.5 shadow-xs hover:border-foreground/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <FileClock className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                    draftCount > 0
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-background text-muted border-border'
                  }`}
                >
                  {draftCount > 0 ? `${draftCount} staging` : 'Ready'}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Draft Projects</p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {draftCount}
                </h3>
                <p className="text-[11px] text-muted mt-1 truncate">
                  {draftCount > 0 ? 'Unpublished works' : 'No draft backlogs'}
                </p>
              </div>
            </div>

            {/* 3. Total Media */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3.5 shadow-xs hover:border-foreground/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  {totalMediaSizeFormatted}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Total Media</p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {totalMediaCount}
                </h3>
                <p className="text-[11px] text-muted mt-1 truncate">
                  CDN assets stored
                </p>
              </div>
            </div>

            {/* 4. Visible Sections */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3.5 shadow-xs hover:border-foreground/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border bg-foreground/10 text-foreground border-foreground/20">
                  {visibleSectionsCount} / {totalSectionsCount}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Visible Sections</p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {visibleSectionsCount}
                </h3>
                <p className="text-[11px] text-muted mt-1 truncate">
                  Homepage components active
                </p>
              </div>
            </div>

            {/* 5. Last Updated */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3.5 shadow-xs hover:border-foreground/30 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Synced
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Last Updated</p>
                <h3 className="text-lg font-bold tracking-tight text-foreground mt-0.5 truncate" title={formatExactDateTime(effectiveLastUpdated)}>
                  {formatRelativeTime(effectiveLastUpdated)}
                </h3>
                <p className="text-[11px] text-muted mt-1 truncate" title={profile?.email || 'admin@scrillo.design'}>
                  By {profile?.email?.split('@')[0] || 'admin'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTIONS BAR */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Quick Actions</span>
          </h2>
          <span className="text-xs text-muted">Common admin workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: New Project */}
          <NavLink
            to="/admin/projects/new"
            className="group flex flex-col justify-between p-4 rounded-xl border border-border bg-surface hover:border-foreground/40 hover:bg-surface/80 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">New Project</h3>
              <p className="text-[11px] text-muted mt-0.5 truncate">Create case study</p>
            </div>
          </NavLink>

          {/* Action 2: Upload Media */}
          <NavLink
            to="/admin/media"
            className="group flex flex-col justify-between p-4 rounded-xl border border-border bg-surface hover:border-foreground/40 hover:bg-surface/80 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-background border border-border text-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">Upload Media</h3>
              <p className="text-[11px] text-muted mt-0.5 truncate">Add images & assets</p>
            </div>
          </NavLink>

          {/* Action 3: Edit Homepage */}
          <NavLink
            to="/admin/content"
            className="group flex flex-col justify-between p-4 rounded-xl border border-border bg-surface hover:border-foreground/40 hover:bg-surface/80 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-background border border-border text-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                <Edit3 className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">Edit Homepage</h3>
              <p className="text-[11px] text-muted mt-0.5 truncate">Manifesto, Hero & Copy</p>
            </div>
          </NavLink>

          {/* Action 4: Manage Services */}
          <NavLink
            to="/admin/services"
            className="group flex flex-col justify-between p-4 rounded-xl border border-border bg-surface hover:border-foreground/40 hover:bg-surface/80 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-background border border-border text-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">Manage Services</h3>
              <p className="text-[11px] text-muted mt-0.5 truncate">Scope & Deliverables</p>
            </div>
          </NavLink>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT GRID: RECENT PROJECTS & RECENT ACTIVITY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: RECENT PROJECTS & RECENT ACTIVITY */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION A: RECENT PROJECTS */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="p-5 border-b border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-foreground">Recent Projects</h2>
                  <p className="text-xs text-muted">Latest updated case studies in your portfolio</p>
                </div>
              </div>

              <NavLink
                to="/admin/projects"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground font-medium transition-colors"
              >
                <span>View All ({projects.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            {/* Projects List or Skeleton or Empty */}
            {isLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skel-proj-${i}`} className="flex items-center gap-4 animate-pulse">
                    <div className="w-14 h-12 rounded-lg bg-border/60 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="w-36 h-3.5 bg-border/60 rounded-sm" />
                      <div className="w-24 h-2.5 bg-border/40 rounded-sm" />
                    </div>
                    <div className="w-16 h-5 bg-border/40 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              // Empty State
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-background border border-border mx-auto flex items-center justify-center text-muted">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">No Projects Found</h4>
                  <p className="text-xs text-muted max-w-sm mx-auto">
                    You haven't created any portfolio projects yet. Start by publishing your first case study.
                  </p>
                </div>
                <NavLink
                  to="/admin/projects/new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </NavLink>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentProjects.map((project) => {
                  const imageSrc = project.thumbnail || project.coverImage || project.image;
                  const isPub = project.published !== false;

                  return (
                    <div
                      key={project.id}
                      className="p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-background/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-12 h-10 sm:w-14 sm:h-12 rounded-lg bg-background border border-border overflow-hidden shrink-0 relative flex items-center justify-center">
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
                            <FolderGit2 className="w-5 h-5 text-muted" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs sm:text-sm text-foreground truncate group-hover:underline">
                              {project.title}
                            </h4>
                            {project.featured && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted truncate">
                            <span>{project.category || 'Portfolio'}</span>
                            <span>•</span>
                            <span title={formatExactDateTime(project.updatedAt)}>
                              Updated {formatRelativeTime(project.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            isPub
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full mr-1.5 ${
                              isPub ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {isPub ? 'Published' : 'Draft'}
                        </span>

                        <NavLink
                          to="/admin/projects"
                          className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface text-muted hover:text-foreground transition-colors"
                          title="Manage Projects"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION B: RECENT ACTIVITY TABLE */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-foreground">Recent Activity</h2>
                    <p className="text-xs text-muted">Audit trail of system modifications and content edits</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Filter activity..."
                      aria-label="Filter activity"
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground w-full sm:w-44"
                    />
                  </div>
                </div>
              </div>

              {/* Table or Skeletons or Empty */}
              {isLoading ? (
                <div className="p-5 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`skel-act-${i}`} className="flex items-center justify-between animate-pulse">
                      <div className="space-y-1.5">
                        <div className="w-40 h-3 bg-border/60 rounded-sm" />
                        <div className="w-24 h-2 bg-border/40 rounded-sm" />
                      </div>
                      <div className="w-16 h-4 bg-border/40 rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : filteredActivities.length === 0 ? (
                // Empty State
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-background border border-border mx-auto flex items-center justify-center text-muted">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">No Activities Found</h4>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                      {activityFilter
                        ? `No activity events match "${activityFilter}".`
                        : 'No recent events recorded in the database audit log.'}
                    </p>
                  </div>
                  {activityFilter && (
                    <button
                      onClick={() => setActivityFilter('')}
                      className="inline-flex items-center px-3 py-1 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-surface transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-background/50 text-muted font-medium">
                        <th className="py-3 px-5">Action</th>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4 hidden sm:table-cell">User</th>
                        <th className="py-3 px-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredActivities.slice(0, 8).map((act) => {
                        const isDeleted = act.action.toLowerCase().includes('delete');
                        const isPub = act.action.toLowerCase().includes('publish');
                        const isUpload = act.action.toLowerCase().includes('upload');

                        return (
                          <tr key={act.id} className="hover:bg-background/40 transition-colors">
                            <td className="py-3.5 px-5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                                  isDeleted
                                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                    : isPub
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : isUpload
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                    : 'bg-background text-foreground border-border'
                                }`}
                              >
                                {act.action}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-foreground max-w-xs truncate">
                              <span title={act.item}>{act.item}</span>
                            </td>
                            <td className="py-3.5 px-4 hidden sm:table-cell text-muted text-[11px] truncate max-w-[140px]">
                              <span title={act.user}>{act.user}</span>
                            </td>
                            <td
                              className="py-3.5 px-4 text-right text-muted text-[11px] whitespace-nowrap"
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
            </div>

            {/* Activity Table Footer */}
            <div className="p-4 border-t border-border bg-background/30 flex items-center justify-between text-[11px] text-muted">
              <span>
                Showing {Math.min(filteredActivities.length, 8)} of {filteredActivities.length} logged events
              </span>
              <span className="font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Audit Log Active
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: SYSTEM HEALTH & QUICK MODULES */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-foreground" />
                <span>System Health</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">Supabase Auth</span>
                </div>
                <span className="text-[11px] text-muted">Active Session</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">PostgreSQL Storage</span>
                </div>
                <span className="text-[11px] text-muted">RLS Hardened</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">Media Storage Bucket</span>
                </div>
                <span className="text-[11px] text-muted">{totalMediaCount} Assets ({totalMediaSizeFormatted})</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">Editorial Sections</span>
                </div>
                <span className="text-[11px] text-muted">{visibleSectionsCount} / {totalSectionsCount} Active</span>
              </div>
            </div>
          </div>

          {/* Management Modules Quick Links */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-foreground" />
                <span>Content Editors</span>
              </h3>
            </div>

            <div className="space-y-2">
              <NavLink
                to="/admin/content"
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-foreground/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-foreground" />
                  <div>
                    <span className="text-xs font-semibold text-foreground group-hover:underline">Editorial Content</span>
                    <p className="text-[11px] text-muted">Statement, Philosophy & CTA</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground transition-transform" />
              </NavLink>

              <NavLink
                to="/admin/skills"
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-foreground/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <div>
                    <span className="text-xs font-semibold text-foreground group-hover:underline">Skills & Matrix</span>
                    <p className="text-[11px] text-muted">Design & Architecture Stack</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground transition-transform" />
              </NavLink>

              <NavLink
                to="/admin/content/sections"
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-foreground/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-foreground" />
                  <div>
                    <span className="text-xs font-semibold text-foreground group-hover:underline">Section Manager</span>
                    <p className="text-[11px] text-muted">Reorder & Visibility</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground transition-transform" />
              </NavLink>

              <NavLink
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-foreground/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-foreground" />
                  <div>
                    <span className="text-xs font-semibold text-foreground group-hover:underline">System Settings</span>
                    <p className="text-[11px] text-muted">Theme, CSS Tokens & SEO</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground transition-transform" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
