import React, { useRef } from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';

interface ExperimentalImageProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const ExperimentalImage: React.FC<ExperimentalImageProps> = ({ onHoverStateChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 border-t border-white/10 bg-dark-950 overflow-hidden">
      <div className="editorial-container mb-10">
        <SectionLabel number="04C" title="EXPERIMENTAL SPATIAL ARTIFACT" />
      </div>

      <div className="editorial-container">
        <div
          ref={containerRef}
          className="relative aspect-[16/9] sm:aspect-[21/9] w-full border border-white/20 bg-dark-900 flex flex-col justify-between p-8 sm:p-14 group overflow-hidden select-none"
          onMouseEnter={() => onHoverStateChange?.(true, 'view', 'INTERACT')}
          onMouseLeave={() => onHoverStateChange?.(false)}
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Top Artifact Header */}
          <div className="relative z-10 flex items-center justify-between font-mono text-xs text-light-500 uppercase tracking-widest">
            <span>[MONOLITH LABS — EXPERIMENTAL SPECIMEN 09]</span>
            <span>SCALE: 1:1 RATIO</span>
          </div>

          {/* Center Giant Typographic Monolith */}
          <div className="relative z-10 my-auto text-center">
            <span className="font-display font-black text-4xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-stroke group-hover:text-white transition-all duration-700 inline-block">
              RESTRAINT
            </span>
            <div className="mt-2 font-editorial-serif italic text-lg sm:text-2xl text-light-400">
              The density of void and tension of structure.
            </div>
          </div>

          {/* Bottom Metas */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-light-600 uppercase tracking-widest">
            <span>COORDINATES: X: 0049.2 // Y: 0921.8</span>
            <span>RENDERED IN REALTIME SHADER SPACE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
