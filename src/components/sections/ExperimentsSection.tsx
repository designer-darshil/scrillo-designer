import React, { useState } from 'react';
import { experimentsData } from '../../data/experiments';
import { SectionHeading } from '../ui/SectionHeading';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Sliders, Move3d, Palette, Eye } from 'lucide-react';

export const ExperimentsSection: React.FC = () => {
  // Experiment 1 State: Spring Switch
  const [springActive, setSpringActive] = useState(false);

  // Experiment 2 State: Variable Font Slider
  const [fontWeight, setFontWeight] = useState(400);
  const [letterSpacing, setLetterSpacing] = useState(0);

  // Experiment 3 State: 3D Matrix Tilt
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // Experiment 4 State: Color Mixer
  const [accentHue, setAccentHue] = useState(16); // ~#FF3E00

  return (
    <section className="py-28 md:py-36 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="06"
          tag="RESEARCH & EXPERIMENTAL LAB"
          title="CREATIVE"
          serifWord="experiments"
          description="A sandbox for micro-interactions, CSS transform physics, procedural typography, and experimental UI mechanics."
          align="split"
        />

        {/* 2x2 Interactive Lab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          
          {/* EXPERIMENT 1: Spring Physics Switch */}
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                <span>EXP. 01 / INTERACTION PHYSICS</span>
                <span className="text-white/40">Framer Motion</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Tactile Spring Switch
              </h3>
              <p className="text-xs text-muted-primary mt-1">
                Mechanical damping curve mimicking physical tactile relays with mass-spring-damper equations.
              </p>
            </div>

            {/* Interactive Widget Area */}
            <div className="p-8 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center space-y-4">
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

            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/50">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">stiffness: 500</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">damping: 25</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">mass: 1.0</span>
            </div>
          </div>

          {/* EXPERIMENT 2: Variable Font Axis */}
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                <span>EXP. 02 / VARIABLE TYPE</span>
                <span className="text-white/40">CSS Font-Variation</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Kinetic Typographic Axis
              </h3>
              <p className="text-xs text-muted-primary mt-1">
                Continuous weight interpolation and optical kerning adjustments on variable font vectors.
              </p>
            </div>

            {/* Interactive Widget Area */}
            <div className="p-6 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center space-y-4">
              <p
                className="text-3xl sm:text-4xl text-white tracking-tighter select-none transition-all duration-75 text-center"
                style={{
                  fontWeight: fontWeight,
                  letterSpacing: `${letterSpacing}px`
                }}
              >
                SCRILLO CRAFT
              </p>

              <div className="w-full grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-white/50">
                    <span>WEIGHT</span>
                    <span className="text-[#FF3E00]">{fontWeight}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="900"
                    step="50"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(Number(e.target.value))}
                    className="w-full accent-[#FF3E00] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-white/50">
                    <span>TRACKING</span>
                    <span className="text-[#FF3E00]">{letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full accent-[#FF3E00] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-white/40">
              font-variation-settings: 'wght' {fontWeight}
            </div>
          </div>

          {/* EXPERIMENT 3: 3D Perspective Matrix */}
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                <span>EXP. 03 / LIGHTWEIGHT 3D</span>
                <span className="text-white/40">Pure CSS3D</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                CSS 3D Vector Depth
              </h3>
              <p className="text-xs text-muted-primary mt-1">
                Zero WebGL overhead. Coordinate perspective math calculated with normalized cursor vectors.
              </p>
            </div>

            {/* Interactive 3D Card Box */}
            <div
              className="h-44 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden perspective-container"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setTiltX(-y * 24);
                setTiltY(x * 24);
              }}
              onMouseLeave={() => {
                setTiltX(0);
                setTiltY(0);
              }}
            >
              <div
                style={{
                  transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
                className="w-32 h-20 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex flex-col items-center justify-center p-3 text-center shadow-xl"
              >
                <Move3d size={16} className="text-[#FF3E00] mb-1" />
                <span className="text-[10px] font-mono text-white uppercase font-bold">
                  TILT ME
                </span>
                <span className="text-[9px] font-mono text-white/50">
                  {tiltX.toFixed(0)}° / {tiltY.toFixed(0)}°
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-white/40">
              transform: perspective(600px) rotateX({tiltX.toFixed(0)}deg) rotateY({tiltY.toFixed(0)}deg)
            </div>
          </div>

          {/* EXPERIMENT 4: OKLCH Color Harmonizer */}
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                <span>EXP. 04 / COLOR TOKENS</span>
                <span className="text-white/40">Color Spaces</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Harmonic Palette Mixer
              </h3>
              <p className="text-xs text-muted-primary mt-1">
                Generates perceptual contrast steps using uniform luminance curves across UI states.
              </p>
            </div>

            {/* Interactive Color Swatch Bar */}
            <div className="p-6 rounded-xl bg-black/60 border border-white/10 space-y-4">
              <div className="grid grid-cols-5 gap-1.5 h-12 rounded-lg overflow-hidden border border-white/10">
                <div style={{ backgroundColor: `hsl(${accentHue}, 100%, 15%)` }} className="flex items-end p-1 text-[9px] font-mono text-white/60">100</div>
                <div style={{ backgroundColor: `hsl(${accentHue}, 100%, 35%)` }} className="flex items-end p-1 text-[9px] font-mono text-white/60">300</div>
                <div style={{ backgroundColor: `hsl(${accentHue}, 100%, 50%)` }} className="flex items-end p-1 text-[9px] font-mono text-white/90 font-bold">500</div>
                <div style={{ backgroundColor: `hsl(${accentHue}, 90%, 65%)` }} className="flex items-end p-1 text-[9px] font-mono text-black font-bold">700</div>
                <div style={{ backgroundColor: `hsl(${accentHue}, 80%, 85%)` }} className="flex items-end p-1 text-[9px] font-mono text-black font-bold">900</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-white/50">
                  <span>HUE SHIFT</span>
                  <span className="text-[#FF3E00]">hsl({accentHue}, 100%, 50%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={accentHue}
                  onChange={(e) => setAccentHue(Number(e.target.value))}
                  className="w-full accent-[#FF3E00] cursor-pointer"
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-white/40">
              WCAG AAA Compliant on Surface-0 (#050505)
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
