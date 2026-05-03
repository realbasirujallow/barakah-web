'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Lightbulb,
  Home,
  Wifi,
  Shield,
  Smartphone,
  Hospital,
  BookOpen,
  Car,
  CreditCard,
  HandHeart,
  ClipboardList,
  Check,
  Pencil,
  Trash2,
  Hourglass,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';

interface BillItem {
  id: number; name: string; category: string; amount: number;
  frequency: string; dueDay: number; paid: boolean; nextDueDate: number;
  readOnly?: boolean; linkedSource?: string | null; description?: string;
  sourceLabel?: string; minimumPaymentDue?: number; statementBalance?: number;
}

const FREQS = ['weekly', 'monthly', 'quarterly', 'yearly', 'one_time'];

const CATEGORIES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'utilities',      label: 'Utilities',       icon: Lightbulb },
  { value: 'housing',        label: 'Housing / Rent',  icon: Home },
  { value: 'internet',       label: 'Internet / Phone',icon: Wifi },
  { value: 'insurance',      label: 'Insurance',       icon: Shield },
  { value: 'subscriptions',  label: 'Subscriptions',   icon: Smartphone },
  { value: 'healthcare',     label: 'Healthcare',      icon: Hospital },
  { value: 'education',      label: 'Education',       icon: BookOpen },
  { value: 'transport',      label: 'Transport',       icon: Car },
  { value: 'debt',           label: 'Debt Payment',    icon: CreditCard },
  { value: 'charity',        label: 'Charity / Zakat', icon: HandHeart },
  { value: 'other',          label: 'Other',           icon: ClipboardList },
];

const CAT_MAP: Record<string, { value: string; label: string; icon: LucideIcon }> = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

function getCatIcon(cat: string): LucideIcon {
  return CAT_MAP[cat]?.icon ?? ClipboardList;
}

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  // Lucide icons are stateless function refs — looking one up by category here is a
  // dispatch, not a fresh component definition, so the react-hooks/static-components
  // rule's underlying concern (state reset on re-render) doesn't apply.
  return React.createElement(getCatIcon(category), { className, 'aria-hidden': 'true' });
}

function getDaysUntilDue(bill: BillItem): number | null {
  if (!bill.nextDueDate) return null;
  // Use UTC day boundaries for consistent day calculation regardless of timezone
  const nowUtc = new Date();
  const todayUtc = Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate());
  const dueUtc = new Date(bill.nextDueDate);
  const dueDayUtc = Date.UTC(dueUtc.getUTCFullYear(), dueUtc.getUTCMonth(), dueUtc.getUTCDate());
  return Math.round((dueDayUtc - todayUtc) / (1000 * 60 * 60 * 24));
}

function formatDueDate(bill: BillItem): string {
  if (!bill.nextDueDate) return `Day ${bill.dueDay}`;
  const dueDate = new Date(bill.nextDueDate);
  // Use UTC to prevent local timezone shifting the day backwards (off-by-one fix)
  return dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

const emptyForm = { name: '', category: 'utilities', amount: '', frequency: 'monthly', dueDay: '1' };

// ─── BillRow ── hoisted to module scope to prevent React from treating it as a
// new component type on every parent re-render (which would unmount/remount all
// bill rows and lose their focus / animation state).
interface BillRowProps {
  b: BillItem;
  now: number;
  deletingId: number | null;
  onPaid: (id: number) => void;
  onEdit: (b: BillItem) => void;
  onDelete: (id: number) => void;
}

function BillRow({ b, now, deletingId, onPaid, onEdit, onDelete }: BillRowProps) {
  const { fmt } = useCurrency();
  const days = getDaysUntilDue(b);
  const isOverdue  = b.nextDueDate && b.nextDueDate < now && !b.paid;
  const isUpcoming = !isOverdue && days !== null && days <= 7 && !b.paid;

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center border-l-4 ${
      b.paid ? 'border-green-400 bg-green-50' :
      isOverdue ? 'border-red-500' :
      isUpcoming ? 'border-orange-400' :
      'border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <CategoryIcon category={b.category} className="w-7 h-7 text-gray-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-900">{b.name}</p>
          <p className="text-sm text-gray-500 capitalize">
            {CAT_MAP[b.category]?.label ?? b.category} • {b.frequency}
            {b.nextDueDate && !b.paid && (
              <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : isUpcoming ? 'text-orange-600' : 'text-gray-500'}`}>
                • {isOverdue ? `Overdue (${formatDueDate(b)})` : days === 0 ? `Due today (${formatDueDate(b)})` : `Due ${formatDueDate(b)}${days !== null && days <= 7 ? ` (${days}d)` : ''}`}
              </span>
            )}
            {b.paid && <span className="ml-2 text-green-600 font-medium inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" aria-hidden="true" /> Paid</span>}
          </p>
          {b.readOnly && (
            <p className="text-xs text-gray-400 mt-1">
              {b.sourceLabel ?? 'Linked reminder'}{b.description ? ` • ${b.description}` : ''}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-lg font-bold ${b.paid ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
          {fmt(b.amount)}
        </p>
        {!b.paid && !b.readOnly && (
          <button type="button" onClick={() => onPaid(b.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 whitespace-nowrap inline-flex items-center gap-1">
            <Check className="w-3.5 h-3.5" aria-hidden="true" /> Paid
          </button>
        )}
        {!b.readOnly && <button type="button" onClick={() => onEdit(b)} className="text-gray-400 hover:text-primary text-sm px-1" aria-label="Edit"><Pencil className="w-4 h-4" aria-hidden="true" /></button>}
        {!b.readOnly && <button type="button" onClick={() => onDelete(b.id)} disabled={deletingId === b.id} className="text-gray-400 hover:text-red-600 text-sm px-1 disabled:opacity-50" title={deletingId === b.id ? 'Deleting...' : 'Delete'} aria-label="Delete">{deletingId === b.id ? <Hourglass className="w-4 h-4" aria-hidden="true" /> : <Trash2 className="w-4 h-4" aria-hidden="true" />}</button>}
      </div>
    </div>
  );
}

// ─── Section ── hoisted alongside BillRow for the same reason.
interface SectionProps {
  title: string;
  Icon?: LucideIcon;
  items: BillItem[];
  color: string;
  now: number;
  deletingId: number | null;
  onPaid: (id: number) => void;
  onEdit: (b: BillItem) => void;
  onDelete: (id: number) => void;
}

function Section({ title, Icon, items, color, now, deletingId, onPaid, onEdit, onDelete }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className={`text-base font-semibold mb-3 ${color} inline-flex items-center gap-2`}>
        {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        {title} <span className="text-gray-400 font-normal">({items.length})</span>
      </h2>
      <div className="space-y-2">
        {items.map(b => <BillRow key={b.id} b={b} now={now} deletingId={deletingId} onPaid={onPaid} onEdit={onEdit} onDelete={onDelete} />)}
      </div>
    </div>
  );
}

/**
 * R37 (2026-04-30): per-frequency breakdown card for the bills page.
 *
 * Founder feedback: "When I click on monthly or quarterly, I am still
 * not see the breakdown of the amounts, so there is a gap there."
 *
 * Renders one row per frequency (Monthly / Quarterly / Yearly / etc)
 * with:
 *   • count of bills
 *   • absolute total (e.g. quarterly total = sum of quarterly amounts)
 *   • monthly-equivalent so users can compare across frequencies
 *
 * Each row expands on click to show the actual bills, sorted by amount.
 */
type FreqEntry = {
  count: number;
  total: number;
  monthlyEquivalent: number;
  items: BillItem[];
};
function FrequencyBreakdownCard({
  entries,
  freqLabels,
  fmt,
}: {
  entries: [string, FreqEntry][];
  freqLabels: Record<string, string>;
  fmt: (n: number) => string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="bg-white rounded-2xl shadow-sm mb-5 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Breakdown by frequency</h2>
        <p className="text-xs text-gray-500 mt-0.5">Click a row to see the bills that make up that frequency.</p>
      </div>
      <ul className="divide-y divide-gray-100">
        {entries.map(([freq, entry]) => {
          const isOpen = expanded === freq;
          return (
            <li key={freq}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : freq)}
                className="w-full px-5 py-3 flex justify-between items-center hover:bg-gray-50 transition text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-wide ${isOpen ? 'text-primary' : 'text-gray-500'}`}>
                    {isOpen ? '▾' : '▸'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{freqLabels[freq] ?? freq}</p>
                    <p className="text-xs text-gray-500">{entry.count} bill{entry.count === 1 ? '' : 's'} · ~{fmt(entry.monthlyEquivalent)}/mo</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{fmt(entry.total)}</p>
              </button>
              {isOpen && (
                <ul className="bg-gray-50 px-5 py-2">
                  {entry.items
                    .slice()
                    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
                    .map((b) => (
                      <li key={b.id} className="flex justify-between items-center py-1.5">
                        <span className="text-sm text-gray-700">{b.name || '(unnamed bill)'}</span>
                        <span className="text-sm font-medium text-gray-900">{fmt(b.amount)}</span>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function BillsPage() {
  const { fmt } = useCurrency();
  const [bills, setBills]           = useState<BillItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editBill, setEditBill]     = useState<BillItem | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // 2026-05-02: lock body scroll while any modal is open.
  useBodyScrollLock(showForm || deleteConfirmation !== null);
  const { toast } = useToast();

  // ── Modal accessibility: focus trap + Escape close ──────────────────────
  const formModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(formModalRef, showForm);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(deleteModalRef, deleteConfirmation !== null);
  useEffect(() => {
    if (!showForm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowForm(false); setEditBill(null); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showForm]);
  useEffect(() => {
    if (deleteConfirmation === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeleteConfirmation(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [deleteConfirmation]);

  const load = useCallback(() => {
    setLoading(true);
    api.getBills()
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          return;
        }
        setBills(Array.isArray(d?.bills) ? d.bills : Array.isArray(d) ? d : []);
      })
      .catch(() => toast('Failed to load bills', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => { load(); }, [load]);

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
      // Validate amount: must be finite, positive, and reasonable
      if (!Number.isFinite(amt) || amt <= 0) { toast('Bill amount must be a positive number', 'error'); setSaving(false); return; }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (amt > MAX_VALUE) { toast(`Bill amount cannot exceed $${MAX_VALUE.toLocaleString()}`, 'error'); setSaving(false); return; }
      // Check decimal precision (max 2 decimal places for currency)
      if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
        toast('Please enter an amount with up to 2 decimal places', 'error');
        setSaving(false);
        return;
      }
      const day = parseInt(form.dueDay, 10);
      if (isNaN(day) || day < 1 || day > 31) { toast('Due day must be between 1 and 31', 'error'); setSaving(false); return; }
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
    try {
      await api.markBillPaid(id);
      toast('Bill marked as paid', 'success');
      load();
    } catch {
      toast('Failed to mark bill as paid', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation === null) return;
    const id = deleteConfirmation;
    setDeleteConfirmation(null);
    setDeletingId(id);
    try {
      await api.deleteBill(id);
      toast('Bill deleted', 'success');
    } catch {
      toast('Failed to delete bill', 'error');
    } finally {
      setDeletingId(null);
      load();
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
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
    if (b.frequency === 'one_time' || b.frequency === 'one-time') return s;
    return s + b.amount;
  }, 0);

  // R37 (2026-04-30): per-frequency totals so the founder can see WHAT
  // makes up the "Est. Monthly" number. Founder feedback: "When I click
  // on monthly or quarterly, I am still not see the breakdown of the
  // amounts." Group bills by frequency, sort by monthly equivalent
  // descending. The card below the stats row exposes this.
  const FREQ_LABELS: Record<string, string> = {
    weekly:     'Weekly',
    monthly:    'Monthly',
    quarterly:  'Quarterly',
    yearly:     'Yearly',
    one_time:   'One-time',
    'one-time': 'One-time',
  };
  function freqMonthlyEquivalent(amount: number, frequency: string): number {
    if (frequency === 'monthly')    return amount;
    if (frequency === 'quarterly')  return amount / 3;
    if (frequency === 'yearly')     return amount / 12;
    if (frequency === 'weekly')     return amount * 4.33;
    return 0;
  }
  const byFrequency: Record<string, { count: number; total: number; monthlyEquivalent: number; items: typeof bills }> = {};
  for (const b of bills) {
    const key = b.frequency || 'monthly';
    if (!byFrequency[key]) byFrequency[key] = { count: 0, total: 0, monthlyEquivalent: 0, items: [] };
    byFrequency[key].count += 1;
    byFrequency[key].total += b.amount;
    byFrequency[key].monthlyEquivalent += freqMonthlyEquivalent(b.amount, key);
    byFrequency[key].items.push(b);
  }
  const frequencyEntries = Object.entries(byFrequency)
    .sort((a, b) => b[1].monthlyEquivalent - a[1].monthlyEquivalent);

  return (
    <div>
      <PageHeader
        title="Bills & Reminders"
        subtitle="Upcoming dues with overdue alerts and recurring schedules"
        actions={
          <button type="button" onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">+ Add Bill</button>
        }
      />

      {/* Stats.
          R42 (2026-05-01): viewTransitionName matches the dashboard's
          Upcoming Bills card so the morph completes on arrival. */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        style={{ viewTransitionName: 'bills-hero' }}
      >
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">Total Bills</p>
          <p className="text-2xl font-bold text-primary">{bills.length}</p>
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

      {/*
        R37 (2026-04-30): per-frequency breakdown card. Closes the gap
        flagged in the founder's review: "When I click on monthly or
        quarterly, I am still not see the breakdown of the amounts."
        Each row is expandable so the user can see the actual bills
        making up the per-frequency total.
      */}
      {frequencyEntries.length > 0 && (
        <FrequencyBreakdownCard
          entries={frequencyEntries}
          freqLabels={FREQ_LABELS}
          fmt={fmt}
        />
      )}

      {/* Overdue alert banner */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-7 h-7 text-red-600 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-red-800">You have {overdue.length} overdue bill{overdue.length > 1 ? 's' : ''}</p>
            <p className="text-sm text-red-700 mt-0.5">Mark them as paid once you&apos;ve settled them.</p>
          </div>
        </div>
      )}

      {/* Sections */}
      <Section title="Overdue"       Icon={AlertCircle}   items={overdue}   color="text-red-700"    now={now} deletingId={deletingId} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} />
      <Section title="Due This Week" Icon={Clock}         items={upcoming}  color="text-orange-600" now={now} deletingId={deletingId} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} />
      <Section title="Upcoming"      Icon={Calendar}      items={future}    color="text-gray-700"   now={now} deletingId={deletingId} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} />
      <Section title="Scheduled"     Icon={ClipboardList} items={noDueDate} color="text-gray-500"   now={now} deletingId={deletingId} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} />
      <Section title="Paid"          Icon={CheckCircle}   items={paid}      color="text-green-700"  now={now} deletingId={deletingId} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} />

      {bills.length === 0 && (
        <EmptyState
          illustration="receipt"
          title="No bills added yet"
          description="Track your recurring bills so you never miss a due date — Barakah sends a reminder 3 days before each one."
          actions={[
            { label: '+ Add bill', onClick: openAdd, primary: true },
            { label: 'Auto-detect from bank', href: '/dashboard/import' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { name: 'Mortgage', amt: '$1,840.00', due: 'Due in 5 days', status: 'upcoming' },
                { name: 'Internet', amt: '$79.99', due: 'Due tomorrow', status: 'soon' },
                { name: 'Phone', amt: '$45.00', due: 'Paid', status: 'paid' },
              ].map((b) => (
                <div key={b.name} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-700">{b.name}</p>
                    <p className={`text-xs ${b.status === 'soon' ? 'text-orange-600' : b.status === 'paid' ? 'text-emerald-600' : 'text-gray-400'}`}>{b.due}</p>
                  </div>
                  <span className="font-semibold text-gray-700">{b.amt}</span>
                </div>
              ))}
            </div>
          }
        />
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{editBill ? 'Edit Bill' : 'Add Bill'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                  placeholder="e.g. Electric Bill"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number" step="0.01" min="0"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={e => setForm({ ...form, frequency: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
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
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                aria-label="Close add bill modal"
                onClick={() => { setShowForm(false); setEditBill(null); }}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.name || !form.amount}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editBill ? 'Save Changes' : 'Add Bill')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deleteConfirmation !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <Trash2 className="w-7 h-7 text-red-600 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h3 id="modal-title" className="font-bold text-gray-900">Delete bill?</h3>
                <p className="text-sm text-gray-600 mt-1">This bill will be permanently deleted and cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Close delete bill modal"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId === deleteConfirmation}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deletingId === deleteConfirmation ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
