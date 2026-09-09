import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Undo2,
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
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Badge } from '../../design-system/components/Badge';
import { Alert } from '../../design-system/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../design-system/components/Card';
import { useToast } from '../../design-system/hooks/useToast';

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
  const toast = useToast();

  // Local form states
  const [footerForm, setFooterForm] = useState<FooterContent>(data.footer);
  const [contactForm, setContactForm] = useState<ContactCTA>(data.contact);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(data.footer.socialLinks || []);

  // UI state
  const [activeTab, setActiveTab] = useState<'footer' | 'contact' | 'social'>('footer');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Prevent accidental loss of unsaved changes
  useUnsavedChanges(isDirty);

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

    const urlCheck = validators.url(newHref, false, 'Social Link URL');
    if (!urlCheck.isValid) {
      setErrorMessage(urlCheck.error || 'Unsafe URL detected! Javascript and data URLs are strictly prohibited.');
      setStatus('error');
      toast.error(urlCheck.error || 'Unsafe URL detected!');
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
    toast.success(`Added ${newLink.label} channel`);
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
    toast.info('Social link removed');
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

  // Save all changes with complete validation & double-submission prevention
  const handleSaveAll = async () => {
    if (status === 'saving') return;

    // Validation checks
    if (contactForm.email) {
      const emailCheck = validators.email(contactForm.email, true, 'Primary Contact Email');
      if (!emailCheck.isValid) {
        setStatus('error');
        setErrorMessage(emailCheck.error || 'Please enter a valid Primary Contact Email address.');
        toast.error(emailCheck.error || 'Please enter a valid Primary Contact Email address.');
        return;
      }
    }

    if (footerForm.email) {
      const emailCheck = validators.email(footerForm.email, true, 'Footer Email');
      if (!emailCheck.isValid) {
        setStatus('error');
        setErrorMessage(emailCheck.error || 'Please enter a valid Footer Email address.');
        toast.error(emailCheck.error || 'Please enter a valid Footer Email address.');
        return;
      }
    }

    if (contactForm.ctaLink) {
      const linkCheck = validators.url(contactForm.ctaLink, true, 'Contact CTA Link');
      if (!linkCheck.isValid) {
        setStatus('error');
        setErrorMessage(linkCheck.error || 'Unsafe CTA Link URL detected.');
        toast.error(linkCheck.error || 'Unsafe CTA Link URL detected.');
        return;
      }
    }

    for (const link of socialLinks) {
      if (link.href) {
        const linkCheck = validators.url(link.href, false, `Social Link "${link.label}"`);
        if (!linkCheck.isValid) {
          setStatus('error');
          setErrorMessage(linkCheck.error || `Invalid or unsafe URL found for social link "${link.label}".`);
          toast.error(`Invalid URL for "${link.label}".`);
          return;
        }
      }
    }

    try {
      setStatus('saving');
      setErrorMessage(null);

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
        toast.success('Changes saved successfully!');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save to database. Changes remain cached in memory.');
        toast.error('Failed to save to database.');
      }
    } catch (err: any) {
      setStatus('error');
      const formatted = validators.formatFriendlyError(err);
      setErrorMessage(formatted);
      toast.error(formatted);
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
    toast.info('Changes reverted');
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    if (window.confirm('Reset Footer, Social Links and Contact settings to factory default content?')) {
      setFooterForm(defaultWebsiteData.footer);
      setContactForm(defaultWebsiteData.contact);
      setSocialLinks(defaultWebsiteData.footer.socialLinks || []);
      markDirty();
      toast.info('Restored factory defaults');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Breadcrumb & Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin Content Editor</span>
              <span className="text-xs text-muted">/</span>
              <Badge variant="neutral" size="sm" className="font-mono uppercase">
                FOOTER, SOCIAL & CONTACT
              </Badge>
              {isDirty && (
                <Badge variant="warning" size="sm" className="animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRestoreDefaults}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              <span className="hidden md:inline">Defaults</span>
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<Undo2 className="w-3.5 h-3.5" />}
              >
                Cancel
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveAll}
              disabled={!isDirty || status === 'saving'}
              isLoading={status === 'saving'}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Notifications */}
      {status === 'saved' && (
        <Alert
          variant="success"
          title="Changes saved successfully!"
          onClose={() => setStatus('idle')}
        >
          Footer, Social Links and Contact CTA are live on the portfolio website.
        </Alert>
      )}

      {status === 'error' && (
        <Alert
          variant="error"
          title="Validation / Storage Error"
          onClose={() => setStatus('idle')}
        >
          {errorMessage || 'Could not save changes. Check inputs.'}
        </Alert>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <Button
          type="button"
          variant={activeTab === 'footer' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('footer')}
          leftIcon={<Layers className="w-4 h-4" />}
        >
          Footer Columns
        </Button>

        <Button
          type="button"
          variant={activeTab === 'social' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('social')}
          leftIcon={<Share2 className="w-4 h-4" />}
        >
          Social Links ({socialLinks.length})
        </Button>

        <Button
          type="button"
          variant={activeTab === 'contact' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('contact')}
          leftIcon={<Mail className="w-4 h-4" />}
        >
          Contact CTA
        </Button>
      </div>

      {/* ================================================== */}
      {/* 1. FOOTER TAB */}
      {/* ================================================== */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Primary Footer Editorial Fields</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure physical studio location, global availability tagline, copyright notice, and hero brand signature.
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <Input
                  label="Studio Location"
                  value={footerForm.location || ''}
                  onChange={(e) => handleFooterChange('location', e.target.value.toUpperCase())}
                  placeholder="e.g. INDIA"
                  className="font-mono text-xs"
                  helperText="Rendered in column [01 // LOCATION] of the public footer."
                />
              </div>

              {/* Working Globally */}
              <div>
                <Input
                  label="Working Globally Tagline"
                  value={footerForm.workingGlobally || ''}
                  onChange={(e) => handleFooterChange('workingGlobally', e.target.value.toUpperCase())}
                  placeholder="e.g. WORKING GLOBALLY"
                  className="font-mono text-xs"
                  helperText="Availability scope indicator shown under studio location."
                />
              </div>

              {/* Brand Text */}
              <div className="md:col-span-2">
                <Input
                  label="Brand Text / Massive Bottom Signature"
                  value={footerForm.brandText || ''}
                  onChange={(e) => handleFooterChange('brandText', e.target.value.toUpperCase())}
                  placeholder="e.g. DARSHIL S. BHUVA"
                  className="font-bold tracking-wider text-xs"
                  helperText="Massive typographic text revealed in the footer climax."
                />
              </div>

              {/* Copyright */}
              <div>
                <Input
                  label="Copyright Notice"
                  value={footerForm.copyright || ''}
                  onChange={(e) => handleFooterChange('copyright', e.target.value)}
                  placeholder="e.g. © 2026 ALL RIGHTS RESERVED"
                  className="font-mono text-xs"
                />
              </div>

              {/* Response Window */}
              <div>
                <Input
                  label="Inquiry Response Window"
                  value={footerForm.responseWindow || ''}
                  onChange={(e) => handleFooterChange('responseWindow', e.target.value)}
                  placeholder="e.g. Response within 24–48 hours"
                />
              </div>

              {/* Coordinates */}
              <div>
                <Input
                  label="Timezone & Geographic Coordinates"
                  value={footerForm.coordinates || ''}
                  onChange={(e) => handleFooterChange('coordinates', e.target.value)}
                  placeholder="e.g. UTC +05:30 · 21.1702° N, 72.8311° E"
                  className="font-mono text-xs"
                />
              </div>

              {/* Sub-Copyright / Subtext */}
              <div>
                <Input
                  label="Sub-Copyright / Discipline Descriptor"
                  value={footerForm.subCopyright || ''}
                  onChange={(e) => handleFooterChange('subCopyright', e.target.value.toUpperCase())}
                  placeholder="e.g. CREATIVE DIRECTION & INTERFACE ARCHITECTURE"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </Card>

          {/* Live Preview of Footer Columns */}
          <Card className="p-6 space-y-4">
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
                <p className="font-bold text-foreground truncate">{footerForm.email || 'darshilbhuva4322@gmail.com'}</p>
                <p className="text-muted text-[11px]">{footerForm.responseWindow}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted block">[04 // SIGNATURE]</span>
                <p className="font-bold text-foreground truncate">{footerForm.brandText}</p>
                <p className="text-muted text-[11px]">{footerForm.copyright}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. SOCIAL LINKS TAB */}
      {/* ================================================== */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {/* Add New Social Link Form */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Plus className="w-4 h-4" />
                <span>Add New Social Channel</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Add profile links for LinkedIn, Instagram, Behance, Dribbble, X, GitHub, or custom platforms.
              </CardDescription>
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
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-default"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Display Label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. LINKEDIN"
                  className="uppercase"
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  label="URL / Profile Link"
                  value={newHref}
                  onChange={(e) => setNewHref(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleAddSocialLink}
                  disabled={!newLabel.trim() || !newHref.trim()}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Add Link
                </Button>
              </div>
            </div>
          </Card>

          {/* Social Links List */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Share2 className="w-4 h-4" />
                  <span>Configured Social Directory ({socialLinks.length})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Reorder, rename, or toggle visibility of public channels.
                </CardDescription>
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
                            aria-label="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSocialLink(index, 'down')}
                            disabled={index === socialLinks.length - 1}
                            className="p-1 rounded-sm text-muted hover:text-foreground hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move Down"
                            aria-label="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <Badge variant="neutral" size="sm" className="font-mono uppercase">
                          {item.platform || 'Link'}
                        </Badge>
                      </div>

                      {/* Label Input */}
                      <div className="w-full sm:flex-1 min-w-0">
                        <Input
                          value={item.label}
                          onChange={(e) => handleUpdateSocialLink(index, 'label', e.target.value.toUpperCase())}
                          placeholder="Label"
                          className="uppercase font-semibold text-xs"
                        />
                      </div>

                      {/* URL Input */}
                      <div className="w-full sm:flex-2 min-w-0">
                        <Input
                          value={item.href || item.url || ''}
                          onChange={(e) => handleUpdateSocialLink(index, 'href', e.target.value)}
                          placeholder="https://..."
                          className="font-mono text-xs"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        {item.href && validators.url(item.href).isValid && (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                            title="Test Link in New Tab"
                            aria-label="Test Link in New Tab"
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
                          aria-label={isVisible ? 'Hide Link from Public Footer' : 'Show Link in Public Footer'}
                        >
                          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSocialLink(index)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Social Link"
                          aria-label="Delete Social Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. CONTACT CTA TAB */}
      {/* ================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Contact & Collaboration Triggers</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Manage contact email targets, CTA headline copy, and inquiry button triggers.
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Email */}
              <div>
                <Input
                  label="Primary Contact Email"
                  type="email"
                  value={contactForm.email || ''}
                  onChange={(e) => {
                    handleContactChange('email', e.target.value);
                    handleFooterChange('email', e.target.value);
                  }}
                  placeholder="darshilbhuva4322@gmail.com"
                  className="font-mono text-xs"
                  helperText="Primary outreach address used in both Contact section and Footer col [03]."
                />
              </div>

              {/* Button Action Link */}
              <div>
                <Input
                  label="Contact Button Action URL / Mailto"
                  value={contactForm.ctaLink || contactForm.buttonLink || ''}
                  onChange={(e) => handleContactChange('ctaLink', e.target.value)}
                  placeholder="mailto:darshilbhuva4322@gmail.com?subject=Project%20Inquiry"
                  className="font-mono text-xs"
                  helperText="Triggered when user clicks the magnetic START A PROJECT button."
                />
              </div>

              {/* Button Text */}
              <div>
                <Input
                  label="Contact Button Text"
                  value={contactForm.ctaText || contactForm.buttonText || ''}
                  onChange={(e) => handleContactChange('ctaText', e.target.value.toUpperCase())}
                  placeholder="START A PROJECT"
                  className="uppercase font-bold text-xs"
                />
              </div>

              {/* Availability Status */}
              <div>
                <Input
                  label="Availability Status Tagline"
                  value={contactForm.availabilityStatus || ''}
                  onChange={(e) => handleContactChange('availabilityStatus', e.target.value.toUpperCase())}
                  placeholder="AVAILABLE FOR COMMISSIONS WORLDWIDE"
                  className="uppercase font-mono text-xs"
                />
              </div>

              {/* Headline Line 1 */}
              <div>
                <Input
                  label="Headline Line 1"
                  value={contactForm.headlineLine1 || ''}
                  onChange={(e) => handleContactChange('headlineLine1', e.target.value.toUpperCase())}
                  placeholder="HAVE SOMETHING"
                  className="uppercase font-bold text-xs"
                />
              </div>

              {/* Headline Line 2 */}
              <div>
                <Input
                  label="Headline Line 2 (Muted Accent)"
                  value={contactForm.headlineLine2 || ''}
                  onChange={(e) => handleContactChange('headlineLine2', e.target.value.toUpperCase())}
                  placeholder="WORTH BUILDING?"
                  className="uppercase font-bold text-xs"
                />
              </div>

              {/* Secondary Subtext */}
              <div className="md:col-span-2">
                <Input
                  label="Secondary Supporting Line"
                  value={contactForm.secondaryLine || contactForm.secondaryText || ''}
                  onChange={(e) => handleContactChange('secondaryLine', e.target.value)}
                  placeholder="Let's make it real."
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FooterContactManager;
