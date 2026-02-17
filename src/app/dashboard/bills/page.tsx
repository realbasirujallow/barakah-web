'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function BillsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBills().then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const bills = (data?.bills as Record<string, unknown>[]) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Bills & Reminders</h1>
      <div className="space-y-3">
        {bills.map((b, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{b.name as string}</p>
              <p className="text-xs text-gray-500">{b.category as string} &bull; {b.frequency as string}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#1B5E20]">{fmt((b.amount as number) || 0)}</p>
              <p className={`text-xs ${b.paid ? 'text-green-500' : 'text-orange-500'}`}>
                {b.paid ? '✓ Paid' : `Due day ${b.dueDay}`}
              </p>
            </div>
          </div>
        ))}
        {bills.length === 0 && <p className="text-center text-gray-400 py-10">No bills added</p>}
      </div>
    </div>
  );
}
