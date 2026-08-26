import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname !== '/404' && location.pathname !== '*'
    ? location.pathname
    : '/unknown-route';

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-5xl mx-auto px-6 pt-32 pb-16">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/10 pb-4">
        <Link to="/" className="text-white hover:text-[#FF3E00] transition-colors font-bold tracking-tight">
          SCRILLO
        </Link>
        <span className="uppercase tracking-wider">
          404 / PAGE NOT FOUND
        </span>
      </div>

      {/* Main Content sits slightly below center */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="my-auto py-12 max-w-2xl mx-auto w-full"
      >
        {/* Subtle Browser Interface Frame */}
        <div className="rounded border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl">
          
          {/* Browser Address Bar Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D0D0D] border-b border-white/10 text-xs font-mono text-neutral-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-neutral-700 inline-block" />
              <span className="w-2 h-2 rounded-full bg-neutral-700 inline-block" />
              <span className="w-2 h-2 rounded-full bg-neutral-700 inline-block" />
            </div>
            <div className="text-[11px] text-neutral-400 truncate max-w-[280px] sm:max-w-md">
              scrillo.design{currentPath}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase">
              ERR
            </div>
          </div>

          {/* Body content */}
          <div className="p-8 sm:p-14 text-center space-y-6">
            
            <div className="space-y-1">
              <div className="text-6xl sm:text-8xl font-mono font-extrabold text-white tracking-tighter">
                404
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#FF3E00] uppercase tracking-widest font-semibold">
                PAGE NOT FOUND
              </div>
            </div>

            <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              The page you're looking for doesn't exist or may have moved.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/work"
                className="group w-full sm:w-auto px-5 py-2.5 rounded bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#FF3E00] hover:text-white transition-colors inline-flex items-center justify-center space-x-1.5"
              >
                <span>BACK TO WORK</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center"
              >
                HOME
              </Link>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Micro Metadata Bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-400 pt-6 border-t border-white/5 gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00]" />
          <span>STATUS: 404</span>
          <span>·</span>
          <span>ROUTE NOT FOUND</span>
        </div>
        <div>
          HTTP / 1.1 CLIENT ERROR
        </div>
      </div>

    </div>
  );
};
