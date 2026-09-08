import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Palette,
  Sparkles,
  Layers,
  Globe,
  Image as ImageIcon,
  Activity,
  MousePointer,
  Repeat,
  Compass,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { WebsiteSettings, ThemeColorPalette } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

export const SettingsManager: React.FC = () => {
  const { data, updateSettings } = useWebsiteData();

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
    }
  };

  // Reset Entire Settings
  const handleResetAll = () => {
    setForm(data.settings);
    setIsDirty(false);
    setStatus('idle');
    setErrorMessage(null);
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
        return;
      }
    }

    // Validate SEO OG image if entered
    if (form.seo?.ogImage) {
      const ogCheck = validators.url(form.seo.ogImage, true, 'Social Share Image (og:image)');
      if (!ogCheck.isValid) {
        setStatus('error');
        setErrorMessage(ogCheck.error || 'Invalid or unsafe OpenGraph image URL.');
        return;
      }
    }

    // Validate favicon URL if entered
    if (form.seo?.favicon) {
      const favCheck = validators.url(form.seo.favicon, true, 'Favicon Asset URL');
      if (!favCheck.isValid) {
        setStatus('error');
        setErrorMessage(favCheck.error || 'Invalid or unsafe favicon asset URL.');
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
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save settings. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(validators.formatFriendlyError(err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner / Breadcrumb & Global Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin Configuration</span>
            <span className="text-xs text-muted">/</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono">
              GLOBAL SYSTEM SETTINGS
            </span>
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
            <button
              type="button"
              onClick={handleResetAll}
              className="px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving' || !isDirty}
            className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
              isDirty
                ? 'bg-foreground text-background hover:opacity-90 cursor-pointer'
                : 'bg-surface border border-border text-muted opacity-60 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{status === 'saving' ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {status === 'saved' && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Settings saved successfully!</p>
            <p className="opacity-80">Changes have been applied globally to the public portfolio website.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Failed to save settings</p>
            <p className="opacity-90">{errorMessage || 'Please check your inputs and try again.'}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'theme'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Theme Defaults</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'colors'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Color Variables (CSS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('animations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'animations'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Animation Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('site')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'site'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Site & SEO Metadata</span>
        </button>
      </div>

      {/* ================================================== */}
      {/* 1. THEME SETTINGS TAB */}
      {/* ================================================== */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Default Portfolio Theme</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Configure the initial appearance for visitors landing on the public website. Public visitors can still toggle themes using the client switch.
              </p>
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
          </div>
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
            <button
              type="button"
              onClick={handleResetColors}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dark Theme Colors */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-foreground" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Dark Theme Palette
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background border border-border text-muted">
                  [data-theme="dark"]
                </span>
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
                    <input
                      type="text"
                      value={form.colors?.dark?.background || '#050505'}
                      onChange={(e) => handleColorChange('dark', 'background', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
                    <input
                      type="text"
                      value={form.colors?.dark?.text || '#F5F5F2'}
                      onChange={(e) => handleColorChange('dark', 'text', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
                    <input
                      type="text"
                      value={form.colors?.dark?.muted || '#8E8E8E'}
                      onChange={(e) => handleColorChange('dark', 'muted', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
                    <input
                      type="text"
                      value={form.colors?.dark?.border || '#292929'}
                      onChange={(e) => handleColorChange('dark', 'border', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
            </div>

            {/* Light Theme Colors */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-foreground" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Light Theme Palette
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background border border-border text-muted">
                  [data-theme="light"]
                </span>
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
                    <input
                      type="text"
                      value={form.colors?.light?.background || '#F3F2EE'}
                      onChange={(e) => handleColorChange('light', 'background', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
                    <input
                      type="text"
                      value={form.colors?.light?.text || '#111111'}
                      onChange={(e) => handleColorChange('light', 'text', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
                    <input
                      type="text"
                      value={form.colors?.light?.muted || '#6F6F6A'}
                      onChange={(e) => handleColorChange('light', 'muted', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
                    <input
                      type="text"
                      value={form.colors?.light?.border || '#C9C8C2'}
                      onChange={(e) => handleColorChange('light', 'border', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. ANIMATION SETTINGS TAB */}
      {/* ================================================== */}
      {activeTab === 'animations' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Animation & Motion Engine Configuration</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Toggle interactive performance features like smooth scroll physics, custom precision cursor, and kinetic marquee.
              </p>
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
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 4. SITE & SEO SETTINGS TAB */}
      {/* ================================================== */}
      {activeTab === 'site' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Site Identity & Global SEO Parameters</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Set public site title, meta descriptions, canonical domain, favicon icon, and OpenGraph preview images.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Name */}
              <div className="space-y-2">
                <label htmlFor="settings-site-name" className="block text-xs font-semibold text-foreground">
                  Site Name (Brand Identifier)
                </label>
                <input
                  id="settings-site-name"
                  type="text"
                  value={form.siteTitle || ''}
                  onChange={(e) => handleThemeChange('siteTitle', e.target.value)}
                  placeholder="DARSHIL BHUVA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Site URL */}
              <div className="space-y-2">
                <label htmlFor="settings-site-url" className="block text-xs font-semibold text-foreground">
                  Site Canonical URL
                </label>
                <input
                  id="settings-site-url"
                  type="text"
                  value={form.siteUrl || ''}
                  onChange={(e) => handleThemeChange('siteUrl', e.target.value)}
                  placeholder="https://darshilbhuva.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Site Description */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="settings-site-desc" className="block text-xs font-semibold text-foreground">
                  Site Description (Core Tagline)
                </label>
                <textarea
                  id="settings-site-desc"
                  rows={2}
                  value={form.siteDescription || ''}
                  onChange={(e) => handleThemeChange('siteDescription', e.target.value)}
                  placeholder="Digital product designer & creative developer focused on thoughtful interfaces, products and interactive experiences."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Default SEO Title */}
              <div className="space-y-2">
                <label htmlFor="settings-seo-title" className="block text-xs font-semibold text-foreground">
                  Default SEO Title Tag
                </label>
                <input
                  id="settings-seo-title"
                  type="text"
                  value={form.seo?.metaTitle || ''}
                  onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                  placeholder="DARSHIL BHUVA — Portfolio 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="settings-favicon" className="block text-xs font-semibold text-foreground">
                    Favicon Asset Link
                  </label>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('favicon')}
                    className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-foreground underline"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Choose from Media</span>
                  </button>
                </div>
                <input
                  id="settings-favicon"
                  type="text"
                  value={form.seo?.favicon || ''}
                  onChange={(e) => handleSEOChange('favicon', e.target.value)}
                  placeholder="/favicon.ico or CDN URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Default SEO Description */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="settings-seo-desc" className="block text-xs font-semibold text-foreground">
                  Default SEO Meta Description
                </label>
                <textarea
                  id="settings-seo-desc"
                  rows={2}
                  value={form.seo?.metaDescription || ''}
                  onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                  placeholder="Building digital experiences that feel inevitable. Full-stack designer & creative developer based in India."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* OG Image */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="settings-og-image" className="block text-xs font-semibold text-foreground">
                    OpenGraph Social Share Image (OG Image)
                  </label>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('ogImage')}
                    className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-foreground underline"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Choose from Media Library</span>
                  </button>
                </div>
                <input
                  id="settings-og-image"
                  type="text"
                  value={form.seo?.ogImage || ''}
                  onChange={(e) => handleSEOChange('ogImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
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
          </div>
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
