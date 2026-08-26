import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { experimentsData } from '../../data/experiments';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight, Sparkles, Terminal, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

export const LabPreview: React.FC = () => {
  const [springActive, setSpringActive] = useState(false);
  const [weight, setWeight] = useState(400);

  return (
    <section className="py-28 md:py-36 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="04"
          tag="RESEARCH & DESIGN PLAYGROUND"
          title="THE"
          serifWord="lab & experiments"
          description="A living sandbox for micro-interactions, CSS transform physics, procedural typography, and experimental UI mechanics."
          align="split"
        >
          <Link
            to="/lab"
            data-cursor="explore"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF3E00] hover:underline"
          >
            <span>ENTER INTERACTIVE LAB (06)</span>
            <ArrowUpRight size={13} />
          </Link>
        </SectionHeading>

        {/* 2-Column Teaser Grid with Live Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          
          {/* Teaser 1: Tactile Spring Relay */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0A0A0A] flex flex-col justify-between space-y-6 hover:border-white/20 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                <span>EXPERIMENT 01 / MOTION PHYSICS</span>
                <span className="text-white/40">Framer Motion</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Tactile Spring Relay
              </h3>
              <p className="text-xs text-muted-primary mt-1">
                Mechanical damping curve mimicking physical tactile relays with mass-spring-damper equations.
              </p>
            </div>

            {/* Live Interactive Box */}
            <div className="p-8 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center space-y-4">
              <button
                onClick={() => setSpringActive(!springActive)}
                className={`w-20 h-10 rounded-full p-1 transition-colors duration-300 border flex items-center ${
                  springActive ? 'bg-[#FF3E00] border-[#FF3E00]' : 'bg-white/10 border-white/20'
                }`}
                aria-label="Toggle Spring Switch"
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                  animate={{ x: springActive ? 40 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#050505]" />
                </motion.div>
              </button>

              <span className="text-xs font-mono text-white/60">
                STATE: {springActive ? 'ACTIVE (SPRING COMPRESSED)' : 'REST STATE'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <span className="text-white/40">stiffness: 500 • damping: 25</span>
              <Link to="/lab" className="text-[#FF3E00] hover:underline flex items-center gap-1">
                <span>INSPECT LAB</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {/* Teaser 2: Kinetic Variable Font */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0A0A0A] flex flex-col justify-between space-y-6 hover:border-white/20 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                <span>EXPERIMENT 02 / VARIABLE TYPE</span>
                <span className="text-white/40">CSS Font-Variation</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Kinetic Typographic Axis
              </h3>
              <p className="text-xs text-muted-primary mt-1">
                Continuous weight interpolation on variable font vectors with zero layout shift.
              </p>
            </div>

            {/* Live Interactive Box */}
            <div className="p-8 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center space-y-4">
              <p
                className="text-3xl text-white tracking-tighter select-none transition-all duration-75 text-center"
                style={{ fontWeight: weight }}
              >
                SCRILLO LAB
              </p>

              <div className="w-full space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-white/50">
                  <span>WEIGHT AXIS</span>
                  <span className="text-[#FF3E00]">{weight}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="900"
                  step="50"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#FF3E00] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <span className="text-white/40">font-variation-settings: 'wght' {weight}</span>
              <Link to="/lab" className="text-[#FF3E00] hover:underline flex items-center gap-1">
                <span>INSPECT LAB</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
