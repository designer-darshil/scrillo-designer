import React from 'react';
import { services } from '../data/services';
import { siteMetadata } from '../data/navigation';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 space-y-20">
      
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Services
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
          From initial information architecture and visual direction to tokenized design systems and production-ready React frontends.
        </p>
      </section>

      {/* Services List */}
      <section className="divide-y divide-white/10 border-y border-white/10">
        {services.map((svc) => (
          <article key={svc.number} className="py-10 space-y-6">
            
            <div className="flex items-baseline space-x-3">
              <span className="font-mono text-xs text-[#FF3E00] font-bold">
                {svc.number}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {svc.title}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              {svc.description}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Deliverables
              </div>
              <div className="flex flex-wrap gap-2">
                {svc.deliverables.map((del) => (
                  <span
                    key={del}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-neutral-300"
                  >
                    {del}
                  </span>
                ))}
              </div>
            </div>

          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Have a specific scope?</h3>
          <p className="text-xs text-neutral-400 mt-1">Available for full engagements or focused consultations.</p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 rounded bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#FF3E00] hover:text-white transition-colors inline-flex items-center space-x-1.5"
        >
          <span>Let's Discuss</span>
          <ArrowRight size={13} />
        </Link>
      </section>

    </div>
  );
};
