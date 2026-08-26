import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { SectionHeading } from '../ui/SectionHeading';
import { PerspectiveCard } from '../ui/PerspectiveCard';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const SelectedWork: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="02"
          tag="SELECTED WORK (2025—2026)"
          title="SELECTED"
          serifWord="case studies"
          description="A curated selection of digital product interfaces, editorial web platforms, and design systems built with precision."
          align="split"
        >
          <div className="flex items-center space-x-4 text-xs font-mono">
            <Link
              to="/work"
              data-cursor="explore"
              className="text-[#FF3E00] hover:underline flex items-center space-x-1 uppercase font-bold"
            >
              <span>VIEW ALL PROJECTS (08)</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </SectionHeading>

        {/* Project List with Varied Compositions */}
        <div className="space-y-28 md:space-y-36 mt-16">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            // Composition 1: Full Width Hero Showcase (for Project 01 Nova & Project 08 Orbit)
            if (project.layoutType === 'large-hero') {
              return (
                <article
                  key={project.id}
                  className="group relative border-t border-white/10 pt-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
                    {/* Number and Title */}
                    <div className="lg:col-span-6 space-y-2">
                      <div className="flex items-center space-x-3 text-xs font-mono text-[#FF3E00]">
                        <span className="font-bold">{project.number}</span>
                        <span className="text-white/30">/</span>
                        <span className="uppercase tracking-widest text-white/60">{project.categoryLabel}</span>
                        <span className="text-white/30">/</span>
                        <span className="text-white/40">{project.year}</span>
                      </div>
                      <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white group-hover:text-[#FF3E00] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm font-mono text-white/50 tracking-wide uppercase">
                        {project.roles.join(' • ')}
                      </p>
                    </div>

                    {/* Description and CTA */}
                    <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-4">
                      <p className="text-muted-primary text-sm sm:text-base leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white/70"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/work/${project.slug}`}
                          data-cursor="project"
                          className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-white hover:text-[#FF3E00] transition-colors"
                        >
                          <span>VIEW CASE STUDY</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Visual Container */}
                  <Link to={`/work/${project.slug}`} data-cursor="project" className="block">
                    <PerspectiveCard intensity={6} className="w-full">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-[16/9] sm:aspect-[21/10]">
                        <img
                          src={project.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute bottom-6 left-6 hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-white/80">
                          <Sparkles size={12} className="text-[#FF3E00]" />
                          <span>{project.subtitle}</span>
                        </div>
                      </div>
                    </PerspectiveCard>
                  </Link>
                </article>
              );
            }

            // Composition 2: Split Editorial Composition (for Project 02 Aura, Project 07 Shift)
            return (
              <article
                key={project.id}
                className="group relative border-t border-white/10 pt-10"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Visual Side */}
                  <div className={`lg:col-span-7 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <Link to={`/work/${project.slug}`} data-cursor="project" className="block">
                      <PerspectiveCard intensity={8}>
                        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-[4/3] sm:aspect-[16/11]">
                          <img
                            src={project.heroImage}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                      </PerspectiveCard>
                    </Link>
                  </div>

                  {/* Content Side */}
                  <div className={`lg:col-span-5 space-y-6 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-xs font-mono text-[#FF3E00]">
                        <span className="font-bold">{project.number}</span>
                        <span className="text-white/30">/</span>
                        <span className="uppercase tracking-widest text-white/60">{project.categoryLabel}</span>
                        <span className="text-white/30">/</span>
                        <span className="text-white/40">{project.year}</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white group-hover:text-[#FF3E00] transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-editorial-serif italic text-lg text-white/80">
                        "{project.subtitle}"
                      </p>
                    </div>

                    <p className="text-muted-primary text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="text-[11px] font-mono text-white/40 uppercase">
                        ROLE & DELIVERABLES
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.services.map((svc) => (
                          <span
                            key={svc}
                            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white/70"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/work/${project.slug}`}
                        data-cursor="project"
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-xs font-mono uppercase tracking-widest font-bold text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-all"
                      >
                        <span>VIEW CASE STUDY</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* View All Work Bottom Action */}
        <div className="mt-24 text-center">
          <Link
            to="/work"
            data-cursor="explore"
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-all"
          >
            <span>DISCOVER ALL 8 CASE STUDIES IN DETAIL</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};
