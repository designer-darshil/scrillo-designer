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
  Search as SearchIcon,
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
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Alert,
  EmptyState,
  Skeleton,
  Search,
  useToast,
} from '../../design-system';

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

  const { success: toastSuccess } = useToast();
  const showToast = (msg: string) => {
    toastSuccess(msg);
  };

  const deliverablePresets = (data.categories && data.categories.length > 0 ? data.categories : defaultWebsiteData.categories || [])
    .filter((c) => c.visible !== false)
    .map((c) => c.name);

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
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        title="Confirm Service Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <Alert variant="error" title="Irreversible Action">
            This action will permanently remove this service package from commission offerings.
          </Alert>

          <div className="p-3.5 rounded-xl bg-background border border-border text-xs">
            <span className="text-muted">Target Service: </span>
            <span className="font-bold text-foreground uppercase">{deleteModal?.title}</span>
          </div>

          <ModalFooter className="px-0 pb-0">
            <Button variant="secondary" onClick={() => setDeleteModal(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Service
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Create / Edit Service Modal */}
      <Modal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal({ isOpen: false, mode: 'create', service: {} })}
        title={serviceModal.mode === 'create' ? 'Create Commission Service' : 'Edit Service Offering'}
        size="lg"
      >
        <form onSubmit={handleSaveService} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <Input
                label="Service Title *"
                required
                value={serviceModal.service.title || ''}
                onChange={(e) =>
                  setServiceModal((prev) => ({
                    ...prev,
                    service: { ...prev.service, title: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="e.g. PRODUCT DESIGN"
              />
            </div>
            <div>
              <Input
                label="Index No."
                value={serviceModal.service.number || ''}
                onChange={(e) =>
                  setServiceModal((prev) => ({
                    ...prev,
                    service: { ...prev.service, number: e.target.value },
                  }))
                }
                placeholder="e.g. 01"
              />
            </div>
          </div>

          <Textarea
            label="Editorial Scope Narrative"
            rows={3}
            value={serviceModal.service.description || ''}
            onChange={(e) =>
              setServiceModal((prev) => ({
                ...prev,
                service: { ...prev.service, description: e.target.value },
              }))
            }
            placeholder="End-to-end digital product design from initial concept through high-fidelity interactive prototypes..."
          />

          <IconPicker
            value={serviceModal.service.icon || 'Briefcase'}
            onChange={(iconName) =>
              setServiceModal((prev) => ({
                ...prev,
                service: { ...prev.service, icon: iconName },
              }))
            }
          />

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">Deliverables Scope Tags</label>
            <div className="flex items-center gap-2">
              <Input
                value={newDeliverableTag}
                onChange={(e) => setNewDeliverableTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeliverable();
                  }
                }}
                placeholder="Type deliverable (e.g. Design Systems)..."
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={() => handleAddDeliverable()}>
                Add Tag
              </Button>
            </div>

            {deliverablePresets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-muted">Suggestions:</span>
                {deliverablePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddDeliverable(preset)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border bg-background hover:bg-surface text-muted hover:text-foreground transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {(serviceModal.service.deliverables || []).map((tag, idx) => (
                <Badge key={idx} variant="neutral" className="gap-1.5 py-1">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(tag)}
                    className="text-muted hover:text-foreground"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Checkbox
            label="Service Visible in Commission Scope"
            checked={serviceModal.service.visible !== false}
            onChange={(e) =>
              setServiceModal((prev) => ({
                ...prev,
                service: { ...prev.service, visible: e.target.checked },
              }))
            }
          />

          <ModalFooter className="px-0 pb-0 pt-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setServiceModal({ isOpen: false, mode: 'create', service: {} })}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {serviceModal.mode === 'create' ? 'Create Service' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Page Header */}
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-background hover:bg-surface text-xs font-medium text-foreground transition-colors"
          >
            <span>Live Section</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Button
            variant="primary"
            onClick={handleOpenCreateService}
            icon={<Plus className="w-4 h-4" />}
          >
            New Service
          </Button>
        </div>
      </Card>

      {/* Editable Default Content Notice */}
      <Alert variant="info" title="Editable Default Services">
        Initial default service offerings (<span className="text-foreground font-semibold">Website Design</span>, <span className="text-foreground font-semibold">UI/UX Design</span>, <span className="text-foreground font-semibold">Web Design</span>, <span className="text-foreground font-semibold">Prototyping & Wireframing</span>) are editable defaults based on core disciplines. You can edit any service title, deliverables, icons, or add custom service offerings at any time.
      </Alert>

      {/* Filter & Search Bar */}
      <Card className="p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1">
            <Search
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search services by title, description, or deliverables..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-2">
            <Select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as any)}
              options={[
                { value: 'ALL', label: 'All Services' },
                { value: 'VISIBLE', label: 'Visible Only' },
                { value: 'HIDDEN', label: 'Hidden Only' },
              ]}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'order', label: 'Custom Order' },
                { value: 'title', label: 'Title A-Z' },
                { value: 'status', label: 'Visibility Status' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <Skeleton variant="card" className="h-32" />
          <Skeleton variant="card" className="h-32" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="error" title="Error Loading Services">
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No service offerings found"
          description="Try adjusting your search criteria or add a new service package."
          primaryAction={
            <Button variant="primary" onClick={handleOpenCreateService} icon={<Plus className="w-4 h-4" />}>
              Create First Service
            </Button>
          }
        />
      )}

      {/* Services List / Reorderable Cards */}
      <div className="space-y-4">
        {filteredServices.map((svc, index) => {
          const isDragging = draggedIndex === index;
          const isDropTarget = dragOverIndex === index;
          const deliverables = svc.deliverables || [];

          return (
            <Card
              key={svc.id}
              draggable={searchTerm === '' && visibilityFilter === 'ALL' && sortBy === 'order'}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`group p-6 space-y-4 transition-all shadow-xs ${
                isDragging
                  ? 'opacity-30 border-dashed border-[var(--color-border-strong)]'
                  : isDropTarget
                  ? 'border-[var(--color-border-strong)] ring-2 ring-foreground/20'
                  : 'hover:border-foreground/30'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-foreground px-2 py-0.5 rounded-md bg-background border border-border">
                    [{svc.number || String(index + 1).padStart(2, '0')}]
                  </span>

                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-foreground shrink-0">
                    <RenderLucideIcon name={svc.icon} className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg uppercase tracking-tight text-foreground">{svc.title}</h3>
                      {!svc.visible && (
                        <Badge variant="warning">Hidden</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<ArrowUp className="w-3.5 h-3.5" />}
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    aria-label="Move Service Up"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<ArrowDown className="w-3.5 h-3.5" />}
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === filteredServices.length - 1}
                    aria-label="Move Service Down"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={svc.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    onClick={() => toggleServiceVisibility(svc.id)}
                    aria-label={svc.visible ? 'Hide Service' : 'Show Service'}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenEditService(svc)}
                    aria-label="Edit Service"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => handleDuplicate(svc.id)}
                    aria-label="Duplicate Service"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => setDeleteModal(svc)}
                    aria-label="Delete Service"
                  />
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">{svc.description}</p>

              {/* Deliverables Scope Chips */}
              {deliverables.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {deliverables.map((item, idx) => (
                    <Badge key={idx} variant="neutral" className="font-mono text-[11px] tracking-wider uppercase">
                      {item}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesManager;
