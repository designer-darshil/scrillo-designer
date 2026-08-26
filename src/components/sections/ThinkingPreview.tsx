import React from 'react';
import { Link } from 'react-router-dom';
import { thinkingArticles } from '../../data/thinking';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';

export const ThinkingPreview: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#080808] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="05"
          tag="PERSPECTIVE & ARCHITECTURE"
          title="DESIGN"
          serifWord="thinking & essays"
          description="Concise, 1–3 minute observations on UX architecture, typographic restraint, and frontend craft."
          align="split"
        >
          <Link
            to="/thinking"
            data-cursor="explore"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF3E00] hover:underline"
          >
            <span>READ ALL OBSERVATIONS (06)</span>
            <ArrowUpRight size={13} />
          </Link>
        </SectionHeading>

        {/* 3-Column Articles Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {thinkingArticles.slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="p-8 rounded-3xl border border-white/10 bg-[#0C0C0C] flex flex-col justify-between space-y-6 hover:border-[#FF3E00]/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-white/50">
                  <span className="text-[#FF3E00] font-bold">ESSAY {article.number}</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={11} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-[#FF3E00] transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-primary leading-relaxed">
                  {article.introduction}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-white/40 uppercase">{article.category}</span>
                <Link
                  to={`/thinking#${article.slug}`}
                  data-cursor="explore"
                  className="text-white group-hover:text-[#FF3E00] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>READ ESSAY</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
