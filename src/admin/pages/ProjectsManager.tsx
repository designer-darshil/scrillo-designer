import React from 'react';
import { FolderGit2, Plus, ExternalLink } from 'lucide-react';
import { projectsData } from '../../data/projects';

export const ProjectsManager: React.FC = () => {
  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <FolderGit2 className="w-4 h-4" />
            <span>SELECTED REPOSITORIES ({projectsData.length})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-tight text-foreground">
            PROJECTS MANAGER
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Table / Listing */}
      <div className="border border-border bg-surface overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-border bg-background/50 text-muted uppercase">
            <tr>
              <th className="p-4">No.</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Year</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projectsData.map((project) => (
              <tr key={project.id} className="hover:bg-background/40 transition-colors">
                <td className="p-4 text-muted">[{project.number}]</td>
                <td className="p-4 font-sans font-bold text-sm text-foreground uppercase">{project.title}</td>
                <td className="p-4 text-muted">{project.category}</td>
                <td className="p-4 text-muted">{project.year}</td>
                <td className="p-4 text-right">
                  <span className="inline-block px-2 py-0.5 border border-border text-[11px] text-muted">
                    PUBLISHED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsManager;
