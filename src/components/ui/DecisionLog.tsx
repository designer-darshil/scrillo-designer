import React from 'react';
import { DecisionLogItem } from '../../types';
import { HelpCircle, ArrowRight, GitCommit } from 'lucide-react';

interface DecisionLogProps {
  logs: DecisionLogItem[];
  className?: string;
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ logs, className = '' }) => {
  if (!logs || logs.length === 0) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase">
        <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
          WHY?
        </span>
        <span className="text-white/30">/</span>
        <span className="text-white/70">DESIGN DECISION LOG</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-6 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-4 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <HelpCircle size={16} className="text-[#FF3E00] shrink-0" />
                <span>{log.question}</span>
              </h4>
              {log.tag && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                  {log.tag}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-primary leading-relaxed">
              {log.decision}
            </p>

            {log.tradeoff && (
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs font-mono text-white/60 flex items-start space-x-2">
                <GitCommit size={13} className="text-[#FF3E00] shrink-0 mt-0.5" />
                <span><strong className="text-white">Tradeoff considered:</strong> {log.tradeoff}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
