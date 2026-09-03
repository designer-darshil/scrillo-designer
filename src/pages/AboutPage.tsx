import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { FinalCTA } from '../components/sections/FinalCTA';
import { media } from '../data/media';
import { siteConfig } from '../data/site';
import { experienceData } from '../data/experience';
import { Calendar } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Hero Header */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                ABOUT
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">{siteConfig.name}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-6 font-bold">
              <span>{siteConfig.initials}</span>
              <span className="text-white/30">/</span>
              <span className="text-white">{siteConfig.name}</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              UI/UX DESIGNER <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[0.85em] sm:text-[0.92em] block my-1 sm:my-2">
                + web designer / frontend
              </span>
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-white/80 leading-relaxed font-normal">
              8+ years of UI/UX design experience and 4+ years of web design and frontend implementation. I solve product challenges end-to-end—from system architecture to production web code.
            </p>
          </div>

          {/* Portrait & Narrative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16 border-t border-white/10">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-[#0A0A0A] group shadow-2xl">
                <img
                  src={media.designerPortrait}
                  alt={`${siteConfig.name} Portrait`}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                    BANGALORE, INDIA
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    Senior UI/UX & Frontend Web Design
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-muted-primary text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Closing the Chasm Between Canvas and Code
              </h2>
              <p>
                In the conventional product cycle, a designer creates static mockups in Figma, hands them off to engineering, and hopes the nuances don't get lost in translation. Inevitably, padding shifts, line-heights break, animations lose their spring tension, and state edge cases get overlooked.
              </p>
              <p>
                I eliminate that friction by designing directly with DOM architecture in mind. When I craft a layout, I already know how the responsive layout collapses, how the TypeScript interface models state, and how the interaction feels under real user input.
              </p>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="font-handwritten text-2xl text-[#FF3E00]">
                  "The work is the hero. The interface frames the work."
                </p>
              </div>
            </div>
          </div>

          {/* Two Core Disciplines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 border-t border-white/10">
            <div className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                01. UI/UX DESIGN (8+ YRS)
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">Product Architecture & Design Systems</h3>
              <p className="text-sm text-muted-primary leading-relaxed">
                Specialized in multi-tenant SaaS dashboards, complex data density, command-driven workflows (Cmd+K), and ergonomic dark interfaces with WCAG AAA contrast.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                02. FRONTEND WEB (4+ YRS)
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">Production React & Web Engineering</h3>
              <p className="text-sm text-muted-primary leading-relaxed">
                Translating Figma tokens into modular, clean React components, Tailwind CSS utility hierarchies, and 60fps spring animations with zero layout shift.
              </p>
            </div>
          </div>

          {/* Concise Experience Timeline */}
          <div className="py-16 border-t border-white/10">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                EXPERIENCE
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                Career Background
              </h3>
            </div>

            <div className="space-y-4">
              {experienceData.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00]">
                      <Calendar size={13} />
                      <span>{item.period}</span>
                      {item.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-white">{item.role}</h4>
                    <p className="text-xs font-mono text-white/50">{item.companyOrContext}</p>
                  </div>

                  <p className="text-sm text-muted-primary max-w-xl">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-8">
          <FinalCTA />
        </div>
      </div>
    </PageTransition>
  );
};
