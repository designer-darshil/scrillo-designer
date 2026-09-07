import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { ThreeDCard } from '../ui/ThreeDCard';
import { projects } from '../../data/projects';

export const Interactive3DProjects: React.FC = () => {
  // Grab our 4 primary flagship projects
  const nova = projects.find((p) => p.id === 'nova') || projects[0];
  const aura = projects.find((p) => p.id === 'aura') || projects[1];
  const frame = projects.find((p) => p.id === 'frame') || projects[2];
  const mono = projects.find((p) => p.id === 'mono') || projects[3];

  return (
    <section id="projects-section" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                PORTFOLIO
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">3D INTERACTIVE WORK</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
              FEATURED <br />
              <span className="text-white/50">PROJECTS.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="max-w-md text-xs sm:text-sm font-mono text-white/50 leading-relaxed md:text-right">
              Tactile multi-layer interface cards with real depth perspective. Hover to inspect.
            </p>
            <Link
              to="/work"
              className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#FF3E00] hover:text-white transition-colors group pt-1"
            >
              <span>VIEW FULL ARCHIVE ({projects.length})</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Art-Directed 3D Grid Arrangement */}
        <div className="space-y-12 sm:space-y-16">
          
          {/* ========================================================================= */}
          {/* 01 — FEATURED: Large Interactive 3D Card (NOVA)                           */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/5">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="text-[#FF3E00]">01</span>
                <span>/ FEATURED FLAGSHIP</span>
              </span>
              <span>SAAS PRODUCT & FRONTEND</span>
            </div>

            <ThreeDCard maxRotation={5} depthZ={14} glareOpacity={0.16}>
              <Link
                to={`/work/${nova.slug}`}
                className="block group rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Layer 2: Image Media with translateZ */}
                  <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-white/10 aspect-[16/10] bg-black/60 relative [transform-style:preserve-3d]">
                    <img
                      src={nova.heroImage}
                      alt={nova.title}
                      className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating pill badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90"
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      B2B INCIDENT TELEMETRY
                    </div>
                  </div>

                  {/* Layers 3-5: Typographic & Metadata Stack */}
                  <div className="lg:col-span-5 space-y-6 [transform-style:preserve-3d]">
                    <div style={{ transform: 'translateZ(30px)' }} className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                        {nova.categoryLabel}
                      </span>
                      <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white group-hover:text-white transition-colors">
                        {nova.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans pt-1">
                        {nova.subtitle}
                      </p>
                    </div>

                    {/* Layer 4: Tech Stack metadata */}
                    <div style={{ transform: 'translateZ(42px)' }} className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {nova.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-2">
                        <span>CLIENT: {nova.client}</span>
                        <span>YEAR: {nova.year}</span>
                      </div>
                    </div>

                    {/* Layer 5: CTA Button */}
                    <div style={{ transform: 'translateZ(52px)' }} className="pt-2">
                      <span className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold group-hover:bg-[#FF3E00] group-hover:text-white transition-all shadow-xl">
                        <span>VIEW PROJECT</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            </ThreeDCard>
          </div>

          {/* ========================================================================= */}
          {/* 02 & 03: Medium Interactive 3D Cards (AURA & FRAME)                       */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            
            {/* Card 02: AURA */}
            <div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/5">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="text-[#FF3E00]">02</span>
                  <span>/ E-COMMERCE & BRAND</span>
                </span>
                <span>2026</span>
              </div>

              <ThreeDCard maxRotation={6} depthZ={12} glareOpacity={0.15}>
                <Link
                  to={`/work/${aura.slug}`}
                  className="block group rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25 h-full flex flex-col justify-between"
                >
                  <div className="space-y-6 [transform-style:preserve-3d]">
                    <div className="overflow-hidden rounded-2xl border border-white/10 aspect-[16/10] bg-black/60 relative">
                      <img
                        src={aura.heroImage}
                        alt={aura.title}
                        className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        DIGITAL COMMERCE
                      </div>
                    </div>

                    <div style={{ transform: 'translateZ(30px)' }} className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                        {aura.categoryLabel}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                        {aura.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans line-clamp-2">
                        {aura.subtitle}
                      </p>
                    </div>
                  </div>

                  <div style={{ transform: 'translateZ(44px)' }} className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {aura.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-white group-hover:text-[#FF3E00] font-bold transition-colors">
                      <span>EXPLORE</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </ThreeDCard>
            </div>

            {/* Card 03: FRAME */}
            <div>
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/5">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="text-[#FF3E00]">03</span>
                  <span>/ EDITORIAL & INTERACTION</span>
                </span>
                <span>2026</span>
              </div>

              <ThreeDCard maxRotation={6} depthZ={12} glareOpacity={0.15}>
                <Link
                  to={`/work/${frame.slug}`}
                  className="block group rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25 h-full flex flex-col justify-between"
                >
                  <div className="space-y-6 [transform-style:preserve-3d]">
                    <div className="overflow-hidden rounded-2xl border border-white/10 aspect-[16/10] bg-black/60 relative">
                      <img
                        src={frame.heroImage}
                        alt={frame.title}
                        className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        MINIMAL PUBLICATION
                      </div>
                    </div>

                    <div style={{ transform: 'translateZ(30px)' }} className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                        {frame.categoryLabel}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                        {frame.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans line-clamp-2">
                        {frame.subtitle}
                      </p>
                    </div>
                  </div>

                  <div style={{ transform: 'translateZ(44px)' }} className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {frame.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-white group-hover:text-[#FF3E00] font-bold transition-colors">
                      <span>EXPLORE</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </ThreeDCard>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 04 — FEATURED: Full-Width Card (MONO)                                      */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/5">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="text-[#FF3E00]">04</span>
                <span>/ DESIGN SYSTEMS & FRONTEND</span>
              </span>
              <span>2026 ARCHIVE</span>
            </div>

            <ThreeDCard maxRotation={4} depthZ={14} glareOpacity={0.15}>
              <Link
                to={`/work/${mono.slug}`}
                className="block group rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-5 space-y-6 [transform-style:preserve-3d] order-2 lg:order-1">
                    <div style={{ transform: 'translateZ(30px)' }} className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                        {mono.categoryLabel}
                      </span>
                      <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white group-hover:text-white transition-colors">
                        {mono.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans pt-1">
                        {mono.subtitle}
                      </p>
                    </div>

                    <div style={{ transform: 'translateZ(42px)' }} className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {mono.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-2">
                        <span>CLIENT: {mono.client}</span>
                        <span>YEAR: {mono.year}</span>
                      </div>
                    </div>

                    <div style={{ transform: 'translateZ(52px)' }} className="pt-2">
                      <span className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold group-hover:bg-[#FF3E00] group-hover:text-white transition-all shadow-xl">
                        <span>VIEW PROJECT</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-white/10 aspect-[16/10] bg-black/60 relative [transform-style:preserve-3d] order-1 lg:order-2">
                    <img
                      src={mono.heroImage}
                      alt={mono.title}
                      className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90"
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      TOKEN & TYPOGRAPHY SYSTEM
                    </div>
                  </div>

                </div>
              </Link>
            </ThreeDCard>
          </div>

        </div>

      </div>
    </section>
  );
};
