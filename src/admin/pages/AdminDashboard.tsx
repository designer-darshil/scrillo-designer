import React from 'react';
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
  CheckCircle,
  AlertCircle,
  Database,
  Layers,
  Search,
} from 'lucide-react';

import { useWebsiteData } from '../../hooks/useWebsiteData';

interface SummaryCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const summaryMetrics: SummaryCard[] = [
  {
    title: 'Published Projects',
    value: '8',
    change: '+2 this month',
    changeType: 'positive',
    icon: FolderGit2,
    description: 'Live in portfolio showcase',
  },
  {
    title: 'Draft Projects',
    value: '2',
    change: 'In preparation',
    changeType: 'neutral',
    icon: FileClock,
    description: 'Unpublished staging works',
  },
  {
    title: 'Media Items',
    value: '24',
    change: '142.8 MB stored',
    changeType: 'info',
    icon: ImageIcon,
    description: 'Optimized CDN assets',
  },
  {
    title: 'Last Updated',
    value: 'Today, 2:45 PM',
    change: 'Auto-synchronized',
    changeType: 'positive',
    icon: Clock,
    description: 'By darshilbhuva4322@gmail.com',
  },
];

interface ActivityRecord {
  id: string;
  action: string;
  item: string;
  section: string;
  user: string;
  timestamp: string;
  status: 'Published' | 'Draft' | 'Updated' | 'Synced';
}

const recentActivities: ActivityRecord[] = [
  {
    id: 'act-1',
    action: 'Updated Section Copy',
    item: 'Hero Tagline & Manifesto statement',
    section: 'Website Content',
    user: 'darshilbhuva4322@gmail.com',
    timestamp: '15 mins ago',
    status: 'Published',
  },
  {
    id: 'act-2',
    action: 'Added New Project',
    item: 'Aura Studio — Spatial Architecture',
    section: 'Projects',
    user: 'darshilbhuva4322@gmail.com',
    timestamp: '2 hours ago',
    status: 'Draft',
  },
  {
    id: 'act-3',
    action: 'Uploaded Asset',
    item: 'nexus-hero-preview-02.webp (2.4 MB)',
    section: 'Media',
    user: 'darshilbhuva4322@gmail.com',
    timestamp: '4 hours ago',
    status: 'Synced',
  },
  {
    id: 'act-4',
    action: 'Reordered Capabilities',
    item: 'Full-Stack Architecture & Design Engineering',
    section: 'Skills',
    user: 'darshilbhuva4322@gmail.com',
    timestamp: 'Yesterday, 6:30 PM',
    status: 'Updated',
  },
  {
    id: 'act-5',
    action: 'Updated Engagement Rates',
    item: 'Design Systems & Technical Direction',
    section: 'Services',
    user: 'darshilbhuva4322@gmail.com',
    timestamp: '2 days ago',
    status: 'Published',
  },
];

const moduleShortcuts = [
  {
    title: 'Website Content',
    desc: 'Hero, Philosophy, Manifesto, and Contact copy',
    path: '/admin/content',
    icon: FileText,
    badge: '6 Sections',
  },
  {
    title: 'Projects Catalog',
    desc: 'Featured case studies, image galleries, and live links',
    path: '/admin/projects',
    icon: FolderGit2,
    badge: '8 Active',
  },
  {
    title: 'Skills & Disciplines',
    desc: 'Engineering, Visual Design, and Architecture stack',
    path: '/admin/skills',
    icon: Sparkles,
    badge: '3 Clusters',
  },
  {
    title: 'Services Scope',
    desc: 'Consultancy packages, deliverables, and retainers',
    path: '/admin/services',
    icon: Briefcase,
    badge: '4 Tiers',
  },
  {
    title: 'Media Storage',
    desc: 'Image CDN bucket, vector graphics, and video covers',
    path: '/admin/media',
    icon: ImageIcon,
    badge: '24 Assets',
  },
  {
    title: 'System Settings',
    desc: 'SEO meta, social handles, theme modes, and analytics',
    path: '/admin/settings',
    icon: Settings,
    badge: 'Configured',
  },
];

export const AdminDashboard: React.FC = () => {
  const { data } = useWebsiteData();

  const publishedCount = data.projects.filter((p) => p.published !== false).length;
  const draftCount = data.projects.filter((p) => p.published === false).length;

  const dynamicSummaryMetrics: SummaryCard[] = [
    {
      title: 'Published Projects',
      value: String(publishedCount),
      change: `${publishedCount} active in folio`,
      changeType: 'positive',
      icon: FolderGit2,
      description: 'Live in portfolio showcase',
    },
    {
      title: 'Draft Projects',
      value: String(draftCount),
      change: draftCount > 0 ? `${draftCount} pending` : 'None in draft',
      changeType: draftCount > 0 ? 'neutral' : 'positive',
      icon: FileClock,
      description: 'Unpublished staging works',
    },
    {
      title: 'Media Items',
      value: '24',
      change: '142.8 MB stored',
      changeType: 'info',
      icon: ImageIcon,
      description: 'Optimized CDN assets',
    },
    {
      title: 'Last Updated',
      value: 'Today',
      change: 'Auto-synchronized',
      changeType: 'positive',
      icon: Clock,
      description: 'By darshilbhuva4322@gmail.com',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Portfolio Synced
            </span>
            <span className="text-xs text-muted">Supabase Connected</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Portfolio Management Center
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-2xl">
            Manage your editorial portfolio, update project case studies, upload media assets, and configure public presentation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-surface text-foreground text-xs font-medium transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Site</span>
          </a>

          <NavLink
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 text-xs font-semibold transition-opacity shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </NavLink>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dynamicSummaryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-xs hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                    metric.changeType === 'positive'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : metric.changeType === 'info'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}
                >
                  {metric.change}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-muted">{metric.title}</p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {metric.value}
                </h3>
                <p className="text-[11px] text-muted mt-1 truncate">
                  {metric.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Changes Activity Table (2 columns on lg) */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Recent Activity & Changes</h3>
                  <p className="text-xs text-muted">Audit trail of recent updates made to portfolio data</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    aria-label="Search logs"
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-muted font-medium">
                    <th className="py-3 px-5">Action & Item</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Section</th>
                    <th className="py-3 px-4 hidden md:table-cell">Timestamp</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-background/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{act.action}</span>
                          <span className="text-muted text-[11px] truncate max-w-xs">{act.item}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[11px] text-muted">
                          {act.section}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell text-muted text-[11px]">
                        {act.timestamp}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            act.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : act.status === 'Draft'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : act.status === 'Updated'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              : 'bg-muted/10 text-foreground border-border'
                          }`}
                        >
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-border bg-background/30 flex items-center justify-between text-[11px] text-muted">
            <span>Showing 5 most recent actions</span>
            <span className="font-mono">Log storage: Active</span>
          </div>
        </div>

        {/* System Overview / Status Card (1 column on lg) */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-foreground" />
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
                <span className="text-[11px] text-muted">Authenticated</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">PostgreSQL Schema</span>
                </div>
                <span className="text-[11px] text-muted">Synced</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">Storage Buckets</span>
                </div>
                <span className="text-[11px] text-muted">24 Objects</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="text-foreground font-medium">Edge CDN Cache</span>
                </div>
                <span className="text-[11px] text-muted">Auto-Purge On</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-foreground" />
              <span>Publishing Pipeline</span>
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              When content is published from this panel, the public portfolio refreshes in real-time.
            </p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted">Target Domain</span>
              <span className="font-mono text-foreground font-medium">darshilbhuva.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Shortcuts Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">Management Modules</h3>
          <p className="text-xs text-muted">Direct access to portfolio content modules and configuration</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleShortcuts.map((mod) => {
            const Icon = mod.icon;
            return (
              <NavLink
                key={mod.path}
                to={mod.path}
                className="group rounded-xl border border-border bg-surface p-5 flex flex-col justify-between space-y-5 hover:border-foreground/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted group-hover:text-foreground">
                    <span className="text-[11px] font-mono">{mod.badge}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground group-hover:underline">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
