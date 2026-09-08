import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileMenu } from './MobileMenu';
import { Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrolled = window.scrollY > 20;
    const handleScroll = () => {
      const nowScrolled = window.scrollY > 20;
      if (nowScrolled !== lastScrolled) {
        lastScrolled = nowScrolled;
        setIsScrolled(nowScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#060606]/85 backdrop-blur-md border-b border-white/[0.06]'
            : 'py-5 sm:py-7 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="site-container flex items-center justify-between">
          {/* Left: Minimal DS Mark */}
          <Link
            to="/"
            className="group flex items-center gap-2 select-none"
            aria-label="DS Portfolio Home"
          >
            <span className="font-extrabold text-sm sm:text-base tracking-widest text-white transition-colors group-hover:text-[#FF3E00]">
              DS
            </span>
            <span className="w-1 h-1 rounded-full bg-[#FF3E00] opacity-80" />
          </Link>

          {/* Right: WORK / ABOUT / CONTACT */}
          <nav className="hidden md:flex items-center gap-8 sm:gap-10" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-xs font-mono tracking-[0.2em] uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeEditorialNav"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#FF3E00]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Clean Compact Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
