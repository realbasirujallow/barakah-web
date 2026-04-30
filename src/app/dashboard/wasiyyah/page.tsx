'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { safeParse, validateWasiyyahBeneficiary } from '../../../lib/schemas';

interface Beneficiary {
  id: number;
  beneficiaryName: string;
  relationship: string;
  sharePercentage: number;
  shareType: 'fixed' | 'voluntary' | 'percentage';
  notes: string;
  assetDescription?: string;
}
interface Obligation { id: number; type: string; amount: number; currency: string; description: string; recipient?: string; notes?: string; status: string; }
interface WasiyyahBeneficiaryApiItem {
  id: number;
  beneficiaryName?: string;
  name?: string;
  relationship: string;
  sharePercentage: number;
  shareType: string;
  notes?: string;
  assetDescription?: string;
}
interface IslamicSharesMap { [relationship: string]: string; }

const RELATIONSHIPS = [
  { value: 'spouse',     label: 'Spouse',     emoji: '💑' },
  { value: 'son',        label: 'Son',         emoji: '👦' },
  { value: 'daughter',   label: 'Daughter',    emoji: '👧' },
  { value: 'father',     label: 'Father',      emoji: '👨' },
  { value: 'mother',     label: 'Mother',      emoji: '👩' },
  { value: 'brother',    label: 'Brother',     emoji: '🧑' },
  { value: 'sister',     label: 'Sister',      emoji: '🧒' },
  { value: 'grandchild', label: 'Grandchild',  emoji: '🍼' },
  { value: 'uncle',      label: 'Uncle',       emoji: '🧔' },
  { value: 'aunt',       label: 'Aunt',        emoji: '👩‍🦳' },
  { value: 'other',      label: 'Other',       emoji: '🤝' },
];

const OBLIGATION_TYPES = [
  { value: 'ZAKAT',               label: 'Unpaid Zakat',          emoji: '🕌', desc: 'Zakat that is owed but not yet given' },
  { value: 'KAFFARAH',            label: 'Kaffarah',              emoji: '📿', desc: 'Expiation for broken oaths, missed fasts, etc.' },
  { value: 'UNPAID_LOAN',         label: 'Unpaid Loan',           emoji: '💰', desc: 'Money borrowed and not yet repaid' },
  { value: 'PROMISED_SADAQAH',    label: 'Promised Sadaqah',      emoji: '🤲', desc: 'Charity you pledged but have not yet given' },
  { value: 'MISSED_PRAYER_FIDYA', label: 'Fidya (Prayers/Fasts)', emoji: '📖', desc: 'Compensation owed for missed prayers or fasts' },
  { value: 'CUSTOM',              label: 'Other Obligation',      emoji: '📋', desc: 'Any other Islamic or personal obligation' },
];

function relEmoji(rel: string) {
  return RELATIONSHIPS.find(r => r.value === rel)?.emoji ?? '🤝';
}

function WasiyyahPageContent() {
  const { toast } = useToast();
  const { currency: currencyCode, fmt } = useCurrency();
  const [items, setItems]           = useState<Beneficiary[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [islamicShares, setIslamicShares] = useState<IslamicSharesMap>({});
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<'beneficiaries' | 'obligations'>('beneficiaries');
  const [showForm, setShowForm]     = useState(false);
  const [showObForm, setShowObForm] = useState(false);
  const [showSharesInfo, setShowSharesInfo] = useState(false);
  const [form, setForm]             = useState({
    beneficiaryName: '',
    relationship: 'spouse',
    sharePercentage: '',
    shareType: 'voluntary' as 'fixed' | 'voluntary',
    assetDescription: '',
    notes: '',
  });
  const [obForm, setObForm] = useState(() => ({
    type: 'ZAKAT',
    amount: '',
    currency: currencyCode || 'USD',
    description: '',
    recipient: '',
    notes: '',
  }));
  const [saving, setSaving]         = useState(false);
  const [exporting, setExporting]   = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<{ type: 'beneficiary' | 'obligation'; id: number } | null>(null);
  const [formError, setFormError]   = useState<string | null>(null);
  const loadingRef = useRef(false);

  const load = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    Promise.allSettled([
      api.getWasiyyah(),
      api.getWasiyyahObligations(),
      api.getIslamicShares(),
    ]).then((results) => {
      const bRaw = results[0].status === 'fulfilled' ? results[0].value : null;
      const oRaw = results[1].status === 'fulfilled' ? results[1].value : null;
      const sRaw = results[2].status === 'fulfilled' ? results[2].value : null;

      if (bRaw?.error || oRaw?.error) {
        toast(bRaw?.error || oRaw?.error, 'error');
        return;
      }

      // Validate beneficiaries
      const bList = bRaw?.beneficiaries ?? bRaw;
      const validatedBeneficiaries: Beneficiary[] = [];
      if (Array.isArray(bList)) {
        for (const item of bList as WasiyyahBeneficiaryApiItem[]) {
          const adapted = { ...item, name: item.beneficiaryName || item.name };
          const result = safeParse(validateWasiyyahBeneficiary, adapted, `beneficiary/${item.id}`);
          if (result) {
            validatedBeneficiaries.push({
              id: result.id,
              beneficiaryName: result.name,
              relationship: result.relationship,
              sharePercentage: result.sharePercentage,
              shareType: (result.shareType as 'fixed' | 'voluntary' | 'percentage') || 'voluntary',
              notes: result.notes || '',
              assetDescription: item.assetDescription,
            });
          } else {
            const itemId = typeof item === 'object' && item !== null && 'id' in item
              ? String((item as { id?: unknown }).id ?? 'unknown') : 'unknown';
            console.warn(`Skipped invalid beneficiary (id=${itemId})`);
          }
        }
      }

      const oList = oRaw?.obligations;
      const sharesMap: IslamicSharesMap = sRaw?.shares ?? {};
      setItems(validatedBeneficiaries);
      setObligations(Array.isArray(oList) ? oList : []);
      setIslamicShares(sharesMap);
    }).catch(() => toast('Failed to load wasiyyah data', 'error'))
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [toast]);

  useEffect(() => {
    const id = window.setTimeout(() => load(), 0);
    return () => window.clearTimeout(id);
  }, [load]);

  // Derived share totals (mirrors Flutter)
  const fixedShareTotal     = items.filter(b => b.shareType === 'fixed').reduce((s, b) => s + b.sharePercentage, 0);
  const voluntaryShareTotal = items.filter(b => b.shareType !== 'fixed').reduce((s, b) => s + b.sharePercentage, 0);
  const voluntaryRemaining  = Math.max(0, 33.33 - voluntaryShareTotal);

  const handleSave = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const share = parseFloat(form.sharePercentage);
      if (!share || share <= 0) {
        const msg = 'Share percentage must be greater than 0';
        setFormError(msg); toast(msg, 'error'); setSaving(false); return;
      }
      if (form.shareType === 'voluntary') {
        if (share > 33.33) {
          const msg = 'Voluntary bequests are limited to 33.33% (1/3 of estate) per Islamic law';
          setFormError(msg); toast(msg, 'error'); setSaving(false); return;
        }
        if (voluntaryShareTotal + share > 33.33) {
          const msg = `Total voluntary share would be ${(voluntaryShareTotal + share).toFixed(2)}%, exceeding the 1/3 limit. You have ${voluntaryRemaining.toFixed(2)}% remaining.`;
          setFormError(msg); toast(msg, 'error'); setSaving(false); return;
        }
      }
      await api.addWasiyyah({
        beneficiaryName: form.beneficiaryName,
        relationship: form.relationship,
        sharePercentage: share,
        shareType: form.shareType,
        assetDescription: form.assetDescription || undefined,
        notes: form.notes || undefined,
      });
      toast('Beneficiary added', 'success');
      setShowForm(false);
      setForm({ beneficiaryName: '', relationship: 'spouse', sharePercentage: '', shareType: 'voluntary', assetDescription: '', notes: '' });
      load();
    } catch { toast('Failed to add beneficiary', 'error'); }
    setSaving(false);
  };

  const confirmDeleteItem = async () => {
    if (!deleteConfirmId) return;
    const { type, id } = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      if (type === 'beneficiary') {
        await api.deleteWasiyyah(id);
        toast('Beneficiary removed', 'success');
      } else {
        await api.deleteWasiyyahObligation(id);
        toast('Obligation removed', 'success');
      }
      load();
    } catch { toast(`Failed to remove ${type}`, 'error'); }
  };

  const handleObSave = async () => {
    setSaving(true);
    try {
      const obAmt = parseFloat(obForm.amount);
      if (!obAmt || obAmt <= 0) { toast('Amount must be greater than zero', 'error'); setSaving(false); return; }
      await api.addWasiyyahObligation({ ...obForm, amount: obAmt });
      toast('Obligation recorded', 'success');
      setShowObForm(false);
      setObForm({ type: 'ZAKAT', amount: '', currency: currencyCode, description: '', recipient: '', notes: '' });
      load();
    } catch { toast('Failed to record obligation', 'error'); }
    setSaving(false);
  };

  const markFulfilled = async (ob: Obligation) => {
    await api.updateWasiyyahObligation(ob.id, { status: ob.status === 'pending' ? 'fulfilled' : 'pending' })
      .catch(() => toast('Failed to update status', 'error'));
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  // NOTE: totalPending sums raw amounts across obligations without currency
  // conversion, then displays with the user's preferred currency. This is
  // an approximation and will be misleading if obligations have mixed
  // currencies. A proper fix would group per-currency (or convert via FX)
  // — see tracking issue. For now we render with the user's symbol.
  const totalPending = obligations.filter(o => o.status === 'pending').reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      {/* Estate Sharing Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <span className="text-xl">👨‍👩‍👧‍👦</span>
        <div className="flex-1">
          <p className="text-sm text-green-800 font-medium">Share your Wasiyyah with family</p>
          <p className="text-xs text-green-600 mt-1">
            Family plan members can view each other&apos;s wills and estate plans through Shared Finances.
          </p>
        </div>
        <a href="/dashboard/shared" className="text-xs text-primary font-semibold hover:underline whitespace-nowrap self-center">
          Go to Shared Finances &rarr;
        </a>
      </div>

      <PageHeader
        title="Wasiyyah (Islamic Will)"
        subtitle="1/3 bequest within Islamic estate planning rules"
        actions={
          <>
            {/* Islamic Shares Info button */}
            <button
              type="button"
              onClick={() => setShowSharesInfo(true)}
              title="Islamic Inheritance Guide"
              className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium"
            >
              📖 Guide
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                try { await api.downloadWasiyyahPdf(); }
                catch (err) { toast(err instanceof Error ? err.message : 'Failed to export PDF', 'error'); }
                finally { setExporting(false); }
              }}
              className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : '📄 PDF'}
            </button>
            <button
              type="button"
              onClick={() => tab === 'beneficiaries' ? setShowForm(true) : setShowObForm(true)}
              className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
            >
              {tab === 'beneficiaries' ? '+ Add Beneficiary' : '+ Record Obligation'}
            </button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6" role="tablist" aria-label="Wasiyyah sections">
        {(['beneficiaries', 'obligations'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            role="tab"
            aria-selected={tab === t}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${tab === t ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {t === 'beneficiaries'
              ? `📜 Beneficiaries (${items.length})`
              : `⚖️ Obligations${obligations.filter(o => o.status === 'pending').length > 0 ? ` (${obligations.filter(o => o.status === 'pending').length})` : ''}`
            }
          </button>
        ))}
      </div>

      {/* ── Beneficiaries Tab ── */}
      {tab === 'beneficiaries' && (
        <>
          {/* Estate Distribution Summary — mirrors Flutter 3-column card */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-teal-700 rounded-2xl p-6 text-white mb-6">
            <p className="text-green-200 text-sm mb-3">Estate Distribution</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{fixedShareTotal.toFixed(1)}%</p>
                <p className="text-green-200 text-xs mt-0.5">Fixed (Fard)</p>
              </div>
              <div className="border-x border-white/30">
                <p className="text-2xl font-bold">{voluntaryShareTotal.toFixed(1)}%</p>
                <p className="text-green-200 text-xs mt-0.5">Voluntary</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${voluntaryRemaining <= 0 ? 'text-red-300' : ''}`}>
                  {voluntaryRemaining.toFixed(1)}%
                </p>
                <p className="text-green-200 text-xs mt-0.5">Vol. Remaining</p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-4">
              <div
                className={`h-2 rounded-full ${(fixedShareTotal + voluntaryShareTotal) > 100 ? 'bg-red-400' : 'bg-white'}`}
                style={{ width: `${Math.min(fixedShareTotal + voluntaryShareTotal, 100)}%` }}
              />
            </div>
            <p className="text-green-200 text-xs mt-1 text-right">
              {(fixedShareTotal + voluntaryShareTotal).toFixed(1)}% allocated total
            </p>
          </div>

          {/* 1/3 voluntary limit note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">ℹ️</span>
              <div className="text-sm text-amber-900">
                <strong>Voluntary bequests are limited to 1/3 (33.33%)</strong> of your estate per Islamic law (Sahih al-Bukhari 2742).
                Fixed (Fard) shares follow the Quranic schedule and are not capped.
              </div>
            </div>
          </div>

          {/* Hadith guidance (collapsible) */}
          <details className="bg-amber-50 border border-amber-200 rounded-xl mb-6 group">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none">
              <span className="font-bold text-amber-900 text-sm">📖 Islamic Guidance on Wasiyyah</span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-5 space-y-3 text-sm text-amber-900">
              <p>
                <strong>The 1/3 Rule:</strong> Sa&apos;d ibn Abi Waqqas (رضي الله عنه) said: <em>&quot;I was ill and the Prophet (ﷺ) visited me. I said, &apos;O Messenger of Allah, may I bequeath all my wealth?&apos; He said, &apos;No.&apos; I said, &apos;Then half?&apos; He said, &apos;No.&apos; I said, &apos;Then one-third?&apos; He said, &apos;One-third, and one-third is a lot.&apos;&quot;</em> — <strong>Sahih al-Bukhari 2742</strong>
              </p>
              <p>
                <strong>No Bequest to Heirs:</strong> <em>&quot;Allah has given every deserving person his right, so there is no bequest for an heir.&quot;</em> — <strong>Sunan Abu Dawud 2870</strong>
              </p>
              <p>
                <strong>Obligation:</strong> <em>&quot;It is not right for a Muslim who has something to bequeath to sleep two nights without having his will written down.&quot;</em> — <strong>Sahih al-Bukhari 2738</strong>
              </p>
              <p className="text-xs text-amber-700">Fixed-share heirs (spouse, children, parents) receive their Quranic portions (Surah An-Nisa 4:11-12) automatically. Voluntary bequests are only for non-heirs.</p>
            </div>
          </details>

          {/* Over-limit warning */}
          {voluntaryShareTotal > 33.33 && items.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 mb-6">
              <strong>Over voluntary limit:</strong> {voluntaryShareTotal.toFixed(1)}% is {(voluntaryShareTotal - 33.33).toFixed(1)}% over the 1/3 Sunnah limit.
              {(() => {
                const largest = [...items.filter(b => b.shareType !== 'fixed')].sort((a, b) => b.sharePercentage - a.sharePercentage)[0];
                const excess = voluntaryShareTotal - 33.33;
                return largest ? ` Reduce "${largest.beneficiaryName}" (${largest.sharePercentage}%) by at least ${excess.toFixed(1)}%.` : '';
              })()}
            </div>
          )}

          {/* Beneficiary list */}
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map(b => {
                const isFixed = b.shareType === 'fixed';
                return (
                  <div key={b.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4" role="listitem">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${isFixed ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {relEmoji(b.relationship)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-primary">{b.beneficiaryName}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isFixed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {isFixed ? 'FARD' : 'VOLUNTARY'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">
                        {b.relationship}{b.assetDescription ? ` · ${b.assetDescription}` : ''}{b.notes ? ` · ${b.notes}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className={`text-2xl font-bold ${isFixed ? 'text-primary' : 'text-orange-600'}`}>
                        {b.sharePercentage}%
                      </p>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId({ type: 'beneficiary', id: b.id })}
                        aria-label={`Delete beneficiary ${b.beneficiaryName}`}
                        className="text-gray-300 hover:text-red-500 transition text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="📜"
              title="Write your wasiyyah today"
              description="The Prophet (ﷺ) said a Muslim should not sleep two nights without their will written. Add beneficiaries and your family will know exactly what was intended."
              actions={[
                { label: '+ Add beneficiary', onClick: () => setShowForm(true), primary: true },
                { label: '📖 Read the guide', onClick: () => setShowSharesInfo(true) },
              ]}
              preview={
                <div className="space-y-2">
                  {[
                    { name: 'Spouse', rel: 'Wife', share: '1/8 (12.5%)', tag: 'FARD' },
                    { name: 'Sons (×2)', rel: 'Children', share: '5/12 each', tag: 'FARD' },
                    { name: 'Daughter', rel: 'Child', share: '5/24 (20.8%)', tag: 'FARD' },
                  ].map((b) => (
                    <div key={b.name} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-gray-700">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.rel}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{b.share}</p>
                        <span className="text-[10px] font-bold text-green-700">{b.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </>
      )}

      {/* ── Obligations Tab ── */}
      {tab === 'obligations' && (
        <>
          <div className="bg-gradient-to-r from-amber-700 to-orange-600 rounded-2xl p-6 text-white mb-6">
            <p className="text-amber-200 text-sm">Total Pending Obligations</p>
            <p className="text-4xl font-bold">{fmt(totalPending)}</p>
            <p className="text-amber-200 text-sm mt-1">
              {obligations.filter(o => o.status === 'pending').length} obligation(s) to be settled from estate
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-6">
            <strong>What are Obligations?</strong> Islamic duties (Wajibat) — unpaid Zakat, Kaffarah, loans etc. — that must be settled
            in full from your estate <em>before</em> any inheritance is distributed. Not subject to the 1/3 limit.
          </div>

          {obligations.length > 0 ? (
            <div className="space-y-3" role="list">
              {obligations.map(ob => {
                const typeInfo = OBLIGATION_TYPES.find(t => t.value === ob.type) ?? OBLIGATION_TYPES[OBLIGATION_TYPES.length - 1];
                return (
                  <div key={ob.id} className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 ${ob.status === 'fulfilled' ? 'border-green-400 opacity-60' : 'border-amber-400'}`} role="listitem">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-lg">{typeInfo.emoji}</span>
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{typeInfo.label}</span>
                          {ob.status === 'fulfilled' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Fulfilled</span>}
                        </div>
                        <p className="font-semibold text-gray-800 truncate">{ob.description}</p>
                        {ob.recipient && <p className="text-sm text-gray-500">→ {ob.recipient}</p>}
                        {ob.notes && <p className="text-xs text-gray-400 mt-1 italic">{ob.notes}</p>}
                        <div className="flex gap-3 mt-3">
                          <button
                            type="button"
                            onClick={() => markFulfilled(ob)}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            {ob.status === 'pending' ? '✓ Mark fulfilled' : '↩ Mark pending'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId({ type: 'obligation', id: ob.id })}
                            className="text-xs text-gray-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-amber-700 flex-shrink-0">
                        {new Intl.NumberFormat(undefined, { style: 'currency', currency: ob.currency || 'USD' }).format(ob.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="⚖️"
              title="Record your Islamic obligations"
              description="Unpaid Zakat, kaffarah, or loans must be settled from your estate before inheritance is divided. Recording them here makes that easier on your family."
              actions={[
                { label: '+ Record obligation', onClick: () => setShowObForm(true), primary: true },
              ]}
              preview={
                <div className="space-y-2">
                  {[
                    { type: '🕌 Unpaid Zakat', desc: 'Zakat for 2024 owed', amt: '$640' },
                    { type: '💰 Unpaid loan', desc: 'Borrowed from Yusuf in 2023', amt: '$1,200' },
                    { type: '📿 Kaffarah', desc: 'Broken oath atonement', amt: '$60' },
                  ].map((o) => (
                    <div key={o.type} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-gray-700">{o.type}</p>
                        <p className="text-xs text-gray-400">{o.desc}</p>
                      </div>
                      <span className="font-semibold text-amber-700">{o.amt}</span>
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </>
      )}

      {/* ── Islamic Shares Info Modal ── */}
      {showSharesInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📖</span>
              <h2 className="text-xl font-bold text-primary">Islamic Inheritance Guide</h2>
            </div>
            <p className="text-sm font-semibold text-primary mb-3">
              Qur&apos;anic Inheritance Shares (Surah An-Nisa 4:11-12)
            </p>
            {Object.keys(islamicShares).length > 0 ? (
              <div className="space-y-2 mb-4">
                {Object.entries(islamicShares).map(([rel, desc]) => (
                  <div key={rel} className="flex gap-3 items-start py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xl flex-shrink-0">{relEmoji(rel)}</span>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">{rel}</p>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Quranic share data unavailable.</p>
            )}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800 mb-4">
              <strong className="block mb-1">Important Disclaimer</strong>
              These calculations provide general guidance based on Qur&apos;anic shares (Surah An-Nisa 4:11-12).
              Actual inheritance depends on: (1) complete family composition, (2) presence of &apos;Asaba (male residuary heirs),
              (3) your madhab, (4) local laws. <strong>Consult a qualified Islamic scholar (Mufti) and legal
              professional for your specific situation before finalizing any estate distribution.</strong>
            </div>
            <button
              type="button"
              onClick={() => setShowSharesInfo(false)}
              className="w-full bg-[#1B5E20] text-white rounded-lg py-2.5 font-medium hover:bg-[#2E7D32]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Add Beneficiary Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary mb-4">Add Beneficiary</h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
                ⚠️ {formError}
              </div>
            )}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="ben-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  id="ben-name"
                  value={form.beneficiaryName}
                  onChange={e => setForm({ ...form, beneficiaryName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Full name"
                />
              </div>

              {/* Relationship dropdown with emoji */}
              <div>
                <label htmlFor="ben-rel" className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                <select
                  id="ben-rel"
                  value={form.relationship}
                  onChange={e => setForm({ ...form, relationship: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                >
                  {RELATIONSHIPS.map(r => (
                    <option key={r.value} value={r.value}>{r.emoji} {r.label}</option>
                  ))}
                </select>
              </div>

              {/* Share type + percentage in a row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="ben-share" className="block text-sm font-medium text-gray-700 mb-1">Share % *</label>
                  <input
                    id="ben-share"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={form.sharePercentage}
                    onChange={e => setForm({ ...form, sharePercentage: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="10"
                  />
                </div>
                <div className="w-44">
                  <label htmlFor="ben-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    id="ben-type"
                    value={form.shareType}
                    onChange={e => setForm({ ...form, shareType: e.target.value as 'fixed' | 'voluntary' })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
                  >
                    <option value="fixed">Fixed (Fard)</option>
                    <option value="voluntary">Voluntary</option>
                  </select>
                </div>
              </div>
              {form.shareType === 'voluntary' && (
                <p className="text-xs text-orange-600 -mt-2">
                  Remaining voluntary: <strong>{voluntaryRemaining.toFixed(1)}%</strong>
                </p>
              )}

              {/* Asset Description */}
              <div>
                <label htmlFor="ben-asset" className="block text-sm font-medium text-gray-700 mb-1">Asset Description (optional)</label>
                <input
                  id="ben-asset"
                  value={form.assetDescription}
                  onChange={e => setForm({ ...form, assetDescription: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="e.g. Property at 12 Oak Street, savings account"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="ben-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input
                  id="ben-notes"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Any additional instructions"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.beneficiaryName || !form.sharePercentage}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add Beneficiary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Obligation Modal ── */}
      {showObForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary mb-1">Record an Obligation</h2>
            <p className="text-sm text-gray-500 mb-4">An Islamic duty to be settled from your estate</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Obligation</label>
                <div className="flex flex-wrap gap-2">
                  {OBLIGATION_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setObForm({ ...obForm, type: t.value })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition ${obForm.type === t.value ? 'bg-[#1B5E20] border-primary text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                    >
                      <span>{t.emoji}</span> {t.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{OBLIGATION_TYPES.find(t => t.value === obForm.type)?.desc}</p>
              </div>
              <div>
                <label htmlFor="ob-desc" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  id="ob-desc"
                  value={obForm.description}
                  onChange={e => setObForm({ ...obForm, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder={obForm.type === 'ZAKAT' ? 'e.g. Zakat for 2024 — held back due to illness' : obForm.type === 'UNPAID_LOAN' ? 'e.g. £500 borrowed from Ahmed in 2022' : 'Brief description'}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="ob-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    id="ob-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={obForm.amount}
                    onChange={e => setObForm({ ...obForm, amount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-28">
                  <label htmlFor="ob-currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    id="ob-currency"
                    value={obForm.currency}
                    onChange={e => setObForm({ ...obForm, currency: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
                  >
                    {['USD','GBP','EUR','SAR','AED','CAD','AUD','PKR','MYR','BDT','NGN','EGP'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="ob-recipient" className="block text-sm font-medium text-gray-700 mb-1">Who should receive this? (optional)</label>
                <input
                  id="ob-recipient"
                  value={obForm.recipient}
                  onChange={e => setObForm({ ...obForm, recipient: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="e.g. Local mosque, Ahmed ibn Ibrahim"
                />
              </div>
              <div>
                <label htmlFor="ob-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes for family (optional)</label>
                <textarea
                  id="ob-notes"
                  value={obForm.notes}
                  onChange={e => setObForm({ ...obForm, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 resize-none"
                  rows={3}
                  placeholder="Any context your family needs to fulfil this obligation..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowObForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button
                type="button"
                onClick={handleObSave}
                disabled={saving || !obForm.description || !obForm.amount}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Record Obligation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🗑️</span>
              <div>
                <h3 className="font-bold text-gray-900">Remove {deleteConfirmId.type}?</h3>
                <p className="text-sm text-gray-600 mt-1">This will be permanently removed from your wasiyyah.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDeleteItem} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WasiyyahPage() {
  return (
    <ErrorBoundary>
      <WasiyyahPageContent />
    </ErrorBoundary>
  );
}
