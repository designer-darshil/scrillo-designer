import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Star,
  Globe,
  Edit,
  Copy,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { Project } from '../../types';
import {
  Button,
  Search,
  Select,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  Card,
  useToast,
  EmptyState,
} from '../../design-system';

export const ProjectsManager: React.FC = () => {
  const navigate = useNavigate();
  const { data, deleteProject, duplicateProject, reorderProjects, togglePublishProject, toggleFeaturedProject } =
    useWebsiteData();

  const toast = useToast();

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

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    (data.categories || []).forEach((c) => {
      if (c.visible !== false) set.add(c.name);
    });
    data.projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [data.categories, data.projects]);

  // Filtered & searched project list
  const filteredProjects = useMemo(() => {
    return data.projects.filter((p) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesSlug = p.slug.toLowerCase().includes(query);
        const matchesClient = p.client?.toLowerCase().includes(query);
        const matchesCategory = p.category?.toLowerCase().includes(query);
        const matchesRole = p.role?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSlug && !matchesClient && !matchesCategory && !matchesRole) {
          return false;
        }
      }

      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) {
        return false;
      }

      if (statusFilter === 'PUBLISHED' && p.published === false) return false;
      if (statusFilter === 'DRAFT' && p.published !== false) return false;

      if (featuredFilter === 'FEATURED' && !p.featured) return false;
      if (featuredFilter === 'STANDARD' && p.featured) return false;

      return true;
    });
  }, [data.projects, searchTerm, categoryFilter, statusFilter, featuredFilter]);

  // Drag & drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...data.projects];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    await reorderProjects(reordered.map((p) => p.id));
    toast.success('Project display sequence updated.');
  };

  // Keyboard reordering fallback
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.projects.length) return;

    const reordered = [...data.projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    await reorderProjects(reordered.map((p) => p.id));
    toast.success(`Project moved ${direction}.`);
  };

  // Duplicate handler
  const handleDuplicate = async (id: string) => {
    const duplicated = await duplicateProject(id);
    if (duplicated) {
      toast.success(`Duplicated as "${duplicated.title}". Saved to drafts.`);
    }
  };

  // Delete confirmation
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    const success = await deleteProject(projectToDelete.id);
    setIsDeleting(false);
    if (success) {
      toast.success(`Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
    }
  };

  // Toggle publish
  const handleTogglePublish = async (id: string) => {
    const success = await togglePublishProject(id);
    if (success) {
      const proj = data.projects.find((p) => p.id === id);
      toast.success(`Project is now ${!proj?.published ? 'Published' : 'Draft'}.`);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (id: string) => {
    const success = await toggleFeaturedProject(id);
    if (success) {
      const proj = data.projects.find((p) => p.id === id);
      toast.success(`Project ${!proj?.featured ? 'marked as Featured' : 'unmarked from Featured'}.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        title={
          <div className="flex items-center gap-3 text-red-500">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
                Confirm Deletion
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                This action will remove the project from the portfolio repository.
              </p>
            </div>
          </div>
        }
        size="sm"
      >
        <ModalBody>
          <div className="p-4 rounded-xl bg-[var(--color-background-primary)] border border-[var(--color-border-default)] space-y-1 text-xs">
            <p className="text-[var(--color-text-tertiary)]">Target Project:</p>
            <p className="font-bold text-[var(--color-text-primary)] text-sm uppercase">{projectToDelete?.title}</p>
            <p className="font-mono text-[var(--color-text-tertiary)] text-[11px]">Slug: {projectToDelete?.slug}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" size="sm" onClick={() => setProjectToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirmDelete}
            loading={isDeleting}
            loadingText="Deleting..."
          >
            Delete Project
          </Button>
        </ModalFooter>
      </Modal>

      {/* Page Header Bar */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" />
              Project Repositories & Selected Works
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Selected Works Manager
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-xl">
            Manage portfolio case studies, reorder sequence, toggle draft/published status, and configure visual assets.
          </p>
        </div>

        {/* Global Action: New Project */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin/projects/new">
            <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
              Create New Project
            </Button>
          </Link>
        </div>
      </Card>

      {/* Stats & Quick Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[var(--color-text-tertiary)] uppercase">Total Repositories</span>
          <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">{data.projects.length}</span>
        </Card>
        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[var(--color-text-tertiary)] uppercase">Published (Live)</span>
          <span className="text-2xl font-bold text-emerald-500 mt-2">
            {data.projects.filter((p) => p.published !== false).length}
          </span>
        </Card>
        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[var(--color-text-tertiary)] uppercase">Draft Mode</span>
          <span className="text-2xl font-bold text-amber-500 mt-2">
            {data.projects.filter((p) => p.published === false).length}
          </span>
        </Card>
        <Card className="flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[var(--color-text-tertiary)] uppercase">Featured Works</span>
          <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
            {data.projects.filter((p) => p.featured).length}
          </span>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="flex-1">
            <Search
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, slug, client, discipline, or role..."
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </Select>

            <Select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as any)}
              className="w-full sm:w-auto"
            >
              <option value="ALL">All Showcases</option>
              <option value="FEATURED">Featured Only</option>
              <option value="STANDARD">Standard</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Projects Container: Responsive Cards on Mobile (<md), Dense Table on Desktop (>=md) */}
      <div className="space-y-4">
        {/* Mobile View: Cards List */}
        <div className="block md:hidden space-y-3">
          {filteredProjects.length === 0 ? (
            <EmptyState
              title="No projects match your search or filters."
              description="Try clearing filters or creating a new project."
            />
          ) : (
            filteredProjects.map((project, index) => (
              <Card key={project.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-background-primary)] shrink-0">
                    {project.thumbnail || project.coverImage ? (
                      <img
                        src={project.thumbnail || project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)] font-mono text-[10px]">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[var(--color-text-tertiary)] text-[10px] font-bold">
                        #{String(project.order || index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            project.featured
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              : 'border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                          }`}
                          title={project.featured ? 'Featured' : 'Mark as Featured'}
                        >
                          <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-500' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePublish(project.id)}
                        >
                          <Badge variant={project.published !== false ? 'success' : 'neutral'} size="sm" dot>
                            {project.published !== false ? 'Published' : 'Draft'}
                          </Badge>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase truncate mt-0.5">
                      {project.title}
                    </h3>
                    <p className="font-mono text-[10px] text-[var(--color-text-tertiary)] truncate">
                      /{project.slug} {project.client ? `• ${project.client}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-tertiary)]">
                  <Badge variant="neutral" size="sm">
                    {project.category || 'General'}
                  </Badge>
                  <span className="font-mono">{project.year || '2026'}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === filteredProjects.length - 1}
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link to={`/admin/projects/${project.id}/edit`}>
                      <Button variant="primary" size="sm" icon={<Edit className="w-3.5 h-3.5" />}>
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => handleDuplicate(project.id)}
                      aria-label="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => setProjectToDelete(project)}
                      aria-label="Delete Project"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Desktop View: Sortable Table */}
        <Card className="hidden md:block p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-[var(--color-border-default)] bg-[var(--color-background-primary)]/60 font-mono text-[11px] text-[var(--color-text-tertiary)] uppercase">
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
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[var(--color-text-tertiary)]">
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
                          isDraggingThis
                            ? 'opacity-30 bg-[var(--color-background-primary)]'
                            : isDropTarget
                            ? 'bg-[var(--color-background-elevated)] border-t-2 border-[var(--color-action-primary)]'
                            : 'hover:bg-[var(--color-background-elevated)]/50'
                        }`}
                      >
                        {/* Order & Drag Handle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              className="cursor-grab active:cursor-grabbing text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] p-1 rounded hover:bg-[var(--color-background-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
                              title="Drag to reorder"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-[var(--color-text-tertiary)] text-[11px] font-semibold w-5 text-left">
                              #{String(project.order || index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </td>

                        {/* Thumbnail */}
                        <td className="py-3.5 px-3">
                          <div className="w-12 h-8 rounded-lg overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-background-primary)] shrink-0">
                            {project.thumbnail || project.coverImage ? (
                              <img
                                src={project.thumbnail || project.coverImage}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)] font-mono text-[9px]">
                                N/A
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Slug */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-tight group-hover:text-[var(--color-text-primary)]">
                                {project.title}
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-2">
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
                        <td className="py-3.5 px-4 font-mono text-[var(--color-text-tertiary)]">{project.year || '2026'}</td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <Badge variant="neutral" size="sm">
                            {project.category || 'General'}
                          </Badge>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(project.id)}
                            className={`p-1.5 rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] ${
                              project.featured
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                : 'border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-primary)]'
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
                            className="focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)] rounded-full"
                            title="Click to toggle publish / draft"
                          >
                            <Badge variant={project.published !== false ? 'success' : 'neutral'} size="sm" dot>
                              {project.published !== false ? 'Published' : 'Draft'}
                            </Badge>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleMoveOrder(index, 'up')}
                              disabled={index === 0}
                              aria-label="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleMoveOrder(index, 'down')}
                              disabled={index === filteredProjects.length - 1}
                              aria-label="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>

                            <Link to={`/admin/projects/${project.id}/edit`}>
                              <Button
                                variant="icon"
                                size="sm"
                                aria-label="Edit Project"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                            </Link>

                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleDuplicate(project.id)}
                              aria-label="Duplicate Project"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => setProjectToDelete(project)}
                              aria-label="Delete Project"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsManager;
