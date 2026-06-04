'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import Link from 'next/link';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';

interface Pillar { name: string; score: number; max: number; note: string; pct: number; }
interface ScoreData { totalScore: number; maxScore: number; grade: string; overallNote: string; pillars: Pillar[]; }

/* ── Per-pillar actionable tips ─────────────────────────────────── */
// The backend returns pillar.name as a stable English identifier
// ("Zakat Compliance", etc.) which we keep as the lookup key into this
// map and as the i18n key suffix. All user-facing copy (display label +
// tips) is resolved through useI18n at render time so it localizes.
interface PillarTip { pctThreshold: number; tipKey: string }
interface PillarMeta {
  icon: string;
  href: string;
  labelKey: string;
  tips: PillarTip[];
}

const PILLAR_META: Record<string, PillarMeta> = {
  'Zakat Compliance': {
    icon: '🕌', href: '/dashboard/zakat', labelKey: 'barakahScorePillarZakat',
    tips: [
      { pctThreshold: 0,  tipKey: 'barakahScoreZakatTip0' },
      { pctThreshold: 40, tipKey: 'barakahScoreZakatTip40' },
      { pctThreshold: 75, tipKey: 'barakahScoreZakatTip75' },
      { pctThreshold: 90, tipKey: 'barakahScoreZakatTip90' },
    ],
  },
  'Sadaqah Consistency': {
    icon: '🤲', href: '/dashboard/sadaqah', labelKey: 'barakahScorePillarSadaqah',
    tips: [
      { pctThreshold: 0,  tipKey: 'barakahScoreSadaqahTip0' },
      { pctThreshold: 40, tipKey: 'barakahScoreSadaqahTip40' },
      { pctThreshold: 75, tipKey: 'barakahScoreSadaqahTip75' },
      { pctThreshold: 90, tipKey: 'barakahScoreSadaqahTip90' },
    ],
  },
  'Debt Reduction': {
    icon: '💳', href: '/dashboard/debts', labelKey: 'barakahScorePillarDebt',
    tips: [
      { pctThreshold: 0,  tipKey: 'barakahScoreDebtTip0' },
      { pctThreshold: 40, tipKey: 'barakahScoreDebtTip40' },
      { pctThreshold: 75, tipKey: 'barakahScoreDebtTip75' },
      { pctThreshold: 90, tipKey: 'barakahScoreDebtTip90' },
    ],
  },
  'Savings Discipline': {
    icon: '🎯', href: '/dashboard/savings', labelKey: 'barakahScorePillarSavings',
    tips: [
      { pctThreshold: 0,  tipKey: 'barakahScoreSavingsTip0' },
      { pctThreshold: 40, tipKey: 'barakahScoreSavingsTip40' },
      { pctThreshold: 75, tipKey: 'barakahScoreSavingsTip75' },
      { pctThreshold: 90, tipKey: 'barakahScoreSavingsTip90' },
    ],
  },
  'Halal Cleanliness': {
    icon: '🛡️', href: '/dashboard/transactions', labelKey: 'barakahScorePillarHalal',
    tips: [
      { pctThreshold: 0,  tipKey: 'barakahScoreHalalTip0' },
      { pctThreshold: 40, tipKey: 'barakahScoreHalalTip40' },
      { pctThreshold: 75, tipKey: 'barakahScoreHalalTip75' },
      { pctThreshold: 90, tipKey: 'barakahScoreHalalTip90' },
    ],
  },
};

const GRADE_COLORS: Record<string, string> = {
  A: '#1B5E20', B: '#388E3C', C: '#F59E0B', D: '#EF8C2D', F: '#EF4444',
};

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const { t, tFmt } = useI18n();
  const r = 70; const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  const color = GRADE_COLORS[grade] || '#EF4444';
  const label = grade === 'A' ? t('barakahScoreGradeExcellent')
    : grade === 'B' ? t('barakahScoreGradeGood')
    : grade === 'C' ? t('barakahScoreGradeFair')
    : grade === 'D' ? t('barakahScoreGradeNeedsWork')
    : t('barakahScoreGradeGettingStarted');
  return (
    <div className="relative flex flex-col items-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#E5E7EB" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-5xl font-bold" style={{ color }}>{score}</p>
        <p className="text-xs font-semibold mt-1" style={{ color }}>{tFmt('barakahScoreGradeLabelFmt', [label, grade])}</p>
        <p className="text-xs text-gray-400">/ 100</p>
      </div>
    </div>
  );
}

// Returns the i18n key of the highest-threshold tip that applies, so the
// caller can resolve it with t() where the hook is in scope.
function getActiveTipKey(meta: PillarMeta, pct: number): string {
  let active = meta.tips[0].tipKey;
  for (const tier of meta.tips) {
    if (pct >= tier.pctThreshold) active = tier.tipKey;
  }
  return active;
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const { t, tFmt } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const meta = PILLAR_META[pillar.name] || { icon: '📊', href: '/dashboard', labelKey: '', tips: [] };
  const label = meta.labelKey ? t(meta.labelKey) : pillar.name;
  // First word of the localized pillar label keeps the link compact
  // ("Go to Zakat →"), mirroring the original behaviour.
  const goToLabel = tFmt('barakahScoreGoToFmt', [label.split(' ')[0]]);
  const pctWidth = pillar.max > 0 ? (pillar.score / pillar.max) * 100 : 0;
  const barColor = pctWidth >= 75 ? '#1B5E20' : pctWidth >= 50 ? '#F59E0B' : '#EF4444';
  const tip = meta.tips.length ? t(getActiveTipKey(meta, pctWidth)) : null;

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
            <p className="font-semibold text-gray-800">{label}</p>
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
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {goToLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function BarakahScorePage() {
  const { t, tFmt } = useI18n();
  const [data, setData]     = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [isPlanError, setIsPlanError] = useState(false);

  const loadScore = useCallback(async () => {
    setLoading(true);
    setError('');
    setIsPlanError(false);
    try {
      const d = await api.getBarakahScore();
      setData(d);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      setIsPlanError(msg.includes('plan') || msg.includes('upgrade') || msg.includes('403'));
      setError(t('barakahScoreLoadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void loadScore(); }, [loadScore]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (error || !data) return (
    <div className="text-center py-16 max-w-md mx-auto">
      <div className="text-5xl mb-4">📊</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{t('barakahScoreUnableTitle')}</h2>
      <p className="text-gray-600 mb-6">
        {isPlanError
          ? t('barakahScoreUnablePlan')
          : t('barakahScoreUnableData')}
      </p>
      <div className="flex gap-3 justify-center">
        <a href="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition">{t('barakahScoreGoToDashboard')}</a>
        <button onClick={() => void loadScore()} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">{t('errTryAgain')}</button>
      </div>
    </div>
  );

  // Determine lowest-scoring pillar for the top tip — filter out pillars with
  // max=0 to avoid division-by-zero NaN values in the sort comparator
  const lowestPillar = data.pillars.length
    ? data.pillars
        .filter(p => p.max > 0)
        .slice()
        .sort((a, b) => (a.score / a.max) - (b.score / b.max))[0] ?? null
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={t('barakahScoreTitle')}
        subtitle={t('barakahScoreSubtitle')}
      />

      {/* Gauge */}
      <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center shadow-sm">
        <ScoreGauge score={data.totalScore} grade={data.grade} />
        <p className="text-sm text-gray-600 mt-2 text-center max-w-sm font-medium">{data.overallNote}</p>
        <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">
          {t('barakahScoreNotFatwa')}
        </p>
      </div>

      {/* Quick win banner — lowest pillar */}
      {lowestPillar && (PILLAR_META[lowestPillar.name]?.tips?.length ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">{tFmt('barakahScoreBiggestOpportunityFmt', [t(PILLAR_META[lowestPillar.name].labelKey)])}</p>
            <p className="text-sm text-amber-800 mt-0.5">
              {t(getActiveTipKey(PILLAR_META[lowestPillar.name], (lowestPillar.score / lowestPillar.max) * 100))}
            </p>
          </div>
        </div>
      )}

      {/* Pillar cards (expandable) */}
      <p className="text-xs text-gray-400 mb-3">{t('barakahScoreTapHint')}</p>
      <div className="space-y-3">
        {data.pillars.map(pillar => (
          <PillarCard key={pillar.name} pillar={pillar} />
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 mt-6">
        {t('barakahScoreDisclaimer')}
      </div>
    </div>
  );
}
