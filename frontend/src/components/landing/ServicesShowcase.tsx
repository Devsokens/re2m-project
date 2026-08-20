import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface ServicesShowcaseItem {
  title: string;
  desc: string;
  image: string;
}

interface ServicesShowcaseProps {
  items: ServicesShowcaseItem[];
  onExplore: () => void;
}

// Scattered decorative squares used on the muted "selector" cards — purely
// visual, echoes the reference design's confetti-like accent dots.
const DOT_LAYOUTS: Array<{ top: string; left: string; size: string }> = [
  { top: '18%', left: '20%', size: 'w-2.5 h-2.5' },
  { top: '30%', left: '55%', size: 'w-2 h-2' },
  { top: '46%', left: '32%', size: 'w-3 h-3' },
  { top: '58%', left: '68%', size: 'w-2 h-2' },
  { top: '68%', left: '42%', size: 'w-2.5 h-2.5' },
  { top: '40%', left: '78%', size: 'w-1.5 h-1.5' }
];

const ACCENTS = [
  ['bg-amber-400', 'bg-amber-300/70', 'bg-amber-200/60'],
  ['bg-fuchsia-500', 'bg-fuchsia-400/70', 'bg-violet-400/60'],
  ['bg-emerald-500', 'bg-emerald-400/70', 'bg-emerald-300/60'],
  ['bg-sky-500', 'bg-sky-400/70', 'bg-sky-300/60']
];

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({ items, onExplore }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const ordered = [activeIndex, ...items.map((_, i) => i).filter((i) => i !== activeIndex)];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      {ordered.map((itemIndex, position) => {
        const item = items[itemIndex];
        const isFeatured = position === 0;
        const accent = ACCENTS[itemIndex % ACCENTS.length];

        if (isFeatured) {
          return (
            <div
              key={itemIndex}
              className="animate-fadeIn sm:col-span-2 lg:col-span-2 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row lg:flex-col"
            >
              <div className="relative w-full sm:w-1/2 lg:w-full aspect-[4/3] sm:aspect-auto lg:aspect-[16/10] overflow-hidden shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 text-white text-xs font-bold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {String(position + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002366] leading-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{item.desc}</p>
                <button
                  onClick={onExplore}
                  className="group/btn inline-flex items-center gap-2 text-xs font-bold text-[#002366] w-fit cursor-pointer mt-1"
                >
                  En savoir plus
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        }

        return (
          <button
            key={itemIndex}
            type="button"
            onClick={() => setActiveIndex(itemIndex)}
            className="group relative rounded-3xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 overflow-hidden text-left cursor-pointer transition-colors duration-300 min-h-[220px] flex flex-col justify-between p-5"
          >
            {/* Decorative scattered dots */}
            <div className="absolute inset-0 pointer-events-none">
              {DOT_LAYOUTS.map((dot, i) => (
                <span
                  key={i}
                  style={{ top: dot.top, left: dot.left }}
                  className={`absolute ${dot.size} rounded-[3px] rotate-12 transition-transform duration-500 group-hover:scale-125 ${accent[i % accent.length]}`}
                />
              ))}
            </div>

            <span className="relative text-3xl font-serif font-extrabold text-slate-300 group-hover:text-slate-400 transition-colors">
              {String(position + 1).padStart(2, '0')}
            </span>
            <span className="relative text-sm font-bold text-[#002366] leading-snug">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ServicesShowcase;
