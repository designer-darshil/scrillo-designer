import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  FolderGit2,
  Sparkles,
  Briefcase,
  Image as ImageIcon,
  Settings,
  ArrowUpRight,
  Database,
} from 'lucide-react';

const quickCards = [
  {
    title: 'Website Content',
    desc: 'Manage Hero, Manifesto, Philosophy, and Contact sections',
    path: '/admin/content',
    icon: FileText,
    count: '6 Sections',
  },
  {
    title: 'Selected Works',
    desc: 'Editorial project showcase, metadata, and preview assets',
    path: '/admin/projects',
    icon: FolderGit2,
    count: '8 Repositories',
  },
  {
    title: 'Skills & Disciplines',
    desc: 'Capabilities matrix across UI, UX, and Development',
    path: '/admin/skills',
    icon: Sparkles,
    count: '3 Categories',
  },
  {
    title: 'Services Scope',
    desc: 'Commission offerings, deliverables, and engagements',
    path: '/admin/services',
    icon: Briefcase,
    count: '4 Packages',
  },
  {
    title: 'Media Storage',
    desc: 'Asset library, full-bleed imagery, and visual studies',
    path: '/admin/media',
    icon: ImageIcon,
    count: 'Storage Ready',
  },
  {
    title: 'Site Settings',
    desc: 'Theme defaults, animation switches, and SEO metadata',
    path: '/admin/settings',
    icon: Settings,
    count: 'Configured',
  },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Overview Header */}
      <div className="border border-border bg-surface p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted uppercase">[SYSTEM ARCHITECTURE // v1.0]</span>
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <Database className="w-3.5 h-3.5 text-foreground" />
            <span>SUPABASE READY</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-sans font-bold uppercase tracking-tight text-foreground">
          PORTFOLIO CONTROL CENTER
        </h2>
        <p className="font-mono text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          Centralized administrative management for all editorial copy, project repositories, discipline matrices, and global site preferences.
        </p>
      </div>

      {/* Grid of Management Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <NavLink
              key={card.path}
              to={card.path}
              className="group border border-border bg-surface p-6 flex flex-col justify-between space-y-6 hover:border-foreground transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-muted group-hover:text-foreground">
                  <span>{card.count}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="font-mono text-xs text-muted leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
