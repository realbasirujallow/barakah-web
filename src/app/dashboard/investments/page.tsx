'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

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

const ACCOUNT_TYPES = [
  { value: 'brokerage', label: 'Brokerage' },
  { value: 'ira', label: 'IRA' },
  { value: 'roth_ira', label: 'Roth IRA' },
  { value: '401k', label: '401(k)' },
  { value: 'crypto', label: 'Crypto Wallet' },
  { value: 'other', label: 'Other' },
];

const emptyAccountForm = { name: '', type: 'brokerage', broker: '' };
const emptyHoldingForm = { symbol: '', name: '', quantity: '', averageCost: '', currentPrice: '' };

export default function InvestmentsPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountForm, setAccountForm] = useState(emptyAccountForm);
  const [savingAccount, setSavingAccount] = useState(false);

  const [addHoldingFor, setAddHoldingFor] = useState<number | null>(null);
  const [holdingForm, setHoldingForm] = useState(emptyHoldingForm);
  const [savingHolding, setSavingHolding] = useState(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
  const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${(n || 0).toFixed(2)}%`;

  const load = () => {
    setLoading(true);
    setError('');
    api.getPortfolioSummary()
      .then(d => setPortfolio(d))
      .catch(() => setError('Could not load portfolio. Make sure you have investment accounts set up.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAddAccount = async () => {
    setSavingAccount(true);
    try {
      await api.addInvestmentAccount(accountForm);
      setShowAccountForm(false);
      setAccountForm(emptyAccountForm);
      load();
    } catch { /* */ }
    setSavingAccount(false);
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm('Delete this account and all its holdings?')) return;
    await api.deleteInvestmentAccount(id).catch(() => {});
    load();
  };

  const handleAddHolding = async () => {
    if (!addHoldingFor) return;
    setSavingHolding(true);
    try {
      await api.addHolding(addHoldingFor, {
        symbol: holdingForm.symbol.toUpperCase(),
        name: holdingForm.name,
        quantity: parseFloat(holdingForm.quantity),
        averageCost: parseFloat(holdingForm.averageCost),
        currentPrice: parseFloat(holdingForm.currentPrice || holdingForm.averageCost),
      });
      setAddHoldingFor(null);
      setHoldingForm(emptyHoldingForm);
      load();
    } catch { /* */ }
    setSavingHolding(false);
  };

  const handleDeleteHolding = async (id: number) => {
    if (!confirm('Remove this holding?')) return;
    await api.deleteHolding(id).catch(() => {});
    load();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  const accounts: Account[] = portfolio?.accounts || [];
  const totalValue = portfolio?.totalValue || 0;
  const totalGainLoss = portfolio?.totalGainLoss || 0;
  const totalGainLossPct = portfolio?.totalGainLossPct || 0;
  const isGain = totalGainLoss >= 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Investments</h1>
        <button
          onClick={() => setShowAccountForm(true)}
          className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium"
        >
          + Add Account
        </button>
      </div>

      {/* Portfolio summary banner */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-green-100 text-sm">Total Portfolio Value</p>
        <p className="text-4xl font-bold">{fmt(totalValue)}</p>
        <p className={`text-sm mt-1 ${isGain ? 'text-green-200' : 'text-red-300'}`}>
          {isGain ? '▲' : '▼'} {fmt(Math.abs(totalGainLoss))} ({fmtPct(totalGainLossPct)}) all time
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📈</p>
          <p>No investment accounts yet. Add your first account to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
    </div>
  );
}
