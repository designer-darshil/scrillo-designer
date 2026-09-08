import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { ProjectCategory } from '../types';
import { PageTransition } from '../components/layout/PageTransition';
import { ArrowUpRight } from 'lucide-react';

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
      <div className="pt-24 sm:pt-32 pb-20 sm:pb-28 bg-[#060606] text-white">
        <div className="site-container">
          
          {/* Header Bar */}
          <div className="flex items-center gap-3 font-mono text-xs text-[#FF3E00] tracking-widest uppercase mb-8 pb-4 border-b border-white/[0.08]">
            <span className="text-white font-bold">WORK</span>
            <span className="text-white/20">/</span>
            <span className="text-white/60">DIRECTORY & CASE STUDIES</span>
          </div>

          {/* Heading */}
          <div className="mb-10 sm:mb-14">
            <h1 className="clamp-spread-title font-extrabold uppercase tracking-tight text-white editorial-title">
              SELECTED PROJECTS.
            </h1>
            <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl text-pretty font-normal">
              A curated archive of web design, digital interfaces, and frontend implementations built with cognitive clarity and deliberate typography.
            </p>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 sm:mb-16 border-b border-white/[0.08] no-scrollbar">
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id)}
                  aria-pressed={isActive}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-60">
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between border-b border-white/[0.08] pb-10"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between font-mono text-xs text-white/40 mb-3">
                    <span>{project.number} / {project.categoryLabel}</span>
                    <span>{project.year}</span>
                  </div>

                  {/* Visual Preview */}
                  <Link
                    to={`/work/${project.slug}`}
                    className="block relative rounded overflow-hidden aspect-[16/10] bg-[#0E0E0E] border border-white/10 mb-6 group-hover:border-white/25 transition-all duration-300"
                  >
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </Link>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white group-hover:text-[#FF3E00] transition-colors flex items-center justify-between">
                      <Link to={`/work/${project.slug}`}>
                        {project.title}
                      </Link>
                      <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 text-[#FF3E00] transition-all" />
                    </h2>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg">
                      {project.subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Role Tag */}
                <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-white/50">
                  <span>{project.roles[0]}</span>
                  <Link
                    to={`/work/${project.slug}`}
                    className="text-white hover:text-[#FF3E00] transition-colors uppercase tracking-wider flex items-center gap-1 font-bold"
                  >
                    <span>EXPLORE</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Editorial Inquiry Banner */}
          <div className="mt-20 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-[#FF3E00] uppercase tracking-widest block mb-1">
                START A PROJECT
              </span>
              <p className="text-white text-base sm:text-lg font-medium">
                Let's discuss requirements, user experience goals, and technical specs.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors shrink-0"
            >
              <span>CONNECT DIRECTLY</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default WorkPage;
