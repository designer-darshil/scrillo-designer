import React from 'react';
import { siteConfig } from '../../data/site';

export const CinematicStatement: React.FC = () => {
  return (
    <section className="py-28 sm:py-44 md:py-56 bg-[#030303] border-b border-white/10 relative overflow-hidden">
      {/* Cinematic wide negative space with dramatic typographic contrast */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
        
        {/* Act Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-[0.25em] text-[#FF3E00] uppercase mb-12 sm:mb-16">
          <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            ACT 03
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">STATEMENT</span>
        </div>

        {/* Massive Typographic Composition */}
        <div className="space-y-10 sm:space-y-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold uppercase tracking-tight text-white leading-[0.92] max-w-5xl break-words">
            DESIGNING DIGITAL <br />
            <span className="text-white/40 font-light block">
              EXPERIENCES
            </span>
            <span className="italic font-light text-[#FF3E00] lowercase text-[0.88em] block">
              that feel simple to use.
            </span>
          </h2>

          {/* Editorial Micro-Details Split */}
          <div className="pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 space-y-4">
              <p className="text-base sm:text-xl font-light text-white/80 leading-relaxed max-w-lg">
                Combining 8+ years of UI/UX design with 4+ years of hands-on web design and frontend development. Focused on SaaS platforms, digital products, and e-commerce websites.
              </p>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4 font-mono text-xs uppercase tracking-wider text-white/60">
              <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-[#0A0A0A]">
                <span className="text-[#FF3E00] font-bold block">01. PRODUCT & UX</span>
                <span className="text-white text-xs block font-sans">Wireframes, user journeys, information architecture, and interactive Figma prototypes.</span>
              </div>

              <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-[#0A0A0A]">
                <span className="text-[#FF3E00] font-bold block">02. WEB & FRONTEND</span>
                <span className="text-white text-xs block font-sans">Responsive layout execution with HTML/CSS, JavaScript, Bootstrap, and sub-pixel fidelity.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
