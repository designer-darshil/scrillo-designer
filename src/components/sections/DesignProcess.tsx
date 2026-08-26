import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Compass, GitMerge, Layout, Code2, Sparkles, ArrowRight } from 'lucide-react';

export const processSteps = [
  {
    step: '01',
    title: 'UNDERSTAND',
    subtitle: 'Discovery, Heuristics & Mental Models',
    icon: Compass,
    description: 'Deconstruct the underlying product domain, dissect competitor friction points, and interview key stakeholders to identify high-leverage user workflows.',
    deliverable: 'IA Map & Problem Definition Dossier'
  },
  {
    step: '02',
    title: 'STRUCTURE',
    subtitle: 'Spatial Layout & Information Flow',
    icon: GitMerge,
    description: 'Establish the core layout geometry, navigation taxonomy, and keyboard-first hierarchy. Wireframing key states without decorative distraction.',
    deliverable: 'Low-Fidelity Interactive Wireframes'
  },
  {
    step: '03',
    title: 'DESIGN',
    subtitle: 'Visual Systems & Token Architecture',
    icon: Layout,
    description: 'Define semantic color scales, typographic scales, micro-interactions, and component variants in Figma with rigorous auto-layout standards.',
    deliverable: 'High-Fidelity Figma Design System Kit'
  },
  {
    step: '04',
    title: 'BUILD',
    subtitle: 'Design-to-Code Frontend Engineering',
    icon: Code2,
    description: 'Translate tokens directly into modular React, TypeScript, and CSS. Engineering accessible primitives with 60fps spring transitions.',
    deliverable: 'Production GitHub Repository / Component Library'
  },
  {
    step: '05',
    title: 'REFINE',
    subtitle: 'Audits, Performance & Polish',
    icon: Sparkles,
    description: 'Run Core Web Vitals profiling, Lighthouse accessibility testing, responsive cross-browser testing, and refine tactile micro-animations.',
    deliverable: '98+ Lighthouse Audit & Verified Deployment'
  }
];

export const DesignProcess: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="05"
          tag="METHODOLOGY & CADENCE"
          title="HOW I"
          serifWord="approach craft"
          description="A structured, linear-yet-iterative process combining deep design thinking with production software engineering."
          align="split"
        />

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {processSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/10 bg-[#0D0D0D] p-6 flex flex-col justify-between group hover:border-[#FF3E00]/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-[#FF3E00]">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#FF3E00] group-hover:border-[#FF3E00] transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[#FF3E00]/90 mb-4">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-muted-primary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Deliverable Pill */}
                <div className="mt-8 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1">
                    OUTPUT
                  </span>
                  <span className="text-xs font-mono text-white/80 font-medium">
                    {item.deliverable}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Note */}
        <div className="mt-12 p-6 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Iterative cycles with continuous client review checkpoints via Loom & Figma</span>
          </div>
          <span className="text-[#FF3E00] font-bold">ZERO GUESSWORK • PURE TRANSPARENCY</span>
        </div>

      </div>
    </section>
  );
};
