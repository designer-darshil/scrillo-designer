import React, { useState, useEffect, useRef } from 'react';
import { navigationItems, socialLinks } from '../../data/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../animations/gsapConfig';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection = 'home',
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(activeSection);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Synchronize active section
  useEffect(() => {
    setActiveItem(activeSection);
  }, [activeSection]);

  // Hide on scroll down, reveal on scroll up using GSAP
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const header = headerRef.current;

          if (!header) return;

          // Don't hide if mobile menu is open
          if (isMobileMenuOpen) {
            gsap.to(header, {
              yPercent: 0,
              duration: 0.3,
              ease: 'power3.out',
              overwrite: true,
            });
            return;
          }

          if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY.current + 8) {
              // Scrolling down: hide header
              gsap.to(header, {
                yPercent: -100,
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            } else if (currentScrollY < lastScrollY.current - 8) {
              // Scrolling up: show header
              gsap.to(header, {
                yPercent: 0,
                duration: 0.35,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            }
          } else {
            // Near top of page: always visible
            gsap.to(header, {
              yPercent: 0,
              duration: 0.3,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.classList.add('lenis-stopped');
    } else {
      document.documentElement.classList.remove('lenis-stopped');
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    href: string
  ) => {
    setActiveItem(id);
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 pointer-events-none select-none transition-transform duration-300 will-change-transform"
      >
        {/* Difference blend container ensures legibility over both dark and light/image content */}
        <div className="w-full mix-blend-difference text-white">
          <div className="page-container flex items-center justify-between py-5 sm:py-6">
            {/* LEFT: Portfolio name / brand */}
            <div className="pointer-events-auto">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, 'home', '#home')}
                className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-mono uppercase tracking-widest text-white/90 hover:text-white transition-opacity"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-none group-hover:rotate-45 transition-transform duration-300" />
                <span className="font-semibold">DARSHIL BHUVA</span>
              </a>
            </div>

            {/* CENTER: Digital Product Designer (Desktop) */}
            <div className="hidden md:flex items-center gap-2 text-xs sm:text-[13px] font-mono uppercase tracking-widest text-white/60 pointer-events-none">
              <span className="text-white/30">/</span>
              <span>DIGITAL PRODUCT DESIGNER</span>
            </div>

            {/* RIGHT: Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-8 pointer-events-auto">
              {navigationItems.map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id, item.href)}
                    className="group relative py-1 text-xs sm:text-[13px] font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <span className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="w-1 h-1 bg-white inline-block" />
                      )}
                      <span>{item.label}</span>
                    </span>

                    {/* Hover Underline Animation */}
                    <span
                      className={`absolute left-0 bottom-0 w-full h-px bg-white origin-left transition-transform duration-300 ease-out ${
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Mobile Menu Trigger (44px touch target) */}
            <div className="md:hidden pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-end gap-2 py-2 px-1 text-xs font-mono uppercase tracking-widest text-white/90 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <span>{isMobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
                <span className="text-[10px]">
                  {isMobileMenuOpen ? '[×]' : '[+]'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULLSCREEN MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#050505] text-[#F5F5F2] flex flex-col justify-between pt-24 pb-10 px-6 sm:px-10 md:hidden"
          >
            {/* Background Subtle Grid Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Mobile Nav Links */}
            <div className="relative z-10 my-auto flex flex-col gap-6">
              <div className="text-meta text-muted mb-2">[INDEX NAVIGATION]</div>
              {navigationItems.map((item, index) => {
                const isActive = activeItem === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                      delay: 0.08 * index,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id, item.href)}
                      className="group flex items-baseline justify-between py-2 border-b border-[#292929] text-foreground hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted">
                          [{item.number}]
                        </span>
                        <span className="font-sans text-3xl sm:text-4xl font-bold uppercase tracking-tight">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Menu Footer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="relative z-10 border-t border-[#292929] pt-6 space-y-4"
            >
              <div className="flex items-center justify-between text-meta text-muted">
                <span>DIGITAL PRODUCT DESIGNER</span>
                <span className="text-foreground">AVAILABLE Q2/Q3</span>
              </div>

              <div className="flex items-center justify-between text-meta">
                <a
                  href="mailto:contact@darshilbhuva.com"
                  className="text-foreground underline underline-offset-4"
                >
                  contact@darshilbhuva.com
                </a>
                <div className="flex gap-4 text-muted">
                  {socialLinks.slice(0, 2).map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {soc.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
