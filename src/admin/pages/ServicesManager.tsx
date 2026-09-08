import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { defaultServicesList } from '../services/servicesService';

export const ServicesManager: React.FC = () => {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <Briefcase className="w-4 h-4" />
            <span>COMMISSION SCOPE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-tight text-foreground">
            SERVICES MANAGER
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Service</span>
        </button>
      </div>

      <div className="space-y-4">
        {defaultServicesList.map((svc) => (
          <div key={svc.number} className="border border-border bg-surface p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted">[{svc.number}]</span>
              <span className="font-mono text-[11px] text-muted">{svc.deliverables.length} DELIVERABLES</span>
            </div>
            <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-foreground">
              {svc.title}
            </h3>
            <p className="font-mono text-xs text-muted leading-relaxed">
              {svc.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {svc.deliverables.map((item, idx) => (
                <span key={idx} className="font-mono text-[10px] uppercase text-muted border border-border px-2 py-0.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
