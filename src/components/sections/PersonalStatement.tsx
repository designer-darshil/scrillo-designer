import React from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../../data/site';
import { media } from '../../data/media';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PersonalStatement: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Tag */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-8">
          <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            01
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">PHILOSOPHY & POSITIONING</span>
        </div>

        {/* Editorial Statement Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Giant Typographic Manifesto */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.04] uppercase">
              I DESIGN DIGITAL PRODUCTS THAT LOOK{' '}
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.1em]">
                distinct
              </span>{' '}
              AND WORK CLEARLY.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-muted-primary text-sm md:text-base leading-relaxed">
              <p>
                Scrillo is a UI/UX and frontend designer focused on creating thoughtful digital interfaces, responsive websites, and polished interactions. Every project begins with deep information architecture before arriving at visual finesse.
              </p>
              <p>
                Too much digital design today is either an unusable art experiment or a sterile corporate template. I operate in the intentional middle: crafted, memorable design backed by production-ready React and TypeScript.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-6">
              <Link
                to="/about"
                data-cursor="cta"
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors group"
              >
                <span>READ DESIGN PHILOSOPHY</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Studio Desk & Personal Annotation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/5] group">
              <img
                src={media.designerPortrait}
                alt="Scrillo Workspace & Design Desk"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#FF3E00] uppercase font-bold">
                  STUDIO PERSPECTIVE
                </span>
                <p className="text-xs font-mono text-white/80 mt-1">
                  Bangalore • Design-to-Code Craft
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
              <p className="font-handwritten text-xl text-[#FF3E00]">
                "The work is the hero. The interface frames the work."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
