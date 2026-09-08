import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' }
  ];

  const socialLinks = [
    { label: 'LINKEDIN', href: 'https://linkedin.com/in/dsbhuva' },
    { label: 'DRIBBBLE', href: 'https://dribbble.com' },
    { label: 'BEHANCE', href: 'https://behance.net' }
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-[#060606] py-12 sm:py-16 text-white/70">
      <div className="site-container flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-10">
        
        {/* Left: DS Mark & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Link
            to="/"
            className="font-extrabold text-lg tracking-widest text-white hover:text-[#FF3E00] transition-colors inline-flex items-center gap-2 select-none"
            aria-label="DS Home"
          >
            <span>DS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
          </Link>
          <span className="hidden sm:inline-block text-white/20">/</span>
          <span className="font-mono text-xs text-white/50">Surat, Gujarat, India</span>
          <span className="hidden sm:inline-block text-white/20">/</span>
          <a
            href="mailto:darshilbhuva4322@gmail.com"
            className="font-mono text-xs text-white/80 hover:text-[#FF3E00] transition-colors"
          >
            darshilbhuva4322@gmail.com
          </a>
        </div>

        {/* Right: Navigation, Socials, Scroll To Top */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs">
          {/* Main Links */}
          <div className="flex items-center gap-5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="tracking-widest uppercase text-white/60 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <span className="hidden sm:inline-block text-white/20">/</span>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-widest uppercase text-white/50 hover:text-white transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full border border-white/10 hover:border-[#FF3E00] hover:text-[#FF3E00] text-white/60 transition-colors ml-auto sm:ml-2"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
