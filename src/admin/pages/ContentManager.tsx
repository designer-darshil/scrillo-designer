import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  FileText,
  Repeat,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { HeroContent, AboutContent, MarqueeContent } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

const curatedHeroImages = [
  {
    label: 'Abstract Minimal Geometric',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Monochrome Spatial Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=85',
  },
  {
    label: 'Dark Kinetic Fluidics',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Brutalist Monolith',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Clean Studio Specimen',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
];

type TabSection = 'hero' | 'about' | 'marquee';

export const ContentManager: React.FC = () => {
  const { data, updateHero, updateAbout, updateMarquee, refreshData } = useWebsiteData();

  const [activeTab, setActiveTab] = useState<TabSection>('hero');

  // Local working state
  const [heroForm, setHeroForm] = useState<HeroContent>(data.hero);
  const [aboutForm, setAboutForm] = useState<AboutContent>(data.about);
  const [marqueeForm, setMarqueeForm] = useState<MarqueeContent>(data.marquee);

  // New marquee item buffer
  const [newMarqueeItem, setNewMarqueeItem] = useState('');

  // Status & feedback
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sync initial state when remote data loads
  useEffect(() => {
    setHeroForm(data.hero);
    setAboutForm(data.about);
    setMarqueeForm(data.marquee);
    setIsDirty(false);
  }, [data]);

  // Check dirty state
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  // Hero form field handler
  const handleHeroChange = (field: keyof HeroContent, value: any) => {
    markDirty();
    setHeroForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Keep headlineLines synchronized if title changed
      if (field === 'title' && typeof value === 'string') {
        const lines = value.split('\n').filter(Boolean);
        if (lines.length > 0) {
          updated.headlineLines = lines;
        }
      }
      return updated;
    });
  };

  // About form field handler
  const handleAboutChange = (field: keyof AboutContent, value: any) => {
    markDirty();
    setAboutForm((prev) => ({ ...prev, [field]: value }));
  };

  // Marquee handlers
  const handleAddMarqueeItem = () => {
    const trimmed = newMarqueeItem.trim();
    if (!trimmed) return;
    markDirty();
    setMarqueeForm((prev) => ({
      ...prev,
      items: [...prev.items, trimmed.toUpperCase()],
    }));
    setNewMarqueeItem('');
  };

  const handleEditMarqueeItem = (index: number, value: string) => {
    markDirty();
    setMarqueeForm((prev) => {
      const updated = [...prev.items];
      updated[index] = value;
      return { ...prev, items: updated };
    });
  };

  const handleDeleteMarqueeItem = (index: number) => {
    markDirty();
    setMarqueeForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveMarqueeItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= marqueeForm.items.length) return;
    markDirty();
    setMarqueeForm((prev) => {
      const updated = [...prev.items];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, items: updated };
    });
  };

  // Save all changes
  const handleSave = async () => {
    try {
      setStatus('saving');
      setErrorMessage(null);

      // Save hero, about, marquee concurrently
      const results = await Promise.all([
        updateHero(heroForm),
        updateAbout(aboutForm),
        updateMarquee(marqueeForm),
      ]);

      if (results.every(Boolean)) {
        setStatus('saved');
        setIsDirty(false);
        setTimeout(() => setStatus('idle'), 3500);
      } else {
        setStatus('error');
        setErrorMessage('Failed to persist updates to database. Changes saved locally.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Network error while updating content');
    }
  };

  // Cancel / revert
  const handleCancel = () => {
    if (isDirty) {
      if (!window.confirm('Discard unsaved modifications and revert to last saved state?')) {
        return;
      }
    }
    setHeroForm(data.hero);
    setAboutForm(data.about);
    setMarqueeForm(data.marquee);
    setIsDirty(false);
    setStatus('idle');
  };

  // Reset to default baseline data
  const handleResetToDefault = () => {
    if (window.confirm('Reset this content to default baseline portfolio specimen? This will overwrite working changes.')) {
      setHeroForm(defaultWebsiteData.hero);
      setAboutForm(defaultWebsiteData.about);
      setMarqueeForm(defaultWebsiteData.marquee);
      markDirty();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Bar with Action Controls */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Website CMS / Content Editor
            </span>
            {isDirty && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Hero & Editorial Content
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            Edit the copy, headings, metadata, and visuals for the public portfolio. Changes sync directly to the live site.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty || status === 'saving'}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={status === 'saving'}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
            title="Reset content to initial specimen defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{status === 'saving' ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Banners */}
      {status === 'saved' && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <div className="flex-1 font-medium">
            Content updated and saved successfully! Refresh the public portfolio to see the changes.
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline inline-flex items-center gap-1 font-semibold hover:opacity-80"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div className="flex-1 font-medium">
            {errorMessage || 'Failed to save updates to the database.'}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'hero'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'about'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>About & Manifesto</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marquee')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'marquee'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Marquee Strip</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-background/20 rounded-full font-mono">
            {marqueeForm.items.length}
          </span>
        </button>
      </div>

      {/* ================================================== */}
      {/* 1. HERO EDITOR TAB */}
      {/* ================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Hero Section Configuration</h3>
                <p className="text-xs text-muted">Primary viewport copy, call-to-action button, and hero specimen media</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-background border border-border text-muted">
                Section ID: hero
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Eyebrow */}
              <div className="space-y-2">
                <label htmlFor="hero-eyebrow" className="block text-xs font-semibold text-foreground">
                  Eyebrow Badge / Pre-title
                </label>
                <input
                  id="hero-eyebrow"
                  type="text"
                  value={heroForm.eyebrow}
                  onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
                  placeholder="e.g. (About me)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Small indicator at the top left of the hero section.</p>
              </div>

              {/* Sub Eyebrow / Spatial Anchor */}
              <div className="space-y-2">
                <label htmlFor="hero-subeyebrow" className="block text-xs font-semibold text-foreground">
                  Top Header Tagline (Desktop)
                </label>
                <input
                  id="hero-subeyebrow"
                  type="text"
                  value={heroForm.subEyebrow || ''}
                  onChange={(e) => handleHeroChange('subEyebrow', e.target.value)}
                  placeholder="e.g. PORTFOLIO SPECIMEN / AVAILABLE FOR SELECT COMMISSIONS"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Right-side spatial coordinates and availability badge.</p>
              </div>

              {/* Main Heading (Multiline Textarea) */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="hero-title" className="block text-xs font-semibold text-foreground">
                  Main Headline (Line by Line)
                </label>
                <textarea
                  id="hero-title"
                  rows={3}
                  value={heroForm.headlineLines ? heroForm.headlineLines.join('\n') : heroForm.title}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    markDirty();
                    setHeroForm((prev) => ({
                      ...prev,
                      title: lines.join(' '),
                      headlineLines: lines,
                    }));
                  }}
                  placeholder="Line 1&#10;Line 2&#10;Line 3"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono leading-relaxed placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Each line in the textarea will animate as an independent typographic mask reveal.</p>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="hero-description" className="block text-xs font-semibold text-foreground">
                  Supporting Editorial Bio
                </label>
                <textarea
                  id="hero-description"
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => handleHeroChange('description', e.target.value)}
                  placeholder="Digital product designer & creative developer focused on thoughtful interfaces..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground leading-relaxed placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Paragraph displayed alongside the primary CTA button.</p>
              </div>

              {/* CTA Text */}
              <div className="space-y-2">
                <label htmlFor="hero-cta-text" className="block text-xs font-semibold text-foreground">
                  CTA Button Label
                </label>
                <input
                  id="hero-cta-text"
                  type="text"
                  value={heroForm.ctaText}
                  onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                  placeholder="e.g. VIEW SELECTED WORKS"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* CTA Link Target */}
              <div className="space-y-2">
                <label htmlFor="hero-cta-link" className="block text-xs font-semibold text-foreground">
                  CTA Action Target / Anchor
                </label>
                <input
                  id="hero-cta-link"
                  type="text"
                  value={heroForm.ctaLink}
                  onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
                  placeholder="e.g. #works"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Year & Folio Label */}
              <div className="space-y-2">
                <label htmlFor="hero-year" className="block text-xs font-semibold text-foreground">
                  Year Metadata
                </label>
                <input
                  id="hero-year"
                  type="text"
                  value={heroForm.year}
                  onChange={(e) => handleHeroChange('year', e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Scroll Label */}
              <div className="space-y-2">
                <label htmlFor="hero-scroll" className="block text-xs font-semibold text-foreground">
                  Scroll Indicator Text
                </label>
                <input
                  id="hero-scroll"
                  type="text"
                  value={heroForm.scrollLabel}
                  onChange={(e) => handleHeroChange('scrollLabel', e.target.value)}
                  placeholder="e.g. SCROLL"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            {/* Hero Image Selection & Preview */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Hero Specimen Asset & Media</span>
                  </h4>
                  <p className="text-xs text-muted">Primary visual associated with the hero showcase</p>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="hero-image-url" className="block text-xs font-semibold text-foreground">
                  Image URL / Asset CDN Link
                </label>
                <input
                  id="hero-image-url"
                  type="text"
                  value={heroForm.heroImage || ''}
                  onChange={(e) => handleHeroChange('heroImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Preset Image Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted">
                  Or pick from curated architectural presets:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {curatedHeroImages.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => handleHeroChange('heroImage', preset.url)}
                      className={`group rounded-lg border p-1.5 text-left transition-all ${
                        heroForm.heroImage === preset.url
                          ? 'border-foreground ring-2 ring-foreground/20 bg-background'
                          : 'border-border hover:border-foreground/50 bg-background/50'
                      }`}
                    >
                      <div className="aspect-[16/10] rounded-md overflow-hidden bg-surface mb-1.5">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <p className="text-[10px] text-muted truncate group-hover:text-foreground">
                        {preset.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview of Selected Hero Image */}
              {heroForm.heroImage && (
                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Live Image Preview</span>
                    <a
                      href={heroForm.heroImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] underline hover:text-foreground"
                    >
                      <span>Open full asset</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full max-w-md aspect-[16/9] rounded-lg overflow-hidden border border-border bg-surface shadow-inner">
                    <img
                      src={heroForm.heroImage}
                      alt="Hero Live Preview"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. ABOUT & MANIFESTO EDITOR TAB */}
      {/* ================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">About & Creative Manifesto</h3>
                <p className="text-xs text-muted">Section 02 typographic manifesto statements and core principles</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-background border border-border text-muted">
                Section ID: statement
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About Section Label */}
              <div className="space-y-2">
                <label htmlFor="about-label" className="block text-xs font-semibold text-foreground">
                  Section Label / Badge
                </label>
                <input
                  id="about-label"
                  type="text"
                  value={aboutForm.label}
                  onChange={(e) => handleAboutChange('label', e.target.value)}
                  placeholder="e.g. CREATIVE MANIFESTO"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Number */}
              <div className="space-y-2">
                <label htmlFor="about-number" className="block text-xs font-semibold text-foreground">
                  Section Number Index
                </label>
                <input
                  id="about-number"
                  type="text"
                  value={aboutForm.number || '02'}
                  onChange={(e) => handleAboutChange('number', e.target.value)}
                  placeholder="e.g. 02"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Line 1 */}
              <div className="space-y-2">
                <label htmlFor="about-line1" className="block text-xs font-semibold text-foreground">
                  Manifesto Line 1
                </label>
                <input
                  id="about-line1"
                  type="text"
                  value={aboutForm.line1 || 'BE CURIOUS.'}
                  onChange={(e) => handleAboutChange('line1', e.target.value)}
                  placeholder="e.g. BE CURIOUS."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Line 2 */}
              <div className="space-y-2">
                <label htmlFor="about-line2" className="block text-xs font-semibold text-foreground">
                  Manifesto Line 2
                </label>
                <input
                  id="about-line2"
                  type="text"
                  value={aboutForm.line2 || 'BE BOLD.'}
                  onChange={(e) => handleAboutChange('line2', e.target.value)}
                  placeholder="e.g. BE BOLD."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Line 3 */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="about-line3" className="block text-xs font-semibold text-foreground">
                  Manifesto Line 3
                </label>
                <input
                  id="about-line3"
                  type="text"
                  value={aboutForm.line3 || 'BE USEFUL.'}
                  onChange={(e) => handleAboutChange('line3', e.target.value)}
                  placeholder="e.g. BE USEFUL."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Core Principles (Description) */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="about-principles" className="block text-xs font-semibold text-foreground">
                  Core Discipline Principles
                </label>
                <textarea
                  id="about-principles"
                  rows={2}
                  value={aboutForm.corePrinciples || 'FORM AS CONSEQUENCE OF FUNCTION AND RESTRAINT'}
                  onChange={(e) => handleAboutChange('corePrinciples', e.target.value)}
                  placeholder="e.g. FORM AS CONSEQUENCE OF FUNCTION AND RESTRAINT"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Year Meta */}
              <div className="space-y-2">
                <label htmlFor="about-year" className="block text-xs font-semibold text-foreground">
                  Established Year Stamp
                </label>
                <input
                  id="about-year"
                  type="text"
                  value={aboutForm.yearMeta || 'EST. 2026'}
                  onChange={(e) => handleAboutChange('yearMeta', e.target.value)}
                  placeholder="e.g. EST. 2026"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Additional Context */}
              <div className="space-y-2">
                <label htmlFor="about-subtext" className="block text-xs font-semibold text-foreground">
                  Additional Context Descriptor
                </label>
                <input
                  id="about-subtext"
                  type="text"
                  value={aboutForm.subtext || ''}
                  onChange={(e) => handleAboutChange('subtext', e.target.value)}
                  placeholder="e.g. [CORE DISCIPLINE PRINCIPLES]"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. MARQUEE EDITOR TAB */}
      {/* ================================================== */}
      {activeTab === 'marquee' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Marquee Infinite Strip</h3>
                <p className="text-xs text-muted">Manage items, ordering, animation speed, and glyph separators</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-background border border-border text-muted">
                Section ID: marquee
              </span>
            </div>

            {/* Add New Phrase Input */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMarqueeItem}
                onChange={(e) => setNewMarqueeItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMarqueeItem();
                  }
                }}
                placeholder="Type new phrase (e.g. SPATIAL PROTOTYPER)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground uppercase placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
              />
              <button
                type="button"
                onClick={handleAddMarqueeItem}
                disabled={!newMarqueeItem.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Add Phrase</span>
              </button>
            </div>

            {/* Editable & Reorderable List */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-muted">
                Active Marquee Items ({marqueeForm.items.length})
              </label>

              {marqueeForm.items.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-border text-xs text-muted">
                  No marquee items configured. Add phrases above.
                </div>
              ) : (
                <div className="space-y-2">
                  {marqueeForm.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-foreground/30 transition-colors"
                    >
                      <span className="w-6 text-center font-mono text-xs text-muted shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Editable Text Input */}
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleEditMarqueeItem(index, e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-border/60 bg-surface text-xs font-semibold uppercase tracking-wider text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
                      />

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveMarqueeItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-md border border-border text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveMarqueeItem(index, 'down')}
                          disabled={index === marqueeForm.items.length - 1}
                          className="p-1.5 rounded-md border border-border text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMarqueeItem(index)}
                          className="p-1.5 rounded-md border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marquee Configuration Controls */}
            <div className="border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="marquee-speed" className="block text-xs font-semibold text-foreground">
                  Scroll Duration / Speed ({marqueeForm.speed}s)
                </label>
                <input
                  id="marquee-speed"
                  type="range"
                  min={10}
                  max={60}
                  step={2}
                  value={marqueeForm.speed}
                  onChange={(e) => {
                    markDirty();
                    setMarqueeForm((prev) => ({ ...prev, speed: Number(e.target.value) }));
                  }}
                  className="w-full accent-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="marquee-separator" className="block text-xs font-semibold text-foreground">
                  Separator Glyph
                </label>
                <input
                  id="marquee-separator"
                  type="text"
                  value={marqueeForm.separator}
                  onChange={(e) => {
                    markDirty();
                    setMarqueeForm((prev) => ({ ...prev, separator: e.target.value }));
                  }}
                  placeholder="e.g. ✦"
                  className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-xs text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="marquee-velocity" className="block text-xs font-semibold text-foreground">
                  Scroll Velocity Dynamic Multiplier
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="marquee-velocity"
                    type="checkbox"
                    checked={marqueeForm.enableVelocity ?? true}
                    onChange={(e) => {
                      markDirty();
                      setMarqueeForm((prev) => ({ ...prev, enableVelocity: e.target.checked }));
                    }}
                    className="w-4 h-4 rounded border-border text-foreground accent-foreground"
                  />
                  <span className="text-xs text-muted">Accelerate with scroll speed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;


