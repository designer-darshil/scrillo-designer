import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  Globe,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/content', label: 'Website Content', icon: FileText },
  { path: '/admin/content/sections', label: 'Section Layout', icon: Layers, badge: '10' },
  { path: '/admin/content/footer', label: 'Footer & Outreach', icon: Globe },
  { path: '/admin/projects', label: 'Projects', icon: FolderGit2, badge: '8' },
  { path: '/admin/skills', label: 'Skills', icon: Sparkles },
  { path: '/admin/services', label: 'Services', icon: Briefcase },
  { path: '/admin/media', label: 'Media', icon: ImageIcon, badge: '24' },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentNav =
    navItems
      .slice()
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) => {
        if (item.path === '/admin/dashboard') {
          return location.pathname === '/admin/dashboard' || location.pathname === '/admin' || location.pathname === '/admin/';
        }
        return location.pathname.startsWith(item.path);
      }) || navItems[0];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const userEmail = user?.email || 'darshilbhuva4322@gmail.com';
  const userName = userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased selection:bg-foreground selection:text-background">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Top App Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-md border border-border text-foreground hover:bg-background transition-colors focus:outline-hidden focus:ring-2 focus:ring-foreground/20"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-sm tracking-tight">SCRiLLO ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="p-2 rounded-md border border-border text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar: Persistent on Desktop, Collapsible on Tablet/Desktop, Drawer on Mobile */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen border-r border-border bg-surface flex flex-col justify-between
          transition-all duration-300 ease-in-out shrink-0
          ${/* Mobile Drawer Position */ ''}
          ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${/* Tablet/Desktop Collapse Width */ ''}
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-opacity ${sidebarCollapsed ? 'lg:justify-center w-full' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs">
                SD
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight text-foreground">SCRiLLO Panel</span>
                  <span className="text-[11px] text-muted">Admin Console</span>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin/dashboard'
                  ? location.pathname === '/admin/dashboard' || location.pathname === '/admin' || location.pathname === '/admin/'
                  : item.path === '/admin/content'
                  ? location.pathname === '/admin/content' || location.pathname === '/admin/content/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileDrawerOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-foreground text-background shadow-xs font-semibold'
                      : 'text-muted hover:text-foreground hover:bg-background/80'
                  } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-background/20 text-background'
                          : 'bg-background border border-border text-muted'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-2 bg-surface">
          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 p-2 rounded-lg bg-background border border-border ${
              sidebarCollapsed ? 'lg:justify-center lg:p-2' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-xs text-foreground shrink-0 uppercase">
              {userName.slice(0, 2)}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[11px] text-muted truncate">{userEmail}</p>
              </div>
            )}
          </div>

          {/* View Live Portfolio Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={sidebarCollapsed ? 'View Live Portfolio' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background border border-border/80 transition-colors ${
              sidebarCollapsed ? 'lg:justify-center' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>View Portfolio</span>}
            </span>
            {!sidebarCollapsed && <span className="text-[10px] text-muted">↗</span>}
          </a>

          {/* Desktop/Tablet Collapse Toggle */}
          <div className="hidden lg:flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-muted hover:text-foreground hover:bg-background rounded-md transition-colors"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Desktop & Tablet) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-20">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted uppercase">Admin /</span>
            <h1 className="text-base font-bold tracking-tight text-foreground">{currentNav.label}</h1>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Notifications Placeholder */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-surface" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-surface p-4 shadow-xl text-xs space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Notifications
                    </span>
                    <span className="text-[10px] text-muted bg-background px-2 py-0.5 rounded-full border border-border">
                      All Synced
                    </span>
                  </div>
                  <div className="space-y-2.5 text-muted">
                    <div className="p-2 rounded-lg bg-background border border-border">
                      <p className="text-foreground font-medium text-xs">Portfolio Status: Active</p>
                      <p className="text-[11px] text-muted mt-0.5">8 projects published to live portfolio.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background border border-border">
                      <p className="text-foreground font-medium text-xs">Supabase Connected</p>
                      <p className="text-[11px] text-muted mt-0.5">Schema synchronized and authenticated.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span className="capitalize">{theme}</span>
            </button>

            {/* Public Portfolio Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background border border-border transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Current User & Logout */}
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span className="font-medium text-foreground max-w-[140px] truncate">{userEmail}</span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-border hover:border-red-500/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
