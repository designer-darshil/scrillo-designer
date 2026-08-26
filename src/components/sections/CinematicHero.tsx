import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Code2, Layers, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { PerspectiveCard } from '../ui/PerspectiveCard';
import { BrowserMockup } from '../ui/BrowserMockup';
import { media } from '../../data/media';

export const CinematicHero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-between overflow-hidden border-b border-white/10 grid-bg-pattern">
      {/* Ambient background glow accent (subtle, GPU-accelerated) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF3E00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Annotation Bar: Positioning & Proven Experience */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-white/70 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
            <span className="text-white font-bold">SCRILLO</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00] font-bold">8+ YRS UI/UX</span>
            <span className="text-white/20">•</span>
            <span className="text-white/80">4+ YRS FRONTEND</span>
          </div>

          <div className="font-handwritten text-lg sm:text-xl text-[#FF3E00]">
            "I design digital products and interfaces, then build them for the web."
          </div>
        </div>

        {/* Massive Editorial Headline & Clear Bio */}
        <div className="my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white leading-[0.92] uppercase">
              UI/UX DESIGN <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] tracking-normal lowercase text-[1.05em]">
                + frontend
              </span>{' '}
              <br />
              ENGINEERING.
            </h1>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-7 space-y-4">
              <p className="text-lg md:text-xl text-white/85 font-normal leading-relaxed max-w-2xl">
                Senior UI/UX Designer and Frontend Web Designer with 8+ years designing complex product interfaces and 4+ years building production-grade web systems in React and TypeScript.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
                <span className="flex items-center gap-1.5 text-white/90">
                  <CheckCircle2 size={13} className="text-[#FF3E00]" />
                  8+ Years UI/UX Architecture
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5 text-white/90">
                  <Terminal size={13} className="text-[#FF3E00]" />
                  4+ Years Web & Frontend Code
                </span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400">Production Systems</span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3 pt-4 md:pt-0">
              <Link
                to="/work"
                data-cursor="explore"
                className="px-6 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all text-center inline-flex items-center justify-center space-x-2 shadow-lg shadow-[#FF3E00]/25"
              >
                <span>EXPLORE WORK</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                data-cursor="cta"
                className="px-6 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center"
              >
                <span>GET IN TOUCH</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Layered Visual Composition: Featured Real-Time Product Case */}
        <div className="pt-10 pb-6 relative">
          <PerspectiveCard intensity={5} className="w-full">
            <div className="relative rounded-2xl border border-white/10 bg-[#0C0C0C]/90 p-4 md:p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
              
              {/* Top Bar of Composition */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-xs font-mono">
                <div className="flex items-center space-x-3 text-white/60">
                  <span className="px-2 py-0.5 rounded bg-[#FF3E00]/10 text-[#FF3E00] font-bold">
                    FEATURED CASE STUDY
                  </span>
                  <span className="hidden sm:inline text-white/40">NOVA TELEMETRY PLATFORM</span>
                </div>
                <div className="flex items-center space-x-2 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px]">PRODUCTION DESIGN SYSTEM</span>
                </div>
              </div>

              {/* Composition Grid: Screen, Design Tokens, Code Snippet */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Main Browser Mockup Viewport */}
                <div className="lg:col-span-8">
                  <BrowserMockup url="https://nova.systems.craft/telemetry" title="Nova Platform">
                    <div className="relative aspect-[16/10] overflow-hidden group">
                      <img
                        src={media.novaHero}
                        alt="Nova Platform UI/UX Case Study"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono text-[#FF3E00] uppercase tracking-wider font-bold">
                            CASE STUDY 01 / NOVA
                          </span>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            B2B SaaS Analytics & Command Center Interface
                          </h3>
                        </div>
                      </div>
                    </div>
                  </BrowserMockup>
                </div>

                {/* Side Stack: Design Tokens & Live Component Architecture */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Token Architecture */}
                  <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-white/60">
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <Layers size={13} className="text-[#FF3E00]" />
                        DESIGN TOKENS
                      </span>
                      <span className="text-[#FF3E00]">FIGMA → CODE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded bg-black/50 border border-white/5 flex items-center justify-between">
                        <span className="text-white/40">--brand-raw</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E00]" />
                          <span className="text-white">#FF3E00</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-black/50 border border-white/5 flex items-center justify-between">
                        <span className="text-white/40">--surface-0</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#080808]" />
                          <span className="text-white">#080808</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Production React Code */}
                  <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-white/60">
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <Code2 size={13} className="text-blue-400" />
                        FRONTEND CODE
                      </span>
                      <span className="text-white/40">React 18 + TS</span>
                    </div>
                    <pre className="p-3 rounded bg-black/80 text-[11px] font-mono text-white/80 overflow-x-auto border border-white/5">
                      <code>{`<TelemetryCanvas
  cluster="prod-core"
  theme={tokens.dark}
  layout="virtualized"
/>`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </PerspectiveCard>
        </div>

        {/* Bottom Hero Metadata Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-white/50">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="text-white font-bold">8+ YRS UI/UX DESIGN</span>
            <span className="text-white/20">|</span>
            <span className="text-white font-bold">4+ YRS FRONTEND WEB</span>
          </div>

          <div className="flex items-center space-x-2 text-white/70">
            <span>SCROLL FOR SELECTED WORK</span>
            <ArrowDown size={13} />
          </div>
        </div>

      </div>
    </section>
  );
};
