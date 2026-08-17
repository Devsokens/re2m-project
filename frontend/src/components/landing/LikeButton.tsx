import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { EngagementTargetType, getLikeState, toggleLike } from '../../utils/engagementStore';

interface LikeButtonProps {
  targetType: EngagementTargetType;
  targetId: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ targetType, targetId, size = 'sm', className = '' }) => {
  const [state, setState] = useState({ count: 0, liked: false });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    getLikeState(targetType, targetId)
      .then(setState)
      .catch((err) => console.error('Impossible de charger les likes :', err));
  }, [targetType, targetId]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic update so the click feels instant, then reconcile with the server.
    const optimistic = { count: state.liked ? state.count - 1 : state.count + 1, liked: !state.liked };
    setState(optimistic);
    if (optimistic.liked) {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }
    toggleLike(targetType, targetId)
      .then(setState)
      .catch((err) => {
        console.error('Échec du like :', err);
        setState(state);
      });
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
