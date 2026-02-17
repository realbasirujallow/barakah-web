'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface WaqfItem {
  id: number;
  amount: number;
  purpose: string;
  organization: string;
  date: string;
  status: string;
  notes: string;
}

export default function WaqfPage() {
  const [items, setItems] = useState<WaqfItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWaqf().then(d => setItems(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const total = items.reduce((s, i) => s + (i.amount || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const purposes = items.reduce((acc, i) => {
    acc[i.purpose] = (acc[i.purpose] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Waqf Contributions</h1>

      <div className="bg-gradient-to-r from-cyan-700 to-teal-600 rounded-2xl p-8 text-white mb-6">
        <p className="text-cyan-200 mb-1">Total Waqf Contributions</p>
        <p className="text-4xl font-bold">{fmt(total)}</p>
        <p className="text-cyan-200 text-sm mt-2">{items.length} contribution{items.length !== 1 ? 's' : ''} made</p>
      </div>

      {Object.keys(purposes).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">By Purpose</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(purposes).map(([purpose, amount]) => (
              <span key={purpose} className="bg-teal-100 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium">
                {purpose}: {fmt(amount)}
              </span>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{item.organization || item.purpose}</p>
                <p className="text-sm text-gray-500">
                  {item.purpose} • {new Date(item.date).toLocaleDateString()}
                </p>
                {item.notes && <p className="text-xs text-gray-400 mt-1">{item.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#1B5E20]">{fmt(item.amount)}</p>
                {item.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🕌</p>
          <p>No waqf contributions yet. Waqf is a continuous charity (Sadaqah Jariyah).</p>
        </div>
      )}
    </div>
  );
}
