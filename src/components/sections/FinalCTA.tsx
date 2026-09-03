import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Sparkles } from 'lucide-react';
import { siteConfig } from '../../data/site';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#FF3E00]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs font-mono text-white/80 mb-6">
          <Sparkles size={12} className="text-[#FF3E00]" />
          <span>START A PROJECT IN 2026</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.95] max-w-4xl mx-auto break-words">
          LET'S CREATE A PRODUCT THAT FEELS{' '}
          <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
            irreplaceable.
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-muted-primary text-base md:text-lg leading-relaxed mt-6 sm:mt-8 font-normal">
          Whether you need a complete product redesign, a comprehensive design system, or a bespoke creative web build from scratch.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            data-cursor="cta"
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#FF3E00]/25 flex items-center justify-center space-x-2"
          >
            <span>START A CONVERSATION</span>
            <ArrowUpRight size={16} />
          </Link>

          <a
            href={`mailto:${siteConfig.email}`}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Mail size={14} className="text-white/60" />
            <span>{siteConfig.email}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
