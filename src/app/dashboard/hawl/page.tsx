'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { toHijri } from '../../../lib/format';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import ModalShell from '../../../components/ui/ModalShell';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';
// 2026-06-08 (EDGE-HIJRI-LOCALE-1): toLocaleDateString sites use getLocale().
import { useI18n, getLocale } from '../../../lib/i18n';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';

interface HawlItem {
  id: number;
  assetName: string;
  assetType: string;
  amount: number;
  nisabThreshold: number;
  zakatAmount: number;
  hawlStartDate: number;
  hawlEndDate: number;
  zakatPaid: boolean;
  active: boolean;
  zakatLocked: boolean;
  zakatLockedDate: number;
  lockedNisabValue: number;
  lockedGoldPrice: number;
  lockedZakatAmount: number;
  effectiveZakatAmount: number;
  continuityStatus?: string;
  awaitingNisabRecovery?: boolean;
  autoResetApplied?: boolean;
  lastBelowNisabDate?: number | null;
  recoveryDate?: number | null;
}
const TYPES = ['cash', 'gold', 'silver', 'crypto', 'stocks', 'business', 'other'];

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
};

function HawlPageContent() {
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  const typeLabel = (ty: string) => {
    switch (ty) {
      case 'cash': return t('hawlTypeCash');
      case 'gold': return t('hawlTypeGold');
      case 'silver': return t('hawlTypeSilver');
      case 'crypto': return t('hawlTypeCrypto');
      case 'stocks': return t('hawlTypeStocks');
      case 'business': return t('hawlTypeBusiness');
      default: return t('hawlTypeOther');
    }
  };
  const [items, setItems] = useState<HawlItem[]>([]);
  const [nextDueDate, setNextDueDate] = useState<number | null>(null);
  const [nextDueAsset, setNextDueAsset] = useState<string>('');
  const [nextDueDays, setNextDueDays] = useState<number>(0);
  const [nextDueAmount, setNextDueAmount] = useState<number>(0);
  const [liveNisab, setLiveNisab] = useState<number>(0);
  const [currentZakatableWealth, setCurrentZakatableWealth] = useState<number>(0);
  const [nisabWarning, setNisabWarning] = useState<string>('');
  const [continuityMessage, setContinuityMessage] = useState<string>('');
  const [continuityResetCount, setContinuityResetCount] = useState<number>(0);
  const [pausedTrackerCount, setPausedTrackerCount] = useState<number>(0);
  const [continuityTrackingActive, setContinuityTrackingActive] = useState<boolean>(false);
  const [lastBelowNisabDate, setLastBelowNisabDate] = useState<number | null>(null);
  const [lastRecoveryDate, setLastRecoveryDate] = useState<number | null>(null);
  const [nisabMethodology, setNisabMethodology] = useState<string>('');
  const [wealthSource, setWealthSource] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [defaultNisabThreshold, setDefaultNisabThreshold] = useState('5000');
  const [form, setForm] = useState({ assetName: '', assetType: 'cash', amount: '', nisabThreshold: '5000', startDate: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [allPaidMessage, setAllPaidMessage] = useState<string | null>(null);
  const [editingDateId, setEditingDateId] = useState<number | null>(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [dateInputMode, setDateInputMode] = useState<'gregorian' | 'hijri'>('gregorian');
  const [hijriInput, setHijriInput] = useState({ year: '', month: '', day: '' });
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  // Reset with reason
  const [resetModal, setResetModal] = useState<{ id: number } | null>(null);
  const [resetReason, setResetReason] = useState('nisab_drop');
  const [resetNote, setResetNote] = useState('');
  // Manual wealth adjustment
  const [manualWealth, setManualWealth] = useState('');
  const [manualWealthNote, setManualWealthNote] = useState('');
  const [manualWealthSaving, setManualWealthSaving] = useState(false);
  // History
  const [historyItems, setHistoryItems] = useState<HawlItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  // 2026-05-02: lock body scroll while any modal is open.
  useBodyScrollLock(showForm || showHistory);
  const { toast } = useToast();
  const maxStartInput = new Date().toISOString().slice(0, 10);
  const minBackdateInput = new Date(Date.now() - 3650 * 86400000).toISOString().slice(0, 10);

  const load = useCallback(() => {
    setLoading(true);
    api.getHawl().then(d => {
      if (d?.error) { toast(d.error, 'error'); return; }
      setItems(Array.isArray(d?.trackers) ? d.trackers : Array.isArray(d) ? d : []);
      setNextDueDate(d?.nextZakatDueDate || null);
      setNextDueAsset(d?.nextZakatDueAsset || '');
      setNextDueDays(d?.nextZakatDueDays || 0);
      setNextDueAmount(d?.nextZakatDueAmount || 0);
      const liveThreshold = typeof d?.liveNisab === 'number' ? d.liveNisab.toFixed(2) : '5000';
      setDefaultNisabThreshold(liveThreshold);
      setLiveNisab(typeof d?.liveNisab === 'number' ? d.liveNisab : 0);
      setCurrentZakatableWealth(typeof d?.currentZakatableWealth === 'number' ? d.currentZakatableWealth : typeof d?.totalActiveAmount === 'number' ? d.totalActiveAmount : 0);
      setNisabWarning(d?.nisabWarning || '');
      setContinuityMessage(d?.continuityMessage || '');
      setContinuityResetCount(typeof d?.continuityResetCount === 'number' ? d.continuityResetCount : 0);
      setPausedTrackerCount(typeof d?.pausedTrackerCount === 'number' ? d.pausedTrackerCount : 0);
      setContinuityTrackingActive(Boolean(d?.continuityTrackingActive));
      setLastBelowNisabDate(typeof d?.lastBelowNisabDate === 'number' ? d.lastBelowNisabDate : null);
      setLastRecoveryDate(typeof d?.lastRecoveryDate === 'number' ? d.lastRecoveryDate : null);
      setNisabMethodology(typeof d?.nisabMethodology === 'string' ? d.nisabMethodology : '');
      setWealthSource(typeof d?.wealthSource === 'string' ? d.wealthSource : '');
    }).catch(() => { toast(t('hawlLoadError'), 'error'); }).finally(() => setLoading(false));
    // `t` is a fresh identity each render; including it would make `load` a new
    // function every render and the `[load]` effect refire forever. Keep `toast`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    setForm(prev => {
      if (prev.assetName || prev.amount || prev.startDate || prev.nisabThreshold === defaultNisabThreshold) {
        return prev;
      }
      return { ...prev, nisabThreshold: defaultNisabThreshold };
    });
  }, [defaultNisabThreshold]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const amt = parseFloat(form.amount);
    const nisab = parseFloat(form.nisabThreshold);
    if (!form.assetName.trim()) { setSaveError(t('hawlAssetNameRequired')); setSaving(false); return; }
    if (isNaN(amt) || amt <= 0) { setSaveError(t('hawlAmountPositiveError')); setSaving(false); return; }
    if (isNaN(nisab) || nisab <= 0) { setSaveError(t('hawlNisabPositiveError')); setSaving(false); return; }

    const data: Record<string, unknown> = { assetName: form.assetName, assetType: form.assetType, amount: amt, nisabThreshold: nisab };
    // Custom start date (noon UTC to avoid timezone edge cases)
    if (form.startDate) {
      data.hawlStartDate = new Date(form.startDate + 'T12:00:00Z').getTime();
      // HIGH BUG FIX (H-4): reject future start dates. Hawl is backdated only —
      // you cannot begin a lunar year that hasn't happened yet.
      if ((data.hawlStartDate as number) > Date.now()) {
        setSaveError(t('hawlStartFutureError'));
        setSaving(false);
        return;
      }
    }
    try {
      await api.addHawl(data);
      setShowForm(false); setForm({ assetName: '', assetType: 'cash', amount: '', nisabThreshold: defaultNisabThreshold, startDate: '' }); load();
      toast(t('hawlTrackerAdded'), 'success');
    } catch (e: unknown) { const msg = e instanceof Error ? e.message : t('hawlSaveError'); setSaveError(msg); toast(msg, 'error'); }
    setSaving(false);
  };

  const handleMarkPaid = async (id: number) => {
    try {
      const result = await api.markHawlPaid(id);
      if (result?.allZakatPaid) {
        setAllPaidMessage(result.allPaidMessage || t('hawlAllPaidFallback'));
      }
      load();
    } catch {
      toast(t('hawlMarkPaidError'), 'error');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (allPaidMessage) {
      timer = setTimeout(() => setAllPaidMessage(null), 8000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [allPaidMessage]);

  const handleReset = (id: number) => {
    setResetModal({ id });
    setResetReason('nisab_drop');
    setResetNote('');
  };

  const handleResetConfirm = async () => {
    if (!resetModal) return;
    try {
      await api.resetHawl(resetModal.id, resetReason, resetNote || undefined);
      toast(t('hawlResetSuccess'), 'success');
      setResetModal(null);
      load();
    } catch {
      toast(t('hawlResetError'), 'error');
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const d = await api.getHawlHistory();
      setHistoryItems(Array.isArray(d?.history) ? d.history : []);
    } catch {
      toast(t('hawlHistoryError'), 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleManualWealth = async () => {
    const amount = parseFloat(manualWealth);
    if (isNaN(amount) || amount < 0) {
      toast(t('hawlInvalidAmountError'), 'error');
      return;
    }
    setManualWealthSaving(true);
    try {
      await api.setHawlManualWealth(amount, manualWealthNote || undefined);
      toast(t('hawlManualWealthSuccess'), 'success');
      load();
    } catch {
      toast(t('hawlManualWealthError'), 'error');
    } finally {
      setManualWealthSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmAction({
      message: t('hawlDeleteConfirm'),
      action: async () => {
        setDeletingId(id);
        try {
          await api.deleteHawl(id);
          toast(t('hawlTrackerDeleted'), 'success');
        } catch {
          toast(t('hawlTrackerDeleteError'), 'error');
        } finally {
          setDeletingId(null);
          load();
        }
      }
    });
  };

  const handleLockZakat = async (id: number) => {
    try {
      const result = await api.lockHawlZakat(id);
      toast(result?.message || t('hawlLockedToast'), 'success');
      load();
    } catch {
      toast(t('hawlLockError'), 'error');
    }
  };

  const handleUnlockZakat = (id: number) => {
    setConfirmAction({
      message: t('hawlUnlockConfirm'),
      action: async () => {
        try {
          const result = await api.unlockHawlZakat(id);
          toast(result?.message || t('hawlUnlockedToast'), 'success');
          load();
        } catch {
          toast(t('hawlUnlockError'), 'error');
        }
      }
    });
  };

  const handleImportAssets = async () => {
    setImporting(true);
    try {
      const result = await api.importAssetsToHawl();
      if (result?.error) { toast(result.error, 'error'); return; }
      toast(result?.message || tFmt('hawlImportSuccessFmt', [result?.importedCount || 0]), 'success');
      load();
    } catch {
      toast(t('hawlImportError'), 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleUpdateStartDate = async (id: number) => {
    try {
      let data: Record<string, unknown>;
      if (dateInputMode === 'gregorian') {
        if (!newStartDate) { toast(t('hawlSelectDate'), 'error'); return; }
        const startMs = new Date(newStartDate + 'T12:00:00Z').getTime();
        if (startMs > Date.now()) {
          toast(t('hawlStartFutureError'), 'error');
          return;
        }
        data = { hawlStartDate: startMs };
      } else {
        const y = parseInt(hijriInput.year), m = parseInt(hijriInput.month), d = parseInt(hijriInput.day);
        if (!y || !m || !d) { toast(t('hawlInvalidHijri'), 'error'); return; }
        if (d < 1 || d > 30) { toast(t('hawlDayRangeError'), 'error'); return; }
        if (m < 1 || m > 12) { toast(t('hawlMonthRangeError'), 'error'); return; }
        data = { hijriYear: y, hijriMonth: m, hijriDay: d };
      }
      const result = await api.updateHawlStartDate(id, data);
      toast(result?.message || t('hawlStartDateUpdated'), 'success');
      resetDateEditor();
      load();
    } catch {
      toast(t('hawlStartDateError'), 'error');
    }
  };

  const formatHijriDate = (epochMs: number) => {
    const h = toHijri(new Date(epochMs));
    return `${h.day} ${h.monthName} ${h.year} AH`;
  };

  const formatDate = (epochMs: number | null) => {
    if (!epochMs) return '';
    return new Date(epochMs).toLocaleDateString(getLocale(), DATE_FORMAT);
  };

  const resetDateEditor = () => {
    setEditingDateId(null);
    setDateInputMode('gregorian');
    setNewStartDate('');
    setHijriInput({ year: '', month: '', day: '' });
  };

  const openDateEditor = (item: HawlItem) => {
    if (editingDateId === item.id) {
      resetDateEditor();
      return;
    }
    setEditingDateId(item.id);
    setDateInputMode('gregorian');
    setNewStartDate(new Date(item.hawlStartDate || Date.now()).toISOString().slice(0, 10));
    setHijriInput({ year: '', month: '', day: '' });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const zakatDue = items.filter(i => !i.zakatPaid && i.hawlEndDate && i.hawlEndDate < Date.now());
  const pending = items.filter(i => !i.zakatPaid && (!i.hawlEndDate || i.hawlEndDate >= Date.now()));

  return (
    <div>
      {/* All Paid Celebration Banner */}
      {allPaidMessage && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white mb-6 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-lg">{allPaidMessage}</p>
              <p className="text-white/80 text-sm mt-1">{t('hawlAllPaidSubtitle')}</p>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title={t('hawlTitle')}
        subtitle={t('hawlSubtitle')}
        actions={
          <>
            <button type="button" onClick={handleImportAssets} disabled={importing} className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-green-50 font-medium disabled:opacity-50 text-sm">
              {importing ? t('hawlImportingBtn') : t('hawlImportBtn')}
            </button>
            <button type="button" onClick={() => { setForm(prev => ({ ...prev, nisabThreshold: defaultNisabThreshold })); setShowForm(true); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">{t('hawlAddBtn')}</button>
          </>
        }
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900 mb-6 space-y-3">
        <h3 className="font-bold text-base">{t('hawlGuidanceHeading')}</h3>
        <p>
          <strong>{t('hawlWhatIsLabel')}</strong> {t('hawlWhatIsBody')}
        </p>
        <p>
          {t('hawlHadithIntro')} <em>{t('hawlHadithText')}</em> — <strong>{t('hawlHadithCitation')}</strong>
        </p>
        <p>
          <strong>{t('hawlHowItWorksLabel')}</strong> {t('hawlHowItWorksBody')}
        </p>
      </div>

      {continuityTrackingActive && (
        <div className="bg-white border border-emerald-200 rounded-xl p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-700">{t('hawlContinuityHeading')}</p>
              <p className="text-sm text-gray-600 mt-1">
                {tFmt('hawlContinuityBodyFmt', [fmt(currentZakatableWealth), fmt(liveNisab)])}
              </p>
              {nisabMethodology && (
                <p className="text-xs text-gray-500 mt-1">{t('hawlMethodLabel')} {
                  nisabMethodology === 'CLASSICAL_SILVER' ? t('fiqhNisabSilver')
                  : nisabMethodology === 'LOWER_OF_TWO' ? t('fiqhNisabLower')
                  : nisabMethodology === 'AMJA_GOLD' ? t('fiqhNisabGold')
                  : nisabMethodology}{wealthSource ? tFmt('hawlMethodSourceFmt', [wealthSource.replace('_', ' ')]) : ''}</p>
              )}
            </div>
            <div className="text-right">
              {continuityResetCount > 0 && <p className="text-sm font-semibold text-emerald-700">{tFmt('hawlAutoResetCountFmt', [continuityResetCount])}</p>}
              {pausedTrackerCount > 0 && <p className="text-sm font-semibold text-red-600">{tFmt('hawlAwaitingRecoveryFmt', [pausedTrackerCount])}</p>}
            </div>
          </div>
          {continuityMessage && <p className="text-sm text-emerald-700 mt-3">{continuityMessage}</p>}
          {nisabWarning && <p className="text-sm text-red-700 mt-3">{nisabWarning}</p>}
          {(lastBelowNisabDate || lastRecoveryDate) && (
            <p className="text-xs text-gray-500 mt-3">
              {lastBelowNisabDate && tFmt('hawlLastBelowFmt', [formatDate(lastBelowNisabDate)])}
              {lastBelowNisabDate && lastRecoveryDate && ' • '}
              {lastRecoveryDate && tFmt('hawlLastRecoveryFmt', [formatDate(lastRecoveryDate)])}
            </p>
          )}
        </div>
      )}

      {!loading && items.length === 0 && currentZakatableWealth > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-900">
          <p className="font-semibold mb-1">{t('hawlMismatchTitle')}</p>
          <p className="mb-2">
            <strong>{t('hawlMismatchDashLabel')}</strong> {t('hawlMismatchBody1')}
          </p>
          <p>
            <strong>{t('hawlMismatchTrackerLabel')}</strong>{' '}{t('hawlMismatchBody2a')} <strong>{t('hawlImportFromAssetsBold')}</strong>{' '}{t('hawlMismatchBody2b')}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* 2026-05-11 (Bug-A10): "Zakat Due 0" was ambiguous — is that
            $0 or 0 trackers? Suffix with units. */}
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">{t('hawlTracking')}</p>
          <p className="text-2xl font-bold text-primary">{items.length} <span className="text-sm font-medium text-gray-400">{items.length === 1 ? t('hawlAssetSingular') : t('hawlAssetPlural')}</span></p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-gray-500 text-sm">{t('hawlZakatDueLabel')}</p>
          <p className="text-2xl font-bold text-amber-600">{zakatDue.length} <span className="text-sm font-medium text-gray-400">{zakatDue.length === 1 ? t('hawlTrackerSingular') : t('hawlTrackerPlural')}</span></p>
        </div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">{t('hawlCurrentWealth')}</p><p className="text-2xl font-bold text-primary">{fmt(currentZakatableWealth)}</p></div>
      </div>

      {nextDueDate && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">&#8987;</span>
            <p className="font-bold text-lg">{t('hawlNextDueTitle')}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/90 font-semibold">{nextDueAsset}</p>
              <p className="text-white/70 text-sm">{new Date(nextDueDate).toLocaleDateString(getLocale(), DATE_FORMAT)}</p>
              <p className="text-white/50 text-xs">{formatHijriDate(nextDueDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{nextDueDays}<span className="text-lg ml-1">{t('hawlDays')}</span></p>
              <p className="text-white/60 text-sm">{tFmt('hawlZakatColonFmt', [fmt(nextDueAmount)])}</p>
            </div>
          </div>
        </div>
      )}

      {zakatDue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-amber-700 mb-3">{t('hawlZakatDueHeading')}</h2>
          <div className="space-y-2">
            {zakatDue.map(item => (
              <div key={item.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-primary">{item.assetName}</p>
                    <p className="text-sm text-gray-500">{typeLabel(item.assetType)} &bull; {fmt(item.amount)}</p>
                    <p className="text-xs text-gray-400 mt-1">{tFmt('hawlHawlRangeFmt', [formatHijriDate(item.hawlStartDate), formatHijriDate(item.hawlEndDate)])}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-amber-600">{fmt(item.effectiveZakatAmount || item.zakatAmount)}</p>
                    <button type="button" onClick={() => handleMarkPaid(item.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">{t('hawlPaidBtn')}</button>
                    <button type="button" onClick={() => openDateEditor(item)} className="text-purple-600 hover:text-purple-800 text-sm" title={t('hawlChangeDateTitle')}>&#128197;</button>
                    <button type="button" onClick={() => handleReset(item.id)} className="text-blue-600 hover:text-blue-800 text-sm" title={t('hawlResetCycleTitle')}>&#8635;</button>
                    <button type="button" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === item.id ? '...' : t('hawlDel')}</button>
                  </div>
                </div>
                {/* Date Editor */}
                {editingDateId === item.id && (
                  <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('hawlChangeStartHeading')}</p>
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => setDateInputMode('gregorian')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'gregorian' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'}`}>{t('hawlGregorian')}</button>
                      <button type="button" onClick={() => setDateInputMode('hijri')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'hijri' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'}`}>{t('hawlHijri')}</button>
                    </div>
                    {dateInputMode === 'gregorian' ? (
                      <input type="date" value={newStartDate} min={minBackdateInput} max={maxStartInput} onChange={e => setNewStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm text-gray-900 w-full" />
                    ) : (
                      <div className="flex gap-2">
                        <input type="number" placeholder={t('hawlYearPlaceholder')} value={hijriInput.year} onChange={e => setHijriInput({ ...hijriInput, year: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                        <input type="number" placeholder={t('hawlMonthPlaceholder')} min="1" max="12" value={hijriInput.month} onChange={e => setHijriInput({ ...hijriInput, month: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                        <input type="number" placeholder={t('hawlDayPlaceholder')} min="1" max="30" value={hijriInput.day} onChange={e => setHijriInput({ ...hijriInput, day: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={() => handleUpdateStartDate(item.id)} className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">{t('hawlUpdate')}</button>
                      <button type="button" onClick={resetDateEditor} className="text-gray-500 text-sm">{t('hawlCancel')}</button>
                    </div>
                  </div>
                )}
                {item.zakatLocked ? (
                  <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <span>&#128274;</span>
                      <span>{tFmt('hawlLockedRowFmt', [fmt(item.lockedZakatAmount || item.zakatAmount), item.assetType === 'silver' ? t('hawlSilverLabel') : t('hawlGoldLabel'), (item.lockedGoldPrice ?? 0).toFixed(2), new Date(item.zakatLockedDate).toLocaleDateString(getLocale(), DATE_FORMAT)])}</span>
                    </div>
                    <button type="button" onClick={() => handleUnlockZakat(item.id)} className="text-xs text-gray-500 hover:text-red-600 underline">{t('hawlUnlockBtn')}</button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button type="button" onClick={() => handleLockZakat(item.id)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      {tFmt('hawlLockBtnFmt', [item.assetType === 'silver' ? t('hawlSilverLabel').toLowerCase() : item.assetType === 'gold' ? t('hawlGoldLabel').toLowerCase() : t('hawlMetalLabel')])}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">{t('hawlPendingHeading')}</h2>
          <div className="space-y-2">
            {pending.map(item => {
              const start = item.hawlStartDate || Date.now();
              const end = item.hawlEndDate || start + 354.37 * 86400000;
              const total = end - start;
              const elapsed = Date.now() - start;
              // Guard against invalid date ranges
              let pct = 0;
              if (total <= 0) {
                pct = end < Date.now() ? 100 : 0;
              } else {
                pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);
              }
              const daysLeft = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
              return (
                <div key={item.id} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-primary">{item.assetName}</p>
                      <p className="text-sm text-gray-500">{typeLabel(item.assetType)} &bull; {fmt(item.amount)}</p>
                      {item.awaitingNisabRecovery && (
                        <p className="text-xs text-red-600 mt-1">{t('hawlAwaitingRecoveryNote')}</p>
                      )}
                      {item.autoResetApplied && item.recoveryDate && (
                        <p className="text-xs text-emerald-700 mt-1">{tFmt('hawlAutoResetNoteFmt', [formatDate(item.recoveryDate)])}</p>
                      )}
                      <p className="text-xs text-gray-400">{tFmt('hawlHawlRangeFmt', [formatHijriDate(start), formatHijriDate(end)])}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{tFmt('hawlDaysLeftFmt', [daysLeft])}</span>
                      <button type="button" onClick={() => openDateEditor(item)} className="text-purple-600 hover:text-purple-800 text-sm" title={t('hawlChangeDateTitle')}>&#128197;</button>
                      <button type="button" onClick={() => handleReset(item.id)} className="text-blue-600 hover:text-blue-800 text-sm" title={t('hawlResetCycleTitle')}>&#8635;</button>
                      <button type="button" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === item.id ? '...' : t('hawlDel')}</button>
                    </div>
                  </div>
                  {/* Date Editor */}
                  {editingDateId === item.id && (
                    <div className="mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Change Hawl Start Date</p>
                      <div className="flex gap-2 mb-2">
                        <button type="button" onClick={() => setDateInputMode('gregorian')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'gregorian' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'}`}>Gregorian</button>
                        <button type="button" onClick={() => setDateInputMode('hijri')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'hijri' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'}`}>Hijri</button>
                      </div>
                      {dateInputMode === 'gregorian' ? (
                        <input type="date" value={newStartDate} min={minBackdateInput} max={maxStartInput} onChange={e => setNewStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm text-gray-900 w-full" />
                      ) : (
                        <div className="flex gap-2">
                          <input type="number" placeholder={t('hawlYearPlaceholder')} value={hijriInput.year} onChange={e => setHijriInput({ ...hijriInput, year: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                          <input type="number" placeholder={t('hawlMonthPlaceholder')} min="1" max="12" value={hijriInput.month} onChange={e => setHijriInput({ ...hijriInput, month: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                          <input type="number" placeholder={t('hawlDayPlaceholder')} min="1" max="30" value={hijriInput.day} onChange={e => setHijriInput({ ...hijriInput, day: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => handleUpdateStartDate(item.id)} className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">Update</button>
                        <button type="button" onClick={resetDateEditor} className="text-gray-500 text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} /></div>
                  {item.zakatLocked ? (
                    <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
                      <span className="text-green-700">&#128274; {tFmt('hawlLockedRowFmt', [fmt(item.lockedZakatAmount), item.assetType === 'silver' ? t('hawlSilverLabel') : t('hawlGoldLabel'), (item.lockedGoldPrice ?? 0).toFixed(2), new Date(item.zakatLockedDate).toLocaleDateString(getLocale(), DATE_FORMAT)])}</span>
                      <button type="button" onClick={() => handleUnlockZakat(item.id)} className="text-gray-500 hover:text-red-600 underline ml-2">{t('hawlUnlockBtn')}</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => handleLockZakat(item.id)} className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      {tFmt('hawlLockBtnFmt', [item.assetType === 'silver' ? t('hawlSilverLabel').toLowerCase() : item.assetType === 'gold' ? t('hawlGoldLabel').toLowerCase() : t('hawlMetalLabel')])}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <EmptyState
          illustration="calendar"
          title={t('hawlEmptyTitle')}
          description={t('hawlEmptyDesc')}
          actions={[
            { label: importing ? t('hawlEmptyImportingBtn') : t('hawlEmptyImportBtn'), onClick: handleImportAssets, primary: true },
            { label: t('hawlEmptyAddManual'), href: '/dashboard/assets' },
          ]}
          preview={
            <div className="space-y-2">
              {[
                { name: t('hawlSampleName1'), start: t('hawlSampleStart1'), days: t('hawlSampleDays1'), status: 'on-track' },
                { name: t('hawlSampleName2'), start: t('hawlSampleStart2'), days: t('hawlSampleDays2'), status: 'on-track' },
                { name: t('hawlSampleName3'), start: t('hawlSampleStart3'), days: t('hawlSampleDays3'), status: 'paused' },
              ].map((h) => (
                <div key={h.name} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-700">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.start}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${h.status === 'on-track' ? 'text-emerald-600' : 'text-gray-400'}`}>{h.days}</p>
                    <span className={`text-[10px] uppercase tracking-wide ${h.status === 'on-track' ? 'text-emerald-500' : 'text-gray-400'}`}>{h.status === 'on-track' ? t('hawlSampleCounting') : t('hawlSamplePaused')}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      )}

      {/* ── Manual Wealth Adjustment ── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mt-6">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3">{t('hawlExternalHeading')}</h3>
        <p className="text-xs text-gray-500 mb-3">{t('hawlExternalDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="number" step="0.01" min="0" placeholder={t('hawlAmountPlaceholder')} value={manualWealth} onChange={e => setManualWealth(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-gray-900 text-sm" />
          <input type="text" placeholder={t('hawlNotePlaceholder')} value={manualWealthNote} onChange={e => setManualWealthNote(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-gray-900 text-sm" maxLength={200} />
          <button type="button" onClick={handleManualWealth} disabled={manualWealthSaving || !manualWealth} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap">{manualWealthSaving ? t('hawlSavingBtn') : t('hawlUpdateBtn')}</button>
        </div>
      </div>

      {/* ── Hawl History ── */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => { setShowHistory(!showHistory); if (!showHistory && historyItems.length === 0) loadHistory(); }}
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
        >
          {showHistory ? '▾' : '▸'} {tFmt('hawlPastCyclesFmt', [historyItems.length])}
        </button>
        {showHistory && (
          <div className="mt-3 space-y-3">
            {historyLoading ? (
              <p className="text-sm text-gray-400">{t('hawlLoadingHistory')}</p>
            ) : historyItems.length === 0 ? (
              <p className="text-sm text-gray-400">{t('hawlNoPastCycles')}</p>
            ) : (
              historyItems.map(item => {
                const itemAny = item as unknown as Record<string, unknown>;
                const status = (itemAny.historyStatus as string) || 'unknown';
                const reason = itemAny.resetReason as string;
                const note = itemAny.resetNote as string;
                const statusColors: Record<string, string> = {
                  paid: 'bg-green-100 text-green-700',
                  reset: 'bg-amber-100 text-amber-700',
                  deleted: 'bg-gray-100 text-gray-500',
                  deactivated: 'bg-blue-100 text-blue-700',
                };
                const startHijri = toHijri(new Date(item.hawlStartDate));
                const endHijri = toHijri(new Date(item.hawlEndDate));
                return (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">{item.assetName}</span>
                        <span className="text-xs text-gray-400 ml-2">{typeLabel(item.assetType)}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-500'}`}>
                        {status === 'paid' ? t('hawlStatusPaid') : status === 'reset' ? t('hawlStatusReset') : status === 'deleted' ? t('hawlStatusDeleted') : t('hawlStatusEnded')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>{fmt(item.amount)} · {tFmt('hawlZakatColonFmt', [fmt(item.zakatAmount)])}</p>
                      <p>{startHijri.day} {startHijri.monthName} {startHijri.year} AH → {endHijri.day} {endHijri.monthName} {endHijri.year} AH</p>
                      {reason && reason !== 'nisab_drop' && <p className="text-amber-600">{tFmt('hawlReasonFmt', [reason.replace(/_/g, ' ')])}</p>}
                      {note && <p className="italic text-gray-500">&ldquo;{note}&rdquo;</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {confirmAction && (
        <ModalShell onClose={() => setConfirmAction(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('hawlCancel')}</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('hawlConfirm')}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Reset with Reason Modal */}
      {resetModal && (
        <ModalShell onClose={() => setResetModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('hawlResetTitle')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('hawlResetDesc')}</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('hawlReasonLabel')}</label>
                <select value={resetReason} onChange={e => setResetReason(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900">
                  <option value="nisab_drop">{t('hawlReasonNisabDrop')}</option>
                  <option value="sold_asset">{t('hawlReasonSold')}</option>
                  <option value="gave_gift">{t('hawlReasonGift')}</option>
                  <option value="debt_paid">{t('hawlReasonDebt')}</option>
                  <option value="correction">{t('hawlReasonCorrection')}</option>
                  <option value="other">{t('hawlReasonOther')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('hawlNoteOptional')}</label>
                <textarea value={resetNote} onChange={e => setResetNote(e.target.value)} rows={2} maxLength={500} placeholder={t('hawlResetNotePlaceholder')} className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setResetModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('hawlCancel')}</button>
              <button type="button" onClick={handleResetConfirm} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('hawlResetBtn')}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {showForm && (
        <ModalShell onClose={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-primary mb-4">{t('hawlModalTitle')}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('hawlFieldAssetName')}</label>
                <input value={form.assetName} onChange={e => setForm({ ...form, assetName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('hawlAssetNamePlaceholder')} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('hawlFieldType')}</label>
                <select value={form.assetType} onChange={e => setForm({ ...form, assetType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(ty => <option key={ty} value={ty}>{typeLabel(ty)}</option>)}
                </select></div>
              {/* 2026-06-08 (A11Y-DASHBOARD-FORM-LABELS-1 part 3/6): htmlFor + id */}
              <div><label htmlFor="hawl-form-value" className="block text-sm font-medium text-gray-700 mb-1">{t('hawlFieldValue')}</label>
                <input id="hawl-form-value" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label htmlFor="hawl-form-nisab" className="block text-sm font-medium text-gray-700 mb-1">{t('hawlFieldNisab')}</label>
                <input id="hawl-form-nisab" type="number" step="0.01" value={form.nisabThreshold} onChange={e => setForm({ ...form, nisabThreshold: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label htmlFor="hawl-form-start-date" className="block text-sm font-medium text-gray-700 mb-1">{t('hawlFieldStartDate')} <span className="text-gray-400">{t('hawlStartDateHint')}</span></label>
                <input id="hawl-form-start-date" type="date" value={form.startDate} min={minBackdateInput} max={maxStartInput} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            {saveError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3 mt-3">{saveError}</div>}
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('hawlCancel')}</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.assetName || !form.amount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('hawlSavingBtn') : t('hawlTrackBtn')}</button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

// Wrap the page content in an ErrorBoundary so an unexpected rendering error
// (e.g. malformed API date that breaks toHijri) shows a recoverable error card
// instead of crashing the whole dashboard.
export default function HawlPage() {
  return (
    <ErrorBoundary>
      <HawlPageContent />
    </ErrorBoundary>
  );
}
