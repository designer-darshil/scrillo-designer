import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, Layers, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { projects } from '../../data/projects';

export const SpatialProjectShowcase: React.FC = () => {
  const showcaseProjects = projects.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = showcaseProjects[activeIndex];
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const cachedBounds = useRef<DOMRect | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Motion Values
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 220, mass: 0.8 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsDisabled(isTouch || reducedMotion);
  }, []);

  // Keyboard navigation for spatial project switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveIndex((prev) => (prev + 1) % showcaseProjects.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveIndex((prev) => (prev - 1 + showcaseProjects.length) % showcaseProjects.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showcaseProjects.length]);

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

    const normX = (e.clientX - bounds.left) / bounds.width - 0.5;
    const normY = (e.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(-normY * 7);
    rotateY.set(normX * 8);
  };

  const handleMouseLeave = () => {
    cachedBounds.current = null;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % showcaseProjects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + showcaseProjects.length) % showcaseProjects.length);
  };

  return (
    <section
      id="spatial-gallery"
      className="section-padding bg-[#050505] border-b border-white/10 relative overflow-hidden select-none"
    >
      <div className="site-container">
        
        {/* Spatial Gallery Header & Coordinates */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-3 sm:mb-4">
              <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                GALLERY
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">3D PROJECT MONOLITH</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
              SELECTED <br />
              <span className="text-white/50">PROJECTS.</span>
            </h2>
          </div>

          {/* Spatial Selector Pills */}
          <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {showcaseProjects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`min-h-[38px] whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                    activeIndex === idx
                      ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  0{idx + 1} {p.title}
                </button>
              ))}
            </div>

            <span className="text-[10px] sm:text-[11px] font-mono text-white/40">
              USE ARROW KEYS OR BUTTONS TO ROTATE SPECIMENS
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTRAL 3D MONOLITH VIEWPORT                                              */}
        {/* ========================================================================= */}
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full [perspective:1400px] mb-8 sm:mb-12"
        >
          <motion.div
            style={{
              rotateX: isDisabled ? 0 : smoothRotateX,
              rotateY: isDisabled ? 0 : smoothRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="w-full rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111] via-[#0A0A0A] to-[#050505] p-5 sm:p-8 lg:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-500 will-change-transform [transform-style:preserve-3d]"
          >
            {/* Background fine grid overlay */}
            <div
              className="absolute inset-0 rounded-3xl opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
              style={{ transform: 'translateZ(5px)' }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center [transform-style:preserve-3d]"
              >
                {/* Visual Stage (Left / Primary Surface) */}
                <div className="lg:col-span-7 [transform-style:preserve-3d]">
                  <div
                    onClick={() => navigate(`/work/${activeProject.slug}`)}
                    className="cursor-pointer group relative rounded-2xl overflow-hidden border border-white/15 aspect-[16/10] bg-black shadow-2xl transition-all duration-500"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <img
                      src={activeProject.heroImage}
                      alt={activeProject.title}
                      className="w-full h-full object-cover brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Floating Specimen Index Badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono text-xs text-white"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      <span className="text-[#FF3E00] font-bold">0{activeIndex + 1}</span>
                      <span className="text-white/40"> / 0{showcaseProjects.length}</span>
                    </div>

                    {/* Corner Tag */}
                    <div
                      className="absolute bottom-4 left-4 right-4 flex items-end justify-between"
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                          {activeProject.categoryLabel}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
                          {activeProject.title}
                        </h4>
                      </div>

                      <span className="px-3 py-1 rounded bg-white/10 text-white font-mono text-xs font-semibold backdrop-blur-sm">
                        {activeProject.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spatial Metadata Column (Right / Depth Labels) */}
                <div className="lg:col-span-5 space-y-6 [transform-style:preserve-3d]">
                  
                  {/* Layer: Title & Category */}
                  <div style={{ transform: 'translateZ(45px)' }} className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                      {activeProject.categoryLabel}
                    </span>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight text-balance">
                      {activeProject.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans pt-1 text-pretty">
                      {activeProject.subtitle}
                    </p>
                  </div>

                  {/* Layer: Technical Specifications */}
                  <div style={{ transform: 'translateZ(55px)' }} className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {activeProject.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono text-white/50 pt-2">
                      <div>
                        <span className="text-white/30 uppercase block">CLIENT</span>
                        <span className="text-white/80 font-semibold">{activeProject.client}</span>
                      </div>
                      <div>
                        <span className="text-white/30 uppercase block">TIMELINE</span>
                        <span className="text-white/80 font-semibold">{activeProject.timeline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Layer: Explore CTA Button */}
                  <div style={{ transform: 'translateZ(65px)' }} className="pt-2">
                    <Link
                      to={`/work/${activeProject.slug}`}
                      className="group inline-flex items-center space-x-3 min-h-[48px] px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#FF3E00] hover:text-white transition-all duration-300 shadow-2xl"
                    >
                      <span>EXPLORE PROJECT</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

          </motion.div>
        </div>

        {/* Spatial Navigation Controls (Bottom Bar) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-white/10">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={prevProject}
              className="min-h-[44px] px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest text-white flex items-center space-x-2"
              aria-label="Previous project specimen"
            >
              <ArrowLeft size={13} />
              <span>PREV</span>
            </button>

            <button
              onClick={nextProject}
              className="min-h-[44px] px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest text-white flex items-center space-x-2"
              aria-label="Next project specimen"
            >
              <span>NEXT</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="text-xs font-mono uppercase tracking-widest text-white/40">
            SPECIMEN {activeIndex + 1} OF {showcaseProjects.length}
          </div>

          <Link
            to="/work"
            className="min-h-[44px] inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-[#FF3E00] transition-colors"
          >
            <span>ALL PROJECTS ARCHIVE ({projects.length})</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
};
