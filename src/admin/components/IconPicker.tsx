import React from 'react';
import {
  Briefcase,
  Layers,
  Box,
  Code,
  Sparkles,
  Cpu,
  Globe,
  Compass,
  Terminal,
  Layout,
  Eye,
  Palette,
  Zap,
  Monitor,
  Smartphone,
  Shield,
  Activity,
  FileText,
  Database,
  Workflow,
  Sliders,
  Component,
  Grid,
  PenTool,
  Feather,
  Flame,
  Rocket,
  Wrench,
  Search,
  Check,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Layers,
  Box,
  Code,
  Sparkles,
  Cpu,
  Globe,
  Compass,
  Terminal,
  Layout,
  Eye,
  Palette,
  Zap,
  Monitor,
  Smartphone,
  Shield,
  Activity,
  FileText,
  Database,
  Workflow,
  Sliders,
  Component,
  Grid,
  PenTool,
  Feather,
  Flame,
  Rocket,
  Wrench,
  Search,
};

export const RenderLucideIcon: React.FC<{ name?: string; className?: string }> = ({
  name = 'Briefcase',
  className = 'w-4 h-4',
}) => {
  const IconComponent = ICON_MAP[name] || Briefcase;
  return <IconComponent className={className} />;
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const iconNames = Object.keys(ICON_MAP);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-foreground">Service Visual Icon</label>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 rounded-xl border border-border bg-background max-h-48 overflow-y-auto">
        {iconNames.map((name) => {
          const Icon = ICON_MAP[name];
          const isSelected = value === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                isSelected
                  ? 'border-foreground bg-foreground text-background shadow-xs ring-1 ring-foreground'
                  : 'border-border bg-surface text-muted hover:text-foreground hover:border-foreground/40'
              }`}
              title={name}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-mono truncate max-w-[45px]">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IconPicker;
