'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Phase 6.2 (Apr 27 2026) — period picker for KPI rows.
 *
 * Monarch / Rocket Money / Empower all let the user toggle a
 * 30-day / 90-day / YTD / 1y view above their summary cards. This
 * is the same pattern: a small group of segmented buttons rendered
 * as `role=tablist`/`role=tab` for screen-reader correctness.
 *
 * Pure UI — no data fetching. Wire it up by reading `value` and
 * passing it to whatever endpoint produces the KPI data
 * (e.g. /api/dashboard/widgets?period=30d).
 */

export type Period = '7d' | '30d' | '90d' | 'ytd' | '1y' | 'all';

const DEFAULT_OPTIONS: Array<{ value: Period; label: string }> = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: 'ytd', label: 'YTD' },
  { value: '1y', label: '1Y' },
];

export interface PeriodPickerProps {
  value: Period;
  onChange: (next: Period) => void;
  options?: Array<{ value: Period; label: string }>;
  className?: string;
}

export function PeriodPicker({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
}: PeriodPickerProps) {
  return (
    <div
      role="tablist"
      aria-label="Select reporting period"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-2.5 py-1 rounded text-xs font-medium tabular-nums transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
