import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Name */}
        <Link to="/" className="group flex items-baseline space-x-2">
          <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#FF3E00] transition-colors">
            SCRILLO
          </span>
          <span className="hidden sm:inline text-xs text-neutral-500 font-mono">
            / UI/UX + Code
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-neutral-400">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`hover:text-white transition-colors ${
                  isActive ? 'text-white font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Contact Action */}
        <div className="hidden md:flex items-center">
          <Link
            to="/contact"
            className="text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-white/25 transition-colors"
          >
            <span>Let's Talk</span>
            <ArrowRight size={12} className="text-[#FF3E00]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Clean Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080808] px-6 py-6 space-y-4">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-neutral-300 hover:text-white py-1"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center space-x-2 text-xs font-mono text-[#FF3E00] uppercase"
            >
              <span>Get in touch →</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
