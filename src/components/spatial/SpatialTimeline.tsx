import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experienceData } from '../../data/experience';
import { CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';

const timelineNodes = [
  { id: '2018', year: '2018', expId: 'exp-gridlab', label: 'GRIDLAB' },
  { id: '2019', year: '2019', expId: 'exp-dreamworld', label: 'DREAM WORLD' },
  { id: '2021', year: '2021', expId: 'exp-awesome', label: 'AWESOME' },
  { id: '2022', year: '2022', expId: 'exp-bigbrainy', label: 'BIGBRAINY' },
  { id: 'now', year: 'NOW', expId: 'exp-bigbrainy', label: 'PRESENT' }
];

export const SpatialTimeline: React.FC = () => {
  const [selectedId, setSelectedId] = useState('now');
  const currentNode = timelineNodes.find((n) => n.id === selectedId) || timelineNodes[timelineNodes.length - 1];
  const currentExp = experienceData.find((e) => e.id === currentNode.expId) || experienceData[0];

  return (
    <section id="spatial-timeline" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                03
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">SPATIAL TIMELINE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
              CAREER <br />
              <span className="text-white/50">CHRONOLOGY.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-white/50 max-w-xs">
            Interactive horizontal rail. Select any epoch to inspect verified employment history.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL TEMPORAL RAIL: 2018 → 2019 → 2021 → 2022 → NOW                 */}
        {/* ========================================================================= */}
        <div className="mb-12 sm:mb-16 overflow-x-auto no-scrollbar pb-4">
          <div className="flex items-center justify-between min-w-[620px] p-2 rounded-2xl border border-white/10 bg-[#0A0A0A] relative">
            
            {/* Connecting Hairline Axis */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 pointer-events-none" />

            {timelineNodes.map((node, index) => {
              const isSelected = selectedId === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className={`relative z-10 flex flex-col items-center space-y-2 py-3 px-6 rounded-xl transition-all duration-300 min-h-[58px] ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-xl shadow-white/10 scale-105'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-mono text-xs font-bold tracking-wider">
                    <span>{node.year}</span>
                    {node.id === 'now' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-pulse" />
                    )}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${isSelected ? 'text-black/70' : 'text-white/40'}`}>
                    {node.label}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3D TEMPORAL STAGE (Transforms smoothly on epoch selection)                */}
        {/* ========================================================================= */}
        <div className="[perspective:1200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111] via-[#090909] to-[#050505] p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle background coordinate grid */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                
                {/* Left Column: Period, Company, Role */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-mono tracking-widest uppercase">
                    <span className="text-[#FF3E00] font-bold">{currentExp.period}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/60">{currentExp.location}</span>
                    {currentExp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                        ACTIVE ROLE
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                    {currentExp.companyOrContext}
                  </h3>

                  <div className="text-sm sm:text-base font-mono text-white/80 font-medium">
                    {currentExp.role}
                  </div>

                  <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed pt-2">
                    {currentExp.description}
                  </p>
                </div>

                {/* Right Column: Verified Achievements & Technologies */}
                <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
                  
                  {/* Achievements */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                      CORE CONTRIBUTIONS
                    </span>
                    <div className="space-y-2.5">
                      {currentExp.achievements.map((ach, i) => (
                        <div key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm font-sans text-white/80 leading-relaxed">
                          <CheckCircle2 size={15} className="text-[#FF3E00] shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stack */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                      TECHNOLOGIES & TOOLING
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentExp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Verification Strip */}
        <div className="pt-8 mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/30 uppercase tracking-widest border-t border-white/5">
          <span>SURAT, GUJARAT, INDIA</span>
          <span>100% VERIFIED EMPLOYMENT HISTORY</span>
        </div>

      </div>
    </section>
  );
};
