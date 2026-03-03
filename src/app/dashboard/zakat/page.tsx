'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const CURRENT_LUNAR_YEAR = 1446; // Update yearly

export default function ZakatPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'calculator' | 'payments'>('calculator');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMabrook, setShowMabrook] = useState(false);
  const [form, setForm] = useState({ amount: '', recipient: '', notes: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [zakatData, paymentsData] = await Promise.all([
        api.getZakat(),
        api.getZakatPayments(CURRENT_LUNAR_YEAR),
      ]);
      setData(zakatData);
      setPayments(paymentsData?.payments || []);
      setTotalPaid(paymentsData?.totalPaid || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
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
        lunarYear: CURRENT_LUNAR_YEAR,
      });
      setForm({ amount: '', recipient: '', notes: '' });
      setShowForm(false);
      await load();
      // Check if fulfilled after reload
      const newTotalPaid = totalPaid + amount;
      if (zakatEligible && newTotalPaid >= zakatDue) {
        setShowMabrook(true);
      }
    } catch { /* error */ }
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
        <h1 className="text-2xl font-bold text-[#1B5E20]">Zakat Calculator</h1>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setTab('calculator')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'calculator' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Calculator</button>
          <button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'payments' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Payments</button>
        </div>
      </div>

      {tab === 'calculator' ? (
        <>
          {/* Zakat Status Hero */}
          <div className={`rounded-2xl p-8 text-white mb-6 text-center ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-amber-600 to-yellow-500'}`}>
            <p className="text-4xl mb-2">{fulfilled ? '🌟' : zakatEligible ? '✅' : 'ℹ️'}</p>
            <p className="text-amber-100 mb-2">{fulfilled ? 'Zakat Fulfilled!' : 'Zakat Due (2.5%)'}</p>
            <p className="text-5xl font-bold">{fmt(zakatDue)}</p>
            <p className="text-amber-200 mt-4 text-sm">
              {fulfilled ? 'Mabrook! May Allah accept your Zakat. تقبل الله منك' : zakatEligible ? 'Your wealth exceeds Nisab — Zakat is obligatory' : 'Your wealth is below Nisab threshold'}
            </p>
            {totalPaid > 0 && zakatDue > 0 && (
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
              <p className="text-2xl font-bold text-[#1B5E20]">{fmt((data?.totalWealth as number) || 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm">Nisab Threshold</p>
              <p className="text-2xl font-bold text-amber-600">{fmt((data?.nisab as number) || 5686.20)}</p>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Reminder:</strong> Zakat is 2.5% of wealth held for one Islamic lunar year (Hawl) above the Nisab threshold.
            Use the Hawl Tracker to track when each asset becomes eligible.
          </div>
        </>
      ) : (
        <>
          {/* Payment Progress Summary */}
          <div className={`rounded-2xl p-6 text-white mb-6 ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]'}`}>
            <p className="text-lg font-bold mb-4">{fulfilled ? '🌟 Zakat Fulfilled' : '📊 Zakat Progress'} — {CURRENT_LUNAR_YEAR} AH</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold">{fmt(zakatDue)}</p><p className="text-white/60 text-xs">Due</p></div>
              <div><p className="text-2xl font-bold text-amber-300">{fmt(totalPaid)}</p><p className="text-white/60 text-xs">Paid</p></div>
              <div><p className="text-2xl font-bold text-white/70">{fmt(remaining)}</p><p className="text-white/60 text-xs">Remaining</p></div>
            </div>
            {zakatDue > 0 && (
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full ${fulfilled ? 'bg-blue-300' : 'bg-amber-400'}`} style={{ width: `${fulfillmentPct * 100}%` }} />
                </div>
                <p className="text-white/60 text-xs mt-2 text-center">{(fulfillmentPct * 100).toFixed(0)}% of zakat paid for {CURRENT_LUNAR_YEAR} AH</p>
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
              <p>No payments recorded for {CURRENT_LUNAR_YEAR} AH</p>
              <p className="text-sm mt-1">Tap &quot;Record Payment&quot; to log your Zakat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => {
                const paidAt = p.paidAt as number;
                const date = new Date(paidAt);
                return (
                  <div key={p.id as number} className="bg-white rounded-xl p-4 flex items-center gap-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-xl">🕌</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1B5E20]">{fmt(p.amount as number)}</p>
                      {p.recipient && <p className="text-gray-500 text-sm truncate">{p.recipient as string}</p>}
                      {p.notes && <p className="text-gray-400 text-xs truncate">{p.notes as string}</p>}
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
        </>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Record Zakat Payment</h2>
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
            <p className="text-gray-600 mb-2">You have fulfilled your Zakat obligation for {CURRENT_LUNAR_YEAR} AH. May Allah accept it from you and bless your wealth.</p>
            <p className="text-gray-400 italic mb-6">تقبل الله منك</p>
            <button onClick={() => setShowMabrook(false)} className="w-full bg-[#1B5E20] text-white rounded-lg py-3 hover:bg-[#2E7D32] font-medium">Jazakallah Khayran</button>
          </div>
        </div>
      )}
    </div>
  );
}
