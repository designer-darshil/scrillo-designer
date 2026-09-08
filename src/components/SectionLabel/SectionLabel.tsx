import React from 'react';
import { cn } from '../../utils/cn';

interface SectionLabelProps {
  number: string;
  title: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ number, title, className }) => {
  return (
    <div className={cn('flex items-center justify-between py-4 border-b border-white/10 text-xs font-mono tracking-widest uppercase text-light-500', className)}>
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-light-100 inline-block" />
        <span>[{number}]</span>
      </span>
      <span className="text-light-400 font-medium">{title}</span>
    </div>
  );
};
