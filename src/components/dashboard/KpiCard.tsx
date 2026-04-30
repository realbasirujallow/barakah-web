'use client';

import * as React from 'react';
import Link from 'next/link';
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
}

const toneClass: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default:  'text-foreground',
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-rose-600 dark:text-rose-400',
  warning:  'text-amber-600 dark:text-amber-400',
  muted:    'text-muted-foreground',
};

export function KpiCard({
  label,
  value,
  trailingLabel,
  footer,
  tone = 'default',
  href,
  className,
}: KpiCardProps) {
  const inner = (
    <Card
      className={cn(
        'gap-2 py-4 transition-shadow',
        href && 'hover:shadow-md cursor-pointer',
        className,
      )}
    >
      <CardContent className="px-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            {label}
          </p>
          {trailingLabel ? <div className="flex-shrink-0">{trailingLabel}</div> : null}
        </div>
        <p className={cn('text-3xl font-bold tabular-nums leading-tight', toneClass[tone])}>
          {value}
        </p>
        {footer ? <div className="text-xs text-muted-foreground mt-1.5">{footer}</div> : null}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        {inner}
      </Link>
    );
  }
  return inner;
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
