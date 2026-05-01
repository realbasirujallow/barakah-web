'use client';

import * as React from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

/**
 * R45 (2026-05-01) — Monarch's "Goals: Your top priorities" section.
 *
 * Pulls the user's savings goals (already exposed via
 * /api/savings-goals/list) and shows the top 3 by progress percent
 * with inline progress bars. Each row links into /dashboard/savings
 * for detail / contribution. Hides itself entirely when the user has
 * zero goals — the savings page itself prompts the user to create
 * one, so the dashboard doesn't need to repeat that empty state.
 *
 * Sort logic: "top priorities" = nearest-completion first. Goals at
 * 0% appear last because there's nothing to celebrate yet; goals
 * already at 100% also appear last because the user can mark them
 * complete on the savings page (we don't want to crowd the dashboard
 * with finished goals). Result: middle-progress goals lead.
 */

interface Goal {
  id: number;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  deadline?: number | null;
}

export interface TopPrioritiesProps {
  fmt: (n: number) => string;
}

const CATEGORY_ICON: Record<string, string> = {
  hajj: '🕋',
  umrah: '🌙',
  emergency: '🛡️',
  wedding: '💍',
  education: '🎓',
  home: '🏠',
  car: '🚗',
  travel: '✈️',
  zakat: '🕌',
  sadaqah: '🤲',
  business: '💼',
  retirement: '👴',
  qurbani: '🐑',
};

export function TopPriorities({ fmt }: TopPrioritiesProps) {
  const [goals, setGoals] = React.useState<Goal[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await api.getSavingsGoals();
        if (cancelled) return;
        const list = (result as { goals?: Goal[] })?.goals ?? [];
        setGoals(list);
      } catch {
        // Silent fail — dashboard already has many other widgets and a
        // single goals 500 shouldn't blank the entire page. The user
        // sees the savings link below either way.
        if (!cancelled) setGoals([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (goals === null || goals.length === 0) return null;

  // Score: how close to (but not at) completion. Prefer 50–95% over 100% or 0%.
  const scored = goals
    .map((g) => {
      const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      // Heavy de-prioritization for 0% (untouched) and 100%+ (done).
      const adjusted = pct >= 100 ? -1 : pct === 0 ? 0.5 : pct;
      return { goal: g, pct, adjusted };
    })
    .sort((a, b) => b.adjusted - a.adjusted)
    .slice(0, 3);

  return (
    <section
      aria-label="Top priorities"
      className="bg-card border border-border rounded-2xl p-5 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Your top priorities
          </p>
          <h2 className="text-base font-bold text-foreground">Savings goals</h2>
        </div>
        <Link
          href="/dashboard/savings"
          className="text-xs text-primary font-semibold hover:underline flex-shrink-0"
        >
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {scored.map(({ goal, pct }) => {
          const capped = Math.min(pct, 100);
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const icon = CATEGORY_ICON[goal.category] ?? '🎯';
          return (
            <Link
              key={goal.id}
              href="/dashboard/savings"
              className="block p-3 -mx-3 rounded-lg hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-sm mb-1.5">
                <span className="flex items-center gap-2 min-w-0">
                  <span aria-hidden="true" className="text-base flex-shrink-0">{icon}</span>
                  <span className="font-medium text-foreground truncate">{goal.name}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                  {fmt(goal.currentAmount)} <span className="opacity-60">/ {fmt(goal.targetAmount)}</span>
                </span>
              </div>
              <div className="bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                  style={{ width: `${capped}%` }}
                  aria-valuenow={Math.round(capped)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
                {pct >= 100
                  ? '🎉 Goal reached'
                  : `${capped.toFixed(0)}% · ${fmt(remaining)} to go`}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
