import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { getLikeState, toggleLike } from '../../utils/engagementStore';

interface LikeButtonProps {
  itemKey: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ itemKey, size = 'sm', className = '' }) => {
  const [state, setState] = useState(() => getLikeState(itemKey));
  const [pulse, setPulse] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleLike(itemKey);
    setState(next);
    if (next.liked) {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 cursor-pointer group/like ${className}`}
      aria-pressed={state.liked}
      title={state.liked ? 'Retirer le like' : "J'aime"}
    >
      <Heart
        className={`${isSmall ? 'w-3.5 h-3.5' : 'w-5 h-5'} transition-transform ${pulse ? 'scale-125' : 'scale-100'} ${
          state.liked ? 'fill-blue-600 text-blue-600' : 'text-slate-400 group-hover/like:text-blue-500'
        }`}
      />
      <span className={`${isSmall ? 'text-[11px]' : 'text-sm'} font-bold ${state.liked ? 'text-blue-600' : 'text-slate-500'}`}>
        {state.count}
      </span>
    </button>
  );
};

export default LikeButton;
