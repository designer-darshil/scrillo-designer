import React from 'react';
import { ProjectReceiptItem } from '../../types';

interface ProjectReceiptProps {
  receipt: ProjectReceiptItem[];
  className?: string;
}

export const ProjectReceipt: React.FC<ProjectReceiptProps> = ({ receipt, className = '' }) => {
  if (!receipt || receipt.length === 0) return null;

  return (
    <div className={`border-y border-white/10 py-6 my-8 ${className}`}>
      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-4">
        Project Scope & Artifacts
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {receipt.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="text-2xl font-bold font-mono text-white">
              {item.count}
            </div>
            <p className="text-xs font-mono text-neutral-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
