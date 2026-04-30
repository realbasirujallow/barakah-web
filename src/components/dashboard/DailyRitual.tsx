'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle, ArrowRight, CalendarClock, Check,
  CheckCircle2, Coins, FileText, Wallet, type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Phase 11 (Apr 30 2026) — "Daily Ritual" card.
 *
 * Third-party UX audit (Apr 30) recommended Barakah teach a 2-minute
 * habit instead of dumping the operating system on first paint. This
 * is that habit:
 *
 *   1. What needs my attention right now?
 *   2. How is the month going?
 *   3. Is my Islamic finance status okay?
 *
 * Surfaces up to 3 personalized callouts derived from the data the
 * dashboard already has loaded — no new endpoints, no extra fetches.
 *
 * Items are ranked by severity then importance:
 *   • critical  — past-due bills, hawl past due (red)
 *   • warning   — hawl due now, over-budget, transactions needing review (amber)
 *   • info      — zakat-eligible cue, fresh insight (teal)
 *
 * Auto-hides when there is nothing actionable AND the user already
 * has data — no point taking up real estate to say "all clear."
 */

export type RitualSeverity = 'critical' | 'warning' | 'info';

export interface RitualItem {
  id: string;
  severity: RitualSeverity;
  icon: LucideIcon;
  title: string;
  body: string;
  cta: { label: string; href: string };
}

export interface DailyRitualProps {
  items: RitualItem[];
  /** Optional className passthrough. */
  className?: string;
}

const severityToneClass: Record<RitualSeverity, string> = {
  critical: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
  warning:  'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-400',
  info:     'bg-primary/5 border-primary/20 text-primary',
};

const severityIconBg: Record<RitualSeverity, string> = {
  critical: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  warning:  'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  info:     'bg-primary/10 text-primary',
};

export function DailyRitual({ items, className }: DailyRitualProps) {
  if (items.length === 0) return null;

  const ritualLabel = items.length === 1
    ? '1 thing to look at today'
    : `${items.length} things to look at today`;

  return (
    <Card className={cn('mb-5 py-0 overflow-hidden', className)}>
      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {ritualLabel}
          </h2>
        </div>

        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                  severityToneClass[item.severity],
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0',
                    severityIconBg[item.severity],
                  )}
                  aria-hidden="true"
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.body}</p>
                </div>
                <Link
                  href={item.cta.href}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 flex-shrink-0 px-2 py-1 rounded-md hover:bg-background/40 transition-colors"
                  aria-label={`${item.cta.label} — ${item.title}`}
                >
                  <span>{item.cta.label}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

/**
 * Build the ritual items from data the dashboard already has loaded.
 * Caps at 3 items, rank-ordered: all `critical` first, then `warning`,
 * then `info`. Stable insertion order within a tier.
 */
export interface BuildRitualInput {
  hawlDue: { dueCount: number; upcomingCount: number } | null;
  zakatEligible: boolean | undefined;
  zakatFullyPaid: boolean | undefined;
  zakatDue: number | undefined;
  budget: { totalRemaining: number; totalBudgeted: number } | null;
  bills: { overdueCount: number; upcomingCount: number } | null;
  reviewCount: number;
  insights: Array<{ severity: string; title: string; body: string }>;
  fmt: (n: number) => string;
}

export function buildRitualItems({
  hawlDue,
  zakatEligible,
  zakatFullyPaid,
  zakatDue,
  budget,
  bills,
  reviewCount,
  insights,
  fmt,
}: BuildRitualInput): RitualItem[] {
  const all: RitualItem[] = [];

  // ── critical ────────────────────────────────────────────────────────
  if (bills && bills.overdueCount > 0) {
    all.push({
      id: 'bills-overdue',
      severity: 'critical',
      icon: AlertCircle,
      title: bills.overdueCount === 1 ? '1 bill past due' : `${bills.overdueCount} bills past due`,
      body: 'Pay now to avoid late fees',
      cta: { label: 'View bills', href: '/dashboard/bills' },
    });
  }

  // ── warning ─────────────────────────────────────────────────────────
  if (hawlDue && hawlDue.dueCount > 0) {
    all.push({
      id: 'hawl-due',
      severity: 'warning',
      icon: CalendarClock,
      title: hawlDue.dueCount === 1
        ? '1 asset reached its zakat anniversary'
        : `${hawlDue.dueCount} assets reached their zakat anniversary`,
      body: 'Calculate and pay zakat for the lunar year',
      cta: { label: 'Open zakat', href: '/dashboard/zakat' },
    });
  }

  if (reviewCount > 0) {
    all.push({
      id: 'tx-review',
      severity: 'warning',
      icon: FileText,
      title: reviewCount === 1
        ? '1 transaction needs review'
        : `${reviewCount} transactions need review`,
      body: 'Confirm category or flag as needs investigation',
      cta: { label: 'Review', href: '/dashboard/transactions?filter=needs_review' },
    });
  }

  if (budget && budget.totalBudgeted > 0 && budget.totalRemaining < 0) {
    all.push({
      id: 'budget-over',
      severity: 'warning',
      icon: Wallet,
      title: `Over budget by ${fmt(Math.abs(budget.totalRemaining))} this month`,
      body: 'Adjust limits or trim discretionary spending',
      cta: { label: 'View budget', href: '/dashboard/budget' },
    });
  }

  // ── info ────────────────────────────────────────────────────────────
  if (zakatEligible && !zakatFullyPaid && zakatDue && zakatDue > 0) {
    all.push({
      id: 'zakat-eligible',
      severity: 'info',
      icon: Coins,
      title: `You're eligible to pay ${fmt(zakatDue)} in zakat`,
      body: 'Your wealth is above nisab and the lunar year has passed',
      cta: { label: 'Calculate', href: '/dashboard/zakat' },
    });
  }

  if (hawlDue && hawlDue.dueCount === 0 && hawlDue.upcomingCount > 0) {
    all.push({
      id: 'hawl-upcoming',
      severity: 'info',
      icon: CalendarClock,
      title: hawlDue.upcomingCount === 1
        ? '1 asset reaches zakat anniversary soon'
        : `${hawlDue.upcomingCount} assets reach zakat anniversary soon`,
      body: 'Get ahead — review your zakatable wealth this week',
      cta: { label: 'Open zakat tracker', href: '/dashboard/hawl' },
    });
  }

  // Surface a single fresh non-warning insight as the bottom info item.
  const firstGoodInsight = insights.find(i => i.severity === 'good');
  if (firstGoodInsight) {
    all.push({
      id: `insight-${firstGoodInsight.title.replace(/\W/g, '').slice(0, 16)}`,
      severity: 'info',
      icon: CheckCircle2,
      title: firstGoodInsight.title,
      body: firstGoodInsight.body.slice(0, 70) + (firstGoodInsight.body.length > 70 ? '…' : ''),
      cta: { label: 'Open analytics', href: '/dashboard/analytics' },
    });
  }

  // Rank: critical > warning > info, stable within tier. Cap at 3.
  const rank: Record<RitualSeverity, number> = { critical: 0, warning: 1, info: 2 };
  return all.sort((a, b) => rank[a.severity] - rank[b.severity]).slice(0, 3);
}

/** Optional all-clear cue — render this only when the user has data
 *  AND `buildRitualItems` returned 0 items. */
export function DailyRitualAllClear() {
  return (
    <Card className="mb-5 py-0 overflow-hidden border-emerald-500/20 bg-emerald-500/5">
      <CardContent className="px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex-shrink-0">
            <Check className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">All clear today</p>
            <p className="text-xs text-muted-foreground">No bills past due, no zakat anniversaries, no over-budget categories.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
