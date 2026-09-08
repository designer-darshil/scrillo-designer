import React from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { ArrowUpRight } from 'lucide-react';

export const Services: React.FC = () => {
  const serviceOfferings = [
    {
      index: '01',
      title: 'CREATIVE DIRECTION & BRAND ARCHITECTURE',
      deliverables: ['Visual identity systems', 'Typography curation', 'Design guidelines', 'Art direction'],
    },
    {
      index: '02',
      title: 'PRODUCT INTERACTION & UX/UI DESIGN',
      deliverables: ['Web app interfaces', 'Mobile UX', 'Micro-interactions', 'Design systems in Figma'],
    },
    {
      index: '03',
      title: 'CREATIVE DEVELOPMENT & FRONTEND ENGINEERING',
      deliverables: ['React / Vite / Next.js builds', 'GSAP & ScrollTrigger motion', 'Lenis smooth scrolling', 'Web performance audits'],
    },
  ];

  return (
    <section id="services" className="py-20 border-t border-white/10">
      <div className="editorial-container">
        <SectionLabel number="04B" title="COMMISSION SCOPE & SERVICES" />

        <div className="mt-12 space-y-px bg-white/10 border border-white/10">
          {serviceOfferings.map((svc) => (
            <div
              key={svc.index}
              className="bg-dark-900 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-dark-850 transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-xs text-light-600">[{svc.index}]</span>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-light-100">
                    {svc.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:max-w-md">
                {svc.deliverables.map((d, i) => (
                  <span
                    key={i}
                    className="font-mono text-[11px] px-3 py-1 bg-white/5 border border-white/10 text-light-400 uppercase tracking-wider"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="hidden lg:block text-light-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
