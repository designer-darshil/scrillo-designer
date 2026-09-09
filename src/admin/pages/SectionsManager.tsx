import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Layers,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Undo2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Lock,
  FileText,
  Repeat,
  FolderGit2,
  Briefcase,
  Image as ImageIcon,
  Mail,
  Globe,
  Compass,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { SectionId, SectionSetting, SectionSettings } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { Button, Badge, Alert, Card, useToast } from '../../design-system';

const SECTION_METADATA: Record<
  SectionId,
  { name: string; description: string; icon: React.ComponentType<{ className?: string }> }
> = {
  hero: {
    name: 'Hero Showcase',
    description: 'Primary viewpoint headline, about eyebrow, folio archive metadata, and hero specimen media.',
    icon: Sparkles,
  },
  marquee: {
    name: 'Kinetic Marquee Strip',
    description: 'High-velocity typographic statement ribbon running seamlessly between sections.',
    icon: Repeat,
  },
  projects: {
    name: 'Selected Works (Projects)',
    description: 'Featured architectural portfolio case studies, interactive rows, and hover reveals.',
    icon: FolderGit2,
  },
  statement: {
    name: 'Creative Statement (About)',
    description: 'Triple-line editorial design manifesto with interactive core principles.',
    icon: FileText,
  },
  experience: {
    name: 'Career & Education Trajectory',
    description: 'Chronological timeline of product design roles, internships, and educational degrees.',
    icon: Compass,
  },
  skills: {
    name: 'Discipline & Skills Matrix',
    description: 'Categorized competencies across Design Systems, Frontend Architecture, and Strategy.',
    icon: Sparkles,
  },
  philosophy: {
    name: 'Design Philosophy & Metrics',
    description: 'Core design principles paired with verified production performance metrics.',
    icon: Sparkles,
  },
  services: {
    name: 'Capabilities & Deliverables',
    description: 'Available agency scopes, design audit offerings, and project deliverables.',
    icon: Briefcase,
  },
  image: {
    name: 'Experimental Specimen Showcase',
    description: 'Large-scale visual specimen with interactive parallax depth and caption details.',
    icon: ImageIcon,
  },
  contact: {
    name: 'Outreach & Contact CTA',
    description: 'Direct inquiry action area with email trigger, availability badge, and direct channels.',
    icon: Mail,
  },
  footer: {
    name: 'Terminal Footer Anchor',
    description: 'Structural footer with localized clock, copyright, index links, and return-to-top.',
    icon: Globe,
  },
};

interface SortableSectionItemProps {
  id: SectionId;
  section: SectionSetting;
  index: number;
  total: number;
  onToggleVisibility: (id: SectionId) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  id,
  section,
  index,
  total,
  onToggleVisibility,
  onMove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const meta = SECTION_METADATA[id] || {
    name: id,
    description: `Section ${id}`,
    icon: Layers,
  };

  const Icon = meta.icon;
  const isVisible = section.visible !== false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
        isDragging
          ? 'border-[var(--color-action-primary)] bg-[var(--color-background-elevated)] shadow-lg opacity-90'
          : isVisible
          ? 'border-[var(--color-border-default)] bg-[var(--color-background-secondary)] hover:border-[var(--color-border-strong)]'
          : 'border-[var(--color-border-subtle)] bg-[var(--color-background-primary)] opacity-60'
      }`}
    >
      {/* Left: Drag Handle, Order, and Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] cursor-grab active:cursor-grabbing transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-default)]"
          title="Drag to reorder section"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-text-primary)] shrink-0 shadow-xs">
          #{String(index + 1).padStart(2, '0')}
        </div>

        <div className="w-8 h-8 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)] shrink-0 hidden sm:flex">
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] truncate">{meta.name}</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hidden md:inline">
              ID: {id}
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">{meta.description}</p>
        </div>
      </div>

      {/* Right: Quick Move, Status Badge & Toggle Switch */}
      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
        {/* Quick move up/down */}
        <div className="flex items-center gap-1">
          <Button
            variant="icon"
            size="sm"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            aria-label="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
            aria-label="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Status Badge */}
        <Badge variant={isVisible ? 'success' : 'neutral'} size="sm" dot>
          {isVisible ? 'ACTIVE' : 'HIDDEN'}
        </Badge>

        {/* Visibility Button */}
        <Button
          variant="icon"
          size="sm"
          onClick={() => onToggleVisibility(id)}
          aria-label={isVisible ? 'Hide section from public site' : 'Show section on public site'}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

const ALL_SECTION_IDS: SectionId[] = [
  'hero', 'marquee', 'projects', 'statement', 'experience',
  'skills', 'philosophy', 'services', 'image', 'contact', 'footer',
];

const ALL_MAIN_SECTION_IDS: SectionId[] = ALL_SECTION_IDS.filter((id) => id !== 'footer');

export const SectionsManager: React.FC = () => {
  const { data, updateSettings } = useWebsiteData();
  const toast = useToast();

  const [sectionsState, setSectionsState] = useState<SectionSettings>({} as SectionSettings);
  const [orderedMainIds, setOrderedMainIds] = useState<SectionId[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useUnsavedChanges(isDirty);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (data.settings?.sections) {
      const merged: SectionSettings = { ...(data.settings.sections as SectionSettings) };
      for (const id of ALL_SECTION_IDS) {
        if (!merged[id]) {
          merged[id] = {
            id,
            name: SECTION_METADATA[id]?.name || id,
            visible: true,
            order: (defaultWebsiteData.settings.sections as any)?.[id]?.order ?? 99,
          };
        }
      }
      setSectionsState(merged);
      const mainIds = ALL_MAIN_SECTION_IDS
        .slice()
        .sort((a, b) => (merged[a]?.order ?? 0) - (merged[b]?.order ?? 0));
      setOrderedMainIds(mainIds);
    }
  }, [data.settings?.sections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedMainIds.indexOf(active.id as SectionId);
      const newIndex = orderedMainIds.indexOf(over.id as SectionId);
      const newOrder = arrayMove(orderedMainIds, oldIndex, newIndex);
      setOrderedMainIds(newOrder);

      const updatedSections: SectionSettings = { ...sectionsState };
      newOrder.forEach((id, index) => {
        if (updatedSections[id]) {
          updatedSections[id] = { ...updatedSections[id], order: index + 1 };
        }
      });
      if (updatedSections.footer) {
        updatedSections.footer = { ...updatedSections.footer, order: 10 };
      }

      setSectionsState(updatedSections);
      setIsDirty(true);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedMainIds.length) return;

    const newOrder = arrayMove(orderedMainIds, index, targetIndex);
    setOrderedMainIds(newOrder);

    const updatedSections: SectionSettings = { ...sectionsState };
    newOrder.forEach((id, idx) => {
      if (updatedSections[id]) {
        updatedSections[id] = { ...updatedSections[id], order: idx + 1 };
      }
    });
    if (updatedSections.footer) {
      updatedSections.footer = { ...updatedSections.footer, order: 10 };
    }

    setSectionsState(updatedSections);
    setIsDirty(true);
  };

  const handleToggleVisibility = (id: SectionId) => {
    const current = sectionsState[id]?.visible !== false;
    const updatedSections: SectionSettings = {
      ...sectionsState,
      [id]: {
        ...sectionsState[id],
        visible: !current,
      },
    };
    setSectionsState(updatedSections);
    setIsDirty(true);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the default section layout and visibility hierarchy?'
      )
    ) {
      const defaults = defaultWebsiteData.settings.sections as SectionSettings;
      setSectionsState(defaults);
      const mainIds = ALL_MAIN_SECTION_IDS
        .slice()
        .sort((a, b) => (defaults[a]?.order ?? 0) - (defaults[b]?.order ?? 0));
      setOrderedMainIds(mainIds);
      setIsDirty(true);
    }
  };

  const handleCancel = () => {
    if (data.settings?.sections) {
      const merged: SectionSettings = { ...(data.settings.sections as SectionSettings) };
      for (const id of ALL_SECTION_IDS) {
        if (!merged[id]) {
          merged[id] = {
            id,
            name: SECTION_METADATA[id]?.name || id,
            visible: true,
            order: (defaultWebsiteData.settings.sections as any)?.[id]?.order ?? 99,
          };
        }
      }
      setSectionsState(merged);
      const mainIds = ALL_MAIN_SECTION_IDS
        .slice()
        .sort((a, b) => (merged[a]?.order ?? 0) - (merged[b]?.order ?? 0));
      setOrderedMainIds(mainIds);
      setIsDirty(false);
      setStatus('idle');
      setErrorMessage(null);
    }
  };

  const handleSaveLayout = async () => {
    if (status === 'saving') return;
    setStatus('saving');
    setErrorMessage(null);

    try {
      const updatedSettings = {
        ...data.settings,
        sections: sectionsState,
      };

      const success = await updateSettings(updatedSettings);
      if (success) {
        setStatus('saved');
        setIsDirty(false);
        toast.success('Homepage section layout saved successfully!');
        setTimeout(() => setStatus('idle'), 3500);
      } else {
        setStatus('error');
        setErrorMessage('Failed to persist section layout. Please try again.');
        toast.error('Failed to persist section layout.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(validators.formatFriendlyError(err));
      toast.error('Error occurred while saving layout.');
    }
  };

  const footerSection = sectionsState.footer || {
    id: 'footer',
    name: 'Footer',
    visible: true,
    order: 10,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner / Breadcrumbs & Action Controls */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">Admin Content CMS</span>
            <span className="text-xs text-[var(--color-text-tertiary)]">/</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-primary)] font-mono">
              HOMEPAGE SECTION ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[var(--color-text-primary)]" />
            <span>Homepage Section Management</span>
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Reorder page flow, toggle section visibility, and configure public presentation hierarchy.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetDefaults}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Restore Factory Default Layout"
          >
            <span className="hidden md:inline">Defaults</span>
          </Button>

          {isDirty && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              icon={<Undo2 className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveLayout}
            disabled={status === 'saving' || !isDirty}
            loading={status === 'saving'}
            loadingText="Saving..."
            icon={<Save className="w-4 h-4" />}
          >
            Save Layout
          </Button>
        </div>
      </Card>

      {/* Reorderable Section List Container */}
      <Card className="space-y-6">
        <div className="border-b border-[var(--color-border-default)] pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Main Body Sections ({orderedMainIds.length})</span>
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              Drag items by their grip handle to reorder. Toggle the eye icon to enable or disable public rendering.
            </p>
          </div>
          <Badge variant="neutral" size="sm">
            {orderedMainIds.filter((id) => sectionsState[id]?.visible !== false).length} Active
          </Badge>
        </div>

        {/* DND Context & Sortable List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedMainIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {orderedMainIds.map((id, index) => {
                const sec = sectionsState[id] || { id, name: id, visible: true, order: index + 1 };
                return (
                  <SortableSectionItem
                    key={id}
                    id={id}
                    section={sec}
                    index={index}
                    total={orderedMainIds.length}
                    onToggleVisibility={handleToggleVisibility}
                    onMove={handleMove}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </Card>

      {/* Structural Terminal Section: Footer (Pinned) */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Terminal Boundary Section (Pinned)
            </h3>
          </div>
          <Badge variant="neutral" size="sm">
            STRUCTURAL ANCHOR
          </Badge>
        </div>

        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
            footerSection.visible !== false
              ? 'border-[var(--color-border-default)] bg-[var(--color-background-secondary)]'
              : 'border-[var(--color-border-subtle)] bg-[var(--color-background-primary)] opacity-60'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] opacity-40 shrink-0">
              <Lock className="w-4 h-4" />
            </div>

            <div className="w-8 h-8 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-text-tertiary)] shrink-0 shadow-xs">
              #END
            </div>

            <div className="w-8 h-8 rounded-lg bg-[var(--color-background-primary)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)] shrink-0 hidden sm:flex">
              <Globe className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] truncate">
                  {SECTION_METADATA.footer.name}
                </h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[var(--color-background-primary)] border border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hidden md:inline">
                  ID: footer
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">
                {SECTION_METADATA.footer.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <Badge variant={footerSection.visible !== false ? 'success' : 'neutral'} size="sm" dot>
              {footerSection.visible !== false ? 'ACTIVE' : 'HIDDEN'}
            </Badge>

            <Button
              variant="icon"
              size="sm"
              onClick={() => handleToggleVisibility('footer')}
              aria-label={footerSection.visible !== false ? 'Hide Footer' : 'Show Footer'}
            >
              {footerSection.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SectionsManager;
