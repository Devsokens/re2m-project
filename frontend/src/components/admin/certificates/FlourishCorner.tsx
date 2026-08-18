import React from 'react';

interface FlourishCornerProps {
  className?: string;
  color?: string;
  accent?: string;
}

// Ornate scrollwork corner ornament — denser and larger than a simple
// two-stroke swirl, closer to the reference certificate's corner flourish:
// a main curling vine along each edge with smaller branching tendrils and
// small accent dots, in gold + dark-gray tones.
export const FlourishCorner: React.FC<FlourishCornerProps> = ({ className = '', color = '#8a8a8a', accent = '#C9A24B' }) => (
  <svg viewBox="0 0 220 220" className={className} width="170" height="170" fill="none">
    {/* Main horizontal vine */}
    <path
      d="M2 6 C 90 2, 150 6, 190 34 C 208 47, 214 62, 210 76 C 207 87, 195 90, 188 82 C 182 75, 188 66, 197 68"
      stroke={accent}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Main vertical vine */}
    <path
      d="M6 2 C 2 90, 6 150, 34 190 C 47 208, 62 214, 76 210 C 87 207, 90 195, 82 188 C 75 182, 66 188, 68 197"
      stroke={accent}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Inner scroll swirl */}
    <path
      d="M4 4 C 46 4, 46 34, 24 38 C 6 41, 4 22, 18 20 C 27 19, 29 29, 20 31"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M4 4 C 4 46, 34 46, 38 24 C 41 6, 22 4, 20 18 C 19 27, 29 29, 31 20"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    {/* Secondary thin tendrils branching off the main vines */}
    <path d="M120 18 C 130 10, 142 12, 146 22 C 149 30, 141 36, 134 31" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <path d="M18 120 C 10 130, 12 142, 22 146 C 30 149, 36 141, 31 134" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <path d="M60 12 C 66 20, 64 30, 55 30" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
    <path d="M12 60 C 20 66, 30 64, 30 55" stroke={color} strokeWidth="0.8" strokeLinecap="round" />

    {/* Accent dots along the vines, like small buds */}
    <circle cx="60" cy="9" r="3" fill={accent} />
    <circle cx="9" cy="60" r="3" fill={accent} />
    <circle cx="120" cy="18" r="2.4" fill={color} />
    <circle cx="18" cy="120" r="2.4" fill={color} />
    <circle cx="188" cy="82" r="2.6" fill={accent} />
    <circle cx="82" cy="188" r="2.6" fill={accent} />
    <circle cx="46" cy="34" r="1.8" fill={accent} />
    <circle cx="34" cy="46" r="1.8" fill={accent} />
  </svg>
);

export default FlourishCorner;
