import React from 'react';

interface CertificateBorderFlourishProps {
  variant: 'top' | 'bottom';
  color?: string;
  accent?: string;
  className?: string;
}

// A single self-contained curl/scroll motif, reused (translated, scaled,
// rotated, sometimes mirrored) to build up the denser corner clusters and
// the thinner connecting vine — the same building block the reference
// artwork's border is clearly made of, repeated at different sizes.
const CURL = 'M0 0 C 13 -3, 21 7, 14 15 C 8 21, -3 17, -1 9 C 0 4, 5 2, 8 5';

const Curl: React.FC<{ x: number; y: number; scale?: number; rotate?: number; flip?: boolean; color: string; width?: number }> = ({
  x,
  y,
  scale = 1,
  rotate = 0,
  flip = false,
  color,
  width = 1.1
}) => (
  <path
    d={CURL}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    fill="none"
    transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale * (flip ? -1 : 1)}, ${scale})`}
  />
);

// Dense cluster of curls anchored at (x, y), fanning outward — used for the
// thicker knots that sit near each end of the band and around the centre.
const Cluster: React.FC<{ x: number; y: number; color: string; accent: string; mirror?: boolean }> = ({ x, y, color, accent, mirror }) => {
  const m = mirror ? -1 : 1;
  return (
    <g>
      <Curl x={x} y={y} scale={2.2} rotate={0} color={color} width={1.6} />
      <Curl x={x + 16 * m} y={y - 10} scale={1.5} rotate={40 * m} color={color} width={1.2} />
      <Curl x={x - 10 * m} y={y + 14} scale={1.3} rotate={-30 * m} color={color} width={1} flip={mirror} />
      <Curl x={x + 8 * m} y={y + 20} scale={1} rotate={90 * m} color={accent} width={1.3} />
      <circle cx={x + 4 * m} cy={y - 4} r={2.4} fill={accent} />
      <circle cx={x - 12 * m} cy={y + 6} r={1.6} fill={color} />
    </g>
  );
};

// Full-width top or bottom ornamental band: a flowing main vine with corner
// clusters at both ends, plus (for the top variant) a denser crossing
// cluster at the centre — an approximation of the reference artwork, not a
// pixel trace of it.
export const CertificateBorderFlourish: React.FC<CertificateBorderFlourishProps> = ({
  variant,
  color = '#3a2e22',
  accent = '#C9A24B',
  className = ''
}) => {
  const isTop = variant === 'top';
  const height = isTop ? 92 : 56;
  const vineY = isTop ? 46 : 30;

  return (
    <svg viewBox={`0 0 1160 ${height}`} className={className} width="100%" height={height} fill="none" preserveAspectRatio="none">
      {/* Main flowing vine, left to right */}
      <path
        d={`M20 ${vineY} C 160 ${vineY - 20}, 260 ${vineY + 16}, 380 ${vineY - 6} C 470 ${vineY - 20}, 520 ${vineY + 10}, 580 ${vineY} C 640 ${vineY - 10}, 690 ${vineY + 16}, 780 ${vineY - 6} C 900 ${vineY - 20}, 1000 ${vineY + 16}, 1140 ${vineY}`}
        stroke={color}
        strokeWidth={isTop ? 1.4 : 1.1}
        strokeLinecap="round"
      />
      {/* Secondary gold vine, offset — crosses under/over the main one */}
      <path
        d={`M60 ${vineY + 8} C 200 ${vineY - 14}, 300 ${vineY + 22}, 420 ${vineY} C 500 ${vineY - 16}, 560 ${vineY + 14}, 620 ${vineY - 2} C 690 ${vineY - 18}, 760 ${vineY + 18}, 860 ${vineY - 4} C 960 ${vineY - 18}, 1040 ${vineY + 14}, 1100 ${vineY + 6}`}
        stroke={accent}
        strokeWidth={isTop ? 1 : 0.8}
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Corner clusters, both ends */}
      <Cluster x={40} y={isTop ? 24 : 20} color={color} accent={accent} />
      <Cluster x={1120} y={isTop ? 24 : 20} color={color} accent={accent} mirror />

      {isTop && (
        <>
          {/* A second, smaller knot further in from each end */}
          <Cluster x={140} y={16} color={color} accent={accent} />
          <Cluster x={1020} y={16} color={color} accent={accent} mirror />
          {/* Centre crossing cluster */}
          <Curl x={560} y={10} scale={1.8} rotate={20} color={color} width={1.3} />
          <Curl x={600} y={10} scale={1.8} rotate={160} color={color} width={1.3} flip />
          <Curl x={580} y={26} scale={1.3} rotate={90} color={accent} width={1.1} />
          <circle cx={580} cy={16} r={2.2} fill={accent} />
        </>
      )}

      {/* Scattered accent dots along the vine */}
      {[220, 340, 460, 700, 820, 940].map((cx) => (
        <circle key={cx} cx={cx} cy={vineY + (cx % 2 === 0 ? -14 : 12)} r={isTop ? 1.8 : 1.4} fill={accent} />
      ))}
    </svg>
  );
};

export default CertificateBorderFlourish;
