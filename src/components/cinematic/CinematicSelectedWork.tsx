import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { ArrowUpRight } from 'lucide-react';

export const CinematicSelectedWork: React.FC = () => {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section id="cinematic-work" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Lead: Act 02 Scene Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-3">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                ACT 02
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">SELECTED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
              CINEMATIC <br />
              <span className="italic font-light text-[#FF3E00] lowercase">projects.</span>
            </h2>
          </div>

          <div className="space-y-2 text-right sm:text-left">
            <Link
              to="/work"
              className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors group"
            >
              <span>EXPLORE ALL ARCHIVES</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Cinematic Project Scenes: Vertical Storytelling */}
        <div className="space-y-24 sm:space-y-36 md:space-y-48 mt-16 sm:mt-24">
          {featuredProjects.map((project, idx) => {
            const sceneNumber = String(idx + 1).padStart(2, '0');

            return (
              <article
                key={project.id}
                className="group relative"
              >
                {/* Scene Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/50 uppercase tracking-widest pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg sm:text-xl font-bold text-white font-mono">{sceneNumber}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-[#FF3E00] font-semibold">{project.categoryLabel || 'UI/UX & Web Design'}</span>
                  </div>
                  <div className="text-white/40">
                    {project.year}
                  </div>
                </div>

                {/* Full-Width Visual Scene Container */}
                <Link
                  to={`/work/${project.slug}`}
                  className="block mt-6 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0A0A0A] aspect-[16/10] sm:aspect-[21/9] transition-all duration-700"
                >
                  <img
                    src={project.heroImage || project.mockupImage}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center brightness-90 contrast-105 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  />
                  
                  {/* Filmic Vignette & Lighting Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  
                  {/* Subtle Corner Scene Tag */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] tracking-widest uppercase text-white/70">
                    SCENE {sceneNumber}
                  </div>

                  {/* Visual Overlay on Hover / Focus */}
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans text-white/80 max-w-xl line-clamp-2 sm:line-clamp-none">
                        {project.subtitle || project.tagline}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold group-hover:bg-[#FF3E00] group-hover:text-white transition-all shadow-2xl">
                        <span>VIEW PROJECT</span>
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Narrative Caption Below Scene */}
                <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono text-white/50">
                  <div className="md:col-span-8 flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 5).map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="md:col-span-4 text-right hidden md:block text-white/40">
                    PRESS TO VIEW CASE STUDY
                  </div>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
