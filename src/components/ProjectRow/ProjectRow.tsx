import React from 'react';
import { Project } from '../../data/projects';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProjectRowProps {
  project: Project;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  isActive = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'group relative border-b border-white/10 py-8 transition-colors duration-300',
        isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
      )}
    >
      <div className="editorial-container flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Index + Title */}
        <div className="flex items-baseline gap-4 md:gap-8 flex-1">
          <span className="font-mono text-xs text-light-500">[{project.index}]</span>
          <div>
            <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-light-100 group-hover:translate-x-2 transition-transform duration-300">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-light-500 uppercase tracking-wider md:hidden">
              {project.category} · {project.year}
            </p>
          </div>
        </div>

        {/* Center: Discipline & Client (Desktop) */}
        <div className="hidden md:flex flex-col items-start min-w-[220px]">
          <span className="font-mono text-xs uppercase text-light-400">
            {project.category}
          </span>
          <span className="font-mono text-[11px] text-light-600 mt-0.5">
            Client: {project.client}
          </span>
        </div>

        {/* Right: Year + Link Icon */}
        <div className="flex items-center justify-between md:justify-end gap-6 min-w-[120px]">
          <span className="font-mono text-xs text-light-500">{project.year}</span>
          <div className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
};
