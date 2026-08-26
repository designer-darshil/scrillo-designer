import React, { useState } from 'react';
import { services } from '../../data/services';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight, Check, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CapabilitiesSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-28 md:py-36 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="04"
          tag="CAPABILITIES & SERVICES"
          title="END-TO-END"
          serifWord="craft"
          description="From early system architecture to pixel-perfect Figma components and production React frontends."
          align="split"
        >
          <Link
            to="/services"
            data-cursor="explore"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF3E00] hover:underline"
          >
            <span>EXPLORE ALL SERVICES & DELIVERABLES</span>
            <ArrowUpRight size={13} />
          </Link>
        </SectionHeading>

        {/* Editorial Accordion List */}
        <div className="space-y-4 mt-12">
          {services.map((service, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={service.id}
                className="border border-white/10 rounded-2xl bg-[#0A0A0A] overflow-hidden transition-colors hover:border-white/20"
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left gap-4 select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center space-x-4 md:space-x-8">
                    <span className="font-mono text-xs md:text-sm text-[#FF3E00] font-bold">
                      {service.number}
                    </span>
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className="hidden sm:block text-xs font-mono text-white/40 mt-1 uppercase tracking-wider">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="hidden md:inline text-xs font-mono text-white/50 uppercase px-3 py-1 rounded-full border border-white/10">
                      {service.category}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white">
                      {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 px-6 md:px-8 py-6 bg-black/40"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Description & Problem Solved */}
                        <div className="md:col-span-6 space-y-4">
                          <p className="text-sm md:text-base text-muted-primary leading-relaxed">
                            {service.description}
                          </p>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                            <span className="text-[10px] font-mono text-[#FF3E00] uppercase font-bold tracking-wider">
                              PROBLEM SOLVED
                            </span>
                            <p className="text-xs text-white/80">
                              {service.problemSolved}
                            </p>
                          </div>
                        </div>

                        {/* Deliverables Checklist */}
                        <div className="md:col-span-6 space-y-4">
                          <span className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                            WHAT YOU RECEIVE
                          </span>
                          <ul className="space-y-2 text-xs font-mono text-white/80">
                            {service.whatYouGet.map((item) => (
                              <li key={item} className="flex items-start space-x-2.5">
                                <Check size={14} className="text-[#FF3E00] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="pt-2 flex items-center space-x-2">
                            {service.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/60"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
