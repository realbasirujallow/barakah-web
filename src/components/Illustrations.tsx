/**
 * Inline-SVG illustrations for empty states + onboarding surfaces.
 *
 * R40 (2026-05-01): mirrors the mobile `widgets/illustrations.dart`
 * CustomPainter scenes with web-native inline SVG. Stripe/Linear-style
 * geometric shapes — overlapping discs, abstract receipt with curl,
 * calendar grid with highlighted day. Aesthetic intentionally
 * abstract: literal illustrations age fast, geometric ones don't.
 *
 * Each component takes:
 *   • `size` — pixel side length (default 140)
 *   • `primary` — hex/rgb colour (default deep green = #1B5E20)
 *
 * Inline SVG so they ship without an asset bundle and theme-react
 * via the parent's CSS color. No external dependencies.
 *
 * Usage:
 *   <IllustrationScene scene="empty" size={140} />
 *   <IllustrationScene scene="savings" primary="#0d9488" />
 */

import { type CSSProperties } from 'react';

const PRIMARY_DEFAULT = '#1B5E20';

export type IllustrationName =
  | 'empty'
  | 'savings'
  | 'receipt'
  | 'calendar'
  | 'insight'
  | 'mosque'
  | 'family';

interface IllustrationProps {
  size?: number;
  primary?: string;
  className?: string;
  showHalo?: boolean;
}

interface SceneProps extends IllustrationProps {
  scene: IllustrationName;
}

export function IllustrationScene({
  scene,
  size = 140,
  primary = PRIMARY_DEFAULT,
  className = '',
  showHalo = true,
}: SceneProps) {
  const Inner = SCENE_MAP[scene];
  const halo: CSSProperties = showHalo
    ? {
        backgroundColor: `${primary}14`, // ~8% alpha — soft brand halo
        borderRadius: '50%',
        padding: size * 0.05,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : { display: 'inline-flex' };

  return (
    <span style={halo} className={className} aria-hidden="true">
      <Inner size={size} primary={primary} />
    </span>
  );
}

const SCENE_MAP: Record<IllustrationName, React.FC<{ size: number; primary: string }>> = {
  empty: EmptyScene,
  savings: SavingsScene,
  receipt: ReceiptScene,
  calendar: CalendarScene,
  insight: InsightScene,
  mosque: MosqueScene,
  family: FamilyScene,
};

/** Three overlapping discs in shifted opacities — generic empty state. */
function EmptyScene({ size, primary }: { size: number; primary: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="80" r="42" fill={primary} fillOpacity="0.30" />
      <circle cx="85" cy="62" r="36" fill={primary} fillOpacity="0.55" />
      <circle cx="70" cy="42" r="14" fill={primary} />
    </svg>
  );
}

/** Coin stack with halo — savings. */
function SavingsScene({ size, primary }: { size: number; primary: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      {/* Stacked coins (back-to-front, palest at bottom) */}
      <ellipse cx="70" cy="92" rx="42" ry="7" fill={primary} fillOpacity="0.30" />
      <ellipse cx="70" cy="74" rx="42" ry="7" fill={primary} fillOpacity="0.50" />
      <ellipse cx="70" cy="56" rx="42" ry="7" fill={primary} fillOpacity="0.85" />
      <ellipse cx="70" cy="38" rx="42" ry="7" fill={primary} />
      <text
        x="70" y="44" textAnchor="middle"
        fontSize="14" fontWeight="900" fill="white"
        fontFamily="-apple-system, system-ui, sans-serif"
      >$</text>
    </svg>
  );
}

/** Paper receipt with curl + a highlighted line. */
function ReceiptScene({ size, primary }: { size: number; primary: string }) {
  // Wavy bottom edge approximated with cubic Béziers.
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 35 25 L 105 25 L 105 105 Q 93 110 81 105 Q 69 110 57 105 Q 45 110 35 105 Z"
        fill="white"
        stroke={primary}
        strokeOpacity="0.18"
        strokeWidth="2"
      />
      <rect x="48" y="42" width="44" height="4" fill={primary} fillOpacity="0.45" rx="1" />
      <rect x="48" y="58" width="36" height="4" fill={primary} fillOpacity="0.45" rx="1" />
      <rect x="48" y="74" width="28" height="4" fill={primary} fillOpacity="0.45" rx="1" />
      {/* Highlighted total line */}
      <rect x="48" y="88" width="20" height="6" fill={primary} rx="1" />
    </svg>
  );
}

/** 3×3 calendar grid with one highlighted day. */
function CalendarScene({ size, primary }: { size: number; primary: string }) {
  const cellSize = 18;
  const gridLeft = 36;
  const gridTop = 50;
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="28" width="84" height="84" rx="8" fill={primary} fillOpacity="0.10" />
      {/* Header bar */}
      <rect x="28" y="28" width="84" height="14" rx="8" fill={primary} />
      <rect x="28" y="36" width="84" height="6" fill={primary} />
      {/* 9 cells */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const isActive = r === 1 && c === 1;
          const x = gridLeft + c * (cellSize + 4);
          const y = gridTop + r * (cellSize + 4);
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx="3"
              fill={primary}
              fillOpacity={isActive ? 0.55 : 0.20}
            />
          );
        }),
      )}
    </svg>
  );
}

/** Lightbulb with simple rays. */
function InsightScene({ size, primary }: { size: number; primary: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      {/* Bulb */}
      <circle cx="70" cy="60" r="22" fill={primary} />
      {/* Base */}
      <rect x="60" y="80" width="20" height="14" fill={primary} fillOpacity="0.55" rx="1" />
      <rect x="58" y="92" width="24" height="4" fill={primary} fillOpacity="0.40" rx="1" />
      {/* Rays — 6 short lines around the bulb */}
      {[
        { x1: 70, y1: 22, x2: 70, y2: 32 },
        { x1: 38, y1: 60, x2: 48, y2: 60 },
        { x1: 92, y1: 60, x2: 102, y2: 60 },
        { x1: 44, y1: 32, x2: 51, y2: 39 },
        { x1: 96, y1: 32, x2: 89, y2: 39 },
        { x1: 70, y1: 14, x2: 70, y2: 26 },
      ].map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke={primary}
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/** Stylized mosque silhouette with crescent. */
function MosqueScene({ size, primary }: { size: number; primary: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      {/* Two minarets */}
      <rect x="24" y="56" width="7" height="56" fill={primary} fillOpacity="0.55" />
      <rect x="109" y="56" width="7" height="56" fill={primary} fillOpacity="0.55" />
      {/* Body */}
      <rect x="38" y="77" width="64" height="35" fill={primary} fillOpacity="0.75" />
      {/* Dome */}
      <path d="M 38 77 A 32 28 0 0 1 102 77 Z" fill={primary} />
      {/* Crescent above */}
      <circle cx="70" cy="28" r="8" fill={primary} fillOpacity="0.30" />
      <circle cx="73" cy="25" r="7" fill="white" />
    </svg>
  );
}

/** Three overlapping people-shaped circles for "household / family". */
function FamilyScene({ size, primary }: { size: number; primary: string }) {
  const headRadius = 14;
  const shoulderTop = 90;
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      {/* Three figures (left, center-back, right) */}
      {[
        { cx: 42, headY: 58, color: primary, opacity: 0.40 },
        { cx: 70, headY: 48, color: primary, opacity: 1.0 },
        { cx: 98, headY: 58, color: primary, opacity: 0.65 },
      ].map((f, i) => {
        const bodyW = headRadius * 2.2;
        return (
          <g key={i} fill={f.color} fillOpacity={f.opacity}>
            <rect
              x={f.cx - bodyW / 2}
              y={shoulderTop}
              width={bodyW}
              height="32"
              rx={headRadius * 0.8}
            />
            <circle cx={f.cx} cy={f.headY} r={headRadius} />
          </g>
        );
      })}
    </svg>
  );
}
