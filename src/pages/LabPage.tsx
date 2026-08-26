import React, { useState } from 'react';
import { experimentsData } from '../data/experiments';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FinalCTA } from '../components/sections/FinalCTA';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Sliders, Move3d, Palette, Eye, Code2, ArrowUpRight, Check, Magnet, Layers } from 'lucide-react';

export const LabPage: React.FC = () => {
  // Exp 1: Spring Switch
  const [springActive, setSpringActive] = useState(false);
  const [stiffness, setStiffness] = useState(500);
  const [damping, setDamping] = useState(25);

  // Exp 2: Variable Font Axis
  const [weight, setWeight] = useState(600);
  const [tracking, setTracking] = useState(0);
  const [inputText, setInputText] = useState('SCRILLO CRAFT');

  // Exp 3: CSS 3D Matrix Parallax
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // Exp 4: OKLCH Color Harmonizer
  const [hue, setHue] = useState(16);

  // Exp 5: Magnetic Button Attraction
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  // Exp 6: Fluid Layout Pill
  const navTabs = ['OVERVIEW', 'TELEMETRY', 'SPECS', 'AUDITS'];
  const [activeNavTab, setActiveNavTab] = useState(navTabs[0]);

  // Code snippet toggle state per card
  const [visibleCodeId, setVisibleCodeId] = useState<string | null>(null);

  const toggleCode = (id: string) => {
    setVisibleCodeId(visibleCodeId === id ? null : id);
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                THE LAB
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">INTERACTIVE EXPERIMENTAL SANDBOX</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              DESIGN <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                playground
              </span>{' '}
              <br />
              & EXPERIMENTS.
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              A collection of live, tactile micro-interactions, CSS transform physics, procedural typography, and experimental UI mechanics. Every widget here is fully interactive.
            </p>
          </div>

          {/* 6 Interactive Lab Grid Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 border-t border-white/10">
            
            {/* 01: SPRING RELAY SWITCH */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                  <span>EXPERIMENT 01 / INTERACTION PHYSICS</span>
                  <button
                    onClick={() => toggleCode('exp-spring')}
                    className="text-white/60 hover:text-white flex items-center gap-1 uppercase"
                  >
                    <Code2 size={13} />
                    <span>{visibleCodeId === 'exp-spring' ? 'HIDE CODE' : 'VIEW CODE'}</span>
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Tactile Spring Relay
                </h3>
                <p className="text-xs text-muted-primary mt-1">
                  Adjust spring parameters to observe real-time damping tension and rebound resistance.
                </p>
              </div>

              {/* Interactive Widget */}
              <div className="p-8 rounded-2xl bg-black/70 border border-white/10 flex flex-col items-center justify-center space-y-6">
                <button
                  onClick={() => setSpringActive(!springActive)}
                  className={`w-24 h-12 rounded-full p-1.5 transition-colors duration-300 border flex items-center ${
                    springActive ? 'bg-[#FF3E00] border-[#FF3E00]' : 'bg-white/10 border-white/20'
                  }`}
                  aria-label="Toggle Spring Relay"
                >
                  <motion.div
                    className="w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center"
                    animate={{ x: springActive ? 48 : 0 }}
                    transition={{ type: 'spring', stiffness, damping }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#050505]" />
                  </motion.div>
                </button>

                <div className="w-full grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-white/50">
                      <span>STIFFNESS</span>
                      <span className="text-[#FF3E00]">{stiffness}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="900"
                      step="50"
                      value={stiffness}
                      onChange={(e) => setStiffness(Number(e.target.value))}
                      className="w-full accent-[#FF3E00] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-white/50">
                      <span>DAMPING</span>
                      <span className="text-[#FF3E00]">{damping}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="5"
                      value={damping}
                      onChange={(e) => setDamping(Number(e.target.value))}
                      className="w-full accent-[#FF3E00] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              {visibleCodeId === 'exp-spring' && (
                <pre className="p-4 rounded-xl bg-black/90 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                  <code>{`<motion.div animate={{ x: active ? 48 : 0 }} transition={{ type: 'spring', stiffness: ${stiffness}, damping: ${damping} }} />`}</code>
                </pre>
              )}
            </div>

            {/* 02: KINETIC VARIABLE FONT */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                  <span>EXPERIMENT 02 / VARIABLE TYPE</span>
                  <button
                    onClick={() => toggleCode('exp-font')}
                    className="text-white/60 hover:text-white flex items-center gap-1 uppercase"
                  >
                    <Code2 size={13} />
                    <span>{visibleCodeId === 'exp-font' ? 'HIDE CODE' : 'VIEW CODE'}</span>
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Kinetic Variable Font Axis
                </h3>
                <p className="text-xs text-muted-primary mt-1">
                  Type custom text below and manipulate font variation vectors in real-time.
                </p>
              </div>

              {/* Interactive Widget */}
              <div className="p-8 rounded-2xl bg-black/70 border border-white/10 space-y-6">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-center text-3xl sm:text-4xl text-white tracking-tight focus:outline-none focus:border-[#FF3E00]"
                  style={{ fontWeight: weight, letterSpacing: `${tracking}px` }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-white/50">
                      <span>WEIGHT</span>
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

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-white/50">
                      <span>TRACKING</span>
                      <span className="text-[#FF3E00]">{tracking}px</span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="12"
                      step="0.5"
                      value={tracking}
                      onChange={(e) => setTracking(Number(e.target.value))}
                      className="w-full accent-[#FF3E00] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {visibleCodeId === 'exp-font' && (
                <pre className="p-4 rounded-xl bg-black/90 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                  <code>{`style={{ fontWeight: ${weight}, letterSpacing: '${tracking}px' }}`}</code>
                </pre>
              )}
            </div>

            {/* 03: PURE CSS 3D MATRIX PARALLAX */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                  <span>EXPERIMENT 03 / LIGHTWEIGHT 3D</span>
                  <button
                    onClick={() => toggleCode('exp-3d')}
                    className="text-white/60 hover:text-white flex items-center gap-1 uppercase"
                  >
                    <Code2 size={13} />
                    <span>{visibleCodeId === 'exp-3d' ? 'HIDE CODE' : 'VIEW CODE'}</span>
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  CSS 3D Vector Depth
                </h3>
                <p className="text-xs text-muted-primary mt-1">
                  Hover and move your mouse around the viewport below to calculate normalized angular tilt.
                </p>
              </div>

              <div
                className="h-48 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center cursor-crosshair overflow-hidden perspective-container"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  setTiltX(-y * 28);
                  setTiltY(x * 28);
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
                  className="w-44 h-24 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex flex-col items-center justify-center p-4 text-center shadow-2xl space-y-1"
                >
                  <Move3d size={20} className="text-[#FF3E00]" />
                  <span className="text-xs font-mono text-white uppercase font-bold">
                    3D PERSPECTIVE
                  </span>
                  <span className="text-[10px] font-mono text-white/50">
                    X: {tiltX.toFixed(0)}° / Y: {tiltY.toFixed(0)}°
                  </span>
                </div>
              </div>

              {visibleCodeId === 'exp-3d' && (
                <pre className="p-4 rounded-xl bg-black/90 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                  <code>{`transform: perspective(600px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg)`}</code>
                </pre>
              )}
            </div>

            {/* 04: OKLCH PERCEPTUAL PALETTE MIXER */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                  <span>EXPERIMENT 04 / COLOR TOKENS</span>
                  <button
                    onClick={() => toggleCode('exp-color')}
                    className="text-white/60 hover:text-white flex items-center gap-1 uppercase"
                  >
                    <Code2 size={13} />
                    <span>{visibleCodeId === 'exp-color' ? 'HIDE CODE' : 'VIEW CODE'}</span>
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Perceptual Palette Mixer
                </h3>
                <p className="text-xs text-muted-primary mt-1">
                  Generates WCAG AAA compliant ramps across all light/dark surface tokens.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/70 border border-white/10 space-y-4">
                <div className="grid grid-cols-5 gap-2 h-14 rounded-xl overflow-hidden border border-white/10">
                  <div style={{ backgroundColor: `hsl(${hue}, 100%, 15%)` }} className="flex items-end p-1.5 text-[10px] font-mono text-white/70">100</div>
                  <div style={{ backgroundColor: `hsl(${hue}, 100%, 35%)` }} className="flex items-end p-1.5 text-[10px] font-mono text-white/70">300</div>
                  <div style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }} className="flex items-end p-1.5 text-[10px] font-mono text-white font-bold">500</div>
                  <div style={{ backgroundColor: `hsl(${hue}, 90%, 65%)` }} className="flex items-end p-1.5 text-[10px] font-mono text-black font-bold">700</div>
                  <div style={{ backgroundColor: `hsl(${hue}, 80%, 85%)` }} className="flex items-end p-1.5 text-[10px] font-mono text-black font-bold">900</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-white/50">
                    <span>HUE DEGREE</span>
                    <span className="text-[#FF3E00] font-bold">{hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="w-full accent-[#FF3E00] cursor-pointer"
                  />
                </div>
              </div>

              {visibleCodeId === 'exp-color' && (
                <pre className="p-4 rounded-xl bg-black/90 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                  <code>{`--color-accent-500: hsl(${hue}, 100%, 50%); /* WCAG AAA on #050505 */`}</code>
                </pre>
              )}
            </div>

            {/* 05: MAGNETIC BUTTON ATTRACTION */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                  <span>EXPERIMENT 05 / CURSOR ATTRACTION</span>
                  <button
                    onClick={() => toggleCode('exp-magnet')}
                    className="text-white/60 hover:text-white flex items-center gap-1 uppercase"
                  >
                    <Code2 size={13} />
                    <span>{visibleCodeId === 'exp-magnet' ? 'HIDE CODE' : 'VIEW CODE'}</span>
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Magnetic Button Pull
                </h3>
                <p className="text-xs text-muted-primary mt-1">
                  Hover near the button to experience magnetic Euclidean displacement.
                </p>
              </div>

              <div
                className="h-44 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
                  const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
                  setBtnPos({ x, y });
                }}
                onMouseLeave={() => setBtnPos({ x: 0, y: 0 })}
              >
                <motion.button
                  animate={{ x: btnPos.x, y: btnPos.y }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="px-8 py-4 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl shadow-[#FF3E00]/25 flex items-center space-x-2"
                >
                  <Magnet size={14} />
                  <span>MAGNETIC CTA</span>
                </motion.button>
              </div>

              {visibleCodeId === 'exp-magnet' && (
                <pre className="p-4 rounded-xl bg-black/90 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                  <code>{`animate={{ x: ${btnPos.x.toFixed(1)}, y: ${btnPos.y.toFixed(1)} }} transition={{ type: 'spring', stiffness: 350, damping: 20 }}`}</code>
                </pre>
              )}
            </div>

            {/* 06: FLUID PILL MORPH TABS */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#FF3E00] mb-3">
                  <span>EXPERIMENT 06 / SHARED LAYOUT</span>
                  <button
                    onClick={() => toggleCode('exp-pill')}
                    className="text-white/60 hover:text-white flex items-center gap-1 uppercase"
                  >
                    <Code2 size={13} />
                    <span>{visibleCodeId === 'exp-pill' ? 'HIDE CODE' : 'VIEW CODE'}</span>
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Fluid Pill Navigation Morph
                </h3>
                <p className="text-xs text-muted-primary mt-1">
                  Click between tabs to observe GPU-accelerated shared layoutId spring interpolations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-center">
                <div className="flex flex-wrap items-center justify-center gap-1 bg-[#121212] p-1.5 rounded-full border border-white/10">
                  {navTabs.map((tab) => {
                    const isActive = activeNavTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveNavTab(tab)}
                        className={`relative px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors rounded-full ${
                          isActive ? 'text-black font-bold' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="labPill"
                            className="absolute inset-0 bg-white rounded-full"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{tab}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {visibleCodeId === 'exp-pill' && (
                <pre className="p-4 rounded-xl bg-black/90 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                  <code>{`<motion.span layoutId="labPill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />`}</code>
                </pre>
              )}
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
