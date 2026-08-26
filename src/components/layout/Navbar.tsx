import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navLinks } from '../../data/navigation';
import { MobileMenu } from './MobileMenu';
import { Menu, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrolled = window.scrollY > 40;
    const handleScroll = () => {
      const nowScrolled = window.scrollY > 40;
      if (nowScrolled !== lastScrolled) {
        lastScrolled = nowScrolled;
        setIsScrolled(nowScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#050505]/85 backdrop-blur-md border-b border-white/10'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo / Brand Mark */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="w-8 h-8 rounded-sm bg-white text-black flex items-center justify-center font-bold text-xs tracking-tighter group-hover:bg-[#FF3E00] group-hover:text-white transition-colors">
              SC
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-sm text-white flex items-center gap-1.5">
                SCRILLO
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] inline-block animate-pulse" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                UI/UX + Code
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 border border-white/10 rounded-full px-4 py-1.5 bg-black/40 backdrop-blur-sm">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-4 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors rounded-full ${
                    isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button & Mobile Menu Trigger */}
          <div className="flex items-center space-x-3">
            <Link
              to="/contact"
              data-cursor="cta"
              className="hidden sm:inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-[#FF3E00] hover:border-[#FF3E00] hover:text-white text-white/90 transition-all duration-200"
            >
              <span>LET'S TALK</span>
              <ArrowRight size={13} className="text-[#FF3E00] group-hover:text-white" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
