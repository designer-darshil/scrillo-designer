import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  Sliders,
  Sparkles,
  Link as LinkIcon,
  User,
  Layers,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { HeaderSettings, HeaderNavItem } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Badge } from '../../design-system/components/Badge';
import { Alert } from '../../design-system/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../design-system/components/Card';
import { useToast } from '../../design-system/hooks/useToast';

export const HeaderManager: React.FC = () => {
  const { data, updateHeader } = useWebsiteData();
  const toast = useToast();

  // Local state initialized from website data header settings (or defaults)
  const [headerForm, setHeaderForm] = useState<HeaderSettings>(
    data.header || defaultWebsiteData.header!
  );
  const [navItems, setNavItems] = useState<HeaderNavItem[]>(
    data.header?.navigationItems || defaultWebsiteData.header!.navigationItems
  );

  // Status & Feedback
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Add Item Modal / Inline state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');
  const [newExternal, setNewExternal] = useState(false);

  // Edit Item Modal / Inline state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref] = useState('');
  const [editExternal, setEditExternal] = useState(false);

  // Prevent accidental loss of unsaved changes
  useUnsavedChanges(isDirty);

  // Sync state when data changes externally
  useEffect(() => {
    if (data.header) {
      setHeaderForm(data.header);
      setNavItems(data.header.navigationItems || defaultWebsiteData.header!.navigationItems);
      setIsDirty(false);
    }
  }, [data.header]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  const handleFieldChange = (field: keyof HeaderSettings, value: any) => {
    markDirty();
    setHeaderForm((prev) => ({ ...prev, [field]: value }));
  };

  // Move item up in order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    markDirty();
    const items = [...navItems];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;
    // Re-assign sequence order
    const updated = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(updated);
  };

  // Move item down in order
  const handleMoveDown = (index: number) => {
    if (index === navItems.length - 1) return;
    markDirty();
    const items = [...navItems];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;
    // Re-assign sequence order
    const updated = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(updated);
  };

  // Toggle item visibility
  const handleToggleVisibility = (id: string) => {
    markDirty();
    setNavItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    if (navItems.length <= 1) {
      toast.error('Navigation must have at least one item');
      return;
    }
    markDirty();
    const filtered = navItems.filter((item) => item.id !== id);
    const updated = filtered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(updated);
    toast.info('Navigation item removed');
  };

  // Start Editing Item
  const handleStartEdit = (item: HeaderNavItem) => {
    setEditingItemId(item.id);
    setEditLabel(item.label);
    setEditHref(item.href);
    setEditExternal(Boolean(item.external));
  };

  // Save Edit Item
  const handleSaveEdit = () => {
    if (!editLabel.trim()) {
      toast.error('Navigation label cannot be empty');
      return;
    }
    if (!editHref.trim()) {
      toast.error('URL / Link cannot be empty');
      return;
    }
    markDirty();
    setNavItems((prev) =>
      prev.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              label: editLabel.trim(),
              href: editHref.trim(),
              external: editExternal,
            }
          : item
      )
    );
    setEditingItemId(null);
    toast.success('Navigation item updated');
  };

  // Cancel Edit Item
  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  // Add New Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) {
      toast.error('Please provide a label for the navigation item');
      return;
    }
    if (!newHref.trim()) {
      toast.error('Please provide a URL or section anchor (e.g. #works)');
      return;
    }

    markDirty();
    const id = newLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') || `nav-${Date.now()}`;
    const newItem: HeaderNavItem = {
      id: `${id}-${Date.now()}`,
      label: newLabel.trim(),
      href: newHref.trim(),
      visible: true,
      order: navItems.length + 1,
      external: newExternal,
    };

    setNavItems((prev) => [...prev, newItem]);
    setNewLabel('');
    setNewHref('');
    setNewExternal(false);
    setIsAddingItem(false);
    toast.success(`Navigation item "${newItem.label}" added`);
  };

  // Reset to default
  const handleResetToDefaults = () => {
    if (window.confirm('Reset header settings and navigation items to defaults?')) {
      markDirty();
      setHeaderForm(defaultWebsiteData.header!);
      setNavItems(defaultWebsiteData.header!.navigationItems);
      toast.info('Header settings reset to defaults');
    }
  };

  // Save all changes
  const handleSave = async () => {
    if (status === 'saving') return;
    setStatus('saving');
    setErrorMessage(null);

    const payload: HeaderSettings = {
      ...headerForm,
      navigationItems: navItems.map((item, idx) => ({ ...item, order: idx + 1 })),
    };

    try {
      const success = await updateHeader(payload);
      if (success) {
        setStatus('saved');
        setIsDirty(false);
        toast.success('Header settings and navigation updated successfully');
      } else {
        setStatus('error');
        setErrorMessage('Failed to save header settings.');
        toast.error('Failed to save header settings.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Unexpected error occurred.');
      toast.error(err?.message || 'Unexpected error occurred.');
    }
  };

  const profileName = data.profile?.name || defaultWebsiteData.profile!.name;
  const profileTitle = data.profile?.title || defaultWebsiteData.profile!.title;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ── Page Header Bar ──────────────────────────────── */}
      <Card className="p-6 sm:p-8 bg-surface border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-foreground text-background">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">
                  Header & Navigation Manager
                </CardTitle>
                <CardDescription className="text-xs text-muted">
                  Configure the fixed public header, dynamic brand identity, and menu link structure.
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
            {isDirty && (
              <Badge variant="warning" size="sm" className="font-mono">
                ● Unsaved Changes
              </Badge>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToDefaults}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Defaults
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || status === 'saving'}
              isLoading={status === 'saving'}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Header
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Status Alerts ──────────────────────────────── */}
      {status === 'saved' && (
        <Alert
          variant="success"
          title="Header settings saved!"
          onClose={() => setStatus('idle')}
        >
          Public header and mobile index navigation are live with the updated data.
        </Alert>
      )}

      {status === 'error' && (
        <Alert
          variant="error"
          title="Failed to save header"
          onClose={() => setStatus('idle')}
        >
          {errorMessage || 'Please check your inputs and try again.'}
        </Alert>
      )}

      {/* ── Section 1: Brand & Role Identity ────────────────── */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Brand Name & Role Tagline</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Controls the top-left brand mark and center role title in the public header.
            </CardDescription>
          </div>
          <Badge variant="neutral" size="sm" className="font-mono">
            profile → header
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Brand Name */}
          <div className="md:col-span-2 space-y-1.5">
            <Input
              label="Brand Name (Optional Override)"
              value={headerForm.brandName || ''}
              onChange={(e) => handleFieldChange('brandName', e.target.value)}
              placeholder={profileName}
              helperText={`Leave blank to automatically inherit from Profile name ("${profileName}")`}
              className="text-xs font-semibold"
            />
          </div>

          {/* Brand Suffix */}
          <div className="space-y-1.5">
            <Input
              label="Brand Suffix"
              value={headerForm.brandSuffix ?? '®'}
              onChange={(e) => handleFieldChange('brandSuffix', e.target.value)}
              placeholder="®"
              helperText="Editorial mark next to brand (e.g. ®, ™, or blank)"
              className="text-xs font-mono"
            />
          </div>

          {/* Role Text */}
          <div className="md:col-span-3 space-y-1.5">
            <Input
              label="Role Tagline (Optional Override)"
              value={headerForm.roleText || ''}
              onChange={(e) => handleFieldChange('roleText', e.target.value)}
              placeholder={profileTitle}
              helperText={`Leave blank to automatically inherit from Profile title ("${profileTitle}")`}
              className="text-xs"
            />
          </div>
        </div>

        {/* Live Specimen Preview */}
        <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-foreground">
            <span className="w-1.5 h-1.5 bg-foreground inline-block" />
            <span className="font-semibold">
              {headerForm.brandName?.trim() || profileName}
            </span>
            <span className="text-muted/60 text-[11px]">{headerForm.brandSuffix ?? '®'}</span>
          </div>

          <div className="text-muted text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-muted/40">/</span>
            <span>{headerForm.roleText?.trim() || profileTitle}</span>
          </div>
        </div>
      </Card>

      {/* ── Section 2: Header Visibility Controls ────────────── */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Visibility & Feature Toggles</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Turn specific header components on or off on the public website.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Show Header */}
          <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="text-xs font-bold text-foreground">Show Header</p>
              <p className="text-[11px] text-muted">Fixed header bar visible</p>
            </div>
            <input
              type="checkbox"
              checked={headerForm.showHeader !== false}
              onChange={(e) => handleFieldChange('showHeader', e.target.checked)}
              className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
            />
          </div>

          {/* Show Role */}
          <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="text-xs font-bold text-foreground">Show Role Tagline</p>
              <p className="text-[11px] text-muted">Center role title on desktop</p>
            </div>
            <input
              type="checkbox"
              checked={headerForm.showRole !== false}
              onChange={(e) => handleFieldChange('showRole', e.target.checked)}
              className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
            />
          </div>

          {/* Show Navigation */}
          <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="text-xs font-bold text-foreground">Show Navigation</p>
              <p className="text-[11px] text-muted">Desktop menu links</p>
            </div>
            <input
              type="checkbox"
              checked={headerForm.showNavigation !== false}
              onChange={(e) => handleFieldChange('showNavigation', e.target.checked)}
              className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
            />
          </div>

          {/* Show Theme Toggle */}
          <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="text-xs font-bold text-foreground">Show Theme Toggle</p>
              <p className="text-[11px] text-muted">DARK / LIGHT button</p>
            </div>
            <input
              type="checkbox"
              checked={headerForm.showThemeToggle !== false}
              onChange={(e) => handleFieldChange('showThemeToggle', e.target.checked)}
              className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
            />
          </div>

          {/* Show Contact CTA Button */}
          <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="text-xs font-bold text-foreground">Show Contact Button</p>
              <p className="text-[11px] text-muted">Direct button in header</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(headerForm.showContactButton)}
              onChange={(e) => handleFieldChange('showContactButton', e.target.checked)}
              className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
            />
          </div>
        </div>

        {/* Contact Button Details if enabled */}
        {headerForm.showContactButton && (
          <div className="p-4 rounded-xl border border-border bg-surface grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Button Text"
              value={headerForm.contactButtonText || "Let's Talk"}
              onChange={(e) => handleFieldChange('contactButtonText', e.target.value)}
              placeholder="Let's Talk"
              className="text-xs"
            />
            <Input
              label="Contact Button URL / Anchor"
              value={headerForm.contactButtonHref || '#contact'}
              onChange={(e) => handleFieldChange('contactButtonHref', e.target.value)}
              placeholder="#contact"
              className="text-xs font-mono"
            />
          </div>
        )}
      </Card>

      {/* ── Section 3: Navigation Items Editor ──────────────── */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <LinkIcon className="w-4 h-4" />
              <span>Navigation Items ({navItems.length})</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Reorder, toggle visibility, and customize links rendered on desktop and the mobile menu.
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsAddingItem(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Navigation Item
          </Button>
        </div>

        {/* Add Item Modal / Inline Card */}
        {isAddingItem && (
          <form
            onSubmit={handleAddItem}
            className="p-5 rounded-xl border border-foreground/30 bg-surface space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Add New Navigation Item
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="text-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Services"
                required
                className="text-xs"
              />
              <Input
                label="URL / Anchor (e.g. #services or https://...)"
                value={newHref}
                onChange={(e) => setNewHref(e.target.value)}
                placeholder="#services"
                required
                className="text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={newExternal}
                  onChange={(e) => setNewExternal(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer"
                />
                <span>Open link in new tab (External link)</span>
              </label>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingItem(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add Item
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Navigation Items List */}
        <div className="space-y-2.5">
          {navItems.map((item, index) => {
            const isEditing = editingItemId === item.id;
            const isFirst = index === 0;
            const isLast = index === navItems.length - 1;

            if (isEditing) {
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-foreground/40 bg-surface space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Label"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      label="URL / Anchor"
                      value={editHref}
                      onChange={(e) => setEditHref(e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editExternal}
                        onChange={(e) => setEditExternal(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer"
                      />
                      <span>External link</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="xs"
                        onClick={handleSaveEdit}
                        leftIcon={<Check className="w-3 h-3" />}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  item.visible
                    ? 'border-border bg-background'
                    : 'border-border/60 bg-surface/50 opacity-60'
                }`}
              >
                {/* Left: Drag / Order & Label */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1 text-muted">
                    <GripVertical className="w-4 h-4 text-muted/50" />
                    <span className="font-mono text-xs font-bold text-muted w-5">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground truncate">
                        {item.label}
                      </p>
                      {item.external && (
                        <Badge variant="neutral" size="sm" className="font-mono text-[9px] px-1 py-0">
                          EXTERNAL
                        </Badge>
                      )}
                      {!item.visible && (
                        <Badge variant="warning" size="sm" className="font-mono text-[9px] px-1 py-0">
                          HIDDEN
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-muted truncate">
                      {item.href}
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Move, Visibility, Edit, Delete) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Move Up */}
                  <Button
                    type="button"
                    variant="icon"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst}
                    aria-label="Move Up"
                    className="h-7 w-7"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>

                  {/* Move Down */}
                  <Button
                    type="button"
                    variant="icon"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast}
                    aria-label="Move Down"
                    className="h-7 w-7"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>

                  {/* Toggle Visibility */}
                  <Button
                    type="button"
                    variant="icon"
                    size="sm"
                    onClick={() => handleToggleVisibility(item.id)}
                    aria-label={item.visible ? 'Hide item' : 'Show item'}
                    className="h-7 w-7"
                  >
                    {item.visible ? (
                      <Eye className="w-3.5 h-3.5 text-foreground" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-muted" />
                    )}
                  </Button>

                  {/* Edit */}
                  <Button
                    type="button"
                    variant="icon"
                    size="sm"
                    onClick={() => handleStartEdit(item)}
                    aria-label="Edit item"
                    className="h-7 w-7"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="icon"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Delete item"
                    className="h-7 w-7 text-status-error hover:bg-status-error/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default HeaderManager;
