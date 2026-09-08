import React from 'react';
import { experienceData } from '../../data/experience';

export const EditorialExperience: React.FC = () => {
  return (
    <section className="relative bg-[#060606] text-white border-b border-white/[0.08]">
      {/* Header Bar */}
      <div className="border-b border-white/[0.08] py-8 sm:py-10">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest uppercase text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">04</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00]">EXPERIENCE</span>
          </div>
          <div>
            <span>VERIFIED PROFESSIONAL TIMELINE</span>
          </div>
        </div>
      </div>

      {/* Main Experience Timeline */}
      <div className="site-container py-16 sm:py-24 lg:py-28">
        <div className="space-y-12 sm:space-y-16">
          {experienceData.map((exp, index) => (
            <div
              key={exp.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 pb-12 sm:pb-16 border-b border-white/[0.06] last:border-b-0 last:pb-0"
            >
              {/* Timeline / Period */}
              <div className="lg:col-span-4 space-y-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF3E00] font-bold">0{index + 1}</span>
                  <span className="text-white/30">/</span>
                  <span className="text-white/80">{exp.period}</span>
                </div>
                <div className="text-white/40">{exp.location}</div>
                {exp.isCurrent && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>PRESENT ROLE</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Role & Company & Concise Summary */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-white">
                    {exp.companyOrContext}
                  </h3>
                  <div className="text-sm sm:text-base font-mono text-white/60 mt-1">
                    {exp.role} · <span className="text-white/40">{exp.type}</span>
                  </div>
                </div>

                <p className="text-white/70 text-sm sm:text-base leading-relaxed text-pretty max-w-2xl">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-[11px] text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
