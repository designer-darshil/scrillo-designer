import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Layers, Terminal } from 'lucide-react';
import { media } from '../../data/media';

export const EditorialHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch / fine pointer
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsTouch(!mediaQuery.matches);

    const handlePointerTypeChange = (e: MediaQueryListEvent) => {
      setIsTouch(!e.matches);
    };

    mediaQuery.addEventListener('change', handlePointerTypeChange);
    return () => mediaQuery.removeEventListener('change', handlePointerTypeChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Scroll parallax for depth
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);
  const heroY = useTransform(scrollY, [0, 600], [0, 80]);

  // Subtle 3D rotations for the spatial canvas
  const rotateY = isTouch ? 0 : mousePos.x * 12;
  const rotateX = isTouch ? 0 : -mousePos.y * 10;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-12 border-b border-white/[0.08] overflow-hidden"
    >
      {/* Background Subtle Structural Hairlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="site-container relative z-10 flex-1 flex flex-col justify-between"
      >
        {/* Top Editorial Index Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-white/[0.08] text-xs font-mono tracking-widest text-white/50 uppercase">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">01</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00]">INTRODUCTION</span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <span>Surat, Gujarat, India</span>
            <span className="text-white/20">/</span>
            <span className="text-white/80">UI/UX · Web Design</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70">Available for projects</span>
          </div>
        </div>

        {/* Central Asymmetric Composition: Large Typography Overlapping Dimensional 3D Object */}
        <div className="my-auto py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Typographic Masthead */}
          <div className="lg:col-span-7 z-20 select-none">
            <h1 className="clamp-hero font-extrabold uppercase text-white editorial-title tracking-tight sm:tracking-tighter">
              <span className="block text-white">UI/UX</span>
              <span className="block text-white">DESIGNER</span>
              <span className="inline-block text-[#FF3E00] mr-3 font-light">+</span>
              <span className="inline-block text-white">WEB</span>
              <span className="block text-white/90">DESIGNER</span>
            </h1>

            <p className="mt-6 sm:mt-8 max-w-lg text-white/70 text-sm sm:text-base md:text-lg font-normal leading-relaxed text-pretty">
              Focused on cognitive clarity, structural typography, and disciplined digital experiences for web applications and SaaS products.
            </p>
          </div>

          {/* Dimensional 3D Spatial Interface Object */}
          <div className="lg:col-span-5 relative [perspective:1200px] flex items-center justify-center lg:justify-end">
            <motion.div
              animate={{
                rotateX,
                rotateY,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8 }}
              className="relative w-full max-w-[420px] aspect-[4/3] rounded-lg border border-white/15 bg-[#0C0C0C]/90 p-4 sm:p-5 shadow-2xl shadow-black/80 backdrop-blur-xl [transform-style:preserve-3d]"
            >
              {/* Top Browser Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] [transform:translateZ(15px)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 tracking-wider uppercase">
                  <Terminal size={11} className="text-[#FF3E00]" />
                  <span>DS.SPATIAL // VIEWPORT</span>
                </div>
              </div>

              {/* Main Object Inner Surface */}
              <div className="relative mt-4 aspect-video rounded overflow-hidden border border-white/10 bg-black/60 [transform:translateZ(25px)]">
                <img
                  src={media.novaHero}
                  alt="Spatial Interface Canvas"
                  className="w-full h-full object-cover opacity-75 grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white/80">
                  <span>INTERFACE ARCHITECTURE</span>
                  <span className="text-[#FF3E00]">01 / NOVA</span>
                </div>
              </div>

              {/* Secondary Layer: Floating Perspective Spec Card */}
              <motion.div
                animate={{
                  x: isTouch ? 0 : mousePos.x * 16,
                  y: isTouch ? 0 : mousePos.y * 14,
                }}
                transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                className="absolute -bottom-5 -left-4 sm:-left-8 w-44 sm:w-52 p-3 rounded border border-white/20 bg-[#121212]/95 backdrop-blur-md shadow-xl [transform:translateZ(45px)]"
              >
                <div className="flex items-center justify-between mb-1.5 font-mono text-[9px] text-[#FF3E00] uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Layers size={10} />
                    <span>SPEC</span>
                  </span>
                  <span>OKLCH DARK</span>
                </div>
                <div className="space-y-1 font-mono text-[10px] text-white/70">
                  <div className="flex justify-between">
                    <span className="text-white/40">Grid:</span>
                    <span className="text-white">Editorial 12-Col</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Type:</span>
                    <span className="text-white">Responsive clamp()</span>
                  </div>
                </div>
              </motion.div>

              {/* Tertiary Layer: Floating Chip */}
              <motion.div
                animate={{
                  x: isTouch ? 0 : -mousePos.x * 20,
                  y: isTouch ? 0 : -mousePos.y * 18,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="absolute -top-3 -right-3 px-2.5 py-1 rounded border border-[#FF3E00]/40 bg-[#FF3E00]/10 backdrop-blur-md shadow-lg font-mono text-[10px] text-white flex items-center gap-1.5 [transform:translateZ(55px)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
                <span>3D PERSPECTIVE</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Editorial Meta Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-white/50">
          <div className="flex items-center gap-4">
            <span className="text-white/80">SCROLL FOR SELECTED WORK</span>
            <span className="text-white/20">/</span>
            <span>2024 — 2026 ARCHIVE</span>
          </div>

          <a
            href="#selected-work"
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#FF3E00] transition-colors group"
            aria-label="Scroll to selected work"
          >
            <span>EXPLORE PROJECTS</span>
            <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};
