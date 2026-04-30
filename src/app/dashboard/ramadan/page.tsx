'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toHijri } from '../../../lib/format';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { PageHeader } from '../../../components/dashboard/PageHeader';

/* ── Hijri date calculation ──────────────────────────────────────────
   Uses the Kuwaiti algorithm (imported from format.ts for consistency).
   Accurate to ±1 day.                                                  */

/* ── Ramadan dates (Gregorian approximations for 2024–2035) ─────── */
const RAMADAN_DATES: Record<number, { start: string; end: string }> = {
  2024: { start: '2024-03-11', end: '2024-04-09' },
  2025: { start: '2025-03-01', end: '2025-03-30' },
  2026: { start: '2026-02-18', end: '2026-03-19' },
  2027: { start: '2027-02-07', end: '2027-03-08' },
  2028: { start: '2028-01-28', end: '2028-02-25' },
  2029: { start: '2029-01-17', end: '2029-02-14' },
  2030: { start: '2030-01-06', end: '2030-02-04' },
  2031: { start: '2031-12-26', end: '2032-01-24' },
  2032: { start: '2032-12-14', end: '2033-01-12' },
  2033: { start: '2033-12-04', end: '2034-01-02' },
  2034: { start: '2034-11-23', end: '2034-12-22' },
  2035: { start: '2035-11-12', end: '2035-12-11' },
};

function getRamadanStatus(now: Date): {
  inRamadan: boolean; day: number; total: number;
  start: Date | null; end: Date | null; daysUntil: number | null;
} {
  const yr = now.getFullYear();
  const rd = RAMADAN_DATES[yr] || RAMADAN_DATES[yr + 1];
  if (!rd) return { inRamadan: false, day: 0, total: 0, start: null, end: null, daysUntil: null };

  const start = new Date(rd.start);
  const end   = new Date(rd.end);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (today >= start && today <= end) {
    const day   = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
    const total = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
    return { inRamadan: true, day, total, start, end, daysUntil: 0 };
  }

  // Days until next Ramadan — returns null when we have no entry for next year
  const nextStart = today < start
    ? start
    : RAMADAN_DATES[yr + 1]?.start ? new Date(RAMADAN_DATES[yr + 1].start) : null;
  if (!nextStart) {
    return { inRamadan: false, day: 0, total: 0, start: null, end, daysUntil: null };
  }
  const daysUntil = Math.ceil((nextStart.getTime() - today.getTime()) / 86400000);
  return { inRamadan: false, day: 0, total: 0, start: nextStart, end, daysUntil };
}

/* ── Zakat al-Fitr 2025 approximate rate ──────────────────────────── */
const ZAKAT_FITR_DEFAULT = 10; // default; user can edit per their mosque

const OPTIONAL_CATEGORIES = [
  { key: 'quran',       label: 'Quran / Islamic Books',   icon: '📖', suggested: 50 },
  { key: 'iftarguest',  label: "Iftar for Guests",         icon: '🍽️', suggested: 200 },
  { key: 'itikaaf',     label: "I'tikaaf Expenses",        icon: '🕌', suggested: 100 },
  { key: 'charity',     label: 'Extra Sadaqah',            icon: '🤲', suggested: 300 },
  { key: 'clothing',    label: 'Eid Clothing',             icon: '👗', suggested: 150 },
  { key: 'gifts',       label: 'Eid Gifts',                icon: '🎁', suggested: 100 },
];

interface BudgetItem { key: string; label: string; icon: string; suggested: number; allocated: number; }

const DUAS = [
  { arabic: 'اللَّهُمَّ بَلِّغْنَا رَمَضَانَ', transliteration: 'Allahumma ballighna Ramadan', meaning: 'O Allah, let us reach Ramadan' },
  { arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", meaning: 'O Allah, You are the Pardoner, You love to pardon, so pardon me' },
  { arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ', transliteration: 'Rabbana taqabbal minna innaka antas-Sami\'ul-\'Aleem', meaning: 'Our Lord, accept from us; indeed You are the All-Hearing, the All-Knowing' },
];

// Safe localStorage helpers
const safeGetItem = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSetItem = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch { /* private browsing or quota exceeded */ }
};

export default function RamadanPage() {
  const { fmt, symbol } = useCurrency();
  const [now, setNow]                   = useState(new Date());
  const [members, setMembers]           = useState(1);
  const [fitrahPaid, setFitrahPaid]     = useState(false);
  const [budget, setBudget]             = useState<BudgetItem[]>(
    OPTIONAL_CATEGORIES.map(c => ({ ...c, allocated: c.suggested }))
  );
  const [fitrahPerPerson, setFitrahPerPerson] = useState(ZAKAT_FITR_DEFAULT);
  const [customGoal, setCustomGoal]     = useState({ label: '', amount: 0 });
  const [customGoalDraft, setCustomGoalDraft] = useState({ label: '', amount: '' });
  const [dailyNafila, setDailyNafila]   = useState<boolean[]>(Array(30).fill(false));
  const [expandDua, setExpandDua]       = useState<number | null>(null);
  const [syncStatus, setSyncStatus]     = useState<'idle' | 'saving' | 'synced' | 'error'>('idle');
  const { toast } = useToast();
  // Guard against a race where the localStorage-save effect fires on initial
  // state before the server-side load completes, overwriting the server copy.
  const hydrated = useRef(false);

  // Load goals from server on mount
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await api.getRamadanGoals();
        if (data) {
          // Populate from server data
          if (data.members) setMembers(data.members);
          if (data.fitrahPaid !== undefined) setFitrahPaid(data.fitrahPaid);
          if (data.fitrahPerPerson) setFitrahPerPerson(data.fitrahPerPerson);
          if (data.quranPages !== undefined) {
            setBudget(prev => prev.map(b =>
              b.key === 'quran' ? { ...b, allocated: data.quranPages } : b
            ));
          }
          if (data.fastingDays !== undefined) {
            setBudget(prev => prev.map(b =>
              b.key === 'iftarguest' ? { ...b, allocated: data.fastingDays } : b
            ));
          }
          if (data.sadaqahTarget) {
            setBudget(prev => prev.map(b =>
              b.key === 'charity' ? { ...b, allocated: data.sadaqahTarget } : b
            ));
          }
          if (data.extraPrayers) {
            setBudget(prev => prev.map(b =>
              b.key === 'itikaaf' ? { ...b, allocated: data.extraPrayers } : b
            ));
          }
          if (data.notes) {
            setCustomGoal({ label: 'Notes', amount: 0 });
            setCustomGoalDraft({ label: 'Notes', amount: '' });
          }
        }
      } catch {
        // Fall back to localStorage if offline
        const cached = safeGetItem('ramadan_goals');
        if (cached) {
          try {
            const data = JSON.parse(cached);
            if (data.members) setMembers(data.members);
            if (data.fitrahPaid !== undefined) setFitrahPaid(data.fitrahPaid);
            if (data.fitrahPerPerson) setFitrahPerPerson(data.fitrahPerPerson);
          } catch {
            // Silent fail on localStorage parse error
          }
        }
      } finally {
        hydrated.current = true;
      }
    };
    loadGoals();
  }, []);

  // Save to localStorage as cache — skip until server hydration completes
  useEffect(() => {
    if (!hydrated.current) return;
    safeSetItem('ramadan_goals', JSON.stringify({
      members,
      fitrahPaid,
      fitrahPerPerson,
      quranPages: budget.find(b => b.key === 'quran')?.allocated || 0,
      fastingDays: budget.find(b => b.key === 'iftarguest')?.allocated || 0,
      sadaqahTarget: budget.find(b => b.key === 'charity')?.allocated || 0,
      extraPrayers: budget.find(b => b.key === 'itikaaf')?.allocated || 0,
      notes: customGoal.label,
    }));
  }, [members, fitrahPaid, fitrahPerPerson, budget, customGoal]);

  // Save to server
  const saveToServer = async () => {
    setSyncStatus('saving');
    try {
      await api.saveRamadanGoals({
        members,
        fitrahPaid,
        fitrahPerPerson,
        quranPages: budget.find(b => b.key === 'quran')?.allocated || 0,
        fastingDays: budget.find(b => b.key === 'iftarguest')?.allocated || 0,
        sadaqahTarget: budget.find(b => b.key === 'charity')?.allocated || 0,
        extraPrayers: budget.find(b => b.key === 'itikaaf')?.allocated || 0,
        notes: customGoal.label,
      });
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch {
      setSyncStatus('error');
      toast('Failed to sync goals', 'error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hijri = toHijri(now);
  const ramadan = getRamadanStatus(now);
  const totalBudget = budget.reduce((s, b) => s + b.allocated, 0);
  const fitrahTotal = members * fitrahPerPerson;
  const grandTotal  = totalBudget + customGoal.amount + (fitrahPaid ? 0 : fitrahTotal);

  const updateBudget = (key: string, val: number) => {
    setBudget(prev => prev.map(b => b.key === key ? { ...b, allocated: val } : b));
  };

  const toggleNafila = (i: number) => {
    setDailyNafila(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const nafilaCount   = dailyNafila.filter(Boolean).length;
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Ramadan Mode"
        subtitle={`${hijri.day} ${hijri.monthName} ${hijri.year} AH · ${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
      />

      {/* Ramadan status card */}
      {ramadan.inRamadan ? (
        <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
          <p className="text-green-200 text-sm">Ramadan Mubarak 🌙</p>
          <p className="text-4xl font-bold mt-1">Day {ramadan.day}</p>
          <div className="mt-3">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(ramadan.day / ramadan.total) * 100}%` }}
              />
            </div>
            <p className="text-green-200 text-xs mt-1">{ramadan.day} of {ramadan.total} days · {ramadan.total - ramadan.day} remaining</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 text-center">
          <p className="text-4xl mb-2">🌙</p>
          <p className="text-lg font-semibold text-primary">
            {ramadan.daysUntil !== null
              ? ramadan.daysUntil === 0
                ? 'Ramadan starts today!'
                : `${ramadan.daysUntil} days until Ramadan`
              : 'Ramadan date not available'}
          </p>
          {ramadan.start && (
            <p className="text-gray-500 text-sm mt-1">
              Expected to begin {ramadan.start.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              <span className="text-xs text-gray-400 ml-1">(subject to moon sighting)</span>
            </p>
          )}
        </div>
      )}

      {/* Zakat al-Fitr Calculator */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <h2 className="font-bold text-primary mb-3">Zakat al-Fitr</h2>
        <p className="text-sm text-gray-600 mb-4">
          Obligatory charity paid before Eid al-Fitr prayer. Enter the amount your mosque specifies — typically $10–$15 per person based on staple food equivalent.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Amount per person ({symbol})</label>
            <input
              type="number" min="1" step="1" value={fitrahPerPerson}
              onChange={e => setFitrahPerPerson(Math.max(1, parseFloat(e.target.value) || ZAKAT_FITR_DEFAULT))}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-0.5">Default {symbol}10 — edit per your mosque</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Family members</label>
            <input
              type="number" min="1" max="20" value={members}
              onChange={e => setMembers(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="flex justify-between items-center bg-amber-50 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm text-amber-800">{members} person{members > 1 ? 's' : ''} × {symbol}{fitrahPerPerson}</span>
          <span className="text-xl font-bold text-primary">{fmt(fitrahTotal)}</span>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox" checked={fitrahPaid}
            onChange={e => setFitrahPaid(e.target.checked)}
            className="w-4 h-4 accent-[#1B5E20]"
          />
          <span className={fitrahPaid ? 'line-through text-gray-400' : 'text-gray-700'}>
            Zakat al-Fitr paid ✓
          </span>
        </label>
      </div>

      {/* Ramadan Budget Planner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <h2 className="font-bold text-primary mb-1">Ramadan Budget Planner</h2>
        <p className="text-xs text-gray-500 mb-4">Plan extra Ramadan spending. Adjust amounts for your situation.</p>
        <div className="space-y-3">
          {budget.map(b => (
            <div key={b.key} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center">{b.icon}</span>
              <span className="flex-1 text-sm text-gray-700">{b.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm">{symbol}</span>
                <input
                  type="number" min="0" step="10" value={b.allocated}
                  onChange={e => updateBudget(b.key, Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 border rounded-lg px-2 py-1.5 text-sm text-gray-900 text-right focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Custom goal */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">+ Custom Goal</p>
          <div className="flex gap-2">
            <input
              type="text" placeholder="e.g. Night of Power donation"
              value={customGoalDraft.label}
              onChange={e => setCustomGoalDraft(d => ({ ...d, label: e.target.value }))}
              className="flex-1 border rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-primary"
            />
            <div className="flex items-center gap-1 border rounded-lg px-2 py-1.5 bg-white">
              <span className="text-gray-400 text-sm">{symbol}</span>
              <input
                type="number" min="0" step="10" placeholder="0"
                value={customGoalDraft.amount}
                onChange={e => setCustomGoalDraft(d => ({ ...d, amount: e.target.value }))}
                className="w-16 text-sm text-gray-900 text-right focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (!customGoalDraft.label) return;
                setCustomGoal({ label: customGoalDraft.label, amount: parseFloat(customGoalDraft.amount) || 0 });
                setCustomGoalDraft({ label: '', amount: '' });
              }}
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:bg-primary/90 font-medium whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {customGoal.label && (
            <div className="flex items-center justify-between mt-2 bg-green-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="text-sm font-medium text-gray-700">{customGoal.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">{fmt(customGoal.amount)}</span>
                <button onClick={() => setCustomGoal({ label: '', amount: 0 })} className="text-gray-300 hover:text-red-500 text-xs">✕</button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Total (excl. Fitrah)</span>
          <span className="text-lg font-bold text-gray-900">{fmt(totalBudget)}</span>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={saveToServer}
            disabled={syncStatus === 'saving'}
            className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50 font-medium text-sm"
          >
            {syncStatus === 'saving' ? 'Saving...' : 'Save & Sync'}
          </button>
          {syncStatus === 'synced' && (
            <div className="flex-1 bg-green-50 text-green-700 rounded-lg py-2 text-center text-sm font-medium">
              ✓ Synced
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="flex-1 bg-red-50 text-red-700 rounded-lg py-2 text-center text-sm font-medium">
              ✕ Sync failed
            </div>
          )}
        </div>
        {customGoal.label && (
          <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
            <span>✨ {customGoal.label}</span>
            <span className="font-semibold">{fmt(customGoal.amount)}</span>
          </div>
        )}
        {!fitrahPaid && (
          <div className="flex justify-between items-center mt-1 text-sm text-primary">
            <span>🕌 Zakat al-Fitr ({members} × {symbol}{fitrahPerPerson})</span>
            <span className="font-semibold">{fmt(fitrahTotal)}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-primary/20">
          <span className="font-bold text-primary">Grand Total</span>
          <span className="text-xl font-bold text-primary">{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Daily Nafila Tracker */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-primary">Daily Nawafil Tracker</h2>
          <span className="text-sm text-gray-500">{nafilaCount}/{ramadan.inRamadan ? ramadan.day : 30} days</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Track your extra voluntary prayers and worship during Ramadan</p>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }, (_, i) => {
            const isToday = ramadan.inRamadan && i + 1 === ramadan.day;
            const isFuture = ramadan.inRamadan && i + 1 > ramadan.day;
            return (
              <button
                key={i}
                onClick={() => !isFuture && toggleNafila(i)}
                title={`Day ${i + 1}`}
                disabled={isFuture}
                className={`aspect-square rounded-md text-xs font-medium transition ${
                  isFuture ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                  dailyNafila[i] ? 'bg-primary text-primary-foreground' :
                  isToday ? 'bg-green-100 text-primary border-2 border-primary' :
                  'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Tap a day to mark your nawafil complete
        </p>
      </div>

      {/* Duas for Ramadan */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <h2 className="font-bold text-primary mb-3">Ramadan Du&apos;as</h2>
        <div className="space-y-2">
          {DUAS.map((dua, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex justify-between items-center"
                onClick={() => setExpandDua(expandDua === i ? null : i)}
              >
                <span className="text-sm font-medium text-gray-800">{dua.meaning}</span>
                <span className="text-gray-400 text-sm ml-2">{expandDua === i ? '▲' : '▼'}</span>
              </button>
              {expandDua === i && (
                <div className="px-4 pb-4 pt-1 bg-green-50">
                  <p className="text-right text-xl text-gray-800 font-arabic leading-relaxed mb-2">{dua.arabic}</p>
                  <p className="text-sm text-gray-600 italic mb-1">{dua.transliteration}</p>
                  <p className="text-xs text-gray-500">{dua.meaning}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/dashboard/zakat" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3">
          <span className="text-2xl">🕌</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Zakat Calculator</p>
            <p className="text-xs text-gray-500">Compute your full Zakat</p>
          </div>
        </Link>
        <Link href="/dashboard/sadaqah" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3">
          <span className="text-2xl">🤲</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Sadaqah Log</p>
            <p className="text-xs text-gray-500">Track your charity</p>
          </div>
        </Link>
        <Link href="/dashboard/prayer-times" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3">
          <span className="text-2xl">🕌</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Prayer Times</p>
            <p className="text-xs text-gray-500">Suhoor &amp; Iftar times</p>
          </div>
        </Link>
        <Link href="/dashboard/budget" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Budget</p>
            <p className="text-xs text-gray-500">Manage Ramadan spending</p>
          </div>
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        ⚠️ Ramadan dates are approximations based on astronomical calculation. Actual start date may differ by 1 day depending on moon sighting in your region. Always confirm with your local mosque or Islamic authority.
      </div>
    </div>
  );
}
