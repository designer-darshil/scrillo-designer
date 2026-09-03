import React from 'react';
import { experienceData } from '../../data/experience';
import { siteConfig } from '../../data/site';

export const CinematicCredits: React.FC = () => {
  return (
    <section className="py-24 sm:py-36 md:py-48 bg-[#040404] border-b border-white/10 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
        
        {/* Act Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-[0.25em] text-[#FF3E00] uppercase mb-16 pb-4 border-b border-white/10">
          <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            ACT 04
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">PRODUCTION CREDITS</span>
        </div>

        {/* Film Credits Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/40 block mb-2">
            CHRONICLE / WORK HISTORY
          </span>
          <h3 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
            EXPERIENCE.
          </h3>
        </div>

        {/* Film Credits Vertical Cadence */}
        <div className="space-y-12 sm:space-y-16 max-w-4xl">
          {experienceData.map((item, index) => (
            <div
              key={item.id}
              className="group border-b border-white/10 pb-8 sm:pb-12 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-white/40 tracking-[0.2em] uppercase">
                <span className="text-[#FF3E00] font-semibold">{item.period}</span>
                <span>{item.location}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h4 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white group-hover:text-[#FF3E00] transition-colors">
                  {item.companyOrContext}
                </h4>
                <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-white/70">
                  {item.role}
                </span>
              </div>

              <p className="text-sm font-sans text-muted-primary max-w-2xl leading-relaxed pt-1">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {item.technologies.slice(0, 5).map((tech) => (
                  <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Credits Verification */}
        <div className="pt-12 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/30 uppercase tracking-widest">
          <span>SURAT, GUJARAT, INDIA</span>
          <span>AUTHENTIC EMPLOYMENT TIMELINE</span>
        </div>

      </div>
    </section>
  );
};
