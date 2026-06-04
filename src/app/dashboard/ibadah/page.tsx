'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { useI18n } from '../../../lib/i18n';

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
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  const { toast } = useToast();
  const [data, setData] = useState<IbadahSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.getIbadahSummary();
      setData(res);
    } catch (err) {
      setError(true);
      toast(err instanceof Error ? err.message : t('ibadahLoadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
        <h1 className="text-2xl font-bold text-gray-900">{t('ibadahTitle')}</h1>
        <p className="text-gray-500 mt-1">{t('ibadahSubtitle')}</p>
      </div>

      {/* ── Quranic Quote Banner ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 mb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)' }}
      >
        <p className="text-lg font-medium italic leading-relaxed">
          &ldquo;{t('ibadahQuranQuote')}&rdquo;
        </p>
        <p className="text-sm mt-2 text-green-100 font-medium">{t('ibadahQuranQuoteRef')}</p>
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
          <p className="text-red-700 font-medium text-lg mb-2">{t('ibadahErrorTitle')}</p>
          <p className="text-red-500 text-sm mb-4">{t('ibadahErrorBody')}</p>
          <button
            onClick={() => void loadData()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            {t('ibadahRetry')}
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {!loading && !error && isEmpty && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🕌</p>
          <p className="text-gray-700 font-medium text-lg mb-2">{t('ibadahEmptyTitle')}</p>
          <p className="text-gray-500 text-sm mb-6">
            {t('ibadahEmptyDesc')}
          </p>
          <Link
            href="/dashboard/zakat"
            className="inline-block px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#1B5E20' }}
          >
            {t('ibadahGetStarted')}
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
                      <span className="text-2xl" role="img" aria-label={t('ibadahCardZakat')}>🕌</span>
                      <h2 className="text-lg font-semibold">{t('ibadahCardZakat')}</h2>
                    </div>
                    {data.zakat.belowNisab ? (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">
                        {t('ibadahBelowNisab')}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-900">
                        {t('ibadahDue')}
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1">{fmt(data.zakat.totalZakatDue)}</p>
                  <p className="text-green-100 text-sm flex-1">
                    {/* 2026-05-11 (Bug-A11 follow-up): backend now returns
                        zakatDueCount = 1 when ANY zakat is owed on consolidated
                        zakatable wealth (it's one obligation, not per-asset).
                        Render that semantically instead of "1 assets with zakat
                        due" which reads weird. */}
                    {data.zakat.belowNisab
                      ? t('ibadahZakatNotEligible')
                      : data.zakat.zakatDueCount > 0
                        ? t('ibadahZakatObligation')
                        : t('ibadahZakatNoneOwed')}
                  </p>
                  {!data.zakat.belowNisab && data.zakat.activeTrackers === 0 && data.zakat.totalZakatDue === 0 && (
                    <p className="mt-2 rounded-lg bg-white/15 px-3 py-2 text-xs leading-5 text-green-50">
                      {t('ibadahZakatEstimateNotePre')}<em>{t('ibadahZakatEstimateNoteEmphasis')}</em>{t('ibadahZakatEstimateNotePost')}
                    </p>
                  )}
                  <p className="text-sm text-green-200 mt-4 group-hover:underline">
                    {t('ibadahViewDetails')} &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Sadaqah Card ───────────────────────────────────────────────── */}
            {data.sadaqah && (
              <Link href="/dashboard/sadaqah" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" role="img" aria-label={t('ibadahCardSadaqah')}>🤲</span>
                    <h2 className="text-lg font-semibold text-gray-900">{t('ibadahCardSadaqah')}</h2>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {fmt(data.sadaqah.totalThisYear)}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.sadaqah.donationCount === 1
                      ? tFmt('ibadahSadaqahDonationsOneFmt', [data.sadaqah.donationCount])
                      : tFmt('ibadahSadaqahDonationsManyFmt', [data.sadaqah.donationCount])}
                    <br />
                    {tFmt('ibadahSadaqahThisMonthFmt', [fmt(data.sadaqah.thisMonth)])}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    {t('ibadahViewDetails')} &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* ── Waqf Card ──────────────────────────────────────────────────── */}
            {data.waqf && (
              <Link href="/dashboard/waqf" className="block group">
                <div className="rounded-2xl p-6 bg-white border-2 h-full flex flex-col transition-shadow hover:shadow-lg" style={{ borderColor: '#1B5E20' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" role="img" aria-label={t('ibadahCardWaqf')}>🏛️</span>
                    <h2 className="text-lg font-semibold text-gray-900">{t('ibadahCardWaqf')}</h2>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {fmt(data.waqf.totalContributed)}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.waqf.fundCount === 1
                      ? tFmt('ibadahWaqfFundsOneFmt', [data.waqf.fundCount])
                      : tFmt('ibadahWaqfFundsManyFmt', [data.waqf.fundCount])}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    {t('ibadahViewDetails')} &rarr;
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
                      <span className="text-2xl" role="img" aria-label={t('ibadahCardWasiyyah')}>📜</span>
                      <h2 className="text-lg font-semibold text-gray-900">{t('ibadahCardWasiyyah')}</h2>
                    </div>
                    {data.wasiyyah.pendingObligations > 0 && (
                      <Badge label={tFmt('ibadahPendingBadgeFmt', [data.wasiyyah.pendingObligations])} color="amber" />
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {data.wasiyyah.beneficiaryCount === 1
                      ? tFmt('ibadahHeirsOneFmt', [data.wasiyyah.beneficiaryCount])
                      : tFmt('ibadahHeirsManyFmt', [data.wasiyyah.beneficiaryCount])}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.wasiyyah.pendingObligations > 0
                      ? (data.wasiyyah.pendingObligations === 1
                          ? tFmt('ibadahWasiyyahObligationsOneFmt', [data.wasiyyah.pendingObligations, fmt(data.wasiyyah.totalObligationAmount)])
                          : tFmt('ibadahWasiyyahObligationsManyFmt', [data.wasiyyah.pendingObligations, fmt(data.wasiyyah.totalObligationAmount)]))
                      : t('ibadahNoPendingObligations')}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    {t('ibadahViewDetails')} &rarr;
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
                      <span className="text-2xl" role="img" aria-label={t('ibadahCardHawl')}>⏰</span>
                      <h2 className="text-lg font-semibold text-gray-900">{t('ibadahCardHawl')}</h2>
                    </div>
                    {data.hawl.upcomingIn30Days > 0 && (
                      <Badge label={tFmt('ibadahSoonBadgeFmt', [data.hawl.upcomingIn30Days])} color="red" />
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                    {tFmt('ibadahActiveCountFmt', [data.hawl.activeTrackers])}
                  </p>
                  <p className="text-gray-500 text-sm flex-1">
                    {data.hawl.activeTrackers > 0
                      ? (data.hawl.nextCompletionDays === 1
                          ? tFmt('ibadahNextCompletionOneFmt', [data.hawl.nextCompletionDays])
                          : tFmt('ibadahNextCompletionManyFmt', [data.hawl.nextCompletionDays]))
                      : t('ibadahNoActiveTrackers')}
                  </p>
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    {t('ibadahViewDetails')} &rarr;
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
                      <span className="text-2xl" role="img" aria-label={t('ibadahCardPurification')}>🛡️</span>
                      <h2 className="text-lg font-semibold text-gray-900">{t('ibadahCardPurification')}</h2>
                    </div>
                    {data.purification.complete ? (
                      <Badge label={t('ibadahComplete')} color="green" />
                    ) : (
                      <Badge label={t('ibadahInProgress')} color="amber" />
                    )}
                  </div>
                  {data.purification.complete ? (
                    <p className="text-3xl font-bold mb-1 text-green-600">
                      {t('ibadahAllPurified')} &#10003;
                    </p>
                  ) : (
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1B5E20' }}>
                      {tFmt('ibadahRemainingFmt', [fmt(data.purification.remaining)])}
                    </p>
                  )}
                  {/* Only show the progress ratio when there's actually riba to
                      purify. Otherwise the card read a nonsensical "$0.72 of $0.00
                      purified" (purified > total) — hide it and let the
                      "Complete / All purified" state speak for itself. */}
                  {data.purification.totalRiba > 0 && (
                    <div className="flex-1">
                      <ProgressBar value={data.purification.purified} max={data.purification.totalRiba} />
                      <p className="text-gray-500 text-xs mt-1.5">
                        {tFmt('ibadahPurifiedOfFmt', [fmt(data.purification.purified), fmt(data.purification.totalRiba)])}
                      </p>
                    </div>
                  )}
                  <p className="text-sm mt-4 group-hover:underline" style={{ color: '#1B5E20' }}>
                    {t('ibadahViewDetails')} &rarr;
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* ── Educational Note ───────────────────────────────────────────── */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('ibadahEducationalNote')}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
