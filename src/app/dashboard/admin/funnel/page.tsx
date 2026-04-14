'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';

/**
 * Conversion funnel dashboard — distinct-user counts at each lifecycle
 * stage within a rolling window, plus drop-off and top paywall triggers.
 *
 * Backend: GET /admin/funnel?days=<N>   (admin-only, 403 otherwise)
 */

interface Stage {
  name: string;
  label: string;
  count: number;
  dropFromPrev?: number;
}

interface FunnelResponse {
  windowDays: number;
  windowStartMs: number;
  windowEndMs: number;
  stages: Stage[];
  conversionRates: {
    signupToActivated: number;
    activatedToPaid: number;
    signupToPaid: number;
  };
  topPaywallEndpoints: { endpoint: string; count: number }[];
}

const WINDOW_OPTIONS = [7, 30, 90, 180, 365] as const;

function pct(n: number) {
  if (!Number.isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}

export default function FunnelPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FunnelResponse | null>(null);
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.getAdminFunnel(days) as FunnelResponse;
        if (!cancelled) setData(res);
      } catch (err) {
        logError(err, { context: 'Failed to load funnel' });
        if (!cancelled) toast('Failed to load funnel. Admin access required?', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [days, toast]);

  const maxCount = data ? Math.max(...data.stages.map(s => s.count), 1) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1B5E20]">Conversion Funnel</h1>
            <p className="text-sm text-gray-600 mt-1">
              Distinct users reaching each lifecycle stage in the rolling window. Drop-off shows how many fell off between adjacent stages.
            </p>
          </div>
          <div className="flex gap-2">
            {WINDOW_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  days === d
                    ? 'bg-[#1B5E20] text-white'
                    : 'bg-white text-[#1B5E20] border border-[#1B5E20] hover:bg-green-50'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-600 shadow-sm">
            Loading funnel…
          </div>
        )}

        {!loading && data && (
          <>
            {/* Headline conversion rates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Signup → Activated</p>
                <p className="text-3xl font-bold text-[#1B5E20] mt-1">{pct(data.conversionRates.signupToActivated)}</p>
                <p className="text-xs text-gray-500 mt-1">reached first transaction</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Activated → Paid</p>
                <p className="text-3xl font-bold text-[#1B5E20] mt-1">{pct(data.conversionRates.activatedToPaid)}</p>
                <p className="text-xs text-gray-500 mt-1">upgraded after first action</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Signup → Paid</p>
                <p className="text-3xl font-bold text-[#1B5E20] mt-1">{pct(data.conversionRates.signupToPaid)}</p>
                <p className="text-xs text-gray-500 mt-1">end-to-end conversion</p>
              </div>
            </div>

            {/* Funnel stages with bars */}
            <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Stages</h2>
              <div className="space-y-3">
                {data.stages.map((stage, idx) => {
                  const widthPct = (stage.count / maxCount) * 100;
                  return (
                    <div key={stage.name}>
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-gray-400 font-mono w-5 text-right">{idx + 1}.</span>
                          <span className="text-sm font-medium text-gray-900">{stage.label}</span>
                          {stage.dropFromPrev != null && stage.dropFromPrev > 0 && (
                            <span className="text-xs text-red-500">
                              ↓ {stage.dropFromPrev.toLocaleString()} lost
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-[#1B5E20]">{stage.count.toLocaleString()}</span>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] transition-all"
                          style={{ width: `${Math.max(widthPct, 2)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-mono">{stage.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top paywall triggers — tells you which Plus features are most
                "wanted" by Free users; prioritize contextual upgrade prompts here. */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1B5E20] mb-2">Top paywall triggers</h2>
              <p className="text-sm text-gray-600 mb-3">
                Endpoints that most often returned 403 Plus-required in this window. High-traffic paywalls = best places to put contextual upgrade prompts.
              </p>
              {data.topPaywallEndpoints.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No paywall hits in this window.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-200">
                        <th className="py-2">Endpoint</th>
                        <th className="py-2 text-right">Hits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPaywallEndpoints.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-2 font-mono text-xs">{row.endpoint}</td>
                          <td className="py-2 text-right font-bold text-[#1B5E20]">{row.count.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
