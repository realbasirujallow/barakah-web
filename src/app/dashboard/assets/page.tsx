'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Record<string, unknown>[]>([]);
  const [totals, setTotals] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAssets(), api.getAssetTotal()])
      .then(([a, t]) => { setAssets(a as Record<string, unknown>[]); setTotals(t); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Assets</h1>

      {totals && (
        <div className="bg-gradient-to-r from-[#1B5E20] to-green-600 rounded-2xl p-6 text-white mb-6">
          <p className="text-green-200">Total Wealth</p>
          <p className="text-4xl font-bold">{fmt((totals.totalWealth as number) || 0)}</p>
        </div>
      )}

      <div className="space-y-3">
        {assets.map((a, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{a.name as string}</p>
              <p className="text-sm text-gray-500">{a.type as string}</p>
            </div>
            <p className="text-lg font-bold text-[#1B5E20]">{fmt((a.value as number) || 0)}</p>
          </div>
        ))}
        {assets.length === 0 && <p className="text-center text-gray-400 py-10">No assets yet</p>}
      </div>
    </div>
  );
}
