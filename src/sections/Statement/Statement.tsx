import React from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { RevealText } from '../../components/RevealText/RevealText';

export const Statement: React.FC = () => {
  return (
    <section id="statement" className="py-24 border-t border-white/10 bg-dark-900">
      <div className="editorial-container">
        <SectionLabel number="02" title="DESIGN STATEMENT / MANIFESTO" />

        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 font-mono text-xs text-light-500 uppercase tracking-widest leading-relaxed">
            [POSITION]
            <p className="mt-4 text-light-400 font-sans text-sm">
              We reject meaningless decorative fluff. Every pixel, letterform, and transition must serve an undeniable functional or conceptual intent.
            </p>
          </div>

          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-light-100 leading-tight">
              <RevealText>
                DISCIPLINE OVER TRENDS.
              </RevealText>{' '}
              <span className="font-editorial-serif font-normal lowercase italic text-light-300">
                typography
              </span>{' '}
              <RevealText>
                AS ARCHITECTURE.
              </RevealText>
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-light-400 text-base leading-relaxed">
              <p>
                In an era crowded with ephemeral noise, rigorous restraint creates enduring impact. By synthesizing high-contrast monochrome aesthetics with razor-sharp creative engineering, we sculpt digital environments that command undivided attention.
              </p>
              <p>
                From fluid smooth-scroll orchestrations to granular micro-interactions, our craft bridges structural design rigor with modern performance standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
