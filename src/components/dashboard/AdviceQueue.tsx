'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle, Clock, Receipt, Tags, Banknote, PieChart, ShieldCheck, Sparkles,
  type LucideIcon,
} from 'lucide-react';

/**
 * R45 (2026-05-01) — Monarch's "Advice — Prioritized by you" section.
 *
 * Generates contextual, actionable advice cards from the data the
 * dashboard already loads (no new API calls). Each card has:
 *   • a leading icon (Lucide, brand-coloured per severity)
 *   • a single-line title + body
 *   • a destination link
 *
 * Order is severity-driven (warnings first, then info, then "nice
 * to have" suggestions). We cap at 4 cards so the section stays
 * digestible — anything past 4 is implicit clutter.
 *
 * Why a queue and not a wall: Monarch's pattern is "here's the
 * NEXT thing to handle." If a user has 12 things, showing 12
 * cards isn't actionable — showing the top 4 is. The user can
 * always dig deeper into each linked surface.
 *
 * Hides entirely when there's nothing to advise about (clean
 * state — the user is on top of things).
 */

export interface AdviceQueueProps {
  /** Count of transactions sitting in the "needs review" queue. */
  reviewQueueCount: number;
  /** Number of bills overdue right now. */
  overdueBillsCount: number;
  /** Number of upcoming bills due in the next ~7 days. */
  upcomingBillsCount: number;
  /** Hawl: number of zakat anniversaries due NOW (zakat overdue). */
  hawlDueNowCount: number;
  /** Whether the user has connected at least one Plaid account. */
  hasLinkedAccount: boolean;
  /** Number of budgets configured. */
  budgetCount: number;
  /** Number of total transactions tracked. */
  transactionCount: number;
  /**
   * Spending change percent (month over month). Positive = up.
   * When > 25%, surface as advice ("spending spiked, review categories").
   */
  spendingChangePercent?: number | null;
  /** $50 floor mirror — under this last month, MoM advice is muted. */
  spendingLastMonth?: number | null;
}

interface Advice {
  id: string;
  severity: 'warning' | 'info' | 'suggestion';
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  cta: string;
}

const SEVERITY_TONE: Record<Advice['severity'], { container: string; iconBg: string; iconFg: string }> = {
  warning: {
    container: 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconFg: 'text-amber-700 dark:text-amber-300',
  },
  info: {
    container: 'border-sky-200 bg-sky-50 dark:bg-sky-950/20 dark:border-sky-900/40',
    iconBg: 'bg-sky-100 dark:bg-sky-900/40',
    iconFg: 'text-sky-700 dark:text-sky-300',
  },
  suggestion: {
    container: 'border-border bg-card',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconFg: 'text-emerald-700 dark:text-emerald-300',
  },
};

function buildAdvice(p: AdviceQueueProps): Advice[] {
  const advice: Advice[] = [];

  // ── Warnings (require action) ──────────────────────────────────────────
  if (p.hawlDueNowCount > 0) {
    advice.push({
      id: 'hawl-due',
      severity: 'warning',
      icon: AlertTriangle,
      title: `Zakat is due on ${p.hawlDueNowCount} asset${p.hawlDueNowCount === 1 ? '' : 's'}`,
      body: 'A full lunar year (hawl) has passed. Calculate and pay this zakat to keep your wealth purified.',
      href: '/dashboard/hawl',
      cta: 'Open hawl tracker',
    });
  }
  if (p.overdueBillsCount > 0) {
    advice.push({
      id: 'overdue-bills',
      severity: 'warning',
      icon: Receipt,
      title: `${p.overdueBillsCount} bill${p.overdueBillsCount === 1 ? ' is' : 's are'} overdue`,
      body: 'Review and mark these as paid (or update the due date if you already paid).',
      href: '/dashboard/bills',
      cta: 'Review bills',
    });
  }

  // ── Info (timely / month-over-month signals) ────────────────────────────
  if (p.reviewQueueCount > 0) {
    advice.push({
      id: 'needs-review',
      severity: 'info',
      icon: Clock,
      title: `${p.reviewQueueCount} transaction${p.reviewQueueCount === 1 ? '' : 's'} need${p.reviewQueueCount === 1 ? 's' : ''} review`,
      body: 'Verify the auto-detected categories on imported transactions so your budgets stay accurate.',
      href: '/dashboard/transactions?filter=needs_review',
      cta: 'Review now',
    });
  }
  const lastMonthOk = (p.spendingLastMonth ?? 0) >= 50;
  if (lastMonthOk && typeof p.spendingChangePercent === 'number' && p.spendingChangePercent > 25) {
    advice.push({
      id: 'spending-spike',
      severity: 'info',
      icon: PieChart,
      title: `Spending up ${p.spendingChangePercent.toFixed(0)}% vs last month`,
      body: 'Take a moment to scan your top categories — small spikes early in the month compound.',
      href: '/dashboard/analytics',
      cta: 'See breakdown',
    });
  }
  if (p.upcomingBillsCount > 0 && p.overdueBillsCount === 0) {
    // Only show "upcoming bills" advice when there are no OVERDUE bills,
    // otherwise the warnings above already cover the user's attention budget.
    advice.push({
      id: 'upcoming-bills',
      severity: 'info',
      icon: Receipt,
      title: `${p.upcomingBillsCount} bill${p.upcomingBillsCount === 1 ? '' : 's'} due soon`,
      body: 'Make sure you have funds set aside before the due date.',
      href: '/dashboard/bills',
      cta: 'View bills',
    });
  }

  // ── Suggestions (one-time setup nudges) ─────────────────────────────────
  // These only fire on accounts that haven't done the thing — once they do,
  // the advice naturally drops out, no dismiss state required.
  if (!p.hasLinkedAccount && p.transactionCount < 5) {
    advice.push({
      id: 'connect-bank',
      severity: 'suggestion',
      icon: Banknote,
      title: 'Connect your bank',
      body: 'Import the last 90 days automatically — zero manual entry, accurate from day one.',
      href: '/dashboard/import',
      cta: 'Connect bank',
    });
  }
  if (p.budgetCount === 0 && p.transactionCount > 0) {
    advice.push({
      id: 'set-budget',
      severity: 'suggestion',
      icon: Sparkles,
      title: 'Set your first budget',
      body: 'Cap spending in your top categories so the numbers tell you when you’re drifting.',
      href: '/dashboard/budget',
      cta: 'Create budget',
    });
  }
  if (p.transactionCount > 50 && p.reviewQueueCount === 0) {
    // Only suggest auto-categorize once the user has enough transactions
    // for it to be useful — fewer than 50 and it's not a real time saver yet.
    advice.push({
      id: 'auto-categorize',
      severity: 'suggestion',
      icon: Tags,
      title: 'Turn on auto-categorize',
      body: 'Let Barakah label imported transactions for you (Plus). Saves ~5 minutes per import.',
      href: '/dashboard/categorize',
      cta: 'Enable',
    });
  }

  return advice;
}

export function AdviceQueue(props: AdviceQueueProps) {
  const advice = React.useMemo(() => buildAdvice(props), [props]);
  if (advice.length === 0) return null;

  // Cap at 4 — Monarch's queue is short on purpose. The full advice
  // surface (eventually) lives elsewhere; the dashboard is the
  // attention budget.
  const top = advice.slice(0, 4);

  return (
    <section aria-label="Advice" className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Advice
          </p>
          <h2 className="text-base font-bold text-foreground">Prioritized by you</h2>
        </div>
        {advice.length > top.length && (
          <span className="text-xs text-muted-foreground">{advice.length - top.length} more queued</span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {top.map((a) => {
          const tone = SEVERITY_TONE[a.severity];
          const Icon = a.icon;
          return (
            <Link
              key={a.id}
              href={a.href}
              className={`block rounded-2xl border p-4 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tone.container}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tone.iconBg}`}>
                  <Icon className={`w-4 h-4 ${tone.iconFg}`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground leading-snug">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{a.body}</p>
                  <p className={`text-xs font-semibold mt-2 ${tone.iconFg}`}>{a.cta} →</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Marker so consumers can verify the helper logic without invoking the
// full component tree in tests (kept here vs. a separate file because
// the helper is tightly coupled to the props shape).
export const __testables__ = { buildAdvice };
