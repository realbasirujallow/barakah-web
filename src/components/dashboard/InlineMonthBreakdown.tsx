// 2026-05-03 (Step 5): in-page drilldown for cash-flow / analytics.
//
// When the user clicks a month bar / quarter bar / year bar / table
// row, instead of routing them to /dashboard/cash-flow?month=X (which
// loses context and reflows the entire page), we expand an inline
// breakdown right below the chart on the SAME page. Mirrors Monarch's
// behavior — "you stay where you are, the detail panel just appears."
//
// Pulls /api/cashflow/breakdown for the selected month (dimension =
// 'category'). Renders three columns: Income / Expenses / Sadaqah-
// Zakat with sortable rows + category bars. The "View full Cash Flow
// →" link at the bottom takes power-users to /dashboard/cash-flow if
// they want the broader view (Sankey / 13-month bars / etc).

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useCurrency } from '../../lib/useCurrency';

type BreakdownRow = {
  key: string;
  label?: string;
  amount: number;
  pct?: number;
};

interface BreakdownResponse {
  income?: BreakdownRow[];
  expenses?: BreakdownRow[];
  sadaqahZakat?: BreakdownRow[];
  totals?: {
    income?: number;
    expenses?: number;
    sadaqahZakat?: number;
    savings?: number;
  };
}

function monthLong(yyyyMM: string): string {
  if (!yyyyMM || yyyyMM.length < 7) return yyyyMM;
  const y = parseInt(yyyyMM.slice(0, 4), 10);
  const m = parseInt(yyyyMM.slice(5, 7), 10);
  // timeZone:'UTC' avoids the off-by-one render where Date.UTC anchors
  // midnight UTC and toLocaleDateString defaults to local TZ. Same fix
  // we made on cash-flow/page.tsx.
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface InlineMonthBreakdownProps {
  /** YYYY-MM key. When null/empty the panel renders nothing. */
  month: string;
  /** Called when the user taps the close (×) button. */
  onClose?: () => void;
}

export function InlineMonthBreakdown({ month, onClose }: InlineMonthBreakdownProps) {
  const { fmt } = useCurrency();
  const [data, setData] = useState<BreakdownResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!month) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.getCashflowBreakdown(month, 'category')
      .then((d: unknown) => {
        if (cancelled) return;
        setData(d as BreakdownResponse);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load breakdown');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [month]);

  const totals = data?.totals ?? {};
  const income = totals.income ?? 0;
  const expenses = totals.expenses ?? 0;
  // Backend returns expenses INCLUSIVE of sadaqah/zakat as of 2026-05-04
  // (founder feedback: "charity/sadaqah/zakat taken out should be an
  // expense"). Savings is therefore just income − expenses; no extra
  // sadaqah subtraction.
  const savings = totals.savings ?? (income - expenses);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const sections = useMemo(() => ([
    { title: 'Income',           tone: 'income',   rows: data?.income ?? [],       total: totals.income ?? 0 },
    { title: 'Expenses',         tone: 'expense',  rows: data?.expenses ?? [],     total: totals.expenses ?? 0 },
    { title: 'Sadaqah / Zakat',  tone: 'sadaqah',  rows: data?.sadaqahZakat ?? [], total: totals.sadaqahZakat ?? 0 },
  ]), [data, totals.income, totals.expenses, totals.sadaqahZakat]);

  if (!month) return null;

  return (
    <section className="bg-card rounded-2xl border border-border p-5 mt-4">
      {/* Header — month + close button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Selected Period</p>
          <p className="text-xl font-bold text-foreground">{monthLong(month)}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close breakdown"
            className="text-gray-500 hover:text-gray-800 transition rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            ×
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Loading breakdown…
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* 4-stat KPI strip — Income / Expenses / Savings / Savings Rate */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <Stat label="Income"        value={fmt(income)}     dotClass="bg-emerald-600" valueClass="text-emerald-700" />
            <Stat label="Expenses"      value={fmt(expenses)}   dotClass="bg-rose-600"    valueClass="text-rose-700" />
            <Stat label="Total savings" value={fmt(savings)}    dotClass="bg-slate-700"   valueClass="text-foreground" />
            <Stat label="Savings rate"  value={`${savingsRate}%`} dotClass="bg-amber-500" valueClass={savingsRate >= 20 ? 'text-emerald-700' : 'text-foreground'} />
          </div>

          {/* Income / Expenses / Sadaqah three-column breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {sections.map(s => (
              <BreakdownColumn
                key={s.title}
                title={s.title}
                tone={s.tone as 'income' | 'expense' | 'sadaqah'}
                rows={s.rows}
                total={s.total}
                fmt={fmt}
                month={month}
              />
            ))}
          </div>

          {/* Footer — link to full Cash Flow page for power-users */}
          <div className="mt-4 pt-4 border-t border-border text-right">
            <Link
              href={`/dashboard/cash-flow?month=${month}`}
              className="text-sm text-primary font-semibold hover:underline"
            >
              View full Cash Flow →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ label, value, dotClass, valueClass }: {
  label: string;
  value: string;
  dotClass: string;
  valueClass: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} aria-hidden="true" />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className={`text-xl font-bold tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function BreakdownColumn({ title, tone, rows, total, fmt, month }: {
  title: string;
  tone: 'income' | 'expense' | 'sadaqah';
  rows: BreakdownRow[];
  total: number;
  fmt: (n: number) => string;
  month: string;
}) {
  const colorClass =
    tone === 'income'   ? 'text-emerald-700' :
    tone === 'expense'  ? 'text-rose-700' :
                          'text-amber-700';
  const barClass =
    tone === 'income'   ? 'bg-emerald-500' :
    tone === 'expense'  ? 'bg-rose-500' :
                          'bg-amber-500';

  if (rows.length === 0) {
    return (
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
        <p className="text-xs text-muted-foreground italic py-3">
          No {tone === 'sadaqah' ? 'charity given' : tone} this month.
        </p>
      </div>
    );
  }

  const maxAmount = Math.max(...rows.map(r => r.amount));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className={`text-sm font-bold tabular-nums ${colorClass}`}>{fmt(total)}</p>
      </div>
      <ul className="space-y-1.5">
        {rows.map(row => {
          const widthPct = maxAmount > 0 ? (row.amount / maxAmount) * 100 : 0;
          const href = `/dashboard/transactions?category=${encodeURIComponent(row.key)}&month=${encodeURIComponent(month)}`;
          return (
            <li key={row.key}>
              <Link
                href={href}
                className="block py-1.5 hover:bg-accent/40 rounded transition"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="capitalize text-foreground">{(row.label ?? row.key).replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-foreground tabular-nums">{fmt(row.amount)}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-1">
                  <div className={`h-1 rounded-full ${barClass}`} style={{ width: `${widthPct}%` }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
