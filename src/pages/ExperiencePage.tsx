import React from 'react';
import { experienceData, craftStats } from '../data/experience';
import { toolsData } from '../data/tools';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FinalCTA } from '../components/sections/FinalCTA';
import { Calendar, MapPin, CheckCircle2, Terminal, Layers, Cpu } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                EXPERIENCE & STACK
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">CHRONOLOGICAL CRAFT</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              CAREER & <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                technical
              </span>{' '}
              EVOLUTION.
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              A comprehensive timeline of product design leadership, design system architecture, and production frontend development.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {craftStats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-1"
              >
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                  {stat.value}
                </div>
                <p className="text-xs font-mono text-white/50 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Chronological Timeline */}
          <div className="space-y-12 py-12 border-t border-white/10">
            <SectionHeading
              number="01"
              tag="CAREER TIMELINE"
              title="EDITORIAL"
              serifWord="work history"
              description="A progressive trajectory of product UI/UX design leadership and production frontend engineering."
            />

            <div className="space-y-8 mt-8">
              {experienceData.map((item) => (
                <div
                  key={item.id}
                  className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#0A0A0A] hover:border-white/20 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Period & Role Column */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00] font-bold">
                        <Calendar size={14} />
                        <span>{item.period}</span>
                        {item.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                            CURRENT
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {item.role}
                      </h3>

                      <p className="text-sm font-mono text-white/70">
                        {item.companyOrContext}
                      </p>

                      <div className="flex items-center space-x-1.5 text-xs font-mono text-white/40">
                        <MapPin size={12} />
                        <span>{item.location}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>

                    {/* Description & Key Achievements Column */}
                    <div className="lg:col-span-8 space-y-6">
                      <p className="text-sm sm:text-base text-muted-primary leading-relaxed">
                        {item.description}
                      </p>

                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-white/50 block">
                          NOTABLE CRAFT HIGHLIGHTS
                        </span>
                        <ul className="space-y-2 text-xs sm:text-sm font-mono text-white/80">
                          {item.achievements.map((ach, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle2 size={15} className="text-[#FF3E00] shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Tooling & Skill Matrix */}
          <div className="py-20 border-t border-white/10">
            <SectionHeading
              number="02"
              tag="TECHNICAL STACK"
              title="SOFTWARE"
              serifWord="& proficiency matrix"
              description="A transparent breakdown of tooling mastery across design, frontend, and engineering ops."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {toolsData.map((cat) => (
                <div
                  key={cat.category}
                  className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                      {cat.category}
                    </span>
                    <p className="text-xs text-muted-primary">
                      {cat.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    {cat.items.map((tool) => (
                      <div key={tool.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-white font-bold">{tool.name}</span>
                          <span className="text-[#FF3E00] px-2 py-0.5 rounded bg-[#FF3E00]/10 text-[10px]">
                            {tool.level}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-white/50">{tool.focus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12">
          <FinalCTA />
        </div>
      </div>
    </PageTransition>
  );
};
