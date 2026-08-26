import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { siteMetadata } from '../data/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const simpleServices = [
  { number: '01', title: 'UI/UX DESIGN' },
  { number: '02', title: 'WEB DESIGN' },
  { number: '03', title: 'FRONTEND DEVELOPMENT' },
  { number: '04', title: 'DESIGN SYSTEMS' },
  { number: '05', title: 'LANDING PAGES' }
];

export const HomePage: React.FC = () => {
  return (
    <div className="pt-32 sm:pt-40 pb-24 space-y-36 sm:space-y-48">
      
      {/* 01 — HERO */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="space-y-10">
          
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
              SCRILLO
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              UI/UX DESIGNER<br className="sm:hidden" />
              <span className="hidden sm:inline"> · </span>
              FRONTEND WEB DESIGNER
            </p>
          </div>

          <p className="text-2xl sm:text-4xl md:text-5xl text-neutral-100 font-normal leading-tight max-w-3xl">
            "I design digital products and websites with a focus on clarity, interaction and detail."
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider pt-2">
            <a
              href="#selected-work"
              className="text-white hover:text-[#FF3E00] transition-colors flex items-center space-x-1.5 font-bold"
            >
              <span>VIEW WORK</span>
              <ArrowRight size={13} />
            </a>
            <Link
              to="/contact"
              className="text-neutral-400 hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <span>LET'S TALK</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center space-x-3 text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
            <span>INDIA · AVAILABLE FOR SELECT PROJECTS</span>
          </div>

        </div>
      </section>

      {/* 02 — SELECTED WORK */}
      <section id="selected-work" className="max-w-5xl mx-auto px-6 space-y-20">
        <div className="border-b border-white/10 pb-4 flex items-baseline justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            SELECTED WORK
          </h2>
          <Link
            to="/work"
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center space-x-1 uppercase"
          >
            <span>ALL WORK</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="space-y-32">
          {projects.slice(0, 4).map((project, index) => (
            <article key={project.id} className="group space-y-6">
              
              {/* Project Metadata */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
                  <span className="text-[#FF3E00] font-bold">{project.number}</span>
                  <span>/</span>
                  <span className="uppercase text-white font-bold">{project.title}</span>
                  <span>·</span>
                  <span className="uppercase">{project.categoryLabel} · {project.year}</span>
                </div>

                <p className="text-base sm:text-lg text-neutral-300 leading-snug max-w-xl">
                  {project.summary}
                </p>
              </div>

              {/* Clean Image Showcase */}
              <Link
                to={`/work/${project.slug}`}
                className="block overflow-hidden rounded border border-white/10 bg-[#0E0E0E]"
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full aspect-[16/9] sm:aspect-[21/10] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>

              {/* Action Link */}
              <div className="pt-1">
                <Link
                  to={`/work/${project.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF3E00] transition-colors font-bold"
                >
                  <span>VIEW PROJECT</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </article>
          ))}
        </div>
      </section>

      {/* 03 — ABOUT */}
      <section className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            ABOUT
          </h2>
        </div>

        <div className="space-y-6 max-w-3xl">
          <p className="text-xl sm:text-2xl md:text-3xl text-neutral-200 leading-snug font-normal">
            "I'm a UI/UX and frontend web designer focused on creating clear interfaces, thoughtful interactions and websites that are built to work."
          </p>

          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1">
            <span>UI/UX DESIGN</span>
            <span>·</span>
            <span>WEB DESIGN</span>
            <span>·</span>
            <span>FRONTEND</span>
          </div>

          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF3E00] transition-colors font-bold"
            >
              <span>MORE ABOUT ME</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* 04 — SERVICES */}
      <section className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            WHAT I DO
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {simpleServices.map((svc) => (
            <div
              key={svc.number}
              className="py-5 sm:py-6 flex items-center justify-between text-white hover:text-[#FF3E00] transition-colors group cursor-default"
            >
              <span className="text-base sm:text-xl font-bold tracking-tight font-sans">
                {svc.number} — {svc.title}
              </span>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#FF3E00]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 05 — CONTACT */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="border-t border-white/10 pt-20 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              HAVE A PROJECT <br />
              IN MIND?
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed">
              Available for selected freelance and collaborative projects.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-6 py-3 rounded bg-white text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FF3E00] hover:text-white transition-colors inline-flex items-center space-x-2"
            >
              <span>LET'S TALK</span>
              <ArrowRight size={13} />
            </Link>

            <a
              href={`mailto:${siteMetadata.email}`}
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors underline sm:px-2 py-2"
            >
              {siteMetadata.email}
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
