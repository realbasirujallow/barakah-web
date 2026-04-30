'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { cn } from '@/lib/utils';

/**
 * Phase 2.4 (Apr 27 2026) — drill-down panel for the dashboard's
 * "Spending This Month" KPI.
 *
 * The founder noticed that clicking the spending widget did nothing — no
 * breakdown, no merchants, no comparison detail. Monarch / Empower /
 * Mint all surface a side panel with category-level detail when you
 * click a top-line metric. This is that surface.
 *
 * Built on shadcn's <Sheet> (slide-in from the right) rather than a
 * full <Dialog> because:
 *   • Keeps the dashboard context visible behind the panel.
 *   • Mobile users get a bottom-sheet feel by default.
 *   • Sheet has built-in focus trap, esc-to-close, and overlay click.
 *
 * Data shape matches the existing `SpendingWidget` returned by
 * `/api/dashboard/widgets` so no backend change is needed:
 *   { thisMonth, lastMonth, income, changePercent, topCategories[] }
 */

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍕', dining: '🍽️', groceries: '🛒', transportation: '🚗', housing: '🏠',
  utilities: '💡', shopping: '🛍️', entertainment: '🎬', subscriptions: '📱',
  healthcare: '🏥', education: '📚', zakat: '🕌', sadaqah: '🤲', income: '💰',
  transfer: '🔄', debt_payment: '💳', personal: '👤', uncategorized: '📋',
};

export interface SpendingDrillDownProps {
  /** Controls open/close. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Already-formatted helper from the parent page (Intl.NumberFormat). */
  fmt: (n: number) => string;
  /** Current spending widget payload, or null while loading. */
  spending: {
    thisMonth: number;
    lastMonth: number;
    income: number;
    changePercent: number;
    topCategories: Array<{ category: string; amount: number }>;
  } | null;
  /** Loading flag from parent (so the panel can mirror the dashboard state). */
  loading?: boolean;
}

export function SpendingDrillDown({
  open,
  onOpenChange,
  fmt,
  spending,
  loading,
}: SpendingDrillDownProps) {
  const monthLabel = React.useMemo(
    () => new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    [],
  );

  const totalCategoryAmount = React.useMemo(() => {
    if (!spending?.topCategories) return 0;
    return spending.topCategories.reduce((sum, c) => sum + c.amount, 0);
  }, [spending]);

  const showMomDelta = spending && spending.lastMonth >= 50;
  const momDelta = spending ? spending.thisMonth - spending.lastMonth : 0;
  const isMomUp = momDelta > 0;
  const isMomDown = momDelta < 0;

  // Phase 6.3: render as a side Sheet on desktop, a bottom Drawer on
  // mobile. iOS / Android users expect modals to come from the bottom
  // (Apple HIG + Material 3 guidance both call this out). We detect via
  // matchMedia(min-width: 768px) — Tailwind's md breakpoint.
  const isDesktop = useIsDesktop();
  const body = (
    <div className="px-4 pb-6 space-y-6">
          {/* ── Top-line totals ─────────────────────────────────────────── */}
          <section>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Total spent this month
            </p>
            <p className="text-3xl font-bold tabular-nums leading-tight mt-1">
              {loading || !spending ? '…' : fmt(spending.thisMonth)}
            </p>
            {showMomDelta && (
              <p className="text-sm mt-2">
                <span className="text-muted-foreground">vs </span>
                <span className="tabular-nums">{fmt(spending!.lastMonth)}</span>
                <span className="text-muted-foreground"> last month — </span>
                <span className={cn(
                  'font-medium',
                  isMomUp && 'text-rose-600 dark:text-rose-400',
                  isMomDown && 'text-emerald-600 dark:text-emerald-400',
                )}>
                  {isMomUp ? '▲' : isMomDown ? '▼' : ''}
                  {' '}
                  {fmt(Math.abs(momDelta))}
                  {' '}
                  ({Math.abs(spending!.changePercent || 0) > 500 ? '500+' : Math.abs(spending!.changePercent || 0).toFixed(1)}%)
                </span>
              </p>
            )}
          </section>

          {/* ── Income vs expenses (if we have income data) ─────────────── */}
          {spending && spending.income > 0 && (
            <>
              <Separator />
              <section className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Income</p>
                  <p className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                    {fmt(spending.income)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Net</p>
                  <p className={cn(
                    'text-xl font-bold tabular-nums mt-1',
                    spending.income - spending.thisMonth >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400',
                  )}>
                    {fmt(spending.income - spending.thisMonth)}
                  </p>
                </div>
              </section>
            </>
          )}

          {/* ── Full category list (not limited to 4) ───────────────────── */}
          {spending && spending.topCategories.length > 0 && (
            <>
              <Separator />
              <section>
                <h3 className="text-sm font-semibold mb-3">Categories</h3>
                <div className="space-y-3">
                  {spending.topCategories.map((cat) => {
                    const pct = totalCategoryAmount > 0
                      ? (cat.amount / totalCategoryAmount) * 100
                      : 0;
                    return (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-2 min-w-0">
                            <span aria-hidden="true">{CATEGORY_ICONS[cat.category] || '📋'}</span>
                            <span className="capitalize truncate">{cat.category.replace(/_/g, ' ')}</span>
                          </span>
                          <span className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-muted-foreground tabular-nums text-xs">
                              {pct.toFixed(0)}%
                            </span>
                            <span className="font-medium tabular-nums">
                              {fmt(cat.amount)}
                            </span>
                          </span>
                        </div>
                        <div className="bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary rounded-full h-1.5 transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ── Empty state ─────────────────────────────────────────────── */}
          {!loading && spending && spending.topCategories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No transactions categorised yet this month.
            </p>
          )}

          {/* ── Footer link ─────────────────────────────────────────────── */}
          <Separator />
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/transactions"
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => onOpenChange(false)}
            >
              View all transactions →
            </Link>
            <Link
              href="/dashboard/summary"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Open full monthly summary
            </Link>
          </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Spending breakdown</SheetTitle>
            <SheetDescription>{monthLabel}</SheetDescription>
          </SheetHeader>
          {body}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Spending breakdown</DrawerTitle>
          <DrawerDescription>{monthLabel}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto">{body}</div>
      </DrawerContent>
    </Drawer>
  );
}
