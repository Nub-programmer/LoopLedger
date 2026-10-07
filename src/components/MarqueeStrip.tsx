import React from 'react';

interface MarqueeStripProps {
  customText?: string;
  speed?: 'normal' | 'fast';
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({ customText }) => {
  const defaultItems = [
    'REPAIR ↗',
    'REUSE ↗',
    'TRANSFER ↗',
    'REPURPOSE ↗',
    'RECOVER ↗',
    'RECYCLE ↗',
    'EXTEND LIFESPAN ↗',
    'DIGITAL PASSPORTS ↗',
    'ZERO LANDFILL ↗'
  ];

  const items = customText ? [customText, customText, customText] : defaultItems;

  return (
    <div className="w-full bg-[#121212] border-y-2 border-[#121212] overflow-hidden py-3 text-[#CCFF00] select-none">
      <div className="flex w-max animate-marquee">
        <div className="flex items-center gap-8 shrink-0 pr-8">
          {items.map((text, idx) => (
            <span
              key={`m1-${idx}`}
              className="font-grotesk font-black text-sm sm:text-base md:text-lg tracking-widest uppercase flex items-center gap-4"
            >
              <span>{text}</span>
              <span className="text-white text-xs opacity-40">●</span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-8 shrink-0 pr-8">
          {items.map((text, idx) => (
            <span
              key={`m2-${idx}`}
              className="font-grotesk font-black text-sm sm:text-base md:text-lg tracking-widest uppercase flex items-center gap-4"
            >
              <span>{text}</span>
              <span className="text-white text-xs opacity-40">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
