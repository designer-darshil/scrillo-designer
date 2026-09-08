import React from 'react';
import { socialLinks } from '../../data/navigation';
import { ArrowUp } from 'lucide-react';
import { MagneticButton } from '../MagneticButton/MagneticButton';

interface FooterProps {
  onHoverStateChange?: (isHovered: boolean, type?: any, text?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onHoverStateChange }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-dark-950 border-t border-white/10 pt-16 pb-12">
      <div className="editorial-container">
        {/* Upper tier: Big signature branding */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-light-500 block mb-3">
              [INDEX ARCHIVE — 2026 EDITION]
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tighter text-light-100">
              DARSHIL BHUVA
            </h2>
            <p className="font-editorial-serif text-xl sm:text-2xl text-light-400 mt-2">
              Independent Creative Direction & Engineering
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <MagneticButton onClick={scrollToTop}>
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-3 border border-white/20 font-mono text-xs uppercase tracking-wider text-light-200 hover:bg-white hover:text-black transition-colors"
                onMouseEnter={() => onHoverStateChange?.(true, 'link')}
                onMouseLeave={() => onHoverStateChange?.(false)}
              >
                <span>Back to Top</span>
                <ArrowUp className="w-4 h-4" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Lower tier: Grid with metadata and social links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-10 font-mono text-xs">
          <div>
            <span className="text-light-600 block mb-2">[LOCATION]</span>
            <p className="text-light-400">Gujarat, India / Global</p>
            <p className="text-light-600 text-[11px] mt-1">UTC +05:30</p>
          </div>

          <div>
            <span className="text-light-600 block mb-2">[COLLABORATE]</span>
            <a
              href="mailto:contact@darshilbhuva.com"
              className="text-light-300 hover:text-white transition-colors underline underline-offset-4"
              onMouseEnter={() => onHoverStateChange?.(true, 'link')}
              onMouseLeave={() => onHoverStateChange?.(false)}
            >
              contact@darshilbhuva.com
            </a>
          </div>

          <div>
            <span className="text-light-600 block mb-2">[NETWORK]</span>
            <ul className="space-y-1">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light-400 hover:text-light-100 transition-colors"
                    onMouseEnter={() => onHoverStateChange?.(true, 'link')}
                    onMouseLeave={() => onHoverStateChange?.(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:text-right flex flex-col justify-between">
            <span className="text-light-600 block mb-2">[RIGHTS]</span>
            <p className="text-light-500 text-[11px]">
              © {new Date().getFullYear()} DARSHIL BHUVA.<br />
              ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
