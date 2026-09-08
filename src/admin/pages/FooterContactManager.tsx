import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Globe,
  Mail,
  Share2,
  ShieldAlert,
  Layers,
  Eye,
  EyeOff,
  Sparkles,
  Link as LinkIcon,
  MapPin,
  Clock,
  Copyright,
  Compass,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { FooterContent, ContactCTA, SocialLink } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';

const PLATFORM_OPTIONS: Array<SocialLink['platform']> = [
  'LinkedIn',
  'Instagram',
  'Behance',
  'Dribbble',
  'X',
  'GitHub',
  'Other',
];

export const FooterContactManager: React.FC = () => {
  const { data, updateFooter, updateContactCTA } = useWebsiteData();

  // Local form states
  const [footerForm, setFooterForm] = useState<FooterContent>(data.footer);
  const [contactForm, setContactForm] = useState<ContactCTA>(data.contact);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(data.footer.socialLinks || []);

  // UI state
  const [activeTab, setActiveTab] = useState<'footer' | 'contact' | 'social'>('footer');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // New social link input buffer
  const [newPlatform, setNewPlatform] = useState<SocialLink['platform']>('LinkedIn');
  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');

  // Sync initial state when remote data loads
  useEffect(() => {
    setFooterForm(data.footer);
    setContactForm(data.contact);
    setSocialLinks(data.footer.socialLinks || []);
    setIsDirty(false);
  }, [data]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  // URL & Email Validation helpers
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const isSafeUrl = (url: string) => {
    if (!url) return false;
    const lower = url.trim().toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
      return false;
    }
    return true;
  };

  const isValidHttpOrMailtoUrl = (url: string) => {
    if (!isSafeUrl(url)) return false;
    const trimmed = url.trim();
    return (
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('#')
    );
  };

  // Handlers for footer fields
  const handleFooterChange = (field: keyof FooterContent, value: any) => {
    markDirty();
    setFooterForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for contact fields
  const handleContactChange = (field: keyof ContactCTA, value: any) => {
    markDirty();
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'ctaText' || field === 'buttonText' ? { ctaText: value, buttonText: value } : {}),
      ...(field === 'ctaLink' || field === 'buttonLink' ? { ctaLink: value, buttonLink: value } : {}),
      ...(field === 'secondaryLine' || field === 'secondaryText'
        ? { secondaryLine: value, secondaryText: value }
        : {}),
    }));
  };

  // Handlers for Social Links
  const handleAddSocialLink = () => {
    if (!newLabel.trim() || !newHref.trim()) return;

    if (!isSafeUrl(newHref)) {
      setErrorMessage('Unsafe URL detected! Javascript and data URLs are strictly prohibited.');
      setStatus('error');
      return;
    }

    markDirty();
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: newPlatform,
      label: newLabel.trim().toUpperCase(),
      href: newHref.trim(),
      url: newHref.trim(),
      visible: true,
      order: socialLinks.length + 1,
    };

    const updated = [...socialLinks, newLink];
    setSocialLinks(updated);
    setFooterForm((prev) => ({ ...prev, socialLinks: updated }));
    setNewLabel('');
    setNewHref('');
    setNewPlatform('LinkedIn');
  };

  const handleUpdateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
    markDirty();
    const updated = [...socialLinks];
    updated[index] = {
      ...updated[index],
      [field]: value,
      ...(field === 'href' ? { url: value } : {}),
    };
    setSocialLinks(updated);
    setFooterForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleDeleteSocialLink = (index: number) => {
    markDirty();
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
    setFooterForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleMoveSocialLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    markDirty();
    const updated = [...socialLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign orders
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSocialLinks(reordered);
    setFooterForm((prev) => ({ ...prev, socialLinks: reordered }));
  };

  const handleToggleSocialVisibility = (index: number) => {
    markDirty();
    const updated = [...socialLinks];
    updated[index] = {
      ...updated[index],
      visible: updated[index].visible === false ? true : false,
    };
    setSocialLinks(updated);
    setFooterForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  // Save all changes
  const handleSaveAll = async () => {
    setStatus('saving');
    setErrorMessage(null);

    // Validation checks
    if (contactForm.email && !isValidEmail(contactForm.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid Primary Contact Email address (e.g. contact@domain.com).');
      return;
    }

    if (footerForm.email && !isValidEmail(footerForm.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid Footer Email address.');
      return;
    }

    if (contactForm.ctaLink && !isSafeUrl(contactForm.ctaLink)) {
      setStatus('error');
      setErrorMessage('Unsafe CTA Link URL detected.');
      return;
    }

    for (const link of socialLinks) {
      if (link.href && !isValidHttpOrMailtoUrl(link.href)) {
        setStatus('error');
        setErrorMessage(`Invalid or unsafe URL found for social link "${link.label}". Must start with https://, http://, or mailto:`);
        return;
      }
    }

    try {
      const footerPayload: FooterContent = {
        ...footerForm,
        socialLinks,
      };

      const [footerSuccess, contactSuccess] = await Promise.all([
        updateFooter(footerPayload),
        updateContactCTA(contactForm),
      ]);

      if (footerSuccess && contactSuccess) {
        setStatus('saved');
        setIsDirty(false);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save to database. Changes remain cached in memory.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Unexpected error occurred while saving.');
    }
  };

  // Reset to initial values
  const handleReset = () => {
    setFooterForm(data.footer);
    setContactForm(data.contact);
    setSocialLinks(data.footer.socialLinks || []);
    setIsDirty(false);
    setStatus('idle');
    setErrorMessage(null);
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    if (window.confirm('Reset Footer, Social Links and Contact settings to factory default content?')) {
      setFooterForm(defaultWebsiteData.footer);
      setContactForm(defaultWebsiteData.contact);
      setSocialLinks(defaultWebsiteData.footer.socialLinks || []);
      markDirty();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin Content Editor</span>
            <span className="text-xs text-muted">/</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono">
              FOOTER, SOCIAL & CONTACT
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-foreground" />
            <span>Footer & Outreach Architecture</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage public footer editorial columns, social links directory, and client collaboration contact triggers.
          </p>
        </div>

        {/* Global Save / Reset Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            title="Restore Factory Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Defaults</span>
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={status === 'saving' || !isDirty}
            className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
              isDirty
                ? 'bg-foreground text-background hover:opacity-90 cursor-pointer'
                : 'bg-surface border border-border text-muted opacity-60 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{status === 'saving' ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {status === 'saved' && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Changes saved successfully!</p>
            <p className="opacity-80">Footer, Social Links and Contact CTA are live on the portfolio website.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Validation / Storage Error</p>
            <p className="opacity-90">{errorMessage || 'Could not save changes. Check inputs.'}</p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'footer'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Footer Columns</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'social'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Links ({socialLinks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-muted hover:text-foreground hover:bg-surface'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact CTA</span>
        </button>
      </div>

      {/* ================================================== */}
      {/* 1. FOOTER TAB */}
      {/* ================================================== */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Primary Footer Editorial Fields</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Configure physical studio location, global availability tagline, copyright notice, and hero brand signature.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="footer-location" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted" />
                  <span>Studio Location</span>
                </label>
                <input
                  id="footer-location"
                  type="text"
                  value={footerForm.location || ''}
                  onChange={(e) => handleFooterChange('location', e.target.value.toUpperCase())}
                  placeholder="e.g. INDIA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Rendered in column [01 // LOCATION] of the public footer.</p>
              </div>

              {/* Working Globally */}
              <div className="space-y-2">
                <label htmlFor="footer-working-globally" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted" />
                  <span>Working Globally Tagline</span>
                </label>
                <input
                  id="footer-working-globally"
                  type="text"
                  value={footerForm.workingGlobally || ''}
                  onChange={(e) => handleFooterChange('workingGlobally', e.target.value.toUpperCase())}
                  placeholder="e.g. WORKING GLOBALLY"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Availability scope indicator shown under studio location.</p>
              </div>

              {/* Brand Text */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="footer-brand-text" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-muted" />
                  <span>Brand Text / Massive Bottom Signature</span>
                </label>
                <input
                  id="footer-brand-text"
                  type="text"
                  value={footerForm.brandText || ''}
                  onChange={(e) => handleFooterChange('brandText', e.target.value.toUpperCase())}
                  placeholder="e.g. DARSHIL BHUVA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold tracking-wider text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Massive typographic text revealed in the footer climax.</p>
              </div>

              {/* Copyright */}
              <div className="space-y-2">
                <label htmlFor="footer-copyright" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Copyright className="w-3.5 h-3.5 text-muted" />
                  <span>Copyright Notice</span>
                </label>
                <input
                  id="footer-copyright"
                  type="text"
                  value={footerForm.copyright || ''}
                  onChange={(e) => handleFooterChange('copyright', e.target.value)}
                  placeholder="e.g. © 2026 ALL RIGHTS RESERVED"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Response Window */}
              <div className="space-y-2">
                <label htmlFor="footer-response" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  <span>Inquiry Response Window</span>
                </label>
                <input
                  id="footer-response"
                  type="text"
                  value={footerForm.responseWindow || ''}
                  onChange={(e) => handleFooterChange('responseWindow', e.target.value)}
                  placeholder="e.g. Response within 24–48 hours"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Coordinates */}
              <div className="space-y-2">
                <label htmlFor="footer-coordinates" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-muted" />
                  <span>Timezone & Geographic Coordinates</span>
                </label>
                <input
                  id="footer-coordinates"
                  type="text"
                  value={footerForm.coordinates || ''}
                  onChange={(e) => handleFooterChange('coordinates', e.target.value)}
                  placeholder="e.g. UTC +05:30 · 21.1702° N, 72.8311° E"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Sub-Copyright / Subtext */}
              <div className="space-y-2">
                <label htmlFor="footer-subcopyright" className="block text-xs font-semibold text-foreground">
                  Sub-Copyright / Discipline Descriptor
                </label>
                <input
                  id="footer-subcopyright"
                  type="text"
                  value={footerForm.subCopyright || ''}
                  onChange={(e) => handleFooterChange('subCopyright', e.target.value.toUpperCase())}
                  placeholder="e.g. CREATIVE DIRECTION & INTERFACE ARCHITECTURE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </div>

          {/* Live Preview of Footer Columns */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              Live Preview: 4-Column Layout
            </h4>
            <div className="p-6 rounded-xl bg-background border border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-muted block">[01 // LOCATION]</span>
                <p className="font-bold text-foreground">{footerForm.location || 'INDIA'}</p>
                <p className="text-muted">{footerForm.workingGlobally || 'WORKING GLOBALLY'}</p>
                <p className="text-[10px] text-muted/60 pt-1">{footerForm.coordinates}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted block">[02 // SOCIAL]</span>
                <p className="text-foreground">{socialLinks.filter((s) => s.visible !== false).length} Active Channels</p>
                <p className="text-muted text-[11px] truncate">
                  {socialLinks.map((s) => s.label).slice(0, 3).join(', ')}...
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted block">[03 // CONTACT]</span>
                <p className="font-bold text-foreground truncate">{footerForm.email || 'hello@example.com'}</p>
                <p className="text-muted text-[11px]">{footerForm.responseWindow}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted block">[04 // SIGNATURE]</span>
                <p className="font-bold text-foreground truncate">{footerForm.brandText}</p>
                <p className="text-muted text-[11px]">{footerForm.copyright}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. SOCIAL LINKS TAB */}
      {/* ================================================== */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {/* Add New Social Link Form */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add New Social Channel</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Add profile links for LinkedIn, Instagram, Behance, Dribbble, X, GitHub, or custom platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => {
                    const plat = e.target.value as SocialLink['platform'];
                    setNewPlatform(plat);
                    if (!newLabel) {
                      setNewLabel(plat.toUpperCase());
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-foreground"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">Display Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. LINKEDIN"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground uppercase placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">URL / Profile Link</label>
                <input
                  type="text"
                  value={newHref}
                  onChange={(e) => setNewHref(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  disabled={!newLabel.trim() || !newHref.trim()}
                  className="w-full py-2 px-4 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Social Links List */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>Configured Social Directory ({socialLinks.length})</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Reorder, rename, or toggle visibility of public channels.
                </p>
              </div>
            </div>

            {socialLinks.length === 0 ? (
              <div className="py-12 text-center text-muted space-y-2">
                <Share2 className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs font-semibold text-foreground">No social links configured</p>
                <p className="text-[11px]">Use the form above to add your first profile link.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {socialLinks.map((item, index) => {
                  const isVisible = item.visible !== false;
                  return (
                    <div
                      key={item.id || `${item.platform}-${index}`}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                        isVisible
                          ? 'border-border bg-background'
                          : 'border-border/40 bg-background/40 opacity-60'
                      }`}
                    >
                      {/* Reorder Buttons & Platform Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveSocialLink(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded-sm text-muted hover:text-foreground hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSocialLink(index, 'down')}
                            disabled={index === socialLinks.length - 1}
                            className="p-1 rounded-sm text-muted hover:text-foreground hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="px-2 py-1 rounded-lg bg-surface border border-border text-[10px] font-mono font-semibold uppercase text-foreground">
                          {item.platform || 'Link'}
                        </span>
                      </div>

                      {/* Label Input */}
                      <div className="flex-1 min-w-[140px]">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateSocialLink(index, 'label', e.target.value.toUpperCase())}
                          placeholder="Label"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold uppercase text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
                        />
                      </div>

                      {/* URL Input */}
                      <div className="flex-2 min-w-[200px]">
                        <input
                          type="text"
                          value={item.href || item.url || ''}
                          onChange={(e) => handleUpdateSocialLink(index, 'href', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        {item.href && isSafeUrl(item.href) && (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                            title="Test Link in New Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleSocialVisibility(index)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isVisible
                              ? 'text-foreground hover:bg-surface'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                          title={isVisible ? 'Hide Link from Public Footer' : 'Show Link in Public Footer'}
                        >
                          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSocialLink(index)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Social Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. CONTACT CTA TAB */}
      {/* ================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Contact & Collaboration Triggers</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Manage contact email targets, CTA headline copy, and inquiry button triggers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Email */}
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted" />
                  <span>Primary Contact Email</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactForm.email || ''}
                  onChange={(e) => {
                    handleContactChange('email', e.target.value);
                    handleFooterChange('email', e.target.value);
                  }}
                  placeholder="contact@darshilbhuva.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Primary outreach address used in both Contact section and Footer col [03].</p>
              </div>

              {/* Button Action Link */}
              <div className="space-y-2">
                <label htmlFor="contact-cta-link" className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-muted" />
                  <span>Contact Button Action URL / Mailto</span>
                </label>
                <input
                  id="contact-cta-link"
                  type="text"
                  value={contactForm.ctaLink || contactForm.buttonLink || ''}
                  onChange={(e) => handleContactChange('ctaLink', e.target.value)}
                  placeholder="mailto:contact@darshilbhuva.com?subject=Project%20Inquiry"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
                <p className="text-[11px] text-muted">Triggered when user clicks the magnetic START A PROJECT button.</p>
              </div>

              {/* Button Text */}
              <div className="space-y-2">
                <label htmlFor="contact-cta-text" className="block text-xs font-semibold text-foreground">
                  Contact Button Text
                </label>
                <input
                  id="contact-cta-text"
                  type="text"
                  value={contactForm.ctaText || contactForm.buttonText || ''}
                  onChange={(e) => handleContactChange('ctaText', e.target.value.toUpperCase())}
                  placeholder="START A PROJECT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold uppercase text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Availability Status */}
              <div className="space-y-2">
                <label htmlFor="contact-availability" className="block text-xs font-semibold text-foreground">
                  Availability Status Tagline
                </label>
                <input
                  id="contact-availability"
                  type="text"
                  value={contactForm.availabilityStatus || ''}
                  onChange={(e) => handleContactChange('availabilityStatus', e.target.value.toUpperCase())}
                  placeholder="AVAILABLE FOR COMMISSIONS WORLDWIDE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs uppercase font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Headline Line 1 */}
              <div className="space-y-2">
                <label htmlFor="contact-headline-1" className="block text-xs font-semibold text-foreground">
                  Headline Line 1
                </label>
                <input
                  id="contact-headline-1"
                  type="text"
                  value={contactForm.headlineLine1 || ''}
                  onChange={(e) => handleContactChange('headlineLine1', e.target.value.toUpperCase())}
                  placeholder="HAVE SOMETHING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold uppercase text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Headline Line 2 */}
              <div className="space-y-2">
                <label htmlFor="contact-headline-2" className="block text-xs font-semibold text-foreground">
                  Headline Line 2 (Muted Accent)
                </label>
                <input
                  id="contact-headline-2"
                  type="text"
                  value={contactForm.headlineLine2 || ''}
                  onChange={(e) => handleContactChange('headlineLine2', e.target.value.toUpperCase())}
                  placeholder="WORTH BUILDING?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-bold uppercase text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Secondary Subtext */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="contact-secondary" className="block text-xs font-semibold text-foreground">
                  Secondary Supporting Line
                </label>
                <input
                  id="contact-secondary"
                  type="text"
                  value={contactForm.secondaryLine || contactForm.secondaryText || ''}
                  onChange={(e) => handleContactChange('secondaryLine', e.target.value)}
                  placeholder="Let's make it real."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterContactManager;
