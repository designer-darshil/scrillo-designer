import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-32 pb-24 md:pt-40 md:pb-36 min-h-[75vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-6">
            <span className="px-2.5 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
              404
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">ERROR</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-white uppercase leading-none mb-4">
            404
          </h1>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase mb-6">
            PAGE NOT{' '}
            <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
              found.
            </span>
          </h2>

          {/* Short Explanation */}
          <p className="max-w-md mx-auto text-base sm:text-lg text-muted-primary leading-relaxed mb-10 font-normal">
            The page you're looking for doesn't exist or may have moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/work"
              data-cursor="cta"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#FF3E00]/25 inline-flex items-center justify-center space-x-2"
            >
              <span>BACK TO WORK</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/"
              data-cursor="cta"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <span>HOME</span>
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

