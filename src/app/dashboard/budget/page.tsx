'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function BudgetPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    api.getBudgets(now.getMonth() + 1, now.getFullYear())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const budgets = (data?.budgets as Record<string, unknown>[]) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Budget Planning</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1B5E20] text-white rounded-xl p-4">
          <p className="text-green-200 text-sm">Total Budget</p>
          <p className="text-2xl font-bold">{fmt((data?.totalBudget as number) || 0)}</p>
        </div>
        <div className="bg-orange-500 text-white rounded-xl p-4">
          <p className="text-orange-100 text-sm">Total Spent</p>
          <p className="text-2xl font-bold">{fmt((data?.totalSpent as number) || 0)}</p>
        </div>
        <div className="bg-teal-600 text-white rounded-xl p-4">
          <p className="text-teal-100 text-sm">Remaining</p>
          <p className="text-2xl font-bold">{fmt((data?.totalRemaining as number) || 0)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {budgets.map((b, i) => {
          const pct = Math.min(((b.percentage as number) || 0), 100);
          const over = (b.overBudget as boolean) || false;
          return (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{b.category as string}</p>
                <p className={`font-bold ${over ? 'text-red-500' : 'text-[#1B5E20]'}`}>
                  {fmt((b.spent as number) || 0)} / {fmt((b.monthlyLimit as number) || 0)}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${over ? 'bg-red-500' : 'bg-[#1B5E20]'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        {budgets.length === 0 && <p className="text-center text-gray-400 py-10">No budgets set</p>}
      </div>
    </div>
  );
}
