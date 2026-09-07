import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { PageTransition } from '../components/layout/PageTransition';
import { Lightbox } from '../components/ui/Lightbox';
import { ThreeDCard } from '../components/ui/ThreeDCard';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Eye, ExternalLink } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <NotFoundPage />;
  }

  const nextProject = projects.find((p) => p.id === project.nextProjectId) || projects[0];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-[#050505] text-white">
        
        {/* Navigation Bar */}
        <div className="site-container mb-8 sm:mb-10">
          <Link
            to="/work"
            className="min-h-[40px] inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-[#FF3E00] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO GALLERY</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 01. IMMERSIVE OPENING: Huge Title + Visual Canvas                          */}
        {/* ========================================================================= */}
        <header className="site-container mb-12 sm:mb-20">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono uppercase tracking-widest text-[#FF3E00]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF3E00]/10 border border-[#FF3E00]/30 font-bold">
                {project.number}
              </span>
              <span>/</span>
              <span className="text-white/80">{project.categoryLabel}</span>
              <span>/</span>
              <span className="text-white/40">{project.year}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.95] break-words text-balance">
              {project.title}
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-white/70 max-w-4xl font-normal leading-relaxed text-pretty">
              {project.subtitle}
            </p>

            {/* Small Role / Date / Client Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/10 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-white/40 uppercase">ROLE</span>
                <p className="text-white font-semibold">{project.roles.join(' • ')}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 uppercase">CLIENT</span>
                <p className="text-white font-semibold">{project.client}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 uppercase">TIMELINE</span>
                <p className="text-white font-semibold">{project.timeline}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 uppercase">DOMAIN</span>
                <p className="text-[#FF3E00] font-semibold">{project.categoryLabel}</p>
              </div>
            </div>
          </div>

          {/* Full-width 3D Visual Stage */}
          <div className="mt-8 sm:mt-12">
            <ThreeDCard maxRotation={4} depthZ={12} glareOpacity={0.15}>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#0A0A0A] aspect-[16/9] shadow-2xl relative">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between font-mono text-xs text-white">
                  <span className="px-2.5 sm:px-3 py-1 rounded bg-black/70 border border-white/20 text-[10px] sm:text-xs">
                    PRIMARY INTERFACE SPECIMEN
                  </span>
                  <span className="text-white/70 text-[10px] sm:text-xs">{project.title} · {project.year}</span>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 02. EXPLORATION & CONTEXT: The Challenge & Architectural Solution          */}
        {/* ========================================================================= */}
        <section className="site-container py-12 sm:py-16 lg:py-20 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                01 / CONTEXT
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white text-balance">
                THE OBJECTIVE & CHALLENGE
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed font-sans text-pretty">
              <p>{project.description}</p>
              <p className="text-xs sm:text-sm font-mono pt-2 border-l-2 border-[#FF3E00] pl-4 text-white/60">
                {project.challenge}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03. DESIGN: Screens Displayed as Large Visual Compositions                 */}
        {/* ========================================================================= */}
        {project.gallery.length > 0 && (
          <section className="site-container py-12 sm:py-16 lg:py-24 border-t border-white/10">
            <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  02 / INTERFACE COMPOSITIONS
                </span>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white mt-1 text-balance">
                  SCREENS & SYSTEMS
                </h3>
              </div>
              <span className="text-xs font-mono text-white/40">
                CLICK TO INSPECT FULL RESOLUTION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {project.gallery.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 bg-[#090909] aspect-[16/10] cursor-pointer shadow-xl transition-all duration-300 hover:border-white/30"
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 sm:p-6">
                    <span className="text-xs font-mono text-white font-bold">
                      {item.caption || item.alt}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                      <Eye size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 04. OUTCOMES: Real Verified Results & Decisions                           */}
        {/* ========================================================================= */}
        {project.impactStatements && project.impactStatements.length > 0 && (
          <section className="site-container py-12 sm:py-16 lg:py-20 border-t border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  03 / OUTCOME
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white text-balance">
                  VERIFIED IMPACT
                </h2>
              </div>

              <div className="lg:col-span-8">
                <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#090909] border border-white/10 space-y-4">
                  <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm lg:text-base font-mono text-white/80">
                    {project.impactStatements.map((stmt, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 size={16} className="text-[#FF3E00] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{stmt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 05. NEXT PROJECT PORTAL: Immersive Spatial Transition                      */}
        {/* ========================================================================= */}
        <section className="site-container py-16 sm:py-24 border-t border-white/10">
          <ThreeDCard maxRotation={4} depthZ={12} glareOpacity={0.15}>
            <Link
              to={`/work/${nextProject.slug}`}
              className="group block p-6 sm:p-10 lg:p-14 rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111] via-[#090909] to-[#050505] hover:border-[#FF3E00]/40 transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                    <span>NEXT SPECIMEN</span>
                    <span>/</span>
                    <span>{nextProject.number}</span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white group-hover:text-white transition-colors text-balance">
                    {nextProject.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-xl font-sans text-pretty">
                    {nextProject.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-3">
                  <span className="min-h-[48px] px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold group-hover:bg-[#FF3E00] group-hover:text-white transition-all shadow-xl inline-flex items-center space-x-2">
                    <span>EXPLORE SPECIMEN</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </ThreeDCard>
        </section>

      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={project.gallery}
        currentIndex={activeImageIndex}
        onNavigate={(newIndex) => setActiveImageIndex(newIndex)}
      />
    </PageTransition>
  );
};

