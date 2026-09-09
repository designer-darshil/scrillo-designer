import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Copy,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
  Save,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { SkillCategory, SkillItem } from '../../types';
import { MediaPickerModal } from '../components/MediaPickerModal';
import { validators } from '../utils/validators';
import {
  Button,
  Input,
  Textarea,
  Toggle,
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
  useToast,
} from '../../design-system';

export const SkillsManager: React.FC = () => {
  const {
    data,
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    duplicateSkillCategory,
    reorderSkillCategories,
    toggleSkillCategoryVisibility,
    addSkillItem,
    updateSkillItem,
    deleteSkillItem,
    reorderSkillItems,
    toggleSkillVisibility,
  } = useWebsiteData();

  // Expanded categories state (all open by default for fast editing)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Category Modal state
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    category: Partial<SkillCategory>;
  }>({
    isOpen: false,
    mode: 'create',
    category: {},
  });

  // Skill Item Modal state
  const [skillModal, setSkillModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    categoryId: string;
    skillIndex?: number;
    skill: Partial<SkillItem>;
  }>({
    isOpen: false,
    mode: 'create',
    categoryId: '',
    skill: {},
  });

  // Delete Confirmation Modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'category' | 'skill';
    categoryId: string;
    skillIndex?: number;
    title: string;
  } | null>(null);

  // Media Picker Modal state for skill image
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Drag and Drop for Categories
  const [draggedCatIndex, setDraggedCatIndex] = useState<number | null>(null);
  const [dragOverCatIndex, setDragOverCatIndex] = useState<number | null>(null);

  // Drag and Drop for Skills inside a Category
  const [draggedSkillData, setDraggedSkillData] = useState<{ categoryId: string; index: number } | null>(null);
  const [dragOverSkillData, setDragOverSkillData] = useState<{ categoryId: string; index: number } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const sortedCategories = useMemo(() => {
    return [...data.skills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [data.skills]);

  // Toggle category expansion
  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: prev[catId] === undefined ? false : !prev[catId],
    }));
  };

  const isExpanded = (catId: string) => {
    return expandedCategories[catId] !== false; // default expanded
  };

  // --- Category CRUD Handlers ---
  const handleOpenCreateCategory = () => {
    const nextOrder = data.skills.length + 1;
    setCategoryModal({
      isOpen: true,
      mode: 'create',
      category: {
        title: '',
        number: String(nextOrder).padStart(2, '0'),
        description: '',
        visible: true,
        order: nextOrder,
        items: [],
      },
    });
  };

  const handleOpenEditCategory = (cat: SkillCategory) => {
    setCategoryModal({
      isOpen: true,
      mode: 'edit',
      category: { ...cat },
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categoryModal.category;

    const titleCheck = validators.required(cat.title, 'Category Title');
    if (!titleCheck.isValid) {
      showToast(titleCheck.error || 'Category title is required.');
      return;
    }

    if (cat.order !== undefined) {
      const orderCheck = validators.order(cat.order, 'Category Order');
      if (!orderCheck.isValid) {
        showToast(orderCheck.error || 'Invalid category order.');
        return;
      }
    }

    try {
      if (categoryModal.mode === 'create') {
        const created = await createSkillCategory({
          title: cat.title!.trim().toUpperCase(),
          number: cat.number || String(data.skills.length + 1).padStart(2, '0'),
          description: cat.description || '',
          visible: cat.visible ?? true,
          order: cat.order || data.skills.length + 1,
          items: cat.items || [],
        });
        if (created) {
          showToast(`Category "${created.title}" created.`);
          setCategoryModal({ isOpen: false, mode: 'create', category: {} });
        }
      } else if (categoryModal.mode === 'edit' && cat.id) {
        const success = await updateSkillCategory(cat.id, {
          title: cat.title!.trim().toUpperCase(),
          number: cat.number,
          description: cat.description,
          visible: cat.visible,
        });
        if (success) {
          showToast(`Category "${cat.title}" updated.`);
          setCategoryModal({ isOpen: false, mode: 'create', category: {} });
        }
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
  };

  const handleDuplicateCategory = async (catId: string) => {
    try {
      const cloned = await duplicateSkillCategory(catId);
      if (cloned) {
        showToast(`Duplicated category "${cloned.title}".`);
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;

    try {
      if (deleteModal.type === 'category') {
        const success = await deleteSkillCategory(deleteModal.categoryId);
        if (success) {
          showToast(`Deleted category "${deleteModal.title}".`);
        }
      } else if (deleteModal.type === 'skill' && deleteModal.skillIndex !== undefined) {
        const success = await deleteSkillItem(deleteModal.categoryId, deleteModal.skillIndex);
        if (success) {
          showToast(`Deleted skill "${deleteModal.title}".`);
        }
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
    setDeleteModal(null);
  };

  // --- Skill Item CRUD Handlers ---
  const handleOpenAddSkill = (categoryId: string) => {
    const cat = data.skills.find((c) => c.id === categoryId);
    const currentLength = (cat?.items || cat?.skills || []).length;
    setSkillModal({
      isOpen: true,
      mode: 'create',
      categoryId,
      skill: {
        name: '',
        title: '',
        index: String(currentLength + 1).padStart(2, '0'),
        description: '',
        visible: true,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      },
    });
  };

  const handleOpenEditSkill = (categoryId: string, skillIndex: number, skill: SkillItem) => {
    setSkillModal({
      isOpen: true,
      mode: 'edit',
      categoryId,
      skillIndex,
      skill: {
        ...skill,
        name: skill.name || skill.title || '',
        title: skill.title || skill.name || '',
      },
    });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const { categoryId, mode, skillIndex, skill } = skillModal;
    const skillName = skill.name?.trim() || skill.title?.trim();

    const nameCheck = validators.required(skillName, 'Skill Title');
    if (!nameCheck.isValid) {
      showToast(nameCheck.error || 'Skill title is required.');
      return;
    }

    if (skill.image) {
      const imgCheck = validators.url(skill.image, true, 'Skill Preview Image');
      if (!imgCheck.isValid) {
        showToast(imgCheck.error || 'Unsafe skill image URL.');
        return;
      }
    }

    try {
      if (mode === 'create') {
        const success = await addSkillItem(categoryId, {
          name: skillName!,
          title: skillName!,
          description: skill.description || '',
          image: skill.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          visible: skill.visible ?? true,
        });
        if (success) {
          showToast(`Skill "${skillName}" added.`);
          setSkillModal({ isOpen: false, mode: 'create', categoryId: '', skill: {} });
        }
      } else if (mode === 'edit' && skillIndex !== undefined) {
        const success = await updateSkillItem(categoryId, skillIndex, {
          name: skillName!,
          title: skillName!,
          description: skill.description,
          image: skill.image,
          visible: skill.visible,
        });
        if (success) {
          showToast(`Skill "${skillName}" updated.`);
          setSkillModal({ isOpen: false, mode: 'create', categoryId: '', skill: {} });
        }
      }
    } catch (err: any) {
      showToast(validators.formatFriendlyError(err));
    }
  };
  // --- Category Drag & Drop ---
  const handleCategoryDragStart = (index: number) => {
    setDraggedCatIndex(index);
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCatIndex === null || draggedCatIndex === index) return;
    setDragOverCatIndex(index);
  };

  const handleCategoryDrop = async (targetIndex: number) => {
    if (draggedCatIndex === null || draggedCatIndex === targetIndex) {
      setDraggedCatIndex(null);
      setDragOverCatIndex(null);
      return;
    }

    const items = [...sortedCategories];
    const [moved] = items.splice(draggedCatIndex, 1);
    items.splice(targetIndex, 0, moved);

    setDraggedCatIndex(null);
    setDragOverCatIndex(null);

    const success = await reorderSkillCategories(items.map((c) => c.id));
    if (success) {
      showToast('Category ordering updated.');
    }
  };

  const handleMoveCategoryOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedCategories.length) return;

    const items = [...sortedCategories];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const success = await reorderSkillCategories(items.map((c) => c.id));
    if (success) {
      showToast('Category ordering updated.');
    }
  };

  // --- Skill Item Drag & Drop ---
  const handleSkillDragStart = (categoryId: string, index: number) => {
    setDraggedSkillData({ categoryId, index });
  };

  const handleSkillDragOver = (e: React.DragEvent, categoryId: string, index: number) => {
    e.preventDefault();
    if (!draggedSkillData || draggedSkillData.categoryId !== categoryId || draggedSkillData.index === index) return;
    setDragOverSkillData({ categoryId, index });
  };

  const handleSkillDrop = async (categoryId: string, targetIndex: number) => {
    if (!draggedSkillData || draggedSkillData.categoryId !== categoryId || draggedSkillData.index === targetIndex) {
      setDraggedSkillData(null);
      setDragOverSkillData(null);
      return;
    }

    const cat = data.skills.find((c) => c.id === categoryId);
    if (!cat) return;

    const items = [...(cat.items || cat.skills || [])];
    const [moved] = items.splice(draggedSkillData.index, 1);
    items.splice(targetIndex, 0, moved);

    setDraggedSkillData(null);
    setDragOverSkillData(null);

    const success = await reorderSkillItems(categoryId, items);
    if (success) {
      showToast('Skill ordering updated.');
    }
  };

  const handleMoveSkillOrder = async (categoryId: string, index: number, direction: 'up' | 'down') => {
    const cat = data.skills.find((c) => c.id === categoryId);
    if (!cat) return;

    const items = [...(cat.items || cat.skills || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const success = await reorderSkillItems(categoryId, items);
    if (success) {
      showToast('Skill order updated.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setSkillModal((prev) => ({
            ...prev,
            skill: { ...prev.skill, image: url },
          }));
        }}
        title="Select Skill Visual Preview Asset"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        title={`Confirm ${deleteModal?.type === 'category' ? 'Category' : 'Skill'} Deletion`}
        size="sm"
      >
        <div className="space-y-4">
          <Alert variant="error" title="Irreversible Action">
            {deleteModal?.type === 'category'
              ? 'All skills nested in this category will be permanently removed from your portfolio.'
              : 'This skill discipline will be removed from your public capabilities matrix.'}
          </Alert>

          <div className="p-3.5 rounded-xl bg-background border border-border text-xs">
            <span className="text-muted">Target Item: </span>
            <span className="font-bold text-foreground uppercase">{deleteModal?.title}</span>
          </div>

          <ModalFooter className="px-0 pb-0">
            <Button variant="secondary" onClick={() => setDeleteModal(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Item
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, mode: 'create', category: {} })}
        title={categoryModal.mode === 'create' ? 'Create Skill Category' : 'Edit Skill Category'}
        size="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Category Title *"
                required
                value={categoryModal.category.title || ''}
                onChange={(e) =>
                  setCategoryModal((prev) => ({
                    ...prev,
                    category: { ...prev.category, title: e.target.value.toUpperCase() },
                  }))
                }
                placeholder="e.g. UI DESIGN"
              />
            </div>
            <div>
              <Input
                label="Number Index"
                value={categoryModal.category.number || ''}
                onChange={(e) =>
                  setCategoryModal((prev) => ({
                    ...prev,
                    category: { ...prev.category, number: e.target.value },
                  }))
                }
                placeholder="e.g. 01"
              />
            </div>
          </div>

          <Textarea
            label="Description & Narrative"
            rows={3}
            value={categoryModal.category.description || ''}
            onChange={(e) =>
              setCategoryModal((prev) => ({
                ...prev,
                category: { ...prev.category, description: e.target.value },
              }))
            }
            placeholder="Precision typography, mathematical spatial scales, design tokens..."
          />

          <Checkbox
            label="Category Visible on Public Website"
            checked={categoryModal.category.visible !== false}
            onChange={(e) =>
              setCategoryModal((prev) => ({
                ...prev,
                category: { ...prev.category, visible: e.target.checked },
              }))
            }
          />

          <ModalFooter className="px-0 pb-0 pt-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setCategoryModal({ isOpen: false, mode: 'create', category: {} })}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {categoryModal.mode === 'create' ? 'Create Category' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Skill Item Create/Edit Modal */}
      <Modal
        isOpen={skillModal.isOpen}
        onClose={() => setSkillModal({ isOpen: false, mode: 'create', categoryId: '', skill: {} })}
        title={skillModal.mode === 'create' ? 'Add Skill Discipline' : 'Edit Skill Discipline'}
        size="md"
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <Input
            label="Discipline Title *"
            required
            value={skillModal.skill.name || skillModal.skill.title || ''}
            onChange={(e) =>
              setSkillModal((prev) => ({
                ...prev,
                skill: { ...prev.skill, name: e.target.value, title: e.target.value },
              }))
            }
            placeholder="e.g. Visual Direction"
          />

          <Textarea
            label="Description (Optional)"
            rows={2}
            value={skillModal.skill.description || ''}
            onChange={(e) =>
              setSkillModal((prev) => ({
                ...prev,
                skill: { ...prev.skill, description: e.target.value },
              }))
            }
            placeholder="Editorial typography, mathematical layouts..."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">
                Hover Visual Preview Asset
              </label>
              <Button
                variant="text"
                size="sm"
                type="button"
                onClick={() => setMediaPickerOpen(true)}
              >
                Pick from Media Library
              </Button>
            </div>
            <Input
              value={skillModal.skill.image || ''}
              onChange={(e) =>
                setSkillModal((prev) => ({
                  ...prev,
                  skill: { ...prev.skill, image: e.target.value },
                }))
              }
              placeholder="https://images.unsplash.com/..."
            />

            {skillModal.skill.image && (
              <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden border border-border mt-2">
                <img
                  src={skillModal.skill.image}
                  alt="Preview"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
            )}
          </div>

          <Checkbox
            label="Skill Visible in Category"
            checked={skillModal.skill.visible !== false}
            onChange={(e) =>
              setSkillModal((prev) => ({
                ...prev,
                skill: { ...prev.skill, visible: e.target.checked },
              }))
            }
          />

          <ModalFooter className="px-0 pb-0 pt-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setSkillModal({ isOpen: false, mode: 'create', categoryId: '', skill: {} })}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {skillModal.mode === 'create' ? 'Add Skill' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Header Bar */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Section 03 / Discipline & Capabilities Matrix
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Skills & Capabilities Manager
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            Configure skill categories, reorder clusters and disciplines, toggle visibility, and assign visual specimens.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/#skills"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-surface text-xs font-medium text-foreground transition-colors"
          >
            <span>Live Section</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateCategory}
          >
            New Category
          </Button>
        </div>
      </div>

      {/* Category List & Nested Skills */}
      <div className="space-y-6">
        {sortedCategories.map((cat, catIndex) => {
          const items = cat.items || cat.skills || [];
          const isCatDragging = draggedCatIndex === catIndex;
          const isCatDropTarget = dragOverCatIndex === catIndex;
          const expanded = isExpanded(cat.id);

          return (
            <div
              key={cat.id}
              draggable
              onDragStart={() => handleCategoryDragStart(catIndex)}
              onDragOver={(e) => handleCategoryDragOver(e, catIndex)}
              onDrop={() => handleCategoryDrop(catIndex)}
              onDragEnd={() => {
                setDraggedCatIndex(null);
                setDragOverCatIndex(null);
              }}
              className={`rounded-2xl border bg-surface overflow-hidden transition-all shadow-xs ${
                isCatDragging
                  ? 'opacity-30 border-dashed border-foreground'
                  : isCatDropTarget
                  ? 'border-foreground ring-2 ring-foreground/20'
                  : 'border-border'
              }`}
            >
              {/* Category Header Row */}
              <div className="p-5 sm:p-6 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {/* Category Drag Handle */}
                  <button
                    type="button"
                    className="cursor-grab active:cursor-grabbing text-muted hover:text-foreground p-1 rounded hover:bg-background transition-colors min-w-[32px] min-h-[32px] inline-flex items-center justify-center"
                    title="Drag to reorder category"
                    aria-label="Drag to reorder category"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-xs font-bold text-foreground px-2 py-0.5 rounded-md bg-background border border-border">
                    [{cat.number || String(catIndex + 1).padStart(2, '0')}]
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg uppercase tracking-tight text-foreground">
                        {cat.title}
                      </h3>
                      <span className="font-mono text-[11px] text-muted">
                        ({items.length} {items.length === 1 ? 'item' : 'items'})
                      </span>
                      {!cat.visible && (
                        <Badge variant="warning" size="sm">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-muted mt-0.5 line-clamp-1 max-w-xl">{cat.description}</p>
                    )}
                  </div>
                </div>

                {/* Category Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Category Reorder Buttons */}
                  <Button
                    variant="icon"
                    size="xs"
                    type="button"
                    onClick={() => handleMoveCategoryOrder(catIndex, 'up')}
                    disabled={catIndex === 0}
                    aria-label="Move Category Up"
                    title="Move Category Up"
                    icon={<ArrowUp className="w-3.5 h-3.5" />}
                  />
                  <Button
                    variant="icon"
                    size="xs"
                    type="button"
                    onClick={() => handleMoveCategoryOrder(catIndex, 'down')}
                    disabled={catIndex === sortedCategories.length - 1}
                    aria-label="Move Category Down"
                    title="Move Category Down"
                    icon={<ArrowDown className="w-3.5 h-3.5" />}
                  />

                  {/* Toggle Visibility */}
                  <Button
                    variant={cat.visible ? 'icon' : 'outline'}
                    size="xs"
                    type="button"
                    onClick={() => toggleSkillCategoryVisibility(cat.id)}
                    className={!cat.visible ? 'border-status-warning-border bg-status-warning-bg text-status-warning' : ''}
                    aria-label={cat.visible ? 'Hide Category' : 'Show Category'}
                    title={cat.visible ? 'Hide Category' : 'Show Category'}
                    icon={cat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  />

                  {/* Add Skill Button */}
                  <Button
                    variant="primary"
                    size="xs"
                    type="button"
                    onClick={() => handleOpenAddSkill(cat.id)}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Skill
                  </Button>

                  {/* Edit Category */}
                  <Button
                    variant="icon"
                    size="xs"
                    type="button"
                    onClick={() => handleOpenEditCategory(cat)}
                    aria-label="Edit Category Details"
                    title="Edit Category Details"
                    icon={<Edit className="w-3.5 h-3.5" />}
                  />

                  {/* Duplicate Category */}
                  <Button
                    variant="icon"
                    size="xs"
                    type="button"
                    onClick={() => handleDuplicateCategory(cat.id)}
                    aria-label="Duplicate Category"
                    title="Duplicate Category"
                    icon={<Copy className="w-3.5 h-3.5" />}
                  />

                  {/* Delete Category */}
                  <Button
                    variant="destructive"
                    size="xs"
                    type="button"
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'category',
                        categoryId: cat.id,
                        title: cat.title,
                      })
                    }
                    aria-label="Delete Category"
                    title="Delete Category"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                  />

                  {/* Accordion Expand/Collapse */}
                  <Button
                    variant="icon"
                    size="xs"
                    type="button"
                    onClick={() => toggleExpand(cat.id)}
                    aria-label={expanded ? 'Collapse Skills Panel' : 'Expand Skills Panel'}
                    title={expanded ? 'Collapse Skills Panel' : 'Expand Skills Panel'}
                    icon={expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  />
                </div>
              </div>

              {/* Nested Skills List */}
              {expanded && (
                <div className="p-4 sm:p-6 bg-background/50 space-y-3">
                  {items.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-border text-xs text-muted space-y-2">
                      <p>No skills configured in this category.</p>
                      <Button
                        variant="secondary"
                        size="xs"
                        type="button"
                        onClick={() => handleOpenAddSkill(cat.id)}
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add first skill
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((rawSkill, skillIdx) => {
                        const skill: SkillItem =
                          typeof rawSkill === 'string'
                            ? {
                                index: String(skillIdx + 1).padStart(2, '0'),
                                name: rawSkill,
                                title: rawSkill,
                                visible: true,
                              }
                            : {
                                ...rawSkill,
                                index: rawSkill.index || String(skillIdx + 1).padStart(2, '0'),
                                name: rawSkill.name || rawSkill.title || '',
                                title: rawSkill.title || rawSkill.name || '',
                              };

                        const isSkillDragging =
                          draggedSkillData?.categoryId === cat.id && draggedSkillData.index === skillIdx;
                        const isSkillDropTarget =
                          dragOverSkillData?.categoryId === cat.id && dragOverSkillData.index === skillIdx;

                        return (
                          <div
                            key={`${cat.id}-${skillIdx}-${skill.name}`}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleSkillDragStart(cat.id, skillIdx);
                            }}
                            onDragOver={(e) => {
                              e.stopPropagation();
                              handleSkillDragOver(e, cat.id, skillIdx);
                            }}
                            onDrop={(e) => {
                              e.stopPropagation();
                              handleSkillDrop(cat.id, skillIdx);
                            }}
                            onDragEnd={(e) => {
                              e.stopPropagation();
                              setDraggedSkillData(null);
                              setDragOverSkillData(null);
                            }}
                            className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-surface transition-all ${
                              isSkillDragging
                                ? 'opacity-30 border-dashed border-foreground'
                                : isSkillDropTarget
                                ? 'border-foreground ring-2 ring-foreground/20'
                                : 'border-border hover:border-foreground/30'
                            }`}
                          >
                            {/* Drag & Number & Info */}
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                type="button"
                                className="cursor-grab active:cursor-grabbing text-muted group-hover:text-foreground p-1 rounded hover:bg-background transition-colors shrink-0 min-w-[28px] min-h-[28px] inline-flex items-center justify-center"
                                title="Drag to reorder skill"
                                aria-label="Drag to reorder skill"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </button>

                              <span className="font-mono text-xs text-muted w-6 shrink-0">
                                {skill.index || String(skillIdx + 1).padStart(2, '0')}
                              </span>

                              {/* Hover Thumbnail preview */}
                              {skill.image && (
                                <div className="w-8 h-6 rounded-md overflow-hidden border border-border bg-background shrink-0">
                                  <img
                                    src={skill.image}
                                    alt={skill.name}
                                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all"
                                  />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs text-foreground truncate">{skill.name}</span>
                                  {skill.visible === false && (
                                    <Badge variant="warning" size="sm">
                                      Hidden
                                    </Badge>
                                  )}
                                </div>
                                {skill.description && (
                                  <p className="text-[11px] text-muted line-clamp-1">{skill.description}</p>
                                )}
                              </div>
                            </div>

                            {/* Skill Action Buttons */}
                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                              {/* Move Up */}
                              <Button
                                variant="icon"
                                size="xs"
                                type="button"
                                onClick={() => handleMoveSkillOrder(cat.id, skillIdx, 'up')}
                                disabled={skillIdx === 0}
                                aria-label="Move Up"
                                title="Move Up"
                                icon={<ArrowUp className="w-3 h-3" />}
                              />

                              {/* Move Down */}
                              <Button
                                variant="icon"
                                size="xs"
                                type="button"
                                onClick={() => handleMoveSkillOrder(cat.id, skillIdx, 'down')}
                                disabled={skillIdx === items.length - 1}
                                aria-label="Move Down"
                                title="Move Down"
                                icon={<ArrowDown className="w-3 h-3" />}
                              />

                              {/* Toggle Visibility */}
                              <Button
                                variant={skill.visible !== false ? 'icon' : 'outline'}
                                size="xs"
                                type="button"
                                onClick={() => toggleSkillVisibility(cat.id, skillIdx)}
                                className={skill.visible === false ? 'border-status-warning-border bg-status-warning-bg text-status-warning' : ''}
                                aria-label={skill.visible !== false ? 'Hide Skill' : 'Show Skill'}
                                title={skill.visible !== false ? 'Hide Skill' : 'Show Skill'}
                                icon={skill.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              />

                              {/* Edit Skill */}
                              <Button
                                variant="icon"
                                size="xs"
                                type="button"
                                onClick={() => handleOpenEditSkill(cat.id, skillIdx, skill)}
                                aria-label="Edit Skill"
                                title="Edit Skill"
                                icon={<Edit className="w-3 h-3" />}
                              />

                              {/* Delete Skill */}
                              <Button
                                variant="destructive"
                                size="xs"
                                type="button"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    type: 'skill',
                                    categoryId: cat.id,
                                    skillIndex: skillIdx,
                                    title: skill.name,
                                  })
                                }
                                aria-label="Delete Skill"
                                title="Delete Skill"
                                icon={<Trash2 className="w-3 h-3" />}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Add Button Bar inside Category */}
                  <div className="pt-2 flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="xs"
                      type="button"
                      onClick={() => handleOpenAddSkill(cat.id)}
                      icon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add new discipline to {cat.title}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsManager;
