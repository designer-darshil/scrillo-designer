import React from 'react';

interface DeviceMockupProps {
  type?: 'mobile' | 'tablet';
  children: React.ReactNode;
  className?: string;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  type = 'mobile',
  children,
  className = ''
}) => {
  if (type === 'mobile') {
    return (
      <div className={`relative mx-auto rounded-[36px] p-3 bg-[#1F1F1F] border border-white/20 shadow-2xl max-w-[320px] ${className}`}>
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 ml-auto mr-2" />
        </div>
        
        {/* Screen */}
        <div className="relative rounded-[28px] overflow-hidden bg-black aspect-[9/19] border border-white/5">
          {children}
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
      </div>
    );
  }

  return (
    <div className={`relative mx-auto rounded-[24px] p-4 bg-[#1F1F1F] border border-white/20 shadow-2xl max-w-[600px] ${className}`}>
      <div className="relative rounded-[16px] overflow-hidden bg-black aspect-[4/3] border border-white/5">
        {children}
      </div>
    </div>
  );
};
