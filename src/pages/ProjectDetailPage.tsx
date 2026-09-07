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
      <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#050505] text-white">
        
        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-10">
          <Link
            to="/work"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-[#FF3E00] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO GALLERY</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 01. IMMERSIVE OPENING: Huge Title + Visual Canvas                          */}
        {/* ========================================================================= */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-16 sm:mb-24">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF3E00]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF3E00]/10 border border-[#FF3E00]/30 font-bold">
                {project.number}
              </span>
              <span>/</span>
              <span className="text-white/80">{project.categoryLabel}</span>
              <span>/</span>
              <span className="text-white/40">{project.year}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.88] break-words">
              {project.title}
            </h1>

            <p className="text-lg sm:text-2xl md:text-3xl text-white/70 max-w-4xl font-normal leading-relaxed">
              {project.subtitle}
            </p>

            {/* Small Role / Date / Client Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 text-xs font-mono">
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
          <div className="mt-10 sm:mt-14">
            <ThreeDCard maxRotation={4} depthZ={12} glareOpacity={0.15}>
              <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#0A0A0A] aspect-[16/9] shadow-2xl relative">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-xs text-white">
                  <span className="px-3 py-1 rounded bg-black/70 border border-white/20">
                    PRIMARY INTERFACE SPECIMEN
                  </span>
                  <span className="text-white/70">{project.title} · {project.year}</span>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 02. EXPLORATION & CONTEXT: The Challenge & Architectural Solution          */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                01 / CONTEXT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                THE OBJECTIVE & CHALLENGE
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-white/75 leading-relaxed font-sans">
              <p>{project.description}</p>
              <p className="text-sm sm:text-base text-white/60 font-mono pt-2 border-l-2 border-[#FF3E00] pl-4">
                {project.challenge}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03. DESIGN: Screens Displayed as Large Visual Compositions                 */}
        {/* ========================================================================= */}
        {project.gallery.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 border-t border-white/10">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  02 / INTERFACE COMPOSITIONS
                </span>
                <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-1">
                  SCREENS & SYSTEMS
                </h3>
              </div>
              <span className="text-xs font-mono text-white/40">
                CLICK TO INSPECT FULL RESOLUTION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#090909] aspect-[16/10] cursor-pointer shadow-xl transition-all duration-300 hover:border-white/30"
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
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
          <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 border-t border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  03 / OUTCOME
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                  VERIFIED IMPACT
                </h2>
              </div>

              <div className="lg:col-span-8">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#090909] border border-white/10 space-y-4">
                  <ul className="space-y-3.5 text-sm sm:text-base font-mono text-white/80">
                    {project.impactStatements.map((stmt, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 size={16} className="text-[#FF3E00] shrink-0 mt-1" />
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-20 sm:py-28 border-t border-white/10">
          <ThreeDCard maxRotation={4} depthZ={12} glareOpacity={0.15}>
            <Link
              to={`/work/${nextProject.slug}`}
              className="group block p-8 sm:p-14 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111] via-[#090909] to-[#050505] hover:border-[#FF3E00]/40 transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                    <span>NEXT SPECIMEN</span>
                    <span>/</span>
                    <span>{nextProject.number}</span>
                  </div>
                  
                  <h3 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white group-hover:text-white transition-colors">
                    {nextProject.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-white/70 max-w-xl font-sans">
                    {nextProject.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-3">
                  <span className="px-8 py-4 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold group-hover:bg-[#FF3E00] group-hover:text-white transition-all shadow-xl inline-flex items-center space-x-2">
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

