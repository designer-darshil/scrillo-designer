import React from 'react';
import { ProjectReceiptItem } from '../../types';
import { Receipt, CheckCircle2 } from 'lucide-react';

interface ProjectReceiptProps {
  receipt: ProjectReceiptItem[];
  title?: string;
  className?: string;
}

export const ProjectReceipt: React.FC<ProjectReceiptProps> = ({
  receipt,
  title = 'PROJECT RECEIPT',
  className = ''
}) => {
  if (!receipt || receipt.length === 0) return null;

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00] font-bold uppercase tracking-wider">
          <Receipt size={14} />
          <span>{title}</span>
        </div>
        <span className="text-[11px] font-mono text-white/40">
          PROVABLE CRAFT EVIDENCE
        </span>
      </div>

      {/* Grid of Receipts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {receipt.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-1"
          >
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {item.count}
            </div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-white/50">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="text-[11px] font-mono text-white/40 flex items-center space-x-2 pt-1">
        <CheckCircle2 size={12} className="text-[#FF3E00]" />
        <span>Replaces fabricated business metrics with concrete architectural evidence.</span>
      </div>
    </div>
  );
};
