import React from 'react';
import { Link } from 'react-router-dom';
import { media } from '../../data/media';
import { siteConfig } from '../../data/site';
import { ArrowUpRight } from 'lucide-react';

export const HomeAboutPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Tag */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-8">
          <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            02
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">ABOUT & CRAFT</span>
        </div>

        {/* Editorial Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative Side */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight sm:tracking-tighter text-white leading-[1.05] uppercase">
              BRIDGING SYSTEMIC PRODUCT DESIGN AND{' '}
              <span className="italic font-light text-[#FF3E00] tracking-tight lowercase">
                production
              </span>{' '}
              FRONTEND.
            </h2>

            <div className="space-y-4 text-muted-primary text-base sm:text-lg leading-relaxed border-t border-white/10 pt-6">
              <p>
                With <span className="text-white font-semibold">8+ years of UI/UX design</span> experience and <span className="text-white font-semibold">4+ years of frontend web implementation</span>, I take digital products from information architecture to production code.
              </p>
              <p>
                Designing directly with DOM mechanics and component state in mind eliminates handoff friction. Wireframes, design tokens, and web interfaces are conceived together—producing high-performance, accessible products.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                data-cursor="cta"
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors group min-h-[44px]"
              >
                <span>LEARN MORE ABOUT ME & MY APPROACH</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Portrait Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] group bg-[#0C0C0C] max-w-md mx-auto lg:max-w-none">
              <img
                src={media.designerPortrait}
                alt={`${siteConfig.name} Portrait & Workspace`}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#FF3E00] uppercase font-bold">
                  EXPERIENCE
                </span>
                <p className="text-sm font-mono text-white mt-1">
                  8+ Yrs UI/UX • 4+ Yrs Frontend
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
