import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { stripHtml } from '../../utils/text';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { getComments } from '../../utils/engagementStore';

export interface BlogCarouselItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
}

interface BlogCarouselProps {
  items: BlogCarouselItem[];
  onSelect: (item: BlogCarouselItem) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const readTime = (content: string) => Math.max(1, Math.round(stripHtml(content).split(/\s+/).filter(Boolean).length / 200));

// Auto-advancing horizontal reel (native scroll, pauses on user interaction)
// with synced pagination dots and manual arrows, in the spirit of the
// reference "Blog Section" Dribbble shot.
export const BlogCarousel: React.FC<BlogCarouselProps> = ({ items, onSelect }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (items.length === 0) return;
    Promise.all(items.map((a) => getComments('article', a.id).then((comments) => [a.id, comments.length] as const)))
      .then((entries) => setCommentCounts(Object.fromEntries(entries)))
      .catch((err) => console.error('Impossible de charger les commentaires :', err));
  }, [items]);

  const getStep = () => {
    const el = trackRef.current;
    if (!el || !el.children[0]) return 340;
    const card = el.children[0] as HTMLElement;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || '24');
    return card.getBoundingClientRect().width + gap;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;
    const interval = setInterval(() => {
      if (!el || Date.now() < pausedUntilRef.current) return;
      const step = getStep();
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const pause = () => {
    pausedUntilRef.current = Date.now() + 6000;
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep();
    setActiveIndex(Math.min(items.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    pause();
    el.scrollTo({ left: index * getStep(), behavior: 'smooth' });
  };

  const handlePrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const handleNext = () => scrollToIndex(Math.min(items.length - 1, activeIndex + 1));

  if (items.length === 0) return null;

  return (
    <section className="bg-[#002366] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">Blog &amp; Articles</h2>
          <p className="text-blue-100/80 text-sm sm:text-base">
            Les réflexions et retours d'expérience de nos consultants sur les Achats et la Logistique.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={pause}
        onMouseDown={pause}
        onWheel={pause}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pl-4 sm:pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-4 sm:pr-6 pb-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="snap-start shrink-0 w-[260px] sm:w-[320px] rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-colors duration-300 cursor-pointer group"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5 space-y-3">
              <span className="inline-flex text-[10px] font-bold text-sky-300 bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {item.category}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-blue-100/70">
                {formatDate(item.date)} — {readTime(item.content)} min de lecture
              </div>
              <h3 className="font-serif text-base font-bold text-white leading-snug line-clamp-2">{item.title}</h3>
              <p className="text-xs text-blue-100/70 leading-relaxed line-clamp-2">{item.excerpt}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                className="text-[11px] font-bold text-sky-300 hover:text-white cursor-pointer transition-colors"
              >
                Voir plus
              </button>
              <div className="flex items-center gap-3 pt-1 border-t border-white/10 mt-1" onClick={(e) => e.stopPropagation()}>
                <LikeButton targetType="article" targetId={item.id} className="[&_span]:text-blue-100" />
                <button
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-100/70 hover:text-white cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> {commentCounts[item.id] ?? 0}
                </button>
                <ShareButton targetType="article" targetId={item.id} title={item.title} className="hover:!text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mt-8">
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Aller à l'article ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Article précédent"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Article suivant"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={activeIndex === items.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
