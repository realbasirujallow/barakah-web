'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { useAuth, hasAccess } from '../../../context/AuthContext';
import { trackFeatureUse, trackOnce } from '../../../lib/analytics';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';
interface HalalResult { symbol: string; name: string; isHalal: boolean; reason: string; sector: string; debtRatio?: number; }
interface StockStats { totalStocks: number; halalCount: number; haramCount: number; sectorCount: number; }
interface DetailResult { symbol: string; name: string; status: string; reason: string; sector: string; debtRatio?: number; }
interface ScreeningStatus { lastSucceededAt: number | null; statusChanges: number; symbolsChecked: number; }

/** Human-friendly "X minutes/hours/days ago" for the freshness badge.
 *  Capped at "30+ days" — beyond that the user should treat the data
 *  as stale and we want the wording to reflect that. */
function formatTimeAgo(epochMs: number | null, tr: (k: string) => string, tFmt: (k: string, args: (string|number)[]) => string): string {
  if (!epochMs) return tr('halalAgoNever');
  const diff = Date.now() - epochMs;
  if (diff < 0) return tr('halalAgoJustNow');
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return tr('halalAgoJustNow');
  if (mins < 60) return tFmt('halalAgoMinFmt', [mins]);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return tFmt('halalAgoHrFmt', [hrs]);
  const days = Math.floor(hrs / 24);
  if (days < 30) return tFmt('halalAgoDayFmt', [days]);
  return tr('halalAgo30Plus');
}

const PAGE_SIZE = 50;

export default function HalalPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { t, tFmt } = useI18n();
  const hasPaidAccess = user ? hasAccess(user.plan, 'plus', user.planExpiresAt, user.isAdmin) : false;

  // GA4 feature-engagement event — fires once per browser when a user
  // opens the halal screener page. This is a Plus-gated feature so the
  // event's presence in the funnel is a leading indicator of paid-plan
  // engagement; its volume should correlate with upgrade_completed.
  useEffect(() => {
    if (user) {
      try {
        trackOnce('feature_use_halal_screener', () =>
          trackFeatureUse('halal_screener_opened'));
      } catch { /* GA4 unavailable */ }
    }
  }, [user]);

  // Unified search — doubles as single-stock check and screener filter
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Single stock detail (shown when user types an exact ticker and presses Enter)
  const [detailResult, setDetailResult] = useState<DetailResult | null>(null);
  const [checking, setChecking] = useState(false);

  // List state
  const [stocks, setStocks] = useState<HalalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [compliance, setCompliance] = useState<'all' | 'halal' | 'haram'>('all');
  const [sector, setSector] = useState('');
  const [page, setPage] = useState(0);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalInDb, setTotalInDb] = useState(0);

  // Stats & sectors
  const [stats, setStats] = useState<StockStats | null>(null);
  const [sectors, setSectors] = useState<{ sector: string; count: number }[]>([]);
  const [screeningStatus, setScreeningStatus] = useState<ScreeningStatus | null>(null);

  // Debounce search for screener filtering
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load stats and sectors on mount
  useEffect(() => {
    api.getHalalStats().then(d => {
      if (d && !d.error) setStats({
        totalStocks: d.totalStocks ?? 0,
        halalCount: d.halalCount ?? 0,
        haramCount: d.haramCount ?? 0,
        sectorCount: d.sectorCount ?? d.totalSectors ?? 0,
      });
    }).catch(() => toast(t('halalLoadStatsError'), 'error'));
    api.getHalalSectors().then((d: { sectors?: { sector: string; count: number }[]; error?: string }) => {
      if (d?.error) return;
      const s = d?.sectors;
      setSectors(Array.isArray(s) ? s : []);
    }).catch(() => toast(t('halalLoadSectorsError'), 'error'));
    // Trust signal: surfaces last-successful-scan freshness so users
    // don't have to take the halal/haram statuses on faith. Silent on
    // error — a missing badge is far better than a broken page.
    api.getHalalScreeningStatus().then((d: { lastSucceededAt?: number | null; statusChanges?: number; symbolsChecked?: number; error?: string }) => {
      if (d?.error) return;
      setScreeningStatus({
        lastSucceededAt: d?.lastSucceededAt ?? null,
        statusChanges: d?.statusChanges ?? 0,
        symbolsChecked: d?.symbolsChecked ?? 0,
      });
    }).catch(() => { /* badge is non-critical */ });
    // `t` is a fresh identity each render; including it here would refire the
    // mount fetch on every render → infinite refetch loop. Keep only `toast`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  // Fetch stocks when filters or page change
  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.getHalalStocks({ search: debouncedSearch, sector, compliance, page, size: PAGE_SIZE });
      if (d?.error) {
        toast(d.error, 'error');
        setStocks([]);
        setTotalFiltered(0);
        setTotalPages(0);
        setTotalInDb(0);
      } else {
        setStocks(Array.isArray(d?.stocks) ? d.stocks : []);
        setTotalFiltered(d?.totalFiltered || 0);
        setTotalPages(d?.totalPages || 0);
        setTotalInDb(d?.totalInDatabase || 0);
      }
    } catch (err: unknown) {
      logError(err, { context: 'Failed to load stocks' });
    }
    setLoading(false);
  }, [compliance, debouncedSearch, page, sector, toast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStocks();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchStocks]);

  // Quick check — when user presses Enter with a ticker-like query, do a single-stock lookup
  const handleQuickCheck = async () => {
    const ticker = search.trim().toUpperCase();
    if (!ticker) return;
    // Only do a quick check if it looks like a stock ticker (1-5 uppercase letters)
    if (!/^[A-Z]{1,5}$/.test(ticker)) return;
    setChecking(true);
    setDetailResult(null);
    try {
      const r = await api.checkHalal(ticker);
      if (r?.error) {
        toast(r.error, 'error');
      } else {
        setDetailResult({
          symbol: r.symbol,
          name: r.name || '',
          status: !r.found ? 'UNKNOWN' : r.isHalal ? 'HALAL' : 'HARAM',
          reason: !r.found ? t('halalNotFound') : (r.reason || ''),
          sector: r.sector || '',
          debtRatio: r.debtRatio,
        });
      }
    } catch (err) {
      logError(err, { context: 'halal.stockLookup', ticker });
      setDetailResult({ symbol: ticker, name: '', status: 'UNKNOWN', reason: t('halalLookupError'), sector: '' });
    }
    setChecking(false);
  };

  // BUG FIX: split loading and plan-gate into separate conditions so free
  // users get an upgrade CTA instead of an infinite spinner
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user && !hasPaidAccess) {
    return (
      <div className="p-6">
        {/* Phase 24f (2026-04-30): use the shared PageHeader so the
            paywall surface visually matches every other dashboard
            page (consistent typography + subtitle slot for context). */}
        <PageHeader
          title={t('halalTitlePaywall')}
          subtitle={t('halalSubtitlePaywall')}
        />
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-amber-800 font-semibold mb-2">{t('halalPaywallTitle')}</p>
          <p className="text-amber-700 text-sm mb-4">{t('halalPaywallBody')}</p>
          <Link href="/dashboard/billing" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            {t('halalViewPlans')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('halalTitle')}
        subtitle={t('halalSubtitle')}
      />

      {/* Freshness badge — daily re-screen status. Surfaces the same data
          the admin observability dashboard uses, so users can confirm that
          halal/haram statuses are current rather than just trusting a
          static list. Hidden until we have at least one successful run. */}
      {screeningStatus?.lastSucceededAt && (
        <div
          role="status"
          aria-label={tFmt('halalScreeningAriaFmt', [formatTimeAgo(screeningStatus.lastSucceededAt, t, tFmt), screeningStatus.statusChanges])}
          className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-800"
        >
          <span aria-hidden="true">✓</span>
          <span>
            {tFmt('halalRescreenedFmt', [formatTimeAgo(screeningStatus.lastSucceededAt, t, tFmt)])}
            {' · '}
            {screeningStatus.statusChanges === 0
              ? t('halalNoChanges')
              : tFmt('halalStatusChangesFmt', [screeningStatus.statusChanges])}
            {screeningStatus.symbolsChecked > 0 && (
              <span className="text-green-600"> · {tFmt('halalSymbolsFmt', [screeningStatus.symbolsChecked.toLocaleString()])}</span>
            )}
          </span>
        </div>
      )}

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stats.totalStocks.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{t('halalStatTotal')}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700">{stats.halalCount.toLocaleString()}</p>
            <p className="text-xs text-green-600">{t('halalStatHalal')}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-600">{stats.haramCount.toLocaleString()}</p>
            <p className="text-xs text-red-500">{t('halalStatHaram')}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-700">{stats.sectorCount}</p>
            <p className="text-xs text-blue-500">{t('halalStatSectors')}</p>
          </div>
        </div>
      )}

      {/* Unified screener */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {t('halalScreenerHeading')}
            <span className="text-sm font-normal text-gray-400 ml-2">
              {tFmt('halalScreenerCountFmt', [totalFiltered.toLocaleString(), totalInDb.toLocaleString()])}
            </span>
          </h2>

          {/* Compliance toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 text-sm">
            {(['all', 'halal', 'haram'] as const).map(c => (
              <button
                key={c}
                onClick={() => {
                  setCompliance(c);
                  setPage(0);
                }}
                className={`px-4 py-1.5 rounded-md font-medium transition ${
                  compliance === c
                    ? c === 'halal' ? 'bg-green-600 text-white' : c === 'haram' ? 'bg-red-500 text-white' : 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {c === 'all' ? t('halalToggleAll') : c === 'halal' ? t('halalToggleHalal') : t('halalToggleHaram')}
              </button>
            ))}
          </div>
        </div>

        {/* Search + sector filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setDetailResult(null);
                setPage(0);
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleQuickCheck(); }}
              className="w-full border rounded-lg px-4 py-2.5 text-gray-900 pr-20"
              placeholder={t('halalSearchPlaceholder')}
              aria-label={t('halalSearchAria')}
            />
            {search.trim() && /^[A-Z]{1,5}$/i.test(search.trim()) && (
              <button
                onClick={handleQuickCheck}
                disabled={checking}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
              >
                {checking ? '...' : t('halalCheckBtn')}
              </button>
            )}
          </div>
          <select
            value={sector}
            onChange={e => {
              setSector(e.target.value);
              setPage(0);
            }}
            className="border rounded-lg px-3 py-2 text-gray-900 text-sm min-w-[180px]"
          >
            <option value="">{t('halalAllSectors')}</option>
            {sectors.map(s => (
              <option key={s.sector} value={s.sector}>{s.sector} ({s.count})</option>
            ))}
          </select>
        </div>

        {/* Quick check detail result */}
        {detailResult && (
          <div className={`rounded-xl p-5 mb-4 ${detailResult.status === 'HALAL' ? 'bg-green-50 border border-green-200' : detailResult.status === 'HARAM' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{detailResult.status === 'HALAL' ? '\u2705' : detailResult.status === 'HARAM' ? '\u274C' : '\u2753'}</span>
              <div>
                <p className="text-lg font-bold text-gray-900">{detailResult.symbol}{detailResult.name ? ` \u2014 ${detailResult.name}` : ''}</p>
                <p className={`font-semibold ${detailResult.status === 'HALAL' ? 'text-green-700' : detailResult.status === 'HARAM' ? 'text-red-700' : 'text-gray-600'}`}>{detailResult.status === 'HALAL' ? t('halalStatusHalal') : detailResult.status === 'HARAM' ? t('halalStatusHaram') : t('halalStatusUnknown')}</p>
              </div>
              <button
                onClick={() => setDetailResult(null)}
                className="ml-auto text-gray-400 hover:text-gray-600 text-lg"
                aria-label={t('halalDismissResult')}
              >
                &times;
              </button>
            </div>
            {detailResult.reason && <p className="text-gray-600 text-sm">{detailResult.reason}</p>}
            <div className="flex gap-4 mt-1 text-xs text-gray-500">
              {detailResult.sector && <span>{tFmt('halalSectorLabelFmt', [detailResult.sector])}</span>}
              {detailResult.debtRatio !== undefined && <span>{tFmt('halalDebtRatioFmt', [(detailResult.debtRatio * 100).toFixed(1)])}</span>}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Results */}
        {!loading && stocks.length > 0 && (
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {stocks.map((s) => (
              <div key={s.symbol} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                <span className={`text-lg ${s.isHalal ? 'text-green-600' : 'text-red-500'}`}>
                  {s.isHalal ? '\u2705' : '\u274C'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {s.symbol}
                    <span className="font-normal text-gray-500 ml-2">{s.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 truncate">{s.sector} &middot; {s.reason}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.isHalal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.isHalal ? t('halalToggleHalal') : t('halalToggleHaram')}
                </span>
              </div>
            ))}
          </div>
        )}

        {!loading && stocks.length === 0 && (
          <EmptyState
            variant="bare"
            icon="🔎"
            title={t('halalEmptyTitle')}
            description={t('halalEmptyBody')}
            actions={[
              { label: t('halalClearFilters'), onClick: () => { setSearch(''); setSector(''); setCompliance('all'); setPage(0); }, primary: true },
            ]}
            preview={
              <div className="space-y-2">
                {[
                  { sym: 'AAPL', name: 'Apple Inc.', halal: true },
                  { sym: 'MSFT', name: 'Microsoft Corp.', halal: true },
                  { sym: 'JPM', name: 'JPMorgan Chase', halal: false },
                ].map((s) => (
                  <div key={s.sym} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-gray-700">{s.sym}</p>
                      <p className="text-xs text-gray-400">{s.name}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.halal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.halal ? `✅ ${t('halalToggleHalal')}` : `❌ ${t('halalToggleHaram')}`}
                    </span>
                  </div>
                ))}
              </div>
            }
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-sm text-primary font-medium disabled:opacity-30"
            >
              &larr; {t('halalPrev')}
            </button>
            <span className="text-sm text-gray-500">
              {tFmt('halalPageOfFmt', [page + 1, totalPages])}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-sm text-primary font-medium disabled:opacity-30"
            >
              {t('halalNext')} &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Methodology note */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2">{t('halalMethodologyHeading')}</h3>
        <p className="text-sm text-amber-700 leading-relaxed">{t('halalMethodologyBody')}</p>
        <p className="text-xs text-amber-600 mt-2">{t('halalMethodologyDisclaimer')}</p>
      </div>
    </div>
  );
}
