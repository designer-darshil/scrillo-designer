import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { media } from '../../data/media';

export const CinematicSelectedWork: React.FC = () => {
  return (
    <section id="cinematic-work" className="bg-[#030303] border-b border-white/10 relative">
      
      {/* Act 02 Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 pt-24 sm:pt-36 pb-12 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 text-xs font-mono tracking-[0.25em] text-[#FF3E00] uppercase mb-4">
            <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
              ACT 02
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">FEATURED SCENES</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
            SELECTED <br />
            <span className="italic font-light text-[#FF3E00] lowercase">work.</span>
          </h2>
        </div>

        <Link
          to="/work"
          className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-white/80 hover:text-[#FF3E00] transition-colors group pb-1"
        >
          <span>VIEW FULL ARCHIVE</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* SCENE 01: NOVA — Wide Full-Bleed Cinematic Shot                          */}
      {/* ========================================================================= */}
      <article className="py-20 sm:py-32 border-b border-white/10 relative overflow-hidden group">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
          
          {/* Filmic Slate */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-6 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-white">01</span>
              <span className="text-white/20">/</span>
              <span className="text-[#FF3E00] font-semibold">SAAS PRODUCT INTERFACE</span>
            </div>
            <span>2026</span>
          </div>

          {/* Full-Bleed Wide 16:9 Frame with Overlapping Typography */}
          <Link to="/work/nova" className="block relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 aspect-[16/10] sm:aspect-[16/9] bg-[#0A0A0A]">
            <img
              src={media.novaHero}
              alt="NOVA Platform Interface"
              className="w-full h-full object-cover object-center brightness-90 contrast-110 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
              loading="lazy"
              decoding="async"
            />
            {/* Film Still Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] tracking-widest text-white/70 uppercase">
              WIDE SHOT · INCIDENT TELEMETRY
            </div>

            {/* Overlapping Bottom Third */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-4xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-tight text-white leading-none">
                  NOVA
                </h3>
                <p className="text-sm sm:text-base font-sans text-white/80 max-w-xl line-clamp-2 sm:line-clamp-none">
                  SaaS analytics platform engineered for cognitive clarity and rapid incident response under high data density.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold group-hover:bg-[#FF3E00] group-hover:text-white transition-all shadow-2xl">
                  <span>VIEW SCENE</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* Minimal Metadata Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/40">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/70">Lead UI/UX</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/70">Design System</span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/70">React & TypeScript</span>
            </div>
            <span className="hidden sm:inline">NOVA SYSTEMS INC.</span>
          </div>

        </div>
      </article>

      {/* ========================================================================= */}
      {/* SCENE 02: AURA — Vertical Off-Center Portrait Shot                       */}
      {/* ========================================================================= */}
      <article className="py-20 sm:py-32 border-b border-white/10 relative overflow-hidden group bg-[#060606]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
          
          {/* Filmic Slate */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-8 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-white">02</span>
              <span className="text-white/20">/</span>
              <span className="text-[#FF3E00] font-semibold">CREATIVE COMMERCE</span>
            </div>
            <span>2025</span>
          </div>

          {/* Asymmetrical Composition: Left Typography + Right Vertical Crop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Typographic Focus */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#FF3E00] font-semibold block">
                  CLOSE-UP FRAME
                </span>
                <h3 className="text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.9]">
                  AURA
                </h3>
                <p className="text-lg sm:text-xl font-light text-white/70 leading-relaxed pt-2">
                  Lifestyle and creative commerce platform with bespoke editorial layouts, tactile typography, and fluid user journeys.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs text-white/50 border-t border-white/10 pt-6">
                <div className="flex justify-between py-1">
                  <span>DISCIPLINE</span>
                  <span className="text-white">UI/UX · WEB DESIGN</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>DELIVERABLES</span>
                  <span className="text-white">WIREFRAMES · PROTOTYPES · FRONTEND</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>PLATFORM</span>
                  <span className="text-white">E-COMMERCE & EDITORIAL</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/work/aura"
                  className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all shadow-xl shadow-[#FF3E00]/20"
                >
                  <span>VIEW PROJECT</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Vertical Film Frame */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <Link to="/work/aura" className="block relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] bg-[#0A0A0A]">
                <img
                  src={media.auraHero}
                  alt="AURA Commerce Experience"
                  className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] tracking-widest text-white/70 uppercase">
                  VERTICAL CROP · 4:5
                </div>
                <div className="absolute bottom-6 left-6 font-mono text-xs uppercase tracking-widest text-white/80">
                  AURA LIFESTYLE
                </div>
              </Link>
            </div>

          </div>

        </div>
      </article>

      {/* ========================================================================= */}
      {/* SCENE 03: FRAME — Anamorphic 21:9 Letterbox Panoramic Shot              */}
      {/* ========================================================================= */}
      <article className="py-20 sm:py-32 border-b border-white/10 relative overflow-hidden group">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
          
          {/* Filmic Slate */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-6 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-white">03</span>
              <span className="text-white/20">/</span>
              <span className="text-[#FF3E00] font-semibold">COLLABORATION WORKSPACE</span>
            </div>
            <span>2025</span>
          </div>

          {/* Anamorphic 21:9 Panoramic Letterbox */}
          <Link to="/work/frame" className="block relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 aspect-[16/9] sm:aspect-[21/9] bg-[#0A0A0A]">
            <img
              src={media.frameHero}
              alt="FRAME Collaborative Tool"
              className="w-full h-full object-cover object-center brightness-90 contrast-105 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] tracking-widest text-white/70 uppercase">
              ANAMORPHIC LETTERBOX · 21:9
            </div>

            {/* In-Frame Typography */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 max-w-lg space-y-2">
              <h3 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
                FRAME
              </h3>
              <p className="text-xs sm:text-sm font-sans text-white/80 line-clamp-2">
                Real-time canvas workspace bridging multi-disciplinary designers and developers with sub-pixel alignment.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold group-hover:text-white transition-colors">
                  <span>EXPLORE CASE STUDY</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>

        </div>
      </article>

      {/* ========================================================================= */}
      {/* SCENE 04: PULSE — Editorial Detail & Staggered Split                      */}
      {/* ========================================================================= */}
      <article className="py-20 sm:py-32 border-b border-white/10 relative overflow-hidden group bg-[#060606]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
          
          {/* Filmic Slate */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-8 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-white">04</span>
              <span className="text-white/20">/</span>
              <span className="text-[#FF3E00] font-semibold">FINANCIAL INTELLIGENCE</span>
            </div>
            <span>2024</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Main Visual */}
            <div className="lg:col-span-7">
              <Link to="/work/pulse" className="block relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 aspect-[16/10] bg-[#0A0A0A]">
                <img
                  src={media.pulseHero}
                  alt="PULSE Financial Intelligence"
                  className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                    PULSE
                  </h3>
                  <span className="text-xs font-mono uppercase text-white/60 tracking-wider">
                    HIGH-DENSITY DATA VISUALIZATION
                  </span>
                </div>
              </Link>
            </div>

            {/* Supporting Detail & Narrative */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-white/40">
                  SCENE BREAKDOWN
                </span>
                <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed">
                  Engineered for financial operators tracking real-time liquidity pipelines. Designed with ergonomic high-contrast dark modes to minimize eye fatigue during market volatility.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-white/60 space-y-1">
                <div>FOCUS: Wireframes, Prototypes, High-Density Visuals</div>
                <div>STACK: Figma, HTML/CSS, Modern JavaScript</div>
              </div>

              <div>
                <Link
                  to="/work/pulse"
                  className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors"
                >
                  <span>VIEW PULSE CASE STUDY</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </article>

    </section>
  );
};
