'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Beneficiary {
  id: number;
  name: string;
  relationship: string;
  sharePercentage: number;
  notes: string;
}

interface WasiyyahData {
  beneficiaries: Beneficiary[];
  lastUpdated: string;
  totalShareAllocated: number;
}

export default function WasiyyahPage() {
  const [data, setData] = useState<WasiyyahData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWasiyyah().then(d => {
      if (Array.isArray(d)) {
        const total = d.reduce((sum: number, b: Beneficiary) => sum + (b.sharePercentage || 0), 0);
        setData({ beneficiaries: d, lastUpdated: '', totalShareAllocated: total });
      } else {
        setData(d);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const beneficiaries = data?.beneficiaries || [];
  const totalShare = data?.totalShareAllocated || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Wasiyyah (Islamic Will)</h1>

      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-2xl p-8 text-white mb-6">
        <p className="text-purple-200 mb-1">Total Share Allocated</p>
        <p className="text-4xl font-bold">{totalShare.toFixed(1)}%</p>
        <p className="text-purple-200 text-sm mt-2">
          {totalShare <= 33.3
            ? '✅ Within the recommended 1/3 maximum for non-heirs'
            : '⚠️ Exceeds the recommended 1/3 limit (Sunnah guideline)'}
        </p>
        <div className="w-full bg-purple-900/40 rounded-full h-3 mt-4">
          <div
            className={`h-3 rounded-full ${totalShare <= 33.3 ? 'bg-green-400' : 'bg-red-400'}`}
            style={{ width: `${Math.min(totalShare, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-purple-300 mt-1">
          <span>0%</span><span>33.3% (1/3)</span><span>100%</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
        <strong>Islamic Guidance:</strong> The Prophet ﷺ advised Sa'd ibn Abi Waqqas: "One-third, and one-third is a lot." (Bukhari & Muslim)
        Wasiyyah for non-heirs should not exceed one-third of total estate.
      </div>

      {beneficiaries.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Beneficiaries</h2>
          {beneficiaries.map(b => (
            <div key={b.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{b.name}</p>
                <p className="text-sm text-gray-500">{b.relationship}</p>
                {b.notes && <p className="text-xs text-gray-400 mt-1">{b.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{b.sharePercentage}%</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📜</p>
          <p>No wasiyyah entries yet. Planning your estate is a Sunnah.</p>
        </div>
      )}
    </div>
  );
}
