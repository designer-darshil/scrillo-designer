import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/site';
import { media } from '../../data/media';

export const Interactive3DHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cachedBounds = useRef<DOMRect | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for physical 3D slab rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Spring physics for natural weight and responsiveness
  const springConfig = { damping: 26, stiffness: 220, mass: 0.85 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsDisabled(isTouch || reducedMotion);
  }, []);

  const handleMouseEnter = () => {
    if (isDisabled || !containerRef.current) return;
    cachedBounds.current = containerRef.current.getBoundingClientRect();
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    let bounds = cachedBounds.current;
    if (!bounds && containerRef.current) {
      bounds = containerRef.current.getBoundingClientRect();
      cachedBounds.current = bounds;
    }
    if (!bounds || bounds.width === 0 || bounds.height === 0) return;

    // Relative mouse position from container center (-0.5 to +0.5)
    const normX = (e.clientX - bounds.left) / bounds.width - 0.5;
    const normY = (e.clientY - bounds.top) / bounds.height - 0.5;

    // Subtle restrained tilt: 4° max on X, 6° max on Y
    rotateX.set(-normY * 7);
    rotateY.set(normX * 8);
  };

  const handleMouseLeave = () => {
    cachedBounds.current = null;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden border-b border-white/10 bg-[#050505] [perspective:1400px]"
    >
      {/* Ambient background subtle lighting (strictly controlled) */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#FF3E00]/[0.035] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Status & Identity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-white/50 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
            <span className="text-white font-bold tracking-wider">{siteConfig.name}</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70">3D INTERACTIVE PORTFOLIO</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AVAILABLE FOR WORK
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-white/60">{siteConfig.location}</span>
          </div>
        </div>

        {/* Center Hero Grid: Massive Typography (Left) + Interactive 3D Slab (Right) */}
        <div className="my-auto py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Typography Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs font-mono tracking-widest text-white/80 uppercase">
              <span className="w-2 h-2 rounded-sm bg-[#FF3E00]" />
              <span>DIGITAL PRODUCT & WEB DESIGN</span>
            </div>

            {/* Massive modern typography */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-extrabold uppercase tracking-tight sm:tracking-tighter text-white leading-[0.92] break-words">
                DARSHIL S. <br />
                <span className="text-white">BHUVA</span>
              </h1>
              
              <div className="pt-2">
                <div className="text-xl sm:text-3xl md:text-4xl font-semibold text-white/80 tracking-tight uppercase">
                  UI/UX DESIGNER
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-light text-[#FF3E00] tracking-tight uppercase">
                  WEB DESIGNER
                </div>
              </div>
            </div>

            {/* Concise professional summary from resume */}
            <p className="max-w-xl text-sm sm:text-base md:text-lg text-white/70 leading-relaxed font-normal">
              Designing digital experiences and interfaces with focus on clarity, usability, and thoughtful interaction. 8+ years in UI/UX and 4+ years in frontend web engineering across SaaS and e-commerce.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#projects-section"
                className="min-h-[48px] px-7 py-3.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all inline-flex items-center justify-center space-x-2 shadow-xl shadow-[#FF3E00]/25"
              >
                <span>EXPLORE WORK</span>
                <ArrowDown size={14} />
              </a>
              <Link
                to="/contact"
                className="min-h-[48px] px-7 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/40 transition-all inline-flex items-center justify-center space-x-2"
              >
                <span>LET'S CONNECT</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Interactive 3D Physical Object / Multi-Layer Product Slab */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end [perspective:1200px]">
            <motion.div
              style={{
                rotateX: isDisabled ? 0 : smoothRotateX,
                rotateY: isDisabled ? 0 : smoothRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[460px] aspect-[4/5] sm:aspect-[1/1] rounded-3xl border border-white/15 bg-gradient-to-b from-[#151515] to-[#0A0A0A] p-6 sm:p-7 shadow-2xl transition-shadow duration-300 will-change-transform flex flex-col justify-between"
            >
              {/* Layer 1: Background Glass Grid Pattern */}
              <div
                className="absolute inset-0 rounded-3xl opacity-40 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"
                style={{ transform: 'translateZ(5px)' }}
              />

              {/* Layer 2: Top Monogram & Interactive Chip Bar */}
              <div
                className="relative z-10 flex items-center justify-between"
                style={{ transform: 'translateZ(30px)' }}
              >
                {/* DS Monogram in White Square */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-md bg-white text-black font-extrabold text-sm flex items-center justify-center tracking-wider shadow-lg select-none">
                    DS
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white tracking-wider">SYSTEM 01</div>
                    <div className="text-[10px] font-mono text-white/50 uppercase">PHYSICAL DEPTH LAYER</div>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Layer 3: Central High-Fidelity Floating Project Preview Tile */}
              <div
                className="relative z-20 my-auto rounded-2xl overflow-hidden border border-white/15 bg-[#080808] shadow-2xl group"
                style={{ transform: 'translateZ(50px)' }}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={media.novaHero}
                    alt="NOVA Platform Interface"
                    className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Floating badge inside preview */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 font-mono text-[10px] text-white font-semibold">
                    FEATURED SPECIMEN
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase text-[#FF3E00] font-bold tracking-wider">NOVA SYSTEMS</div>
                      <div className="text-sm font-bold text-white">B2B Telemetry & UI Architecture</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 text-white/90">2026</span>
                  </div>
                </div>
              </div>

              {/* Layer 4: Bottom Depth Metadata Pill Array */}
              <div
                className="relative z-30 pt-2 flex flex-wrap items-center justify-between gap-2"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="flex items-center space-x-2 text-[11px] font-mono text-white/70">
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">FIGMA</span>
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">REACT / TS</span>
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">CSS 3D</span>
                </div>

                <div className="text-[11px] font-mono text-[#FF3E00] font-bold flex items-center gap-1">
                  <span>3D TACTILE HOVER</span>
                </div>
              </div>

              {/* Layer 5: Accent Depth Highlights */}
              <div
                className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#FF3E00] shadow-[0_0_12px_#FF3E00]"
                style={{ transform: 'translateZ(65px)' }}
              />
            </motion.div>
          </div>

        </div>

        {/* Bottom Slate Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-white/40">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>SELECTED WORK · 01 — 04</span>
            <span className="text-white/20">/</span>
            <span>SAAS & E-COMMERCE</span>
            <span className="text-white/20">/</span>
            <span>SURAT, GUJARAT, INDIA</span>
          </div>

          <a href="#projects-section" className="flex items-center space-x-2 text-white/60 hover:text-[#FF3E00] transition-colors min-h-[40px]">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={13} />
          </a>
        </div>

      </div>
    </section>
  );
};
