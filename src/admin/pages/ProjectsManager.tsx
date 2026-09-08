import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Star,
  Globe,
  FileText,
  Edit,
  Copy,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  AlertTriangle,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { Project } from '../../types';

export const ProjectsManager: React.FC = () => {
  const navigate = useNavigate();
  const { data, deleteProject, duplicateProject, reorderProjects, togglePublishProject, toggleFeaturedProject } =
    useWebsiteData();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Deletion confirmation modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    data.projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [data.projects]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return [...data.projects]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .filter((project) => {
        // Search query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = project.title.toLowerCase().includes(q);
          const matchShortTitle = project.shortTitle?.toLowerCase().includes(q);
          const matchSlug = project.slug.toLowerCase().includes(q);
          const matchCategory = project.category?.toLowerCase().includes(q);
          const matchClient = project.client?.toLowerCase().includes(q);
          const matchRole = project.role?.toLowerCase().includes(q);
          if (!matchTitle && !matchShortTitle && !matchSlug && !matchCategory && !matchClient && !matchRole) {
            return false;
          }
        }

        // Category filter
        if (categoryFilter !== 'ALL' && project.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter === 'PUBLISHED' && project.published === false) return false;
        if (statusFilter === 'DRAFT' && project.published !== false) return false;

        // Featured filter
        if (featuredFilter === 'FEATURED' && !project.featured) return false;
        if (featuredFilter === 'STANDARD' && project.featured) return false;

        return true;
      });
  }, [data.projects, searchTerm, categoryFilter, statusFilter, featuredFilter]);

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...data.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);

    const orderedIds = reordered.map((p) => p.id);
    const success = await reorderProjects(orderedIds);
    if (success) {
      showToast('Project sequence reordered and saved.');
    }
  };

  // Reorder up/down fallback
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...data.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    const success = await reorderProjects(sorted.map((p) => p.id));
    if (success) {
      showToast('Project order updated.');
    }
  };

  // Duplicate handler
  const handleDuplicate = async (id: string) => {
    const duplicated = await duplicateProject(id);
    if (duplicated) {
      showToast(`Duplicated as "${duplicated.title}". Saved to drafts.`);
    }
  };

  // Delete confirmation
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    const success = await deleteProject(projectToDelete.id);
    setIsDeleting(false);
    if (success) {
      showToast(`Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
    }
  };

  // Toggle publish
  const handleTogglePublish = async (id: string) => {
    const success = await togglePublishProject(id);
    if (success) {
      const proj = data.projects.find((p) => p.id === id);
      showToast(`Project is now ${!proj?.published ? 'Published' : 'Draft'}.`);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (id: string) => {
    const success = await toggleFeaturedProject(id);
    if (success) {
      const proj = data.projects.find((p) => p.id === id);
      showToast(`Project ${!proj?.featured ? 'marked as Featured' : 'unmarked from Featured'}.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-500/30 bg-surface p-4 shadow-xl flex items-center gap-3 text-xs text-foreground animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wide text-foreground">Confirm Deletion</h3>
                <p className="text-xs text-muted">This action will remove the project from the portfolio repository.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border space-y-1 text-xs">
              <p className="text-muted">Target Project:</p>
              <p className="font-bold text-foreground text-sm uppercase">{projectToDelete.title}</p>
              <p className="font-mono text-muted text-[11px]">Slug: {projectToDelete.slug}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header Bar */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" />
              Project Repositories & Selected Works
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Selected Works Manager
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            Manage portfolio case studies, reorder sequence, toggle draft/published status, and configure visual assets.
          </p>
        </div>

        {/* Global Action: New Project */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
        </div>
      </div>

      {/* Stats & Quick Summary Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Total Repositories</span>
          <span className="text-2xl font-bold text-foreground mt-2">{data.projects.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Published (Live)</span>
          <span className="text-2xl font-bold text-emerald-500 mt-2">
            {data.projects.filter((p) => p.published !== false).length}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Draft Mode</span>
          <span className="text-2xl font-bold text-amber-500 mt-2">
            {data.projects.filter((p) => p.published === false).length}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
          <span className="text-[11px] font-mono text-muted uppercase">Featured Works</span>
          <span className="text-2xl font-bold text-foreground mt-2">
            {data.projects.filter((p) => p.featured).length}
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, slug, client, discipline, or role..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Published / Draft Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </select>

            {/* Featured Filter */}
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
            >
              <option value="ALL">All Showcases</option>
              <option value="FEATURED">Featured Only</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Container: Responsive Cards on Mobile (<md), Dense Table on Desktop (>=md) */}
      <div className="space-y-4">
        {/* Mobile View: Cards List */}
        <div className="block md:hidden space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl border border-border bg-surface text-center text-muted">
              <FolderGit2 className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="font-semibold text-xs">No projects match your search or filters.</p>
              <p className="text-[11px] mt-1">Try clearing filters or creating a new project.</p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="rounded-2xl border border-border bg-surface p-4 space-y-3 shadow-xs"
              >
                {/* Header: Thumbnail + Title + Number */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-background shrink-0">
                    {project.thumbnail || project.coverImage ? (
                      <img
                        src={project.thumbnail || project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted font-mono text-[10px]">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-muted text-[10px] font-bold">
                        #{String(project.order || index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Featured Star */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            project.featured
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              : 'border-border text-muted hover:text-foreground'
                          }`}
                          title={project.featured ? 'Featured' : 'Mark as Featured'}
                        >
                          <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-500' : ''}`} />
                        </button>

                        {/* Published Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(project.id)}
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                            project.published !== false
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : 'bg-zinc-500/10 text-muted border-zinc-500/20'
                          }`}
                        >
                          {project.published !== false ? 'Published' : 'Draft'}
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-foreground text-sm uppercase truncate mt-0.5">
                      {project.title}
                    </h3>
                    <p className="font-mono text-[10px] text-muted truncate">
                      /{project.slug} {project.client ? `• ${project.client}` : ''}
                    </p>
                  </div>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border text-[10px] text-muted">
                  <span className="px-2 py-0.5 rounded-md border border-border bg-background">
                    {project.category || 'General'}
                  </span>
                  <span className="font-mono">{project.year || '2026'}</span>
                </div>

                {/* Mobile Actions Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-border text-muted hover:text-foreground hover:bg-background disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === filteredProjects.length - 1}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-border text-muted hover:text-foreground hover:bg-background disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit, Duplicate, Delete */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/admin/projects/${project.id}/edit`}
                      className="min-h-[38px] px-3.5 flex items-center justify-center gap-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(project.id)}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectToDelete(project)}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Sortable Table */}
        <div className="hidden md:block rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-background/60 font-mono text-[11px] text-muted uppercase">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-3 w-16">Thumbnail</th>
                  <th className="py-3.5 px-4">Title & Slug</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-3 text-center">Featured</th>
                  <th className="py-3.5 px-3 text-center">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted">
                      <FolderGit2 className="w-8 h-8 mx-auto opacity-30 mb-2" />
                      <p className="font-semibold">No projects match the current search or filters.</p>
                      <p className="text-[11px] mt-1">Try clearing your filters or creating a new project.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project, index) => {
                    const isDraggingThis = draggedIndex === index;
                    const isDropTarget = dragOverIndex === index;

                    return (
                      <tr
                        key={project.id}
                        draggable={searchTerm === '' && categoryFilter === 'ALL' && statusFilter === 'ALL' && featuredFilter === 'ALL'}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={() => {
                          setDraggedIndex(null);
                          setDragOverIndex(null);
                        }}
                        className={`group transition-colors ${
                          isDraggingThis ? 'opacity-30 bg-background/50' : isDropTarget ? 'bg-foreground/5 border-t-2 border-foreground' : 'hover:bg-background/40'
                        }`}
                      >
                        {/* Order & Drag Handle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              className="cursor-grab active:cursor-grabbing text-muted group-hover:text-foreground p-1 rounded hover:bg-background transition-colors"
                              title="Drag to reorder"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-muted text-[11px] font-semibold w-5 text-left">
                              #{String(project.order || index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </td>

                        {/* Thumbnail */}
                        <td className="py-3.5 px-3">
                          <div className="w-12 h-8 rounded-lg overflow-hidden border border-border bg-background shrink-0">
                            {project.thumbnail || project.coverImage ? (
                              <img
                                src={project.thumbnail || project.coverImage}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted font-mono text-[9px]">
                                N/A
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Slug */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-foreground text-sm uppercase tracking-tight group-hover:text-foreground">
                              {project.title}
                            </div>
                            <div className="font-mono text-[10px] text-muted flex items-center gap-2">
                              <span>/{project.slug}</span>
                              {project.client && (
                                <>
                                  <span>•</span>
                                  <span>{project.client}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Year */}
                        <td className="py-3.5 px-4 font-mono text-muted">{project.year || '2026'}</td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md border border-border bg-background text-[11px] text-muted whitespace-nowrap">
                            {project.category || 'General'}
                          </span>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(project.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              project.featured
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                : 'border-transparent text-muted hover:text-foreground hover:bg-background'
                            }`}
                            title={project.featured ? 'Featured Project (Click to unfeature)' : 'Mark as Featured'}
                          >
                            <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-500' : ''}`} />
                          </button>
                        </td>

                        {/* Published Status Toggle */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(project.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                              project.published !== false
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-zinc-500/10 text-muted border-zinc-500/20 hover:bg-zinc-500/20'
                            }`}
                            title="Click to toggle publish / draft"
                          >
                            <Globe className="w-3 h-3" />
                            <span>{project.published !== false ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Reorder Arrows (Accessibility fallback) */}
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background disabled:opacity-20 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'down')}
                              disabled={index === filteredProjects.length - 1}
                              className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background disabled:opacity-20 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/admin/projects/${project.id}/edit`}
                              className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
                              title="Edit Project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicate(project.id)}
                              className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
                              title="Duplicate Project"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setProjectToDelete(project)}
                              className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager;
