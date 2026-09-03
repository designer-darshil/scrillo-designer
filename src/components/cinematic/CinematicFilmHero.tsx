import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/site';
import { media } from '../../data/media';
import { Link } from 'react-router-dom';

export const CinematicFilmHero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden border-b border-white/10 bg-[#030303]">
      
      {/* Cinematic Full-Bleed Film Still Photographic Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={media.heroWorkspace}
          alt="Atmospheric Studio Scene"
          className="w-full h-full object-cover object-center opacity-35 brightness-75 contrast-125 scale-105"
          decoding="async"
        />
        {/* Layered cinematic grading: Deep black edge-vignette & subtle ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/70 to-[#030303]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#030303]/60 to-[#030303]" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[300px] bg-[#FF3E00]/5 rounded-full blur-[180px] pointer-events-none" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 w-full flex-1 flex flex-col justify-between relative z-10 pt-28 pb-12 sm:pt-36 sm:pb-16">
        
        {/* Top Film Coordinate Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
            <span className="text-white font-bold tracking-wider">{siteConfig.name}</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70">ACT 01 : PROLOGUE</span>
          </div>
          
          <div className="flex items-center space-x-6 text-[11px]">
            <span>{siteConfig.location}</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-[#FF3E00] font-semibold">2026 ARCHIVE</span>
          </div>
        </div>

        {/* Dramatic Film Title Composition (Asymmetric & Integrated) */}
        <div className="my-auto py-12 sm:py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimal DS Monogram Mark */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm border border-white/15 bg-black/60 backdrop-blur-md text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-8 font-bold">
              <span>{siteConfig.initials}</span>
              <span className="text-white/30">/</span>
              <span className="text-white">FILM PORTFOLIO</span>
            </div>

            {/* Massive Film Title Typography */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.8rem] xl:text-[9.5rem] font-extrabold uppercase tracking-tighter text-white leading-[0.88] break-words">
                DARSHIL S.
              </h1>
              <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.8rem] xl:text-[9.5rem] font-extrabold uppercase tracking-tighter text-white leading-[0.88] break-words">
                  BHUVA
                </h1>
                
                {/* Secondary Offset Discipline Title */}
                <div className="lg:text-right font-sans max-w-lg lg:pb-3">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-light text-white/50 block tracking-tight uppercase">
                    UI/UX DESIGNER
                  </span>
                  <span className="italic font-light text-[#FF3E00] text-xl sm:text-3xl md:text-4xl tracking-tight lowercase block">
                    · web designer / frontend
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Asymmetric Metadata & Scene Launchers */}
          <div className="mt-10 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7 space-y-3">
              <p className="text-base sm:text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-xl">
                {siteConfig.tagline}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider text-white/50 pt-1">
                <span className="text-white/90 font-semibold">8+ YEARS UI/UX</span>
                <span className="text-white/30">•</span>
                <span className="text-white/90 font-semibold">4+ YEARS WEB / FRONTEND</span>
                <span className="text-white/30">•</span>
                <span className="text-emerald-400">SURAT, GUJARAT, INDIA</span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3.5">
              <a
                href="#cinematic-work"
                className="min-h-[48px] px-8 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all text-center inline-flex items-center justify-center space-x-2 shadow-xl shadow-[#FF3E00]/25"
              >
                <span>EXPLORE SCENES</span>
                <ArrowDown size={14} />
              </a>
              <Link
                to="/contact"
                className="min-h-[48px] px-8 py-3.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center inline-flex items-center justify-center space-x-2"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Filmic Slate Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>SCENE 01 — 04</span>
            <span className="text-white/20">/</span>
            <span>SAAS & E-COMMERCE</span>
            <span className="text-white/20">/</span>
            <span>PRODUCTION CODE</span>
          </div>

          <a href="#cinematic-work" className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors min-h-[40px]">
            <span>SCROLL TO ADVANCE SCENE</span>
            <ArrowDown size={13} />
          </a>
        </div>

      </div>
    </section>
  );
};
