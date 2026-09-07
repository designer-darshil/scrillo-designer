import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Compass, Sparkles, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/site';
import { media } from '../../data/media';

export const SpatialHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cachedRect = useRef<DOMRect | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // Motion values for physical 3D rotation & parallax
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 200, mass: 0.85 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsDisabled(isTouch || reducedMotion);
  }, []);

  const handleMouseEnter = () => {
    if (isDisabled || !containerRef.current) return;
    cachedRect.current = containerRef.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    let rect = cachedRect.current;
    if (!rect && containerRef.current) {
      rect = containerRef.current.getBoundingClientRect();
      cachedRect.current = rect;
    }
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    rotateX.set(-normY * 8);
    rotateY.set(normX * 10);
  };

  const handleMouseLeave = () => {
    cachedRect.current = null;
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[95vh] flex flex-col justify-between pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden border-b border-white/10 bg-[#050505] [perspective:1600px] select-none"
    >
      {/* Subtle controlled spatial lighting */}
      <div className="absolute top-1/3 left-1/4 w-[650px] h-[650px] bg-[#FF3E00]/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[450px] h-[450px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Spatial Coordinate & Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-white/40 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
            <span className="text-white font-bold tracking-wider">{siteConfig.name}</span>
            <span className="text-white/20">•</span>
            <span className="text-white/60">SPATIAL PORTFOLIO 2026</span>
          </div>

          <div className="flex items-center space-x-5 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AVAILABLE FOR COLLABORATION
            </span>
            <span className="hidden sm:inline text-white/30">/</span>
            <span className="hidden sm:inline text-white/60">{siteConfig.location}</span>
          </div>
        </div>

        {/* Center Stage: Integrated Typographic Architecture + 3D Specimen Slab */}
        <div className="my-auto py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left / Upper: Massive Asymmetrical Typography */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono tracking-widest text-[#FF3E00] uppercase font-bold">
              <span>00</span>
              <span className="text-white/30">/</span>
              <span className="text-white">INTERACTIVE DESIGN SPECIMEN</span>
            </div>

            {/* Oversized Architectural Typography */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-extrabold uppercase tracking-tight sm:tracking-tighter text-white leading-[0.88] break-words">
                DARSHIL S. <br />
                <span className="text-white/90">BHUVA</span>
              </h1>
              
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-2">
                <span className="text-2xl sm:text-4xl md:text-5xl font-light text-white/60 uppercase tracking-tight">
                  UI/UX DESIGNER
                </span>
                <span className="text-xl sm:text-3xl md:text-4xl font-semibold text-[#FF3E00] uppercase tracking-tight">
                  · WEB DESIGNER
                </span>
              </div>
            </div>

            <p className="max-w-xl text-base sm:text-lg text-white/70 leading-relaxed font-normal">
              An interactive 3D portfolio exploring physical depth, cognitive interface clarity, and tactile digital products. 8+ years designing across SaaS and e-commerce platforms.
            </p>

            {/* Spatial Navigation Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#spatial-gallery"
                className="min-h-[48px] px-8 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all inline-flex items-center justify-center space-x-2 shadow-xl shadow-[#FF3E00]/25"
              >
                <span>ENTER GALLERY</span>
                <ArrowDownRight size={15} />
              </a>
              <Link
                to="/contact"
                className="min-h-[48px] px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/40 transition-all inline-flex items-center justify-center space-x-2"
              >
                <span>START A PROJECT</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right / Foreground: Floating 3D Specimen Stage (Tactile Product Slab) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end [perspective:1400px]">
            <motion.div
              style={{
                rotateX: isDisabled ? 0 : smoothRotateX,
                rotateY: isDisabled ? 0 : smoothRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[460px] aspect-[4/5] sm:aspect-square rounded-3xl border border-white/15 bg-gradient-to-b from-[#141414] via-[#0E0E0E] to-[#070707] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] will-change-transform flex flex-col justify-between [transform-style:preserve-3d]"
            >
              {/* Background Precision Grid */}
              <div
                className="absolute inset-0 rounded-3xl opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
                style={{ transform: 'translateZ(4px)' }}
              />

              {/* Layer 1: Monogram & Live Status */}
              <div
                className="relative z-10 flex items-center justify-between"
                style={{ transform: 'translateZ(28px)' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-md bg-white text-black font-extrabold text-sm flex items-center justify-center tracking-wider shadow-lg">
                    {siteConfig.initials}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white tracking-wider">SPECIMEN 01</div>
                    <div className="text-[10px] font-mono text-white/50 uppercase">TELEMETRY ARCHITECTURE</div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>

              {/* Layer 2: Central Floating Telemetry Canvas */}
              <div
                className="relative z-20 my-auto rounded-2xl overflow-hidden border border-white/15 bg-[#080808] shadow-2xl group"
                style={{ transform: 'translateZ(50px)' }}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={media.novaHero}
                    alt="NOVA Platform Specimen"
                    className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 font-mono text-[10px] text-white font-semibold">
                    CORE CANVAS
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#FF3E00] font-bold tracking-wider">NOVA SYSTEMS</div>
                      <div className="text-xs sm:text-sm font-bold text-white">SaaS Incident Telemetry Canvas</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">2026</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Spatial Telemetry Chips */}
              <div
                className="relative z-30 pt-2 flex flex-wrap items-center justify-between gap-2"
                style={{ transform: 'translateZ(38px)' }}
              >
                <div className="flex items-center space-x-2 text-[10px] font-mono text-white/70">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">8+ YRS UI/UX</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">FRONTEND</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">FIGMA</span>
                </div>

                <div className="text-[10px] font-mono text-[#FF3E00] font-bold">
                  TACTILE 3D DEPTH
                </div>
              </div>

              {/* Layer 4: Accent Light Anchor */}
              <div
                className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#FF3E00] shadow-[0_0_16px_#FF3E00]"
                style={{ transform: 'translateZ(65px)' }}
              />
            </motion.div>
          </div>

        </div>

        {/* Bottom Coordinates Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-white/40">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>SPATIAL CANVAS</span>
            <span className="text-white/20">/</span>
            <span>NO TEMPLATES</span>
            <span className="text-white/20">/</span>
            <span>SURAT, GUJARAT, INDIA</span>
          </div>

          <a href="#spatial-gallery" className="flex items-center space-x-2 text-white/60 hover:text-[#FF3E00] transition-colors min-h-[40px]">
            <span>EXPLORE GALLERY</span>
            <ArrowDownRight size={13} />
          </a>
        </div>

      </div>
    </section>
  );
};
