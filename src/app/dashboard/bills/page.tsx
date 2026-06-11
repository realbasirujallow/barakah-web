'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import ModalShell from '../../../components/ui/ModalShell';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n, t as tStandalone, tFmt as tFmtStandalone } from '../../../lib/i18n';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';

interface BillItem {
  id: number; name: string; category: string; amount: number;
  frequency: string; dueDay: number; paid: boolean; nextDueDate: number;
  readOnly?: boolean; linkedSource?: string | null; description?: string;
  sourceLabel?: string; minimumPaymentDue?: number; statementBalance?: number;
  // 2026-05-13: backend now exposes the subscription detector's bucket
  // key (with "::CCY" suffix) separately from the clean displayName.
  // FE displays `name` (clean) but sends `dismissKey` (bucket key)
  // when the user taps "Not a subscription" so the dismissed_subscriptions
  // row matches the key the detector checks against.
  dismissKey?: string;
  // 2026-05-13: when linkedSource === 'subscription_detector', the row
  // is a synthetic bill emitted by SubscriptionDetectionService. Users
  // can mark it as "not a subscription" via POST /api/subscriptions/dismiss
  // which persists the merchant name in dismissed_subscriptions and the
  // detector skips it on every subsequent run.
}

const FREQS = ['weekly', 'monthly', 'quarterly', 'yearly', 'one_time'];

const FREQ_KEY_MAP: Record<string, string> = {
  weekly: 'billsFreqWeekly', monthly: 'billsFreqMonthly', quarterly: 'billsFreqQuarterly',
  yearly: 'billsFreqYearly', one_time: 'billsFreqOneTime', 'one-time': 'billsFreqOneTime',
};

const CATEGORIES: { value: string; labelKey: string; icon: string }[] = [
  { value: 'utilities',      labelKey: 'billsCatUtilities',     icon: '💡' },
  { value: 'housing',        labelKey: 'billsCatHousing',       icon: '🏠' },
  { value: 'internet',       labelKey: 'billsCatInternet',      icon: '📡' },
  { value: 'insurance',      labelKey: 'billsCatInsurance',     icon: '🛡️' },
  { value: 'subscriptions',  labelKey: 'billsCatSubscriptions', icon: '📱' },
  { value: 'healthcare',     labelKey: 'billsCatHealthcare',    icon: '🏥' },
  { value: 'education',      labelKey: 'billsCatEducation',     icon: '📚' },
  { value: 'transport',      labelKey: 'billsCatTransport',     icon: '🚗' },
  { value: 'debt',           labelKey: 'billsCatDebt',          icon: '💳' },
  { value: 'charity',        labelKey: 'billsCatCharity',       icon: '🤲' },
  { value: 'other',          labelKey: 'billsCatOther',         icon: '📋' },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

function getCatIcon(cat: string) {
  return CAT_MAP[cat]?.icon ?? '📋';
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
  if (!bill.nextDueDate) return tFmtStandalone('billsDayPrefixFmt', [bill.dueDay]);
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
  dismissingName: string | null;
  onPaid: (id: number) => void;
  onEdit: (b: BillItem) => void;
  onDelete: (id: number) => void;
  onDismissDetected: (b: BillItem) => void;
}

function BillRow({ b, now, deletingId, dismissingName, onPaid, onEdit, onDelete, onDismissDetected }: BillRowProps) {
  const { fmt } = useCurrency();
  const days = getDaysUntilDue(b);
  const isOverdue  = b.nextDueDate && b.nextDueDate < now && !b.paid;
  const isUpcoming = !isOverdue && days !== null && days <= 7 && !b.paid;
  // 2026-05-13: detected-subscription rows can be dismissed by the user
  // ("this isn't actually a subscription"). Other read-only rows (e.g.
  // Plaid-linked liability payments) are not dismissible because their
  // source is the bank's own statement, not a heuristic guess.
  const isDetectedSubscription = b.readOnly && b.linkedSource === 'subscription_detector';
  const isDismissing = isDetectedSubscription && dismissingName === b.name;

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center border-l-4 ${
      b.paid ? 'border-green-400 bg-green-50' :
      isOverdue ? 'border-red-500' :
      isUpcoming ? 'border-orange-400' :
      'border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getCatIcon(b.category)}</span>
        <div>
          <p className="font-semibold text-gray-900">{b.name}</p>
          <p className="text-sm text-gray-500">
            {CAT_MAP[b.category] ? tStandalone(CAT_MAP[b.category].labelKey) : b.category} • {tStandalone(FREQ_KEY_MAP[b.frequency] ?? '') || b.frequency}
            {b.nextDueDate && !b.paid && (
              <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : isUpcoming ? 'text-orange-600' : 'text-gray-500'}`}>
                • {isOverdue ? tFmtStandalone('billsOverduePrefixFmt', [formatDueDate(b)]) : days === 0 ? tFmtStandalone('billsDueTodayPrefixFmt', [formatDueDate(b)]) : (days !== null && days <= 7 ? tFmtStandalone('billsDueWithDaysFmt', [formatDueDate(b), days]) : tFmtStandalone('billsDuePrefixFmt', [formatDueDate(b)]))}
              </span>
            )}
            {b.paid && <span className="ml-2 text-green-600 font-medium">{tStandalone('billsPaidBadge')}</span>}
          </p>
          {b.readOnly && (
            <p className="text-xs text-gray-400 mt-1">
              {b.sourceLabel ?? tStandalone('billsLinkedReminder')}{b.description ? ` • ${b.description}` : ''}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-lg font-bold ${b.paid ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
          {fmt(b.amount)}
        </p>
        {!b.paid && !b.readOnly && (
          <button type="button" onClick={() => onPaid(b.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 whitespace-nowrap">
            {tStandalone('billsPaidBtn')}
          </button>
        )}
        {!b.readOnly && <button type="button" onClick={() => onEdit(b)} className="text-gray-400 hover:text-primary text-sm px-1">✏️</button>}
        {!b.readOnly && <button type="button" onClick={() => onDelete(b.id)} disabled={deletingId === b.id} className="text-gray-400 hover:text-red-600 text-sm px-1 disabled:opacity-50" title={deletingId === b.id ? tStandalone('billsDeleting') : tStandalone('billsDeleteTitleSimple')}>{deletingId === b.id ? '⏳' : '🗑️'}</button>}
        {/* 2026-05-13: dismiss action for detected-subscription rows. Tells
            the backend to add this merchant to dismissed_subscriptions so
            the detector stops surfacing it under Bills / Subscriptions on
            every subsequent run. */}
        {isDetectedSubscription && (
          <button
            type="button"
            onClick={() => onDismissDetected(b)}
            disabled={isDismissing}
            className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1 hover:border-red-300 hover:text-red-600 transition disabled:opacity-50 whitespace-nowrap"
            title={tStandalone('billsDismissTitle')}
          >
            {isDismissing ? tStandalone('billsDismissingBtn') : tStandalone('billsDismissBtn')}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Section ── hoisted alongside BillRow for the same reason.
interface SectionProps {
  title: string;
  items: BillItem[];
  color: string;
  now: number;
  deletingId: number | null;
  dismissingName: string | null;
  onPaid: (id: number) => void;
  onEdit: (b: BillItem) => void;
  onDelete: (id: number) => void;
  onDismissDetected: (b: BillItem) => void;
}

function Section({ title, items, color, now, deletingId, dismissingName, onPaid, onEdit, onDelete, onDismissDetected }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className={`text-base font-semibold mb-3 ${color}`}>{title} <span className="text-gray-400 font-normal">({items.length})</span></h2>
      <div className="space-y-2">
        {items.map(b => (
          <BillRow
            key={b.id}
            b={b}
            now={now}
            deletingId={deletingId}
            dismissingName={dismissingName}
            onPaid={onPaid}
            onEdit={onEdit}
            onDelete={onDelete}
            onDismissDetected={onDismissDetected}
          />
        ))}
      </div>
    </div>
  );
}

// ─── BillsCalendar ── 2026-06-11 Monarch parity: month-grid view of bills.
// Hoisted to module scope for the same remount-prevention reason as BillRow.
// Each bill renders as a small chip on its due-date cell; clicking a chip
// opens the same edit modal the list rows use (readOnly rows stay inert,
// matching the list view which hides their edit button).
interface BillsCalendarProps {
  bills: BillItem[];
  year: number;
  month: number; // 0-based
  now: number;
  dateLocale?: string;
  fmt: (n: number) => string;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (b: BillItem) => void;
}

function BillsCalendar({ bills, year, month, now, dateLocale, fmt, onPrev, onNext, onEdit }: BillsCalendarProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  // Weekday headers in the user's locale — 2024-01-07 is a Sunday, so
  // offsetting it 0..6 days yields Sun..Sat labels without hardcoding.
  const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2024, 0, 7 + i)).toLocaleDateString(dateLocale, { weekday: 'short', timeZone: 'UTC' }));

  // Bucket bills by day-of-month. nextDueDate is the source of truth (read
  // with UTC accessors, matching formatDueDate/getDaysUntilDue); bills
  // without one fall back to their recurring dueDay, clamped to the
  // displayed month's length (e.g. dueDay 31 lands on Feb 28).
  const byDay = new Map<number, BillItem[]>();
  for (const b of bills) {
    let day: number | null = null;
    if (b.nextDueDate) {
      const d = new Date(b.nextDueDate);
      if (d.getUTCFullYear() === year && d.getUTCMonth() === month) day = d.getUTCDate();
    } else if (b.dueDay) {
      day = Math.min(b.dueDay, daysInMonth);
    }
    if (day === null) continue;
    const list = byDay.get(day) ?? [];
    list.push(b);
    byDay.set(day, list);
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const monthLabel = new Date(year, month, 1).toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });
  // Keep cells clean: at most 3 chips, then a "+N more" line.
  const MAX_CHIPS = 3;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onPrev}
          aria-label={tStandalone('billsCalPrevMonth')}
          className="px-2.5 py-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary text-lg leading-none"
        >
          ‹
        </button>
        <h2 className="text-base font-semibold text-gray-900">{monthLabel}</h2>
        <button
          type="button"
          onClick={onNext}
          aria-label={tStandalone('billsCalNextMonth')}
          className="px-2.5 py-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary text-lg leading-none"
        >
          ›
        </button>
      </div>
      {/* Horizontal scroll on small screens keeps the 7-column grid intact. */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-7 mb-1">
            {weekdayLabels.map(w => (
              <div key={w} className="text-center text-xs font-semibold text-gray-500 py-1">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }, (_, i) => (
              <div key={`pad-${i}`} className="min-h-[84px] rounded-lg bg-gray-50/50" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = isCurrentMonth && today.getDate() === day;
              const dayBills = byDay.get(day) ?? [];
              return (
                <div
                  key={day}
                  className={`min-h-[84px] rounded-lg border p-1 ${isToday ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50/50'}`}
                >
                  <p className={`text-xs font-semibold mb-1 px-0.5 ${isToday ? 'text-primary' : 'text-gray-500'}`}>{day}</p>
                  <div className="space-y-0.5">
                    {dayBills.slice(0, MAX_CHIPS).map(b => {
                      const days = getDaysUntilDue(b);
                      const isOverdue = b.nextDueDate && b.nextDueDate < now && !b.paid;
                      const isUpcoming = !isOverdue && days !== null && days <= 7 && !b.paid;
                      // Mirrors the list rows' border accents: red for
                      // overdue, orange ≤7 days out, green when paid.
                      const chipCls = b.paid
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : isOverdue
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : isUpcoming
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-white text-gray-700 border-gray-200';
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => { if (!b.readOnly) onEdit(b); }}
                          disabled={b.readOnly}
                          title={`${b.name} • ${fmt(b.amount)}`}
                          className={`block w-full text-start text-[11px] leading-tight rounded border px-1 py-0.5 truncate ${chipCls} ${b.readOnly ? 'cursor-default' : 'hover:ring-1 hover:ring-primary/40'}`}
                        >
                          {b.name} <span className="font-semibold whitespace-nowrap">{fmt(b.amount)}</span>
                        </button>
                      );
                    })}
                    {dayBills.length > MAX_CHIPS && (
                      <p className="text-[10px] text-gray-400 px-1">
                        {tFmtStandalone('billsCalMoreFmt', [dayBills.length - MAX_CHIPS])}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
        <h2 className="font-semibold text-gray-900">{tStandalone('billsBreakdownHeading')}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{tStandalone('billsBreakdownSubtitle')}</p>
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
                    <p className="text-xs text-gray-500">{entry.count === 1 ? tFmtStandalone('billsBreakdownBillSingularFmt', [entry.count, fmt(entry.monthlyEquivalent)]) : tFmtStandalone('billsBreakdownBillPluralFmt', [entry.count, fmt(entry.monthlyEquivalent)])}</p>
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
                        <span className="text-sm text-gray-700">{b.name || tStandalone('billsUnnamed')}</span>
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
  const { fmt, locale: dateLocale } = useCurrency();
  const [bills, setBills]           = useState<BillItem[]>([]);
  // 2026-06-11 Monarch parity: list/calendar toggle (default stays list)
  // plus the month the calendar grid is currently showing.
  const [view, setView]             = useState<'list' | 'calendar'>('list');
  const [calMonth, setCalMonth]     = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editBill, setEditBill]     = useState<BillItem | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // 2026-05-13: state for "Not a subscription" dismissal action on
  // detected-subscription rows. Tracks the in-flight merchant name so
  // the row's button can show a pending state.
  const [dismissingName, setDismissingName] = useState<string | null>(null);
  // 2026-05-02: lock body scroll while any modal is open.
  useBodyScrollLock(showForm || deleteConfirmation !== null);
  const { toast } = useToast();
  const { t, tFmt } = useI18n();

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

  // 2026-06-08 (UX-WEB-LISTS-NORETRY-1): persistent error + retry.
  const [loadError, setLoadError] = useState<string | null>(null);
  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    api.getBills()
      .then(d => {
        if (d?.error) {
          toast(d.error as string, 'error');
          setLoadError(d.error as string);
          return;
        }
        setBills(Array.isArray(d?.bills) ? d.bills : Array.isArray(d) ? d : []);
      })
      .catch(() => {
        const msg = t('billsLoadError');
        toast(msg, 'error');
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
    // `t` is a fresh identity each render; including it would make `load` a new
    // function every render and the `[load]` effect refire forever. Keep `toast`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (!Number.isFinite(amt) || amt <= 0) { toast(t('billsAmountPositiveError'), 'error'); setSaving(false); return; }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (amt > MAX_VALUE) { toast(tFmt('billsAmountMaxErrorFmt', [`$${MAX_VALUE.toLocaleString()}`]), 'error'); setSaving(false); return; }
      // Check decimal precision (max 2 decimal places for currency)
      if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
        toast(t('billsDecimalError'), 'error');
        setSaving(false);
        return;
      }
      const day = parseInt(form.dueDay, 10);
      if (isNaN(day) || day < 1 || day > 31) { toast(t('billsDueDayError'), 'error'); setSaving(false); return; }
      const payload = { ...form, amount: amt, dueDay: day };
      if (editBill) {
        await api.updateBill(editBill.id, payload);
        toast(t('billsUpdated'), 'success');
      } else {
        await api.addBill(payload);
        toast(t('billsAdded'), 'success');
      }
      setShowForm(false);
      setEditBill(null);
      setForm(emptyForm);
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('billsSaveError');
      toast(msg, 'error');
    }
    setSaving(false);
  };

  const handlePaid = async (id: number) => {
    try {
      await api.markBillPaid(id);
      toast(t('billsPaidToast'), 'success');
      load();
    } catch {
      toast(t('billsPaidError'), 'error');
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
      toast(t('billsDeletedToast'), 'success');
    } catch {
      toast(t('billsDeleteError'), 'error');
    } finally {
      setDeletingId(null);
      load();
    }
  };

  /**
   * 2026-05-13: handler for "Not a subscription" button on detected-
   * subscription rows. Calls the existing
   * `POST /api/subscriptions/dismiss` endpoint, which persists the
   * merchant in the `dismissed_subscriptions` table. The next time
   * `BillService.listSyntheticBills` runs, the detector loads dismissed
   * names and skips this merchant — so the row stops showing up under
   * Bills (and on the Subscription Detector page) for good.
   *
   * No optimistic UI: we wait for the server then reload the bills
   * list so totals + section counts stay consistent.
   */
  const handleDismissDetected = async (b: BillItem) => {
    if (!b.name) return;
    setDismissingName(b.name);
    try {
      // 2026-05-13 SUB-001: dispatch the bucket key (b.dismissKey)
      // when present so the dismissed_subscriptions row matches the
      // detector's check. Fall back to b.name for older backend
      // responses that don't yet expose dismissKey.
      const keyForDismissal = b.dismissKey ?? b.name;
      await api.dismissSubscription(keyForDismissal, 'user_marked_not_a_subscription');
      toast(tFmt('billsDismissSuccessFmt', [b.name]), 'success');
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('billsDismissError');
      toast(msg, 'error');
    } finally {
      setDismissingName(null);
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
    weekly:     t('billsFreqWeekly'),
    monthly:    t('billsFreqMonthly'),
    quarterly:  t('billsFreqQuarterly'),
    yearly:     t('billsFreqYearly'),
    one_time:   t('billsFreqOneTime'),
    'one-time': t('billsFreqOneTime'),
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
        title={t('billsTitle')}
        subtitle={t('billsSubtitle')}
        actions={
          <button type="button" onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('billsAddBtn')}</button>
        }
      />

      {/* 2026-06-08 (UX-WEB-LISTS-NORETRY-1): persistent error + retry. */}
      {loadError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-800 flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={load}
            className="shrink-0 bg-yellow-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-800 transition"
          >
            {t('zktRetry')}
          </button>
        </div>
      )}

      {/* Stats.
          R42 (2026-05-01): viewTransitionName matches the dashboard's
          Upcoming Bills card so the morph completes on arrival. */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        style={{ viewTransitionName: 'bills-hero' }}
      >
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">{t('billsTotalBills')}</p>
          <p className="text-2xl font-bold text-primary">{bills.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">{t('billsOverdueLabel')}</p>
          <p className={`text-2xl font-bold ${overdue.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>{overdue.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">{t('billsDueThisWeek')}</p>
          <p className={`text-2xl font-bold ${upcoming.length > 0 ? 'text-orange-500' : 'text-gray-400'}`}>{upcoming.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-gray-500 text-xs">{t('billsEstMonthly')}</p>
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
          <span className="text-2xl">⚠️</span>
          <div>
            {/* 2026-05-12 overnight QA (BL-004): pluralisation was
                inconsistent — title pluralised correctly ("overdue bill" /
                "overdue bills") but the body always used "them / them",
                producing "You have 1 overdue bill / Mark them as paid once
                you've settled them." for single-bill accounts. Mirror the
                title's pluralisation in the body pronoun. */}
            <p className="font-semibold text-red-800">{overdue.length > 1 ? tFmt('billsOverdueTitlePluralFmt', [overdue.length]) : tFmt('billsOverdueTitleSingFmt', [overdue.length])}</p>
            <p className="text-sm text-red-700 mt-0.5">
              {overdue.length === 1 ? t('billsOverdueBodySingle') : t('billsOverdueBodyPlural')}
            </p>
          </div>
        </div>
      )}

      {/* 2026-06-11 Monarch parity: list/calendar view toggle. Default stays
          list; calendar renders the month grid below in place of sections. */}
      {bills.length > 0 && (
        <div className="flex gap-2 mb-4">
          {(['list', 'calendar'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view === v ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {v === 'list' ? `📋 ${t('billsViewList')}` : `🗓️ ${t('billsViewCalendar')}`}
            </button>
          ))}
        </div>
      )}

      {/* Sections */}
      {view === 'list' ? (
        <>
          <Section title={t('billsSectionOverdue')}      items={overdue}   color="text-red-700"    now={now} deletingId={deletingId} dismissingName={dismissingName} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} onDismissDetected={handleDismissDetected} />
          <Section title={t('billsSectionDueWeek')} items={upcoming}  color="text-orange-600" now={now} deletingId={deletingId} dismissingName={dismissingName} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} onDismissDetected={handleDismissDetected} />
          <Section title={t('billsSectionUpcoming')}     items={future}    color="text-gray-700"   now={now} deletingId={deletingId} dismissingName={dismissingName} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} onDismissDetected={handleDismissDetected} />
          <Section title={t('billsSectionScheduled')}    items={noDueDate} color="text-gray-500"   now={now} deletingId={deletingId} dismissingName={dismissingName} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} onDismissDetected={handleDismissDetected} />
          <Section title={t('billsSectionPaid')}          items={paid}      color="text-green-700"  now={now} deletingId={deletingId} dismissingName={dismissingName} onPaid={handlePaid} onEdit={openEdit} onDelete={handleDelete} onDismissDetected={handleDismissDetected} />
        </>
      ) : (
        <BillsCalendar
          bills={bills}
          year={calMonth.year}
          month={calMonth.month}
          now={now}
          dateLocale={dateLocale}
          fmt={fmt}
          onPrev={() => setCalMonth(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 })}
          onNext={() => setCalMonth(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 })}
          onEdit={openEdit}
        />
      )}

      {bills.length === 0 && (
        <EmptyState
          illustration="receipt"
          title={t('billsEmptyTitle')}
          description={t('billsEmptyDesc')}
          actions={[
            { label: t('billsEmptyAddBtn'), onClick: openAdd, primary: true },
            { label: t('billsEmptyAutoDetect'), href: '/dashboard/import' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { name: t('billsSampleName1'), amt: fmt(1840), due: t('billsSampleDue1'), status: 'upcoming' },
                { name: t('billsSampleName2'), amt: fmt(79.99), due: t('billsSampleDue2'), status: 'soon' },
                { name: t('billsSampleName3'), amt: fmt(45), due: t('billsSampleDue3'), status: 'paid' },
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
        <ModalShell onClose={() => setShowForm(false)}>
          <div
            ref={formModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 id="modal-title" className="text-xl font-bold text-primary mb-4">{editBill ? t('billsModalEditTitle') : t('billsModalAddTitle')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('billsFieldName')}</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                  placeholder={t('billsNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('billsFieldCategory')}</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {t(c.labelKey)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('billsFieldAmount')}</label>
                <input
                  type="number" step="0.01" min="0"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                  placeholder={t('billsAmountPlaceholder')}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('billsFieldFrequency')}</label>
                  <select
                    value={form.frequency}
                    onChange={e => setForm({ ...form, frequency: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
                  >
                    {FREQS.map(f => <option key={f} value={f}>{t(FREQ_KEY_MAP[f] || 'billsFreqMonthly')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('billsFieldDueDay')}</label>
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
                aria-label={t('billsCloseAddAria')}
                onClick={() => { setShowForm(false); setEditBill(null); }}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                {t('billsCancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.name || !form.amount}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? t('billsSaving') : (editBill ? t('billsSaveChanges') : t('billsAddBtnFull'))}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deleteConfirmation !== null && (
        <ModalShell onClose={() => setDeleteConfirmation(null)}>
          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🗑️</span>
              <div className="flex-1">
                <h3 id="modal-title" className="font-bold text-gray-900">{t('billsDeleteTitle')}</h3>
                <p className="text-sm text-gray-600 mt-1">{t('billsDeleteBody')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                aria-label={t('billsCloseDeleteAria')}
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 font-medium"
              >
                {t('billsCancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId === deleteConfirmation}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deletingId === deleteConfirmation ? t('billsDeletingBtn') : t('billsDelete')}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
