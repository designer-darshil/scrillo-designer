import React, { useState } from 'react';
import { projectsData } from '../../data/projects';
import { ProjectRow } from '../../components/ProjectRow/ProjectRow';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';

interface SelectedWorksProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({ onHoverStateChange }) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  return (
    <section id="works" className="py-20 border-t border-white/10">
      <div className="editorial-container mb-8">
        <SectionLabel number="01" title="SELECTED WORKS ARCHIVE" />
      </div>

      <div className="w-full">
        {projectsData.map((project) => (
          <div
            key={project.id}
            onMouseEnter={() => {
              setActiveProjectId(project.id);
              onHoverStateChange?.(true, 'project', 'VIEW');
            }}
            onMouseLeave={() => {
              setActiveProjectId(null);
              onHoverStateChange?.(false);
            }}
          >
            <ProjectRow
              project={project}
              isActive={activeProjectId === project.id}
            />
          </div>
        ))}
      </div>

      <div className="editorial-container pt-8 flex items-center justify-between font-mono text-xs text-light-600">
        <span>TOTAL ARCHIVED: 04 CASE STUDIES</span>
        <span>ALL CLIENT WORK PRODUCED UNDER NDA & DIRECT CONTRACT</span>
      </div>
    </section>
  );
};
