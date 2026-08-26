import React from 'react';
import { DesignToCodeComparison as ComparisonType } from '../../types';
import { Code2, Figma } from 'lucide-react';

interface DesignToCodeProps {
  data: ComparisonType;
  className?: string;
}

export const DesignToCodeComparison: React.FC<DesignToCodeProps> = ({ data, className = '' }) => {
  if (!data) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Design → Code Implementation
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Figma Design System Specification */}
        <div className="lg:col-span-5 p-6 rounded border border-white/10 bg-[#0A0A0A] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
            <Figma size={14} className="text-[#FF3E00]" />
            <span>Figma System Spec</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {data.figmaNotes}
          </p>
          <div className="pt-2 text-[11px] font-mono text-neutral-400 border-t border-white/5">
            {data.responsiveDetails}
          </div>
        </div>

        {/* Coded Component */}
        <div className="lg:col-span-7 rounded border border-white/10 bg-[#060606] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0C0C0C] border-b border-white/10 text-xs font-mono text-neutral-400">
            <div className="flex items-center space-x-2">
              <Code2 size={13} className="text-blue-400" />
              <span>{data.codeSnippet.filename}</span>
            </div>
            <span className="text-[10px] text-neutral-400 uppercase">{data.codeSnippet.language}</span>
          </div>
          <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
            <code>{data.codeSnippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
