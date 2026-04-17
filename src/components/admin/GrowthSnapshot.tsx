'use client';

/**
 * Growth KPIs card — shared between /dashboard/admin/funnel (shown above
 * the conversion stages for context) and /dashboard/admin/growth (its own
 * dedicated page so the URL is bookmarkable). Keeping one renderer means
 * the two surfaces can't drift out of sync.
 *
 * Data source: GET /admin/growth (see AdminDashboardController.getGrowth).
 */

export interface GrowthResponse {
  activeUsers: { dau: number; wau: number; mau: number };
  trialConversion: { granted30d: number; upgraded30d: number; rate: number };
  revenueBySource: { source: string; plan: string; users: number; mrrUsd: number }[];
  totals: { activePlus: number; activeFamily: number; mrrUsd: number; arrUsd: number };
}

function pct(n: number) {
  if (!Number.isFinite(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}

function usd(n: number) {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  growth: GrowthResponse | null;
  /** When true, renders a title inside the card. Off for embedded use. */
  showTitle?: boolean;
}

export default function GrowthSnapshot({ growth, showTitle = true }: Props) {
  if (!growth) return null;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      {showTitle && (
        <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Growth snapshot</h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">DAU / WAU / MAU</p>
          <p className="text-lg font-bold text-[#1B5E20] mt-1">
            {growth.activeUsers.dau.toLocaleString()}
            <span className="text-gray-400 font-normal"> / </span>
            {growth.activeUsers.wau.toLocaleString()}
            <span className="text-gray-400 font-normal"> / </span>
            {growth.activeUsers.mau.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">distinct users active in 1d / 7d / 30d</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Trial conversion</p>
          <p className="text-lg font-bold text-[#1B5E20] mt-1">{pct(growth.trialConversion.rate)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {growth.trialConversion.upgraded30d.toLocaleString()}/{growth.trialConversion.granted30d.toLocaleString()} last 30d
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">MRR</p>
          <p className="text-lg font-bold text-[#1B5E20] mt-1">{usd(growth.totals.mrrUsd)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {growth.totals.activePlus.toLocaleString()} Plus · {growth.totals.activeFamily.toLocaleString()} Family
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">ARR</p>
          <p className="text-lg font-bold text-[#1B5E20] mt-1">{usd(growth.totals.arrUsd)}</p>
          <p className="text-xs text-gray-500 mt-1">annualized run-rate</p>
        </div>
      </div>

      {growth.revenueBySource.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Revenue by source</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="py-2">Source</th>
                  <th className="py-2">Plan</th>
                  <th className="py-2 text-right">Users</th>
                  <th className="py-2 text-right">MRR</th>
                </tr>
              </thead>
              <tbody>
                {growth.revenueBySource.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-b-0">
                    <td className="py-1.5 font-mono text-xs">{row.source}</td>
                    <td className="py-1.5 capitalize">{row.plan}</td>
                    <td className="py-1.5 text-right">{row.users.toLocaleString()}</td>
                    <td className="py-1.5 text-right font-semibold text-[#1B5E20]">{usd(row.mrrUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
