import React from 'react';
import { siteConfig } from '../../data/site';
import { Sparkles, Terminal, Compass, CheckCircle2 } from 'lucide-react';

export const CurrentlySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Currently Building */}
      <div className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00] font-bold uppercase tracking-wider">
          <Terminal size={14} />
          <span>CURRENTLY CRAFTING</span>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-white/80">
          {siteConfig.currently.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5">
              <span className="text-[#FF3E00] font-bold">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Currently Exploring */}
      <div className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
          <Compass size={14} />
          <span>RESEARCH & EXPLORING</span>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-white/80">
          {siteConfig.exploring.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5">
              <span className="text-emerald-400 font-bold">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
