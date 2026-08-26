import React from 'react';
import { services } from '../data/services';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FinalCTA } from '../components/sections/FinalCTA';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does the design-to-code workflow function in practice?',
    a: 'We begin in Figma with wireframes and tokenized high-fidelity designs. Once approved, I translate the components directly into a modular React / Next.js repository using Tailwind CSS or vanilla token scales. You receive both the design files and the production-ready code.'
  },
  {
    q: 'Can you work solely on UI/UX design or solely on frontend development?',
    a: 'Yes. While clients achieve maximum speed and fidelity when I handle both sides, I frequently collaborate with in-house engineering squads as a Lead Product Designer or step in as a Creative Frontend Developer to build out existing Figma files.'
  },
  {
    q: 'What is your typical project timeline?',
    a: 'A focused landing page or marketing website typically takes 2–3 weeks. Complete product redesigns, complex SaaS interfaces, or end-to-end design systems generally range between 6 to 12 weeks.'
  },
  {
    q: 'How are client communication and project milestones managed?',
    a: 'We establish an asynchronous Slack or Discord channel for daily updates, with weekly Loom video walkthroughs and live Figma checkpoints. No endless corporate meetings—just rapid, transparent progress.'
  }
];

export const ServicesPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                CAPABILITIES & PARTNERSHIPS
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">END-TO-END DIGITAL CRAFT</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              SERVICES & <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                deliverables.
              </span>
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              Tailored design and engineering engagements for startups, modern product teams, and progressive creative brands looking for distinct digital presence.
            </p>
          </div>

          {/* Deep Dive Services Grid */}
          <div className="space-y-16 py-12 border-t border-white/10">
            {services.map((svc) => (
              <article
                key={svc.id}
                id={svc.id}
                className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0C0C0C] space-y-8"
              >
                {/* Top Title & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-sm text-[#FF3E00] font-bold">
                      {svc.number}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {svc.title}
                    </h2>
                  </div>

                  <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 text-white/60 w-fit">
                    {svc.category}
                  </span>
                </div>

                <p className="font-editorial-serif italic text-xl sm:text-2xl text-white/90">
                  "{svc.tagline}"
                </p>

                {/* 3-Column Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Column 1: The Problem Solved */}
                  <div className="md:col-span-4 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold block">
                      PROBLEM SOLVED
                    </span>
                    <p className="text-sm text-muted-primary leading-relaxed">
                      {svc.problemSolved}
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed pt-2">
                      {svc.description}
                    </p>
                  </div>

                  {/* Column 2: What You Receive */}
                  <div className="md:col-span-4 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                      WHAT YOU RECEIVE
                    </span>
                    <ul className="space-y-2 text-xs font-mono text-white/80">
                      {svc.whatYouGet.map((item) => (
                        <li key={item} className="flex items-start space-x-2">
                          <CheckCircle size={14} className="text-[#FF3E00] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Deliverables & Tech */}
                  <div className="md:col-span-4 space-y-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-2">
                        DELIVERABLES
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {svc.deliverables.map((del) => (
                          <span
                            key={del}
                            className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to="/contact"
                        data-cursor="cta"
                        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#FF3E00] font-bold hover:underline"
                      >
                        <span>LET'S DISCUSS YOUR PROJECT</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="py-20 border-t border-white/10">
            <SectionHeading
              number="02"
              tag="COMMON INQUIRIES"
              title="FREQUENTLY"
              serifWord="asked questions"
              description="Clear answers on process, timelines, and collaboration."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] space-y-3"
                >
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-start space-x-2">
                    <HelpCircle size={18} className="text-[#FF3E00] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm text-muted-primary leading-relaxed pl-6">
                    {faq.a}
                  </p>
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
