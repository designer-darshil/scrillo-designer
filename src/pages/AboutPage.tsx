import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { FinalCTA } from '../components/sections/FinalCTA';
import { media } from '../data/media';
import { siteConfig } from '../data/site';
import { experienceData } from '../data/experience';
import { Calendar, GraduationCap, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.95] sm:leading-[0.92] mb-8 break-words">
              UI/UX DESIGNER <br />
              <span className="italic font-light text-[#FF3E00] tracking-tight lowercase text-[0.88em] sm:text-[0.92em] block my-1 sm:my-2">
                · web designer
              </span>
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-white/80 leading-relaxed font-normal">
              I design digital experiences and websites with a focus on clarity, usability, and thoughtful interaction. Experienced across SaaS and e-commerce platforms from wireframes and prototypes to frontend web implementation.
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
                    LOCATION
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    {siteConfig.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-muted-primary text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Design Grounded in Practical Execution
              </h2>
              <p>
                As a UI/UX designer and web designer, I work across the full lifecycle of digital products. I start by understanding the problem, structuring user flows, and sketching wireframes. From there, I build high-fidelity interface mockups and interactive prototypes in Figma and Adobe XD.
              </p>
              <p>
                Having hands-on experience with frontend development using HTML, CSS, JavaScript, and Bootstrap allows me to design with implementation realities in mind—ensuring responsive layouts, consistent component states, and smooth handoffs to development teams.
              </p>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="font-sans italic font-normal text-lg sm:text-xl text-[#FF3E00] leading-relaxed">
                  "Clarity, usability, and functional design come first."
                </p>
              </div>
            </div>
          </div>

          {/* Concise Skills Section */}
          <div className="py-16 border-t border-white/10">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                CAPABILITIES
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                Skills & Disciplines
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                  01. DESIGN & USER EXPERIENCE
                </span>
                <h4 className="text-xl font-bold text-white">Product & Web Design</h4>
                <p className="text-sm text-muted-primary leading-relaxed">
                  Focused on clear information architecture, user journeys, wireframing, and interactive prototyping.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {siteConfig.skills.design.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-white/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                  02. TOOLS & CODE
                </span>
                <h4 className="text-xl font-bold text-white">Software & Frontend Stack</h4>
                <p className="text-sm text-muted-primary leading-relaxed">
                  Everyday design tools and frontend technologies used to build responsive, accessible web interfaces.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {siteConfig.skills.toolsAndCode.map((tool) => (
                    <span key={tool} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-white/80">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actual Employment Experience Timeline */}
          <div className="py-16 border-t border-white/10">
            <div className="mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                EXPERIENCE
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                Work History
              </h3>
            </div>

            <div className="space-y-4">
              {experienceData.map((item) => (
                <div
                  key={item.id}
                  className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div className="space-y-2 md:w-1/3 shrink-0">
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00]">
                      <Calendar size={13} />
                      <span>{item.period}</span>
                      {item.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-white">{item.role}</h4>
                    <p className="text-sm font-mono text-white/60">{item.companyOrContext}</p>
                  </div>

                  <div className="space-y-3 md:w-2/3">
                    <p className="text-sm text-muted-primary leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.technologies.map((tech) => (
                        <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Education Section */}
          <div className="py-16 border-t border-white/10">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                ACADEMICS
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                Education
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteConfig.education.map((edu, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-[#0C0C0C] space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00]">
                    <GraduationCap size={14} />
                    <span>{edu.period}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{edu.institution}</h4>
                  <p className="text-xs font-mono text-white/50">{edu.degree}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Contact Reference */}
          <div className="py-12 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1">
                CONTACT DETAILS
              </span>
              <p className="text-sm font-mono text-white/80">
                Email: <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-[#FF3E00] underline">{siteConfig.email}</a> • Phone: <a href={siteConfig.phoneHref} className="text-white hover:text-[#FF3E00] underline">{siteConfig.formattedPhone}</a>
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight size={14} />
            </Link>
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
