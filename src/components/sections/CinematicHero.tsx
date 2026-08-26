import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Code2, Layers, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { PerspectiveCard } from '../ui/PerspectiveCard';
import { BrowserMockup } from '../ui/BrowserMockup';
import { media } from '../../data/media';

export const CinematicHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-between overflow-hidden border-b border-white/10 grid-bg-pattern"
    >
      {/* Ambient background glow accents (subtle, non-intrusive) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF3E00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Annotation & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-white/60 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00]" />
            <span>PORTFOLIO 2026</span>
            <span className="text-white/20">/</span>
            <span className="text-white/90">INDEPENDENT CRAFT</span>
          </div>

          <div className="font-handwritten text-lg sm:text-xl text-[#FF3E00]">
            "designing interfaces, then bringing them to life."
          </div>
        </div>

        {/* Massive Editorial Headline */}
        <div className="my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white leading-[0.92] uppercase">
              I DESIGN <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] tracking-normal lowercase text-[1.05em]">
                digital
              </span>{' '}
              EXPERIENCES.
            </h1>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-7 space-y-3">
              <p className="text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-2xl">
                Senior UI/UX Designer & Frontend Web Designer. Crafting high-clarity SaaS interfaces, design systems, and responsive web products where every pixel is backed by production code.
              </p>
              <div className="flex items-center space-x-4 pt-2 text-xs font-mono text-white/50">
                <span className="flex items-center gap-1.5 text-white/80">
                  <CheckCircle2 size={13} className="text-[#FF3E00]" />
                  Zero Layout Shift
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Terminal size={13} className="text-[#FF3E00]" />
                  Figma to React Fidelity
                </span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-3 pt-4 md:pt-0">
              <Link
                to="/work"
                data-cursor="explore"
                className="px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#FF3E00] hover:text-white transition-all text-center"
              >
                EXPLORE WORK (08)
              </Link>
              <Link
                to="/contact"
                data-cursor="cta"
                className="px-6 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center"
              >
                LET'S TALK →
              </Link>
            </div>
          </div>
        </div>

        {/* Art-Directed Multi-Layered Visual Composition */}
        <motion.div
          style={{ opacity }}
          className="pt-12 pb-8 relative"
        >
          <PerspectiveCard intensity={8} className="w-full">
            <div className="relative rounded-2xl border border-white/10 bg-[#0C0C0C]/90 p-4 md:p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
              
              {/* Top Bar of Composition */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-xs font-mono">
                <div className="flex items-center space-x-3 text-white/60">
                  <span className="px-2 py-0.5 rounded bg-[#FF3E00]/10 text-[#FF3E00] font-bold">
                    SYSTEMS ARCHITECTURE
                  </span>
                  <span className="hidden sm:inline text-white/40">NOVA TELEMETRY CANVAS v2.6</span>
                </div>
                <div className="flex items-center space-x-2 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px]">60 FPS RENDER</span>
                </div>
              </div>

              {/* Composition Grid: Layered Screens, Code Snippet, Design Tokens */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Main Browser Mockup Viewport */}
                <div className="lg:col-span-8">
                  <BrowserMockup url="https://nova.systems.craft/telemetry" title="Nova Stream">
                    <div className="relative aspect-[16/10] overflow-hidden group">
                      <img
                        src={media.novaHero}
                        alt="Nova Platform Interface"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono text-[#FF3E00] uppercase tracking-wider font-bold">
                            CASE STUDY 01 / NOVA
                          </span>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            Real-time Telemetry Command Engine
                          </h3>
                        </div>
                      </div>
                    </div>
                  </BrowserMockup>
                </div>

                {/* Side Stack: Design Tokens & Live Code Card */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Token Inspector Widget */}
                  <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-white/60">
                      <span className="flex items-center gap-1.5 text-white">
                        <Layers size={13} className="text-[#FF3E00]" />
                        DESIGN TOKENS
                      </span>
                      <span className="text-[#FF3E00]">FIGMA → CSS</span>
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

                  {/* Live Code Snippet Widget */}
                  <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-white/60">
                      <span className="flex items-center gap-1.5 text-white">
                        <Code2 size={13} className="text-blue-400" />
                        FRONTEND CODE
                      </span>
                      <span className="text-white/40">React TSX</span>
                    </div>
                    <pre className="p-3 rounded bg-black/80 text-[11px] font-mono text-white/80 overflow-x-auto border border-white/5">
                      <code>{`<TelemetryCard
  cluster="prod-eu-west"
  fps={120}
  tokens={theme.dark}
/>`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </PerspectiveCard>
        </motion.div>

        {/* Bottom Hero Metadata Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-white/50">
          <div className="flex items-center space-x-6">
            <span className="text-white font-bold">UI/UX DESIGN</span>
            <span className="text-white/20">|</span>
            <span className="text-white font-bold">FRONTEND WEB DESIGN</span>
          </div>

          <div className="flex items-center space-x-2 text-white/70 hover:text-[#FF3E00] transition-colors cursor-pointer">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={13} className="animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
};
