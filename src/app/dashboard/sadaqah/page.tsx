'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface SadaqahItem {
  id: number;
  amount: number;
  recipient: string;
  category: string;
  date: string;
  notes: string;
  recurring: boolean;
}

interface SadaqahStats {
  totalDonated: number;
  donationCount: number;
  thisMonthTotal: number;
  topCategory: string;
}

export default function SadaqahPage() {
  const [items, setItems] = useState<SadaqahItem[]>([]);
  const [stats, setStats] = useState<SadaqahStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSadaqah(), api.getSadaqahStats()])
      .then(([d, s]) => { setItems(d); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Sadaqah Tracker</h1>

      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-8 text-white mb-6">
        <p className="text-teal-100 mb-1">Total Donated</p>
        <p className="text-4xl font-bold">{fmt(stats?.totalDonated || 0)}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-teal-200 text-xs">Donations</p>
            <p className="text-xl font-semibold">{stats?.donationCount || 0}</p>
          </div>
          <div>
            <p className="text-teal-200 text-xs">This Month</p>
            <p className="text-xl font-semibold">{fmt(stats?.thisMonthTotal || 0)}</p>
          </div>
          <div>
            <p className="text-teal-200 text-xs">Top Category</p>
            <p className="text-xl font-semibold">{stats?.topCategory || 'N/A'}</p>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{item.recipient}</p>
                <p className="text-sm text-gray-500">
                  {item.category} • {new Date(item.date).toLocaleDateString()}
                  {item.recurring && <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">Recurring</span>}
                </p>
                {item.notes && <p className="text-xs text-gray-400 mt-1">{item.notes}</p>}
              </div>
              <p className="text-lg font-bold text-[#1B5E20]">{fmt(item.amount)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💝</p>
          <p>No sadaqah recorded yet. Every act of kindness is sadaqah.</p>
        </div>
      )}
    </div>
  );
}
