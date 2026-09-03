import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { SectionHeading } from '../ui/SectionHeading';
import { PerspectiveCard } from '../ui/PerspectiveCard';
import { ArrowUpRight } from 'lucide-react';

export const SelectedWork: React.FC = () => {
  // Select the 4 strongest flagship projects across product, web, and systems
  const featuredProjects = projects.slice(0, 4);

  return (
    <section id="selected-work" className="py-20 sm:py-28 md:py-36 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="01"
          tag="SELECTED WORK"
          title="SELECTED"
          serifWord="projects"
          description="Recent digital product interfaces, design systems, and web platforms."
          align="split"
        >
          <div className="flex items-center space-x-4 text-xs font-mono">
            <Link
              to="/work"
              data-cursor="explore"
              className="text-[#FF3E00] hover:underline flex items-center space-x-1 uppercase font-bold min-h-[44px]"
            >
              <span>VIEW ALL WORK</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </SectionHeading>

        {/* Project List */}
        <div className="space-y-14 sm:space-y-20 md:space-y-28 mt-12 md:mt-16">
          {featuredProjects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <article
                key={project.id}
                className="group relative border-t border-white/10 pt-8 sm:pt-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Visual Side (Dominant) */}
                  <div className={`lg:col-span-7 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <Link to={`/work/${project.slug}`} data-cursor="project" className="block" aria-label={`View ${project.title} project`}>
                      <PerspectiveCard intensity={6}>
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-[16/10]">
                          <img
                            src={project.heroImage}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                      </PerspectiveCard>
                    </Link>
                  </div>

                  {/* Information Side (Simple & Focused) */}
                  <div className={`lg:col-span-5 space-y-4 sm:space-y-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                    <div className="text-xs font-mono tracking-wider uppercase text-white/60">
                      {project.roles.join(' • ')}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white group-hover:text-[#FF3E00] transition-colors">
                        <Link to={`/work/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-white/70 font-normal leading-relaxed">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/work/${project.slug}`}
                        data-cursor="project"
                        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest font-bold text-white hover:text-[#FF3E00] transition-colors group/link min-h-[44px]"
                      >
                        <span>VIEW PROJECT</span>
                        <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* View All Work Action */}
        <div className="mt-16 sm:mt-20 text-center">
          <Link
            to="/work"
            data-cursor="explore"
            className="inline-flex items-center justify-center space-x-3 min-h-[48px] px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-all"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
};
