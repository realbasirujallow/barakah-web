'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface PurificationStatus {
  totalRibaDetected: number;
  totalPurified: number;
  remainingToPurify: number;
}

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
  const [purification, setPurification] = useState<PurificationStatus | null>(null);
  const [purifyAmount, setPurifyAmount] = useState('');
  const [purifying, setPurifying] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.scanRiba(),
      api.getDebts(),
      api.getRibaPurificationStatus(),
    ]).then(([ribaRes, debtsRes, purRes]) => {
      // Handle transaction scan results
      if (ribaRes.status === 'fulfilled') {
        const d = ribaRes.value;
        if (d?.error) { toast(d.error, 'error'); }
        else {
          // Map backend field names to frontend interface.
          // Backend returns: ribaTransactions, ribaCount, totalTransactions, scannedCount
          // Frontend expects: flaggedTransactions, flaggedCount, totalScanned
          const flaggedTxns = Array.isArray(d?.ribaTransactions) ? d.ribaTransactions
            : Array.isArray(d?.flaggedTransactions) ? d.flaggedTransactions : [];
          setResult({
            totalScanned: d?.scannedCount ?? d?.totalTransactions ?? d?.totalScanned ?? 0,
            flaggedCount: d?.ribaCount ?? d?.flaggedCount ?? flaggedTxns.length,
            totalRibaAmount: d?.totalRibaAmount ?? 0,
            ribaPercentage: d?.ribaPercentage ?? 0,
            flaggedTransactions: flaggedTxns.map((tx: any) => ({
              transactionId: tx.transactionId,
              description: tx.description,
              amount: tx.amount,
              date: tx.date ?? tx.timestamp,
              ribaType: tx.ribaType,
              riskLevel: tx.riskLevel,
              riskScore: tx.riskScore,
              flagDetails: tx.flags ?? tx.flagDetails ?? [],
              islamicAlternatives: tx.islamicAlternatives
                ? Object.values(tx.islamicAlternatives)
                : [],
            })),
          });
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

      // Load purification status
      if (purRes.status === 'fulfilled') {
        const p = purRes.value;
        if (p && !p.error) setPurification(p);
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

      {/* ── Riba Purification Section ── */}
      {purification && purification.totalRibaDetected > 0 && (
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">Purify Riba (Interest)</h2>
          <p className="text-sm text-purple-700 mb-4">
            Scholars agree that interest income must be given away to charity — not kept.
            Track your purification progress below.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Riba</p>
              <p className="text-lg font-bold text-red-600">{fmt(purification.totalRibaDetected)}</p>
            </div>
            <div className="text-center bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Purified</p>
              <p className="text-lg font-bold text-green-600">{fmt(purification.totalPurified)}</p>
            </div>
            <div className="text-center bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-lg font-bold text-amber-600">{fmt(purification.remainingToPurify)}</p>
            </div>
          </div>
          {purification.remainingToPurify > 0 ? (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs font-medium text-purple-700 mb-1 block">Donation Amount ($)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={purifyAmount}
                  onChange={e => setPurifyAmount(e.target.value)}
                  placeholder={purification.remainingToPurify.toFixed(2)}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <button
                onClick={async () => {
                  const amt = parseFloat(purifyAmount) || purification.remainingToPurify;
                  if (amt <= 0) return;
                  setPurifying(true);
                  try {
                    const res = await api.recordRibaPurification(amt, 'Riba purification donation');
                    if (res?.error) { toast(res.error, 'error'); return; }
                    toast('Alhamdulillah! Riba purified via charity donation.', 'success');
                    setPurification(prev => prev ? {
                      ...prev,
                      totalPurified: prev.totalPurified + amt,
                      remainingToPurify: Math.max(0, prev.remainingToPurify - amt),
                    } : prev);
                    setPurifyAmount('');
                  } catch (err) {
                    toast('Failed to record purification', 'error');
                  } finally { setPurifying(false); }
                }}
                disabled={purifying}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {purifying ? 'Recording...' : 'Record Donation'}
              </button>
            </div>
          ) : (
            <div className="text-center bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-semibold">All riba has been purified! May Allah accept from you.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Quran 2:275:</strong> &quot;Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan...&quot;
      </div>
    </div>
  );
}
