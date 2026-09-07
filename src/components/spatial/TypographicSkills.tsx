import React, { useState } from 'react';
import { motion } from 'framer-motion';

const skillMatrix = [
  {
    discipline: 'DESIGN',
    number: '01',
    description: 'Information Architecture & UX',
    items: [
      { name: 'Wireframes & Flows', detail: 'Structural blueprints & journey mapping' },
      { name: 'Prototyping', detail: 'High-fidelity interactive prototypes' },
      { name: 'UI Design', detail: 'Design tokens & visual systems' },
      { name: 'Interaction Design', detail: 'Micro-animations & tactile state flows' }
    ]
  },
  {
    discipline: 'TOOLS',
    number: '02',
    description: 'Digital Production Arsenal',
    items: [
      { name: 'Figma', detail: 'Components, auto-layout & token variables' },
      { name: 'Photoshop', detail: 'Raster curation & visual texture editing' },
      { name: 'Illustrator', detail: 'Vector marks & iconography creation' },
      { name: 'Adobe XD', detail: 'Experience testing & screen architecture' },
      { name: 'Sketch', detail: 'Symbol libraries & interface layouts' },
      { name: 'InVision', detail: 'Interactive walkthroughs & handoffs' }
    ]
  },
  {
    discipline: 'DEVELOPMENT',
    number: '03',
    description: 'Frontend Implementation Realities',
    items: [
      { name: 'HTML/CSS', detail: 'Semantic HTML5, CSS3 3D & flexbox/grid' },
      { name: 'JavaScript', detail: 'DOM events, modern ES6+ & reactive state' },
      { name: 'GitHub', detail: 'Branching strategies, PR reviews & CI/CD' }
    ]
  }
];

export const TypographicSkills: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="spatial-skills" className="section-padding bg-[#050505] border-b border-white/10 relative overflow-hidden select-none">
      <div className="site-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10 mb-10 sm:mb-16">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-3 sm:mb-4">
              <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                04
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">TYPOGRAPHIC CAPABILITIES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
              SKILLS & <br />
              <span className="text-white/50">DISCIPLINES.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-white/50 max-w-xs text-pretty">
            Pure typographic architecture without cards. Hover to inspect spatial depth.
          </p>
        </div>

        {/* Typographic Columns Grid (No Cards!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start">
          {skillMatrix.map((col) => (
            <div key={col.discipline} className="space-y-6 sm:space-y-8">
              
              {/* Column Discipline Header */}
              <div className="pb-3 sm:pb-4 border-b border-white/15 flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#FF3E00] font-bold block mb-1">
                    {col.number} / DISCIPLINE
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                    {col.discipline}
                  </h3>
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono text-white/40 uppercase text-right">
                  {col.description}
                </span>
              </div>

              {/* Architectural Typographic List */}
              <div className="space-y-3 sm:space-y-4">
                {col.items.map((item) => {
                  const isHovered = hoveredSkill === item.name;

                  return (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredSkill(item.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="group cursor-default py-2 border-b border-white/5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <motion.span
                          animate={{
                            x: isHovered ? 6 : 0,
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`text-base sm:text-xl md:text-2xl font-bold uppercase tracking-tight transition-colors duration-200 block min-w-0 ${
                            isHovered ? 'text-[#FF3E00]' : 'text-white/80 group-hover:text-white'
                          }`}
                        >
                          {item.name}
                        </motion.span>

                        <span className={`w-2 h-2 rounded-full shrink-0 transition-all duration-200 ${
                          isHovered ? 'bg-[#FF3E00] scale-125' : 'bg-white/10 group-hover:bg-white/30'
                        }`} />
                      </div>

                      <p className={`text-xs font-mono pt-1 transition-colors duration-200 text-pretty ${
                        isHovered ? 'text-white/80' : 'text-white/40'
                      }`}>
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Capabilities Tag */}
        <div className="pt-6 sm:pt-10 mt-8 sm:mt-12 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/30 uppercase tracking-widest border-t border-white/10">
          <span>SURAT, GUJARAT, INDIA</span>
          <span>DISCIPLINE MATRIX · ZERO FLUFF</span>
        </div>

      </div>
    </section>
  );
};
