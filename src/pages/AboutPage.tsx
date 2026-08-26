import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CurrentlySection } from '../components/ui/CurrentlySection';
import { LikesDislikes } from '../components/ui/LikesDislikes';
import { FinalCTA } from '../components/sections/FinalCTA';
import { siteConfig } from '../data/site';
import { media } from '../data/media';
import { Laptop, Terminal, Coffee } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Hero Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                ABOUT SCRILLO
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">CRAFT, CODE & INTENTION</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              DESIGNER. <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                builder.
              </span>{' '}
              <br />
              PROBLEM SOLVER.
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              I am an independent UI/UX and frontend web designer based in Bangalore, working with ambitious product teams worldwide. I believe the best digital experiences happen when visual craft and technical execution are conceived by the same mind.
            </p>
          </div>

          {/* Portrait & Manifesto Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16 border-t border-white/10">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-[#0A0A0A] group shadow-2xl">
                <img
                  src={media.designerPortrait}
                  alt="Scrillo Portrait"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                    BANGALORE, INDIA
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    Independent Digital Craft & Engineering
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-muted-primary text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Closing the Chasm Between Canvas and Code
              </h2>
              <p>
                In the conventional product cycle, a designer creates static mockups in Figma, hands them to an engineering team, and hopes the nuances don't get lost in translation. Inevitably, padding shifts, font line-heights break, animations lose their spring tension, and edge cases get ignored.
              </p>
              <p>
                I eliminate that friction by designing directly with the DOM in mind. When I craft a layout in Figma, I already know how the CSS Grid will collapse, how the TypeScript interface will model the state, and how the spring curve will feel under the user's thumb.
              </p>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="font-handwritten text-2xl text-[#FF3E00]">
                  "Great design is invisible until you notice that you haven't felt frustrated once."
                </p>
              </div>
            </div>
          </div>

          {/* Personality Section: I LIKE vs I DON'T LIKE */}
          <div className="py-20 border-t border-white/10">
            <SectionHeading
              number="01"
              tag="PERSONAL TASTE & PERSPECTIVE"
              title="DESIGN"
              serifWord="predilections"
              description="A direct look at the principles I champion and the superficial anti-patterns I reject."
            />
            <div className="mt-8">
              <LikesDislikes />
            </div>
          </div>

          {/* Currently & Exploring */}
          <div className="py-20 border-t border-white/10">
            <SectionHeading
              number="02"
              tag="REAL-TIME FOCUS"
              title="CURRENTLY"
              serifWord="active & exploring"
              description="Ongoing design systems, micro-interaction research, and engineering experiments."
            />
            <div className="mt-8">
              <CurrentlySection />
            </div>
          </div>

          {/* Design Philosophy & Core Principles */}
          <div className="py-20 border-t border-white/10">
            <SectionHeading
              number="03"
              tag="CORE VALUES"
              title="DESIGN"
              serifWord="philosophy"
              description="The foundational tenets that govern every wireframe, token scale, and code commit."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {siteConfig.principles.map((p) => (
                <div
                  key={p.number}
                  className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-4 hover:border-white/20 transition-colors"
                >
                  <span className="font-mono text-xs text-[#FF3E00] font-bold">
                    PRINCIPLE {p.number}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-primary leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Studio Setup & Personal Notes */}
          <div className="py-20 border-t border-white/10">
            <SectionHeading
              number="04"
              tag="THE WORKSPACE"
              title="TOOLS &"
              serifWord="hardware setup"
              description="The hardware and software environment powering daily design and code execution."
              align="split"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-3">
                <Laptop className="text-[#FF3E00]" size={20} />
                <h3 className="text-lg font-bold text-white">Hardware & Displays</h3>
                <p className="text-xs text-muted-primary leading-relaxed">
                  Apple MacBook Pro M3 Max, Apple Studio Display (5K), CalDigit TS4 Dock, Keychron Q1 Custom Mechanical Keyboard (Gateron Oil Kings).
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-3">
                <Terminal className="text-blue-400" size={20} />
                <h3 className="text-lg font-bold text-white">Software & Editor</h3>
                <p className="text-xs text-muted-primary leading-relaxed">
                  Figma for interface & token exploration, VS Code with tailored minimal dark theme, Warp Terminal, Raycast, Linear, and Notion.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-3">
                <Coffee className="text-amber-400" size={20} />
                <h3 className="text-lg font-bold text-white">Outside the Screen</h3>
                <p className="text-xs text-muted-primary leading-relaxed">
                  Collecting Swiss typography books, exploring Brutalist architecture photography, pour-over specialty coffee, and analog film cameras.
                </p>
              </div>
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
