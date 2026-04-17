'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { useCurrency } from '../../../lib/useCurrency';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Investments</h1>
        <button
          onClick={() => setShowAccountForm(true)}
          className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium"
        >
          + Add Account
        </button>
      </div>

      {/* Portfolio summary banner — only show if there's meaningful data */}
      {combinedTotal > 0 && (
        <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
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
                      ? 'bg-[#1B5E20] text-white'
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
                        className="text-sm text-[#1B5E20] font-medium hover:underline"
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
            <Link href="/dashboard/assets" className="text-sm text-[#1B5E20] hover:underline">
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
                <Link href="/dashboard/assets" className="text-xs text-[#1B5E20] hover:underline">
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state — shown only when both sections are empty */}
      {accounts.length === 0 && assetAccounts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📈</p>
          <p className="font-medium text-gray-600">No investment accounts yet.</p>
          <p className="text-sm mt-2 max-w-sm mx-auto text-gray-400">
            Click <strong>+ Add Account</strong> to track a brokerage account with holdings,
            or go to{' '}
            <Link href="/dashboard/assets" className="text-[#1B5E20] underline hover:no-underline">Assets</Link>
            {' '}and add a 401(k), IRA, HSA, 529, or other investment asset — it will appear here automatically.
          </p>
        </div>
      )}

      {/* Add Account Modal */}
      {showAccountForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Investment Account</h2>
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
                onClick={() => setShowAccountForm(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                disabled={savingAccount || !accountForm.name}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Holding</h2>
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
                onClick={() => setAddHoldingFor(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHolding}
                disabled={savingHolding || !holdingForm.symbol || !holdingForm.quantity || !holdingForm.averageCost}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {savingHolding ? 'Saving...' : 'Add Holding'}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
