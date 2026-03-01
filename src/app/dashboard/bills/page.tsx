'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface BillItem { id: number; name: string; category: string; amount: number; frequency: string; dueDay: number; paid: boolean; nextDueDate: number; }
const FREQS = ['monthly', 'quarterly', 'yearly', 'weekly'];

export default function BillsPage() {
  const [bills, setBills] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'utilities', amount: '', frequency: 'monthly', dueDay: '1' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getBills().then(d => setBills(d?.bills || d || [])).catch((err) => { console.error(err); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addBill({ ...form, amount: parseFloat(form.amount), dueDay: parseInt(form.dueDay) });
      setShowForm(false); setForm({ name: '', category: 'utilities', amount: '', frequency: 'monthly', dueDay: '1' }); load();
    } catch (err: any) { console.error(err); }
    setSaving(false);
  };

  const handlePaid = async (id: number) => {
    await api.markBillPaid(id).catch((err) => { console.error(err); }); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this bill?')) return;
    await api.deleteBill(id).catch((err) => { console.error(err); }); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const due = bills.filter(b => !b.paid);
  const paid = bills.filter(b => b.paid);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Bills & Reminders</h1>
        <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Bill</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Bills</p><p className="text-2xl font-bold text-[#1B5E20]">{bills.length}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Due</p><p className="text-2xl font-bold text-red-600">{due.length}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Monthly Total</p><p className="text-2xl font-bold text-orange-600">{fmt(bills.reduce((s, b) => s + b.amount, 0))}</p></div>
      </div>

      {due.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-3">Due</h2>
          <div className="space-y-2">
            {due.map(b => (
              <div key={b.id} className="bg-white rounded-xl p-4 flex justify-between items-center border-l-4 border-red-400">
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{b.category} • {b.frequency} • Due day {b.dueDay}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-red-600">{fmt(b.amount)}</p>
                  <button onClick={() => handlePaid(b.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">Mark Paid</button>
                  <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {paid.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-3">Paid</h2>
          <div className="space-y-2">
            {paid.map(b => (
              <div key={b.id} className="bg-green-50 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{b.category} • {b.frequency}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-green-600">{fmt(b.amount)}</p>
                  <span className="text-green-600 text-sm">✓ Paid</span>
                  <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bills.length === 0 && (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🧾</p><p>No bills added yet.</p></div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Bill</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Electric Bill" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="utilities" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                    {FREQS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Day</label>
                  <input type="number" min="1" max="31" value={form.dueDay} onChange={e => setForm({ ...form, dueDay: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
