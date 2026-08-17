import React from 'react';

interface FlourishCornerProps {
  className?: string;
  color?: string;
  accent?: string;
}

// Stylised scrollwork corner ornament, approximating a hand-drawn flourish.
export const FlourishCorner: React.FC<FlourishCornerProps> = ({ className = '', color = '#B9B9B9', accent = '#C9A24B' }) => (
  <svg viewBox="0 0 160 160" className={className} width="120" height="120" fill="none">
    <path
      d="M4 4 C 40 4, 40 30, 20 34 C 4 37, 4 20, 16 18 C 24 17, 26 26, 18 28"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M4 4 C 4 40, 30 40, 34 20 C 37 4, 20 4, 18 16 C 17 24, 26 26, 28 18"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M4 4 C 60 4, 100 8, 130 30 C 145 42, 150 55, 148 66"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M4 4 C 4 60, 8 100, 30 130 C 42 145, 55 150, 66 148"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="46" cy="10" r="2.2" fill={accent} />
    <circle cx="10" cy="46" r="2.2" fill={accent} />
    <circle cx="78" cy="16" r="1.6" fill={color} />
    <circle cx="16" cy="78" r="1.6" fill={color} />
  </svg>
);

export default FlourishCorner;
