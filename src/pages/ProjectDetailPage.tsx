import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ProjectReceipt } from '../components/ui/ProjectReceipt';
import { DecisionLog } from '../components/ui/DecisionLog';
import { DesignToCodeComparison } from '../components/ui/DesignToCodeComparison';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find((p) => p.slug === slug) || projects[0];
  const nextProject = projects.find((p) => p.id === project.nextProjectId) || projects[0];

  return (
    <article className="pt-32 pb-24 max-w-5xl mx-auto px-6 space-y-16">
      
      {/* Back Link */}
      <div>
        <Link
          to="/work"
          className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Work</span>
        </Link>
      </div>

      {/* Hero Header */}
      <header className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
            <span className="text-[#FF3E00] font-bold">{project.number}</span>
            <span>/</span>
            <span className="uppercase">{project.categoryLabel}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Roles & Metadata */}
        <div className="border-t border-white/10 pt-4 text-xs font-mono text-neutral-400 flex flex-wrap gap-6">
          <div>
            <span className="text-neutral-400 uppercase">Role: </span>
            <span className="text-white">{project.role}</span>
          </div>
          <div>
            <span className="text-neutral-400 uppercase">Year: </span>
            <span className="text-white">{project.year}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded overflow-hidden border border-white/10 bg-[#0E0E0E]">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
      </header>

      {/* Scope Receipt */}
      <ProjectReceipt receipt={project.receipt} />

      {/* Problem & Approach */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-white/10">
        <div className="md:col-span-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            The Problem
          </h2>
        </div>
        <div className="md:col-span-8 text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
          <p>{project.problem}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b border-white/10">
        <div className="md:col-span-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Approach & Structure
          </h2>
        </div>
        <div className="md:col-span-8 text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
          <p>{project.approach}</p>
        </div>
      </section>

      {/* Design Decision Logs (Options considered & final rationales) */}
      <DecisionLog logs={project.decisionLogs} />

      {/* Case Study Sections with Visual Evidence */}
      {project.sections.map((section, idx) => (
        <section key={idx} className="space-y-6 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {section.title}
            </h3>
            {section.subtitle && (
              <p className="text-sm font-mono text-neutral-400">
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl">
            {section.description.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}
          </div>

          {section.image && (
            <div className="space-y-2 pt-4">
              <div className="rounded overflow-hidden border border-white/10 bg-[#0E0E0E]">
                <img src={section.image} alt={section.title} className="w-full object-cover" />
              </div>
              {section.caption && (
                <p className="text-xs font-mono text-neutral-400">
                  {section.caption}
                </p>
              )}
            </div>
          )}
        </section>
      ))}

      {/* Design → Code Comparison */}
      <DesignToCodeComparison data={project.designToCode} />

      {/* Gallery / Additional Screens */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Interface Screens & Gallery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((g, gIdx) => (
              <div key={gIdx} className="space-y-2">
                <div className="rounded overflow-hidden border border-white/10 bg-[#0E0E0E]">
                  <img src={g.url} alt={g.caption} className="w-full aspect-[4/3] object-cover" />
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  {g.caption}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      <footer className="border-t border-white/10 pt-16 mt-16">
        <Link
          to={`/work/${nextProject.slug}`}
          className="group block p-8 rounded border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors space-y-2"
        >
          <div className="text-xs font-mono uppercase text-neutral-400">
            Next Project →
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#FF3E00] transition-colors">
            {nextProject.title}
          </div>
          <p className="text-xs font-mono text-neutral-400">
            {nextProject.categoryLabel} · {nextProject.year}
          </p>
        </Link>
      </footer>

    </article>
  );
};
