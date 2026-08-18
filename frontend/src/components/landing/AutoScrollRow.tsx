import React, { useEffect, useRef } from 'react';

interface AutoScrollRowProps {
  children: React.ReactNode;
  className?: string;
}

// A horizontally scrollable row that auto-advances on its own (like someone
// gently swiping every few seconds), but is a real native-scroll container —
// touching/dragging it takes over immediately and pauses the auto-advance
// for a while, rather than fighting the user's gesture.
export const AutoScrollRow: React.FC<AutoScrollRowProps> = ({ children, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedUntilRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (!el || Date.now() < pausedUntilRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: Math.round(el.clientWidth * 0.85), behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const pause = () => {
    pausedUntilRef.current = Date.now() + 6000;
  };

  return (
    <div
      ref={scrollRef}
      onTouchStart={pause}
      onMouseDown={pause}
      onWheel={pause}
      className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
};

export default AutoScrollRow;
