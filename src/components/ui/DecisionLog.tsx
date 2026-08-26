import React from 'react';
import { DecisionLogItem } from '../../types';

interface DecisionLogProps {
  logs: DecisionLogItem[];
  className?: string;
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ logs, className = '' }) => {
  if (!logs || logs.length === 0) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Design Decisions & Tradeoffs
        </h3>
      </div>

      <div className="space-y-8">
        {logs.map((log) => (
          <div key={log.id} className="space-y-4">
            <h4 className="text-lg font-bold text-white tracking-tight">
              {log.title}
            </h4>

            {/* Options considered */}
            {log.optionsConsidered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {log.optionsConsidered.map((opt, idx) => (
                  <div key={idx} className="p-4 rounded border border-white/5 bg-[#0C0C0C] space-y-1">
                    <span className="text-xs font-mono text-neutral-400 block">{opt.label}</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">{opt.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Final decision & rationale */}
            <div className="p-4 rounded border border-white/10 bg-[#0E0E0E] space-y-2">
              <span className="text-xs font-mono font-bold text-[#FF3E00] block">
                {log.finalDecision}
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {log.rationale}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
