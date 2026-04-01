'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';

/** Compute current Hijri year from today's date using the same formula as the backend. */
function computeHijriYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0;
  const yearFraction = (dayOfYear - 1) / (isLeap ? 366 : 365);
  const gregorianDecimal = now.getFullYear() + yearFraction;
  return Math.floor((gregorianDecimal - 621.5) * (365.25 / 354.367));
}

export default function ZakatPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'calculator' | 'assets' | 'payments'>('calculator');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMabrook, setShowMabrook] = useState(false);
  const [form, setForm] = useState({ amount: '', recipient: '', notes: '' });
  const [hideZakat, setHideZakat] = useState(false);
  const [nisabInfo, setNisabInfo] = useState<{ goldPricePerGram?: number } | null>(null);

  // Manual asset breakdown calculator
  const [manualAssets, setManualAssets] = useState({
    cash:           0,
    gold:           0,
    silver:         0,
    stocks:         0,
    businessGoods:  0,
    receivables:    0,
    rentalIncome:   0,
    otherAssets:    0,
    // Deductions
    debts:          0,
    expenses:       0,
  });

  // Use the lunar year from the API if available; fall back to JS-computed value
  const lunarYear: number = (data?.currentLunarYear as number) || computeHijriYear();

  useEffect(() => {
    setHideZakat(localStorage.getItem('hideZakat') === 'true');
  }, []);

  const toggleHideZakat = () => {
    const next = !hideZakat;
    setHideZakat(next);
    localStorage.setItem('hideZakat', next ? 'true' : 'false');
  };

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getZakat(),
        api.getZakatPayments(), // load all years; filter by lunarYear after we know it
        api.getNisabInfo().catch(() => null),  // non-critical — live gold price display
      ]);
      const zakatData = results[0].status === 'fulfilled' ? results[0].value : null;
      const paymentsData = results[1].status === 'fulfilled' ? results[1].value : null;
      const nisabData = results[2].status === 'fulfilled' ? results[2].value : null;
      if (zakatData?.error) {
        logError(new Error(zakatData.error as string), { context: 'Zakat API error' });
        setLoading(false);
        return;
      }
      if (paymentsData?.error) {
        logError(new Error(paymentsData.error as string), { context: 'Payments API error' });
        setLoading(false);
        return;
      }
      setData(zakatData);
      if (nisabData) setNisabInfo(nisabData as { goldPricePerGram?: number });
      // Filter payments to current lunar year (use API year once we have it)
      const year = (zakatData?.currentLunarYear as number) || computeHijriYear();
      const filtered = Array.isArray(paymentsData?.payments)
        ? paymentsData.payments.filter((p: Record<string, unknown>) => !p.lunarYear || p.lunarYear === year)
        : [];
      setPayments(filtered);
      setTotalPaid(filtered.reduce((s: number, p: Record<string, unknown>) => s + (p.amount as number || 0), 0));
    } catch (err) {
      logError(err, { context: 'Failed to load zakat data' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const zakatDue = (data?.zakatDue as number) || 0;
  const zakatEligible = data?.zakatEligible as boolean;
  const remaining = Math.max(0, zakatDue - totalPaid);
  const fulfilled = zakatEligible && totalPaid >= zakatDue && zakatDue > 0;
  const fulfillmentPct = zakatDue > 0 ? Math.min(1, totalPaid / zakatDue) : 0;

  const handleSavePayment = async () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;
    setSaving(true);
    try {
      await api.addZakatPayment({
        amount,
        recipient: form.recipient || undefined,
        notes: form.notes || undefined,
        lunarYear,
      });
      setForm({ amount: '', recipient: '', notes: '' });
      setShowForm(false);
      await load();
      const newTotalPaid = totalPaid + amount;
      if (zakatEligible && newTotalPaid >= zakatDue) {
        setShowMabrook(true);
      }
    } catch { toast('Failed to save payment. Please try again.', 'error'); }
    setSaving(false);
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm('Delete this payment?')) return;
    await api.deleteZakatPayment(id);
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#1B5E20]">Zakat Calculator</h1>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{lunarYear} AH</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleHideZakat}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {hideZakat ? 'Show' : 'Hide'}
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setTab('calculator')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'calculator' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Overview</button>
            <button onClick={() => setTab('assets')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'assets' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Asset Calc</button>
            <button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'payments' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Payments</button>
          </div>
        </div>
      </div>

      {tab === 'calculator' ? (
        <>
          {/* Zakat Status Hero */}
          <div className={`rounded-2xl p-8 text-white mb-6 text-center ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-amber-600 to-yellow-500'}`}>
            <p className="text-4xl mb-2">{fulfilled ? '🌟' : zakatEligible ? '✅' : 'ℹ️'}</p>
            <p className="text-amber-100 mb-2">{fulfilled ? 'Zakat Fulfilled!' : 'Zakat Due (2.5%)'}</p>
            <p className="text-5xl font-bold">
              {hideZakat ? '••••••' : fmt(zakatDue)}
            </p>
            <p className="text-amber-200 mt-4 text-sm">
              {fulfilled ? 'Mabrook! May Allah accept your Zakat. تقبل الله منك' : zakatEligible ? 'Your wealth exceeds Nisab — Zakat is obligatory' : 'Your wealth is below Nisab threshold'}
            </p>
            {totalPaid > 0 && zakatDue > 0 && !hideZakat && (
              <div className="mt-4 max-w-md mx-auto">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${fulfilled ? 'bg-blue-300' : 'bg-white'}`} style={{ width: `${fulfillmentPct * 100}%` }} />
                </div>
                <p className="text-white/70 text-xs mt-2">
                  {fulfilled ? 'Fully paid ✓' : `Paid: ${fmt(totalPaid)} / Remaining: ${fmt(remaining)}`}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm">Total Wealth</p>
              <p className="text-2xl font-bold text-[#1B5E20]">
                {hideZakat ? '••••••' : fmt((data?.totalWealth as number) || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm flex items-center gap-1">
                Nisab Threshold
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Live gold price" />
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {data?.nisab ? fmt(data.nisab as number) : '—'}
              </p>
              {nisabInfo?.goldPricePerGram && (
                <p className="text-xs text-gray-400 mt-1">
                  Gold: ${nisabInfo.goldPricePerGram!.toFixed(2)}/g · 85g standard · refreshed hourly
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Reminder:</strong> Zakat is 2.5% of wealth held for one Islamic lunar year (Hawl) above the Nisab threshold.
            The Nisab is based on the live gold price (85g, AMJA standard) and updates hourly — small changes are normal.
            Use the Hawl Tracker to track when each asset becomes eligible.
          </div>
        </>

      ) : tab === 'assets' ? (
        <>
          {/* Manual Zakat Asset Calculator */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">📌 Manual Asset Breakdown</p>
            <p>Enter each zakatable asset below. This calculator is independent of your connected accounts and uses the Nisab ({data?.nisab ? fmt(data.nisab as number) : '…'}) from live gold prices.</p>
          </div>

          {(() => {
            const totalIn = manualAssets.cash + manualAssets.gold + manualAssets.silver +
              manualAssets.stocks + manualAssets.businessGoods + manualAssets.receivables +
              manualAssets.rentalIncome + manualAssets.otherAssets;
            const totalOut = manualAssets.debts + manualAssets.expenses;
            const netWealth = Math.max(0, totalIn - totalOut);
            const nisab = (data?.nisab as number) || 0;
            const isEligible = nisab > 0 && netWealth >= nisab;
            const zakatAmt = isEligible ? netWealth * 0.025 : 0;

            const setAsset = (key: string, val: number) =>
              setManualAssets(prev => ({ ...prev, [key]: Math.max(0, val) }));

            const AssetRow = ({ label, icon, fieldKey, hint }: { label: string; icon: string; fieldKey: string; hint?: string }) => (
              <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-xl w-7 text-center shrink-0">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  {hint && <p className="text-xs text-gray-400">{hint}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">$</span>
                  <input
                    type="number" min="0" step="100"
                    value={manualAssets[fieldKey as keyof typeof manualAssets] || ''}
                    onChange={e => setAsset(fieldKey, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-28 border rounded-lg px-2 py-1.5 text-sm text-right text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            );

            return (
              <>
                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-[#1B5E20] mb-3">Assets (Zakatable)</h3>
                  <AssetRow label="Cash & Bank Accounts" icon="💵" fieldKey="cash" hint="Checking, savings, and cash on hand" />
                  <AssetRow label="Gold" icon="🥇" fieldKey="gold" hint="Market value of gold owned" />
                  <AssetRow label="Silver" icon="🥈" fieldKey="silver" hint="Market value of silver owned" />
                  <AssetRow label="Stocks & Investments" icon="📈" fieldKey="stocks" hint="Halal stocks, ETFs, mutual funds (market value)" />
                  <AssetRow label="Business Inventory" icon="📦" fieldKey="businessGoods" hint="Stock / goods held for trade" />
                  <AssetRow label="Money Owed to You" icon="🤝" fieldKey="receivables" hint="Loans given that are likely to be returned" />
                  <AssetRow label="Rental Income Saved" icon="🏠" fieldKey="rentalIncome" hint="Net rental income received this hawl" />
                  <AssetRow label="Other Assets" icon="💼" fieldKey="otherAssets" hint="Any other zakatable wealth" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-red-600 mb-3">Deductions</h3>
                  <AssetRow label="Outstanding Debts Due" icon="💳" fieldKey="debts" hint="Debts that are immediately due" />
                  <AssetRow label="Essential Expenses" icon="📋" fieldKey="expenses" hint="Unavoidable expenses due within this month" />
                </div>

                {/* Result */}
                <div className={`rounded-2xl p-6 text-white text-center mb-4 ${isEligible ? 'bg-gradient-to-r from-amber-600 to-yellow-500' : 'bg-gradient-to-r from-gray-500 to-gray-400'}`}>
                  <p className="text-amber-100 text-sm mb-1">Net Zakatable Wealth</p>
                  <p className="text-4xl font-bold">{fmt(netWealth)}</p>
                  <p className="text-amber-200 text-sm mt-2">
                    {isEligible
                      ? `Above nisab (${fmt(nisab)}) — Zakat is obligatory`
                      : nisab > 0 ? `Below nisab (${fmt(nisab)}) — Zakat not obligatory` : 'Loading nisab…'}
                  </p>
                  {isEligible && (
                    <div className="mt-4 bg-white/20 rounded-xl p-4">
                      <p className="text-xs text-amber-100 mb-1">Zakat Due (2.5%)</p>
                      <p className="text-3xl font-bold">{fmt(zakatAmt)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Total Assets</p>
                    <p className="font-bold text-green-600">{fmt(totalIn)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Deductions</p>
                    <p className="font-bold text-red-500">−{fmt(totalOut)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Net Wealth</p>
                    <p className="font-bold text-[#1B5E20]">{fmt(netWealth)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-xs text-blue-800">
                  <strong>Note:</strong> Stocks: many scholars say to use the market value of shares in companies whose primary business is halal. For mixed companies, apply the purification ratio. Consult a scholar for your specific situation.
                </div>
              </>
            );
          })()}
        </>
      ) : (
        <>
          {/* Payment Progress Summary */}
          <div className={`rounded-2xl p-6 text-white mb-6 ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]'}`}>
            <p className="text-lg font-bold mb-4">{fulfilled ? '🌟 Zakat Fulfilled' : '📊 Zakat Progress'} — {lunarYear} AH</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{hideZakat ? '••••' : fmt(zakatDue)}</p>
                <p className="text-white/60 text-xs">Due</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-300">{hideZakat ? '••••' : fmt(totalPaid)}</p>
                <p className="text-white/60 text-xs">Paid</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white/70">{hideZakat ? '••••' : fmt(remaining)}</p>
                <p className="text-white/60 text-xs">Remaining</p>
              </div>
            </div>
            {zakatDue > 0 && !hideZakat && (
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full ${fulfilled ? 'bg-blue-300' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, fulfillmentPct * 100)}%` }} />
                </div>
                <p className="text-white/60 text-xs mt-2 text-center">{(fulfillmentPct * 100).toFixed(0)}% of zakat paid for {lunarYear} AH</p>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#1B5E20]">Payment History</h2>
            <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm">+ Record Payment</button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🕌</p>
              <p>No payments recorded for {lunarYear} AH</p>
              <p className="text-sm mt-1">Tap &quot;Record Payment&quot; to log your Zakat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => {
                const paidAt = p.paidAt as number;
                const date = new Date(paidAt < 1e12 ? paidAt * 1000 : paidAt);
                return (
                  <div key={p.id as number} className="bg-white rounded-xl p-4 flex items-center gap-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-xl">🕌</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1B5E20]">{hideZakat ? '••••' : fmt(p.amount as number)}</p>
                      {p.recipient ? <p className="text-gray-500 text-sm truncate">{String(p.recipient)}</p> : null}
                      {p.notes ? <p className="text-gray-400 text-xs truncate">{String(p.notes)}</p> : null}
                      <p className="text-gray-400 text-xs">{date.toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDeletePayment(p.id as number)} className="text-gray-300 hover:text-red-500 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pay Your Zakat Card */}
          <div className="mt-6 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">Ready to Pay Your Zakat?</h3>
              <p className="text-green-100 text-sm">Pay directly to trusted platforms</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <a
                href="https://www.zakatfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
              >
                Zakat Foundation
              </a>
              <a
                href="https://www.launchgood.com/zakat"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
              >
                LaunchGood
              </a>
              <a
                href="https://www.islamicrelief.org/zakat/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
              >
                Islamic Relief
              </a>
            </div>
            <p className="text-xs text-green-100">
              Barakah is not affiliated with these organizations. Verify zakat eligibility with a qualified scholar.
            </p>
          </div>
        </>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Record Zakat Payment — {lunarYear} AH</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient (optional)</label>
                <input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Local Masjid, Islamic Relief" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Add a comment..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSavePayment} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Record'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Mabrook Dialog */}
      {showMabrook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
            <p className="text-6xl mb-4">🌟</p>
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">Mabrook!</h2>
            <p className="text-xl text-amber-600 font-bold mb-4">مبروك</p>
            <p className="text-gray-600 mb-2">You have fulfilled your Zakat obligation for {lunarYear} AH. May Allah accept it from you and bless your wealth.</p>
            <p className="text-gray-400 italic mb-6">تقبل الله منك</p>
            <button onClick={() => setShowMabrook(false)} className="w-full bg-[#1B5E20] text-white rounded-lg py-3 hover:bg-[#2E7D32] font-medium">Jazakallah Khayran</button>
          </div>
        </div>
      )}
    </div>
  );
}
