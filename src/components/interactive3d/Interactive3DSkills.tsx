import React from 'react';
import { ThreeDCard } from '../ui/ThreeDCard';
import { Palette, Wrench, Code2, Check } from 'lucide-react';

const skillCategories = [
  {
    title: 'DESIGN',
    subtitle: 'Methods & Architecture',
    icon: Palette,
    items: [
      'Wireframes & Flows',
      'Prototyping',
      'UI Design',
      'Interaction Design'
    ]
  },
  {
    title: 'TOOLS',
    subtitle: 'Software & Prototyping',
    icon: Wrench,
    items: [
      'Figma',
      'Photoshop',
      'Illustrator',
      'Adobe XD',
      'Sketch',
      'InVision'
    ]
  },
  {
    title: 'DEVELOPMENT',
    subtitle: 'Frontend & Version Control',
    icon: Code2,
    items: [
      'HTML/CSS',
      'JavaScript',
      'GitHub'
    ]
  }
];

export const Interactive3DSkills: React.FC = () => {
  return (
    <section id="skills-section" className="py-24 sm:py-32 md:py-40 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2.5 py-0.5 rounded-full border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                CAPABILITIES
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">DISCIPLINE MATRIX</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
              SKILLS & <br />
              <span className="text-white/50">TOOLKIT.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-white/50 max-w-xs">
            Focused capabilities based on verified resume experience.
          </p>
        </div>

        {/* 3-Column Interactive Category List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <ThreeDCard key={category.title} maxRotation={5} depthZ={10} glareOpacity={0.14}>
                <div className="rounded-3xl border border-white/10 bg-[#090909] p-7 sm:p-9 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/20 h-full flex flex-col justify-between [transform-style:preserve-3d]">
                  
                  <div className="space-y-6">
                    {/* Top Category Badge */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10" style={{ transform: 'translateZ(25px)' }}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF3E00]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold uppercase tracking-tight text-white">
                            {category.title}
                          </h3>
                          <span className="text-[11px] font-mono text-white/40 uppercase">
                            {category.subtitle}
                          </span>
                        </div>
                      </div>
                      
                      <span className="text-xs font-mono text-white/30 font-bold">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Skill Items List */}
                    <div className="space-y-2.5 pt-2" style={{ transform: 'translateZ(35px)' }}>
                      {category.items.map((item) => (
                        <div
                          key={item}
                          className="group/item flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#FF3E00]/30 transition-all"
                        >
                          <span className="text-sm font-sans font-medium text-white/80 group-hover/item:text-white transition-colors">
                            {item}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]/40 group-hover/item:bg-[#FF3E00] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Verification Strip */}
                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40" style={{ transform: 'translateZ(20px)' }}>
                    <span>VERIFIED PRACTICE</span>
                    <span className="text-[#FF3E00]">{category.items.length} SPECIALIZATIONS</span>
                  </div>

                </div>
              </ThreeDCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
