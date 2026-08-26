import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { PageTransition } from '../components/layout/PageTransition';
import { BrowserMockup } from '../components/ui/BrowserMockup';
import { DeviceMockup } from '../components/ui/DeviceMockup';
import { Lightbox } from '../components/ui/Lightbox';
import { ProjectReceipt } from '../components/ui/ProjectReceipt';
import { DecisionLog } from '../components/ui/DecisionLog';
import { BeforeAfter } from '../components/ui/BeforeAfter';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Code2, Layers, Sparkles } from 'lucide-react';

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
      <div className="pt-32 pb-20 md:pt-36 md:pb-28">
        
        {/* Back Navigation Bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          <Link
            to="/work"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-[#FF3E00] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF3E00]">
              <span className="px-2 py-0.5 rounded bg-[#FF3E00]/10 border border-[#FF3E00]/20 font-bold">
                {project.number}
              </span>
              <span>/</span>
              <span className="text-white/80">{project.categoryLabel}</span>
              <span>/</span>
              <span className="text-white/40">{project.year}</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none">
              {project.title}
            </h1>

            <p className="font-editorial-serif italic text-2xl sm:text-3xl md:text-4xl text-white/90 max-w-4xl">
              "{project.subtitle}"
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-white/40 uppercase">ROLES</span>
                <p className="text-white font-semibold">{project.roles.join(', ')}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 uppercase">TIMELINE</span>
                <p className="text-white font-semibold">{project.timeline}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 uppercase">SERVICES</span>
                <p className="text-white font-semibold">{project.services.slice(0, 2).join(', ')}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/40 uppercase">CORE TECH</span>
                <p className="text-white font-semibold">{project.technologies.slice(0, 3).join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Full-width Hero Visual */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-white/10 bg-[#0C0C0C] aspect-[16/9] shadow-2xl">
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Project Receipt: Replaces fake stats with provable design evidence */}
        {project.receipt && project.receipt.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
            <ProjectReceipt receipt={project.receipt} />
          </section>
        )}

        {/* Core Challenge & Solution Overview */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                01. CONTEXT & PROBLEM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                The Core Challenge
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-muted-primary text-base sm:text-lg leading-relaxed">
              <p>{project.challenge}</p>
              <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-white font-bold block">
                  QUALITATIVE OUTCOMES & REFACTORING
                </span>
                <ul className="space-y-2 text-sm font-mono text-white/80">
                  {project.impactStatements.map((stmt, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 size={16} className="text-[#FF3E00] shrink-0 mt-0.5" />
                      <span>{stmt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Before / After Comparison (If available) */}
        {project.beforeAfter && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/10">
            <BeforeAfter data={project.beforeAfter} />
          </section>
        )}

        {/* Design Decision Log: The "WHY?" section */}
        {project.decisionLogs && project.decisionLogs.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/10">
            <DecisionLog logs={project.decisionLogs} />
          </section>
        )}

        {/* Case Study Detailed Storytelling Sections */}
        {project.sections.map((section, sIdx) => (
          <section
            key={section.title}
            className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-white/10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  {section.tag || `STEP 0${sIdx + 2}`}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {section.title}
                </h3>
                {section.subtitle && (
                  <p className="text-sm font-editorial-serif italic text-white/70">
                    "{section.subtitle}"
                  </p>
                )}
              </div>

              <div className="lg:col-span-8 space-y-4">
                {section.description.map((para, pIdx) => (
                  <p key={pIdx} className="text-muted-primary text-base sm:text-lg leading-relaxed">
                    {para}
                  </p>
                ))}

                {section.bulletPoints && (
                  <ul className="space-y-2 pt-2 text-sm font-mono text-white/80">
                    {section.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start space-x-2">
                        <span className="text-[#FF3E00] font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Section Visual Renderings */}
            {section.visual && (
              <div className="mt-8">
                {/* Visual Type 1: Browser Mockup */}
                {section.visual.type === 'browser' && section.visual.image && (
                  <BrowserMockup url={`https://${project.slug}.craft`} title={project.title}>
                    <img
                      src={section.visual.image}
                      alt={section.visual.caption || project.title}
                      className="w-full h-auto object-cover cursor-pointer"
                      onClick={() => openLightbox(0)}
                    />
                  </BrowserMockup>
                )}

                {/* Visual Type 2: Mobile Mockup */}
                {section.visual.type === 'mobile' && section.visual.image && (
                  <div className="py-8">
                    <DeviceMockup type="mobile">
                      <img
                        src={section.visual.image}
                        alt={project.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openLightbox(0)}
                      />
                    </DeviceMockup>
                  </div>
                )}

                {/* Visual Type 3: Code Snippet */}
                {section.visual.type === 'code' && section.visual.codeSnippet && (
                  <div className="rounded-2xl border border-white/10 bg-[#050505] p-6 font-mono text-xs overflow-x-auto shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 text-white/40">
                      <div className="flex items-center space-x-2">
                        <Code2 size={14} className="text-blue-400" />
                        <span>{section.visual.codeSnippet.filename}</span>
                      </div>
                      <span className="text-[#FF3E00] uppercase">{section.visual.codeSnippet.language}</span>
                    </div>
                    <pre className="text-emerald-400 leading-relaxed">
                      <code>{section.visual.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Visual Type 4: Design Tokens Grid */}
                {section.visual.type === 'tokens' && section.visual.tokens && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {section.visual.tokens.map((token) => (
                      <div
                        key={token.name}
                        className="p-4 rounded-xl border border-white/10 bg-[#0C0C0C] space-y-2 text-xs font-mono"
                      >
                        <div className="text-[10px] text-white/40 uppercase">{token.type}</div>
                        <div className="flex items-center gap-2">
                          {token.type === 'color' && (
                            <span
                              style={{ backgroundColor: token.value }}
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                            />
                          )}
                          <span className="text-white font-bold truncate">{token.value}</span>
                        </div>
                        <div className="text-[10px] text-white/50 truncate">{token.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Visual Type 5: Wireframe Flow Points */}
                {section.visual.type === 'wireframe' && section.visual.wireframePoints && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {section.visual.wireframePoints.map((wp) => (
                      <div
                        key={wp.step}
                        className="p-6 rounded-xl border border-white/10 bg-[#0A0A0A] space-y-2"
                      >
                        <span className="font-mono text-xs text-[#FF3E00] font-bold">
                          {wp.step}
                        </span>
                        <h4 className="text-base font-bold text-white tracking-tight">
                          {wp.label}
                        </h4>
                        <p className="text-xs text-muted-primary leading-relaxed">
                          {wp.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {section.visual.caption && (
                  <p className="text-xs font-mono text-white/40 mt-3 text-center">
                    {section.visual.caption}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}

        {/* Project Gallery Showcase */}
        {project.gallery.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-white/10">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                VISUAL ARCHIVE
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                Project Gallery & Screens
              </h3>
              <p className="text-xs font-mono text-white/40 mt-1">
                Click any image to inspect in fullscreen high-resolution lightbox
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#0C0C0C] aspect-[16/10] cursor-pointer"
                  data-cursor="project"
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-xs font-mono text-white font-semibold">
                      {item.caption || item.alt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next Project Footer Bar */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/10">
          <Link
            to={`/work/${nextProject.slug}`}
            data-cursor="project"
            className="group block p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#080808] hover:border-[#FF3E00]/50 hover:bg-[#0D0D0D] transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                  NEXT CASE STUDY
                </span>
                <h3 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight group-hover:text-[#FF3E00] transition-colors">
                  {nextProject.title}
                </h3>
                <p className="text-sm font-editorial-serif italic text-white/70">
                  "{nextProject.subtitle}"
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:bg-[#FF3E00] group-hover:border-[#FF3E00] transition-all duration-300 shrink-0">
                <ArrowUpRight size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
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
