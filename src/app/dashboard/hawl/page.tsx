'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface HawlItem {
  id: number;
  assetName: string;
  assetType: string;
  currentValue: number;
  startDate: string;
  hawlDate: string;
  daysRemaining: number;
  hawlComplete: boolean;
  zakatDue: number;
}

export default function HawlPage() {
  const [items, setItems] = useState<HawlItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHawl().then(d => setItems(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const complete = items.filter(i => i.hawlComplete);
  const pending = items.filter(i => !i.hawlComplete);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Hawl Tracker</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">Total Assets</p>
          <p className="text-2xl font-bold text-[#1B5E20]">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">Hawl Complete</p>
          <p className="text-2xl font-bold text-emerald-600">{complete.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
        </div>
      </div>

      {complete.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-emerald-700 mb-3">✅ Hawl Complete — Zakat Due</h2>
          <div className="space-y-3">
            {complete.map(item => (
              <div key={item.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[#1B5E20]">{item.assetName}</p>
                  <p className="text-sm text-gray-600">{item.assetType} • Value: {fmt(item.currentValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Zakat Due</p>
                  <p className="text-lg font-bold text-amber-600">{fmt(item.zakatDue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-amber-700 mb-3">⏳ Pending Hawl</h2>
          <div className="space-y-3">
            {pending.map(item => {
              const progress = Math.max(0, ((354 - item.daysRemaining) / 354) * 100);
              return (
                <div key={item.id} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-[#1B5E20]">{item.assetName}</p>
                      <p className="text-sm text-gray-600">{item.assetType} • {fmt(item.currentValue)}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                      {item.daysRemaining} days left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#1B5E20] h-2 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Started: {new Date(item.startDate).toLocaleDateString()} → Hawl: {new Date(item.hawlDate).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>No assets being tracked. Add assets to start tracking Hawl.</p>
        </div>
      )}
    </div>
  );
}
