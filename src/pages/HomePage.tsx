import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { services } from '../data/services';
import { siteMetadata } from '../data/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 space-y-32">
      
      {/* 01. Intro / Quiet Hero */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SCRILLO
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              {siteMetadata.role}
            </p>
          </div>

          <p className="text-2xl sm:text-4xl text-neutral-200 font-normal leading-snug">
            I design digital products and websites with a focus on clarity, interaction and detail.
          </p>

          <div className="flex items-center space-x-6 pt-4 text-xs font-mono uppercase tracking-wider">
            <a
              href="#selected-work"
              className="text-white hover:text-[#FF3E00] transition-colors flex items-center space-x-1.5"
            >
              <span>Work</span>
              <ArrowRight size={13} />
            </a>
            <Link
              to="/contact"
              className="text-neutral-400 hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <span>Contact</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </section>

      {/* 02. Selected Work */}
      <section id="selected-work" className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Selected Work (04)
          </h2>
          <Link
            to="/work"
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>All Projects</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="space-y-24">
          {projects.map((project) => (
            <article key={project.id} className="group space-y-6">
              
              {/* Project Image */}
              <Link to={`/work/${project.slug}`} className="block overflow-hidden rounded border border-white/10 bg-[#0E0E0E]">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full aspect-[16/9] sm:aspect-[21/10] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="lazy"
                />
              </Link>

              {/* Project Metadata & Title */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
                    <span className="text-[#FF3E00] font-bold">{project.number}</span>
                    <span>/</span>
                    <span className="uppercase">{project.categoryLabel}</span>
                    <span>·</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    <Link to={`/work/${project.slug}`} className="hover:text-[#FF3E00] transition-colors">
                      {project.title}
                    </Link>
                  </h3>
                </div>

                <div className="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4">
                  <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
                    {project.summary}
                  </p>
                  <Link
                    to={`/work/${project.slug}`}
                    className="text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF3E00] transition-colors whitespace-nowrap flex items-center space-x-1 shrink-0"
                  >
                    <span>View Project</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </article>
          ))}
        </div>
      </section>

      {/* 03. Capabilities */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Capabilities & Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
              From early architecture to production code.
            </h3>
          </div>

          <div className="md:col-span-8 divide-y divide-white/5">
            {services.map((svc) => (
              <div key={svc.number} className="py-6 first:pt-0 space-y-2">
                <div className="flex items-center space-x-3 text-sm font-bold text-white">
                  <span className="font-mono text-xs text-[#FF3E00]">{svc.number}</span>
                  <span>{svc.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 pl-7 leading-relaxed max-w-xl">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. About Preview */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            About
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-4 text-neutral-300 text-base leading-relaxed">
            <p>
              I am an independent UI/UX and frontend web designer based in Bangalore. I work with product teams and startups to solve interface challenges, design responsive systems, and build them in clean React code.
            </p>
            <p className="text-sm text-neutral-400">
              I believe design and engineering should work hand in hand. Designing with an innate understanding of CSS layout models and DOM rendering leads to faster, more resilient products.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF3E00] transition-colors inline-flex items-center space-x-1"
              >
                <span>Read more about my background →</span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 p-6 rounded border border-white/10 bg-[#0C0C0C] space-y-4 text-xs font-mono">
            <div className="text-neutral-400 uppercase tracking-wider">
              Focus Areas
            </div>
            <ul className="space-y-2 text-neutral-300">
              <li>• Product Interface & Telemetry UX</li>
              <li>• Editorial & Modern Web Design</li>
              <li>• React / TypeScript Frontend</li>
              <li>• Design System Architecture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 05. Simple Contact Callout */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="border-t border-white/10 pt-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Have a project in mind?
            </h2>
            <p className="text-sm text-neutral-400 max-w-md">
              Available for select UI/UX design and frontend engagements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#FF3E00] hover:text-white transition-colors"
            >
              Start a Conversation →
            </Link>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors underline"
            >
              {siteMetadata.email}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
