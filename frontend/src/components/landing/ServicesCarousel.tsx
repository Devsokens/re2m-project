import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface ServicesCarouselItem {
  title: string;
  desc: string;
  image: string;
  details?: string[];
}

interface ServicesCarouselProps {
  title: React.ReactNode;
  items: ServicesCarouselItem[];
  onExplore: () => void;
}

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ title, items, onExplore }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const handlePrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const handleNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="rounded-[2.5rem] bg-[#002366] p-5 sm:p-8 shadow-2xl">
      {/* Header row */}
      <div className="flex items-center justify-between px-2 sm:px-3 pb-6 sm:pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-white">{title}</h2>
        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
          <button
            onClick={handlePrev}
            aria-label="Service précédent"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-white/20" />
          <button
            onClick={handleNext}
            aria-label="Service suivant"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sliding reel */}
      <div className="rounded-[2rem] bg-white overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="w-full aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-[1400ms] ease-out ${
                    i === index ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002366]">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>

                {item.details && item.details.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Ce que nous proposons</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {item.details.slice(0, 3).map((det, dIdx) => (
                        <div key={dIdx} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <p className="text-xs font-bold text-[#002366] leading-snug">{det}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={onExplore}
                  className="group/btn inline-flex items-center gap-2 bg-[#002366] hover:bg-blue-900 text-white text-xs font-bold px-5 py-3 rounded-full w-fit cursor-pointer transition-colors mt-2"
                >
                  En savoir plus
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Aller au service ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesCarousel;
