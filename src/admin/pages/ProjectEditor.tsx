import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Undo2,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Star,
  Globe,
  Eye,
  FileCode,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { Project } from '../../types';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { Button } from '../../design-system/components/Button';
import { Input, Textarea } from '../../design-system/components/Input';
import { Badge } from '../../design-system/components/Badge';
import { Alert } from '../../design-system/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../design-system/components/Card';
import { useToast } from '../../design-system/hooks/useToast';

interface ProjectEditorProps {
  mode: 'create' | 'edit';
}

const initialProjectState: Omit<Project, 'id'> = {
  title: '',
  shortTitle: '',
  slug: '',
  year: new Date().getFullYear().toString(),
  category: 'Product Design',
  client: '',
  role: 'Lead Product Designer & Creative Technologist',
  description: '',
  services: ['UI Architecture', 'Design Systems'],
  featured: false,
  published: true,
  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  ],
  order: 1,
  number: '01',
};

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, createProject, updateProject } = useWebsiteData();
  const toast = useToast();

  const managedCategories = (data.categories && data.categories.length > 0 ? data.categories : defaultWebsiteData.categories || [])
    .filter((c) => c.visible !== false)
    .map((c) => c.name);

  const managedServices = (data.services && data.services.length > 0 ? data.services.map((s) => s.title) : [])
    .concat(managedCategories)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  const [form, setForm] = useState<Omit<Project, 'id'> & { id?: string }>(initialProjectState);
  const [newServiceTag, setNewServiceTag] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Media picker modal state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'thumbnail' | 'coverImage' | 'gallery' | null>(null);

  // Status & validation
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Prevent accidental loss of unsaved changes when navigating away
  useUnsavedChanges(isDirty);

  // Load existing project if in edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      const existing = data.projects.find((p) => p.id === id);
      if (existing) {
        setForm({
          ...existing,
          services: existing.services || [],
          gallery: existing.gallery || (existing.coverImage ? [existing.coverImage] : []),
        });
      }
    }
  }, [mode, id, data.projects]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  // Title change with automatic slug & shortTitle generation for new projects
  const handleTitleChange = (val: string) => {
    markDirty();
    setForm((prev) => {
      const generatedSlug = validators.sanitizeSlug(val);

      return {
        ...prev,
        title: val,
        shortTitle: mode === 'create' && !prev.shortTitle ? val.split(' ')[0] : prev.shortTitle,
        slug: mode === 'create' && (!prev.slug || prev.slug === validators.sanitizeSlug(prev.title))
          ? generatedSlug
          : prev.slug,
      };
    });
  };

  // Field change helper
  const handleFieldChange = (field: keyof Project, value: any) => {
    markDirty();
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'coverImage' ? { image: value } : {}),
    }));
  };

  // Service Tag handlers
  const handleAddService = (serviceToAdd?: string) => {
    const service = (serviceToAdd || newServiceTag).trim();
    if (!service) return;
    if (form.services?.includes(service)) return;
    markDirty();
    setForm((prev) => ({
      ...prev,
      services: [...(prev.services || []), service],
    }));
    setNewServiceTag('');
  };

  const handleRemoveService = (serviceToRemove: string) => {
    markDirty();
    setForm((prev) => ({
      ...prev,
      services: (prev.services || []).filter((s) => s !== serviceToRemove),
    }));
  };

  // Gallery handlers
  const handleAddGalleryImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;

    // Safety validation
    const urlValidation = validators.url(trimmed, false, 'Gallery Image URL');
    if (!urlValidation.isValid) {
      setStatus('error');
      setErrorMessage(urlValidation.error || 'Invalid gallery image URL');
      toast.error('Invalid gallery image URL');
      return;
    }

    markDirty();
    setForm((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), trimmed],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    markDirty();
    setForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (!form.gallery || targetIndex < 0 || targetIndex >= form.gallery.length) return;
    markDirty();
    setForm((prev) => {
      const updated = [...(prev.gallery || [])];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, gallery: updated };
    });
  };

  // Media picker selection handler
  const handleMediaSelected = (url: string) => {
    markDirty();
    if (mediaPickerTarget === 'thumbnail') {
      handleFieldChange('thumbnail', url);
    } else if (mediaPickerTarget === 'coverImage') {
      handleFieldChange('coverImage', url);
      handleFieldChange('image', url);
    } else if (mediaPickerTarget === 'gallery') {
      handleAddGalleryImage(url);
    }
    setMediaPickerTarget(null);
  };

  // Save handler with comprehensive validation & double-submission guard
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Prevent double submission
    if (status === 'saving') return;

    // 1. Required title validation
    const titleCheck = validators.required(form.title, 'Project Title');
    if (!titleCheck.isValid) {
      setStatus('error');
      setErrorMessage(titleCheck.error || 'Project title is required.');
      toast.error(titleCheck.error || 'Project title is required.');
      return;
    }

    // 2. Slug validation
    const slugCheck = validators.slug(form.slug, 'URL Slug');
    if (!slugCheck.isValid) {
      setStatus('error');
      setErrorMessage(slugCheck.error || 'A valid URL slug is required.');
      toast.error(slugCheck.error || 'A valid URL slug is required.');
      return;
    }

    // 3. Unique slug validation across all projects
    const idToSlugMap = new Map<string, string>();
    data.projects.forEach((p) => {
      idToSlugMap.set(p.id, p.slug || p.id);
    });
    const uniqueSlugCheck = validators.uniqueSlug(
      form.slug,
      data.projects.map((p) => p.slug || p.id),
      mode === 'edit' ? id : undefined,
      idToSlugMap
    );
    if (!uniqueSlugCheck.isValid) {
      setStatus('error');
      setErrorMessage(uniqueSlugCheck.error || 'Slug must be unique.');
      toast.error(uniqueSlugCheck.error || 'Slug must be unique.');
      return;
    }

    // 4. URL Safety checks
    if (form.thumbnail) {
      const thumbCheck = validators.url(form.thumbnail, true, 'Thumbnail URL');
      if (!thumbCheck.isValid) {
        setStatus('error');
        setErrorMessage(thumbCheck.error || 'Unsafe thumbnail URL detected.');
        toast.error(thumbCheck.error || 'Unsafe thumbnail URL detected.');
        return;
      }
    }

    if (form.coverImage) {
      const coverCheck = validators.url(form.coverImage, true, 'Cover Image URL');
      if (!coverCheck.isValid) {
        setStatus('error');
        setErrorMessage(coverCheck.error || 'Unsafe cover image URL detected.');
        toast.error(coverCheck.error || 'Unsafe cover image URL detected.');
        return;
      }
    }

    if (form.gallery && form.gallery.length > 0) {
      for (const [idx, imgUrl] of form.gallery.entries()) {
        const galleryCheck = validators.url(imgUrl, true, `Gallery Image #${idx + 1}`);
        if (!galleryCheck.isValid) {
          setStatus('error');
          setErrorMessage(galleryCheck.error || `Unsafe gallery image URL at position #${idx + 1}.`);
          toast.error(`Unsafe gallery image URL at position #${idx + 1}.`);
          return;
        }
      }
    }

    // 5. Order validation
    if (form.order !== undefined) {
      const orderCheck = validators.order(form.order, 'Project Order');
      if (!orderCheck.isValid) {
        setStatus('error');
        setErrorMessage(orderCheck.error || 'Order must be a valid positive integer.');
        toast.error(orderCheck.error || 'Order must be a valid positive integer.');
        return;
      }
    }

    try {
      setStatus('saving');
      setErrorMessage(null);

      if (mode === 'create') {
        const created = await createProject(form);
        if (created) {
          setStatus('saved');
          setIsDirty(false);
          toast.success('Project created successfully!');
          setTimeout(() => {
            navigate('/admin/projects');
          }, 800);
        } else {
          setStatus('error');
          setErrorMessage('Failed to create project repository.');
          toast.error('Failed to create project repository.');
        }
      } else if (mode === 'edit' && id) {
        const success = await updateProject(id, form);
        if (success) {
          setStatus('saved');
          setIsDirty(false);
          toast.success('Project updated and saved!');
          setTimeout(() => setStatus('idle'), 3000);
        } else {
          setStatus('error');
          setErrorMessage('Failed to update project repository.');
          toast.error('Failed to update project repository.');
        }
      }
    } catch (err: any) {
      setStatus('error');
      const formatted = validators.formatFriendlyError(err);
      setErrorMessage(formatted);
      toast.error(formatted);
    }
  };

  // Cancel handler with guard
  const handleCancel = () => {
    if (isDirty) {
      if (!window.confirm('Discard unsaved changes and return to project list?')) {
        return;
      }
    }
    navigate('/admin/projects');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={handleMediaSelected}
        title={
          mediaPickerTarget === 'thumbnail'
            ? 'Select Thumbnail Asset'
            : mediaPickerTarget === 'coverImage'
            ? 'Select Hero Cover Image'
            : 'Add Image to Gallery'
        }
      />

      {/* Top Navigation & Action Bar */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Projects</span>
              </button>
              <span className="text-muted">/</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                {mode === 'create' ? 'New Repository' : `Edit #${form.number || '01'}`}
              </span>
              {isDirty && (
                <Badge variant="warning" size="sm" className="animate-pulse">
                  Unsaved Changes
                </Badge>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {mode === 'create' ? 'Create New Project' : form.title || 'Edit Project'}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Configure metadata, category, typography descriptors, client roles, and image assets.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              leftIcon={<Undo2 className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleSave()}
              isLoading={status === 'saving'}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {mode === 'create' ? 'Create Project' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Feedback Banners */}
      {status === 'saved' && (
        <Alert
          variant="success"
          title={mode === 'create' ? 'Project created successfully!' : 'Project updated and saved!'}
          onClose={() => setStatus('idle')}
        >
          <div className="flex items-center justify-between gap-2 mt-1">
            <span>Changes have been saved live to database.</span>
            <Link to="/#works" target="_blank" className="underline inline-flex items-center gap-1 font-semibold text-xs">
              <span>Preview in Selected Works</span>
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Alert>
      )}

      {status === 'error' && (
        <Alert
          variant="error"
          title="Save Error"
          onClose={() => setStatus('idle')}
        >
          {errorMessage || 'An error occurred while saving.'}
        </Alert>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* ================================================== */}
        {/* 1. PRIMARY METADATA & IDENTITY */}
        {/* ================================================== */}
        <Card className="p-5 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCode className="w-4 h-4" />
                <span>Primary Project Identity</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Title, slug, temporal year, and public visibility states
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Placeholder Template Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.placeholder || false}
                  onChange={(e) => handleFieldChange('placeholder', e.target.checked)}
                  className="w-4 h-4 rounded border-border text-amber-500 accent-amber-500"
                />
                <Badge variant={form.placeholder ? 'warning' : 'neutral'} size="sm">
                  {form.placeholder ? 'Template / Placeholder' : 'Verified Real Project'}
                </Badge>
              </label>

              {/* Featured Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleFieldChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-border text-foreground accent-foreground"
                />
                <span className="flex items-center gap-1">
                  <Star className={`w-3.5 h-3.5 ${form.featured ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                  Featured
                </span>
              </label>

              {/* Published Toggle */}
              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer select-none transition-colors ${
                  form.published
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-500/10 text-muted border-zinc-500/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => handleFieldChange('published', e.target.checked)}
                  className="hidden"
                />
                <Globe className="w-3.5 h-3.5" />
                <span>{form.published ? 'Published' : 'Draft Mode'}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Input
                label="Project Title"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. AURORA CRM PLATFORM"
                className="uppercase font-bold"
              />
            </div>

            {/* Short Title */}
            <div>
              <Input
                label="Short Display Title"
                value={form.shortTitle || ''}
                onChange={(e) => handleFieldChange('shortTitle', e.target.value)}
                placeholder="e.g. Aurora"
                helperText="Compact label used in mobile drawer and tight typographic rows."
              />
            </div>

            {/* URL Slug */}
            <div>
              <Input
                label="URL Identifier / Slug"
                value={form.slug}
                onChange={(e) => handleFieldChange('slug', e.target.value)}
                placeholder="e.g. aurora-crm"
                className="font-mono text-xs"
              />
            </div>

            {/* Year */}
            <div>
              <Input
                label="Year Created"
                value={form.year}
                onChange={(e) => handleFieldChange('year', e.target.value)}
                placeholder="e.g. 2026"
                className="font-mono text-xs"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Input
                label="Discipline / Category"
                value={form.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                placeholder="e.g. Product Design"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {managedCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleFieldChange('category', cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                      form.category === cat
                        ? 'border-foreground bg-foreground text-background font-semibold'
                        : 'border-border bg-background text-muted hover:text-foreground hover:border-foreground/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Client */}
            <div>
              <Input
                label="Client / Commission Entity"
                value={form.client}
                onChange={(e) => handleFieldChange('client', e.target.value)}
                placeholder="e.g. Aurora Systems Berlin"
              />
            </div>

            {/* Role */}
            <div>
              <Input
                label="Creative Role / Discipline"
                value={form.role || ''}
                onChange={(e) => handleFieldChange('role', e.target.value)}
                placeholder="e.g. Lead Product Designer & Frontend Architect"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Textarea
                label="Case Study Narrative / Overview"
                rows={4}
                value={form.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Autonomous customer relationship platform with fluid typographic dashboards and real-time interaction pipelines..."
              />
            </div>
          </div>
        </Card>

        {/* ================================================== */}
        {/* 2. SERVICES & TAGS */}
        {/* ================================================== */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="w-4 h-4" />
              <span>Services Scope & Disciplines</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Tag pills displayed on hover preview and project details
            </CardDescription>
          </div>

          <div className="space-y-4">
            {/* Tag Input */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  value={newServiceTag}
                  onChange={(e) => setNewServiceTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                  placeholder="Add service tag (e.g. WebGL Shaders)..."
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleAddService()}
                disabled={!newServiceTag.trim()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Tag
              </Button>
            </div>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-2">
              {(form.services || []).map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                >
                  <span>{service}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(service)}
                    className="text-muted hover:text-red-400 transition-colors p-0.5 rounded"
                    aria-label={`Remove ${service}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <p className="text-[11px] text-muted mb-1.5">Quick add managed category & service scope presets:</p>
              <div className="flex flex-wrap gap-1.5">
                {managedServices.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddService(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-md border border-border bg-background/50 text-muted hover:text-foreground hover:bg-background transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ================================================== */}
        {/* 3. MEDIA ASSETS (THUMBNAIL & COVER IMAGE) */}
        {/* ================================================== */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="w-4 h-4" />
              <span>Project Visuals & Media Showcase</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Thumbnail for floating preview and Cover Image for project header
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thumbnail */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Thumbnail Asset (Selected Works Row Preview)
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setMediaPickerTarget('thumbnail')}
                  leftIcon={<Sparkles className="w-3 h-3" />}
                >
                  Media Library
                </Button>
              </div>

              <Input
                value={form.thumbnail}
                onChange={(e) => handleFieldChange('thumbnail', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="font-mono text-xs"
              />

              {/* Thumbnail Live Preview */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border bg-background">
                {form.thumbnail ? (
                  <img
                    src={form.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-xs">No thumbnail selected</span>
                  </div>
                )}

                {form.thumbnail && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() => setMediaPickerTarget('thumbnail')}
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => handleFieldChange('thumbnail', '')}
                      aria-label="Remove thumbnail"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Cover Image Asset (Full Showcase Header)
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setMediaPickerTarget('coverImage')}
                  leftIcon={<Sparkles className="w-3 h-3" />}
                >
                  Media Library
                </Button>
              </div>

              <Input
                value={form.coverImage}
                onChange={(e) => handleFieldChange('coverImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="font-mono text-xs"
              />

              {/* Cover Live Preview */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border bg-background">
                {form.coverImage ? (
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-xs">No cover image selected</span>
                  </div>
                )}

                {form.coverImage && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() => setMediaPickerTarget('coverImage')}
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => handleFieldChange('coverImage', '')}
                      aria-label="Remove cover image"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* ================================================== */}
        {/* 4. GALLERY IMAGES */}
        {/* ================================================== */}
        <Card className="p-5 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="w-4 h-4" />
                <span>Gallery & Multi-Image Showcase ({form.gallery?.length || 0})</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Additional project photography with reordering and asset picker
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMediaPickerTarget('gallery')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add From Library
            </Button>
          </div>

          {/* Quick URL Add */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1">
              <Input
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGalleryImage(newGalleryUrl);
                  }
                }}
                placeholder="Paste image URL to append to gallery..."
                className="font-mono text-xs"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleAddGalleryImage(newGalleryUrl)}
              disabled={!newGalleryUrl.trim()}
            >
              Add Image
            </Button>
          </div>

          {/* Gallery Items List */}
          {(!form.gallery || form.gallery.length === 0) ? (
            <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted space-y-1">
              <ImageIcon className="w-6 h-6 mx-auto opacity-30 mb-1" />
              <p>No gallery images attached.</p>
              <p className="text-[11px]">Use the media library or paste direct links above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.gallery.map((imgUrl, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-border bg-background p-2 space-y-2 hover:border-foreground/30 transition-colors"
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-surface relative">
                    <img src={imgUrl} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-xs font-mono text-[10px] text-foreground font-bold">
                      #{index + 1}
                    </span>
                  </div>

                  <p className="text-[10px] font-mono text-muted truncate px-1">{imgUrl}</p>

                  <div className="flex items-center justify-between border-t border-border pt-2 px-1">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="icon"
                        size="xs"
                        onClick={() => handleMoveGalleryImage(index, 'up')}
                        disabled={index === 0}
                        aria-label="Move Earlier"
                        title="Move Earlier"
                        icon={<ArrowUp className="w-3 h-3" />}
                      />
                      <Button
                        type="button"
                        variant="icon"
                        size="xs"
                        onClick={() => handleMoveGalleryImage(index, 'down')}
                        disabled={index === (form.gallery?.length || 1) - 1}
                        aria-label="Move Later"
                        title="Move Later"
                        icon={<ArrowDown className="w-3 h-3" />}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => handleRemoveGalleryImage(index)}
                      aria-label="Remove From Gallery"
                      title="Remove From Gallery"
                      icon={<Trash2 className="w-3 h-3" />}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </form>
    </div>
  );
};

export default ProjectEditor;
