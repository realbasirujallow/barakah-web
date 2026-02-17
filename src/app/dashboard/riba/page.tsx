'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface RibaFlag {
  transactionId: number;
  description: string;
  amount: number;
  date: string;
  ribaType: string;
  riskLevel: string;
  riskScore: number;
  flagDetails: string[];
  islamicAlternatives: string[];
}

interface RibaResult {
  totalScanned: number;
  flaggedCount: number;
  totalRibaAmount: number;
  ribaPercentage: number;
  flaggedTransactions: RibaFlag[];
}

export default function RibaPage() {
  const [result, setResult] = useState<RibaResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.scanRiba().then(d => setResult(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const isClean = !result || result.flaggedCount === 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Riba Detector</h1>

      <div className={`rounded-2xl p-8 text-white mb-6 ${isClean ? 'bg-gradient-to-r from-green-600 to-emerald-500' : 'bg-gradient-to-r from-red-600 to-orange-500'}`}>
        <div className="text-center">
          <p className="text-6xl mb-3">{isClean ? '✅' : '⚠️'}</p>
          <p className="text-2xl font-bold">{isClean ? 'Riba-Free!' : 'Riba Detected'}</p>
          <p className="text-white/80 mt-1">
            {result?.totalScanned || 0} transactions scanned
          </p>
        </div>

        {!isClean && result && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-white/70 text-xs">Flagged</p>
              <p className="text-2xl font-bold">{result.flaggedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs">Riba Amount</p>
              <p className="text-2xl font-bold">{fmt(result.totalRibaAmount)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs">% of Total</p>
              <p className="text-2xl font-bold">{result.ribaPercentage.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {isClean && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 mb-6">
          <strong>Alhamdulillah!</strong> No riba-related transactions were detected in your records.
          Continue to avoid interest-based dealings as commanded in the Quran (2:275).
        </div>
      )}

      {result && result.flaggedTransactions && result.flaggedTransactions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-red-700">Flagged Transactions</h2>
          {result.flaggedTransactions.map(tx => (
            <div key={tx.transactionId} className="bg-white rounded-xl p-5 border-l-4 border-red-400">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{tx.description}</p>
                  <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{fmt(tx.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tx.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                    tx.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tx.riskLevel} • Score: {tx.riskScore}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Why Flagged</p>
                <div className="flex flex-wrap gap-1">
                  {tx.flagDetails?.map((d, i) => (
                    <span key={i} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded">{d}</span>
                  ))}
                </div>
              </div>

              {tx.islamicAlternatives && tx.islamicAlternatives.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Islamic Alternatives</p>
                  <div className="flex flex-wrap gap-1">
                    {tx.islamicAlternatives.map((a, i) => (
                      <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Quran 2:275:</strong> &quot;Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan...&quot;
      </div>
    </div>
  );
}
