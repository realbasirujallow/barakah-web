'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function ZakatPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getZakat().then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Zakat Calculator</h1>

      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-8 text-white mb-6 text-center">
        <p className="text-amber-100 mb-2">Zakat Due (2.5%)</p>
        <p className="text-5xl font-bold">{fmt((data?.zakatDue as number) || 0)}</p>
        <p className="text-amber-200 mt-4 text-sm">
          {data?.zakatEligible ? 'Your wealth exceeds Nisab — Zakat is obligatory' : 'Your wealth is below Nisab threshold'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">Total Wealth</p>
          <p className="text-2xl font-bold text-[#1B5E20]">{fmt((data?.totalWealth as number) || 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">Nisab Threshold</p>
          <p className="text-2xl font-bold text-amber-600">{fmt((data?.nisabThreshold as number) || 5000)}</p>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Reminder:</strong> Zakat is 2.5% of wealth held for one Islamic lunar year (Hawl) above the Nisab threshold.
        Use the Hawl Tracker to track when each asset becomes eligible.
      </div>
    </div>
  );
}
