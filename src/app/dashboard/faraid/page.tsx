'use client';
import { useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ── Types ─────────────────────────────────────────────────────────── */

interface ShareEntry {
  heir: string;
  relationship: string;
  share: number;
  reason: string;
}

interface AdjustedShare {
  heir: string;
  adjustedShare: number;
  amount: number;
  share?: number;
  reason?: string;
  relationship?: string;
}

interface BlockingRules {
  siblingsBlocked: boolean;
  siblingBlockedBy: string;
  maternalSiblingsBlocked: boolean;
  maternalBlockedBy: string;
}

interface FaraidResult {
  shares: ShareEntry[];
  blockingRules: BlockingRules;
  estateValue: number;
  afterFuneralExpenses: number;
  afterDebts: number;
  wasiyyahApplied: number;
  wasiyyahCapped: boolean;
  distributableEstate: number;
  adjustedShares: AdjustedShare[];
  awlApplied: boolean;
  raddApplied: boolean;
  message: string;
  faraid: boolean;
  madhab: string;
  source: string;
}

interface FormData {
  estateValue: number;
  funeralExpenses: number;
  debts: number;
  wasiyyahAmount: number;
  hasHusband: boolean;
  hasWife: boolean;
  numSons: number;
  numDaughters: number;
  hasFather: boolean;
  hasMother: boolean;
  numFullBrothers: number;
  numFullSisters: number;
  numPaternalBrothers: number;
  numPaternalSisters: number;
  numMaternalSiblings: number;
}

/* ── Pie chart colour palette (green-based) ────────────────────────── */

const COLORS = [
  '#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50',
  '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9',
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function FaraidPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<FormData>({
    estateValue: 0,
    funeralExpenses: 0,
    debts: 0,
    wasiyyahAmount: 0,
    hasHusband: false,
    hasWife: false,
    numSons: 0,
    numDaughters: 0,
    hasFather: false,
    hasMother: false,
    numFullBrothers: 0,
    numFullSisters: 0,
    numPaternalBrothers: 0,
    numPaternalSisters: 0,
    numMaternalSiblings: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FaraidResult | null>(null);
  const [educationOpen, setEducationOpen] = useState(false);

  /* ── Helpers ───────────────────────────────────────────────────────── */

  const setField = (key: keyof FormData, value: number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setNumber = (key: keyof FormData, raw: string) => {
    const n = parseFloat(raw);
    setField(key, isNaN(n) ? 0 : Math.max(0, n));
  };

  const setInt = (key: keyof FormData, raw: string) => {
    const n = parseInt(raw, 10);
    setField(key, isNaN(n) ? 0 : Math.max(0, n));
  };

  /* ── Submit ───────────────────────────────────────────────────────── */

  const calculate = async () => {
    if (form.estateValue <= 0) {
      toast('Estate value must be greater than zero', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.calculateFaraid(form as unknown as Record<string, unknown>);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        setResult(res);
      }
    } catch {
      toast('Failed to calculate Faraid distribution', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── Plan gate ────────────────────────────────────────────────────── */

  if (user?.plan === 'free') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          <div className="text-5xl mb-4">📜</div>
          <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">
            Faraid Calculator
          </h1>
          <p className="text-gray-600 mb-6">
            Calculate Islamic inheritance distribution based on the Quran and Sunnah.
            This feature is available on the Plus plan.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block bg-[#1B5E20] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#2E7D32] transition"
          >
            Upgrade to Plus
          </Link>
        </div>
      </div>
    );
  }

  /* ── Pie data ─────────────────────────────────────────────────────── */

  const pieData = result?.adjustedShares.map((s) => ({
    name: s.heir,
    value: s.amount,
  })) ?? [];

  /* ── Render ───────────────────────────────────────────────────────── */

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B5E20]">Faraid Calculator</h1>
        <p className="text-gray-500 mt-1">Islamic Inheritance Distribution</p>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left — Estate Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-[#1B5E20]">Estate Details</h2>

          <CurrencyInput label="Total Estate Value" value={form.estateValue} onChange={(v) => setNumber('estateValue', v)} />
          <CurrencyInput label="Funeral Expenses" value={form.funeralExpenses} onChange={(v) => setNumber('funeralExpenses', v)} />
          <CurrencyInput label="Outstanding Debts" value={form.debts} onChange={(v) => setNumber('debts', v)} />
          <CurrencyInput label="Wasiyyah (Bequest) Amount" value={form.wasiyyahAmount} onChange={(v) => setNumber('wasiyyahAmount', v)} />
        </div>

        {/* Right — Heirs */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-[#1B5E20]">Heirs</h2>

          {/* Spouse */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Spouse</legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="spouse"
                  checked={!form.hasHusband && !form.hasWife}
                  onChange={() => { setField('hasHusband', false); setField('hasWife', false); }}
                  className="accent-[#1B5E20]"
                />
                None
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="spouse"
                  checked={form.hasHusband}
                  onChange={() => { setField('hasHusband', true); setField('hasWife', false); }}
                  className="accent-[#1B5E20]"
                />
                Husband
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="spouse"
                  checked={form.hasWife}
                  onChange={() => { setField('hasWife', true); setField('hasHusband', false); }}
                  className="accent-[#1B5E20]"
                />
                Wife
              </label>
            </div>
          </fieldset>

          {/* Parents */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Parents</legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasFather}
                  onChange={(e) => setField('hasFather', e.target.checked)}
                  className="accent-[#1B5E20] rounded"
                />
                Father
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasMother}
                  onChange={(e) => setField('hasMother', e.target.checked)}
                  className="accent-[#1B5E20] rounded"
                />
                Mother
              </label>
            </div>
          </fieldset>

          {/* Children */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Children</legend>
            <div className="grid grid-cols-2 gap-4">
              <IntInput label="Sons" value={form.numSons} onChange={(v) => setInt('numSons', v)} />
              <IntInput label="Daughters" value={form.numDaughters} onChange={(v) => setInt('numDaughters', v)} />
            </div>
          </fieldset>

          {/* Full Siblings */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Full Siblings</legend>
            <div className="grid grid-cols-2 gap-4">
              <IntInput label="Brothers" value={form.numFullBrothers} onChange={(v) => setInt('numFullBrothers', v)} />
              <IntInput label="Sisters" value={form.numFullSisters} onChange={(v) => setInt('numFullSisters', v)} />
            </div>
          </fieldset>

          {/* Paternal Siblings */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Paternal Siblings</legend>
            <div className="grid grid-cols-2 gap-4">
              <IntInput label="Brothers" value={form.numPaternalBrothers} onChange={(v) => setInt('numPaternalBrothers', v)} />
              <IntInput label="Sisters" value={form.numPaternalSisters} onChange={(v) => setInt('numPaternalSisters', v)} />
            </div>
          </fieldset>

          {/* Maternal Siblings */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">Maternal Siblings</legend>
            <IntInput label="Maternal Siblings" value={form.numMaternalSiblings} onChange={(v) => setInt('numMaternalSiblings', v)} />
          </fieldset>
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={calculate}
        disabled={loading}
        className="w-full bg-[#1B5E20] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2E7D32] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Calculating...' : 'Calculate Faraid Distribution'}
      </button>

      {/* ── Results ──────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-8">
          {/* Deduction Flow */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Deduction Flow</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <FlowCard label="Total Estate" amount={result.estateValue} />
              <FlowArrow />
              <FlowCard label="After Funeral" amount={result.afterFuneralExpenses} />
              <FlowArrow />
              <FlowCard label="After Debts" amount={result.afterDebts} />
              <FlowArrow />
              <FlowCard label="After Wasiyyah" amount={result.distributableEstate + result.wasiyyahApplied === result.afterDebts ? result.afterDebts : result.afterDebts - result.wasiyyahApplied} />
              <FlowArrow />
              <FlowCard label="Distributable" amount={result.distributableEstate} highlight />
            </div>
            {result.wasiyyahCapped && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-4">
                The wasiyyah was capped at one-third of the estate after debts, as required by Islamic law.
              </p>
            )}
          </div>

          {/* Heir Distribution Table */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Heir Distribution</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-3 pr-4 font-medium">Heir</th>
                    <th className="pb-3 pr-4 font-medium">Quranic Share</th>
                    <th className="pb-3 pr-4 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium">Source / Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {result.adjustedShares.map((adj, i) => {
                    return (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-3 pr-4 font-medium text-gray-900">{adj.heir}</td>
                        <td className="py-3 pr-4 text-gray-600">
                          {(adj.adjustedShare * 100).toFixed(2)}%
                        </td>
                        <td className="py-3 pr-4 text-right font-semibold text-[#1B5E20]">
                          {fmt(adj.amount)}
                        </td>
                        <td className="py-3 text-gray-500 text-xs">
                          {adj.reason ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1B5E20] mb-4">Distribution Chart</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} (${((percent ?? 0) * 100).toFixed(1)}%)`
                      }
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => fmt(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Special Rules */}
          {(result.awlApplied || result.raddApplied) && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-semibold text-[#1B5E20] mb-2">Special Rules Applied</h2>
              {result.awlApplied && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
                  <span className="font-semibold">Awl (Proportional Reduction):</span> The total prescribed shares exceeded 100%.
                  All shares have been proportionally reduced so that each heir receives a fair fraction of the estate.
                </div>
              )}
              {result.raddApplied && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800">
                  <span className="font-semibold">Radd (Proportional Increase):</span> After distributing the prescribed shares,
                  a surplus remained. The surplus has been redistributed proportionally among eligible heirs.
                </div>
              )}
            </div>
          )}

          {/* Blocking Rules */}
          {(result.blockingRules.siblingsBlocked || result.blockingRules.maternalSiblingsBlocked) && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-semibold text-[#1B5E20] mb-2">Blocking Rules</h2>
              {result.blockingRules.siblingsBlocked && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">
                  <span className="font-semibold">Siblings blocked</span> by{' '}
                  <span className="text-[#1B5E20] font-medium">{result.blockingRules.siblingBlockedBy}</span>.
                  In Islamic inheritance law, certain closer relatives exclude more distant ones from inheriting.
                </div>
              )}
              {result.blockingRules.maternalSiblingsBlocked && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">
                  <span className="font-semibold">Maternal siblings blocked</span> by{' '}
                  <span className="text-[#1B5E20] font-medium">{result.blockingRules.maternalBlockedBy}</span>.
                  Maternal half-siblings are excluded when certain relatives are present.
                </div>
              )}
            </div>
          )}

          {/* Madhab & Source */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span><span className="font-medium text-gray-800">Madhab:</span> {result.madhab}</span>
              <span><span className="font-medium text-gray-800">Source:</span> {result.source}</span>
            </div>
          </div>

          {/* Educational Section */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setEducationOpen(!educationOpen)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold text-[#1B5E20]">Quranic References</h2>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${educationOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {educationOpen && (
              <div className="px-6 pb-6 space-y-4 text-sm text-gray-700 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Surah An-Nisa 4:11</h3>
                  <p>
                    Prescribes the shares for children, parents. A male child receives twice the share of a female.
                    If the deceased has children, each parent receives one-sixth. If no children and parents inherit,
                    the mother receives one-third (or one-sixth if the deceased has siblings).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Surah An-Nisa 4:12</h3>
                  <p>
                    Prescribes spousal shares. The husband receives one-half if there are no children, one-quarter
                    otherwise. The wife receives one-quarter if there are no children, one-eighth otherwise.
                    Also covers maternal siblings&apos; shares.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Surah An-Nisa 4:176</h3>
                  <p>
                    Known as the Verse of Kalalah, it addresses the case when a person dies without parents or
                    children. Full siblings and paternal siblings inherit according to the rules specified in this verse.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-xs text-green-800">
                  These calculations follow the Sunni majority (Jumhur) methodology. For complex estate situations,
                  always consult a qualified Islamic scholar.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function CurrencyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
        />
      </div>
    </div>
  );
}

function IntInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        step={1}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
      />
    </div>
  );
}

function FlowCard({
  label,
  amount,
  highlight,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center px-4 py-3 rounded-xl border text-center min-w-[120px] ${
        highlight
          ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
          : 'bg-gray-50 border-gray-200 text-gray-800'
      }`}
    >
      <span className={`text-xs ${highlight ? 'text-green-200' : 'text-gray-500'}`}>{label}</span>
      <span className="font-semibold text-sm mt-0.5">{fmt(amount)}</span>
    </div>
  );
}

function FlowArrow() {
  return (
    <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
