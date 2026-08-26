import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { BrowserMockup } from '../ui/BrowserMockup';
import { Code2, Figma, Eye, Check, Sliders, Sparkles, Layers, Cpu } from 'lucide-react';

export const SignatureDesignCode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'figma' | 'code' | 'result'>('result');
  const [metricValue, setMetricValue] = useState(84.6);
  const [activeFilter, setActiveFilter] = useState('24h');
  const [isAlertActive, setIsAlertActive] = useState(false);

  return (
    <section className="py-28 md:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 subtle-dot-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <SectionHeading
          number="03"
          tag="SIGNATURE CAPABILITY"
          title="DESIGN"
          serifWord="→ CODE FIDELITY"
          description="A design isn't finished when the Figma frame is approved. It's finished when the component renders with 0ms layout shift, full keyboard accessibility, and 60fps spring animations."
          align="split"
        />

        {/* Interactive Pipeline Showcase */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl">
          
          {/* Top Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('figma')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'figma'
                    ? 'bg-[#FF3E00] text-white font-bold shadow-md shadow-[#FF3E00]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Figma size={14} />
                <span>01. FIGMA TOKENS</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'code'
                    ? 'bg-[#FF3E00] text-white font-bold shadow-md shadow-[#FF3E00]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Code2 size={14} />
                <span>02. REACT TSX CODE</span>
              </button>

              <button
                onClick={() => setActiveTab('result')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'result'
                    ? 'bg-[#FF3E00] text-white font-bold shadow-md shadow-[#FF3E00]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye size={14} />
                <span>03. LIVE BROWSER RENDER</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono text-white/50">
              <span className="flex items-center gap-1.5 text-white/80">
                <Cpu size={13} className="text-[#FF3E00]" />
                Zero Handoff Loss
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-emerald-400">100% Interactive</span>
            </div>
          </div>

          {/* Main Pipeline Display Area */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              {/* TAB 1: FIGMA TOKENS & SPECS */}
              {activeTab === 'figma' && (
                <motion.div
                  key="figma"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                  <div className="md:col-span-6 space-y-6">
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#FF3E00]">
                      <Layers size={14} />
                      <span className="font-bold">FIGMA AUTO-LAYOUT & VARIABLE DEFINITION</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white tracking-tight">
                      Semantic Token Architecture
                    </h4>
                    <p className="text-sm text-muted-primary leading-relaxed">
                      Every component is constructed with Figma variables mapped to standardized token scales. We avoid arbitrary hex codes in favor of semantic intent (e.g. <code className="text-white font-mono text-xs">surface.card.elevated</code>).
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-white/50">Padding Scale</span>
                        <span className="text-white font-semibold">16px (p-4), 24px (p-6)</span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-white/50">Corner Radius</span>
                        <span className="text-white font-semibold">12px (rounded-xl)</span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-white/50">Spring Easing</span>
                        <span className="text-[#FF3E00] font-semibold">cubic-bezier(0.16, 1, 0.3, 1)</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 bg-black/80 rounded-xl p-6 border border-white/10 font-mono text-xs text-white/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-white/40">
                      <span>tokens.figma.json</span>
                      <span>SCHEMA v3</span>
                    </div>
                    <pre className="text-emerald-400 leading-relaxed overflow-x-auto text-[11px]">
                      {`{
  "theme": {
    "color": {
      "surface": {
        "primary": { "$value": "#0A0A0A", "$type": "color" },
        "accent": { "$value": "#FF3E00", "$type": "color" }
      },
      "status": {
        "active": { "$value": "#10B981", "$type": "color" },
        "critical": { "$value": "#EF4444", "$type": "color" }
      }
    },
    "radius": { "card": "12px", "badge": "9999px" }
  }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: REACT TSX CODE */}
              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                  <div className="md:col-span-5 space-y-6">
                    <div className="flex items-center space-x-2 text-xs font-mono text-blue-400">
                      <Code2 size={14} />
                      <span className="font-bold">PRODUCTION TYPESCRIPT ARCHITECTURE</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white tracking-tight">
                      Typed Component Props & Motion
                    </h4>
                    <p className="text-sm text-muted-primary leading-relaxed">
                      Clean functional React components with strictly typed interfaces, zero dependencies on heavyweight UI kits, and native spring physics.
                    </p>
                    <ul className="space-y-2 text-xs font-mono text-white/70">
                      <li className="flex items-center space-x-2">
                        <Check size={13} className="text-[#FF3E00]" />
                        <span>Framer Motion layout transitions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check size={13} className="text-[#FF3E00]" />
                        <span>Tailwind CSS arbitrary & semantic tokens</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check size={13} className="text-[#FF3E00]" />
                        <span>ARIA accessible button and tab controls</span>
                      </li>
                    </ul>
                  </div>

                  <div className="md:col-span-7 bg-[#050505] rounded-xl p-5 border border-white/10 font-mono text-xs overflow-x-auto">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-white/40 text-[11px]">
                      <span>src/components/telemetry/ClusterMetricWidget.tsx</span>
                      <span className="text-[#FF3E00]">React + TypeScript</span>
                    </div>
                    <pre className="text-blue-300 text-[11px] leading-relaxed">
                      {`export const ClusterMetricWidget: React.FC<WidgetProps> = ({
  clusterId,
  currentLoad,
  isCritical = false
}) => {
  return (
    <motion.div
      layout
      className={clsx(
        "rounded-xl p-5 border transition-all duration-300",
        isCritical 
          ? "border-red-500/40 bg-red-950/20" 
          : "border-white/10 bg-[#0C0C0C]"
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono uppercase text-white/50">{clusterId}</span>
        <StatusBadge isAlert={isCritical} />
      </div>
      <div className="text-3xl font-extrabold font-mono text-white">
        {currentLoad}%
      </div>
    </motion.div>
  );
};`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: LIVE BROWSER RENDER (INTERACTIVE WIDGET) */}
              {activeTab === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <BrowserMockup url="https://scrillo.craft/live-component" title="Live Telemetry Component">
                    <div className="p-6 md:p-8 bg-[#090909] text-white">
                      
                      {/* Interactive Controls Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF3E00] font-bold">
                            LIVE INTERACTIVE DEMO
                          </span>
                          <h4 className="text-lg font-bold text-white">Cluster Telemetry Node</h4>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsAlertActive(!isAlertActive)}
                            className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                              isAlertActive
                                ? 'bg-red-500 text-white font-bold'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            Toggle Alert State: {isAlertActive ? 'CRITICAL' : 'NORMAL'}
                          </button>
                        </div>
                      </div>

                      {/* Rendered Live Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Node Card 1 */}
                        <div
                          className={`p-5 rounded-xl border transition-all duration-300 ${
                            isAlertActive
                              ? 'border-red-500/50 bg-red-950/20'
                              : 'border-white/10 bg-[#121212]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-white/50">EU-CENTRAL-01</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isAlertActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                              }`}
                            />
                          </div>
                          <div className="text-3xl font-mono font-extrabold text-white">
                            {isAlertActive ? '99.4%' : `${metricValue}%`}
                          </div>
                          <p className="text-[11px] font-mono text-white/40 mt-2">
                            {isAlertActive ? 'Throttling limit exceeded' : 'Throughput nominal'}
                          </p>
                        </div>

                        {/* Node Card 2 */}
                        <div className="p-5 rounded-xl border border-white/10 bg-[#121212]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-white/50">US-EAST-04</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <div className="text-3xl font-mono font-extrabold text-white">
                            42.1 ms
                          </div>
                          <p className="text-[11px] font-mono text-white/40 mt-2">
                            Average API latency (p99)
                          </p>
                        </div>

                        {/* Interactive Sliders Panel */}
                        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-mono text-white/50">SIMULATE LOAD</span>
                            <div className="flex items-center space-x-3 mt-2">
                              <input
                                type="range"
                                min="20"
                                max="98"
                                value={metricValue}
                                onChange={(e) => setMetricValue(Number(e.target.value))}
                                className="w-full accent-[#FF3E00] cursor-pointer"
                              />
                              <span className="font-mono text-xs text-[#FF3E00] font-bold">
                                {metricValue}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-white/40">
                            <span>React State</span>
                            <span className="text-emerald-400">Zero Reflow</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </BrowserMockup>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Callout */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-white/50">
            <div className="flex items-center space-x-2">
              <Sparkles size={13} className="text-[#FF3E00]" />
              <span>DESIGNED IN FIGMA • CODED IN REACT • RESPONSIVE BY DEFAULT</span>
            </div>
            <span className="text-white/30">SCRILLO DESIGN ENGINEERING</span>
          </div>

        </div>

      </div>
    </section>
  );
};
