import React, { useState } from 'react';
import { BeforeAfterItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface BeforeAfterProps {
  data: BeforeAfterItem;
  className?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ data, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');

  if (!data) return null;

  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block mb-1">
            EVOLUTION COMPARISON
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {data.title}
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('before')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'before'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            BEFORE (FLAWS)
          </button>
          <button
            onClick={() => setActiveTab('after')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'after'
                ? 'bg-[#FF3E00] text-white font-bold shadow-md shadow-[#FF3E00]/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            AFTER (SOLUTIONS)
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'before' ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-6 rounded-xl border border-red-500/20 bg-red-950/10 space-y-4"
          >
            <div className="flex items-center space-x-2 text-xs font-mono text-red-400 font-bold uppercase">
              <AlertCircle size={15} />
              <span>{data.before.label}</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {data.before.description}
            </p>
            <div className="space-y-2 pt-2 border-t border-red-500/10">
              <span className="text-[10px] font-mono text-red-400/80 uppercase">
                IDENTIFIED FRICTION POINTS:
              </span>
              <ul className="space-y-1.5 text-xs font-mono text-white/70">
                {data.before.flaws.map((flaw, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>{flaw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-4"
          >
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <CheckCircle2 size={15} />
              <span>{data.after.label}</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {data.after.description}
            </p>
            <div className="space-y-2 pt-2 border-t border-emerald-500/10">
              <span className="text-[10px] font-mono text-emerald-400/80 uppercase">
                ARCHITECTURAL RESOLUTIONS:
              </span>
              <ul className="space-y-1.5 text-xs font-mono text-white/90">
                {data.after.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
