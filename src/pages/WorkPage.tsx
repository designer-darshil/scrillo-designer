import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ProjectCategory } from '../types';
import { ArrowRight } from 'lucide-react';

const filterCategories: Array<{ id: ProjectCategory; label: string }> = [
  { id: 'all', label: 'All Projects' },
  { id: 'product', label: 'Product Design' },
  { id: 'web-design', label: 'Web Design' },
  { id: 'frontend', label: 'Frontend' }
];

export const WorkPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 space-y-16">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Work
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
          A selection of digital products, web designs, and frontend systems built with attention to hierarchy, interaction, and performance.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
        {filterCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Projects List */}
      <div className="space-y-24">
        {filteredProjects.map((project) => (
          <article key={project.id} className="group space-y-6">
            
            <Link to={`/work/${project.slug}`} className="block overflow-hidden rounded border border-white/10 bg-[#0E0E0E]">
              <img
                src={project.heroImage}
                alt={project.title}
                className="w-full aspect-[16/9] sm:aspect-[21/10] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                loading="lazy"
              />
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
              <div className="md:col-span-4 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
                  <span className="text-[#FF3E00] font-bold">{project.number}</span>
                  <span>/</span>
                  <span className="uppercase">{project.categoryLabel}</span>
                  <span>·</span>
                  <span>{project.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  <Link to={`/work/${project.slug}`} className="hover:text-[#FF3E00] transition-colors">
                    {project.title}
                  </Link>
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4">
                <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
                  {project.summary}
                </p>
                <Link
                  to={`/work/${project.slug}`}
                  className="text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF3E00] transition-colors whitespace-nowrap flex items-center space-x-1 shrink-0"
                >
                  <span>View Case Study</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </article>
        ))}
      </div>

    </div>
  );
};
