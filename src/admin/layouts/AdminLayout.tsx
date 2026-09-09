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
  Eye,
  UploadCloud,
  RotateCcw,
  Tag,
  User,
  Palette,
  Lock,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { PublishReviewModal } from '../components/PublishReviewModal';
import { Avatar, Button, Badge } from '../../design-system';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiresAdmin?: boolean;
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/profile', label: 'Profile', icon: User },
  { path: '/admin/content', label: 'Website Content', icon: FileText },
  { path: '/admin/content/sections', label: 'Section Layout', icon: Layers, badge: '10' },
  { path: '/admin/content/footer', label: 'Footer & Outreach', icon: Globe },
  { path: '/admin/categories', label: 'Categories', icon: Tag, badge: '9' },
  { path: '/admin/projects', label: 'Projects', icon: FolderGit2, badge: '8' },
  { path: '/admin/skills', label: 'Skills', icon: Sparkles },
  { path: '/admin/services', label: 'Services', icon: Briefcase },
  { path: '/admin/media', label: 'Media', icon: ImageIcon, badge: '24' },
  { path: '/admin/design-system', label: 'Design System', icon: Palette, badge: 'DS' },
  { path: '/admin/settings', label: 'Settings', icon: Settings, requiresAdmin: true },
];

export const AdminLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, role, isAdmin, isEditor, canPublish, signOut } = useAuth();
  const { diffSummary, isDraftModified, publishDraft, revertToPublished } = useWebsiteData();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [reverting, setReverting] = useState(false);

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

  const handleRevert = async () => {
    if (
      window.confirm(
        'Discard all unpublished draft revisions and revert back to the currently published live version?'
      )
    ) {
      setReverting(true);
      try {
        await revertToPublished();
      } finally {
        setReverting(false);
      }
    }
  };

  const userEmail = user?.email || 'darshilbhuva4322@gmail.com';
  const userName = userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] flex flex-col lg:flex-row antialiased selection:bg-[var(--color-text-primary)] selection:text-[var(--color-background-primary)]">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-[var(--color-background-overlay)] backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Top App Bar */}
      <div className="lg:hidden flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--color-border-default)] bg-[var(--color-background-secondary)]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <Button
            variant="icon"
            size="sm"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${isDraftModified ? 'bg-status-warning animate-pulse' : 'bg-status-success'}`} />
            <span className="font-bold text-xs sm:text-sm tracking-tight truncate">SCRiLLO</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Publish badge on mobile if modified */}
          {isDraftModified && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPublishModalOpen(true)}
              className="text-[11px] font-bold uppercase tracking-wider gap-1.5"
              aria-label="Publish Changes"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Publish</span>
              <span className="px-1.5 py-0.2 rounded-full bg-status-warning text-black text-[9px] font-mono font-extrabold">
                {diffSummary.totalChanges}
              </span>
            </Button>
          )}

          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg border border-[var(--color-border-default)] text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)]"
            title="Preview Draft Website"
            aria-label="Preview Draft Website"
          >
            <Eye className="w-4 h-4 text-status-warning" />
          </a>

          <Button
            variant="icon"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-status-warning" /> : <Moon className="w-4 h-4 text-[var(--color-text-primary)]" />}
          </Button>
        </div>
      </div>

      {/* Sidebar: Persistent on Desktop, Collapsible on Tablet/Desktop, Drawer on Mobile */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen border-r border-[var(--color-border-default)] bg-[var(--color-background-secondary)] flex flex-col justify-between
          transition-all duration-300 ease-in-out shrink-0
          ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'w-20' : 'w-[280px] sm:w-64'}
        `}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-4 sm:p-5 border-b border-[var(--color-border-default)] flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-opacity ${sidebarCollapsed ? 'lg:justify-center w-full' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs">
                SD
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm tracking-tight text-[var(--color-text-primary)] truncate">SCRiLLO Panel</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isDraftModified ? 'bg-status-warning animate-pulse' : 'bg-status-success'}`} />
                    <span className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-mono truncate">
                      {isDraftModified ? `${diffSummary.totalChanges} Changes Pending` : 'Live Synced'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Drawer Close Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 flex-1">
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] shadow-xs font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)]/70'
                  } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate flex items-center justify-between gap-1">
                      <span>{item.label}</span>
                      {item.requiresAdmin && !isAdmin && (
                        <span title="Admin Clearance Required">
                          <Lock className="w-3 h-3 text-[var(--color-text-tertiary)] opacity-60 shrink-0" />
                        </span>
                      )}
                    </span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-[var(--color-background-primary)]/20 text-[var(--color-text-inverse)]'
                          : 'bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[var(--color-text-tertiary)]'
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
        <div className="p-3 border-t border-[var(--color-border-default)] space-y-2.5 bg-[var(--color-background-secondary)]">
          {/* Mobile Workflow Actions (Publish & Revert in Drawer) */}
          <div className="lg:hidden space-y-2">
            <Button
              variant="primary"
              size="md"
              disabled={!canPublish}
              onClick={() => {
                if (!canPublish) {
                  alert('Administrator privileges are required to publish changes live.');
                  return;
                }
                setMobileDrawerOpen(false);
                setIsPublishModalOpen(true);
              }}
              className="w-full text-xs font-bold uppercase tracking-wider"
              icon={<UploadCloud className="w-4 h-4" />}
            >
              <span>{canPublish ? 'Publish Changes' : 'Publish (Admin Only)'}</span>
              {isDraftModified && canPublish && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-mono font-extrabold ml-1">
                  {diffSummary.totalChanges}
                </span>
              )}
            </Button>

            {isDraftModified && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleRevert();
                }}
                disabled={reverting}
                className="w-full text-xs font-medium"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                <span>Revert to Published</span>
              </Button>
            )}
          </div>

          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] ${
              sidebarCollapsed ? 'lg:justify-center lg:p-2' : ''
            }`}
          >
            <Avatar name={userName} size="sm" />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{userName}</p>
                  <Badge variant={isAdmin ? 'success' : 'info'} size="sm">
                    {role || 'Viewer'}
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">{userEmail}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Preview Draft Button */}
          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            title={sidebarCollapsed ? 'Preview Draft Website' : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-background-primary)] hover:bg-[var(--color-background-elevated)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] transition-colors ${
              sidebarCollapsed ? 'lg:justify-center' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              {!sidebarCollapsed && <span>Preview Site</span>}
            </span>
            {!sidebarCollapsed && <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono">↗</span>}
          </a>

          {/* Desktop/Tablet Collapse Toggle */}
          <div className="hidden lg:flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
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
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 border-b border-[var(--color-border-default)] bg-[var(--color-background-secondary)]/90 backdrop-blur-md sticky top-0 z-20">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[var(--color-text-tertiary)] uppercase">Admin /</span>
            <h1 className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">{currentNav.label}</h1>
          </div>

          {/* Right Header Controls (Workflow & Actions) */}
          <div className="flex items-center gap-3">
            {/* Revert to Published (if modified) */}
            {isDraftModified && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRevert}
                disabled={reverting}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                title="Discard all unpublished draft changes and revert to live version"
              >
                <span>Revert</span>
              </Button>
            )}

            {/* Preview Website Button */}
            <a
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-elevated)] text-xs font-semibold text-[var(--color-text-primary)] transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Preview Website</span>
              <ExternalLink className="w-3 h-3 text-[var(--color-text-tertiary)]" />
            </a>

            {/* Publish Changes Button */}
            <Button
              variant="primary"
              size="sm"
              disabled={!canPublish}
              onClick={() => {
                if (!canPublish) {
                  alert('Administrator privileges are required to publish changes live.');
                  return;
                }
                setIsPublishModalOpen(true);
              }}
              className="uppercase tracking-wider text-xs font-bold"
              icon={<UploadCloud className="w-3.5 h-3.5" />}
              title={!canPublish ? 'Administrator role required to publish changes' : 'Publish pending changes to live website'}
            >
              <span>{canPublish ? 'Publish Changes' : 'Publish (Admin Only)'}</span>
              {isDraftModified && canPublish && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-mono font-extrabold ml-1">
                  {diffSummary.totalChanges}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            <div className="relative pl-1">
              <Button
                variant="icon"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-success rounded-full ring-2 ring-[var(--color-background-secondary)]" />
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-4 shadow-xl text-xs space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-2.5">
                    <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                      Publication Status
                    </span>
                    <Badge variant={isDraftModified ? 'warning' : 'success'} size="sm">
                      {isDraftModified ? `${diffSummary.totalChanges} Pending` : 'Live Synced'}
                    </Badge>
                  </div>
                  <div className="space-y-2.5 text-[var(--color-text-secondary)]">
                    <div className="p-2.5 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)]">
                      <p className="text-[var(--color-text-primary)] font-medium text-xs">Draft Version</p>
                      <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                        {isDraftModified
                          ? `${diffSummary.totalChanges} draft modifications ready to deploy.`
                          : 'Draft is identical to the published version.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <Button
              variant="icon"
              size="sm"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </Button>

            {/* Current User & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border-default)]">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
                icon={<LogOut className="w-3.5 h-3.5" />}
                title="Sign Out"
              >
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Publish Review Modal */}
      <PublishReviewModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        diffSummary={diffSummary}
        onConfirmPublish={publishDraft}
      />
    </div>
  );
};

export default AdminLayout;
