import React from 'react';
import { ThreeDCard } from '../ui/ThreeDCard';
import { siteConfig } from '../../data/site';
import { media } from '../../data/media';
import { Layers, Monitor, Code2, Sparkles, Compass } from 'lucide-react';

export const Interactive3DAbout: React.FC = () => {
  return (
    <section id="about-section" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-6">
          <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            ABOUT
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">{siteConfig.name}</span>
        </div>

        {/* Large Statement */}
        <div className="mb-16 sm:mb-20 pb-10 border-b border-white/10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.92] mb-6">
            UI/UX DESIGNER <br />
            <span className="text-[#FF3E00]">WEB DESIGNER</span>
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            {siteConfig.designStatement}
          </p>
        </div>

        {/* Tactile 3D Depth Card Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Interactive 3D Portrait / Identity Card */}
          <div className="lg:col-span-5">
            <ThreeDCard maxRotation={6} depthZ={16} glareOpacity={0.2}>
              <div className="rounded-3xl border border-white/15 bg-[#0A0A0A] p-6 sm:p-7 shadow-2xl relative overflow-hidden [transform-style:preserve-3d]">
                
                {/* Layer 1: Subtle grid texture */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Layer 2: Portrait image */}
                <div
                  className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-black relative"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <img
                    src={media.designerPortrait}
                    alt={siteConfig.name}
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Location badge */}
                  <div
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-xs text-white"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    <span className="text-[11px] uppercase tracking-wider text-white/70">LOCATION</span>
                    <span className="text-[#FF3E00] font-bold">{siteConfig.location}</span>
                  </div>
                </div>

                {/* Layer 3: Identity Strip */}
                <div
                  className="pt-5 flex items-center justify-between font-mono text-xs"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded bg-white text-black font-extrabold flex items-center justify-center text-[10px]">
                      DS
                    </div>
                    <span className="text-white font-bold tracking-wider">{siteConfig.name}</span>
                  </div>
                  <span className="text-white/40">EST. 2018</span>
                </div>

              </div>
            </ThreeDCard>
          </div>

          {/* Right Column: Concise Information from Resume */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Core narrative */}
            <div className="space-y-4 text-white/80 leading-relaxed font-sans text-base sm:text-lg">
              <p>
                Based in Surat, Gujarat, I bridge user research and functional interface architecture. My work focuses on constructing clear user flows, interactive prototypes, and production-ready frontend styling that turns complex requirements into intuitive digital products.
              </p>
              <p className="text-sm sm:text-base text-white/60">
                Having hands-on web development experience allows me to design with real technical constraints in mind—avoiding unrealistic handoffs and ensuring 100% responsive performance across devices.
              </p>
            </div>

            {/* Depth stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">8+</div>
                <div className="text-[11px] font-mono uppercase text-[#FF3E00] tracking-wider">Years UI/UX</div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">4+</div>
                <div className="text-[11px] font-mono uppercase text-[#FF3E00] tracking-wider">Years Web/Code</div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">SaaS</div>
                <div className="text-[11px] font-mono uppercase text-[#FF3E00] tracking-wider">& E-Commerce</div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">Flows</div>
                <div className="text-[11px] font-mono uppercase text-[#FF3E00] tracking-wider">& Prototypes</div>
              </div>
            </div>

            {/* Disciplines breakdown */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                  <Compass size={13} className="text-[#FF3E00]" />
                  <span>DISCOVERY</span>
                </div>
                <p className="text-xs text-white/60 font-mono">
                  User flows, information architecture, wireframes
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                  <Monitor size={13} className="text-[#FF3E00]" />
                  <span>INTERFACE</span>
                </div>
                <p className="text-xs text-white/60 font-mono">
                  High-fidelity UI, component systems, prototypes
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                  <Code2 size={13} className="text-[#FF3E00]" />
                  <span>FRONTEND</span>
                </div>
                <p className="text-xs text-white/60 font-mono">
                  HTML/CSS, JavaScript, responsive frameworks
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
