import React from 'react';
import { Link } from 'react-router-dom';
import { navLinks, siteMetadata } from '../../data/navigation';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#060606] py-16 text-sm text-neutral-400">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          <div className="md:col-span-6 space-y-2">
            <div className="font-extrabold text-white text-base tracking-tight">
              SCRILLO
            </div>
            <p className="text-xs font-mono text-neutral-500 uppercase">
              {siteMetadata.role}
            </p>
            <p className="text-sm text-neutral-400 max-w-sm pt-2 leading-relaxed">
              Designing digital products and websites with a focus on clarity, interaction and detail.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Connect
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="text-white hover:text-[#FF3E00] transition-colors font-mono"
                >
                  {siteMetadata.email}
                </a>
              </li>
              {siteMetadata.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight size={11} className="text-neutral-600" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600">
          <div>
            © 2026 SCRILLO. DESIGNED & BUILT WITH INTENTION.
          </div>
          <div>
            {siteMetadata.location}
          </div>
        </div>

      </div>
    </footer>
  );
};
