import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Sparkles,
  Briefcase,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/content', label: 'Content', icon: FileText },
  { path: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/admin/skills', label: 'Skills', icon: Sparkles },
  { path: '/admin/services', label: 'Services', icon: Briefcase },
  { path: '/admin/media', label: 'Media', icon: ImageIcon },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentNav = navItems.find((item) => location.pathname.startsWith(item.path)) || navItems[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2 font-mono text-sm font-bold">
          <ShieldCheck className="w-5 h-5 text-foreground" />
          <span>ADMIN PANEL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 border border-border text-foreground hover:bg-background transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 border border-border text-foreground"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-border bg-surface flex flex-col justify-between p-6 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Admin Header / Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-mono text-sm font-bold tracking-wider uppercase">
              <span className="w-2.5 h-2.5 bg-foreground inline-block" />
              <span>SCRiLLO ADMIN</span>
            </div>
            <span className="font-mono text-[10px] text-muted border border-border px-1.5 py-0.5 uppercase">
              v1.0
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-mono transition-colors rounded-none ${
                    isActive
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted hover:text-foreground hover:bg-background/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-border">
          {/* Quick link to public website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-mono text-muted hover:text-foreground border border-border/80 hover:border-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px]">↗</span>
          </a>

          {/* Theme Switch & Status */}
          <div className="flex items-center justify-between pt-2 text-xs font-mono text-muted">
            <span>THEME</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 border border-border hover:text-foreground hover:border-foreground transition-colors uppercase text-[11px]"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              <span>{theme}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Desktop) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-border bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted">ADMIN /</span>
            <h1 className="font-mono text-sm font-bold uppercase text-foreground">{currentNav.label}</h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted hover:text-foreground border border-border hover:border-foreground transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2 px-3 py-1 bg-surface border border-border font-mono text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>AUTHENTICATED</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
