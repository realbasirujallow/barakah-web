'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCurrency } from '../../lib/useCurrency';
import { useI18n } from '../../lib/i18n';

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
  // 2026-05-12 overnight QA (UI-001 follow-up): greeting + emoji + userName
  // removed. The page header now owns the greeting; the card leads with
  // the week range. Callers still passing these props get a no-op (kept
  // as optional, unused, so we don't break the older revision of
  // dashboard/page.tsx before this commit lands in CI).
  greeting?: string;
  greetingEmoji?: string;
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
    // 2026-05-12 overnight QA (RC-002): backend insights now carry an
    // optional `link` pointing at the dashboard page that owns the
    // detail (e.g. subscription-detected → /dashboard/subscriptions).
    // Renders the body as a <Link> when present.
    link?: string;
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
//
// 2026-05-12 overnight QA (RTL-004): `toLocaleDateString(undefined, ...)`
// used the BROWSER default locale (typically en-US for US users) regardless
// of the app-selected language. Now accepts an explicit `locale` so Arabic /
// Urdu / French users see month names in their own script.
function lastWeekRange(now = new Date(), locale?: string): string {
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

  const loc = locale ?? undefined;
  const sameMonth = lastMonday.getMonth() === lastSunday.getMonth();
  if (sameMonth) {
    return `${lastMonday.toLocaleDateString(loc, { month: 'long', day: 'numeric' })}–${lastSunday.toLocaleDateString(loc, { day: 'numeric' })}`;
  }
  return `${lastMonday.toLocaleDateString(loc, { month: 'short', day: 'numeric' })} – ${lastSunday.toLocaleDateString(loc, { month: 'short', day: 'numeric' })}`;
}

function severityToEmoji(s: string | undefined): string {
  if (s === 'good') return '📈';
  if (s === 'warning') return '⚠️';
  return '💡';
}

export function WeeklyRecap({
  netWorthChangeAmount,
  netWorthChangePercent,
  fmt,
  insights,
  spendingThisMonth,
  spendingLastMonth,
  spendingChangePercent,
}: WeeklyRecapProps) {
  const { t, tFmt } = useI18n();
  // 2026-05-12 overnight QA (RTL-004): pull the app's selected locale so
  // the week-range string ("May 4–10" in en-US, "4–10 mai" in fr,
  // "٤–١٠ مايو" in ar) matches the rest of the UI.
  const { locale: dateLocale } = useCurrency();
  const range = React.useMemo(() => lastWeekRange(new Date(), dateLocale), [dateLocale]);

  const hasNetWorth = typeof netWorthChangeAmount === 'number' && Number.isFinite(netWorthChangeAmount);
  const hasSpending =
    typeof spendingThisMonth === 'number' &&
    typeof spendingLastMonth === 'number' &&
    spendingLastMonth >= 50 && // mirror the dashboard's $50 floor — under that, % deltas are misleading.
    // 2026-05-07 (live audit): when the current month has no spending yet
    // (e.g. on May 7th with no May transactions), the prior guard would
    // still render "▼ $3,831.72 (100.0%)" — reads as a misleading
    // "you cut spending 100%" celebration on what's actually no-data-yet.
    // Require at least $50 in the current month too before showing the delta.
    (spendingThisMonth as number) >= 50;

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
            {/* 2026-05-12 overnight QA (UI-001): page header already shows
                the greeting ("Good evening, Basiru") ~80 px above this
                card. Repeating it here was duplication and made the card
                feel like the header. Lead the card with its actual purpose
                instead — "Your weekly recap" + the date range. The
                `greeting`/`greetingEmoji` props are kept on the type so
                callers don't break, but we no longer render them here. */}
            <p className="text-xs uppercase tracking-wide font-semibold text-emerald-700 dark:text-emerald-300 mb-0.5">
              {t('dashYourWeeklyRecap')}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
              {tFmt('dashLastWeekRange', [range])}
            </h2>
          </div>
          <Link
            href="/dashboard/analytics"
            className="text-xs text-primary font-semibold hover:underline flex-shrink-0 whitespace-nowrap pt-1"
          >
            {t('dashSeeAllInsights')}
          </Link>
        </div>
      </div>

      {/* Stat strip — net worth + spending */}
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="px-5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{t('dashNetWorthDelta')}</p>
          {hasNetWorth ? (
            // 2026-05-12 overnight QA (RTL-003): wrap the entire numeric
            // stat in a <bdi dir="ltr"> so the bidi algorithm doesn't
            // re-order the ▲ / dollar / parens / percent run when the
            // surrounding page chrome is `dir="rtl"` (Arabic / Urdu).
            // Previously "(0.0%) $100.00 ▲" appeared with the percent
            // visually before the amount; LTR stats survive an RTL
            // container intact when wrapped this way.
            <p className={`text-base sm:text-lg font-semibold tabular-nums ${nwPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <bdi dir="ltr">
                {nwPositive ? '▲' : '▼'} {fmt(Math.abs(netWorthChangeAmount as number))}
                {typeof netWorthChangePercent === 'number' && (
                  <span className="text-xs font-medium ml-1 opacity-80">
                    {/* 2026-05-12 overnight QA (UI-003): when net worth is
                        large, a small dollar delta produces a sub-0.05 %
                        ratio that rounds to "0.0%" and reads as broken
                        ("▲ $100 (0.0%)"). Render `<0.1%` instead. */}
                    ({Math.abs(netWorthChangePercent) > 0 && Math.abs(netWorthChangePercent) < 0.05
                      ? '<0.1%'
                      : `${netWorthChangePercent.toFixed(1)}%`})
                  </span>
                )}
              </bdi>
            </p>
          ) : (
            <p className="text-base sm:text-lg font-semibold text-muted-foreground">—</p>
          )}
        </div>
        <div className="px-5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{t('dashSpendingVsLastMonth')}</p>
          {hasSpending ? (
            // 2026-05-23 (live E2E UI-1): when spending is identical month-over-
            // month the delta rounds to 0 and "▼ $0.00 (0.0%)" reads as broken.
            // Show a plain "No change" instead of a misleading arrow.
            Math.abs((spendingThisMonth ?? 0) - (spendingLastMonth ?? 0)) < 0.5 ? (
              <p className="text-base sm:text-lg font-semibold text-muted-foreground">{t('dashNoChange')}</p>
            ) : (
            <p className={`text-base sm:text-lg font-semibold tabular-nums ${spendingDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <bdi dir="ltr">
                {spendingDown ? '▼' : '▲'} {fmt(Math.abs((spendingThisMonth ?? 0) - (spendingLastMonth ?? 0)))}
                {typeof spendingChangePercent === 'number' && (
                  <span className="text-xs font-medium ml-1 opacity-80">
                    ({Math.abs(spendingChangePercent) > 500 ? '500+' : Math.abs(spendingChangePercent).toFixed(1)}%)
                  </span>
                )}
              </bdi>
            </p>
            )
          ) : (
            // 2026-05-11 (UX-3 fix): bare em-dash reads as "broken value".
            // Add a title attribute so hovering reveals the intent.
            <p
              className="text-base sm:text-lg font-semibold text-muted-foreground"
              title="Not enough month-over-month spending data to compare yet (both months must have at least $50 in expenses)."
            >—</p>
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
              {/* 2026-05-11: dir="auto" lets the browser pick direction
                  from the first strong char in the insight body, so
                  English insights ("Your tracked assets total Rs 305,000.")
                  render LTR with the trailing period in the right place
                  even when the surrounding page chrome is RTL (Urdu/Arabic).
                  Without this, the bidi algorithm pulled the period across
                  the number on PKR-locale accounts.
                  2026-05-12 overnight QA (RC-002): when the backend
                  provides a `link`, render the body as a Link so the
                  user can jump to the page that owns the detail (e.g.
                  subscription-detected → /dashboard/subscriptions). */}
              {i.link ? (
                <Link href={i.link} dir="auto" className="text-foreground leading-snug min-w-0 hover:underline hover:text-primary transition-colors">
                  {i.body}
                </Link>
              ) : (
                <p dir="auto" className="text-foreground leading-snug min-w-0">{i.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 2026-05-12 (QA-2026-05-12, Finding F4): for a brand-new user with no
          connected accounts, no transactions, and no insights, the recap
          previously showed only the greeting + range + two em-dashes. That
          reads as "the app is broken" instead of "no data yet". Render an
          empty-state CTA when we have nothing to recap. The check mirrors the
          three conditions above so the empty state only fires when truly
          empty, not when we're just missing one of the metrics. */}
      {top3.length === 0 && !hasNetWorth && !hasSpending && (
        <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground bg-muted/30">
          <p className="leading-snug">
            No recap yet — your first few transactions will populate this.{' '}
            <Link href="/dashboard/accounts" className="text-primary font-semibold hover:underline whitespace-nowrap">
              Connect a bank →
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}
