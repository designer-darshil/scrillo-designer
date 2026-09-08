import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { PortfolioCategory } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

export const CategoriesManager: React.FC = () => {
  const { data, updateCategories } = useWebsiteData();

  const [categories, setCategories] = useState<PortfolioCategory[]>(
    data.categories && data.categories.length > 0 ? data.categories : defaultWebsiteData.categories || []
  );

  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New category buffer
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useUnsavedChanges(isDirty);

  useEffect(() => {
    if (data.categories && data.categories.length > 0) {
      setCategories(data.categories);
    }
  }, [data.categories]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const name = newCatName.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setErrorMessage(`Category "${name}" already exists.`);
      setStatus('error');
      return;
    }

    markDirty();
    const newCat: PortfolioCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: newCatDesc.trim() || `${name} design and development capabilities.`,
      order: categories.length + 1,
      visible: true,
    };

    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    setErrorMessage(null);
  };

  const handleEditCategory = (id: string, field: keyof PortfolioCategory, value: any) => {
    markDirty();
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    markDirty();
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    markDirty();
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: c.visible === false } : c))
    );
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    )
      return;
    markDirty();
    const newList = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    newList.forEach((c, idx) => {
      c.order = idx + 1;
    });
    setCategories(newList);
  };

  const handleSave = async () => {
    setStatus('saving');
    setErrorMessage(null);
    try {
      const success = await updateCategories(categories);
      if (success) {
        setStatus('saved');
        setIsDirty(false);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save categories.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to save categories.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset categories back to resume defaults?')) {
      setCategories(defaultWebsiteData.categories || []);
      markDirty();
    }
  };

  // Compute live usages
  const getProjectUsageCount = (catName: string) => {
    return (data.projects || []).filter(
      (p) =>
        p.category?.toLowerCase() === catName.toLowerCase() ||
        p.services?.some((s) => s.toLowerCase() === catName.toLowerCase())
    ).length;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans uppercase flex items-center gap-3">
            <Tag className="w-6 h-6 text-foreground" />
            <span>Managed Category System</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted font-mono mt-1">
            Universal taxonomy based on Resume.pdf — utilized across Projects, Experience, Skills & Services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-border text-muted hover:text-foreground font-mono text-xs uppercase flex items-center gap-1.5"
            title="Reset to Default Resume Categories"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className={`min-h-[44px] px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs ${
              status === 'saved'
                ? 'bg-emerald-600 text-white'
                : status === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-foreground text-background hover:opacity-90'
            }`}
          >
            {status === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : status === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Live</span>
              </>
            ) : status === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Retry Save</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Categories {isDirty && '•'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-300 font-bold"
          >
            [Dismiss]
          </button>
        </div>
      )}

      {/* Quick Add Form */}
      <form
        onSubmit={handleAddCategory}
        className="p-5 sm:p-6 rounded-2xl border border-border bg-surface/40 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
            <Plus className="w-4 h-4 text-foreground" />
            <span>Add New Category</span>
          </span>
          <span className="font-mono text-xs text-muted">
            [{categories.length} Total Categories]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category Name (e.g. Interaction Design, SaaS, E-commerce...)"
            className="sm:col-span-4 px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
          />
          <input
            type="text"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            placeholder="Brief discipline description & scope (optional)"
            className="sm:col-span-6 px-4 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
          />
          <button
            type="submit"
            disabled={!newCatName.trim()}
            className="sm:col-span-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Add Category
          </button>
        </div>
      </form>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const projectCount = getProjectUsageCount(cat.name);
          return (
            <div
              key={cat.id || idx}
              className="p-4 sm:p-5 rounded-xl border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-foreground/40 group"
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <span className="font-mono text-xs font-bold text-muted mt-1 sm:mt-0">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleEditCategory(cat.id, 'name', e.target.value)}
                      className="font-bold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-foreground focus:outline-hidden uppercase tracking-tight py-0.5"
                    />
                    <span className="font-mono text-[11px] text-muted bg-surface px-2 py-0.5 rounded-md border border-border/50">
                      slug: {cat.slug}
                    </span>
                    {projectCount > 0 && (
                      <span className="font-mono text-[10px] text-foreground bg-foreground/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                        <FolderGit2 className="w-3 h-3" />
                        <span>{projectCount} projects</span>
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={cat.description || ''}
                    onChange={(e) => handleEditCategory(cat.id, 'description', e.target.value)}
                    placeholder="Describe category..."
                    className="w-full text-xs text-muted bg-transparent border-b border-transparent hover:border-border focus:border-foreground focus:outline-hidden py-0.5"
                  />
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveCategory(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveCategory(idx, 'down')}
                  disabled={idx === categories.length - 1}
                  className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(cat.id)}
                  className={`p-1.5 rounded-lg border text-xs ${
                    cat.visible !== false ? 'border-border text-emerald-500' : 'border-border text-muted opacity-40'
                  }`}
                  title={cat.visible !== false ? 'Visible' : 'Hidden'}
                >
                  {cat.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesManager;
