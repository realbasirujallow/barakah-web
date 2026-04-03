'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

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

interface RibaDebt {
  id: number;
  name: string;
  type: string;
  interestRate: number;
  remainingAmount: number;
  lender: string;
}

export default function RibaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if user doesn't have plus or family plan
  if (user && !hasAccess(user.plan, 'plus', user.planExpiresAt)) {
    router.push('/dashboard/billing');
    return null;
  }

  const [result, setResult] = useState<RibaResult | null>(null);
  const [ribaDebts, setRibaDebts] = useState<RibaDebt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.scanRiba(),
      api.getDebts(),
    ]).then(([ribaRes, debtsRes]) => {
      // Handle transaction scan results
      if (ribaRes.status === 'fulfilled') {
        const d = ribaRes.value;
        if (d?.error) { toast(d.error, 'error'); }
        else {
          if (d?.flaggedTransactions && !Array.isArray(d.flaggedTransactions)) d.flaggedTransactions = [];
          setResult(d);
        }
      } else {
        toast('Failed to scan transactions for riba', 'error');
      }

      // Check debts for interest (riba)
      if (debtsRes.status === 'fulfilled') {
        const d = debtsRes.value;
        const debtList = Array.isArray(d?.debts) ? d.debts : Array.isArray(d) ? d : [];
        const interestDebts = debtList.filter(
          (debt: any) => debt.interestRate > 0 && !debt.ribaFree && debt.remainingAmount > 0
        );
        setRibaDebts(interestDebts);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const noTransactions = !result || result.totalScanned === 0;
  const flagged = result?.flaggedCount ?? 0;
  const hasRibaDebts = ribaDebts.length > 0;
  const isClean = (!result || flagged === 0) && !hasRibaDebts;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Riba Detector</h1>

      <div className={`rounded-2xl p-8 text-white mb-6 ${
        noTransactions && !hasRibaDebts
          ? 'bg-gradient-to-r from-gray-500 to-gray-400'
          : isClean
            ? 'bg-gradient-to-r from-green-600 to-emerald-500'
            : 'bg-gradient-to-r from-red-600 to-orange-500'
      }`}>
        <div className="text-center">
          <p className="text-6xl mb-3">{noTransactions && !hasRibaDebts ? '🔍' : isClean ? '✅' : '⚠️'}</p>
          <p className="text-2xl font-bold">
            {noTransactions && !hasRibaDebts ? 'No Data to Scan' : isClean ? 'Riba-Free!' : 'Riba Detected'}
          </p>
          <p className="text-white/80 mt-1">
            {noTransactions && !hasRibaDebts
              ? 'Add transactions or debts to scan for riba (interest)'
              : `${result?.totalScanned || 0} transactions scanned${hasRibaDebts ? ` · ${ribaDebts.length} interest-bearing debt${ribaDebts.length !== 1 ? 's' : ''} found` : ''}`}
          </p>
        </div>

        {!isClean && !noTransactions && result && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-white/70 text-xs">Flagged</p>
              <p className="text-2xl font-bold">{flagged}</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs">Riba Amount</p>
              <p className="text-2xl font-bold">{fmt(result.totalRibaAmount ?? 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs">% of Total</p>
              <p className="text-2xl font-bold">{(result.ribaPercentage ?? 0).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {isClean && !noTransactions && !hasRibaDebts && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 mb-6">
          <strong>Alhamdulillah!</strong> No riba-related transactions or debts were detected in your records.
          Continue to avoid interest-based dealings as commanded in the Quran (2:275).
        </div>
      )}

      {/* ── Interest-bearing debts (riba) ── */}
      {hasRibaDebts && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-3">Interest-Bearing Debts (Riba)</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 mb-4">
            <strong>Warning:</strong> You have {ribaDebts.length} debt{ribaDebts.length !== 1 ? 's' : ''} with interest (riba).
            Interest on loans is prohibited in Islam. Consider refinancing to halal alternatives such as Islamic mortgages (Murabaha),
            Qard Hasan (interest-free loans), or paying off these debts as a priority.
          </div>
          <div className="space-y-3">
            {ribaDebts.map(debt => (
              <div key={debt.id} className="bg-white rounded-xl p-5 border-l-4 border-red-400">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{debt.name}</p>
                    <p className="text-sm text-gray-500">{debt.type.replace(/_/g, ' ')}{debt.lender ? ` · ${debt.lender}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{fmt(debt.remainingAmount)}</p>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                      {debt.interestRate}% interest
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-medium text-green-700 mb-1">Islamic Alternatives</p>
                  <div className="flex flex-wrap gap-1">
                    {debt.type.includes('mortgage') && <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">Murabaha (Islamic Mortgage)</span>}
                    {debt.type.includes('loan') && <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">Qard Hasan (Interest-Free Loan)</span>}
                    {debt.type.includes('credit') && <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">Halal Credit Card (e.g. Safina Bank)</span>}
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">Prioritize paying off this debt</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
