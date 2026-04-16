'use client';
import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';

interface Subscription {
  name: string;
  amount: number;
  currency: string;
  frequency: string;
  occurrences: number;
  lastCharged: number;
  nextExpected: number;
  category: string;
  haramFlagged: boolean;
  haramReason?: string;
}

interface HaramFlag {
  subscription: string;
  amount: number;
  frequency: string;
  reason: string;
  severity: 'high' | 'critical';
}

export default function SubscriptionsPage() {
  const { fmt } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [haramFlags, setHaramFlags] = useState<HaramFlag[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalYearly, setTotalYearly] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.detectSubscriptions();
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          setSubscriptions(data.subscriptions || []);
          setHaramFlags(data.haramFlags || []);
          setTotalMonthly(data.totalMonthly || 0);
          setTotalYearly(data.totalYearly || 0);
        }
      } catch {
        if (!cancelled) setError('Failed to detect subscriptions. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => { cancelled = true; };
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.detectSubscriptions();
      if (data.error) {
        setError(data.error);
      } else {
        setSubscriptions(data.subscriptions || []);
        setHaramFlags(data.haramFlags || []);
        setTotalMonthly(data.totalMonthly || 0);
        setTotalYearly(data.totalYearly || 0);
      }
    } catch {
      setError('Failed to detect subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ts: number) => {
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const frequencyLabel = (f: string) => {
    switch (f) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return f;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Subscription Detector</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B5E20] mx-auto mb-4" />
            <p className="text-gray-500">Analyzing your transactions for recurring subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Subscription Detector</h1>
        <button
          onClick={loadSubscriptions}
          className="px-4 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-green-800 transition"
        >
          Re-scan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Detected</p>
          <p className="text-2xl font-bold text-[#1B5E20]">{subscriptions.length}</p>
          <p className="text-xs text-gray-400">subscriptions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Cost</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(totalMonthly)}</p>
          <p className="text-xs text-gray-400">estimated</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Yearly Cost</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(totalYearly)}</p>
          <p className="text-xs text-gray-400">estimated</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm ${haramFlags.length > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Haram Flags</p>
          <p className={`text-2xl font-bold ${haramFlags.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {haramFlags.length}
          </p>
          <p className="text-xs text-gray-400">{haramFlags.length === 0 ? 'all clear!' : 'needs attention'}</p>
        </div>
      </div>

      {/* Haram alerts */}
      {haramFlags.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
            Non-Halal Subscriptions Detected
          </h2>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            The following recurring charges have been flagged as potentially non-halal.
            Please review and consider cancelling or finding halal alternatives.
          </p>
          <div className="space-y-3">
            {haramFlags.map((flag, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-start gap-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {flag.severity === 'critical' ? 'HARAM' : 'RIBA'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{flag.subscription}</p>
                  <p className="text-sm text-red-600">{flag.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {fmt(flag.amount)} / {flag.frequency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All subscriptions table */}
      {subscriptions.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Detected Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Frequency</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Last Charged</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Next Expected</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {subscriptions.map((sub, i) => (
                  <tr key={i} className={sub.haramFlagged ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{sub.name}</div>
                      <div className="text-xs text-gray-400">{sub.category}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {fmt(sub.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {frequencyLabel(sub.frequency)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {sub.lastCharged ? formatDate(sub.lastCharged) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {sub.nextExpected ? formatDate(sub.nextExpected) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {sub.haramFlagged ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Non-Halal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Halal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 dark:text-gray-400">
              No recurring subscriptions detected yet. Add more transactions and try again.
            </p>
          </div>
        )
      )}
    </div>
  );
}
