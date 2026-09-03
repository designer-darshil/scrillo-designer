import React from 'react';
import { Link } from 'react-router-dom';
import { experienceData } from '../../data/experience';
import { siteConfig } from '../../data/site';
import { ArrowUpRight } from 'lucide-react';

export const CinematicNarrative: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 md:py-40 bg-[#080808] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Act 03 Scene Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-12">
          <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            ACT 03
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">CHRONICLE & CRAFT</span>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Personal Narrative & Philosophy */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-white leading-[1.0]">
              CLEAR INTERFACES. <br />
              <span className="italic font-light text-[#FF3E00] lowercase">functional</span> CODE.
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-muted-primary leading-relaxed border-t border-white/10 pt-6">
              <p>
                Based in <span className="text-white font-semibold">{siteConfig.location}</span>, I operate at the intersection of product design and web implementation.
              </p>
              <p>
                My background covers user experience architecture, wireframes, and interactive prototypes in Figma, through to responsive frontend styling using HTML/CSS, JavaScript, and Bootstrap. Designing with code in mind guarantees that interfaces remain performant and true to intent.
              </p>
            </div>

            {/* Core Competencies Capsule */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                EXPERIENCE DOMAINS
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono text-white/80">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">UI/UX Design</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">Web Design</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">SaaS & E-Commerce</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">Wireframes & Flows</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">Interactive Prototypes</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">Frontend Code</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors group"
              >
                <span>READ COMPLETE BACKGROUND</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Filmic Career Chronicle */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">
                PRODUCTION CREDITS / WORK HISTORY
              </span>
            </div>

            <div className="space-y-6">
              {experienceData.map((item) => (
                <div
                  key={item.id}
                  className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] hover:border-white/20 transition-all space-y-3 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[#FF3E00] font-bold tracking-wider">{item.period}</span>
                    <span className="text-white/40">{item.location}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {item.role}
                    </h4>
                    <span className="text-sm font-mono text-white/60">
                      {item.companyOrContext}
                    </span>
                  </div>

                  <p className="text-sm text-muted-primary leading-relaxed pt-1">
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

          </div>

        </div>

      </div>
    </section>
  );
};
