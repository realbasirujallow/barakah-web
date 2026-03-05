'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import Link from 'next/link';

interface ScoreComponent { label: string; score: number; max: number; icon: string; detail: string; href: string; }

function ScoreGauge({ score }: { score: number }) {
  const r = 70; const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  const color = score >= 80 ? '#1B5E20' : score >= 60 ? '#F59E0B' : score >= 40 ? '#EF8C2D' : '#EF4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Attention';
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#E5E7EB" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="mt-[-80px] mb-[80px] text-center">
        <p className="text-5xl font-bold" style={{ color }}>{score}</p>
        <p className="text-sm font-semibold" style={{ color }}>{label}</p>
        <p className="text-xs text-gray-400">/ 100</p>
      </div>
    </div>
  );
}

export default function BarakahScorePage() {
  const [components, setComponents] = useState<ScoreComponent[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const calc = async () => {
      const comps: ScoreComponent[] = [];
      let score = 0;

      try {
        // 1. Zakat (25 pts)
        const zakat = await api.getZakat();
        const zakatScore = zakat?.zakatFullyPaid ? 25 : zakat?.zakatEligible ? 0 : 25;
        comps.push({ label: 'Zakat Fulfilment', score: zakatScore, max: 25, icon: '🕌',
          detail: zakat?.zakatFullyPaid ? 'Zakat fully paid this year. Barakah!' : zakat?.zakatEligible ? 'Zakat is due but not fully paid yet' : 'Zakat threshold not reached',
          href: '/dashboard/zakat' });
        score += zakatScore;

        // 2. Riba-Free Finances (25 pts)
        try {
          const riba = await api.scanRiba();
          const ribaCount: number = riba?.ribaTransactions?.length || riba?.count || 0;
          const ribaScore = Math.max(0, 25 - ribaCount * 5);
          comps.push({ label: 'Riba-Free Finances', score: ribaScore, max: 25, icon: '🛡️',
            detail: ribaCount === 0 ? 'No interest-based transactions detected' : `${ribaCount} potential riba transaction(s) found`,
            href: '/dashboard/riba' });
          score += ribaScore;
        } catch { comps.push({ label: 'Riba-Free Finances', score: 25, max: 25, icon: '🛡️', detail: 'No riba detected', href: '/dashboard/riba' }); score += 25; }

        // 3. Sadaqah Giving (20 pts)
        const sadaqah = await api.getSadaqahStats();
        const totalSadaqah: number = sadaqah?.totalAmount || sadaqah?.total || 0;
        const sadaqahScore = totalSadaqah > 0 ? Math.min(20, Math.round((totalSadaqah / 100) * 20)) : 0;
        comps.push({ label: 'Sadaqah & Charity', score: sadaqahScore, max: 20, icon: '🤲',
          detail: totalSadaqah > 0 ? `$${totalSadaqah.toFixed(2)} given in sadaqah — may Allah accept it` : 'No sadaqah recorded yet',
          href: '/dashboard/sadaqah' });
        score += sadaqahScore;

        // 4. Hawl Tracking (15 pts)
        const hawl = await api.getHawl();
        const hawlList: any[] = hawl?.hawlTrackers || hawl || [];
        const hasActiveHawl = hawlList.some((h: any) => h.isActive);
        const hawlScore = hasActiveHawl ? 15 : 0;
        comps.push({ label: 'Hawl Tracking', score: hawlScore, max: 15, icon: '⏰',
          detail: hasActiveHawl ? 'Actively tracking your lunar Zakat year' : 'No hawl tracker set up',
          href: '/dashboard/hawl' });
        score += hawlScore;

        // 5. Debt Health (15 pts)
        const debts = await api.getDebts();
        const debtList: any[] = debts?.debts || debts || [];
        const halalDebts = debtList.filter((d: any) => d.type === 'islamic_mortgage' || d.type === 'qard_hasan' || d.isHalal).length;
        const ribaDebts = debtList.filter((d: any) => d.type === 'conventional_mortgage' || d.type === 'credit_card' || d.isRiba).length;
        const debtScore = debtList.length === 0 ? 15 : ribaDebts === 0 ? 15 : Math.max(0, 15 - ribaDebts * 5);
        comps.push({ label: 'Halal Debt Profile', score: debtScore, max: 15, icon: '💳',
          detail: debtList.length === 0 ? 'Debt-free — MashaAllah!' : ribaDebts === 0 ? 'All debts are halal instruments' : `${ribaDebts} interest-based debt(s) detected`,
          href: '/dashboard/debts' });
        score += debtScore;

      } catch (e) { console.error(e); }

      setComponents(comps);
      setTotal(Math.min(100, score));
      setLoading(false);
    };
    calc();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">⭐ Barakah Score</h1>
        <p className="text-sm text-gray-500 mt-1">Your Islamic financial wellness — based on Zakat, Riba, Sadaqah, Hawl and Debt health</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 flex flex-col items-center shadow-sm">
        <ScoreGauge score={total} />
        <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
          This score reflects your current Islamic financial practices. It is not a fatwa — consult a qualified scholar for specific guidance.
        </p>
      </div>

      <div className="space-y-3">
        {components.map(c => (
          <Link key={c.label} href={c.href} className="block bg-white rounded-xl p-4 hover:shadow-md transition shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{c.icon}</span>
                <p className="font-semibold text-gray-800">{c.label}</p>
              </div>
              <p className="text-lg font-bold text-[#1B5E20]">{c.score}<span className="text-xs text-gray-400">/{c.max}</span></p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className="h-2 rounded-full bg-[#1B5E20] transition-all duration-700" style={{ width: `${(c.score / c.max) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500">{c.detail}</p>
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 mt-6">
        ⚠️ The Barakah Score is for personal reflection only. It is based on data you have entered and does not account for intentions (niyyah) or factors only Allah ﷻ knows. This is not a religious ruling.
      </div>
    </div>
  );
}
