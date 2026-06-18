'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Briefcase, ChevronRight } from 'lucide-react';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { useI18n } from '../../../lib/i18n';
import { useCurrency } from '../../../lib/useCurrency';
import ModalShell from '../../../components/ui/ModalShell';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { SkeletonPage } from '../SkeletonCard';
import EmptyState from '../../../components/EmptyState';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { useFocusTrap } from '../../../lib/useFocusTrap';
import { SideHustle, isLocked, monthOptions } from '../../../lib/sideHustle';

// Currency options for the optional default-currency picker. Same list the
// transactions page exposes — kept jurisdiction-neutral (no locale assumptions).
const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'SAR', 'AED', 'MYR', 'IDR',
  'TRY', 'PKR', 'BDT', 'NGN', 'EGP', 'INR', 'CAD', 'AUD',
];

interface FormState {
  name: string;
  hustleType: string;
  defaultCurrency: string;
  taxYearStartMonth: number;
}

const EMPTY_FORM: FormState = { name: '', hustleType: '', defaultCurrency: '', taxYearStartMonth: 1 };

export default function SideHustlesPage() {
  const { t, tFmt } = useI18n();
  const { locale } = useCurrency();
  const { toast } = useToast();
  const [hustles, setHustles] = useState<SideHustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<SideHustle | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<SideHustle | null>(null);
  const [archiving, setArchiving] = useState(false);

  // ModalShell handles Escape + outside-click + body-scroll-lock; useFocusTrap
  // keeps keyboard focus inside the open dialog (same pattern as assets/page).
  const formRef = useRef<HTMLDivElement>(null);
  useFocusTrap(formRef, showForm);
  useBodyScrollLock(showForm || archiveTarget != null);

  const months = monthOptions(locale);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSideHustles();
      // Non-Family users get a {locked:true} payload (HTTP 200) — the layout's
      // PlanGate normally intercepts before this page renders, but guard anyway
      // so a stale-cached Family flag never renders raw locked JSON.
      if (isLocked(res)) { setHustles([]); setLoading(false); return; }
      const list = (res as { sideHustles?: SideHustle[] })?.sideHustles ?? [];
      setHustles(list);
    } catch (e) {
      logError(e, { tags: { area: 'side-hustles.load' } });
      setError(t('sideHustlesLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setSaveError(null);
    setShowForm(true);
  };

  const openEdit = (h: SideHustle) => {
    setEditItem(h);
    setForm({
      name: h.name,
      hustleType: h.hustleType || '',
      defaultCurrency: h.defaultCurrency || '',
      taxYearStartMonth: h.taxYearStartMonth || 1,
    });
    setSaveError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    const name = form.name.trim();
    if (!name) { setSaveError(t('sideHustlesErrorNameRequired')); return; }
    if (name.length > 120) { setSaveError(t('sideHustlesErrorNameTooLong')); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const data: Record<string, unknown> = {
        name,
        hustleType: form.hustleType.trim() || null,
        defaultCurrency: form.defaultCurrency || null,
        taxYearStartMonth: form.taxYearStartMonth,
      };
      const res = editItem
        ? await api.updateSideHustle(editItem.id, data)
        : await api.createSideHustle(data);
      // Backend returns 200 with {error} on dup-name / validation failures.
      if (res?.error) throw new Error(res.error);
      toast(editItem ? t('sideHustlesUpdated') : t('sideHustlesCreated'), 'success');
      setShowForm(false);
      setEditItem(null);
      setForm(EMPTY_FORM);
      load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : (editItem ? t('sideHustlesUpdateFailed') : t('sideHustlesCreateFailed'));
      setSaveError(msg);
      toast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      const res = await api.archiveSideHustle(archiveTarget.id);
      if (res?.error) throw new Error(res.error);
      toast(t('sideHustlesArchived'), 'success');
      setArchiveTarget(null);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : t('sideHustlesArchiveFailed'), 'error');
    } finally {
      setArchiving(false);
    }
  };

  if (loading) return <SkeletonPage summaryCount={0} listCount={4} />;

  return (
    <div>
      <PageHeader
        title={t('sideHustlesPageTitle')}
        subtitle={t('sideHustlesPageSubtitle')}
        icon={<Briefcase className="w-6 h-6 text-primary" />}
        className="mb-4"
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm"
          >
            {t('sideHustlesAdd')}
          </button>
        }
      />

      {/* Jurisdiction-neutral, non-advice note. We never compute tax or zakat. */}
      <div className="mb-4 bg-[#F7FBF7] border border-green-200 rounded-2xl p-4 text-sm text-gray-600">
        {t('sideHustlesIntroNote')}
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
          <button type="button" onClick={load} className="ms-2 underline hover:no-underline font-semibold">
            {t('sideHustlesRetry')}
          </button>
        </div>
      ) : hustles.length === 0 ? (
        <EmptyState
          icon="💼"
          title={t('sideHustlesEmptyTitle')}
          description={t('sideHustlesEmptyBody')}
          actions={[{ label: t('sideHustlesAdd'), onClick: openAdd, primary: true }]}
        />
      ) : (
        <ul className="space-y-3">
          {hustles.map(h => (
            <li key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
              <Link href={`/dashboard/side-hustles/${h.id}`} className="flex items-center gap-3 min-w-0 flex-1 group">
                <span
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                  style={{ backgroundColor: h.color || '#E8F5E9' }}
                  aria-hidden="true"
                >
                  💼
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-primary group-hover:underline truncate">{h.name}</span>
                  <span className="block text-xs text-gray-500 truncate">
                    {[
                      h.hustleType || null,
                      h.defaultCurrency || null,
                      tFmt('sideHustlesFiscalStartFmt', [months[(h.taxYearStartMonth || 1) - 1]?.label || '']),
                    ].filter(Boolean).join(' • ')}
                  </span>
                </span>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => openEdit(h)} className="text-gray-600 hover:text-blue-600 text-sm">
                  {t('sideHustlesEdit')}
                </button>
                <button type="button" onClick={() => setArchiveTarget(h)} className="text-gray-600 hover:text-amber-700 text-sm">
                  {t('sideHustlesArchive')}
                </button>
                <Link href={`/dashboard/side-hustles/${h.id}`} aria-label={tFmt('sideHustlesOpenAria', [h.name])} className="text-gray-400 hover:text-primary">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <ModalShell onClose={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div ref={formRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                {editItem ? t('sideHustlesEditTitle') : t('sideHustlesAddTitle')}
              </h2>
              <button type="button" aria-label={t('sideHustlesCloseForm')} onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="text-gray-500 hover:text-gray-700 text-xl leading-none">✕</button>
            </div>

            <div>
              <label htmlFor="sh-name" className="block text-sm font-medium text-gray-700 mb-1">{t('sideHustlesFieldName')}</label>
              <input
                id="sh-name"
                value={form.name}
                maxLength={120}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900"
                placeholder={t('sideHustlesNamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="sh-type" className="block text-sm font-medium text-gray-700 mb-1">{t('sideHustlesFieldType')}</label>
              <input
                id="sh-type"
                value={form.hustleType}
                maxLength={64}
                onChange={e => setForm({ ...form, hustleType: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900"
                placeholder={t('sideHustlesTypePlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sh-currency" className="block text-sm font-medium text-gray-700 mb-1">{t('sideHustlesFieldCurrency')}</label>
                <select
                  id="sh-currency"
                  value={form.defaultCurrency}
                  onChange={e => setForm({ ...form, defaultCurrency: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                >
                  <option value="">{t('sideHustlesCurrencyDefault')}</option>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="sh-fiscal" className="block text-sm font-medium text-gray-700 mb-1">{t('sideHustlesFieldFiscalStart')}</label>
                <select
                  id="sh-fiscal"
                  value={form.taxYearStartMonth}
                  onChange={e => setForm({ ...form, taxYearStartMonth: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                >
                  {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>

            {saveError && <p className="text-sm text-red-600">{saveError}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50">{t('cancel')}</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name.trim()} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50 font-medium">
                {saving ? t('sideHustlesSaving') : (editItem ? t('sideHustlesSave') : t('sideHustlesCreate'))}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Archive confirmation */}
      {archiveTarget && (
        <ModalShell onClose={() => setArchiveTarget(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('sideHustlesArchiveTitle')}</h2>
            <p className="text-sm text-gray-600">{tFmt('sideHustlesArchiveConfirmFmt', [archiveTarget.name])}</p>
            <p className="text-xs text-gray-500">{t('sideHustlesArchiveNote')}</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setArchiveTarget(null)} disabled={archiving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50">{t('cancel')}</button>
              <button type="button" onClick={handleArchive} disabled={archiving} className="flex-1 bg-amber-600 text-white rounded-lg py-2 hover:bg-amber-700 disabled:opacity-50 font-medium">
                {archiving ? t('sideHustlesArchiving') : t('sideHustlesArchive')}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
