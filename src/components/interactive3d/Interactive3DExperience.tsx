import React, { useState } from 'react';
import { experienceData } from '../../data/experience';
import { Briefcase, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Interactive3DExperience: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="experience-section" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                TIMELINE
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">WORK HISTORY</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
              CAREER <br />
              <span className="text-white/50">EXPERIENCE.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-white/50 max-w-xs">
            Chronological employment history across web & product design roles in Surat, Gujarat.
          </p>
        </div>

        {/* Clean Interactive Timeline Rows */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {experienceData.map((item, index) => {
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group rounded-2xl border transition-all duration-300 p-6 sm:p-8 cursor-default ${
                  isHovered
                    ? 'border-[#FF3E00]/40 bg-[#0C0C0C] translate-x-1 sm:translate-x-2 shadow-2xl'
                    : 'border-white/10 bg-[#070707] hover:border-white/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Column: Period, Role & Company */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-xs font-mono tracking-widest uppercase">
                      <span className={`transition-colors font-bold ${isHovered ? 'text-[#FF3E00]' : 'text-[#FF3E00]/90'}`}>
                        {item.period}
                      </span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/50">{item.location}</span>
                      {item.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          CURRENT ROLE
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                      <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white group-hover:text-white transition-colors">
                        {item.companyOrContext}
                      </h3>
                      <span className="text-sm sm:text-base font-mono text-white/70">
                        {item.role}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 font-sans max-w-2xl leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Right Column: Key Technologies */}
                  <div className="flex flex-wrap lg:justify-end gap-1.5 pt-2 lg:pt-0 max-w-sm">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                          isHovered
                            ? 'border-white/20 bg-white/10 text-white'
                            : 'border-white/5 bg-white/5 text-white/50'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Achievements details when hovered */}
                {isHovered && item.achievements && (
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5 animate-fadeIn">
                    {item.achievements.map((ach, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs font-sans text-white/75">
                        <CheckCircle2 size={13} className="text-[#FF3E00] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Verification Footer */}
        <div className="pt-12 mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/30 uppercase tracking-widest border-t border-white/5">
          <span>AUTHENTIC EMPLOYMENT TIMELINE</span>
          <span>SURAT, GUJARAT, INDIA</span>
        </div>

      </div>
    </section>
  );
};
