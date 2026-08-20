import React, { useEffect, useState } from 'react';
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

const AUTOPLAY_DELAY = 6500;

// Cards keep a fixed position — only their flex-grow ratio and inner content
// visibility transition, so switching the active card morphs smoothly in
// place (crossfade + width grow) instead of swapping via remount. Every
// card always shows its photo (muted/grayscale + navy wash by default,
// full colour once active) rather than hiding it until selected.
// Auto-advances on its own; a click jumps straight to that card and
// resets the autoplay clock.
export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({ items, onExplore }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isHovering) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [items.length, isHovering, activeIndex]);

  if (items.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex flex-col lg:flex-row gap-4 items-stretch"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{ flexGrow: isActive ? 3 : 1, flexBasis: 0 }}
            className={`group relative rounded-3xl overflow-hidden text-left cursor-pointer flex flex-col border transition-[flex-grow,background-color,box-shadow] duration-[900ms] ease-in-out lg:min-h-[380px] ${
              isActive ? 'bg-white border-slate-200 shadow-xl' : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            {/* Photo — always present; muted by default, revealed on activation */}
            <div
              className={`relative overflow-hidden shrink-0 transition-all duration-[900ms] ease-in-out ${
                isActive ? 'h-48 sm:h-56' : 'h-24 sm:h-28'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className={`w-full h-full object-cover transition-all duration-[900ms] ease-in-out ${
                  isActive ? 'scale-100 grayscale-0' : 'scale-110 grayscale'
                }`}
              />
              <div
                className={`absolute inset-0 bg-[#001845] transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-0' : 'opacity-55 group-hover:opacity-40'
                }`}
              />
              <span
                className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-2xl sm:text-3xl font-serif font-extrabold transition-colors duration-500 ${
                  isActive ? 'text-white/90' : 'text-white/70'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <h3
                className={`font-serif text-base sm:text-lg font-bold leading-snug transition-colors duration-500 ${
                  isActive ? 'text-[#002366]' : 'text-white'
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm leading-relaxed overflow-hidden transition-all duration-700 ease-in-out ${
                  isActive ? 'max-h-24 opacity-100 mt-2 text-slate-500' : 'max-h-0 opacity-0 mt-0 text-blue-100/80'
                }`}
              >
                {item.desc}
              </p>
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  isActive ? 'max-h-10 opacity-100 pt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplore();
                  }}
                  className="group/btn inline-flex items-center gap-2 text-xs font-bold text-[#002366] w-fit cursor-pointer"
                >
                  En savoir plus
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesShowcase;
