import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/site';
import { Link } from 'react-router-dom';

export const CinematicFilmHero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 flex flex-col justify-between overflow-hidden border-b border-white/10 bg-[#050505]">
      {/* Subtle cinematic radial vignette background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF3E00]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Filmic Scene Coordinates Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono tracking-widest text-white/50 uppercase border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
            <span className="text-white font-bold tracking-wider">{siteConfig.name}</span>
            <span className="text-white/20">/</span>
            <span className="text-white/70">ACT 01</span>
          </div>
          <div className="text-[11px] sm:text-xs tracking-wider text-white/50">
            {siteConfig.location}
          </div>
        </div>

        {/* Center Title Sequence: Architectural Typography */}
        <div className="my-auto py-12 sm:py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Monogram Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-white/10 bg-white/5 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-6 font-bold">
              <span>{siteConfig.initials}</span>
              <span className="text-white/30">|</span>
              <span className="text-white">PORTFOLIO</span>
            </div>

            {/* Giant Title Stack */}
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.92] break-words">
              DARSHIL S. BHUVA <br />
              <span className="text-white/40 block text-[0.82em] sm:text-[0.85em] font-light mt-1 sm:mt-2">
                UI/UX DESIGNER
              </span>
              <span className="italic font-light text-[#FF3E00] tracking-tight lowercase text-[0.78em] sm:text-[0.8em] block">
                · web designer / frontend
              </span>
            </h1>
          </motion.div>

          {/* Statement & Action Links */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end">
            <div className="md:col-span-7 space-y-3">
              <p className="text-base sm:text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-2xl">
                {siteConfig.tagline}
              </p>
              <p className="text-xs sm:text-sm font-mono text-white/50 tracking-wider uppercase pt-1">
                8+ Yrs UI/UX • 4+ Yrs Web Design & Frontend
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3 pt-2 md:pt-0">
              <a
                href="#cinematic-work"
                className="min-h-[48px] px-8 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all text-center inline-flex items-center justify-center space-x-2 shadow-xl shadow-[#FF3E00]/20"
              >
                <span>EXPLORE WORK</span>
                <ArrowDown size={14} />
              </a>
              <Link
                to="/contact"
                className="min-h-[48px] px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center inline-flex items-center justify-center space-x-2"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-white/50">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-white font-bold">SAAS & E-COMMERCE</span>
            <span className="text-white/20">/</span>
            <span>WIREFRAMING & PROTOTYPES</span>
            <span className="text-white/20">/</span>
            <span>HTML/CSS · JS · BOOTSTRAP</span>
          </div>

          <a href="#cinematic-work" className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[40px]">
            <span>SCROLL TO PROCEED</span>
            <ArrowDown size={13} />
          </a>
        </div>

      </div>
    </section>
  );
};
