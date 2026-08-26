import React from 'react';
import { experienceData, craftStats } from '../../data/experience';
import { SectionHeading } from '../ui/SectionHeading';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar } from 'lucide-react';

export const ExperiencePreview: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#080808] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="04"
          tag="CAREER TIMELINE & TOOLING"
          title="EXPERIENCE"
          serifWord="& technical stack"
          description="8+ years designing complex product interfaces and 4+ years implementing production frontend web code."
          align="split"
        >
          <Link
            to="/experience"
            data-cursor="explore"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF3E00] hover:underline"
          >
            <span>VIEW FULL CAREER DOSSIER</span>
            <ArrowUpRight size={13} />
          </Link>
        </SectionHeading>

        {/* High-level Craft Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {craftStats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl border border-white/10 bg-[#0D0D0D] space-y-1"
            >
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                {stat.value}
              </div>
              <p className="text-xs font-mono text-white/50 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Editorial Timeline Preview */}
        <div className="space-y-6">
          {experienceData.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] hover:border-white/20 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Period & Role */}
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00] font-bold">
                    <Calendar size={13} />
                    <span>{item.period}</span>
                    {item.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] ml-2">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.role}
                  </h3>
                  <p className="text-xs font-mono text-white/60">
                    {item.companyOrContext}
                  </p>
                </div>

                {/* Description & Tech */}
                <div className="md:col-span-8 space-y-4">
                  <p className="text-sm text-muted-primary leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
