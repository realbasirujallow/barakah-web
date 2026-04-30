'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Phase 6.4 (Apr 27 2026) — activation checklist for new users.
 *
 * Monarch / Rocket Money / Empower all surface a persistent "Getting
 * started" widget on the dashboard until the user has completed
 * onboarding milestones (link bank, add transaction, set goal, etc.).
 * This is that widget.
 *
 * Inputs are 100% read from props — the widget doesn't fetch anything
 * itself, so the parent dashboard page can derive completion state
 * from whatever data it already has loaded:
 *   - hasConnectedBank   — netWorthMini.totalAssets > 0 OR Plaid item exists
 *   - hasTransactions    — recentTransactions.totalCount > 0
 *   - hasZakatMethod     — fiqh config has a selected madhab
 *   - hasSavingsGoal     — savings list non-empty
 *   - hasInvitedFamily   — family member count > 1 (only for Family plan)
 *
 * Auto-dismisses when ALL items are checked. The parent passes
 * `completedAll` once it computes that all are true.
 */

export interface GettingStartedItem {
  id: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
}

export interface GettingStartedChecklistProps {
  items: GettingStartedItem[];
  /** Optional dismiss handler — if omitted, the user can't manually
   *  hide the widget (it auto-disappears when all items are done). */
  onDismiss?: () => void;
  className?: string;
}

export function GettingStartedChecklist({
  items,
  onDismiss,
  className,
}: GettingStartedChecklistProps) {
  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  // Hide entirely once everything is done.
  if (doneCount === totalCount) return null;

  return (
    <Card className={cn('mb-5 py-0 overflow-hidden', className)}>
      <CardContent className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Get the most out of Barakah
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doneCount} of {totalCount} steps complete
            </p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss getting-started checklist"
              className="text-muted-foreground hover:text-foreground text-sm leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="bg-muted rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct}% of getting-started steps complete`}
          />
        </div>

        {/* Steps */}
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  item.done
                    ? 'opacity-60 hover:opacity-80'
                    : 'hover:bg-accent',
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0',
                    item.done
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border bg-card',
                  )}
                  aria-hidden="true"
                >
                  {item.done && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    item.done ? 'line-through text-muted-foreground' : 'text-foreground',
                  )}>
                    {item.label}
                  </p>
                  {!item.done && (
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  )}
                </div>
                {!item.done && (
                  <span className="text-xs text-primary font-medium flex-shrink-0" aria-hidden="true">
                    →
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
