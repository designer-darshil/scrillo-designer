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
import {
  Button,
  Input,
  Badge,
  Alert,
  Card,
  useToast,
} from '../../design-system';

export const CategoriesManager: React.FC = () => {
  const { data, updateCategories } = useWebsiteData();
  const { success: toastSuccess, error: toastError } = useToast();

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
    toastSuccess(`Added category "${name}".`);
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
    toastSuccess('Category removed from queue.');
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
        toastSuccess('Categories saved live to production.');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to save categories.');
        toastError('Failed to save categories.');
      }
    } catch (err: any) {
      setStatus('error');
      const errText = err?.message || 'Failed to save categories.';
      setErrorMessage(errText);
      toastError(errText);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset categories back to resume defaults?')) {
      setCategories(defaultWebsiteData.categories || []);
      markDirty();
      toastSuccess('Reset to default category taxonomy.');
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
      <Card className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase flex items-center gap-3">
            <Tag className="w-6 h-6 text-foreground" />
            <span>Managed Category System</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted font-mono mt-1">
            Universal taxonomy based on Resume.pdf — utilized across Projects, Experience, Skills & Services.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Defaults
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            loading={status === 'saving'}
            icon={<Save className="w-4 h-4" />}
          >
            {status === 'saved' ? 'Saved Live' : status === 'error' ? 'Retry Save' : `Save Categories ${isDirty ? '•' : ''}`}
          </Button>
        </div>
      </Card>

      {/* Error Alert Banner */}
      {errorMessage && (
        <Alert variant="error" title="Category Validation Error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Quick Add Form */}
      <Card className="p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
            <Plus className="w-4 h-4 text-foreground" />
            <span>Add New Category</span>
          </span>
          <Badge variant="neutral">
            {categories.length} Total Categories
          </Badge>
        </div>

        <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <Input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Category Name (e.g. Interaction Design, SaaS...)"
            />
          </div>
          <div className="sm:col-span-6">
            <Input
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Brief discipline description & scope (optional)"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!newCatName.trim()}
              className="w-full"
            >
              Add Category
            </Button>
          </div>
        </form>
      </Card>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const projectCount = getProjectUsageCount(cat.name);
          return (
            <Card
              key={cat.id || idx}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[var(--color-border-strong)] group shadow-xs"
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <span className="font-mono text-xs font-bold text-muted mt-1 sm:mt-0">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="text"
                      aria-label={`Category name for ${cat.name || 'new category'}`}
                      value={cat.name}
                      onChange={(e) => handleEditCategory(cat.id, 'name', e.target.value)}
                      className="font-bold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-default uppercase tracking-tight py-0.5"
                    />
                    <Badge variant="neutral">
                      slug: {cat.slug}
                    </Badge>
                    {projectCount > 0 && (
                      <Badge variant="info" className="gap-1">
                        <FolderGit2 className="w-3 h-3" />
                        <span>{projectCount} projects</span>
                      </Badge>
                    )}
                  </div>

                  <input
                    type="text"
                    aria-label={`Category description for ${cat.name || 'new category'}`}
                    value={cat.description || ''}
                    onChange={(e) => handleEditCategory(cat.id, 'description', e.target.value)}
                    placeholder="Describe category..."
                    className="w-full text-xs text-muted bg-transparent border-b border-transparent hover:border-border focus:border-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-default py-0.5"
                  />
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ArrowUp className="w-3.5 h-3.5" />}
                  onClick={() => handleMoveCategory(idx, 'up')}
                  disabled={idx === 0}
                  aria-label="Move Up"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ArrowDown className="w-3.5 h-3.5" />}
                  onClick={() => handleMoveCategory(idx, 'down')}
                  disabled={idx === categories.length - 1}
                  aria-label="Move Down"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={cat.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  onClick={() => handleToggleVisibility(cat.id)}
                  aria-label={cat.visible !== false ? 'Visible' : 'Hidden'}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleDeleteCategory(cat.id)}
                  aria-label="Delete Category"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesManager;
