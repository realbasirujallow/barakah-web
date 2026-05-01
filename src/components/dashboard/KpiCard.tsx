'use client';

import * as React from 'react';
import Link from 'next/link';
import HeroLink from '../HeroLink';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Phase-2 (Apr 27 2026) Monarch-style KPI card.
 *
 * The visual recipe that makes Monarch / Linear / Stripe dashboards feel
 * "premium" rather than "templated":
 *
 *   1. Tiny uppercase label in muted-foreground (`text-xs tracking-wide`)
 *   2. A *big* number — `text-3xl font-bold tabular-nums` — the eye lands
 *      here first. Monarch uses tabular numerals so dollar columns line
 *      up across cards even when one row has six digits and another has
 *      four.
 *   3. A small change indicator below ("▲ $1,234 (2.1%)" in green or red),
 *      kept short so the headline number stays the visual hero.
 *   4. Generous internal padding (px-5 py-4) and a subtle border + shadow,
 *      not a heavy outline.
 *
 * Props are deliberately verbose rather than clever — every screen has
 * a slightly different KPI, and a too-magic abstraction (like trying to
 * infer "positive/negative" from the sign of `change`) makes the call
 * sites harder to read. Better to spell it out.
 */
export interface KpiCardProps {
  /** Tiny uppercase label above the value (e.g. "Net Worth"). */
  label: string;
  /** The big number (already formatted) or a ReactNode for special states. */
  value: React.ReactNode;
  /** Optional small element rendered to the right of the label
   *  (hide/show toggle, "PAID" badge, etc). */
  trailingLabel?: React.ReactNode;
  /** Optional small line below the number (change indicator, sub-stats). */
  footer?: React.ReactNode;
  /** Tone for the value text. Defaults to neutral. */
  tone?: 'default' | 'positive' | 'negative' | 'warning' | 'muted';
  /** If set, the entire card becomes a Link to this href. */
  href?: string;
  /** Extra className passed through to the outermost element. */
  className?: string;
  /**
   * Optional sparkline data (Phase 4 / 2026-04-27). When provided, a
   * thin area chart renders behind the value text — Monarch / Rocket
   * Money use this for instant trend context without burning a full
   * card on a chart. Each entry is a single data point; we render
   * just one series. Negative `tone` flips the sparkline to rose.
   * Optional `label` field on each point is shown in the hover tooltip
   * (e.g. an ISO date) so the user can answer "what date is this?"
   * without leaving the card.
   */
  sparkline?: Array<{ value: number; label?: string }>;
  /** Optional formatter for the tooltip value (e.g. the parent's `fmt`).
   *  When omitted, the raw number is rendered. */
  sparklineFormat?: (n: number) => string;
  /**
   * R41 (2026-05-01): when supplied alongside `href`, the card link
   * uses HeroLink to wrap navigation in `document.startViewTransition`.
   * The destination page should set the same `viewTransitionName` on
   * its hero element to morph this card into the detail view. Older
   * browsers fall through to a plain Link with no jank.
   */
  heroName?: string;
}

const toneClass: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default:  'text-foreground',
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-rose-600 dark:text-rose-400',
  warning:  'text-amber-600 dark:text-amber-400',
  muted:    'text-muted-foreground',
};

// Tailwind variable maps for sparkline tones — keep full class strings
// here so JIT doesn't purge the runtime-derived stroke/fill colours.
const sparklineStroke: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default:  'var(--primary)',
  positive: 'oklch(0.62 0.15 165)',  // emerald
  negative: 'oklch(0.62 0.20 22)',   // rose
  warning:  'oklch(0.72 0.16 75)',   // amber
  muted:    'var(--muted-foreground)',
};

export function KpiCard({
  label,
  value,
  trailingLabel,
  footer,
  tone = 'default',
  href,
  className,
  sparkline,
  sparklineFormat,
  heroName,
}: KpiCardProps) {
  const hasSparkline = Array.isArray(sparkline) && sparkline.length >= 2;
  const stroke = sparklineStroke[tone];
  const gradientId = React.useId();

  const inner = (
    <Card
      className={cn(
        'relative gap-2 py-4 transition-shadow overflow-hidden',
        href && 'hover:shadow-md cursor-pointer',
        className,
      )}
    >
      {hasSparkline && (
        // Sparkline lives in the card's lower half, behind the text.
        // 12-tall, full width, 60% opacity so the headline number
        // wins the visual weight competition. pointer-events on the
        // chart so the Recharts <Tooltip> can fire, but the value
        // text overlay above is z-10 so clicks still land on the
        // card's outer href when present.
        <div className="absolute inset-x-0 bottom-0 h-12 opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke, strokeWidth: 1, strokeDasharray: '3 3' }}
                wrapperStyle={{ outline: 'none' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const p = payload[0].payload as { value: number; label?: string };
                  return (
                    <div className="bg-popover text-popover-foreground border border-border shadow-md rounded-md px-2 py-1 text-xs tabular-nums">
                      {p.label && <div className="text-muted-foreground">{p.label}</div>}
                      <div className="font-medium">
                        {sparklineFormat ? sparklineFormat(p.value) : p.value.toLocaleString()}
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={stroke}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <CardContent className="relative px-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            {label}
          </p>
          {trailingLabel ? <div className="flex-shrink-0">{trailingLabel}</div> : null}
        </div>
        <p className={cn('text-2xl md:text-3xl font-bold tabular-nums leading-tight', toneClass[tone])}>
          {value}
        </p>
        {footer ? <div className="text-xs text-muted-foreground mt-1.5">{footer}</div> : null}
      </CardContent>
    </Card>
  );

  if (href) {
    // R41 (2026-05-01): when a heroName is supplied, route through
    // HeroLink which wraps the navigation in
    // document.startViewTransition for a shared-element morph from
    // the card to the detail-page hero.
    if (heroName) {
      return (
        <HeroLink
          href={href}
          heroName={heroName}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          {inner}
        </HeroLink>
      );
    }
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        {inner}
      </Link>
    );
  }
  return inner;
}

/**
 * Phase 7.1 (Apr 27 2026) — skeleton sized identically to <KpiCard>.
 *
 * Use during the 1-3 second API latency window before
 * /api/dashboard/widgets returns. Dimensions match the real card so
 * there's zero layout shift when data arrives — same gap-2 / py-4 /
 * px-5 / text-3xl height. Three muted-bar rows mirror label / value /
 * footer.
 *
 * Usage:
 *   {loading
 *     ? <KpiSkeleton />
 *     : <KpiCard label="Net Worth" value={...} ... />}
 */
export function KpiSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('gap-2 py-4 animate-pulse', className)}>
      <CardContent className="px-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>
        <div className="h-8 w-32 rounded bg-muted mb-2" />
        <div className="h-3 w-24 rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

/**
 * Pre-styled change indicator (▲/▼ + amount + percent) that fits in
 * `<KpiCard footer={...}>`. Returns null if there's nothing to show.
 *
 * Hides itself when `amount` is null/undefined OR when `lastMonth < 50`
 * (the 50-dollar floor matches the existing Spending widget — under
 * that threshold the % comparison is misleading because a brand-new
 * account or a freshly-imported month produces giant spurious deltas).
 */
export function KpiChange({
  amount,
  percent,
  format,
  hideUnderLastMonth,
  lastMonth,
}: {
  amount: number | null | undefined;
  percent: number | null | undefined;
  format: (n: number) => string;
  hideUnderLastMonth?: number;
  lastMonth?: number;
}) {
  if (amount == null) return null;
  if (hideUnderLastMonth != null && lastMonth != null && lastMonth < hideUnderLastMonth) {
    return null;
  }
  const positive = amount >= 0;
  return (
    <span className={cn('font-medium', positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
      {positive ? '▲' : '▼'} {format(Math.abs(amount))}
      {percent != null && <> ({percent.toFixed(1)}%)</>}
    </span>
  );
}
