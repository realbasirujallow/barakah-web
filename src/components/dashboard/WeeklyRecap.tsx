'use client';

import * as React from 'react';
import Link from 'next/link';

/**
 * R45 (2026-05-01) — Monarch-style Weekly Recap card.
 *
 * Replaces the previous one-line green "Weekly Insight Banner" with
 * a richer card that mirrors what Monarch Money shows above its
 * dashboard: a greeting, a date range for the current week, two or
 * three at-a-glance stats (net worth Δ, spending Δ), and the
 * insights feed below as a vertical list (instead of "1 of N more").
 *
 * The data is derived entirely from props the dashboard already has
 * — no new API calls. We accept nullable inputs so a brand-new
 * account with zero history still renders a clean recap (the stats
 * cells just say "—").
 *
 * Why a card, not a hero: the Net Worth card already owns the
 * 'net-worth-hero' viewTransitionName. Putting the recap above it
 * gives the user a one-glance "what changed this week?" before
 * they scroll into per-account detail.
 */

export interface WeeklyRecapProps {
  greeting: string;        // "Good morning" / "Good afternoon"
  greetingEmoji: string;   // "🌅" / "🌇"
  userName?: string | null;
  netWorthChangeAmount?: number | null;
  netWorthChangePercent?: number | null;
  /** Currency-formatter from the parent (preferred-currency aware). */
  fmt: (n: number) => string;
  /**
   * Insights pulled from /api/insights (already wired into the dashboard).
   * We render up to 3 inline. Severity drives the leading emoji.
   */
  insights: Array<{
    type?: string;
    severity?: 'good' | 'warning' | 'info' | string;
    title?: string;
    body: string;
  }>;
  /** Spending widget month-over-month delta (already on the page). */
  spendingThisMonth?: number | null;
  spendingLastMonth?: number | null;
  spendingChangePercent?: number | null;
}

// Pretty week range — Monday→Sunday by ISO convention. Monarch shows
// the most recent COMPLETED week ("April 19th–25th") at the top of
// their recap. We mirror that: "last week's recap" ending the
// previous Sunday. Dates are formatted in the user's locale.
function lastWeekRange(now = new Date()): string {
  // 0 = Sunday in JS; we want the most recent completed Mon–Sun.
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  // Days back to last Sunday (the END of last week).
  const dow = d.getDay(); // 0..6
  const daysSinceSunday = dow === 0 ? 7 : dow; // if today IS Sunday, recap is last Mon→Sun ending today minus 7
  const lastSunday = new Date(d);
  lastSunday.setDate(d.getDate() - daysSinceSunday);
  const lastMonday = new Date(lastSunday);
  lastMonday.setDate(lastSunday.getDate() - 6);

  const sameMonth = lastMonday.getMonth() === lastSunday.getMonth();
  if (sameMonth) {
    return `${lastMonday.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}–${lastSunday.toLocaleDateString(undefined, { day: 'numeric' })}`;
  }
  return `${lastMonday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${lastSunday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

function severityToEmoji(s: string | undefined): string {
  if (s === 'good') return '📈';
  if (s === 'warning') return '⚠️';
  return '💡';
}

export function WeeklyRecap({
  greeting,
  greetingEmoji,
  userName,
  netWorthChangeAmount,
  netWorthChangePercent,
  fmt,
  insights,
  spendingThisMonth,
  spendingLastMonth,
  spendingChangePercent,
}: WeeklyRecapProps) {
  const range = React.useMemo(() => lastWeekRange(), []);

  const hasNetWorth = typeof netWorthChangeAmount === 'number' && Number.isFinite(netWorthChangeAmount);
  const hasSpending =
    typeof spendingThisMonth === 'number' &&
    typeof spendingLastMonth === 'number' &&
    spendingLastMonth >= 50; // mirror the dashboard's $50 floor — under that, % deltas are misleading.

  const nwPositive = (netWorthChangeAmount ?? 0) >= 0;
  // Spending: a DECREASE is "good" (green), increase is "bad" (rose).
  const spendingDown = (spendingChangePercent ?? 0) <= 0;

  const top3 = insights.slice(0, 3);

  return (
    <section
      aria-label="Weekly recap"
      className="mb-4 bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide font-semibold text-emerald-700 dark:text-emerald-300 mb-0.5">
              Your weekly recap
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
              {greeting}{userName ? `, ${userName}` : ''} <span aria-hidden="true">{greetingEmoji}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recap for {range}
            </p>
          </div>
          <Link
            href="/dashboard/analytics"
            className="text-xs text-primary font-semibold hover:underline flex-shrink-0 whitespace-nowrap pt-1"
          >
            See all insights →
          </Link>
        </div>
      </div>

      {/* Stat strip — net worth + spending */}
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="px-5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Net worth Δ (30d)</p>
          {hasNetWorth ? (
            <p className={`text-base sm:text-lg font-semibold tabular-nums ${nwPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {nwPositive ? '▲' : '▼'} {fmt(Math.abs(netWorthChangeAmount as number))}
              {typeof netWorthChangePercent === 'number' && (
                <span className="text-xs font-medium ml-1 opacity-80">
                  ({netWorthChangePercent.toFixed(1)}%)
                </span>
              )}
            </p>
          ) : (
            <p className="text-base sm:text-lg font-semibold text-muted-foreground">—</p>
          )}
        </div>
        <div className="px-5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Spending vs last month</p>
          {hasSpending ? (
            <p className={`text-base sm:text-lg font-semibold tabular-nums ${spendingDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {spendingDown ? '▼' : '▲'} {fmt(Math.abs((spendingThisMonth ?? 0) - (spendingLastMonth ?? 0)))}
              {typeof spendingChangePercent === 'number' && (
                <span className="text-xs font-medium ml-1 opacity-80">
                  ({Math.abs(spendingChangePercent) > 500 ? '500+' : Math.abs(spendingChangePercent).toFixed(1)}%)
                </span>
              )}
            </p>
          ) : (
            <p className="text-base sm:text-lg font-semibold text-muted-foreground">—</p>
          )}
        </div>
      </div>

      {/* Insights feed (up to 3) */}
      {top3.length > 0 && (
        <ul className="border-t border-border divide-y divide-border">
          {top3.map((i, idx) => (
            <li key={idx} className="px-5 py-2.5 flex items-start gap-3 text-sm">
              <span className="text-base flex-shrink-0 leading-tight" aria-hidden="true">
                {severityToEmoji(i.severity)}
              </span>
              <p className="text-foreground leading-snug min-w-0">{i.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
