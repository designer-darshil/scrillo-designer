import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Undo2,
  Sun,
  Moon,
  Monitor,
  Palette,
  Sparkles,
  Globe,
  Image as ImageIcon,
  Activity,
  MousePointer,
  Repeat,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { WebsiteSettings, ThemeColorPalette } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { Button } from '../../design-system/components/Button';
import { Input, Textarea } from '../../design-system/components/Input';
import { Badge } from '../../design-system/components/Badge';
import { Alert } from '../../design-system/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../design-system/components/Card';
import { useToast } from '../../design-system/hooks/useToast';

export const SettingsManager: React.FC = () => {
  const { data, updateSettings } = useWebsiteData();
  const toast = useToast();

  // Local form state cloned from global settings
  const [form, setForm] = useState<WebsiteSettings>(data.settings);

  // Active module tab
  const [activeTab, setActiveTab] = useState<'theme' | 'colors' | 'animations' | 'site'>('theme');

  // Status & feedback
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Prevent accidental loss of unsaved changes
  useUnsavedChanges(isDirty);

  // Media Picker Modal state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'favicon' | 'ogImage' | null>(null);

  // Sync state on remote update
  useEffect(() => {
    if (data.settings) {
      setForm(data.settings);
      setIsDirty(false);
    }
  }, [data.settings]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  // Field change handlers
  const handleThemeChange = (field: keyof WebsiteSettings, value: any) => {
    markDirty();
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (mode: 'dark' | 'light', field: keyof ThemeColorPalette, value: string) => {
    markDirty();
    setForm((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [mode]: {
          ...prev.colors[mode],
          [field]: value,
        },
      },
    }));
  };

  const handleAnimationChange = (field: keyof WebsiteSettings['animations'], value: boolean) => {
    markDirty();
    setForm((prev) => ({
      ...prev,
      animations: {
        ...prev.animations,
        [field]: value,
      },
      // Keep legacy aliases synced
      ...(field === 'cursorEnabled' ? { enableCustomCursor: value } : {}),
      ...(field === 'smoothScrollEnabled' ? { enableSmoothScroll: value } : {}),
    }));
  };

  const handleSEOChange = (field: keyof WebsiteSettings['seo'], value: any) => {
    markDirty();
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  // Reset Colors to Default
  const handleResetColors = () => {
    if (window.confirm('Reset all dark and light color tokens to factory default values?')) {
      markDirty();
      setForm((prev) => ({
        ...prev,
        colors: { ...defaultWebsiteData.settings.colors },
      }));
      toast.info('Color tokens reset to defaults');
    }
  };

  // Reset Entire Settings
  const handleResetAll = () => {
    setForm(data.settings);
    setIsDirty(false);
    setStatus('idle');
    setErrorMessage(null);
    toast.info('Changes reverted to saved values');
  };

  // Save Settings with validation
  const handleSave = async () => {
    if (status === 'saving') return;

    // Validate siteUrl if entered
    if (form.siteUrl) {
      const urlCheck = validators.url(form.siteUrl, true, 'Site Canonical URL');
      if (!urlCheck.isValid) {
        setStatus('error');
        setErrorMessage(urlCheck.error || 'Invalid site canonical URL.');
        toast.error(urlCheck.error || 'Invalid site canonical URL.');
        return;
      }
    }

    // Validate SEO OG image if entered
    if (form.seo?.ogImage) {
      const ogCheck = validators.url(form.seo.ogImage, true, 'Social Share Image (og:image)');
      if (!ogCheck.isValid) {
        setStatus('error');
        setErrorMessage(ogCheck.error || 'Invalid or unsafe OpenGraph image URL.');
        toast.error(ogCheck.error || 'Invalid or unsafe OpenGraph image URL.');
        return;
      }
    }

    // Validate favicon URL if entered
    if (form.seo?.favicon) {
      const favCheck = validators.url(form.seo.favicon, true, 'Favicon Asset URL');
      if (!favCheck.isValid) {
        setStatus('error');
        setErrorMessage(favCheck.error || 'Invalid or unsafe favicon asset URL.');
        toast.error(favCheck.error || 'Invalid or unsafe favicon asset URL.');
        return;
      }
    }

    setStatus('saving');
    setErrorMessage(null);

    try {
      const success = await updateSettings(form);
      if (success) {
        setStatus('saved');
        setIsDirty(false);
        toast.success('Settings saved successfully!');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save settings. Please try again.');
        toast.error('Failed to save settings. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      const formatted = validators.formatFriendlyError(err);
      setErrorMessage(formatted);
      toast.error(formatted);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner / Breadcrumb & Global Action Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin Configuration</span>
              <span className="text-xs text-muted">/</span>
              <Badge variant="neutral" size="sm" className="font-mono uppercase">
                GLOBAL SYSTEM SETTINGS
              </Badge>
              {isDirty && (
                <Badge variant="warning" size="sm" className="animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-foreground" />
              <span>Website Settings & Engine</span>
            </h1>
            <p className="text-xs text-muted mt-1">
              Manage global themes, dynamic CSS color tokens, animation engines, and search metadata.
            </p>
          </div>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetAll}
                leftIcon={<Undo2 className="w-3.5 h-3.5" />}
              >
                Cancel
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || status === 'saving'}
              isLoading={status === 'saving'}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Notifications */}
      {status === 'saved' && (
        <Alert
          variant="success"
          title="Settings saved successfully!"
          onClose={() => setStatus('idle')}
        >
          Changes have been applied globally to the public portfolio website.
        </Alert>
      )}

      {status === 'error' && (
        <Alert
          variant="error"
          title="Failed to save settings"
          onClose={() => setStatus('idle')}
        >
          {errorMessage || 'Please check your inputs and try again.'}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <Button
          type="button"
          variant={activeTab === 'theme' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('theme')}
          leftIcon={<Sun className="w-4 h-4" />}
        >
          Theme Defaults
        </Button>

        <Button
          type="button"
          variant={activeTab === 'colors' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('colors')}
          leftIcon={<Palette className="w-4 h-4" />}
        >
          Color Variables (CSS)
        </Button>

        <Button
          type="button"
          variant={activeTab === 'animations' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('animations')}
          leftIcon={<Activity className="w-4 h-4" />}
        >
          Animation Engine
        </Button>

        <Button
          type="button"
          variant={activeTab === 'site' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('site')}
          leftIcon={<Globe className="w-4 h-4" />}
        >
          Site & SEO Metadata
        </Button>
      </div>

      {/* ================================================== */}
      {/* 1. THEME SETTINGS TAB */}
      {/* ================================================== */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Sun className="w-4 h-4" />
                <span>Default Portfolio Theme</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure the initial appearance for visitors landing on the public website. Public visitors can still toggle themes using the client switch.
              </CardDescription>
            </div>

            {/* Default Theme Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-foreground">
                Default Theme (Initial Landing State)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'dark',
                    label: 'Dark Mode (Default)',
                    desc: 'Deep monochrome, #050505 obsidian aesthetic',
                    icon: Moon,
                  },
                  {
                    id: 'light',
                    label: 'Light Mode',
                    desc: 'Clean warm stone, #F3F2EE architectural contrast',
                    icon: Sun,
                  },
                  {
                    id: 'system',
                    label: 'System Preference',
                    desc: 'Automatically matches OS dark/light mode',
                    icon: Monitor,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = form.defaultTheme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleThemeChange('defaultTheme', option.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-foreground ring-2 ring-foreground/20 bg-background shadow-xs'
                          : 'border-border bg-background/50 hover:border-foreground/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-4 h-4 text-foreground" />
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-foreground inline-block" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-foreground">{option.label}</p>
                      <p className="text-[11px] text-muted mt-0.5">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Support Toggles */}
            <div className="pt-4 border-t border-border space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                Theme Availability Controls
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">Dark Mode Enabled</p>
                    <p className="text-[11px] text-muted">Allow dark mode to be loaded and toggled</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.darkModeEnabled !== false}
                    onChange={(e) => handleThemeChange('darkModeEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">Light Mode Enabled</p>
                    <p className="text-[11px] text-muted">Allow light mode to be loaded and toggled</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.lightModeEnabled !== false}
                    onChange={(e) => handleThemeChange('lightModeEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-foreground accent-foreground cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. COLOR VARIABLES TAB (CSS Variables) */}
      {/* ================================================== */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Header Note & Reset */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
            <div>
              <p className="text-xs font-bold text-foreground">Controlled Color Variables</p>
              <p className="text-[11px] text-muted">
                Applied dynamically across the site via CSS variables (<code className="font-mono">--bg</code>, <code className="font-mono">--text</code>, <code className="font-mono">--muted</code>, <code className="font-mono">--border</code>).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleResetColors}
              leftIcon={<RotateCcw className="w-3 h-3" />}
            >
              Reset to Defaults
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dark Theme Colors */}
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-foreground" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Dark Theme Palette
                  </CardTitle>
                </div>
                <Badge variant="neutral" size="sm" className="font-mono">
                  [data-theme="dark"]
                </Badge>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Dark Background */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Dark Background (--bg)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.dark?.background || '#050505'}
                      onChange={(e) => handleColorChange('dark', 'background', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.dark?.background || '#050505'}
                      onChange={(e) => handleColorChange('dark', 'background', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Dark Text */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Dark Text (--text / --foreground)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.dark?.text || '#F5F5F2'}
                      onChange={(e) => handleColorChange('dark', 'text', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.dark?.text || '#F5F5F2'}
                      onChange={(e) => handleColorChange('dark', 'text', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Dark Muted */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Dark Muted (--muted / --text-muted)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.dark?.muted || '#8E8E8E'}
                      onChange={(e) => handleColorChange('dark', 'muted', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.dark?.muted || '#8E8E8E'}
                      onChange={(e) => handleColorChange('dark', 'muted', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Dark Border */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Dark Border (--border)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.dark?.border || '#292929'}
                      onChange={(e) => handleColorChange('dark', 'border', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.dark?.border || '#292929'}
                      onChange={(e) => handleColorChange('dark', 'border', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Dark Preview Card */}
              <div
                className="p-4 rounded-xl border mt-4 space-y-2 transition-colors"
                style={{
                  backgroundColor: form.colors?.dark?.background || '#050505',
                  borderColor: form.colors?.dark?.border || '#292929',
                }}
              >
                <p className="text-xs font-bold" style={{ color: form.colors?.dark?.text || '#F5F5F2' }}>
                  Dark Specimen Sample Text
                </p>
                <p className="text-[11px]" style={{ color: form.colors?.dark?.muted || '#8E8E8E' }}>
                  Subtext and muted metadata render with this contrast ratio.
                </p>
              </div>
            </Card>

            {/* Light Theme Colors */}
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-foreground" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Light Theme Palette
                  </CardTitle>
                </div>
                <Badge variant="neutral" size="sm" className="font-mono">
                  [data-theme="light"]
                </Badge>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Light Background */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Light Background (--bg)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.light?.background || '#F3F2EE'}
                      onChange={(e) => handleColorChange('light', 'background', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.light?.background || '#F3F2EE'}
                      onChange={(e) => handleColorChange('light', 'background', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Light Text */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Light Text (--text / --foreground)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.light?.text || '#111111'}
                      onChange={(e) => handleColorChange('light', 'text', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.light?.text || '#111111'}
                      onChange={(e) => handleColorChange('light', 'text', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Light Muted */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Light Muted (--muted / --text-muted)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.light?.muted || '#6F6F6A'}
                      onChange={(e) => handleColorChange('light', 'muted', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.light?.muted || '#6F6F6A'}
                      onChange={(e) => handleColorChange('light', 'muted', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Light Border */}
                <div className="space-y-1.5">
                  <label className="text-muted block text-[11px]">Light Border (--border)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={form.colors?.light?.border || '#C9C8C2'}
                      onChange={(e) => handleColorChange('light', 'border', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-border bg-transparent p-0.5 cursor-pointer shrink-0"
                    />
                    <Input
                      value={form.colors?.light?.border || '#C9C8C2'}
                      onChange={(e) => handleColorChange('light', 'border', e.target.value)}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Light Preview Card */}
              <div
                className="p-4 rounded-xl border mt-4 space-y-2 transition-colors"
                style={{
                  backgroundColor: form.colors?.light?.background || '#F3F2EE',
                  borderColor: form.colors?.light?.border || '#C9C8C2',
                }}
              >
                <p className="text-xs font-bold" style={{ color: form.colors?.light?.text || '#111111' }}>
                  Light Specimen Sample Text
                </p>
                <p className="text-[11px]" style={{ color: form.colors?.light?.muted || '#6F6F6A' }}>
                  Subtext and muted metadata render with this contrast ratio.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. ANIMATION SETTINGS TAB */}
      {/* ================================================== */}
      {activeTab === 'animations' && (
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Animation & Motion Engine Configuration</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Toggle interactive performance features like smooth scroll physics, custom precision cursor, and kinetic marquee.
              </CardDescription>
            </div>

            {/* Reduced Motion Notice */}
            <div className="p-4 rounded-xl border border-border bg-background/60 text-xs text-muted space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                <span>Accessibility Compliance Notice</span>
              </p>
              <p>
                The public website strictly honors system-level <code className="font-mono text-foreground">prefers-reduced-motion</code> settings across all devices regardless of administrative overrides.
              </p>
            </div>

            {/* Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Animations Enabled */}
              <div className="p-5 rounded-xl border border-border bg-background flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-foreground" />
                    <p className="text-xs font-bold text-foreground">Animations Enabled</p>
                  </div>
                  <p className="text-[11px] text-muted">
                    Enable GSAP choreographed scroll triggers and reveal transitions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.animations?.animationsEnabled !== false}
                  onChange={(e) => handleAnimationChange('animationsEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
                />
              </div>

              {/* Smooth Scroll Enabled */}
              <div className="p-5 rounded-xl border border-border bg-background flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-foreground" />
                    <p className="text-xs font-bold text-foreground">Smooth Scroll Enabled</p>
                  </div>
                  <p className="text-[11px] text-muted">
                    Enable Lenis 120fps hardware-accelerated momentum scrolling.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.animations?.smoothScrollEnabled !== false}
                  onChange={(e) => handleAnimationChange('smoothScrollEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
                />
              </div>

              {/* Cursor Enabled */}
              <div className="p-5 rounded-xl border border-border bg-background flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-foreground" />
                    <p className="text-xs font-bold text-foreground">Cursor Enabled</p>
                  </div>
                  <p className="text-[11px] text-muted">
                    Enable desktop custom magnetic cursor dot and expanding follower.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.animations?.cursorEnabled !== false}
                  onChange={(e) => handleAnimationChange('cursorEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
                />
              </div>

              {/* Marquee Enabled */}
              <div className="p-5 rounded-xl border border-border bg-background flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-foreground" />
                    <p className="text-xs font-bold text-foreground">Marquee Enabled</p>
                  </div>
                  <p className="text-[11px] text-muted">
                    Render kinetic typography marquee strip between hero and projects.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.animations?.marqueeEnabled !== false}
                  onChange={(e) => handleAnimationChange('marqueeEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-border text-foreground accent-foreground cursor-pointer shrink-0"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================================================== */}
      {/* 4. SITE & SEO SETTINGS TAB */}
      {/* ================================================== */}
      {activeTab === 'site' && (
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Site Identity & Global SEO Parameters</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Set public site title, meta descriptions, canonical domain, favicon icon, and OpenGraph preview images.
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Name */}
              <div>
                <Input
                  label="Site Name (Brand Identifier)"
                  value={form.siteTitle || ''}
                  onChange={(e) => handleThemeChange('siteTitle', e.target.value)}
                  placeholder="DARSHIL S. BHUVA"
                  className="font-bold text-xs"
                />
              </div>

              {/* Site URL */}
              <div>
                <Input
                  label="Site Canonical URL"
                  value={form.siteUrl || ''}
                  onChange={(e) => handleThemeChange('siteUrl', e.target.value)}
                  placeholder="https://darshilbhuva.com"
                  className="font-mono text-xs"
                />
              </div>

              {/* Site Description */}
              <div className="md:col-span-2">
                <Textarea
                  label="Site Description (Core Tagline)"
                  rows={2}
                  value={form.siteDescription || ''}
                  onChange={(e) => handleThemeChange('siteDescription', e.target.value)}
                  placeholder="As a UI/UX and Web Designer, I transform your ideas into dynamic digital experiences. Consider me your all-in-one expert for diverse business solutions."
                />
              </div>

              {/* Default SEO Title */}
              <div>
                <Input
                  label="Default SEO Title Tag"
                  value={form.seo?.metaTitle || ''}
                  onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                  placeholder="DARSHIL S. BHUVA — UI/UX Designer & Web Designer"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="settings-favicon" className="block text-xs font-semibold text-foreground">
                    Favicon Asset Link
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setMediaPickerTarget('favicon')}
                    leftIcon={<ImageIcon className="w-3 h-3" />}
                  >
                    Choose from Media
                  </Button>
                </div>
                <Input
                  id="settings-favicon"
                  value={form.seo?.favicon || ''}
                  onChange={(e) => handleSEOChange('favicon', e.target.value)}
                  placeholder="/favicon.ico or CDN URL"
                  className="font-mono text-xs"
                />
              </div>

              {/* Default SEO Description */}
              <div className="md:col-span-2">
                <Textarea
                  label="Default SEO Meta Description"
                  rows={2}
                  value={form.seo?.metaDescription || ''}
                  onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                  placeholder="Building digital experiences that feel inevitable. Full-stack designer & creative developer based in India."
                />
              </div>

              {/* OG Image */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="settings-og-image" className="block text-xs font-semibold text-foreground">
                    OpenGraph Social Share Image (OG Image)
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setMediaPickerTarget('ogImage')}
                    leftIcon={<ImageIcon className="w-3 h-3" />}
                  >
                    Choose from Media Library
                  </Button>
                </div>
                <Input
                  id="settings-og-image"
                  value={form.seo?.ogImage || ''}
                  onChange={(e) => handleSEOChange('ogImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="font-mono text-xs"
                />

                {form.seo?.ogImage && (
                  <div className="p-3 rounded-xl border border-border bg-background max-w-sm space-y-1.5">
                    <p className="text-[11px] text-muted font-medium">OG Image Preview:</p>
                    <div className="aspect-[1200/630] rounded-lg overflow-hidden border border-border bg-surface">
                      <img src={form.seo.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Media Picker Modal for Favicon and OG Image */}
      <MediaPickerModal
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={(url) => {
          if (mediaPickerTarget === 'favicon') {
            handleSEOChange('favicon', url);
          } else if (mediaPickerTarget === 'ogImage') {
            handleSEOChange('ogImage', url);
          }
        }}
        title={`Select ${mediaPickerTarget === 'favicon' ? 'Favicon Asset' : 'Social OG Image'}`}
      />
    </div>
  );
};

export default SettingsManager;
