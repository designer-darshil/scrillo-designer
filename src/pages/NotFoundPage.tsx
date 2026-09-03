import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-20">
            {/* Eyebrow Tag */}
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                404
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">PAGE NOT FOUND</span>
            </div>

            {/* Headline matching personal portfolio editorial style */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight sm:tracking-tighter text-white uppercase leading-[0.95] sm:leading-[0.92] mb-8 break-words">
              PAGE <br />
              <span className="italic font-light text-[#FF3E00] tracking-tight lowercase">
                not
              </span>{' '}
              <br />
              FOUND.
            </h1>

            {/* Explanation */}
            <p className="max-w-xl text-lg sm:text-xl text-muted-primary leading-relaxed mb-10">
              The page you're looking for doesn't exist or may have moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/work"
                data-cursor="cta"
                className="px-8 py-4 rounded-full bg-[#FF3E00] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#FF3E00]/25 inline-flex items-center space-x-2"
              >
                <span>BACK TO WORK</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                to="/"
                data-cursor="cta"
                className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>HOME</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
