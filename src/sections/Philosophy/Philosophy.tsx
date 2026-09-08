import React from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { Marquee } from '../../components/Marquee/Marquee';

export const Philosophy: React.FC = () => {
  const principles = [
    {
      num: 'I',
      title: 'FORM AS CONSEQUENCE',
      desc: 'Visual choices are direct outcomes of structural necessity, never arbitrary cosmetic layers.',
    },
    {
      num: 'II',
      title: 'KINETIC INTENT',
      desc: 'Motion should clarify hierarchy and space, reacting with crisp physical weight rather than gratuitous delay.',
    },
    {
      num: 'III',
      title: 'TIMELESS MONOCHROME',
      desc: 'Black, white, and raw light strip away noise, forcing clarity of typography, spacing, and narrative.',
    },
  ];

  return (
    <section className="py-20 border-t border-white/10 bg-dark-950">
      <div className="editorial-container">
        <SectionLabel number="04A" title="CORE PHILOSOPHY & TENETS" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p) => (
            <div key={p.num} className="border-t border-white/20 pt-6">
              <span className="font-editorial-serif text-3xl text-light-500 italic block mb-3">
                {p.num}.
              </span>
              <h4 className="font-display text-lg font-bold uppercase tracking-tight text-light-100 mb-3">
                {p.title}
              </h4>
              <p className="font-body text-sm text-light-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <Marquee
          items={[
            'SYSTEMATIC RESTRAINT',
            'SUBPIXEL PRECISION',
            'ZERO ARBITRARY DECORATION',
            'RADICAL CLARITY',
            'KINETIC CHOREOGRAPHY',
          ]}
          speed="slow"
        />
      </div>
    </section>
  );
};
