import React from 'react';
import { RevealText } from '../../components/RevealText/RevealText';
import { ArrowDownRight, Compass } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton/MagneticButton';

interface HeroProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onHoverStateChange }) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden">
      {/* Top Meta Bar */}
      <div className="editorial-container flex items-center justify-between font-mono text-xs text-light-500 uppercase tracking-widest pt-4">
        <span className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-light-400" />
          <span>PORTFOLIO // VOL. 04</span>
        </span>
        <span className="hidden sm:inline-block">MONOCHROME EDITORIAL EDITION</span>
        <span>[00 / 05]</span>
      </div>

      {/* Main Massive Editorial Title */}
      <div className="editorial-container my-auto py-12">
        <div className="max-w-6xl">
          <div className="font-mono text-xs sm:text-sm text-light-400 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-light-500" />
            <span>CREATIVE DIRECTION & INTERFACE ARCHITECTURE</span>
          </div>

          <h1 className="font-display font-bold text-display-2xl uppercase tracking-tighter text-light-100">
            <RevealText duration={1} stagger={0.03}>
              CREATIVE
            </RevealText>
            <br />
            <span className="font-editorial-serif font-normal italic lowercase tracking-tight text-light-300">
              engineering
            </span>{' '}
            <RevealText duration={1} delay={0.2} stagger={0.03}>
              PORTFOLIO
            </RevealText>
          </h1>

          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <p className="md:col-span-7 font-body text-base sm:text-lg text-light-400 leading-relaxed font-light">
              Crafting high-contrast digital experiences, bespoke typographic systems, and performant web artifacts at the intersection of discipline and creative computing.
            </p>

            <div className="md:col-span-5 flex items-center md:justify-end gap-4">
              <MagneticButton href="#works">
                <div
                  className="px-6 py-4 bg-light-100 text-dark-900 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-light-300 transition-colors"
                  onMouseEnter={() => onHoverStateChange?.(true, 'link')}
                  onMouseLeave={() => onHoverStateChange?.(false)}
                >
                  <span>Explore Index</span>
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Meta Strip */}
      <div className="editorial-container border-t border-white/10 pt-4 flex flex-wrap items-center justify-between font-mono text-[11px] text-light-500 gap-4">
        <div>[DESIGNER & DEVELOPER: DARSHIL BHUVA]</div>
        <div className="flex items-center gap-6">
          <span>BASED IN INDIA</span>
          <span>AVAILABLE FOR SELECTIVE COMMISSIONS</span>
        </div>
      </div>
    </section>
  );
};
