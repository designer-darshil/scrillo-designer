import React from 'react';
import { experienceData, toolsList } from '../data/experience';
import { siteMetadata } from '../data/navigation';
import { media } from '../data/media';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 space-y-20">
      
      {/* Intro Header */}
      <section className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Scrillo
        </h1>
        <p className="text-xl sm:text-2xl text-neutral-200 leading-relaxed font-normal">
          I'm a UI/UX and frontend web designer focused on creating clear interfaces, thoughtful interactions and websites that feel good to use.
        </p>
      </section>

      {/* Portrait & Context */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-8 border-y border-white/10">
        <div className="md:col-span-4">
          <div className="rounded overflow-hidden border border-white/10 bg-[#0E0E0E] aspect-[4/5]">
            <img
              src={media.designerPortrait}
              alt="Scrillo Portrait"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="pt-2 text-xs font-mono text-neutral-400">
            {siteMetadata.location}
          </div>
        </div>

        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            I began my journey exploring typography, spatial layout, and frontend programming. Over the last 7 years, I've worked directly with founders, product managers, and engineering teams to turn ambiguous product ideas into structured, production-ready interfaces.
          </p>
          <p>
            I believe that great product design is the resolution of complexity, not the concealment of it. When designing an interface, I work with the DOM in mind—understanding layout shifts, responsive breakpoints, and rendering efficiency from the very first wireframe.
          </p>
        </div>
      </section>

      {/* How I Work */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          How I Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-neutral-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-white">1. Understand the Information Architecture</h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Before touching visual styling, I define user journeys, task priorities, and keyboard navigation flows to ensure the foundation is sound.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white">2. Tokenized Design Systems</h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              I build component systems with strict variable scales (spacing, typography, semantic colors) that translate directly into React and Tailwind code.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white">3. Design-to-Code Execution</h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              I write clean, typed React and TypeScript frontends with 100% fidelity to the approved Figma designs, with zero layout shifts.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white">4. Honest Collaboration</h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Direct, asynchronous communication via Figma and Loom with weekly checkpoints. No endless corporate bureaucracy.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-8 pt-8 border-t border-white/10">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Career Timeline
        </h2>

        <div className="space-y-8">
          {experienceData.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4 text-xs font-mono text-neutral-400">
                <span className="text-white font-bold block">{item.period}</span>
                <span>{item.context}</span>
              </div>
              <div className="md:col-span-8 space-y-1">
                <h3 className="text-sm font-bold text-white">
                  {item.role}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools List */}
      <section className="space-y-6 pt-8 border-t border-white/10">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Tools & Technologies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {toolsList.map((t) => (
            <div key={t.category} className="space-y-2">
              <div className="text-xs font-mono text-white font-semibold">
                {t.category}
              </div>
              <ul className="space-y-1 text-xs font-mono text-neutral-400">
                {t.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Link */}
      <section className="pt-8 border-t border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Let's discuss a project</h2>
          <p className="text-xs text-neutral-400">Open to design and frontend collaborations.</p>
        </div>
        <Link
          to="/contact"
          className="px-4 py-2 rounded bg-white text-black text-xs font-mono uppercase font-semibold hover:bg-[#FF3E00] hover:text-white transition-colors"
        >
          Contact →
        </Link>
      </section>

    </div>
  );
};
