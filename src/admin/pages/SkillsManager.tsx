import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { skillCategories } from '../../data/skills';

export const SkillsManager: React.FC = () => {
  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <Sparkles className="w-4 h-4" />
            <span>DISCIPLINE MATRIX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold uppercase tracking-tight text-foreground">
            SKILLS MANAGER
          </h2>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {skillCategories.map((cat) => {
          const list = cat.items || cat.skills || [];
          return (
            <div key={cat.id} className="border border-border bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs text-muted">[{cat.number}]</span>
                <span className="font-mono text-xs text-muted">{list.length} ITEMS</span>
              </div>
              <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-foreground">
                {cat.title}
              </h3>
              <ul className="space-y-2 pt-2 divide-y divide-border/60">
                {list.map((skill, idx) => {
                  const name = typeof skill === 'string' ? skill : skill.name;
                  const index = typeof skill === 'string' ? String(idx + 1).padStart(2, '0') : skill.index;
                  return (
                    <li key={name} className="pt-2 flex items-center justify-between font-mono text-xs text-muted">
                      <span>{name}</span>
                      <span>[{index}]</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsManager;

