import React from 'react';
import { clientNotesData } from '../../data/testimonials';
import { SectionHeading } from '../ui/SectionHeading';
import { Quote } from 'lucide-react';

export const ClientNotes: React.FC = () => {
  return (
    <section className="py-28 md:py-36 bg-[#050505] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <SectionHeading
          number="08"
          tag="COLLABORATOR NOTES & FEEDBACK"
          title="PEER"
          serifWord="perspectives"
          description="Honest reflections from product leads, creative directors, and founders on our design-to-code partnerships."
          align="split"
        >
          <div className="text-[11px] font-mono text-white/40 uppercase">
            * Clearly structured as editable demo client feedback
          </div>
        </SectionHeading>

        {/* 3 Column Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {clientNotesData.map((note) => (
            <div
              key={note.id}
              className="p-8 rounded-2xl border border-white/10 bg-[#0A0A0A] flex flex-col justify-between space-y-6 hover:border-white/20 transition-colors"
            >
              <div className="space-y-4">
                <Quote size={24} className="text-[#FF3E00]/60" />
                <p className="text-sm md:text-base text-white/90 leading-relaxed font-light">
                  "{note.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1">
                <div className="font-bold text-white text-sm">
                  {note.author}
                </div>
                <div className="text-xs font-mono text-[#FF3E00]">
                  {note.role}
                </div>
                <div className="text-[11px] font-mono text-white/40">
                  {note.context} ({note.year})
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
