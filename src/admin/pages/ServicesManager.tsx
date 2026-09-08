import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Copy,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { Service } from '../../types';
import { IconPicker, RenderLucideIcon } from '../components/IconPicker';
import { validators } from '../utils/validators';

const DELIVERABLE_PRESETS = [
  'Interface Design',
  'Design Systems',
  'Rapid Prototyping',
  'Interaction Specs',
  'Multi-brand Architecture',
  'Documentation',
  'React / Next.js',
  'Creative Development',
  'GSAP & Shaders',
  'Micro-interactions',
  'Architecture Audit',
  'Mentorship & Scaling',
];

export const ServicesManager: React.FC = () => {
  const {
    data,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    duplicateService,
    reorderServices,
    toggleServiceVisibility,
  } = useWebsiteData();

  // Search & Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'status'>('order');

  // Service Modal State (Create / Edit)
  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    service: Partial<Service>;
  }>({
    isOpen: false,
    mode: 'create',
    service: {},
  });

  const [newDeliverableTag, setNewDeliverableTag] = useState('');

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<Service | null>(null);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered and Sorted Services
  const filteredServices = useMemo(() => {
    let list = [...data.services];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((s) => {
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchDesc = s.description.toLowerCase().includes(q);
        const matchDeliv = (s.deliverables || []).some((d) => d.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchDeliv;
      });
    }

    // Visibility filter
    if (visibilityFilter === 'VISIBLE') {
      list = list.filter((s) => s.visible !== false);
    } else if (visibilityFilter === 'HIDDEN') {
      list = list.filter((s) => s.visible === false);
    }

    // Sort order
    if (sortBy === 'order') {
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'status') {
      list.sort((a, b) => (b.visible ? 1 : 0) - (a.visible ? 1 : 0));
    }

    return list;
  }, [data.services, searchTerm, visibilityFilter, sortBy]);

  // --- Modal Openers ---
  const handleOpenCreateService = () => {
    const nextOrder = data.services.length + 1;
    setServiceModal({
      isOpen: true,
      mode: 'create',
      service: {
        title: '',
        number: String(nextOrder).padStart(2, '0'),
        description: '',
        icon: 'Briefcase',
        visible: true,
        order: nextOrder,
        deliverables: ['Interface Design', 'Design Systems'],
      },
    });
  };

  const handleOpenEditService = (svc: Service) => {
    setServiceModal({
      isOpen: true,
      mode: 'edit',
      service: { ...svc, deliverables: svc.deliverables || [] },
    });
  };

  // --- Deliverable Tag Handlers ---
  const handleAddDeliverable = (tag?: string) => {
    const value = (tag || newDeliverableTag).trim();
    if (!value) return;
    const current = serviceModal.service.deliverables || [];
    if (current.includes(value)) return;

    setServiceModal((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        deliverables: [...current, value],
      },
    }));
    setNewDeliverableTag('');
  };

  const handleRemoveDeliverable = (tagToRemove: string) => {
    const current = serviceModal.service.deliverables || [];
    setServiceModal((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        deliverables: current.filter((t) => t !== tagToRemove),
      },
    }));
  };

  // --- Save Handler ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const svc = serviceModal.service;

    const titleCheck = validators.required(svc.title, 'Service Title');
    if (!titleCheck.isValid) {
      showToast(titleCheck.error || 'Service title is required.');
      return;
    }

    if (svc.order !== undefined) {
      const orderCheck = validators.order(svc.order, 'Service Order');
      if (!orderCheck.isValid) {
        showToast(orderCheck.error || 'Invalid service order.');
        return;
      }
    }

    try {
      if (serviceModal.mode === 'create') {
        const created = await createService({
          title: svc.title!.trim().toUpperCase(),
          number: svc.number || String(data.services.length + 1).padStart(2, '0'),
          description: svc.description || '',
          icon: svc.icon || 'Briefcase',
          visible: svc.visible ?? true,
          order: svc.order || data.services.length + 1,
          deliverables: svc.deliverables || [],
        });
        if (created) {
          showToast(`Service "${created.title}" created successfully.`);
          setServiceModal({ isOpen: false, mode: 'create', service: {} });
        }
      } else if (serviceModal.mode === 'edit' && svc.id) {
        const success = await updateService(svc.id, {
          title: svc.title!.trim().toUpperCase(),
          number: svc.number,
          description: svc.description,
          icon: svc.icon,
          visible: svc.visible,
          deliverables: svc.deliverables,
        });
        if (success) {
          showToast(`Service "${svc.title}" updated successfully.`);
          setServiceModal({ isOpen: false, mode: 'create', service: {} });
        }
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
  };

  // --- Duplicate Handler ---
  const handleDuplicate = async (id: string) => {
    try {
      const cloned = await duplicateService(id);
      if (cloned) {
        showToast(`Duplicated as "${cloned.title}".`);
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
  };

  // --- Delete Handler ---
  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      const success = await deleteService(deleteModal.id);
      if (success) {
        showToast(`Service "${deleteModal.title}" deleted.`);
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
    setDeleteModal(null);
  };

  // --- Drag and Drop Handlers ---
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

    const reordered = [...data.services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setDraggedIndex(null);
    setDragOverIndex(null);

    const orderedIds = reordered.map((s) => s.id);
    const success = await reorderServices(orderedIds);
    if (success) {
      showToast('Service ordering updated.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...data.services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    const success = await reorderServices(sorted.map((s) => s.id));
    if (success) {
      showToast('Service order updated.');
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
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wide text-foreground">Confirm Service Deletion</h3>
                <p className="text-xs text-muted">This action will remove the service package from commission offerings.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border text-xs">
              <p className="text-muted">Target Service:</p>
              <p className="font-bold text-foreground text-sm uppercase mt-0.5">{deleteModal.title}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Service Modal */}
      {serviceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <form onSubmit={handleSaveService} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-foreground" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {serviceModal.mode === 'create' ? 'Create Commission Service' : 'Edit Service Offering'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceModal({ isOpen: false, mode: 'create', service: {} })}
                  className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Number & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:col-span-3">
                    <label htmlFor="svc-title-input" className="block text-xs font-semibold text-foreground">
                      Service Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="svc-title-input"
                      type="text"
                      required
                      value={serviceModal.service.title || ''}
                      onChange={(e) =>
                        setServiceModal((prev) => ({
                          ...prev,
                          service: { ...prev.service, title: e.target.value.toUpperCase() },
                        }))
                      }
                      placeholder="e.g. PRODUCT DESIGN"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs font-bold uppercase text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="svc-number-input" className="block text-xs font-semibold text-foreground">
                      Index No.
                    </label>
                    <input
                      id="svc-number-input"
                      type="text"
                      value={serviceModal.service.number || ''}
                      onChange={(e) =>
                        setServiceModal((prev) => ({
                          ...prev,
                          service: { ...prev.service, number: e.target.value },
                        }))
                      }
                      placeholder="e.g. 01"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="svc-desc-input" className="block text-xs font-semibold text-foreground">
                    Editorial Scope Narrative
                  </label>
                  <textarea
                    id="svc-desc-input"
                    rows={3}
                    value={serviceModal.service.description || ''}
                    onChange={(e) =>
                      setServiceModal((prev) => ({
                        ...prev,
                        service: { ...prev.service, description: e.target.value },
                      }))
                    }
                    placeholder="End-to-end digital product design from initial concept through high-fidelity interactive prototypes..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                  />
                </div>

                {/* Lucide Icon Selector */}
                <IconPicker
                  value={serviceModal.service.icon || 'Briefcase'}
                  onChange={(iconName) =>
                    setServiceModal((prev) => ({
                      ...prev,
                      service: { ...prev.service, icon: iconName },
                    }))
                  }
                />

                {/* Deliverables Scope Chips */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-foreground">Deliverables Scope Tags</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDeliverableTag}
                      onChange={(e) => setNewDeliverableTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDeliverable();
                        }
                      }}
                      placeholder="Type deliverable (e.g. Design Systems)..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddDeliverable()}
                      disabled={!newDeliverableTag.trim()}
                      className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      Add Tag
                    </button>
                  </div>

                  {/* Active Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {(serviceModal.service.deliverables || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-background text-[11px] font-mono uppercase text-foreground"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(tag)}
                          className="text-muted hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Quick Presets */}
                  <div className="pt-1">
                    <p className="text-[10px] font-mono text-muted mb-1.5 uppercase">Quick scope suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {DELIVERABLE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAddDeliverable(preset)}
                          className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border border-border bg-background/50 text-muted hover:text-foreground hover:bg-background transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visible Toggle */}
                <div className="pt-2 border-t border-border">
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={serviceModal.service.visible !== false}
                      onChange={(e) =>
                        setServiceModal((prev) => ({
                          ...prev,
                          service: { ...prev.service, visible: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded border-border text-foreground accent-foreground"
                    />
                    <span>Service Visible in Commission Scope</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setServiceModal({ isOpen: false, mode: 'create', service: {} })}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  {serviceModal.mode === 'create' ? 'Create Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Section 05 / Commission Offerings & Scope
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Services & Commission Manager
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            Configure service scopes, deliverables, Lucide visual icons, and ordering for public commission packages.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/#services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-surface text-xs font-medium text-foreground transition-colors"
          >
            <span>Live Section</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleOpenCreateService}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Service</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by title, description, or deliverables..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-foreground"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-2">
            {/* Visibility Filter */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground"
            >
              <option value="ALL">All Services</option>
              <option value="VISIBLE">Visible Only</option>
              <option value="HIDDEN">Hidden Only</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs text-muted">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-foreground focus:outline-hidden w-full sm:w-auto"
              >
                <option value="order">Custom Order</option>
                <option value="title">Title A-Z</option>
                <option value="status">Visibility Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center rounded-2xl border border-border bg-surface text-muted text-xs">
          <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading service offerings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface text-muted space-y-3">
          <Briefcase className="w-8 h-8 mx-auto opacity-30" />
          <div>
            <p className="text-sm font-semibold text-foreground">No service offerings found</p>
            <p className="text-xs text-muted">Try adjusting your search criteria or add a new service package.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateService}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Service</span>
          </button>
        </div>
      )}

      {/* Services List / Reorderable Cards */}
      <div className="space-y-4">
        {filteredServices.map((svc, index) => {
          const isDragging = draggedIndex === index;
          const isDropTarget = dragOverIndex === index;
          const deliverables = svc.deliverables || [];

          return (
            <div
              key={svc.id}
              draggable={searchTerm === '' && visibilityFilter === 'ALL' && sortBy === 'order'}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`group rounded-2xl border bg-surface p-6 space-y-4 transition-all shadow-xs ${
                isDragging
                  ? 'opacity-30 border-dashed border-foreground'
                  : isDropTarget
                  ? 'border-foreground ring-2 ring-foreground/20'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  {/* Drag Handle */}
                  <button
                    type="button"
                    className="cursor-grab active:cursor-grabbing text-muted group-hover:text-foreground p-1 rounded hover:bg-background transition-colors"
                    title="Drag to reorder service"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-xs font-bold text-foreground px-2 py-0.5 rounded-md bg-background border border-border">
                    [{svc.number || String(index + 1).padStart(2, '0')}]
                  </span>

                  {/* Icon Badge */}
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground shrink-0">
                    <RenderLucideIcon name={svc.icon} className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg uppercase tracking-tight text-foreground">{svc.title}</h3>
                      {!svc.visible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background disabled:opacity-20 transition-colors"
                    title="Move Service Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === filteredServices.length - 1}
                    className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background disabled:opacity-20 transition-colors"
                    title="Move Service Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => toggleServiceVisibility(svc.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      svc.visible
                        ? 'border-border text-muted hover:text-foreground hover:bg-background'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                    }`}
                    title={svc.visible ? 'Hide Service' : 'Show Service'}
                  >
                    {svc.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditService(svc)}
                    className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(svc.id)}
                    className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
                    title="Duplicate Service"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteModal(svc)}
                    className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">{svc.description}</p>

              {/* Deliverables Scope Chips */}
              {deliverables.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {deliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[11px] uppercase tracking-wider text-muted bg-background border border-border/80 px-2.5 py-1 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesManager;
