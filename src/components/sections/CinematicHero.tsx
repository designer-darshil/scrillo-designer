import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteConfig } from '../../data/site';

export const CinematicHero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-between overflow-hidden border-b border-white/10 grid-bg-pattern">
      {/* Ambient background glow accent (subtle, GPU-accelerated) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF3E00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Annotation Bar: Positioning & Proven Experience */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono tracking-widest text-white/70 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] shrink-0" />
            <span className="text-white font-bold">{siteConfig.name}</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00] font-bold">8+ YRS UI/UX</span>
            <span className="text-white/20">•</span>
            <span className="text-white/80">4+ YRS FRONTEND</span>
          </div>

          <div className="font-handwritten text-lg sm:text-xl text-[#FF3E00]">
            "{siteConfig.tagline}"
          </div>
        </div>

        {/* Massive Editorial Headline & Clear Bio */}
        <div className="my-auto py-8 sm:py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-6 font-bold">
              <span>{siteConfig.initials}</span>
              <span className="text-white/30">/</span>
              <span className="text-white">{siteConfig.name}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight sm:tracking-tighter text-white leading-[0.95] sm:leading-[0.92] uppercase break-words">
              UI/UX DESIGNER <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] tracking-normal lowercase text-[0.88em] sm:text-[0.92em] block my-1 sm:my-2">
                + web designer / frontend
              </span>
            </h1>
          </motion.div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7 space-y-4">
              <p className="text-base sm:text-lg md:text-2xl text-white/90 font-normal leading-relaxed max-w-2xl">
                8+ years of UI/UX design experience. 4+ years of web design and frontend implementation. I design digital products with systemic precision and build them for the web.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-white/60 pt-2">
                <span className="flex items-center gap-1.5 text-white/90">
                  <CheckCircle2 size={13} className="text-[#FF3E00] shrink-0" />
                  8+ Years UI/UX Design
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5 text-white/90">
                  <Terminal size={13} className="text-[#FF3E00] shrink-0" />
                  4+ Years Web Design & Frontend
                </span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400">Production Systems</span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3 pt-4 md:pt-0">
              <a
                href="#selected-work"
                data-cursor="explore"
                className="min-h-[48px] px-8 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all text-center inline-flex items-center justify-center space-x-2 shadow-lg shadow-[#FF3E00]/25"
              >
                <span>EXPLORE WORK</span>
                <ArrowRight size={14} />
              </a>
              <Link
                to="/contact"
                data-cursor="cta"
                className="min-h-[48px] px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center inline-flex items-center justify-center"
              >
                <span>GET IN TOUCH</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Hero Metadata Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-white/60">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="text-white font-bold">8+ YRS UI/UX DESIGN</span>
            <span className="text-white/20">|</span>
            <span className="text-white font-bold">4+ YRS FRONTEND WEB</span>
          </div>

          <a href="#selected-work" className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px]">
            <span>SCROLL FOR SELECTED WORK</span>
            <ArrowDown size={13} />
          </a>
        </div>

      </div>
    </section>
  );
};
