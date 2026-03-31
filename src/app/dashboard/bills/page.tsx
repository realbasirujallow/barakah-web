'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';

interface BillItem {
  id: number; name: string; category: string; amount: number;
  frequency: string; dueDay: number; paid: boolean; nextDueDate: number;
}

const FREQS = ['weekly', 'monthly', 'quarterly', 'yearly'];

const CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'utilities',      label: 'Utilities',       icon: '💡' },
  { value: 'housing',        label: 'Housing / Rent',  icon: '🏠' },
  { value: 'internet',       label: 'Internet / Phone',icon: '📡' },
  { value: 'insurance',      label: 'Insurance',       icon: '🛡️' },
  { value: 'subscriptions',  label: 'Subscriptions',   icon: '📱' },
  { value: 'healthcare',     label: 'Healthcare',      icon: '🏥' },
  { value: 'education',      label: 'Education',       icon: '📚' },
  { value: 'transport',      label: 'Transport',       icon: '🚗' },
  { value: 'charity',        label: 'Charity / Zakat', icon: '🤲' },
  { value: 'other',          label: 'Other',           icon: '📋' },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

function getCatIcon(cat: string) {
  return CAT_MAP[cat]?.icon ?? '📋';
}

function getDaysUntilDue(bill: BillItem): number | null {
  if (!bill.nextDueDate) return null;
  const now = Date.now();
  return Math.round((bill.nextDueDate - now) / (1000 * 60 * 60 * 24));
}

function formatDueDate(bill: BillItem): string {
  if (!bill.nextDueDate) return `Day ${bill.dueDay}`;
  return new Date(bill.nextDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const emptyForm = { name: '', category: 'utilities', amount: '', frequency: 'monthly', dueDay: '1' };

export default function BillsPage() {
  const [bills, setBills]           = useState<BillItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editBill, setEditBill]     = useState<BillItem | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    api.getBills()
      .then(d => setBills(d?.bills || d || []))
      .catch(() => toast('Failed to load bills', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditBill(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (b: BillItem) => {
    setEditBill(b);
    setForm({ name: b.name, category: b.category, amount: String(b.amount), frequency: b.frequency, dueDay: String(b.dueDay) });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const amt = parseFloat(form.amount);
      if (!amt || amt <= 0) { alert('Bill amount must be greater than zero'); setSaving(false); return; }
      const day = parseInt(form.dueDay);
      if (isNaN(day) || day < 1 || day > 31) { alert('Due day must be between 1 and 31'); setSaving(false); return; }
      const payload = { ...form, amount: amt, dueDay: day };
      if (editBill) {
        await api.updateBill(editBill.id, payload);
        toast('Bill updated', 'success');
      } else {
        await api.addBill(payload);
        toast('Bill added', 'success');
      }
      setShowForm(false);
      setEditBill(null);
      setForm(emptyForm);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save bill';
      toast(msg, 'error');
    }
    setSaving(false);
  };

  const handlePaid = async (id: number) => {
    await api.markBillPaid(id).catch(() => toast('Failed to mark bill as paid', 'error'));
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this bill?')) return;
    try {
      await api.deleteBill(id);
      toast('Bill deleted', 'success');
      load();
    } catch {
      toast('Failed to delete bill', 'error');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  const now = Date.now();
  const unpaid = bills.filter(b => !b.paid);
  const paid   = bills.filter(b => b.paid);

  // Overdue: nextDueDate in the past and not paid
  const overdue  = unpaid.filter(b => b.nextDueDate && b.nextDueDate < now);
  // Upcoming: due within 7 days (but not overdue)
  const upcoming = unpaid.filter(b => {
    if (!b.nextDueDate || b.nextDueDate < now) return false;
    const days = getDaysUntilDue(b);
    return days !== null && days <= 7;
  });
  // Future: due > 7 days away
  const future   = unpaid.filter(b => {
    if (!b.nextDueDate || b.nextDueDate < now) return false;
    const days = getDaysUntilDue(b);
    return days !== null && days > 7;
  });
  // No nextDueDate
  const noDueDate = unpaid.filter(b => !b.nextDueDate);

  const monthlyTotal = bills.reduce((s, b) => {
    if (b.frequency === 'monthly')    return s + b.amount;
    if (b.frequency === 'quarterly')  return s + b.amount / 3;
    if (b.frequency === 'yearly')     return s + b.amount / 12;
    if (b.frequency === 'weekly')     return s + b.amount * 4.33;
    return s + b.amount;
  }, 0);

  const BillRow = ({ b, showStatus = false }: { b: BillItem; showStatus?: boolean }) => {
    const days = getDaysUntilDue(b);
    const isOverdue  = b.nextDueDate && b.nextDueDate < now && !b.paid;
    const isUpcoming = !isOverdue && days !== null && days <= 7 && !b.paid;

    return (
      <div className={`bg-white rounded-xl p-4 flex justify-between items-center border-l-4 ${
        b.paid ? 'border-green-400 bg-green-50' :
        isOverdue ? 'border-red-500' :
        isUpcoming ? 'border-orange-400' :
        'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCatIcon(b.category)}</span>
          <div>
            <p className="font-semibold text-gray-900">{b.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {CAT_MAP[b.category]?.label ?? b.category} • {b.frequency}
              {b.nextDueDate && !b.paid && (
                <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : isUpcoming ? 'text-orange-600' : 'text-gray-500'}`}>
                  • {isOverdue ? `Overdue (${formatDueDate(b)})` : `Due ${formatDueDate(b)}${days !== null && days <= 7 ? ` (${days}d)` : ''}`}
                </span>
              )}
              {b.paid && <span className="ml-2 text-green-600 font-medium">✓ Paid</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className={`text-lg font-bold ${b.paid ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
            {fmt(b.amount)}
          </p>
          {!b.paid && (
            <button type="button" onClick={() => handlePaid(b.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 whitespace-nowrap">
              ✓ Paid
            </button>
          )}
          <button type="button" onClick={() => openEdit(b)} className="text-gray-400 hover:text-[#1B5E20] text-sm px-1">✏️</button>
          <button type="button" onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm px-1">🗑️</button>
        </div>
      </div>
    );
  };

  const Section = ({ title, items, color }: { title: string; items: BillItem[]; color: string }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className={`text-base font-semibold mb-3 ${color}`}>{title} <span className="text-gray-400 font-normal">({items.length})</span></h2>
        <div className="space-y-2">
          {items.map(b => <BillRow key={b.id} b={b} />)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Bills & Reminders</h1>
        <button type="button" onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add Bill</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">Total Bills</p>
          <p className="text-2xl font-bold text-[#1B5E20]">{bills.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">Overdue</p>
          <p className={`text-2xl font-bold ${overdue.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>{overdue.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">Due this Week</p>
          <p className={`text-2xl font-bold ${upcoming.length > 0 ? 'text-orange-500' : 'text-gray-400'}`}>{upcoming.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">Est. Monthly</p>
          <p className="text-2xl font-bold text-gray-700">{fmt(monthlyTotal)}</p>
        </div>
      </div>

      {/* Overdue alert banner */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-800">You have {overdue.length} overdue bill{overdue.length > 1 ? 's' : ''}</p>
            <p className="text-sm text-red-700 mt-0.5">Mark them as paid once you&apos;ve settled them.</p>
          </div>
        </div>
      )}

      {/* Sections */}
      <Section title="🔴 Overdue"      items={overdue}   color="text-red-700" />
      <Section title="🟠 Due This Week" items={upcoming}  color="text-orange-600" />
      <Section title="🗓️ Upcoming"     items={future}    color="text-gray-700" />
      <Section title="📋 Scheduled"    items={noDueDate} color="text-gray-500" />
      <Section title="✅ Paid"          items={paid}      color="text-green-700" />

      {bills.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🧾</p>
          <p className="font-medium text-gray-600">No bills added yet</p>
          <p className="text-sm mt-1">Add your recurring bills to track due dates and get reminders</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editBill ? 'Edit Bill' : 'Add Bill'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                  placeholder="e.g. Electric Bill"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number" step="0.01" min="0"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={e => setForm({ ...form, frequency: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                  >
                    {FREQS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Day (1-31)</label>
                  <input
                    type="number" min="1" max="31"
                    value={form.dueDay}
                    onChange={e => setForm({ ...form, dueDay: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditBill(null); }}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.name || !form.amount}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editBill ? 'Save Changes' : 'Add Bill')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
