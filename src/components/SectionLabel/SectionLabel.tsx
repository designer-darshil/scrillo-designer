import React from 'react';
import { cn } from '../../utils/cn';

interface SectionLabelProps {
  number: string;
  title: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ number, title, className }) => {
  return (
    <div className={cn('section-label-bar', className)}>
      <span className="flex items-center gap-2">
        <span className="w-1 h-1 bg-foreground inline-block" />
        <span>[{number}]</span>
      </span>
      <span className="text-foreground/90 font-medium tracking-meta">{title}</span>
    </div>
  );
};
