import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { experienceData } from '../data/experience';
import { siteConfig } from '../data/site';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-24 sm:pt-32 pb-20 sm:pb-28 bg-[#060606] text-white">
        <div className="site-container">
          
          {/* Header Metadata */}
          <div className="flex items-center gap-3 font-mono text-xs text-[#FF3E00] tracking-widest uppercase mb-8 pb-4 border-b border-white/[0.08]">
            <span className="text-white font-bold">ABOUT</span>
            <span className="text-white/20">/</span>
            <span className="text-white/60">STATEMENT & BACKGROUND</span>
          </div>

          {/* One Strong Editorial Statement */}
          <div className="py-8 sm:py-12 max-w-4xl">
            <h1 className="clamp-statement font-extrabold tracking-tight sm:tracking-tighter uppercase text-white editorial-title leading-[1.05]">
              UI/UX DESIGNER AND WEB DESIGNER FOCUSED ON CREATING CLEAR, USEFUL AND VISUALLY REFINED DIGITAL EXPERIENCES.
            </h1>

            <p className="mt-8 text-white/70 text-base sm:text-xl font-normal leading-relaxed max-w-2xl text-pretty">
              Working across the entire interface design lifecycle—from problem discovery, user flows, and wireframing in Figma to high-fidelity design systems and clean responsive frontend implementation.
            </p>
          </div>

          {/* Education & Core Disciplines */}
          <div className="py-12 sm:py-16 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4 font-mono text-xs text-white/40 uppercase tracking-wider">
              01 // EDUCATION & LOCATION
            </div>
            <div className="md:col-span-8 space-y-6">
              <div>
                <span className="font-mono text-xs text-[#FF3E00] uppercase block mb-1">
                  UNDERGRADUATE STUDIES (2018 — 2022)
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Sarvepalli Radhakrishnan University, Bhopal
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Surat, Gujarat, India
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-6 font-mono text-xs text-white/60">
                <div>
                  <span className="text-white/30 block text-[10px] uppercase">STATUS</span>
                  <span className="text-white">Active Industry Designer</span>
                </div>
                <div>
                  <span className="text-white/30 block text-[10px] uppercase">FOCUS</span>
                  <span className="text-white">UI/UX · Web Design</span>
                </div>
                <div>
                  <span className="text-white/30 block text-[10px] uppercase">DIRECT CONTACT</span>
                  <a
                    href="mailto:darshilbhuva4322@gmail.com"
                    className="text-[#FF3E00] hover:underline"
                  >
                    darshilbhuva4322@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Concise Experience Timeline */}
          <div className="py-12 sm:py-16 border-t border-white/[0.08]">
            <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-8">
              02 // PROFESSIONAL EXPERIENCE
            </div>

            <div className="space-y-10">
              {experienceData.map((exp, index) => (
                <div
                  key={exp.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 pb-10 border-b border-white/[0.06] last:border-b-0 last:pb-0"
                >
                  <div className="md:col-span-4 font-mono text-xs text-white/50 space-y-1">
                    <div className="text-white font-medium">{exp.period}</div>
                    <div className="text-white/40">{exp.location}</div>
                  </div>

                  <div className="md:col-span-8 space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                      {exp.companyOrContext}
                    </h3>
                    <div className="font-mono text-xs text-[#FF3E00]">
                      {exp.role} · {exp.type}
                    </div>
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl pt-1">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="font-mono text-xs text-white/50 uppercase tracking-wider">
              READY TO COLLABORATE ON YOUR NEXT DIGITAL PRODUCT?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors"
            >
              <span>GO TO CONTACT</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
