'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ZakatSummary {
  zakatDueCount: number;
  totalZakatDue: number;
  activeTrackers: number;
  belowNisab: boolean;
}

interface SadaqahSummary {
  totalThisYear: number;
  totalAllTime: number;
  donationCount: number;
  thisMonth: number;
}

interface WaqfSummary {
  totalContributed: number;
  fundCount: number;
}

interface WasiyyahSummary {
  beneficiaryCount: number;
  pendingObligations: number;
  totalObligationAmount: number;
  fixedShareTotal: number;
  voluntaryShareTotal: number;
}

interface HawlSummary {
  activeTrackers: number;
  nextCompletionDays: number;
  upcomingIn30Days: number;
}

interface PurificationSummary {
  totalRiba: number;
  purified: number;
  remaining: number;
  complete: boolean;
}

interface IbadahSummary {
  zakat: ZakatSummary | null;
  sadaqah: SadaqahSummary | null;
  waqf: WaqfSummary | null;
  wasiyyah: WasiyyahSummary | null;
  hawl: HawlSummary | null;
  purification: PurificationSummary | null;
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full" />
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
      <div
        className="h-3 rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          backgroundColor: pct === 100 ? '#16a34a' : '#1B5E20',
        }}
      />
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: 'amber' | 'gray' | 'red' | 'green' }) {
  const styles: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[color]}`}>
      {label}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IbadahFinancePage() {
  const { toast } = useToast();
  const [data, setData] = useState<IbadahSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getIbadahSummary();
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) {
          setError(true);
          toast(err instanceof Error ? err.message : 'Failed to load Ibadah summary', 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  // ── Empty check ───────────────────────────────────────────────────────────
  const isEmpty =
    data &&
    !data.zakat &&
    !data.sadaqah &&
    !data.waqf &&
    !data.wasiyyah &&
    !data.hawl &&
    !data.purification;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ibadah Finance</h1>
        <p className="text-gray-500 mt-1">Your Islamic Financial Obligations at a Glance</p>
      </div>

      {/* ── Quranic Quote Banner ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 mb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)' }}
      >
        <p className="text-lg font-medium italic leading-relaxed">
          &ldquo;And establish prayer and give zakat, and bow with those who bow [in worship and obedience].&rdquo;
        </p>
        <p className="text-sm mt-2 text-green-100 font-medium">— Quran 2:43</p>
      </div>

      {/* ── Loading State ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Error State ─────────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-700 font-medium text-lg mb-2">Unable to load your Ibadah summary</p>
          <p className="text-red-500 text-sm mb-4">Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {!loading && !error && isEmpty && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🕌</p>
          <p className="text-gray-700 font-medium text-lg mb-2">No Ibadah data yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Start tracking your zakat, sadaqah, waqf and other Islamic financial obligations.
          </p>
          <Link
            href="/dashboard/zakat"
            className="inline-block px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#1B5E20' }}
          >
            Get Started
          </Link>
        </div>
      )}

      {/* ── Cards Grid ──────────────────────────────────────────────────────── */}
      {!loading && !error && data && !isEmpty && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ── Zakat Card ─────────────────────────────────────────────────── */}
            {data.zakat && (
              <Link href="/dashboard/zakat" className="block group">
                <div
                  className="rounded-2xl p-6 text-white h-full flex flex-col transition-shadow hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label="Zakat">🕌</span>
                      <h2 className="text-lg font-semibold">Zakat</h2>
                    </div>
                    {data.zakat.belowNisab ? (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">
                        Below Nisab
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-900">
                        Due
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1">{fmt(data.zakat.totalZakatDue)}</p>
                  <p className="text-green-100 text-sm flex-1">
                    {data.zakat.belowNisab
                      ? 'Not eligible yet'
                      : `${data.zakat.zakatDueCount} asset${data.zakat.zakatDueCount !== 1 ? 's' : ''} with zakat due`}
                  </p>
                  <p className="text-sm text-green-200 mt-4 group-hover:underline">
                    View Details &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Sadaqah Card ───────────────────────────────────────────────── */}
            {data.sadaqah && (
              <Link href="/dashboard/sadaqah" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" role="img" aria-label="Sadaqah">🤲</span>
                    <h2 className="text-lg font-semibold text-gray-900">Sadaqah</h2>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {fmt(data.sadaqah.totalThisYear)}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.sadaqah.donationCount} donation{data.sadaqah.donationCount !== 1 ? 's' : ''} this year
                    <br />
                    {fmt(data.sadaqah.thisMonth)} this month
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    View Details &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Waqf Card ──────────────────────────────────────────────────── */}
            {data.waqf && (
              <Link href="/dashboard/waqf" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" role="img" aria-label="Waqf">🏛️</span>
                    <h2 className="text-lg font-semibold text-gray-900">Waqf</h2>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {fmt(data.waqf.totalContributed)}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.waqf.fundCount} active fund{data.waqf.fundCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    View Details &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Wasiyyah Card ──────────────────────────────────────────────── */}
            {data.wasiyyah && (
              <Link href="/dashboard/wasiyyah" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label="Wasiyyah">📜</span>
                      <h2 className="text-lg font-semibold text-gray-900">Wasiyyah</h2>
                    </div>
                    {data.wasiyyah.pendingObligations > 0 && (
                      <Badge label={`${data.wasiyyah.pendingObligations} Pending`} color="amber" />
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {data.wasiyyah.beneficiaryCount} heir{data.wasiyyah.beneficiaryCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.wasiyyah.pendingObligations > 0
                      ? `${data.wasiyyah.pendingObligations} pending obligation${data.wasiyyah.pendingObligations !== 1 ? 's' : ''} worth ${fmt(data.wasiyyah.totalObligationAmount)}`
                      : 'No pending obligations'}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    View Details &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Hawl Tracker Card ──────────────────────────────────────────── */}
            {data.hawl && (
              <Link href="/dashboard/hawl" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label="Hawl Tracker">⏰</span>
                      <h2 className="text-lg font-semibold text-gray-900">Hawl Tracker</h2>
                    </div>
                    {data.hawl.upcomingIn30Days > 0 && (
                      <Badge label={`${data.hawl.upcomingIn30Days} Soon`} color="red" />
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {data.hawl.activeTrackers} active
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.hawl.activeTrackers > 0
                      ? `Next completion in ${data.hawl.nextCompletionDays} day${data.hawl.nextCompletionDays !== 1 ? 's' : ''}`
                      : 'No active trackers'}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    View Details &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Purification Card ──────────────────────────────────────────── */}
            {data.purification && (
              <Link href="/dashboard/riba" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label="Purification">🛡️</span>
                      <h2 className="text-lg font-semibold text-gray-900">Purification</h2>
                    </div>
                    {data.purification.complete ? (
                      <Badge label="Complete" color="green" />
                    ) : (
                      <Badge label="In Progress" color="amber" />
                    )}
                  </div>
                  {data.purification.complete ? (
                    <p className="text-3xl font-bold mb-1 text-green-600">
                      All purified &#10003;
                    </p>
                  ) : (
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                      {fmt(data.purification.remaining)} remaining
                    </p>
                  )}
                  <div className="flex-1">
                    <ProgressBar value={data.purification.purified} max={data.purification.totalRiba} />
                    <p className="text-gray-500 text-xs mt-1.5">
                      {fmt(data.purification.purified)} of {fmt(data.purification.totalRiba)} purified
                    </p>
                  </div>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    View Details &rarr;
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* ── Educational Note ───────────────────────────────────────────── */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              These are the financial obligations Allah (SWT) has placed upon us.
              Fulfilling them is an act of worship (ibadah) that brings barakah to
              your wealth. — Based on Quran 2:43, 9:60, 4:11-12
            </p>
          </div>
        </>
      )}
    </div>
  );
}
