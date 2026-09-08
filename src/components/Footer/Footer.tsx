import React from 'react';
import { ArrowUp, Asterisk } from 'lucide-react';
import { MagneticButton } from '../MagneticButton/MagneticButton';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialList = [
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Behance', href: 'https://behance.net' },
    { label: 'Dribbble', href: 'https://dribbble.com' },
    { label: 'X', href: 'https://x.com' },
  ];

  return (
    <footer className="relative w-full bg-background text-foreground border-t border-border pt-20 sm:pt-28 pb-12 select-none overflow-hidden">
      <div className="page-container flex flex-col justify-between min-h-[70vh]">
        {/* Top Tier: Desktop 4-Column Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-20 border-b border-border">
          {/* Col 1: Location */}
          <div className="space-y-4">
            <span className="font-mono text-meta text-muted block">[01 // LOCATION]</span>
            <div className="font-mono text-sm uppercase text-foreground leading-relaxed">
              <p className="font-semibold">INDIA</p>
              <p className="text-muted">WORKING GLOBALLY</p>
            </div>
            <p className="font-mono text-[11px] text-muted/60 pt-2">
              UTC +05:30 · 21.1702° N, 72.8311° E
            </p>
          </div>

          {/* Col 2: Social Links with Animated Underline */}
          <div className="space-y-4">
            <span className="font-mono text-meta text-muted block">[02 // SOCIAL]</span>
            <ul className="space-y-2">
              {socialList.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="group relative inline-block font-mono text-sm uppercase text-muted hover:text-foreground transition-colors duration-200"
                  >
                    <span>{item.label}</span>
                    <span className="absolute left-0 bottom-0 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-4">
            <span className="font-mono text-meta text-muted block">[03 // CONTACT]</span>
            <div className="space-y-2">
              <a
                href="mailto:hello@example.com"
                data-cursor="link"
                className="group relative inline-block font-mono text-sm uppercase text-foreground hover:text-white transition-colors"
              >
                <span>hello@example.com</span>
                <span className="absolute left-0 bottom-0 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              </a>
              <p className="font-mono text-xs text-muted/70">
                Response within 24–48 hours
              </p>
            </div>
          </div>

          {/* Col 4: Rotating Symbol & Back to Top */}
          <div className="flex flex-col justify-between items-start lg:items-end space-y-6">
            <div className="flex items-center gap-3">
              {/* Rotating Small Geometric Symbol */}
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted">
                <Asterisk className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
              </div>
              <span className="font-mono text-meta text-muted">[TOP]</span>
            </div>

            <MagneticButton onClick={scrollToTop}>
              <button
                type="button"
                onClick={scrollToTop}
                data-cursor="link"
                className="group flex items-center gap-2.5 px-4 py-2.5 border border-border font-mono text-xs uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Bottom Tier: Massive Editorial Brand Name & Rights */}
        <div className="pt-16 sm:pt-24 space-y-8">
          {/* Large Brand Name near Bottom */}
          <div className="w-full overflow-hidden">
            <h2 className="font-sans text-[clamp(2.75rem,10.5vw,11.5rem)] font-extrabold uppercase tracking-tighter text-foreground/90 leading-[0.85] text-left select-none">
              DARSHIL BHUVA
            </h2>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-meta text-muted border-t border-border pt-6">
            <span>© 2026 ALL RIGHTS RESERVED</span>
            <span>CREATIVE DIRECTION & INTERFACE ARCHITECTURE</span>
            <span className="hidden md:inline">PORTFOLIO VOL. 04</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
