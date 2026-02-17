'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function DebtsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDebts().then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const debts = (data?.debts as Record<string, unknown>[]) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Debt Tracker</h1>

      {(data?.hasRibaWarning as boolean) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
          ⚠️ You have {data?.ribaDebtsCount as number} interest-bearing debt(s). Consider switching to Islamic financing.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-500 text-white rounded-xl p-4">
          <p className="text-red-100 text-sm">Total Debt</p>
          <p className="text-2xl font-bold">{fmt((data?.totalDebt as number) || 0)}</p>
        </div>
        <div className="bg-orange-500 text-white rounded-xl p-4">
          <p className="text-orange-100 text-sm">Monthly Payment</p>
          <p className="text-2xl font-bold">{fmt((data?.totalMonthlyPayment as number) || 0)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {debts.map((d, i) => {
          const pct = (d.paidPercentage as number) || 0;
          return (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {d.name as string}
                    {d.ribaFree ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Halal</span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Riba</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{d.type as string} {d.lender ? `• ${d.lender}` : ''}</p>
                </div>
                <p className="font-bold text-red-500">{fmt((d.remainingAmount as number) || 0)}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-[#1B5E20]" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{pct.toFixed(1)}% paid</p>
            </div>
          );
        })}
        {debts.length === 0 && <p className="text-center text-gray-400 py-10">Alhamdulillah! No debts</p>}
      </div>
    </div>
  );
}
