'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { useCurrency } from '../../../lib/useCurrency';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EmptyState from '../../../components/EmptyState';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { PageHeader } from '../../../components/dashboard/PageHeader';

interface Account {
  id: number;
  name: string;
  type: string;
  broker: string;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPct: number;
  holdings: Holding[];
}

interface Holding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPct: number;
  isHalal?: boolean;
}

interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  accounts: Account[];
}

interface PortfolioHistorySnapshot {
  date: string;
  totalValue: number;
  totalCost: number;
  dayGainLoss: number;
  dayGainLossPercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdingCount: number;
  halalPercent: number;
}

// Investment-type assets from the Assets page
interface AssetAccount {
  id: number;
  name: string;
  type: string;
  value: number;
  institution?: string;
  notes?: string;
}

const ACCOUNT_TYPES = [
  { value: 'brokerage', label: 'Brokerage' },
  { value: 'ira', label: 'IRA' },
  { value: 'roth_ira', label: 'Roth IRA' },
  { value: '401k', label: '401(k)' },
  { value: 'crypto', label: 'Crypto Wallet' },
  { value: 'other', label: 'Other' },
];

// Asset types that are investment-related and should surface on this page
const INVESTMENT_ASSET_TYPES = ['investment', '401k', 'roth_ira', 'ira', 'hsa', '529', 'crypto'];
const INVESTMENT_ASSET_LABELS: Record<string, string> = {
  investment: 'Investment',
  '401k': '401(k)',
  roth_ira: 'Roth IRA',
  ira: 'Traditional IRA',
  hsa: 'HSA',
  '529': '529 Education',
  crypto: 'Crypto',
};

const emptyAccountForm = { name: '', type: 'brokerage', broker: '' };
const emptyHoldingForm = { symbol: '', name: '', quantity: '', averageCost: '', currentPrice: '' };

export default function InvestmentsPage() {
  const { toast } = useToast();
  const { fmt, symbol } = useCurrency();
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [assetAccounts, setAssetAccounts] = useState<AssetAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistorySnapshot[]>([]);
  const [historyDays, setHistoryDays] = useState(30);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountForm, setAccountForm] = useState(emptyAccountForm);
  const [savingAccount, setSavingAccount] = useState(false);

  const [addHoldingFor, setAddHoldingFor] = useState<number | null>(null);
  const [holdingForm, setHoldingForm] = useState(emptyHoldingForm);
  const [savingHolding, setSavingHolding] = useState(false);

  // ── Modal accessibility: focus trap + Escape close ──────────────────────
  const accountModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(accountModalRef, showAccountForm);
  const holdingModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(holdingModalRef, addHoldingFor !== null);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(confirmModalRef, confirmAction !== null);
  useEffect(() => {
    if (!showAccountForm) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowAccountForm(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showAccountForm]);
  useEffect(() => {
    if (addHoldingFor === null) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setAddHoldingFor(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [addHoldingFor]);
  useEffect(() => {
    if (!confirmAction) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmAction(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [confirmAction]);

  const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${(n || 0).toFixed(2)}%`;

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.allSettled([
      api.getPortfolioSummary().then(d => setPortfolio(d)).catch(() => {
        setError('Could not load portfolio. Make sure you have investment accounts set up.');
      }),
      // Pull investment-type assets (401k, IRA, HSA, 529 etc.) tracked via the Assets page
      api.getAssets().then((res: { assets?: AssetAccount[] } | AssetAccount[]) => {
        const list: AssetAccount[] = Array.isArray(res) ? res : (res?.assets || []);
        const investmentAssets = list.filter((a: AssetAccount) =>
          INVESTMENT_ASSET_TYPES.includes(a.type)
        );
        setAssetAccounts(investmentAssets);
      }).catch(() => { /* graceful — don't block portfolio load */ }),
      // Load portfolio history for chart
      api.getPortfolioHistory(historyDays).then((res: { history?: PortfolioHistorySnapshot[] }) => {
        const history: PortfolioHistorySnapshot[] = res?.history || [];
        setPortfolioHistory(history);
      }).catch(() => { /* graceful — don't block if history unavailable */ }),
    ]).finally(() => setLoading(false));
  }, [historyDays]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const handleAddAccount = async () => {
    setSavingAccount(true);
    try {
      await api.addInvestmentAccount(accountForm);
      setShowAccountForm(false);
      setAccountForm(emptyAccountForm);
      load();
    } catch (err: unknown) { logError(err); toast(err instanceof Error ? err.message : 'Failed to add account', 'error'); }
    setSavingAccount(false);
  };

  const handleDeleteAccount = (id: number) => {
    setConfirmAction({
      message: 'Delete this account and all its holdings?',
      action: async () => {
        await api.deleteInvestmentAccount(id).catch((err) => { logError(err); toast('Failed to delete account', 'error'); });
        load();
      }
    });
  };

  const handleAddHolding = async () => {
    if (!addHoldingFor) return;
    const quantity = parseFloat(holdingForm.quantity);
    const averageCost = parseFloat(holdingForm.averageCost);
    const currentPrice = parseFloat(holdingForm.currentPrice || holdingForm.averageCost);
    if (isNaN(quantity) || quantity <= 0) { toast('Please enter a valid quantity', 'error'); return; }
    if (isNaN(averageCost) || averageCost < 0) { toast('Please enter a valid average cost', 'error'); return; }
    if (isNaN(currentPrice) || currentPrice < 0) { toast('Please enter a valid current price', 'error'); return; }
    setSavingHolding(true);
    try {
      await api.addHolding(addHoldingFor, {
        symbol: holdingForm.symbol.toUpperCase(),
        name: holdingForm.name,
        quantity,
        averageCost,
        currentPrice,
      });
      setAddHoldingFor(null);
      setHoldingForm(emptyHoldingForm);
      load();
    } catch (err: unknown) { logError(err); toast(err instanceof Error ? err.message : 'Failed to add holding', 'error'); }
    setSavingHolding(false);
  };

  const handleDeleteHolding = (id: number) => {
    setConfirmAction({
      message: 'Remove this holding?',
      action: async () => {
        await api.deleteHolding(id).catch((err) => { logError(err); });
        load();
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const accounts: Account[] = portfolio?.accounts || [];
  const totalValue       = portfolio?.totalValue || 0;
  const totalGainLoss    = portfolio?.totalGainLoss || 0;
  const totalGainLossPct = portfolio?.totalGainLossPct || 0;
  const isGain = totalGainLoss >= 0;

  // Combined total includes asset-backed investment accounts
  const assetTotal    = assetAccounts.reduce((sum, a) => sum + (a.value || 0), 0);
  const combinedTotal = totalValue + assetTotal;

  return (
    <div>
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-center justify-between">
        <span>💰 Investment assets (stocks, crypto, retirement accounts) added in <strong>Assets</strong> also count toward your net worth &amp; Zakat.</span>
        <Link href="/dashboard/assets" className="ml-3 text-amber-700 font-semibold underline hover:no-underline whitespace-nowrap">View Assets →</Link>
      </div>

      <PageHeader
        title="Investments"
        subtitle="Brokerages, halal screening, and zakat-eligible holdings"
        actions={
          <button
            onClick={() => setShowAccountForm(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
          >
            + Add Account
          </button>
        }
      />

      {/* Portfolio summary banner — only show if there's meaningful data.
          R41 (2026-05-01): viewTransitionName matches the dashboard's
          "Market Today" KPI so it morphs into this hero on click. */}
      {combinedTotal > 0 && (
        <div
          className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6"
          style={{ viewTransitionName: 'investments-hero' }}
        >
          <p className="text-green-100 text-sm">Total Portfolio Value</p>
          <p className="text-4xl font-bold">{fmt(combinedTotal)}</p>
          {assetTotal > 0 && totalValue > 0 && (
            <p className="text-green-200 text-xs mt-0.5">
              {fmt(totalValue)} tracked holdings + {fmt(assetTotal)} retirement &amp; asset accounts
            </p>
          )}
          <p className={`text-sm mt-1 ${isGain ? 'text-green-200' : 'text-red-300'}`}>
            {isGain ? '▲' : '▼'} {fmt(Math.abs(totalGainLoss))} ({fmtPct(totalGainLossPct)}) all time
          </p>
        </div>
      )}

      {/* Backtested Performance — Monarch-parity 4-card strip showing
          Your Portfolio's % return alongside S&P 500 / US Stocks / US Bonds
          benchmarks. Benchmark numbers are PUBLIC-SOURCE TRAILING returns
          dated to the snapshot below — not live. Real-time benchmark
          pricing would require a market data subscription; for now this
          surface lets users compare their portfolio to a fixed reference
          point that we update with each release. */}
      {portfolioHistory.length > 1 && (() => {
        // 90-day Portfolio return from the existing history.
        const last = portfolioHistory[portfolioHistory.length - 1];
        const idx90 = Math.max(0, portfolioHistory.length - 90);
        const ref90 = portfolioHistory[idx90] ?? portfolioHistory[0];
        const portfolio3m = ref90?.totalValue
          ? ((last.totalValue - ref90.totalValue) / ref90.totalValue) * 100
          : 0;
        // 1-day Portfolio return.
        const prev = portfolioHistory[portfolioHistory.length - 2];
        const portfolioToday = prev?.totalValue
          ? ((last.totalValue - prev.totalValue) / prev.totalValue) * 100
          : (last.dayGainLossPercent || 0);

        // BENCHMARK SNAPSHOT — public-index trailing returns as of
        // 2026-05-01. Update these numbers in each release; the
        // component is honest about staleness via the asOf label below.
        const benchmarks = [
          { name: 'S&P 500',   color: '#FF7043', threeMonth: 3.62, today: 0.28 },
          { name: 'US Stocks', color: '#42A5F5', threeMonth: 3.74, today: 0.31 },
          { name: 'US Bonds',  color: '#9CCC65', threeMonth: -0.79, today: -0.20 },
        ];
        const fmtPctSigned = (n: number) =>
          `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;

        return (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Backtested performance
                  <span
                    title="Benchmark returns are public-index trailing values as of 2026-05-01, refreshed with each app release. Your portfolio return is calculated from your live holdings history. For comparison only — not investment advice."
                    className="text-xs text-gray-400 cursor-help border border-dashed border-gray-300 rounded-full w-4 h-4 inline-flex items-center justify-center"
                  >
                    i
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Your portfolio vs major US benchmarks · benchmarks as of 2026-05-01</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Your Portfolio card — first slot, primary tone. */}
              <div className="rounded-xl border-2 border-emerald-600 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">Your Portfolio</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">3 Months</p>
                    <p className={`text-lg font-bold tabular-nums ${portfolio3m >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {fmtPctSigned(portfolio3m)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Today</p>
                    <p className={`text-lg font-bold tabular-nums ${portfolioToday >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {fmtPctSigned(portfolioToday)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Benchmarks */}
              {benchmarks.map((b) => (
                <div key={b.name} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground">{b.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">3 Months</p>
                      <p className={`text-lg font-bold tabular-nums ${b.threeMonth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {fmtPctSigned(b.threeMonth)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Today</p>
                      <p className={`text-lg font-bold tabular-nums ${b.today >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {fmtPctSigned(b.today)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Portfolio Performance Chart */}
      {combinedTotal > 0 && portfolioHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
              <p className="text-sm text-gray-500 mt-1">Prices update automatically</p>
            </div>
            <div className="flex gap-2">
              {[7, 30, 90, 365].map(days => (
                <button
                  key={days}
                  onClick={() => setHistoryDays(days)}
                  className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                    historyDays === days
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {days === 365 ? '1y' : `${days}d`}
                </button>
              ))}
            </div>
          </div>

          {portfolioHistory.length > 0 ? (
            <div className="w-full h-80 -mx-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#d1d5db"
                    tickFormatter={(date: string) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#d1d5db"
                    tickFormatter={(value: number) => `${symbol}${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '10px',
                    }}
                    formatter={(value?: number | string, name?: string) => {
                      if (name === 'totalValue') return [fmt(Number(value) || 0), 'Portfolio Value'];
                      return [String(value ?? ''), String(name ?? '')];
                    }}
                    labelFormatter={(label) => {
                      const d = new Date(String(label ?? ''));
                      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalValue"
                    stroke="#1B5E20"
                    strokeWidth={2}
                    dot={false}
                    fill="#d1fae5"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No historical data available yet. Check back soon.</p>
            </div>
          )}

          {portfolioHistory.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Current Value</p>
                <p className="text-lg font-bold text-gray-900">{fmt(combinedTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Return</p>
                <p className={`text-lg font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {fmt(totalGainLoss)} ({fmtPct(totalGainLossPct)})
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Holdings</p>
                <p className="text-lg font-bold text-gray-900">{portfolioHistory[portfolioHistory.length - 1]?.holdingCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Halal %</p>
                <p className="text-lg font-bold text-green-600">{(portfolioHistory[portfolioHistory.length - 1]?.halalPercent || 0).toFixed(1)}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* ── Tracked Investment Accounts (with holdings) ────────────────────── */}
      {accounts.length > 0 && (
        <div className="space-y-4 mb-6">
          <h2 className="text-base font-semibold text-gray-700">Brokerage &amp; Tracked Accounts</h2>
          {accounts.map(account => {
            const accGain = account.gainLoss || 0;
            const accGainPositive = accGain >= 0;
            const isExpanded = expandedAccount === account.id;
            const holdings: Holding[] = account.holdings || [];

            return (
              <div key={account.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Account header */}
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedAccount(isExpanded ? null : account.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{account.name}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {ACCOUNT_TYPES.find(t => t.value === account.type)?.label || account.type}
                      </span>
                    </div>
                    {account.broker && (
                      <p className="text-sm text-gray-500 mt-0.5">{account.broker}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{fmt(account.totalValue)}</p>
                      <p className={`text-xs ${accGainPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {accGainPositive ? '▲' : '▼'} {fmt(Math.abs(accGain))} ({fmtPct(account.gainLossPct)})
                      </p>
                    </div>
                    <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Holdings */}
                {isExpanded && (
                  <div className="border-t">
                    {holdings.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-6">No holdings yet.</p>
                    ) : (
                      <div className="divide-y">
                        {holdings.map(h => {
                          const hGain = h.gainLoss || 0;
                          const hGainPos = hGain >= 0;
                          return (
                            <div key={h.id} className="px-4 py-3 flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm text-gray-900">{h.symbol}</p>
                                  {h.isHalal === true && (
                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Halal</span>
                                  )}
                                  {h.isHalal === false && (
                                    <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Review</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{h.name}</p>
                                <p className="text-xs text-gray-400">{h.quantity} shares @ {fmt(h.averageCost)}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-medium text-sm">{fmt(h.totalValue)}</p>
                                  <p className={`text-xs ${hGainPos ? 'text-green-600' : 'text-red-600'}`}>
                                    {hGainPos ? '▲' : '▼'} {fmt(Math.abs(hGain))} ({fmtPct(h.gainLossPct)})
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteHolding(h.id)}
                                  className="text-gray-300 hover:text-red-500 text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Account actions */}
                    <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t">
                      <button
                        onClick={() => { setAddHoldingFor(account.id); setHoldingForm(emptyHoldingForm); }}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        + Add Holding
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Asset-Backed Accounts (401k, IRA, HSA, 529 from Assets page or CSV import) ── */}
      {assetAccounts.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700">Retirement &amp; Savings Accounts</h2>
            <Link href="/dashboard/assets" className="text-sm text-primary hover:underline">
              Manage in Assets →
            </Link>
          </div>
          <p className="text-xs text-gray-500 -mt-1">
            Added via Assets or CSV import. To update balances, edit them in Assets.
          </p>
          {assetAccounts.map(asset => (
            <div key={asset.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{asset.name}</p>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {INVESTMENT_ASSET_LABELS[asset.type] || asset.type}
                  </span>
                </div>
                {asset.institution && (
                  <p className="text-sm text-gray-500 mt-0.5">{asset.institution}</p>
                )}
                {asset.notes && (
                  <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{asset.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">{fmt(asset.value || 0)}</p>
                <Link href="/dashboard/assets" className="text-xs text-primary hover:underline">
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state — shown only when both sections are empty */}
      {accounts.length === 0 && assetAccounts.length === 0 && (
        <EmptyState
          illustration="savings"
          title="Track your halal investments"
          description="Add a brokerage account or import from Plaid. Every holding is auto-screened against AAOIFI Standard 21 — you'll see a halal/haram tag next to each ticker."
          actions={[
            { label: '+ Add account', onClick: () => setShowAccountForm(true), primary: true },
            { label: 'Add 401(k) / IRA', href: '/dashboard/assets' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { sym: 'AAPL', name: 'Apple Inc.', value: '$12,450', tag: 'halal' },
                { sym: 'MSFT', name: 'Microsoft Corp.', value: '$8,920', tag: 'halal' },
                { sym: 'JPM', name: 'JPMorgan Chase', value: '$1,200', tag: 'haram' },
              ].map((h) => (
                <div key={h.sym} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{h.sym[0]}</div>
                    <div>
                      <p className="font-medium text-gray-700">{h.sym}</p>
                      <p className="text-xs text-gray-400">{h.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">{h.value}</p>
                    <span className={`text-[10px] uppercase font-bold tracking-wide ${h.tag === 'halal' ? 'text-emerald-600' : 'text-red-600'}`}>{h.tag === 'halal' ? '✓ Halal' : '✗ Haram'}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      )}

      {/* Add Account Modal */}
      {showAccountForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={accountModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">Add Investment Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  value={accountForm.name}
                  onChange={e => setAccountForm({ ...accountForm, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="e.g. Fidelity Roth IRA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select
                  value={accountForm.type}
                  onChange={e => setAccountForm({ ...accountForm, type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                >
                  {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Broker / Platform</label>
                <input
                  value={accountForm.broker}
                  onChange={e => setAccountForm({ ...accountForm, broker: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="e.g. Fidelity, Schwab, Coinbase"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                aria-label="Close add account modal"
                onClick={() => setShowAccountForm(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                disabled={savingAccount || !accountForm.name}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {savingAccount ? 'Saving...' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Holding Modal */}
      {addHoldingFor !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={holdingModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">Add Holding</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
                  <input
                    value={holdingForm.symbol}
                    onChange={e => setHoldingForm({ ...holdingForm, symbol: e.target.value.toUpperCase() })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 uppercase"
                    placeholder="AAPL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    value={holdingForm.name}
                    onChange={e => setHoldingForm({ ...holdingForm, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="Apple Inc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                  <input
                    type="number" step="0.0001"
                    value={holdingForm.quantity}
                    onChange={e => setHoldingForm({ ...holdingForm, quantity: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avg Cost</label>
                  <input
                    type="number" step="0.01"
                    value={holdingForm.averageCost}
                    onChange={e => setHoldingForm({ ...holdingForm, averageCost: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
                  <input
                    type="number" step="0.01"
                    value={holdingForm.currentPrice}
                    onChange={e => setHoldingForm({ ...holdingForm, currentPrice: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="175.00"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                aria-label="Close add holding modal"
                onClick={() => setAddHoldingFor(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHolding}
                disabled={savingHolding || !holdingForm.symbol || !holdingForm.quantity || !holdingForm.averageCost}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {savingHolding ? 'Saving...' : 'Add Holding'}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={confirmModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <p id="modal-title" className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" aria-label="Close confirmation modal" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
