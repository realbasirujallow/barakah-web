'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { CategoryIcon } from '../../../lib/categoryIcon';

interface RecurringTx {
  id: number;
  description: string;
  amount: number;
  category: string;
  type: string;
  date: number;
  recurring: boolean;
  recurringActive: boolean;
  frequency?: string;
}

// Phase 24f (2026-04-30): emoji map removed in favour of the
// centralized <CategoryIcon /> Lucide component (lib/categoryIcon.tsx).
// Cross-platform consistent rendering, brand-coloured icons per category,
// no duplication across the recurring/notifications/summary/etc pages.

function formatDate(epoch: number) {
  const ms = epoch < 1e12 ? epoch * 1000 : epoch;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * 2026-05-02 (Monarch parity): one of the three header pillars on the
 * Recurring page. Shows count, total, and a thin progress bar.
 * Visual reference: Monarch's `/recurring` 3-pillar header.
 */
function PillarCard({
  label, count, total, fmt, color, labelTotal, foot,
}: {
  label: string;
  count: number;
  total: number;
  fmt: (n: number) => string;
  color: 'emerald' | 'rose' | 'slate';
  labelTotal: string;
  foot: string;
}) {
  const colors = {
    emerald: { dot: 'bg-emerald-600', bar: 'bg-emerald-500', amt: 'text-emerald-700 dark:text-emerald-400' },
    rose: { dot: 'bg-rose-600', bar: 'bg-rose-500', amt: 'text-rose-700 dark:text-rose-400' },
    slate: { dot: 'bg-slate-700 dark:bg-slate-300', bar: 'bg-slate-500', amt: 'text-foreground' },
  }[color];
  // The progress bar shows count visually (we don't have a paid/remaining
  // split for our data model the way Monarch does for cleared statements,
  // so we render proportional density: full bar means there are recurring
  // rows in this pillar, empty means none).
  const pct = count > 0 ? 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
        </div>
        <p className={`text-sm font-bold tabular-nums ${colors.amt}`}>{fmt(total)}</p>
      </div>
      <div className="relative h-1.5 bg-muted/50 rounded-full overflow-hidden mb-1.5">
        <div
          className={`absolute inset-y-0 left-0 ${colors.bar} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{labelTotal}</span>
        <span>{foot}</span>
      </div>
    </div>
  );
}

// Defined outside RecurringPage to avoid recreating the component type on every render.
// Recreating causes React to unmount/remount on each parent re-render, losing focus/state.
interface TxRowProps {
  tx: RecurringTx;
  fmt: (v: number) => string;
  toggling: number | null;
  onToggle: (id: number) => void;
}
function TxRow({ tx, fmt, toggling, onToggle }: TxRowProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${!tx.recurringActive ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <CategoryIcon category={tx.category} className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{tx.description || 'No description'}</p>
          <p className="text-xs text-gray-500 capitalize">
            {tx.category} • Last: {formatDate(tx.date)}
            {tx.frequency && <span className="ml-1">• {tx.frequency}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {tx.type === 'income' ? '+' : '-'}{fmt(Math.abs(tx.amount))}
        </p>
        <button
          onClick={() => onToggle(tx.id)}
          disabled={toggling === tx.id}
          title={tx.recurringActive ? 'Pause recurring' : 'Resume recurring'}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
            tx.recurringActive ? 'bg-primary' : 'bg-gray-300'
          } disabled:opacity-60`}
        >
          <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
            tx.recurringActive ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
}

export default function RecurringPage() {
  const [transactions, setTransactions] = useState<RecurringTx[]>([]);
  const [loading, setLoading]           = useState(true);
  const [processing, setProcessing]     = useState(false);
  const [toggling, setToggling]         = useState<number | null>(null);
  const { toast } = useToast();
  const { fmt } = useCurrency();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRecurringTransactions();
      setTransactions(data?.transactions || data || []);
    } catch {
      toast('Failed to load recurring transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  const handleToggle = async (id: number) => {
    setToggling(id);
    try {
      await api.toggleRecurring(id);
      await load();
      toast('Recurring status updated', 'success');
    } catch {
      toast('Failed to update recurring status', 'error');
    } finally {
      setToggling(null);
    }
  };

  const handleProcessNow = async () => {
    setProcessing(true);
    try {
      const result = await api.processRecurring();
      const count = result?.processedCount ?? result?.processed ?? 0;
      toast(`Processed ${count} recurring transaction${count !== 1 ? 's' : ''}`, 'success');
      await load();
    } catch {
      toast('Failed to process recurring transactions', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const active   = transactions.filter(t => t.recurringActive);
  const inactive = transactions.filter(t => !t.recurringActive);

  const monthlyImpact = active.reduce((sum, t) => {
    const amt = t.type === 'income' ? t.amount : -t.amount;
    return sum + amt;
  }, 0);

  // 2026-05-02 (Monarch parity): 3-pillar header — Income / Expenses /
  // Credit cards. Recurring transactions don't have a "credit card" tag
  // in our data model, so we approximate it as the subset of expenses
  // that match Monarch's credit-card patterns (description includes
  // "credit", "card", "card payment", "minimum payment", "statement").
  // Where the heuristic doesn't fire, those rows fall back into the
  // Expenses pillar — which is correct in Monarch too.
  const isCreditCardLike = (t: RecurringTx) => {
    if (t.type === 'income') return false;
    const blob = `${t.description ?? ''} ${t.category ?? ''}`.toLowerCase();
    return /\b(credit\s*card|card\s*payment|minimum\s*payment|statement|amex|chase\s*card|capital\s*one)\b/.test(blob);
  };
  const incomeTxs = active.filter(t => t.type === 'income');
  const ccTxs = active.filter(isCreditCardLike);
  const expenseTxs = active.filter(t => t.type !== 'income' && !isCreditCardLike(t));
  const sumAbs = (rows: RecurringTx[]) => rows.reduce((s, r) => s + Math.abs(r.amount), 0);
  const incomeTotal = sumAbs(incomeTxs);
  const expenseTotal = sumAbs(expenseTxs);
  const ccTotal = sumAbs(ccTxs);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Recurring"
        subtitle="Income, expenses, and credit-card payments that repeat each period."
        actions={
          <button
            onClick={handleProcessNow}
            disabled={processing || active.length === 0}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 font-medium"
          >
            {processing ? 'Processing...' : '▶ Process Now'}
          </button>
        }
      />

      {/* 2026-05-03 (Monarch parity, second pass): orange "review now"
          banner surfacing paused recurring patterns. Monarch's recurring
          page lights up an orange strip whenever there are merchants
          the user hasn't actioned ("There are 13 new recurring merchants
          and accounts for you to review."). We don't have a separate
          "detected but unconfirmed" inbox yet, so the banner pulls
          double duty for inactive (paused) recurring rows — same
          behaviour shape: count + CTA that scrolls to the relevant
          section. Hidden when there's nothing to review.
          Visual reference: monarch-walkthrough.mov frame f_035. */}
      {inactive.length > 0 && (
        <a
          href="#paused-recurring"
          className="flex items-center justify-between gap-3 bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-xl px-4 py-3 mb-4 transition shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm" aria-hidden="true">
              {inactive.length}
            </span>
            <span className="text-sm font-medium truncate">
              {inactive.length === 1
                ? 'You have 1 paused recurring transaction to review'
                : `You have ${inactive.length} paused recurring transactions to review`}
            </span>
          </div>
          <span className="text-sm font-semibold underline-offset-2 hover:underline whitespace-nowrap">
            Review now →
          </span>
        </a>
      )}

      {/* Monarch-parity 3-pillar header card.
          Income · Expenses · Credit cards. Each pillar shows the count
          of recurring rows ("X / Y statements"-style label), the
          received-vs-remaining split, and a thin progress bar.
          Visual reference: marketing/Monarch Screenshots screenshot
          captured 2026-05-01 22:36. */}
      {transactions.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PillarCard
              label="Income"
              count={incomeTxs.length}
              total={incomeTotal}
              fmt={fmt}
              color="emerald"
              labelTotal={`${fmt(incomeTotal)} expected`}
              foot={`${incomeTxs.length} recurring source${incomeTxs.length === 1 ? '' : 's'}`}
            />
            <PillarCard
              label="Expenses"
              count={expenseTxs.length}
              total={expenseTotal}
              fmt={fmt}
              color="rose"
              labelTotal={`${fmt(expenseTotal)} expected`}
              foot={`${expenseTxs.length} recurring expense${expenseTxs.length === 1 ? '' : 's'}`}
            />
            <PillarCard
              label="Credit cards"
              count={ccTxs.length}
              total={ccTotal}
              fmt={fmt}
              color="slate"
              labelTotal={ccTotal > 0 ? `${fmt(ccTotal)} due` : 'No card payments'}
              foot={`${ccTxs.length} recurring card payment${ccTxs.length === 1 ? '' : 's'}`}
            />
          </div>
          {/* Net monthly impact strip */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Monthly impact</p>
            <p className={`text-base font-bold tabular-nums ${monthlyImpact >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {monthlyImpact >= 0 ? '+' : ''}{fmt(monthlyImpact)}
            </p>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-800">
        <p className="font-semibold mb-1">📌 How recurring works</p>
        <p>Transactions marked as recurring are replicated automatically each period. Toggle the switch to pause or resume any recurring entry. Use <strong>Process Now</strong> to manually trigger all active recurring entries.</p>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-primary">Active ({active.length})</h2>
            <span className="text-xs text-gray-400">Toggle to pause</span>
          </div>
          {active.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} toggling={toggling} onToggle={handleToggle} />)}
        </div>
      )}

      {/* Paused */}
      {inactive.length > 0 && (
        <div id="paused-recurring" className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden scroll-mt-6">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-500">Paused ({inactive.length})</h2>
          </div>
          {inactive.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} toggling={toggling} onToggle={handleToggle} />)}
        </div>
      )}

      {transactions.length === 0 && (
        <EmptyState
          illustration="receipt"
          title="No recurring transactions yet"
          description="Mark a transaction as recurring on the Transactions page and Barakah will detect future instances automatically."
          actions={[
            { label: 'Open transactions', href: '/dashboard/transactions', primary: true },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { name: 'Netflix', cat: 'Subscriptions', cycle: 'Monthly · $15.49' },
                { name: 'Gym membership', cat: 'Health', cycle: 'Monthly · $39.00' },
                { name: 'iCloud storage', cat: 'Subscriptions', cycle: 'Monthly · $2.99' },
              ].map((r) => (
                <div key={r.name} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-700">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.cat}</p>
                  </div>
                  <span className="text-xs text-gray-500">{r.cycle}</span>
                </div>
              ))}
            </div>
          }
        />
      )}
    </div>
  );
}
