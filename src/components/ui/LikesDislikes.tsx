import React from 'react';
import { siteConfig } from '../../data/site';
import { Check, X } from 'lucide-react';

export const LikesDislikes: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* I LIKE */}
      <div className="p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
          <Check size={16} />
          <span>I LIKE</span>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-white/90">
          {siteConfig.likes.map((like, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">+</span>
              <span>{like}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* I DON'T LIKE */}
      <div className="p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
          <X size={16} />
          <span>I DON'T LIKE</span>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-white/70">
          {siteConfig.dislikes.map((dislike, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-red-400 font-bold">−</span>
              <span>{dislike}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
