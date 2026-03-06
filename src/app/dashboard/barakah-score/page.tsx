'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import Link from 'next/link';

interface Pillar {
  name: string;
  score: number;
  max: number;
  note: string;
  pct: number;
}

interface ScoreData {
  totalScore: number;
  maxScore: number;
  grade: string;
  overallNote: string;
  pillars: Pillar[];
}

const PILLAR_META: Record<string, { icon: string; href: string }> = {
  'Zakat Compliance':    { icon: '🕌', href: '/dashboard/zakat' },
  'Sadaqah Consistency': { icon: '🤲', href: '/dashboard/sadaqah' },
  'Debt Reduction':      { icon: '💳', href: '/dashboard/debts' },
  'Savings Discipline':  { icon: '🎯', href: '/dashboard/savings' },
  'Halal Cleanliness':   { icon: '🛡️', href: '/dashboard/transactions' },
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

export default function BarakahScorePage() {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getBarakahScore()
      .then((d) => setData(d))
      .catch(() => setError('Failed to load Barakah Score'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  if (error || !data) return (
    <div className="text-center py-16">
      <p className="text-red-500">{error || 'Could not load score'}</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">⭐ Barakah Score</h1>
        <p className="text-sm text-gray-500 mt-1">Your Islamic financial wellness across 5 pillars</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 flex flex-col items-center shadow-sm">
        <ScoreGauge score={data.totalScore} grade={data.grade} />
        <p className="text-sm text-gray-600 mt-2 text-center max-w-sm font-medium">{data.overallNote}</p>
        <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">
          This score reflects your current Islamic financial practices. It is not a fatwa — consult a qualified scholar for specific guidance.
        </p>
      </div>

      <div className="space-y-3">
        {data.pillars.map(pillar => {
          const meta = PILLAR_META[pillar.name] || { icon: '📊', href: '/dashboard' };
          const pctWidth = pillar.max > 0 ? (pillar.score / pillar.max) * 100 : 0;
          const barColor = pctWidth >= 75 ? '#1B5E20' : pctWidth >= 50 ? '#F59E0B' : '#EF4444';
          return (
            <Link key={pillar.name} href={meta.href} className="block bg-white rounded-xl p-4 hover:shadow-md transition shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meta.icon}</span>
                  <p className="font-semibold text-gray-800">{pillar.name}</p>
                </div>
                <p className="text-lg font-bold" style={{ color: barColor }}>
                  {pillar.score}<span className="text-xs text-gray-400">/{pillar.max}</span>
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pctWidth}%`, backgroundColor: barColor }} />
              </div>
              <p className="text-xs text-gray-500">{pillar.note}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 mt-6">
        ⚠️ The Barakah Score is for personal reflection only. It is based on data you have entered and does not account for intentions (niyyah) or factors only Allah ﷻ knows. This is not a religious ruling.
      </div>
    </div>
  );
}
