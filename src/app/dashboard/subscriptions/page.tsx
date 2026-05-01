'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { PageHeader } from '../../../components/dashboard/PageHeader';

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
  /** Phase 25 (2026-04-30): backend-provided cancellation deep link
   *  for known merchants (Netflix, Spotify, NYT, etc). null when we
   *  don't recognise the merchant — UI falls back to a Google search. */
  cancelUrl?: string;
  /** Phase 25 (2026-04-30): suggested halal alternative for haram-flagged
   *  services. e.g. Spotify → Muslim Central + Quran.com. */
  halalAlternative?: string;
}

interface HaramFlag {
  subscription: string;
  amount: number;
  frequency: string;
  reason: string;
  severity: 'high' | 'critical';
}

/**
 * Cancel-help affordance — Phase 25 (2026-04-30).
 *
 * Renders one of two buttons depending on whether the backend recognised the
 * merchant:
 *   • Known merchant → direct deep link to the provider's cancellation page
 *     (e.g. Netflix → /cancelplan, Spotify → /account/subscription).
 *   • Unknown merchant → fallback Google search "how to cancel <name>" so
 *     the user still has a one-click path forward.
 *
 * `target="_blank" rel="noopener noreferrer"` is mandatory: cancellation
 * pages are third-party origins, we don't want them to be able to
 * `window.opener` back into Barakah, and they shouldn't share referrer.
 *
 * No analytics intentionally — cancel-help URLs are sensitive (the user
 * is taking financial action) and we don't want to fingerprint which
 * services a household is leaving via PostHog/GA. If aggregate data is
 * needed later, log it server-side via the existing audit-event channel.
 */
function CancelHelpLink({
  sub,
  flag,
}: {
  sub?: Subscription;
  flag?: HaramFlag;
}) {
  const name = sub?.name ?? flag?.subscription ?? 'subscription';
  if (sub?.cancelUrl) {
    return (
      <a
        href={sub.cancelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition shrink-0"
        aria-label={`Open ${name} cancellation page`}
      >
        Cancel ↗
      </a>
    );
  }
  const fallback = `https://www.google.com/search?q=${encodeURIComponent(`how to cancel ${name}`)}`;
  return (
    <a
      href={fallback}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition shrink-0"
      aria-label={`Search how to cancel ${name}`}
    >
      How to cancel ↗
    </a>
  );
}

export default function SubscriptionsPage() {
  const { fmt } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [haramFlags, setHaramFlags] = useState<HaramFlag[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalYearly, setTotalYearly] = useState(0);
  const [error, setError] = useState('');

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.detectSubscriptions();
      if (data?.error) {
        setError(data.error);
      } else {
        setSubscriptions(data?.subscriptions || []);
        setHaramFlags(data?.haramFlags || []);
        setTotalMonthly(data?.totalMonthly || 0);
        setTotalYearly(data?.totalYearly || 0);
      }
    } catch {
      setError('Failed to detect subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const formatDate = (ts: number) => {
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
        <h1 className="text-2xl font-bold text-primary">Subscription Detector</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-500">Analyzing your transactions for recurring subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Subscription Detector"
        subtitle="Detect recurring charges and flag riba-bearing ones"
        className="mb-0"
        actions={
          <button
            onClick={loadSubscriptions}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-green-800 transition"
          >
            Re-scan
          </button>
        }
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Detected</p>
          <p className="text-2xl font-bold text-primary">{subscriptions.length}</p>
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

      {/* Haram alerts — now with cancel + halal-alt CTAs (Phase 25) */}
      {haramFlags.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
            Non-Halal Subscriptions Detected
          </h2>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            The following recurring charges have been flagged as potentially non-halal.
            Tap <strong>Cancel</strong> to go straight to the provider&apos;s cancellation page, or check the <strong>halal alternative</strong> suggestion.
          </p>
          <div className="space-y-3">
            {haramFlags.map((flag, i) => {
              // Pull the matching subscription so we can render its
              // backend-provided cancelUrl + halalAlternative on the alert
              // card. Match on the normalised name string we already have.
              const sub = subscriptions.find(s => s.name === flag.subscription);
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-start gap-3 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {flag.severity === 'critical' ? 'HARAM' : 'RIBA'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">{flag.subscription}</p>
                    <p className="text-sm text-red-600">{flag.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {fmt(flag.amount)} / {flag.frequency}
                    </p>
                    {sub?.halalAlternative && (
                      <p className="text-xs text-green-700 mt-2 bg-green-50 dark:bg-green-900/20 rounded px-2 py-1.5">
                        <strong>Halal alternative:</strong> {sub.halalAlternative}
                      </p>
                    )}
                  </div>
                  <CancelHelpLink sub={sub} flag={flag} />
                </div>
              );
            })}
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
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Action</th>
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
                    {/* Phase 25: Cancel-help button per row. Direct deep link
                        for known merchants (e.g. Netflix → /cancelplan),
                        Google-search fallback otherwise. */}
                    <td className="px-4 py-3 text-right">
                      <CancelHelpLink sub={sub} />
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
