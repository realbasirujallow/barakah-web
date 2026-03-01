'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface DebtItem { id: number; name: string; type: string; totalAmount: number; remainingAmount: number; monthlyPayment: number; interestRate: number; ribaFree: boolean; lender: string; status: string; }

const TYPES = ['islamic_mortgage', 'personal_loan', 'student_loan', 'car_loan', 'qard_hasan', 'credit_card', 'business_loan', 'other'];
const ISLAMIC_TYPES = ['islamic_mortgage', 'qard_hasan'];
const TYPE_LABELS: Record<string, string> = {
  islamic_mortgage: 'Islamic Mortgage', personal_loan: 'Personal Loan', student_loan: 'Student Loan',
  car_loan: 'Car Loan', qard_hasan: "Qard Hasan", credit_card: 'Credit Card', business_loan: 'Business Loan', other: 'Other',
};

const emptyForm = { name: '', type: 'qard_hasan', totalAmount: '', remainingAmount: '', monthlyPayment: '', interestRate: '0', lender: '', ribaFree: true };

export default function DebtsPage() {
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDebt, setEditDebt] = useState<DebtItem | null>(null);
  const [payModal, setPayModal] = useState<DebtItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [payAmount, setPayAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getDebts().then(d => setDebts(d?.debts || d || [])).catch((err) => { console.error(err); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const openAdd = () => { setEditDebt(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (d: DebtItem) => {
    setEditDebt(d);
    setForm({
      name: d.name, type: d.type, totalAmount: String(d.totalAmount),
      remainingAmount: String(d.remainingAmount), monthlyPayment: String(d.monthlyPayment),
      interestRate: String(d.interestRate), lender: d.lender || '', ribaFree: d.ribaFree,
    });
    setShowForm(true);
  };

  const isIslamic = ISLAMIC_TYPES.includes(form.type);
  const isHalal = isIslamic || form.ribaFree;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        totalAmount: parseFloat(form.totalAmount),
        remainingAmount: parseFloat(form.remainingAmount || form.totalAmount),
        monthlyPayment: parseFloat(form.monthlyPayment || '0'),
        interestRate: parseFloat(form.interestRate),
        ribaFree: isHalal,
      };
      if (editDebt) {
        await api.updateDebt(editDebt.id, payload);
      } else {
        await api.addDebt(payload);
      }
      setShowForm(false); load();
    } catch (err: any) { console.error(err); }
    setSaving(false);
  };

  const handlePay = async () => {
    if (!payModal) return;
    setSaving(true);
    try {
      await api.makeDebtPayment(payModal.id, parseFloat(payAmount));
      setPayModal(null); setPayAmount(''); load();
    } catch (err: any) { console.error(err); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this debt?')) return;
    await api.deleteDebt(id).catch((err) => { console.error(err); }); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalDebt = debts.reduce((s, d) => s + d.remainingAmount, 0);
  const ribaDebts = debts.filter(d => !d.ribaFree && !ISLAMIC_TYPES.includes(d.type));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Debt Tracker</h1>
        <button onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Debt</button>
      </div>

      {ribaDebts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
          ⚠️ <strong>{ribaDebts.length} debt(s)</strong> involve riba (interest). Consider Islamic alternatives.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Remaining</p><p className="text-2xl font-bold text-red-600">{fmt(totalDebt)}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Monthly Payments</p><p className="text-2xl font-bold text-orange-600">{fmt(debts.reduce((s, d) => s + d.monthlyPayment, 0))}</p></div>
      </div>

      {debts.length > 0 ? (
        <div className="space-y-3">
          {debts.map((d: DebtItem) => {
            const pct = d.totalAmount > 0 ? ((d.totalAmount - d.remainingAmount) / d.totalAmount) * 100 : 0;
            const halal = d.ribaFree || ISLAMIC_TYPES.includes(d.type);
            return (
              <div key={d.id} className={`bg-white rounded-xl p-4 border ${halal ? 'border-transparent' : 'border-red-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{d.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${halal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {halal ? 'Halal' : 'Riba'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{TYPE_LABELS[d.type] || d.type}{d.lender ? ` • ${d.lender}` : ''} • {fmt(d.monthlyPayment)}/mo</p>
                    {d.interestRate > 0 && (
                      <p className={`text-xs font-bold mt-0.5 ${halal ? 'text-green-700' : 'text-red-700'}`}>
                        {ISLAMIC_TYPES.includes(d.type) ? `Profit Rate: ${d.interestRate}% (Halal)` : `Interest: ${d.interestRate}% (Riba)`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setPayModal(d); setPayAmount(String(d.monthlyPayment)); }} className="bg-[#1B5E20] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#2E7D32]">Pay</button>
                    <button onClick={() => openEdit(d)} className="text-gray-500 hover:text-[#1B5E20] text-sm border border-gray-300 px-3 py-1 rounded-lg">Edit</button>
                    <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Paid: {fmt(d.totalAmount - d.remainingAmount)}</span>
                  <span className="text-gray-700 font-medium">{fmt(d.remainingAmount)} left • {pct.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1B5E20] h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🎉</p><p>No debts — Alhamdulillah!</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editDebt ? 'Edit Debt' : 'Add Debt'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Home Mortgage" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, ribaFree: ISLAMIC_TYPES.includes(e.target.value) ? true : form.ribaFree })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                </select></div>
              {isIslamic && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  ✅ This type uses a profit rate, not interest. It is Halal.
                </div>
              )}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input type="number" step="0.01" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Remaining Amount</label>
                <input type="number" step="0.01" value={form.remainingAmount} onChange={e => setForm({ ...form, remainingAmount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Same as total if new" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
                <input type="number" step="0.01" value={form.monthlyPayment} onChange={e => setForm({ ...form, monthlyPayment: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isIslamic ? 'Profit Rate (%)' : 'Interest Rate (%)'}</label>
                <input type="number" step="0.1" value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Lender</label>
                <input value={form.lender} onChange={e => setForm({ ...form, lender: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Islamic Bank" /></div>
              {!isIslamic && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.ribaFree} onChange={e => setForm({ ...form, ribaFree: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm text-gray-700">Riba-Free (Halal)</label>
                </div>
              )}
              {!isHalal && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  ⚠️ This debt involves Riba (interest), which is prohibited in Islam. Consider refinancing with an Islamic alternative.
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.totalAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : editDebt ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {payModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Make Payment</h2>
            <p className="text-gray-500 text-sm mb-4">{payModal.name} • Remaining: {fmt(payModal.remainingAmount)}</p>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
              <input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPayModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handlePay} disabled={saving || !payAmount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Processing...' : 'Pay'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}