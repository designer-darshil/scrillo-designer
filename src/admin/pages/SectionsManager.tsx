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
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Lock,
  Compass,
  FileText,
  Repeat,
  FolderGit2,
  Briefcase,
  Image as ImageIcon,
  Mail,
  Globe,
} from 'lucide-react';
import { useWebsiteData } from '../../hooks/useWebsiteData';
import { SectionId, SectionSetting, SectionSettings } from '../../types';
import { defaultWebsiteData } from '../../data/defaultWebsiteData';
import { validators } from '../utils/validators';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

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
  skills: {
    name: 'Discipline & Skills Matrix',
    description: 'Categorized competencies with numeric index counters and hover imagery previews.',
    icon: Sparkles,
  },
  philosophy: {
    name: 'Design Philosophy Thesis',
    description: 'Large-scale typographic thesis statements and attributions.',
    icon: Compass,
  },
  services: {
    name: 'Services Scope',
    description: 'Service offerings, custom deliverable badges, and Lucide iconography.',
    icon: Briefcase,
  },
  image: {
    name: 'Experimental Visual Study Break',
    description: 'Full-bleed monochrome image specimen visual break.',
    icon: ImageIcon,
  },
  contact: {
    name: 'Contact CTA Collaboration',
    description: 'Massive headline climax, magnetic action button, and availability status pulse.',
    icon: Mail,
  },
  footer: {
    name: 'Editorial Footer (Terminal Section)',
    description: '4-column editorial grid, live social directory, inquiry channels, and brand signature.',
    icon: Globe,
  },
};

// Sortable Item Component
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
    name: section.name || id,
    description: 'Portfolio page section',
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
          ? 'border-foreground shadow-2xl bg-surface ring-2 ring-foreground/20 opacity-95'
          : isVisible
          ? 'border-border bg-background hover:border-foreground/40'
          : 'border-border/40 bg-background/40 opacity-50'
      }`}
    >
      {/* Left: Drag Handle, Order, and Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface cursor-grab active:cursor-grabbing transition-colors shrink-0"
          title="Drag to reorder section"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center font-mono text-xs font-bold text-foreground shrink-0 shadow-xs">
          #{String(index + 1).padStart(2, '0')}
        </div>

        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-foreground shrink-0 hidden sm:flex">
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground truncate">{meta.name}</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-surface border border-border text-muted hidden md:inline">
              ID: {id}
            </span>
          </div>
          <p className="text-[11px] text-muted truncate max-w-md">{meta.description}</p>
        </div>
      </div>

      {/* Right: Quick Move, Status Badge & Toggle Switch */}
      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
        {/* Quick move up/down */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
            isVisible
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
          }`}
        >
          {isVisible ? 'ACTIVE' : 'HIDDEN'}
        </span>

        {/* Visibility Button */}
        <button
          type="button"
          onClick={() => onToggleVisibility(id)}
          className={`p-2 rounded-xl border transition-all ${
            isVisible
              ? 'border-border bg-surface text-foreground hover:bg-background'
              : 'border-border/60 bg-background text-muted hover:text-foreground'
          }`}
          title={isVisible ? 'Hide section from public site' : 'Show section on public site'}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export const SectionsManager: React.FC = () => {
  const { data, updateSettings } = useWebsiteData();

  // Local reorderable list of section IDs (excluding footer which is pinned)
  const [orderedMainIds, setOrderedMainIds] = useState<SectionId[]>([]);
  const [sectionsState, setSectionsState] = useState<SectionSettings>(data.settings.sections);

  // Status & feedback
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Prevent accidental loss of unsaved changes
  useUnsavedChanges(isDirty);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync state from global data
  useEffect(() => {
    if (data.settings?.sections) {
      const currentSections = data.settings.sections;
      setSectionsState(currentSections);

      // Extract main reorderable IDs sorted by order
      const mainIds = (Object.keys(currentSections) as SectionId[])
        .filter((id) => id !== 'footer')
        .sort((a, b) => (currentSections[a]?.order ?? 0) - (currentSections[b]?.order ?? 0));

      setOrderedMainIds(mainIds);
      setIsDirty(false);
    }
  }, [data.settings]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (status === 'saved' || status === 'error') setStatus('idle');
  };

  // Drag End handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedMainIds.indexOf(active.id as SectionId);
    const newIndex = orderedMainIds.indexOf(over.id as SectionId);

    if (oldIndex !== -1 && newIndex !== -1) {
      markDirty();
      const nextOrderedIds = arrayMove(orderedMainIds, oldIndex, newIndex);
      setOrderedMainIds(nextOrderedIds);

      // Re-assign sequence orders
      const updatedSections: SectionSettings = { ...sectionsState };
      nextOrderedIds.forEach((id, idx) => {
        if (updatedSections[id]) {
          updatedSections[id] = { ...updatedSections[id], order: idx + 1 };
        }
      });
      if (updatedSections.footer) {
        updatedSections.footer = { ...updatedSections.footer, order: nextOrderedIds.length + 1 };
      }
      setSectionsState(updatedSections);
    }
  };

  // Move Up/Down button handler
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedMainIds.length) return;

    markDirty();
    const nextOrderedIds = arrayMove(orderedMainIds, index, targetIndex);
    setOrderedMainIds(nextOrderedIds);

    const updatedSections: SectionSettings = { ...sectionsState };
    nextOrderedIds.forEach((id, idx) => {
      if (updatedSections[id]) {
        updatedSections[id] = { ...updatedSections[id], order: idx + 1 };
      }
    });
    if (updatedSections.footer) {
      updatedSections.footer = { ...updatedSections.footer, order: nextOrderedIds.length + 1 };
    }
    setSectionsState(updatedSections);
  };

  // Toggle Visibility handler
  const handleToggleVisibility = (id: SectionId) => {
    markDirty();
    const current = sectionsState[id];
    if (!current) return;

    const nextVisible = current.visible === false ? true : false;
    setSectionsState((prev) => ({
      ...prev,
      [id]: {
        ...current,
        visible: nextVisible,
      },
    }));
  };

  // Reset to default ordering
  const handleResetDefaults = () => {
    if (window.confirm('Reset homepage sections to factory default layout and visibility?')) {
      const defaultSections = defaultWebsiteData.settings.sections;
      setSectionsState(defaultSections);

      const defaultMainIds = (Object.keys(defaultSections) as SectionId[])
        .filter((id) => id !== 'footer')
        .sort((a, b) => defaultSections[a].order - defaultSections[b].order);

      setOrderedMainIds(defaultMainIds);
      markDirty();
    }
  };

  // Cancel changes
  const handleCancel = () => {
    if (data.settings?.sections) {
      const currentSections = data.settings.sections;
      setSectionsState(currentSections);
      const mainIds = (Object.keys(currentSections) as SectionId[])
        .filter((id) => id !== 'footer')
        .sort((a, b) => (currentSections[a]?.order ?? 0) - (currentSections[b]?.order ?? 0));
      setOrderedMainIds(mainIds);
      setIsDirty(false);
      setStatus('idle');
      setErrorMessage(null);
    }
  };

  // Save Layout
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
        setTimeout(() => setStatus('idle'), 3500);
      } else {
        setStatus('error');
        setErrorMessage('Failed to persist section layout. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(validators.formatFriendlyError(err));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin Content CMS</span>
            <span className="text-xs text-muted">/</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono">
              HOMEPAGE SECTION ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-foreground" />
            <span>Homepage Section Management</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Reorder page flow, toggle section visibility, and configure public presentation hierarchy.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            title="Restore Factory Default Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Defaults</span>
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveLayout}
            disabled={status === 'saving' || !isDirty}
            className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
              isDirty
                ? 'bg-foreground text-background hover:opacity-90 cursor-pointer'
                : 'bg-surface border border-border text-muted opacity-60 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{status === 'saving' ? 'Saving...' : 'Save Layout'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {status === 'saved' && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Homepage layout saved successfully!</p>
            <p className="opacity-80">The public portfolio will immediately render sections in this updated order.</p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {status === 'error' && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Failed to save section layout</p>
            <p className="opacity-90">{errorMessage || 'Please try again.'}</p>
          </div>
        </div>
      )}

      {/* Reorderable Section List Container */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Main Body Sections ({orderedMainIds.length})</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Drag items by their grip handle to reorder. Toggle the eye icon to enable or disable public rendering.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background border border-border text-muted">
            {orderedMainIds.filter((id) => sectionsState[id]?.visible !== false).length} Active
          </span>
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
      </div>

      {/* Structural Terminal Section: Footer (Pinned) */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Terminal Boundary Section (Pinned)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background border border-border text-muted">
            STRUCTURAL ANCHOR
          </span>
        </div>

        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
            footerSection.visible !== false
              ? 'border-border bg-background'
              : 'border-border/40 bg-background/40 opacity-50'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-1.5 rounded-lg text-muted opacity-40 shrink-0">
              <Lock className="w-4 h-4" />
            </div>

            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center font-mono text-xs font-bold text-muted shrink-0 shadow-xs">
              #END
            </div>

            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-foreground shrink-0 hidden sm:flex">
              <Globe className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
                  {SECTION_METADATA.footer.name}
                </h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-surface border border-border text-muted hidden md:inline">
                  ID: footer
                </span>
              </div>
              <p className="text-[11px] text-muted truncate max-w-md">
                {SECTION_METADATA.footer.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                footerSection.visible !== false
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
              }`}
            >
              {footerSection.visible !== false ? 'ACTIVE' : 'HIDDEN'}
            </span>

            <button
              type="button"
              onClick={() => handleToggleVisibility('footer')}
              className={`p-2 rounded-xl border transition-all ${
                footerSection.visible !== false
                  ? 'border-border bg-surface text-foreground hover:bg-background'
                  : 'border-border/60 bg-background text-muted hover:text-foreground'
              }`}
              title={footerSection.visible !== false ? 'Hide Footer' : 'Show Footer'}
            >
              {footerSection.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsManager;
