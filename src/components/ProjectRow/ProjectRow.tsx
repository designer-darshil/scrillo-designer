import React from 'react';
import { Project } from '../../data/projects';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProjectRowProps {
  project: Project;
  index: number;
  onHoverStart?: (project: Project, e: React.MouseEvent) => void;
  onHoverEnd?: () => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  index,
  onHoverStart,
  onHoverEnd,
}) => {
  return (
    <article
      data-cursor="project"
      data-cursor-text="VIEW"
      onMouseEnter={(e) => onHoverStart?.(project, e)}
      onMouseLeave={() => onHoverEnd?.()}
      className="group relative border-t border-border py-8 sm:py-10 md:py-12 transition-colors duration-300 hover:bg-surface/50 select-none"
    >
      <div className="page-container flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
        {/* Left: Number + Title */}
        <div className="flex items-baseline gap-4 sm:gap-8 flex-1">
          <span className="font-mono text-xs sm:text-sm text-muted/70 group-hover:text-foreground transition-colors shrink-0">
            [{project.number}]
          </span>

          <div className="space-y-1">
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold uppercase tracking-tighter text-foreground group-hover:translate-x-3 sm:group-hover:translate-x-4 transition-transform duration-300 ease-out">
              {project.title}
            </h3>
            {/* Mobile metadata descriptor */}
            <p className="md:hidden font-mono text-xs text-muted tracking-wider uppercase pt-1">
              {project.category} · {project.year}
            </p>
          </div>
        </div>

        {/* Center: Category / Discipline (Desktop) */}
        <div className="hidden md:block min-w-[200px] text-left">
          <span className="font-mono text-xs sm:text-sm text-muted uppercase tracking-meta group-hover:text-foreground/90 transition-colors">
            {project.category}
          </span>
        </div>

        {/* Right: Year + Arrow Icon */}
        <div className="hidden md:flex items-center justify-end gap-8 min-w-[140px]">
          <span className="font-mono text-xs sm:text-sm text-muted group-hover:text-foreground transition-colors">
            {project.year}
          </span>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted group-hover:border-foreground group-hover:text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Mobile Inline Thumbnail: Visible on mobile devices, hidden on desktop */}
        <div className="md:hidden mt-4 overflow-hidden border border-border">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full aspect-[16/9] object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </article>
  );
};

export default ProjectRow;
