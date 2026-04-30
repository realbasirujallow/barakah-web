'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';

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

const CAT_ICONS: Record<string, string> = {
  food: '🍽️', transportation: '🚗', shopping: '🛒', utilities: '💡',
  housing: '🏠', healthcare: '🏥', education: '📚', entertainment: '🎬',
  subscription: '📱', charity: '🤲', income: '💰', investment: '📈',
  transfer: '💸', interest: '⚠️', other: '📋',
};

function formatDate(epoch: number) {
  const ms = epoch < 1e12 ? epoch * 1000 : epoch;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
  const catIcon = CAT_ICONS[tx.category] ?? '📋';
  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${!tx.recurringActive ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{catIcon}</span>
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
            tx.recurringActive ? 'bg-[#1B5E20]' : 'bg-gray-300'
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
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  const active   = transactions.filter(t => t.recurringActive);
  const inactive = transactions.filter(t => !t.recurringActive);

  const monthlyImpact = active.reduce((sum, t) => {
    const amt = t.type === 'income' ? t.amount : -t.amount;
    return sum + amt;
  }, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Recurring Transactions"
        subtitle="Manage your automatically-repeating transactions"
        actions={
          <button
            onClick={handleProcessNow}
            disabled={processing || active.length === 0}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2E7D32] disabled:opacity-50 font-medium"
          >
            {processing ? 'Processing...' : '▶ Process Now'}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-gray-500 text-xs">Active</p>
          <p className="text-2xl font-bold text-[#1B5E20]">{active.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-gray-500 text-xs">Paused</p>
          <p className="text-2xl font-bold text-gray-400">{inactive.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-gray-500 text-xs">Monthly Impact</p>
          <p className={`text-xl font-bold ${monthlyImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {monthlyImpact >= 0 ? '+' : ''}{fmt(monthlyImpact)}
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-800">
        <p className="font-semibold mb-1">📌 How recurring works</p>
        <p>Transactions marked as recurring are replicated automatically each period. Toggle the switch to pause or resume any recurring entry. Use <strong>Process Now</strong> to manually trigger all active recurring entries.</p>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-[#1B5E20]">Active ({active.length})</h2>
            <span className="text-xs text-gray-400">Toggle to pause</span>
          </div>
          {active.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} toggling={toggling} onToggle={handleToggle} />)}
        </div>
      )}

      {/* Paused */}
      {inactive.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-500">Paused ({inactive.length})</h2>
          </div>
          {inactive.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} toggling={toggling} onToggle={handleToggle} />)}
        </div>
      )}

      {transactions.length === 0 && (
        <EmptyState
          icon="🔁"
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
