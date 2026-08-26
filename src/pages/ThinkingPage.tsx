import React, { useState } from 'react';
import { thinkingArticles } from '../data/thinking';
import { ThinkingArticle } from '../types';
import { PageTransition } from '../components/layout/PageTransition';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FinalCTA } from '../components/sections/FinalCTA';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, ArrowUpRight, Sparkles, X, Lightbulb, CheckCircle2 } from 'lucide-react';

const categories = ['ALL', 'UX Architecture', 'Visual Craft', 'Design-to-Code', 'Philosophy', 'Motion Design'];

export const ThinkingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState<ThinkingArticle | null>(null);

  const filteredArticles = selectedCategory === 'ALL'
    ? thinkingArticles
    : thinkingArticles.filter((a) => a.category === selectedCategory);

  return (
    <PageTransition>
      <div className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#FF3E00] uppercase mb-4">
              <span className="px-2 py-0.5 rounded border border-[#FF3E00]/30 bg-[#FF3E00]/10 font-bold">
                THINKING & PERSPECTIVE
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/60">ARCHITECTURAL ESSAYS & NOTES</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-8">
              HOW I <br />
              <span className="font-editorial-serif italic font-normal text-[#FF3E00] lowercase text-[1.05em]">
                think &
              </span>{' '}
              <br />
              REASON.
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-muted-primary leading-relaxed">
              Concise, 1–3 minute observations on user experience architecture, typographic restraint, and the design-to-code continuum.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-16 border-b border-white/10 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                id={article.slug}
                onClick={() => setActiveArticle(article)}
                className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6 hover:border-[#FF3E00]/50 transition-all duration-300 group cursor-pointer"
                data-cursor="explore"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-white/50">
                    <span className="text-[#FF3E00] font-bold">NOTE {article.number}</span>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-extrabold text-white tracking-tight group-hover:text-[#FF3E00] transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-sm text-muted-primary leading-relaxed">
                    {article.introduction}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40 uppercase">{article.category}</span>
                  <span className="text-white group-hover:text-[#FF3E00] font-bold flex items-center gap-1">
                    <span>READ OBSERVATION</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>

        {/* Full Interactive Article Reader Modal */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10001] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
              onClick={() => setActiveArticle(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0D0D0D] p-8 sm:p-12 shadow-2xl space-y-8"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 text-xs font-mono text-[#FF3E00]">
                      <span className="font-bold">NOTE {activeArticle.number}</span>
                      <span>•</span>
                      <span className="uppercase text-white/60">{activeArticle.category}</span>
                      <span>•</span>
                      <span className="text-white/40">{activeArticle.readTime}</span>
                    </div>
                    <span className="text-xs font-mono text-white/40">{activeArticle.date}</span>
                  </div>

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2.5 rounded-full border border-white/15 bg-white/5 text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {activeArticle.title}
                </h2>

                {/* Lead intro */}
                <p className="font-editorial-serif italic text-xl sm:text-2xl text-white/90 leading-relaxed">
                  "{activeArticle.introduction}"
                </p>

                {/* Main Arguments */}
                <div className="space-y-4 text-muted-primary text-base sm:text-lg leading-relaxed pt-2 border-t border-white/5">
                  {activeArticle.mainArgument.map((arg, idx) => (
                    <p key={idx}>{arg}</p>
                  ))}
                </div>

                {/* Observation Box */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00] font-bold uppercase">
                    <Lightbulb size={15} />
                    <span>CORE OBSERVATION</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {activeArticle.observation}
                  </p>
                </div>

                {/* Conclusion & Takeaway */}
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-primary leading-relaxed">
                    {activeArticle.conclusion}
                  </p>
                  <div className="p-4 rounded-xl bg-[#080808] border border-white/5 flex items-start space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-white/80">
                      <strong>KEY TAKEAWAY:</strong> {activeArticle.keyTakeaway}
                    </p>
                  </div>
                </div>

                {/* Related Project */}
                {activeArticle.relatedProjectSlug && (
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">EXPLORE WORK APPLICATION:</span>
                    <Link
                      to={`/work/${activeArticle.relatedProjectSlug}`}
                      onClick={() => setActiveArticle(null)}
                      className="text-[#FF3E00] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>VIEW {activeArticle.relatedProjectName}</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="mt-12">
          <FinalCTA />
        </div>
      </div>
    </PageTransition>
  );
};
