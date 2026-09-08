import React from 'react';
import { Image as ImageIcon, Upload, Eye } from 'lucide-react';
import { projectsData } from '../../data/projects';

export const MediaManager: React.FC = () => {
  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <ImageIcon className="w-4 h-4" />
            <span>STORAGE & MEDIA ASSETS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-tight text-foreground">
            MEDIA MANAGER
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projectsData.map((item) => (
          <div key={item.id} className="border border-border bg-surface overflow-hidden group">
            <div className="aspect-[16/10] overflow-hidden bg-background relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="p-2 bg-foreground text-background font-mono text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </span>
              </div>
            </div>
            <div className="p-3 border-t border-border font-mono text-[11px] flex items-center justify-between">
              <span className="truncate text-foreground font-medium">{item.title}</span>
              <span className="text-muted shrink-0">WEBP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;
