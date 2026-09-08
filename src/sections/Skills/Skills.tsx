import React from 'react';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { skillGroups } from '../../data/skills';

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 border-t border-white/10">
      <div className="editorial-container">
        <SectionLabel number="03" title="CAPABILITIES & DISCIPLINE" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {skillGroups.map((group) => (
            <div key={group.id} className="bg-dark-900 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-light-600">[{group.number}]</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-light-100 mt-3 mb-6">
                  {group.category}
                </h3>
                <ul className="space-y-3 font-mono text-xs text-light-400">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-light-600">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 font-mono text-[10px] uppercase text-light-600">
                DISCIPLINE VERIFIED
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
