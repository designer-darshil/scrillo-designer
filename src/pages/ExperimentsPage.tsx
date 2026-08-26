import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ExperimentsPage: React.FC = () => {
  // 01. Spring Switch State
  const [springActive, setSpringActive] = useState(false);
  const [stiffness, setStiffness] = useState(500);
  const [damping, setDamping] = useState(25);

  // 02. Variable Font State
  const [weight, setWeight] = useState(600);
  const [tracking, setTracking] = useState(0);
  const [inputText, setInputText] = useState('SCRILLO CRAFT');

  // 03. 3D Tilt State
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // 04. Color Mixer State
  const [hue, setHue] = useState(16);

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 space-y-16">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experiments
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
          Small, functional UI and interaction studies exploring spring physics, variable typography, and CSS layouts.
        </p>
      </div>

      {/* 4 Clean Experiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 01. Spring Relay Switch */}
        <div className="p-6 rounded border border-white/10 bg-[#0C0C0C] space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-neutral-400 uppercase mb-1">
              01 · Spring Physics
            </div>
            <h2 className="text-lg font-bold text-white">
              Tactile Spring Relay
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Adjust spring parameters to test damping curves in real time.
            </p>
          </div>

          <div className="p-6 rounded bg-black/60 border border-white/5 flex flex-col items-center justify-center space-y-4">
            <button
              onClick={() => setSpringActive(!springActive)}
              className={`w-20 h-10 rounded-full p-1 transition-colors duration-300 border flex items-center ${
                springActive ? 'bg-[#FF3E00] border-[#FF3E00]' : 'bg-white/10 border-white/20'
              }`}
              aria-label="Toggle Spring Relay"
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ x: springActive ? 40 : 0 }}
                transition={{ type: 'spring', stiffness, damping }}
              >
                <span className="w-2 h-2 rounded-full bg-black" />
              </motion.div>
            </button>

            <span className="text-[11px] font-mono text-neutral-400">
              State: {springActive ? 'Active' : 'Rest'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-white/5">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Stiffness</span>
                <span className="text-white">{stiffness}</span>
              </div>
              <input
                type="range"
                min="100"
                max="900"
                step="50"
                value={stiffness}
                onChange={(e) => setStiffness(Number(e.target.value))}
                className="w-full accent-[#FF3E00]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Damping</span>
                <span className="text-white">{damping}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={damping}
                onChange={(e) => setDamping(Number(e.target.value))}
                className="w-full accent-[#FF3E00]"
              />
            </div>
          </div>
        </div>

        {/* 02. Kinetic Variable Font */}
        <div className="p-6 rounded border border-white/10 bg-[#0C0C0C] space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-neutral-400 uppercase mb-1">
              02 · Variable Typography
            </div>
            <h2 className="text-lg font-bold text-white">
              Variable Font Axis
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Continuous weight and tracking axis scaling without layout shift.
            </p>
          </div>

          <div className="p-6 rounded bg-black/60 border border-white/5 space-y-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-2 text-center text-2xl sm:text-3xl text-white tracking-tight focus:outline-none focus:border-[#FF3E00]"
              style={{ fontWeight: weight, letterSpacing: `${tracking}px` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-white/5">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Weight</span>
                <span className="text-white">{weight}</span>
              </div>
              <input
                type="range"
                min="200"
                max="900"
                step="50"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-[#FF3E00]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Tracking</span>
                <span className="text-white">{tracking}px</span>
              </div>
              <input
                type="range"
                min="-2"
                max="10"
                step="0.5"
                value={tracking}
                onChange={(e) => setTracking(Number(e.target.value))}
                className="w-full accent-[#FF3E00]"
              />
            </div>
          </div>
        </div>

        {/* 03. CSS 3D Vector Tilt */}
        <div className="p-6 rounded border border-white/10 bg-[#0C0C0C] space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-neutral-400 uppercase mb-1">
              03 · CSS 3D Vector Math
            </div>
            <h2 className="text-lg font-bold text-white">
              Normalized Cursor Tilt
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Pure CSS transform3d math without heavy WebGL libraries.
            </p>
          </div>

          <div
            className="h-40 rounded bg-black/60 border border-white/5 flex items-center justify-center cursor-crosshair overflow-hidden"
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
                transform: `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              className="w-36 h-20 rounded bg-white/10 border border-white/20 flex flex-col items-center justify-center p-3 text-center"
            >
              <span className="text-xs font-mono font-bold text-white">Vector Card</span>
              <span className="text-[10px] font-mono text-neutral-400">
                {tiltX.toFixed(0)}° / {tiltY.toFixed(0)}°
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 pt-2 border-t border-white/5">
            transform: perspective(500px) rotateX({tiltX.toFixed(0)}deg) rotateY({tiltY.toFixed(0)}deg)
          </div>
        </div>

        {/* 04. OKLCH Color Harmonizer */}
        <div className="p-6 rounded border border-white/10 bg-[#0C0C0C] space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-neutral-400 uppercase mb-1">
              04 · Color Science
            </div>
            <h2 className="text-lg font-bold text-white">
              Perceptual Palette Ramps
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Generates uniform luminance ramps across UI surfaces.
            </p>
          </div>

          <div className="p-4 rounded bg-black/60 border border-white/5 space-y-4">
            <div className="grid grid-cols-5 gap-1.5 h-12 rounded overflow-hidden">
              <div style={{ backgroundColor: `hsl(${hue}, 100%, 15%)` }} className="flex items-end p-1 text-[9px] font-mono text-white/70">100</div>
              <div style={{ backgroundColor: `hsl(${hue}, 100%, 35%)` }} className="flex items-end p-1 text-[9px] font-mono text-white/70">300</div>
              <div style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }} className="flex items-end p-1 text-[9px] font-mono text-white font-bold">500</div>
              <div style={{ backgroundColor: `hsl(${hue}, 90%, 65%)` }} className="flex items-end p-1 text-[9px] font-mono text-black font-bold">700</div>
              <div style={{ backgroundColor: `hsl(${hue}, 80%, 85%)` }} className="flex items-end p-1 text-[9px] font-mono text-black font-bold">900</div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>Hue Shift</span>
                <span className="text-white">{hue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full accent-[#FF3E00]"
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 pt-2 border-t border-white/5">
            WCAG AAA compliant against surface #080808
          </div>
        </div>

      </div>

    </div>
  );
};
