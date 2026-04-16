'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

// ── Existing interfaces ───────────────────────────────────────────────────────

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

interface RibaApiTransaction {
  transactionId: number;
  description: string;
  amount: number;
  date?: string;
  timestamp?: string;
  ribaType: string;
  riskLevel: string;
  riskScore: number;
  flags?: string[];
  flagDetails?: string[];
  islamicAlternatives?: string[] | Record<string, string>;
}

interface RibaScanResponse {
  error?: string;
  ribaTransactions?: RibaApiTransaction[];
  flaggedTransactions?: RibaApiTransaction[];
  ribaCount?: number;
  flaggedCount?: number;
  scannedCount?: number;
  totalTransactions?: number;
  totalScanned?: number;
  totalRibaAmount?: number;
  ribaPercentage?: number;
}

interface DebtRecord {
  id: number;
  name: string;
  type: string;
  interestRate?: number;
  remainingAmount?: number;
  lender?: string;
  ribaFree?: boolean;
}

// ── Journey interfaces ────────────────────────────────────────────────────────

interface RibaGoal {
  id: number;
  sourceType: string;
  sourceName: string;
  currentAmount: number;
  originalAmount: number;
  halalAlternative: string;
  status: 'active' | 'in_progress' | 'eliminated';
  notes: string;
  createdAt: string;
  eliminatedAt?: string;
}

interface JourneySummary {
  totalGoals: number;
  activeGoals: number;
  eliminatedGoals: number;
  totalRibaExposure: number;
  totalEliminated: number;
  progressPercent: number;
  goals: RibaGoal[];
}

interface GoalSuggestion {
  sourceType: string;
  sourceName: string;
  currentAmount: number;
  notes: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SOURCE_TYPES = [
  'MORTGAGE',
  'CREDIT_CARD',
  'PERSONAL_LOAN',
  'CAR_LOAN',
  'STUDENT_LOAN',
  'SAVINGS_INTEREST',
  'INVESTMENT_INTEREST',
  'OTHER',
] as const;

const SOURCE_TYPE_COLORS: Record<string, string> = {
  MORTGAGE: 'bg-blue-100 text-blue-700',
  CREDIT_CARD: 'bg-red-100 text-red-700',
  PERSONAL_LOAN: 'bg-purple-100 text-purple-700',
  CAR_LOAN: 'bg-indigo-100 text-indigo-700',
  STUDENT_LOAN: 'bg-teal-100 text-teal-700',
  SAVINGS_INTEREST: 'bg-amber-100 text-amber-700',
  INVESTMENT_INTEREST: 'bg-orange-100 text-orange-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-red-100 text-red-700',
  in_progress: 'bg-amber-100 text-amber-700',
  eliminated: 'bg-green-100 text-green-700',
};

type TabKey = 'scan' | 'journey' | 'purification';

// ── Component ─────────────────────────────────────────────────────────────────

export default function RibaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const hasPaidAccess = user ? hasAccess(user.plan, 'plus', user.planExpiresAt) : false;

  const [activeTab, setActiveTab] = useState<TabKey>('scan');

  // ── Scan state ──────────────────────────────────────────────────────────────
  const [result, setResult] = useState<RibaResult | null>(null);
  const [ribaDebts, setRibaDebts] = useState<RibaDebt[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Purification state ──────────────────────────────────────────────────────
  const [purification, setPurification] = useState<PurificationStatus | null>(null);
  const [purifyAmount, setPurifyAmount] = useState('');
  const [purifying, setPurifying] = useState(false);

  // ── Journey state ───────────────────────────────────────────────────────────
  const [journey, setJourney] = useState<JourneySummary | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState<string | null>(null);
  const [expandedAlternatives, setExpandedAlternatives] = useState<Set<number>>(new Set());

  // Goal form
  const [goalForm, setGoalForm] = useState({
    sourceType: 'MORTGAGE' as string,
    sourceName: '',
    currentAmount: '',
    notes: '',
  });
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [updatingGoalId, setUpdatingGoalId] = useState<number | null>(null);

  // ── Scan + Purification data load ───────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && user && !hasPaidAccess) {
      router.replace('/dashboard/billing');
      return;
    }

    if (isLoading || !hasPaidAccess) return;

    let cancelled = false;
    Promise.allSettled([
      api.scanRiba() as Promise<RibaScanResponse>,
      api.getDebts() as Promise<{ debts?: DebtRecord[] } | DebtRecord[]>,
      api.getRibaPurificationStatus(),
    ]).then(([ribaRes, debtsRes, purRes]) => {
      if (cancelled) return;
      // Handle transaction scan results
      if (ribaRes.status === 'fulfilled') {
        const d = ribaRes.value;
        if (d?.error) { toast(d.error, 'error'); }
        else {
          const flaggedTxns = Array.isArray(d?.ribaTransactions) ? d.ribaTransactions
            : Array.isArray(d?.flaggedTransactions) ? d.flaggedTransactions : [];
          setResult({
            totalScanned: d?.scannedCount ?? d?.totalTransactions ?? d?.totalScanned ?? 0,
            flaggedCount: d?.ribaCount ?? d?.flaggedCount ?? flaggedTxns.length,
            totalRibaAmount: d?.totalRibaAmount ?? 0,
            ribaPercentage: d?.ribaPercentage ?? 0,
            flaggedTransactions: flaggedTxns.map((tx) => ({
              transactionId: tx.transactionId,
              description: tx.description,
              amount: tx.amount,
              date: String(tx.date ?? tx.timestamp ?? ''),
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
        const debtList = Array.isArray(d)
          ? d
          : (d && typeof d === 'object' && Array.isArray(d.debts) ? d.debts : []);
        const interestDebts = debtList.filter(
          (debt) => (debt.interestRate ?? 0) > 0 && !debt.ribaFree && (debt.remainingAmount ?? 0) > 0,
        ).map((debt) => ({
          id: debt.id,
          name: debt.name,
          type: debt.type,
          interestRate: debt.interestRate ?? 0,
          remainingAmount: debt.remainingAmount ?? 0,
          lender: debt.lender ?? '',
        }));
        setRibaDebts(interestDebts);
      }

      // Load purification status
      if (purRes.status === 'fulfilled') {
        const p = purRes.value;
        if (p && !p.error) setPurification(p);
      }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [hasPaidAccess, isLoading, router, toast, user]);

  // ── Journey data load ───────────────────────────────────────────────────────
  const loadJourney = useCallback(async () => {
    setJourneyLoading(true);
    setJourneyError(null);
    try {
      const data = await api.getRibaJourneySummary();
      if (data?.error) {
        setJourneyError(data.error);
      } else {
        setJourney(data);
      }
    } catch {
      setJourneyError('Failed to load your riba elimination journey');
    } finally {
      setJourneyLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'journey' && !journey && !journeyLoading && hasPaidAccess && !isLoading) {
      loadJourney();
    }
  }, [activeTab, journey, journeyLoading, hasPaidAccess, isLoading, loadJourney]);

  // ── Journey handlers ────────────────────────────────────────────────────────
  const handleCreateGoal = async () => {
    if (!goalForm.sourceName.trim() || !goalForm.currentAmount) return;
    setSubmittingGoal(true);
    try {
      const res = await api.createRibaGoal({
        sourceType: goalForm.sourceType,
        sourceName: goalForm.sourceName.trim(),
        currentAmount: parseFloat(goalForm.currentAmount),
        notes: goalForm.notes.trim(),
      });
      if (res?.error) { toast(res.error, 'error'); return; }
      toast('Riba goal added. May Allah make your journey easy.', 'success');
      setGoalForm({ sourceType: 'MORTGAGE', sourceName: '', currentAmount: '', notes: '' });
      setSuggestions([]);
      loadJourney();
    } catch {
      toast('Failed to create goal', 'error');
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleUpdateGoalStatus = async (goalId: number, status: 'in_progress' | 'eliminated') => {
    setUpdatingGoalId(goalId);
    try {
      if (status === 'eliminated') {
        const res = await api.eliminateRibaGoal(goalId);
        if (res?.error) { toast(res.error, 'error'); return; }
        toast('Alhamdulillah! Riba source eliminated!', 'success');
      } else {
        const res = await api.updateRibaGoal(goalId, { status });
        if (res?.error) { toast(res.error, 'error'); return; }
        toast('Goal marked as in progress', 'success');
      }
      loadJourney();
    } catch {
      toast('Failed to update goal', 'error');
    } finally {
      setUpdatingGoalId(null);
    }
  };

  const handleLoadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await api.getRibaGoalSuggestions();
      if (res?.error) { toast(res.error, 'error'); return; }
      setSuggestions(Array.isArray(res) ? res : res?.suggestions ?? []);
    } catch {
      toast('Failed to load suggestions', 'error');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const toggleAlternative = (id: number) => {
    setExpandedAlternatives(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Auth / loading gates ────────────────────────────────────────────────────
  // LOW BUG FIX: split combined condition so free users see nothing (null) while
  // the redirect fires instead of a spinner flash. Combined `isLoading || !hasPaidAccess`
  // caused the spinner to render briefly before router.replace completed.
  if (!isLoading && user && !hasPaidAccess) return null;
  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  // ── Scan derived state ──────────────────────────────────────────────────────
  const noTransactions = !result || result.totalScanned === 0;
  const flagged = result?.flaggedCount ?? 0;
  const hasRibaDebts = ribaDebts.length > 0;
  const isClean = (!result || flagged === 0) && !hasRibaDebts;

  // ── Purification derived state ──────────────────────────────────────────────
  const purificationPercent = purification && purification.totalRibaDetected > 0
    ? Math.min(100, Math.round((purification.totalPurified / purification.totalRibaDetected) * 100))
    : 0;

  // ── Journey derived state ───────────────────────────────────────────────────
  const activeGoals = journey?.goals.filter(g => g.status !== 'eliminated') ?? [];
  const eliminatedGoals = journey?.goals.filter(g => g.status === 'eliminated') ?? [];

  // ── Tab definitions ─────────────────────────────────────────────────────────
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'scan', label: 'Scan' },
    { key: 'journey', label: 'Journey' },
    { key: 'purification', label: 'Purification' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Riba Detector</h1>

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? 'text-[#1B5E20] font-bold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1B5E20] rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCAN TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'scan' && (
        <>
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
                      <p className="text-sm text-gray-500">{tx.date && !isNaN(new Date(tx.date).getTime()) ? new Date(tx.date).toLocaleDateString() : ''}</p>
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
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          JOURNEY TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'journey' && (
        <>
          {journeyLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
            </div>
          )}

          {journeyError && !journeyLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 font-medium mb-2">{journeyError}</p>
              <button
                onClick={loadJourney}
                className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-semibold hover:bg-[#154a19] transition"
              >
                Retry
              </button>
            </div>
          )}

          {!journeyLoading && !journeyError && (
            <>
              {/* ── Progress Header ── */}
              <div className={`rounded-2xl p-8 text-white mb-6 ${
                journey && journey.progressPercent >= 100
                  ? 'bg-gradient-to-r from-green-600 to-emerald-400'
                  : 'bg-gradient-to-r from-[#1B5E20] to-emerald-600'
              }`}>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold">
                    {journey
                      ? `${journey.eliminatedGoals} of ${journey.totalGoals} riba sources eliminated`
                      : 'Start your riba-free journey'}
                  </p>
                  <p className="text-white/80 mt-1 text-sm">
                    {journey && journey.totalGoals > 0
                      ? `${journey.progressPercent}% complete`
                      : 'Add your riba sources below to begin tracking elimination'}
                  </p>
                </div>
                {journey && journey.totalGoals > 0 && (
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(100, journey.progressPercent)}%` }}
                    />
                  </div>
                )}
                {journey && journey.totalGoals > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-white/70 text-xs">Total Exposure</p>
                      <p className="text-xl font-bold">{fmt(journey.totalRibaExposure)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-xs">Eliminated</p>
                      <p className="text-xl font-bold">{fmt(journey.totalEliminated)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-xs">Active Goals</p>
                      <p className="text-xl font-bold">{journey.activeGoals}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Active Goals List ── */}
              {activeGoals.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-[#1B5E20] mb-3">Active Goals</h2>
                  <div className="space-y-3">
                    {activeGoals.map(goal => (
                      <div key={goal.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${SOURCE_TYPE_COLORS[goal.sourceType] ?? 'bg-gray-100 text-gray-700'}`}>
                              {goal.sourceType.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[goal.status]}`}>
                              {goal.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{fmt(goal.currentAmount)}</p>
                        </div>

                        <p className="font-semibold text-gray-900 mb-1">{goal.sourceName}</p>
                        {goal.notes && <p className="text-sm text-gray-500 mb-2">{goal.notes}</p>}

                        {goal.halalAlternative && (
                          <div className="mb-3">
                            <button
                              onClick={() => toggleAlternative(goal.id)}
                              className="text-xs font-medium text-[#1B5E20] hover:underline flex items-center gap-1"
                            >
                              <span>{expandedAlternatives.has(goal.id) ? '▾' : '▸'}</span>
                              Halal Alternative
                            </button>
                            {expandedAlternatives.has(goal.id) && (
                              <p className="mt-1 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                                {goal.halalAlternative}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-2">
                          {goal.status === 'active' && (
                            <button
                              onClick={() => handleUpdateGoalStatus(goal.id, 'in_progress')}
                              disabled={updatingGoalId === goal.id}
                              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-200 transition disabled:opacity-50"
                            >
                              {updatingGoalId === goal.id ? 'Updating...' : 'Mark In Progress'}
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateGoalStatus(goal.id, 'eliminated')}
                            disabled={updatingGoalId === goal.id}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition disabled:opacity-50"
                          >
                            {updatingGoalId === goal.id ? 'Updating...' : 'Mark Eliminated'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Add Goal Section ── */}
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Add Riba Source</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Source Type</label>
                    <select
                      value={goalForm.sourceType}
                      onChange={e => setGoalForm(prev => ({ ...prev, sourceType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B5E20] outline-none bg-white"
                    >
                      {SOURCE_TYPES.map(t => (
                        <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Source Name</label>
                    <input
                      type="text"
                      value={goalForm.sourceName}
                      onChange={e => setGoalForm(prev => ({ ...prev, sourceName: e.target.value }))}
                      placeholder="e.g. Chase Mortgage, Discover Card"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B5E20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Current Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={goalForm.currentAmount}
                      onChange={e => setGoalForm(prev => ({ ...prev, currentAmount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B5E20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Notes (optional)</label>
                    <textarea
                      value={goalForm.notes}
                      onChange={e => setGoalForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional details..."
                      rows={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B5E20] outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCreateGoal}
                    disabled={submittingGoal || !goalForm.sourceName.trim() || !goalForm.currentAmount}
                    className="px-5 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-semibold hover:bg-[#154a19] transition disabled:opacity-50"
                  >
                    {submittingGoal ? 'Adding...' : 'Add Goal'}
                  </button>
                  <button
                    onClick={handleLoadSuggestions}
                    disabled={loadingSuggestions}
                    className="px-5 py-2 bg-white border border-[#1B5E20] text-[#1B5E20] rounded-lg text-sm font-semibold hover:bg-green-50 transition disabled:opacity-50"
                  >
                    {loadingSuggestions ? 'Detecting...' : 'Auto-Detect from Debts'}
                  </button>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Detected riba sources (click to add):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setGoalForm({
                              sourceType: s.sourceType,
                              sourceName: s.sourceName,
                              currentAmount: String(s.currentAmount),
                              notes: s.notes,
                            });
                          }}
                          className="text-left bg-white border border-green-200 rounded-lg p-3 hover:border-[#1B5E20] hover:shadow-sm transition"
                        >
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SOURCE_TYPE_COLORS[s.sourceType] ?? 'bg-gray-100 text-gray-700'}`}>
                            {s.sourceType.replace(/_/g, ' ')}
                          </span>
                          <p className="font-medium text-gray-900 mt-1 text-sm">{s.sourceName}</p>
                          <p className="text-sm text-gray-500">{fmt(s.currentAmount)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Milestones (Eliminated Goals) ── */}
              {eliminatedGoals.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-[#1B5E20] mb-3">Milestones</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eliminatedGoals.map(goal => (
                      <div key={goal.id} className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SOURCE_TYPE_COLORS[goal.sourceType] ?? 'bg-gray-100 text-gray-700'}`}>
                                {goal.sourceType.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="font-semibold text-green-800 truncate">{goal.sourceName}</p>
                            <p className="text-sm text-green-700">{fmt(goal.originalAmount)} eliminated</p>
                            {goal.eliminatedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                {new Date(goal.eliminatedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!journey || journey.totalGoals === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <p className="text-4xl mb-3">🌱</p>
                  <p className="text-lg font-semibold text-[#1B5E20] mb-1">Begin Your Riba-Free Journey</p>
                  <p className="text-sm text-green-700">
                    Add your interest-bearing sources above to start tracking your path to a riba-free life.
                  </p>
                </div>
              ) : null}

              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Quran 2:278-279:</strong> &quot;O you who have believed, fear Allah and give up what remains [due to you] of interest, if you should be believers.&quot;
              </div>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PURIFICATION TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'purification' && (
        <>
          {purification && purification.totalRibaDetected > 0 ? (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">Purify Riba (Interest)</h2>
              <p className="text-sm text-purple-700 mb-4">
                Scholars agree that interest income must be given away to charity — not kept.
                Track your purification progress below.
              </p>

              {/* ── Visual progress indicator ── */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-700">Purification Progress</span>
                  <span className="text-sm font-bold text-purple-800">{purificationPercent}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      purificationPercent >= 100
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : 'bg-gradient-to-r from-purple-500 to-purple-400'
                    }`}
                    style={{ width: `${purificationPercent}%` }}
                  />
                </div>
              </div>

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
                      } catch {
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
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-lg font-semibold text-[#1B5E20] mb-1">No Riba to Purify</p>
              <p className="text-sm text-green-700">
                No interest income has been detected. If riba is found in the Scan tab, purification tracking will appear here.
              </p>
            </div>
          )}

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Quran 2:275:</strong> &quot;Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan...&quot;
          </div>
        </>
      )}
    </div>
  );
}
