import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { ProjectCategory } from '../types';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { FinalCTA } from '../components/sections/FinalCTA';
import { ArrowUpRight, Filter } from 'lucide-react';

const filterCategories: Array<{ id: ProjectCategory; label: string; count: number }> = [
  { id: 'all', label: 'ALL WORK', count: 8 },
  { id: 'product', label: 'PRODUCT', count: 2 },
  { id: 'web-design', label: 'WEB DESIGN', count: 2 },
  { id: 'ui-ux', label: 'UI/UX SYSTEMS', count: 2 },
  { id: 'frontend', label: 'FRONTEND', count: 2 },
];

export const WorkPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProjectCategory) || 'all';
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(initialCategory);

  useEffect(() => {
    const cat = searchParams.get('category') as ProjectCategory;
    if (cat && filterCategories.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleFilterChange = (category: ProjectCategory) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header Section */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                PORTFOLIO ARCHIVE
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">2024 — 2026</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white uppercase leading-none mb-6">
              PROVE BY <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                built
              </span>{' '}
              WORK.
            </h1>

            <p className="max-w-2xl text-muted-primary text-base md:text-lg leading-relaxed">
              Every project represents a deep dive into user experience architecture, bespoke art direction, and production frontend engineering.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-16 border-b border-white/10 no-scrollbar">
            <div className="flex items-center space-x-1 pr-2 text-xs font-mono text-white/40">
              <Filter size={13} />
              <span>FILTER:</span>
            </div>

            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap flex items-center space-x-2 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Projects Grid or Empty State */}
          {filteredProjects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className="group flex flex-col justify-between border border-white/10 rounded-2xl bg-[#0A0A0A] p-6 hover:border-white/25 transition-all duration-300"
                  >
                    <div>
                      {/* Top Metadata */}
                      <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pb-4 border-b border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#FF3E00] font-bold">{project.number}</span>
                          <span>/</span>
                          <span className="text-white uppercase">{project.categoryLabel}</span>
                        </div>
                        <span>{project.year}</span>
                      </div>

                      {/* Image Preview */}
                      <Link to={`/work/${project.slug}`} data-cursor="project" className="block mb-6">
                        <PerspectiveCard intensity={6}>
                          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#141414] border border-white/5">
                            <img
                              src={project.heroImage}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                          </div>
                        </PerspectiveCard>
                      </Link>

                      {/* Title & Tagline */}
                      <div className="space-y-2 mb-4">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#FF3E00] transition-colors flex items-center justify-between">
                          <span>{project.title}</span>
                          <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-[#FF3E00]" />
                        </h2>
                        <p className="text-sm font-editorial-serif italic text-white/80">
                          "{project.subtitle}"
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-primary leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom Tech Tags & Action */}
                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/work/${project.slug}`}
                        data-cursor="project"
                        className="text-xs font-mono uppercase tracking-wider text-white font-bold hover:text-[#FF3E00] transition-colors"
                      >
                        READ CASE STUDY →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="p-12 rounded-2xl border border-white/10 bg-[#0A0A0A] text-center space-y-4">
              <p className="text-muted-primary text-sm font-mono">No projects found for the selected category filter.</p>
              <button
                onClick={() => handleFilterChange('all')}
                className="px-6 py-2.5 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors"
              >
                VIEW ALL PROJECTS
              </button>
            </div>
          )}

        </div>

        {/* Bottom CTA */}
        <div className="mt-28">
          <FinalCTA />
        </div>
      </div>
    </PageTransition>
  );
};
