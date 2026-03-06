'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import Link from 'next/link';

interface Pillar { name: string; score: number; max: number; note: string; pct: number; }
interface ScoreData { totalScore: number; maxScore: number; grade: string; overallNote: string; pillars: Pillar[]; }

/* ── Per-pillar actionable tips ─────────────────────────────────── */
interface PillarMeta {
  icon: string;
  href: string;
  tips: { pctThreshold: number; tip: string }[];
}

const PILLAR_META: Record<string, PillarMeta> = {
  'Zakat Compliance': {
    icon: '🕌', href: '/dashboard/zakat',
    tips: [
      { pctThreshold: 0,  tip: 'You have not recorded any Zakat payments. If your wealth exceeds the nisab, Zakat is obligatory. Head to the Zakat calculator to check your eligibility.' },
      { pctThreshold: 40, tip: 'You are partially meeting your Zakat obligation. Review your assets in the Zakat calculator to ensure all zakatable wealth is included.' },
      { pctThreshold: 75, tip: 'Great progress! Make sure your Zakat hawl (lunar year cycle) is up to date so you never miss a payment.' },
      { pctThreshold: 90, tip: 'Excellent! Consider adding voluntary Sadaqah beyond Zakat to further strengthen your score.' },
    ],
  },
  'Sadaqah Consistency': {
    icon: '🤲', href: '/dashboard/sadaqah',
    tips: [
      { pctThreshold: 0,  tip: 'No Sadaqah recorded yet. Even a small regular donation — weekly or monthly — counts. Tag any charitable transaction as "charity" to get credit.' },
      { pctThreshold: 40, tip: 'Good start! Aim for consistency: small recurring donations are more rewarding than occasional large ones.' },
      { pctThreshold: 75, tip: 'You are giving regularly. Consider automating your Sadaqah by setting up a recurring transfer to a cause you care about.' },
      { pctThreshold: 90, tip: 'Mashallah! Your giving is consistent. Explore Waqf (endowments) or Qurban for the upcoming season.' },
    ],
  },
  'Debt Reduction': {
    icon: '💳', href: '/dashboard/debts',
    tips: [
      { pctThreshold: 0,  tip: 'Your debt-to-asset ratio is high. Try the Debt Payoff Projector on the Debts page — even $50/month extra can save thousands in interest.' },
      { pctThreshold: 40, tip: 'You are making progress. Use the Avalanche strategy (highest interest first) to minimise total interest paid.' },
      { pctThreshold: 75, tip: 'Your debt is well managed. Consider converting any interest-bearing debts to Halal alternatives (Qard Hasan, Islamic financing).' },
      { pctThreshold: 90, tip: 'Excellent! With low debt, consider redirecting freed-up cash flow toward Halal investments or savings goals.' },
    ],
  },
  'Savings Discipline': {
    icon: '🎯', href: '/dashboard/savings',
    tips: [
      { pctThreshold: 0,  tip: 'No savings goals found. Create a goal — even a small emergency fund (1 month of expenses) significantly improves financial security.' },
      { pctThreshold: 40, tip: 'You have started saving. Try to automate a fixed amount each payday so saving happens before spending.' },
      { pctThreshold: 75, tip: 'Good discipline! Aim to fund at least one goal to completion before opening new ones. Focus reduces time to goal.' },
      { pctThreshold: 90, tip: 'Excellent savings discipline! Consider Halal investment options (ETFs like HLAL, Wahed, or sukuk) to grow your savings.' },
    ],
  },
  'Halal Cleanliness': {
    icon: '🛡️', href: '/dashboard/transactions',
    tips: [
      { pctThreshold: 0,  tip: 'Several transactions appear riba-related (interest charges). Any interest received should be donated to charity and not included in wealth. Review flagged transactions.' },
      { pctThreshold: 40, tip: 'You have some interest-flagged transactions. Work with your bank to move to interest-free accounts where possible.' },
      { pctThreshold: 75, tip: 'Most transactions look halal. Review any "interest" or "APR" line items and consider donating those amounts to charity.' },
      { pctThreshold: 90, tip: 'Your finances are very clean! Keep reviewing imported transactions and categorise any unusual income sources.' },
    ],
  },
};

const GRADE_COLORS: Record<string, string> = {
  A: '#1B5E20', B: '#388E3C', C: '#F59E0B', D: '#EF8C2D', F: '#EF4444',
};

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const r = 70; const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  const color = GRADE_COLORS[grade] || '#EF4444';
  const label = grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Fair' : grade === 'D' ? 'Needs Work' : 'Getting Started';
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#E5E7EB" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="mt-[-80px] mb-[80px] text-center">
        <p className="text-5xl font-bold" style={{ color }}>{score}</p>
        <p className="text-sm font-semibold" style={{ color }}>{label} (Grade {grade})</p>
        <p className="text-xs text-gray-400">/ 100</p>
      </div>
    </div>
  );
}

function getActiveTip(meta: PillarMeta, pct: number): string {
  // Return the highest threshold tip that applies
  let active = meta.tips[0].tip;
  for (const t of meta.tips) {
    if (pct >= t.pctThreshold) active = t.tip;
  }
  return active;
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const [expanded, setExpanded] = useState(false);
  const meta = PILLAR_META[pillar.name] || { icon: '📊', href: '/dashboard', tips: [] };
  const pctWidth = pillar.max > 0 ? (pillar.score / pillar.max) * 100 : 0;
  const barColor = pctWidth >= 75 ? '#1B5E20' : pctWidth >= 50 ? '#F59E0B' : '#EF4444';
  const tip = meta.tips.length ? getActiveTip(meta, pctWidth) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header row — click to expand */}
      <button
        className="w-full text-left p-4 hover:bg-gray-50 transition"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <p className="font-semibold text-gray-800">{pillar.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold" style={{ color: barColor }}>
              {pillar.score}<span className="text-xs text-gray-400">/{pillar.max}</span>
            </p>
            <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pctWidth}%`, backgroundColor: barColor }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">{pillar.note}</p>
      </button>

      {/* Expanded tips section */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
          {tip && (
            <div className="flex gap-3 mb-3">
              <span className="text-lg shrink-0">
                {pctWidth >= 75 ? '✅' : pctWidth >= 50 ? '⚡' : '🎯'}
              </span>
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          )}

          {/* Score level indicators */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { label: '0–39%', color: 'bg-red-100 text-red-700' },
              { label: '40–74%', color: 'bg-yellow-100 text-yellow-700' },
              { label: '75–89%', color: 'bg-green-100 text-green-700' },
              { label: '90%+',   color: 'bg-emerald-100 text-emerald-700' },
            ].map((level) => (
              <span key={level.label} className={`text-xs px-2 py-1 rounded-full ${level.color}`}>{level.label}</span>
            ))}
          </div>

          <Link
            href={meta.href}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1B5E20] hover:underline"
            onClick={e => e.stopPropagation()}
          >
            Go to {pillar.name.split(' ')[0]} →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function BarakahScorePage() {
  const [data, setData]     = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    api.getBarakahScore()
      .then(d => setData(d))
      .catch(() => setError('Failed to load Barakah Score'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  if (error || !data) return (
    <div className="text-center py-16">
      <p className="text-red-500">{error || 'Could not load score'}</p>
    </div>
  );

  // Determine lowest-scoring pillar for the top tip
  const lowestPillar = data.pillars.length
    ? data.pillars.slice().sort((a, b) => (a.score / a.max) - (b.score / b.max))[0]
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">⭐ Barakah Score</h1>
        <p className="text-sm text-gray-500 mt-1">Your Islamic financial wellness across 5 pillars</p>
      </div>

      {/* Gauge */}
      <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center shadow-sm">
        <ScoreGauge score={data.totalScore} grade={data.grade} />
        <p className="text-sm text-gray-600 mt-2 text-center max-w-sm font-medium">{data.overallNote}</p>
        <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">
          This score reflects your current Islamic financial practices. It is not a fatwa — consult a qualified scholar for specific guidance.
        </p>
      </div>

      {/* Quick win banner — lowest pillar */}
      {lowestPillar && (PILLAR_META[lowestPillar.name]?.tips?.length ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">Biggest opportunity: {lowestPillar.name}</p>
            <p className="text-sm text-amber-800 mt-0.5">
              {getActiveTip(PILLAR_META[lowestPillar.name], (lowestPillar.score / lowestPillar.max) * 100)}
            </p>
          </div>
        </div>
      )}

      {/* Pillar cards (expandable) */}
      <p className="text-xs text-gray-400 mb-3">Tap any pillar to see actionable tips</p>
      <div className="space-y-3">
        {data.pillars.map(pillar => (
          <PillarCard key={pillar.name} pillar={pillar} />
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 mt-6">
        ⚠️ The Barakah Score is for personal reflection only. It is based on data you have entered and does not account for intentions (niyyah) or factors only Allah ﷻ knows. This is not a religious ruling.
      </div>
    </div>
  );
}
