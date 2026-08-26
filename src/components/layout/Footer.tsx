import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navLinks, footerLinks } from '../../data/navigation';
import { siteConfig } from '../../data/site';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat([], options).format(new Date());
      setLocalTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#080808] border-t border-white/10 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Big Editorial Header Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Q3/Q4 2026 Collaborations</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white leading-none">
              LET'S BUILD <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00]">
                SOMETHING
              </span>{' '}
              WORTH USING.
            </h2>

            <p className="max-w-xl text-muted-primary text-base md:text-lg leading-relaxed font-normal">
              Have an ambitious product idea, a design system to architect, or a website that deserves high craft? Let's talk design-to-code.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end space-y-6">
            <Link
              to="/contact"
              data-cursor="cta"
              className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-[#FF3E00] text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#FF3E00]/20"
            >
              <span>START A CONVERSATION</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Time & Location Pill */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 w-full sm:w-auto text-xs font-mono text-white/70 space-y-1">
              <div className="flex items-center justify-between gap-6">
                <span className="text-white/40">LOCATION</span>
                <span className="text-white">Bangalore, IN (UTC+5:30)</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-white/40">LOCAL TIME</span>
                <span className="text-[#FF3E00] font-bold">{localTime || '18:30:00'} IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5">
              SCRILLO
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
            </span>
            <p className="text-xs font-mono text-white/50 tracking-wider uppercase max-w-xs">
              UI/UX DESIGNER & FRONTEND WEB DESIGNER
            </p>
            <p className="font-handwritten text-lg text-white/70">
              "bridging high craft and production code"
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-mono text-sm text-white/80 hover:text-[#FF3E00] transition-colors underline"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Directory */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">
              DIRECTORY
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-white/70 hover:text-[#FF3E00] transition-colors flex items-center space-x-2"
                  >
                    <span className="text-white/30 text-xs font-mono">{item.number}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Disciplines */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">
              DISCIPLINES
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">
              CONNECT
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.socials.map((soc) => (
                <li key={soc.label}>
                  <a
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#FF3E00] transition-colors flex items-center justify-between group"
                  >
                    <span>{soc.label}</span>
                    <ArrowUpRight size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Colophon & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            © 2026 SCRILLO. DESIGNED & BUILT WITH INTENTION.
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
