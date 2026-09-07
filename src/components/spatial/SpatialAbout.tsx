import React from 'react';
import { siteConfig } from '../../data/site';
import { media } from '../../data/media';
import { ThreeDCard } from '../ui/ThreeDCard';
import { Compass, Monitor, Code2, MapPin, CheckCircle } from 'lucide-react';

export const SpatialAbout: React.FC = () => {
  return (
    <section id="spatial-about" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Spatial Header */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-6">
          <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
            02
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">SPATIAL INTRODUCTION</span>
        </div>

        {/* Editorial Heading answering 'Who is this designer?' */}
        <div className="mb-14 sm:mb-20 pb-8 border-b border-white/10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.9] mb-6">
            DESIGNER · <br />
            <span className="text-[#FF3E00]">VISUAL THINKER</span>
          </h2>
          <p className="max-w-3xl text-base sm:text-xl text-white/70 leading-relaxed font-normal">
            Specializing in user interface architecture, interactive web engineering, and cognitive design clarity. 8+ years designing digital products across SaaS and e-commerce platforms from Surat, Gujarat, India.
          </p>
        </div>

        {/* Asymmetrical Spatial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: 3D Portrait Specimen */}
          <div className="lg:col-span-5">
            <ThreeDCard maxRotation={6} depthZ={16} glareOpacity={0.18}>
              <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#141414] to-[#070707] p-6 sm:p-7 shadow-2xl relative overflow-hidden [transform-style:preserve-3d]">
                
                {/* Layer 1: Fine grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

                {/* Layer 2: Portrait image */}
                <div
                  className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-black relative"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <img
                    src={media.designerPortrait}
                    alt="Designer Portrait"
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Location Coordinate */}
                  <div
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-xs text-white"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-white/60">HOME BASE</span>
                    <span className="text-[#FF3E00] font-bold">{siteConfig.location}</span>
                  </div>
                </div>

                {/* Layer 3: Identity Monogram Bar */}
                <div
                  className="pt-5 flex items-center justify-between font-mono text-xs"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded bg-white text-black font-extrabold flex items-center justify-center text-xs">
                      {siteConfig.initials}
                    </div>
                    <span className="text-white font-bold tracking-wider">DS · DESIGN & ENGINEERING</span>
                  </div>
                  <span className="text-white/40">EST. 2018</span>
                </div>

              </div>
            </ThreeDCard>
          </div>

          {/* Right Column: Spatial Milestone Telemetry */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Primary Spatial Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A0A0A] space-y-2 hover:border-[#FF3E00]/40 transition-colors">
                <div className="text-4xl sm:text-6xl font-extrabold text-white font-mono leading-none">
                  8+<span className="text-[#FF3E00] text-2xl">YRS</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  UI/UX DESIGN
                </div>
                <p className="text-xs text-white/60 font-sans leading-relaxed pt-1">
                  Wireframes, interaction design, user flows, and Figma design systems.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A0A0A] space-y-2 hover:border-[#FF3E00]/40 transition-colors">
                <div className="text-4xl sm:text-6xl font-extrabold text-white font-mono leading-none">
                  4+<span className="text-[#FF3E00] text-2xl">YRS</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  WEB / FRONTEND
                </div>
                <p className="text-xs text-white/60 font-sans leading-relaxed pt-1">
                  HTML/CSS, JavaScript, Bootstrap, and responsive architecture.
                </p>
              </div>
            </div>

            {/* Specialization Domains */}
            <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090909] space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-white/40 uppercase tracking-widest">
                <Compass size={14} className="text-[#FF3E00]" />
                <span>PRIMARY SPECIALIZATIONS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                <div className="space-y-1">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
                    SaaS & Digital Platforms
                  </div>
                  <p className="text-xs text-white/60 font-mono">
                    Complex telemetry, command bars, high data density workflows.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
                    E-Commerce & Brands
                  </div>
                  <p className="text-xs text-white/60 font-mono">
                    Modern visual commerce, responsive catalogs, conversion journeys.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
                    Wireframes & Flows
                  </div>
                  <p className="text-xs text-white/60 font-mono">
                    Information architecture, structural sketches, UX journey mapping.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-white font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
                    Prototypes & Interaction
                  </div>
                  <p className="text-xs text-white/60 font-mono">
                    Interactive components, micro-animations, stakeholder reviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy Pill */}
            <div className="px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-white/70">
              <span>DESIGN PHILOSOPHY</span>
              <span className="text-white font-semibold">"Clarity, usability, and functional design come first."</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
