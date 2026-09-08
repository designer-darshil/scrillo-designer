import React from 'react';

interface CapabilityGroup {
  number: string;
  category: string;
  items: string[];
}

const capabilityGroups: CapabilityGroup[] = [
  {
    number: '01',
    category: 'UI / UX',
    items: [
      'Interface Design',
      'Wireframes',
      'User Flows',
      'Prototyping',
      'Interaction Design'
    ]
  },
  {
    number: '02',
    category: 'WEB',
    items: [
      'Web Design',
      'Responsive Design',
      'HTML / CSS',
      'JavaScript'
    ]
  },
  {
    number: '03',
    category: 'TOOLS',
    items: [
      'Figma',
      'Photoshop',
      'Illustrator',
      'Adobe XD',
      'Sketch',
      'InVision'
    ]
  }
];

export const EditorialCapabilities: React.FC = () => {
  return (
    <section className="relative bg-[#060606] text-white border-b border-white/[0.08]">
      {/* Top Header Bar */}
      <div className="border-b border-white/[0.08] py-8 sm:py-10">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest uppercase text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">03</span>
            <span className="text-white/20">/</span>
            <span className="text-[#FF3E00]">CAPABILITIES</span>
          </div>
          <div>
            <span>SYSTEMATIZED COMPETENCIES</span>
          </div>
        </div>
      </div>

      {/* Main Capabilities Grid */}
      <div className="site-container py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {capabilityGroups.map((group) => (
            <div
              key={group.category}
              className="space-y-6 sm:space-y-8"
            >
              {/* Group Header */}
              <div className="space-y-2 pb-5 border-b border-white/[0.08]">
                <span className="font-mono text-xs text-[#FF3E00] tracking-widest block">
                  {group.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-white">
                  {group.category}
                </h3>
              </div>

              {/* Items List */}
              <ul className="space-y-3.5 font-sans">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-white/80 hover:text-white transition-colors group cursor-default"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#FF3E00] transition-colors shrink-0" />
                    <span className="text-base sm:text-lg font-normal tracking-normal group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
