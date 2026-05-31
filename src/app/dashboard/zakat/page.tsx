'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { toHijri } from '../../../lib/format';
import { useCurrency } from '../../../lib/useCurrency';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { safeParse, safeParseWithFallback, validateZakatCalculation, validateZakatPaymentsResponse, validateNisabInfo, formatTimeAgo } from '../../../lib/schemas';
import ShareReceiptButton from '../../../components/ShareReceiptButton';
import ModalShell from '../../../components/ui/ModalShell';
import HistoricalZakatModal from '../../../components/HistoricalZakatModal';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';
import { KpiCard } from '../../../components/dashboard/KpiCard';
import { trackFirstZakatCalc, trackFeatureUse, trackOnce } from '../../../lib/analytics';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';

interface ZakatCalculation {
  zakatDue?: number;
  zakatRemaining?: number;
  zakatEligible?: boolean;
  effectiveZakatAmount?: number;
  currentLunarYear?: number;
  totalWealth?: number;
  zakatableWealth?: number;
  nisab?: number;
  breakdown?: Array<Record<string, unknown>>;
  totalDebts?: number;
  error?: string;
  // 2026-05-10 (B-ZK-CCY) — Path C+B fields. Primary card now renders
  // gold-grams ("Your wealth ≈ 7.2 g gold; Nisab 85 g") with the user's
  // currency total as the secondary line. Eliminates the misleading
  // "USD-denominated number with user-currency symbol" rendering for any
  // non-USD user (PK user was seeing "Rs 1,097.12" for 305,000 PKR
  // because backend returned USD numbers + frontend stamped "Rs " in
  // front via fmt()). Backend now also returns user-currency conversions.
  totalWealthGoldGrams?: number;
  zakatableWealthGoldGrams?: number;
  nisabGoldGrams?: number;
  goldPricePerGramUSD?: number;
  userCurrency?: string;
  totalWealthUserCurrency?: number;
  nisabUserCurrency?: number;
  zakatDueUserCurrency?: number;
  [key: string]: unknown;
}

interface ZakatPayment {
  id?: number;
  amount: number;
  recipient?: string | null;
  notes?: string | null;
  lunarYear?: number;
  paidAt?: number;
}

interface NisabInfo {
  goldPricePerGram?: number;
  silverPricePerGram?: number;
  nisabGoldGrams?: number;
  nisabSilverGrams?: number;
  staleWarning?: boolean;
  priceAgeMs?: number;
}

interface NisabMethodology {
  code?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

interface FitrData {
  [key: string]: unknown;
}

// Safe localStorage helpers
const safeGetItem = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSetItem = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch { /* private browsing or quota exceeded */ }
};

/** Compute current Hijri year from today's date using the Umm al-Qura calendar. */
function computeHijriYear(): number {
  const hijri = toHijri(new Date());
  return hijri.year;
}

export default function ZakatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { fmt, symbol, currency, locale: dateLocale } = useCurrency();
  const { t, tFmt } = useI18n();
  const mountedRef = useRef(true);
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const [data, setData] = useState<ZakatCalculation | null>(null);
  const [payments, setPayments] = useState<ZakatPayment[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'calculator' | 'assets' | 'payments' | 'fitr' | 'references'>('calculator');
  const [showForm, setShowForm] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMabrook, setShowMabrook] = useState(false);
  const shownMabrookRef = useRef(false);
  // 2026-05-02: lock body scroll while any modal is open.
  useBodyScrollLock(showForm || showChecklist || showMabrook);
  // 2026-05-30: `date` = date paid (YYYY-MM-DD for <input type="date">, default
  // today). editPaymentId != null puts the form in edit mode (PUT vs POST).
  const [form, setForm] = useState({ amount: '', recipient: '', notes: '', date: new Date().toISOString().slice(0, 10) });
  const [editPaymentId, setEditPaymentId] = useState<number | null>(null);
  const [hideZakat, setHideZakat] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nisabInfo, setNisabInfo] = useState<NisabInfo | null>(null);
  const [checklist, setChecklist] = useState({ wealth: false, hawl: false, debts: false, quranic: false });

  // FEATURE 1: Multi-Madhab Nisab Selector
  const [nisabMethodologies, setNisabMethodologies] = useState<NisabMethodology[]>([]);
  const [selectedMethodology, setSelectedMethodology] = useState('AMJA_GOLD');
  const [savingMethodology, setSavingMethodology] = useState(false);

  // FEATURE 2: Zakat al-Fitr
  const [householdSize, setHouseholdSize] = useState(1);
  const [fitrData, setFitrData] = useState<FitrData | null>(null);
  const [loadingFitr, setLoadingFitr] = useState(false);

  // FEATURE 3: PDF Export
  const [exporting, setExporting] = useState(false);

  // FEATURE 6: Calculation Receipt
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  // FEATURE 5: Scholarly References
  const [scholarlyReferences, setScholarlyReferences] = useState<Record<string, unknown>[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(false);

  // Manual asset breakdown calculator
  const [manualAssets, setManualAssets] = useState({
    cash:           0,
    gold:           0,
    silver:         0,
    stocks:         0,
    businessGoods:  0,
    receivables:    0,
    rentalIncome:   0,
    otherAssets:    0,
    // Deductions
    debts:          0,
    expenses:       0,
  });

  // Use the lunar year from the API if available; fall back to JS-computed value
  const lunarYear: number = (data?.currentLunarYear as number) || computeHijriYear();

  // Feature 1 (2026-04-18): modal for "I paid zakat before joining Barakah".
  const [historicalModalOpen, setHistoricalModalOpen] = useState(false);

  useEffect(() => {
    setHideZakat(safeGetItem('hideZakat') === 'true');
  }, []);

  const toggleHideZakat = () => {
    const next = !hideZakat;
    setHideZakat(next);
    safeSetItem('hideZakat', next ? 'true' : 'false');
  };

  const loadZakatAlFitr = useCallback(async () => {
    setLoadingFitr(true);
    try {
      const fitr = await api.getZakatAlFitr(householdSize, currency);
      if (fitr) {
        // Map backend response shape to frontend expected keys.
        // Backend returns: { totalDue: { minimum, recommended, generous }, perPerson: { ... } }
        // Frontend expects: { totalDue (number), minimumAmount, recommendedAmount, generousAmount }
        const totalDue = fitr.totalDue;
        const perPerson = fitr.perPerson;
        const mapped: Record<string, unknown> = { ...fitr };

        // Validate response shape — defensive parsing, never throws, always falls back to zero
        const totalDueObj = (totalDue && typeof totalDue === 'object') ? totalDue as Record<string, unknown> : null;
        if (totalDueObj !== null) {
          const rec = typeof totalDueObj.recommended === 'number' ? totalDueObj.recommended : 0;
          const min = typeof totalDueObj.minimum === 'number' ? totalDueObj.minimum : 0;
          const gen = typeof totalDueObj.generous === 'number' ? totalDueObj.generous : 0;
          mapped.totalDue = rec || min || 0;
          mapped.minimumTotal = min;
          mapped.recommendedTotal = rec;
          mapped.generousTotal = gen;
        } else if (typeof totalDue === 'number') {
          mapped.totalDue = totalDue;
        } else {
          // Unknown shape — silently fall back to zero values
          mapped.totalDue = 0;
        }
        const perPersonObj = (perPerson && typeof perPerson === 'object') ? perPerson as Record<string, unknown> : null;
        if (perPersonObj !== null) {
          mapped.minimumAmount = typeof perPersonObj.minimum === 'number' ? perPersonObj.minimum : 0;
          mapped.recommendedAmount = typeof perPersonObj.recommended === 'number' ? perPersonObj.recommended : 0;
          mapped.generousAmount = typeof perPersonObj.generous === 'number' ? perPersonObj.generous : 0;
        }
        // Map citation fields
        const citationsRaw = fitr?.citations;
        const citations = (citationsRaw && typeof citationsRaw === 'object') ? citationsRaw as Record<string, unknown> : null;
        if (citations) {
          mapped.hadithCitation = typeof citations.hadith === 'string' ? citations.hadith : '';
          mapped.deadline = typeof fitr?.deadline === 'string' ? fitr.deadline : (typeof citations.ruling === 'string' ? citations.ruling : '');
        }
        // Map eligibleRecipients array to string
        const recipients = fitr?.eligibleRecipients;
        if (Array.isArray(recipients)) {
          mapped.eligibleRecipients = recipients.filter(r => typeof r === 'string').join(', ');
        }

        setFitrData(mapped);
      }
    } catch (err) {
      logError(err, { context: 'Failed to load zakat al-fitr' });
    }
    setLoadingFitr(false);
  }, [householdSize, currency]);

  const loadScholarlyReferences = async () => {
    setLoadingReferences(true);
    try {
      const references = await api.getScholarlyReferences();
      if (references && Array.isArray(references)) {
        setScholarlyReferences(references);
      }
    } catch (err) {
      logError(err, { context: 'Failed to load scholarly references' });
    }
    setLoadingReferences(false);
  };

  const load = async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setLoadError(null);
    try {
      const results = await Promise.allSettled([
        api.getZakat(),
        api.getZakatPayments(), // load all years; filter by lunarYear after we know it
        api.getNisabInfo().catch(() => null),  // non-critical — live gold price display
        api.getNisabMethodologies().catch(() => null), // FEATURE 1: methodologies
        api.getNisabMethodology().catch(() => null),   // user's current methodology preference
      ]);
      if (!mountedRef.current) return;
      const zakatRaw = results[0].status === 'fulfilled' ? results[0].value : null;
      const paymentsRaw = results[1].status === 'fulfilled' ? results[1].value : null;
      const nisabRaw = results[2].status === 'fulfilled' ? results[2].value : null;
      const methodologiesRaw = results[3].status === 'fulfilled' ? results[3].value : null;
      const methodologyPrefRaw = results[4].status === 'fulfilled' ? results[4].value : null;

      // Validate zakat data
      const zakatData = safeParse(validateZakatCalculation, zakatRaw, 'zakat/calculate');
      if (!zakatData && zakatRaw?.error) {
        logError(new Error(zakatRaw.error as string), { context: 'Zakat API error' });
        if (!mountedRef.current) return;
        setLoadError(String(zakatRaw.error) || t('zktLoadFailed'));
        setLoading(false);
        return;
      }
      if (zakatRaw?.error) {
        logError(new Error(zakatRaw.error as string), { context: 'Zakat API error' });
        if (!mountedRef.current) return;
        setLoadError(String(zakatRaw.error) || t('zktLoadFailed'));
        setLoading(false);
        return;
      }

      // Validate payments data
      const paymentsValidated = safeParse(validateZakatPaymentsResponse, paymentsRaw, 'zakat/payments');
      if (!paymentsValidated && paymentsRaw?.error) {
        logError(new Error(paymentsRaw.error as string), { context: 'Payments API error' });
        if (!mountedRef.current) return;
        setLoading(false);
        return;
      }
      if (paymentsRaw?.error) {
        logError(new Error(paymentsRaw.error as string), { context: 'Payments API error' });
        if (!mountedRef.current) return;
        setLoading(false);
        return;
      }

      // Use fallback for non-critical nisab info
      const nisabData = safeParseWithFallback(validateNisabInfo, nisabRaw, 'nisab/info');
      if (!mountedRef.current) return;
      if (nisabData) setNisabInfo(nisabData);

      // FEATURE 1: Load nisab methodologies and user's current selection
      if (methodologiesRaw && Array.isArray(methodologiesRaw)) {
        // Backend returns { value, displayName, description } — normalize to { code, name, description }
        const normalized: NisabMethodology[] = methodologiesRaw.map((m: Record<string, unknown>) => ({
          code: String(m.value ?? m.code ?? ''),
          name: String(m.displayName ?? m.name ?? ''),
          description: String(m.description ?? ''),
        }));
        if (!mountedRef.current) return;
        setNisabMethodologies(normalized);
      }
      // Apply user's current methodology preference (fetched in parallel above)
      if (methodologyPrefRaw?.methodology) {
        if (!mountedRef.current) return;
        setSelectedMethodology(methodologyPrefRaw.methodology as string);
      }

      if (!mountedRef.current) return;
      setData(zakatRaw as ZakatCalculation);

      // Filter payments to current lunar year
      const year = (zakatRaw?.currentLunarYear as number) || computeHijriYear();
      const filtered = (paymentsValidated?.payments || []).filter(p => !p.lunarYear || p.lunarYear === year);
      if (!mountedRef.current) return;
      setPayments(filtered);
      // Use the backend's zakatPaid value for consistency with the dashboard.
      // Previously, summing individual payment records caused a rounding discrepancy
      // (e.g., dashboard showed $700.00 but zakat page showed $700.04).
      const backendPaid = (zakatRaw?.zakatPaid as number) ?? undefined;
      const clientPaid = filtered.reduce((sum: number, p) => sum + (p.amount || 0), 0);
      if (!mountedRef.current) return;
      setTotalPaid(backendPaid != null ? backendPaid : clientPaid);
    } catch (err) {
      logError(err, { context: 'Failed to load zakat data' });
      if (!mountedRef.current) return;
      setLoadError(t('zktLoadFailed'));
    }
    if (!mountedRef.current) return;
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    mountedRef.current = true;
    void (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  // Use effectiveZakatAmount (locked amount) if available, otherwise use zakatDue
  const zakatDue = data && !data.error
    ? ((data?.effectiveZakatAmount as number) ?? (data?.zakatDue as number) ?? 0)
    : null;
  const zakatEligible = data?.zakatEligible as boolean;
  const remaining = zakatDue !== null ? Math.max(0, zakatDue - totalPaid) : 0;
  const fulfilled = zakatDue !== null && zakatEligible && totalPaid >= zakatDue && zakatDue > 0;
  const fulfillmentPct = zakatDue !== null && zakatDue > 0 ? Math.min(1, totalPaid / zakatDue) : 0;

  // Show Mabrook dialog once per session when zakat is first fulfilled
  useEffect(() => {
    if (fulfilled && zakatDue !== null && zakatDue > 0 && !shownMabrookRef.current) {
      shownMabrookRef.current = true;
      setShowMabrook(true);
    }
  }, [fulfilled, zakatDue]);

  // Fire GA4 first_zakat_calc once per browser-user the first time their
  // authenticated dashboard returns a positive zakat amount. This is the
  // activation event for authenticated users (the /zakat-calculator landing
  // page fires its own anonymous-scoped variant). Backend also writes the
  // FIRST_ZAKAT_CALCULATED lifecycle event — this client-side fire is
  // specifically for GA4 attribution.
  useEffect(() => {
    if (zakatDue !== null && zakatDue > 0) {
      try {
        trackOnce('first_zakat_calc_auth', () =>
          trackFirstZakatCalc(zakatDue, selectedMethodology || 'default'));
      } catch { /* GA4 unavailable */ }
    }
  }, [zakatDue, selectedMethodology]);

  const handleShowPaymentForm = () => {
    // Show checklist first, reset form (add mode)
    setEditPaymentId(null);
    setChecklist({ wealth: false, hawl: false, debts: false, quranic: false });
    setForm({ amount: '', recipient: '', notes: '', date: new Date().toISOString().slice(0, 10) });
    setShowChecklist(true);
  };

  // 2026-05-30: open the form pre-filled to edit an existing payment (skips the
  // eligibility checklist — that gate is only for recording a new payment).
  const handleEditPayment = (p: ZakatPayment) => {
    setEditPaymentId(p.id ?? null);
    const ms = p.paidAt != null ? (p.paidAt < 1e12 ? p.paidAt * 1000 : p.paidAt) : Date.now();
    setForm({
      amount: p.amount != null ? String(p.amount) : '',
      recipient: p.recipient ?? '',
      notes: p.notes ?? '',
      date: new Date(ms).toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const handleSavePayment = async () => {
    const amount = parseFloat(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    setSaving(true);
    try {
      // Noon avoids the date shifting a day under timezone conversion.
      const paidAt = form.date ? new Date(`${form.date}T12:00:00`).getTime() : undefined;
      if (editPaymentId != null) {
        await api.updateZakatPayment(editPaymentId, {
          amount,
          recipient: form.recipient || undefined,
          notes: form.notes || undefined,
          paidAt,
        });
      } else {
        await api.addZakatPayment({
          amount,
          recipient: form.recipient || undefined,
          notes: form.notes || undefined,
          lunarYear,
          paidAt,
        });
      }
      setEditPaymentId(null);
      setForm({ amount: '', recipient: '', notes: '', date: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      setShowChecklist(false);
      // Calculate new total directly without relying on stale state
      await load();
      // Don't manually compute totalPaid — let it come from the server
    } catch { toast(t('zktSavePaymentFailed'), 'error'); }
    setSaving(false);
  };

  const handleDeletePayment = (id: number) => {
    // BUG FIX: removed redundant window.confirm() — single confirmation via custom modal below
    setConfirmAction({
      message: t('zktDeleteConfirm'),
      action: async () => {
        try {
          await api.deleteZakatPayment(id);
          toast(t('zktPaymentDeleted'), 'success');
          await load(); // BUG FIX: await so errors surface and state updates correctly
        } catch (err) {
          toast(err instanceof Error ? err.message : t('zktDeleteFailed'), 'error');
        }
      }
    });
  };

  // FEATURE 1: Handle Nisab Methodology Change
  const handleMethodologyChange = async (methodology: string) => {
    // Validate methodology
    const validMethodologies = ['AMJA_GOLD', 'CLASSICAL_SILVER', 'LOWER_OF_TWO'];
    if (!validMethodologies.includes(methodology)) {
      toast(t('zktInvalidMethodology'), 'error');
      return;
    }
    const previous = selectedMethodology;
    setSelectedMethodology(methodology);
    setSavingMethodology(true);
    try {
      await api.setNisabMethodology(methodology);
      toast(t('zktMethodologyUpdated'), 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('zktMethodologyUpdateFailed'), 'error');
      setSelectedMethodology(previous); // revert on failure
    } finally {
      setSavingMethodology(false);
    }
  };

  // FEATURE 2: Update household size and recalculate fitr
  const handleHouseholdSizeChange = (size: number) => {
    const newSize = Math.min(Math.max(parseInt(String(size)) || 1, 1), 100);
    setHouseholdSize(newSize);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tab === 'fitr' && householdSize > 0) {
        void loadZakatAlFitr();
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [householdSize, loadZakatAlFitr, tab]);

  // FEATURE 6: Load Calculation Receipt
  const handleViewReceipt = async () => {
    setReceiptLoading(true);
    try { trackFeatureUse('zakat_receipt_generated'); } catch { /* GA4 unavailable */ }
    try {
      const data = await api.getZakatReceipt();
      if (data) {
        setReceipt(data as Record<string, unknown>);
      } else {
        toast(t('zktNoReceiptData'), 'error');
      }
    } catch (err) {
      logError(err, { context: 'Failed to load zakat receipt' });
      toast(t('zktReceiptLoadFailed'), 'error');
    }
    setReceiptLoading(false);
  };

  // XSS SECURITY FIX: escape API-sourced values before injecting into document.write()
  const escHtml = (str: unknown): string =>
    String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

  // FEATURE 3: PDF Export
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const report = await api.exportZakatReport();
      if (!report) {
        toast(t('zktNoReportData'), 'error');
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast(t('zktAllowPopups'), 'error');
        return;
      }

      const summary = report.summary as Record<string, unknown> || {};
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${escHtml(t('zktReceiptTitle'))} - Barakah</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; line-height: 1.6; }
              h1 { color: #1B6B4A; border-bottom: 2px solid #1B6B4A; padding-bottom: 10px; margin-bottom: 20px; font-size: 28px; }
              h2 { color: #1B6B4A; margin-top: 30px; margin-bottom: 15px; font-size: 18px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background: #f0f7f4; color: #1B5E20; font-weight: bold; }
              tr:nth-child(even) { background: #f9f9f9; }
              .summary-box { background: #f0f7f4; border: 1px solid #1B6B4A; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .amount { font-size: 1.2em; font-weight: bold; color: #1B6B4A; }
              .disclaimer { font-size: 0.85em; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; }
              .citation { font-style: italic; color: #555; font-size: 0.9em; }
              .footer { text-align: center; color: #999; margin-top: 40px; font-size: 0.85em; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>${escHtml(report.title) || escHtml(t('zktPdfReportTitle'))}</h1>
            <p><strong>${escHtml(t('zktPdfPreparedFor'))}</strong> ${escHtml(report.generatedFor) || escHtml(t('zktPdfUser'))}</p>
            <p><strong>${escHtml(t('zktPdfLunarYear'))}</strong> ${escHtml(report.lunarYear) || lunarYear} AH</p>
            <p><strong>${escHtml(t('zktPdfGenerated'))}</strong> ${new Date().toLocaleDateString(dateLocale)}</p>

            <div class="summary-box">
              <h2>${escHtml(t('zktPdfSummary'))}</h2>
              <table>
                <tr>
                  <td>${escHtml(t('zktTotalWealth'))}</td>
                  <td class="amount">${escHtml(symbol)}${(summary.totalWealth as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>${escHtml(t('zktZakatableWealth'))}</td>
                  <td class="amount">${escHtml(symbol)}${(summary.zakatableWealth as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>${escHtml(t('zktNisabThreshold'))}</td>
                  <td>${escHtml(symbol)}${((summary.nisab ?? summary.nisabThreshold) as number)?.toFixed(2) || '0.00'} (${escHtml(summary.nisabMethodology) || 'AMJA_GOLD'})</td>
                </tr>
                <tr>
                  <td>${escHtml(t('zktHeroDue'))}</td>
                  <td class="amount">${escHtml(symbol)}${(summary.zakatDue as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>${escHtml(t('zktPdfTotalPaid'))}</td>
                  <td>${escHtml(symbol)}${(summary.totalPaid as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>${escHtml(t('zktRemainingLabel'))}</td>
                  <td class="amount">${escHtml(symbol)}${(summary.remaining as number)?.toFixed(2) || '0.00'}</td>
                </tr>
              </table>
            </div>

            <p class="citation">${escHtml(report.complianceStatement)}</p>
            <p class="disclaimer">${escHtml(report.disclaimer) || escHtml(t('zktPdfDisclaimer'))}</p>
            <div class="footer">
              <p>${escHtml(t('zktPdfFooter'))}</p>
            </div>
          </body>
        </html>
      `;

      // Assign onload BEFORE document.write/close so the handler isn't missed
      // if the blank-window load fires synchronously after close().
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
      printWindow.document.write(printContent);
      printWindow.document.close();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('zktExportFailed'), 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div role="status" aria-label={t('zktLoadingData')} className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full">
          <span className="sr-only">{t('zktLoadingShort')}</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-4">{t('zktLoadFailed')}</p>
          <button
            onClick={load}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium"
          >
            {t('zktRetry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('zakatPageTitle')}
        subtitle={t('zakatPageSubtitle')}
        // 2026-05-12 (QA-2026-05-12, Finding F7): the chip just said "1448 AH"
        // while the dashboard's Islamic calendar widget said "25 Dhul Qadah
        // 1447" — looks like an off-by-one bug. It's not: the backend returns
        // the year of the user's *next* zakat anniversary, which is in the
        // following Hijri year for a user who joined mid-year. Add a tooltip
        // and aria-label so the meaning is discoverable.
        icon={
          <span
            className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium"
            title={tFmt('zktAnnivTooltipFmt', [lunarYear])}
            aria-label={tFmt('zktAnnivAriaFmt', [lunarYear])}
          >
            {lunarYear} {t('zktAhSuffix')}
          </span>
        }
        actions={
          <>
            <button
              onClick={toggleHideZakat}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {hideZakat ? t('zktShow') : t('zktHide')}
            </button>
            {tab === 'calculator' && (
              <>
                <button
                  onClick={() => setHistoricalModalOpen(true)}
                  className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-lg hover:bg-amber-200 font-medium"
                  title={t('zktHistoricalPaidTitle')}
                >
                  {t('zktHistoricalPaid')}
                </button>
                <button
                  onClick={handleViewReceipt}
                  disabled={receiptLoading}
                  className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 disabled:opacity-50 font-medium"
                  title={t('zktViewReceiptTitle')}
                >
                  {receiptLoading ? t('zktLoadingShort') : t('zktViewReceipt')}
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 disabled:opacity-50 font-medium"
                  title={t('zktExportPdfTitle')}
                >
                  {exporting ? t('zktExporting') : t('zktExportPdf')}
                </button>
              </>
            )}
            <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap">
              <button onClick={() => setTab('calculator')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'calculator' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>{t('zktTabOverview')}</button>
              <button onClick={() => setTab('assets')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'assets' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>{t('zktTabAssetCalc')}</button>
              <button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'payments' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>{t('zktTabPayments')}</button>
              <button onClick={() => setTab('fitr')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'fitr' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>{t('zktTabAlFitr')}</button>
              <button onClick={() => { setTab('references'); loadScholarlyReferences(); }} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'references' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>{t('zktTabSources')}</button>
            </div>
          </>
        }
      />

      {tab === 'calculator' ? (
        <>
          {/* Zakat Status Hero.
              R41 (2026-05-01): viewTransitionName matches the dashboard
              KPI card so the View Transitions API morphs them between
              the two pages. Older browsers fall through silently. */}
          <div
            className={`rounded-2xl p-8 text-white mb-6 text-center ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-amber-600 to-yellow-500'}`}
            style={{ viewTransitionName: 'zakat-hero' }}
          >
            <p className="text-4xl mb-2">{fulfilled ? '🌟' : zakatEligible ? '✅' : 'ℹ️'}</p>
            <p className="text-amber-100 mb-2">{fulfilled ? t('zktHeroFulfilled') : t('zktHeroDue')}</p>
            {/* B-ZK-CCY (2026-05-10): the headline number is now the user-
                currency conversion (verifiable against the wallet) when
                available; falls back to the legacy fmt(zakatDue) USD figure
                when the backend hasn't shipped the new field yet. The USD
                companion line below removes ambiguity for cross-border or
                multi-currency users. Pre-fix display showed
                "Rs <USD-amount>" which mis-led non-USD users into believing
                the figure was already in their currency. */}
            <p className="text-5xl font-bold">
              {hideZakat
                ? '••••••'
                : fmt((data?.zakatDueUserCurrency as number | undefined) ?? zakatDue ?? 0)}
            </p>
            {!hideZakat && data?.userCurrency && data.userCurrency !== 'USD'
              && data?.zakatDueUserCurrency != null && (
              <p className="text-amber-100/80 text-xs mt-1">
                ≈ USD ${(zakatDue ?? 0).toFixed(2)}
              </p>
            )}
            <p className="text-amber-200 mt-4 text-sm">
              {/* 2026-05-10: clarify "wealth" → "zakatable wealth" so the
                  hero verdict matches the cards below. Eligibility is
                  computed from zakatableWealth vs nisab, not from total
                  wealth — exempt assets (home, personal use) don't count.
                  Pre-fix this said "Your wealth is below Nisab" while the
                  Total Wealth card visibly showed 4749g >> 85g nisab,
                  creating a confusing contradiction. */}
              {fulfilled ? t('zktHeroMabrook') : zakatEligible ? t('zktHeroEligible') : t('zktHeroBelowNisab')}
            </p>
            {/* 2026-05-12 (QA-2026-05-12, Finding F6): a brand-new user with
                no connected accounts saw "$0.00 — below Nisab" on the Overview
                tab while the Asset Calc tab could compute their actual zakat
                from manual input. Without context the Overview $0 read as
                "broken result". Add a one-tap CTA to Asset Calc when there's
                genuinely no data (not fulfilled, not eligible, and total
                wealth is zero). */}
            {!fulfilled && !zakatEligible && ((data?.totalWealth as number | undefined) ?? 0) === 0 && tab === 'calculator' && (
              <p className="mt-3 text-xs text-amber-100/90">
                {t('zktNoAccountsYet')}{' '}
                <button
                  type="button"
                  onClick={() => setTab('assets')}
                  className="underline font-semibold hover:text-white"
                >
                  {t('zktEnterAssetsManually')}
                </button>
              </p>
            )}
            {totalPaid > 0 && (zakatDue ?? 0) > 0 && !hideZakat && (
              <div className="mt-4 max-w-md mx-auto">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${fulfilled ? 'bg-blue-300' : 'bg-white'}`} style={{ width: `${fulfillmentPct * 100}%` }} />
                </div>
                <p className="text-white/70 text-xs mt-2">
                  {fulfilled ? t('zktFullyPaid') : tFmt('zktPaidRemainingFmt', [fmt(totalPaid), fmt(remaining)])}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* B-ZK-CCY (2026-05-10) — Path C+B: gold-grams primary, user-
                currency secondary. The pre-fix card rendered USD totals with
                whatever currency symbol the user had configured ("Rs 1,097.12"
                for a 305,000 PKR user) which was both religiously and
                financially misleading. New layout:
                  • Big number = gold-grams ("Your wealth ≈ 7.2 g gold")
                  • Footer line = user-currency conversion (verifiable)
                Falls back gracefully to the legacy fmt() rendering when the
                backend hasn't shipped the new fields yet (forward compat
                across the deploy window).                                  */}
            <KpiCard
              label={t('zktTotalWealth')}
              value={hideZakat
                ? '••••••'
                : (data?.totalWealthGoldGrams != null
                    ? tFmt('zktGramsGoldFmt', [(data.totalWealthGoldGrams as number).toFixed(2)])
                    : fmt((data?.totalWealth as number) || 0))}
              footer={hideZakat || data?.totalWealthUserCurrency == null
                ? undefined
                : <span className="text-xs text-gray-500">
                    ≈ {fmt(data.totalWealthUserCurrency as number)}
                    {data?.userCurrency && data.userCurrency !== 'USD' && (
                      <> · USD ${((data?.totalWealth as number) || 0).toFixed(2)}</>
                    )}
                  </span>}
            />
            <KpiCard
              label={t('zktZakatableWealth')}
              value={hideZakat
                ? '••••••'
                : (data?.zakatableWealthGoldGrams != null
                    ? tFmt('zktGramsGoldFmt', [(data.zakatableWealthGoldGrams as number).toFixed(2)])
                    : fmt((data?.zakatableWealth as number) || 0))}
              footer={
                <span className="text-xs text-gray-500">
                  {t('zktAfterDeductions')}
                  {!hideZakat && data?.zakatableWealth != null && (
                    <> · ≈ {fmt(data.zakatableWealth as number)}</>
                  )}
                </span>
              }
            />
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm flex items-center gap-1">
                {t('zktNisabThreshold')}
                <span
                  className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                  title={
                    selectedMethodology === 'CLASSICAL_SILVER'
                      ? t('zktLiveSilverPrice')
                      : selectedMethodology === 'LOWER_OF_TWO'
                      ? t('zktLiveGoldSilverPrices')
                      : t('zktLiveGoldPrice')
                  }
                />
              </p>
              {/* B-ZK-CCY (2026-05-10): primary nisab line is gold-grams
                  (always 85g for AMJA_GOLD; gold-equivalent of 595g silver
                  for the silver path). Secondary line shows the user-
                  currency conversion so a Pakistani user can sanity-check
                  "85g gold ≈ Rs 4.3M" against their wallet. Old fmt(USD
                  number with currency symbol) display is removed. */}
              <p className="text-2xl font-bold text-amber-600">
                {(() => {
                  // ZAKAT-2 fix: when methodology is silver, show silver-grams
                  // not gold-grams. Previously hardcoded "g gold" gave a
                  // Hanafi user "10.00 g gold" (the gold-equivalent of 595g
                  // silver) — confusing and wrong unit label.
                  if (selectedMethodology === 'CLASSICAL_SILVER') {
                    const silver = nisabInfo?.nisabSilverGrams ?? 595;
                    return tFmt('zktGramsSilverFmt', [silver.toFixed(2)]);
                  }
                  if (data?.nisabGoldGrams != null) {
                    return tFmt('zktGramsGoldFmt', [(data.nisabGoldGrams as number).toFixed(2)]);
                  }
                  return data?.nisab ? fmt(data.nisab as number) : '—';
                })()}
              </p>
              {data?.nisabUserCurrency != null && (
                <p className="text-xs text-gray-500 mt-1">
                  ≈ {fmt(data.nisabUserCurrency as number)}
                  {/* BUG-NISAB-USD-LABEL fix (run 2, 2026-05-27): the legacy
                      "· USD $X" tail was mislabeling the user-currency nisab
                      as USD after the BUG-NISAB-MATH-PKR fix (commit 061801d)
                      made `data.nisab` denominate in baseCurrency. A PKR
                      user saw "USD $3,431,518" when the figure was actually
                      PKR. Dropped the tail — `nisabUserCurrency` shown
                      above already renders the localized amount. */}
                </p>
              )}
              {nisabInfo && (
                <p className="text-xs text-gray-400 mt-1">
                  {/* HIGH BUG FIX (H-1): goldPricePerGram / silverPricePerGram
                      come straight from /api/zakat/info, which quote spot
                      prices in USD — they're NOT converted through the user's
                      display currency pipeline. Keep the "$" glyph and the
                      explicit "USD" suffix so non-USD users aren't misled
                      into thinking the figure is already localized. */}
                  {selectedMethodology === 'CLASSICAL_SILVER' && nisabInfo.silverPricePerGram ? (
                    tFmt('zktNisabSilverInfoFmt', [nisabInfo.silverPricePerGram.toFixed(2), String(nisabInfo.nisabSilverGrams ?? 595)])
                  ) : selectedMethodology === 'LOWER_OF_TWO' && nisabInfo.goldPricePerGram && nisabInfo.silverPricePerGram ? (
                    tFmt('zktNisabLowerInfoFmt', [nisabInfo.goldPricePerGram.toFixed(2), nisabInfo.silverPricePerGram.toFixed(2)])
                  ) : nisabInfo.goldPricePerGram ? (
                    tFmt('zktNisabGoldInfoFmt', [nisabInfo.goldPricePerGram.toFixed(2), String(nisabInfo.nisabGoldGrams ?? 85)])
                  ) : null}
                  {nisabInfo.priceAgeMs !== undefined && (
                    <span className="ml-1">{tFmt('zktUpdatedAgoFmt', [formatTimeAgo(nisabInfo.priceAgeMs)])}</span>
                  )}
                </p>
              )}
              <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-0.5 mt-2 inline-block font-medium">
                {/* 2026-05-12 (QA-2026-05-12, Finding I5): label softened from
                    "Gold Standard (AMJA)" to "Gold Standard (85g)" so the
                    chip doesn't read as AMJA-endorsed by Barakah. */}
                {selectedMethodology === 'CLASSICAL_SILVER' ? t('zktStdSilver') :
                 selectedMethodology === 'LOWER_OF_TWO' ? t('zktStdLower') :
                 t('zktStdGold')} · <button onClick={() => { const el = document.getElementById('methodology-section'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="underline">{t('zktChange')}</button>
              </p>
            </div>
          </div>

          {/* How Your Zakat Is Calculated — Asset Breakdown */}
          {!hideZakat && data?.breakdown && Array.isArray(data.breakdown) && (data.breakdown as Record<string, unknown>[]).length > 0 && (
            <div className="mt-6 bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-primary mb-3">{t('zktHowCalculated')}</h3>
              <p className="text-xs text-gray-500 mb-4">{t('zktHowCalculatedDesc')}</p>
              <div className="space-y-2">
                {(data.breakdown as Record<string, unknown>[]).map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2.5 px-3 rounded-lg ${item.zakatable ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <span className={`mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${item.zakatable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {item.zakatable ? t('zktZakatableTag') : t('zktExemptTag')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-gray-800 truncate">{String(item.name)}</p>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-bold text-gray-800">{fmt(Number(item.value) || 0)}</p>
                          {Boolean(item.zakatable) && Number(item.zakatableValue) !== Number(item.value) && (
                            <p className="text-xs text-green-600">{tFmt('zktZakatableValueFmt', [fmt(Number(item.zakatableValue) || 0)])}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{String(item.reason)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {(data.totalDebts as number) > 0 && (
                <div className="mt-3 flex items-start gap-3 py-2.5 px-3 rounded-lg bg-red-50">
                  <span className="mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">{t('zktDeductionTag')}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-gray-800">{t('zktDebtDeductions')}</p>
                      <p className="text-sm font-bold text-red-600">-{fmt(data.totalDebts as number)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{t('zktDebtDeductionsDesc')}</p>
                  </div>
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <p className="text-sm font-medium text-gray-700">{t('zktNetZakatableWealth')}</p>
                <p className="text-lg font-bold text-primary">{fmt((data?.zakatableWealth as number) || 0)}</p>
              </div>
            </div>
          )}

          {/* No assets message */}
          {!hideZakat && (!data?.breakdown || (data.breakdown as Record<string, unknown>[]).length === 0) && (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
              <p className="text-blue-800 text-sm font-medium mb-1">{t('zktNoAssetsFound')}</p>
              <p className="text-blue-600 text-xs">{t('zktNoAssetsDesc')}</p>
              <button onClick={() => router.push('/dashboard/assets')} className="mt-3 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                {t('zktGoToAssets')}
              </button>
              {/* BUG-Z1 cross-link (2026-05-27): point users to the
                  session-only Asset Calc tab as an alternative if they
                  just want to estimate before committing to tracking. */}
              <p className="mt-3 text-xs text-blue-700/80">
                {t('zktOverviewEmptyAssetCalcNote')}{' '}
                <button
                  type="button"
                  onClick={() => setTab('assets')}
                  className="underline font-semibold hover:text-blue-900"
                >
                  {t('zktOverviewEmptyAssetCalcCta')}
                </button>
              </p>
            </div>
          )}

          {nisabMethodologies.length > 0 && (
            <div id="methodology-section" className="mt-6 bg-white rounded-xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('zktNisabMethodology')}
              </label>
              <p className="text-xs text-gray-400 mb-2">{t('zktNisabMethodologyDesc')}</p>
              <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1 mb-3">{t('zktNisabMethodologyHint1')} <strong>{t('zktNisabMethodologyHintBold')}</strong> {t('zktNisabMethodologyHint2')} <a href="/dashboard/fiqh" className="underline font-semibold">{t('zktFiqhSettings')}</a>.</p>
              <div className="space-y-2">
                {nisabMethodologies.map((m) => (
                  <label
                    key={m.code as string}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      selectedMethodology === m.code
                        ? 'border-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${savingMethodology ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input
                      type="radio"
                      name="nisabMethodology"
                      value={m.code as string}
                      checked={selectedMethodology === m.code}
                      onChange={() => handleMethodologyChange(m.code as string)}
                      disabled={savingMethodology}
                      className="mt-0.5 accent-[#1B5E20]"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.name as string}</p>
                      {m.description ? <p className="text-xs text-gray-500 mt-0.5">{String(m.description)}</p> : null}
                    </div>
                  </label>
                ))}
              </div>
              {savingMethodology && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
                  <p className="text-xs text-gray-500">{t('zktUpdatingMethodology')}</p>
                </div>
              )}
            </div>
          )}

          {nisabInfo?.staleWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 mt-4">
              <p className="text-amber-800 text-sm font-medium">
                {tFmt('zktStaleWarningFmt', [formatTimeAgo(nisabInfo.priceAgeMs)])}
              </p>
            </div>
          )}

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>{t('zktReminderLabel')}</strong> {t('zktReminderBase')}
            {selectedMethodology === 'CLASSICAL_SILVER'
              ? t('zktReminderSilver')
              : selectedMethodology === 'LOWER_OF_TWO'
              ? t('zktReminderLower')
              : t('zktReminderGold')}
            {' '}{t('zktReminderHawlTracker')}
          </div>
        </>

      ) : tab === 'assets' ? (
        <>
          {/* BUG-Z1 cross-link clarity banner (2026-05-27): the Asset Calc
              tab is a session-only what-if calculator and does NOT persist
              to Overview. Spell that out so users don't expect it to
              update their dashboard totals. */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-900 flex items-start gap-2">
            <span aria-hidden>ℹ️</span>
            <p>
              {t('zktAssetCalcSandboxNote')}{' '}
              <Link href="/dashboard/assets" className="underline font-semibold hover:text-blue-700">{t('zktAssetCalcSandboxCta')}</Link>
            </p>
          </div>
          {/* Manual Zakat Asset Calculator */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">{t('zktManualHeading')}</p>
            <p>{tFmt('zktManualIntroFmt', [
              data?.nisab ? fmt(data.nisab as number) : '…',
              selectedMethodology === 'CLASSICAL_SILVER'
                ? t('zktSrcSilverPrices')
                : selectedMethodology === 'LOWER_OF_TWO'
                ? t('zktSrcLowerPrices')
                : t('zktSrcGoldPrices'),
            ])}</p>
          </div>

          {(() => {
            const totalIn = manualAssets.cash + manualAssets.gold + manualAssets.silver +
              manualAssets.stocks + manualAssets.businessGoods + manualAssets.receivables +
              manualAssets.rentalIncome + manualAssets.otherAssets;
            const totalOut = manualAssets.debts + manualAssets.expenses;
            const netWealth = Math.max(0, totalIn - totalOut);
            const nisab = (data?.nisab as number) || 0;

            // Check for zero or invalid nisab
            if (!nisab || nisab <= 0) {
              return (
                <div className="text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  {t('zktNisabUnavailable')}
                </div>
              );
            }

            const isEligible = netWealth >= nisab;
            const zakatAmt = isEligible ? netWealth * 0.025 : 0;

            const setAsset = (key: string, val: number) =>
              setManualAssets(prev => ({ ...prev, [key]: Math.max(0, val) }));

            const renderAssetRow = ({ label, icon, fieldKey, hint }: { label: string; icon: string; fieldKey: string; hint?: string }) => (
              <div key={fieldKey} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-xl w-7 text-center shrink-0">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  {hint && <p className="text-xs text-gray-400">{hint}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">$</span>
                  <input
                    type="number" min="0" step="100"
                    value={manualAssets[fieldKey as keyof typeof manualAssets] || ''}
                    onChange={e => setAsset(fieldKey, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-28 border rounded-lg px-2 py-1.5 text-sm text-right text-gray-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            );

            return (
              <>
                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-primary mb-3">{t('zktAssetsZakatable')}</h3>
                  {renderAssetRow({ label: t('zktAssetCash'), icon: "💵", fieldKey: "cash", hint: t('zktAssetCashHint') })}
                  {renderAssetRow({ label: t('zktAssetGold'), icon: "🥇", fieldKey: "gold", hint: t('zktAssetGoldHint') })}
                  {renderAssetRow({ label: t('zktAssetSilver'), icon: "🥈", fieldKey: "silver", hint: t('zktAssetSilverHint') })}
                  {renderAssetRow({ label: t('zktAssetStocks'), icon: "📈", fieldKey: "stocks", hint: t('zktAssetStocksHint') })}
                  {renderAssetRow({ label: t('zktAssetBusiness'), icon: "📦", fieldKey: "businessGoods", hint: t('zktAssetBusinessHint') })}
                  {renderAssetRow({ label: t('zktAssetReceivables'), icon: "🤝", fieldKey: "receivables", hint: t('zktAssetReceivablesHint') })}
                  {renderAssetRow({ label: t('zktAssetRental'), icon: "🏠", fieldKey: "rentalIncome", hint: t('zktAssetRentalHint') })}
                  {renderAssetRow({ label: t('zktAssetOther'), icon: "💼", fieldKey: "otherAssets", hint: t('zktAssetOtherHint') })}
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-red-600 mb-3">{t('zktDeductions')}</h3>
                  {renderAssetRow({ label: t('zktDeductDebts'), icon: "💳", fieldKey: "debts", hint: t('zktDeductDebtsHint') })}
                  {renderAssetRow({ label: t('zktDeductExpenses'), icon: "📋", fieldKey: "expenses", hint: t('zktDeductExpensesHint') })}
                </div>

                {/* Result */}
                <div className={`rounded-2xl p-6 text-white text-center mb-4 ${isEligible ? 'bg-gradient-to-r from-amber-600 to-yellow-500' : 'bg-gradient-to-r from-gray-500 to-gray-400'}`}>
                  <p className="text-amber-100 text-sm mb-1">{t('zktNetZakatableWealth')}</p>
                  <p className="text-4xl font-bold">{fmt(netWealth)}</p>
                  <p className="text-amber-200 text-sm mt-2">
                    {isEligible
                      ? tFmt('zktAboveNisabFmt', [fmt(nisab)])
                      : nisab > 0 ? tFmt('zktBelowNisabFmt', [fmt(nisab)]) : t('zktLoadingNisab')}
                  </p>
                  {isEligible && (
                    <div className="mt-4 bg-white/20 rounded-xl p-4">
                      <p className="text-xs text-amber-100 mb-1">{t('zktHeroDue')}</p>
                      <p className="text-3xl font-bold">{fmt(zakatAmt)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">{t('zktTotalAssets')}</p>
                    <p className="font-bold text-green-600">{fmt(totalIn)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">{t('zktDeductions')}</p>
                    <p className="font-bold text-red-500">−{fmt(totalOut)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">{t('zktNetWealth')}</p>
                    <p className="font-bold text-primary">{fmt(netWealth)}</p>
                  </div>
                </div>

                {totalOut > totalIn && (
                  <p className="text-sm text-gray-500 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {t('zktDebtsExceedNote')}
                  </p>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-xs text-blue-800">
                  <strong>{t('zktStocksNoteLabel')}</strong> {t('zktStocksNote')}
                </div>
              </>
            );
          })()}
        </>
      ) : tab === 'payments' ? (
        <>
          {/* Payment Progress Summary */}
          <div className={`rounded-2xl p-6 text-white mb-6 ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]'}`}>
            <p className="text-lg font-bold mb-4">{fulfilled ? t('zktProgressFulfilled') : t('zktProgressTitle')} — {lunarYear} {t('zktAhSuffix')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{hideZakat ? '••••' : fmt(zakatDue ?? 0)}</p>
                <p className="text-white/60 text-xs">{t('zktDueLabel')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-300">{hideZakat ? '••••' : fmt(totalPaid)}</p>
                <p className="text-white/60 text-xs">{t('zktPaidLabel')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white/70">{hideZakat ? '••••' : fmt(remaining)}</p>
                <p className="text-white/60 text-xs">{t('zktRemainingLabel')}</p>
              </div>
            </div>
            {(zakatDue ?? 0) > 0 && !hideZakat && (
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full ${fulfilled ? 'bg-blue-300' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, fulfillmentPct * 100)}%` }} />
                </div>
                <p className="text-white/60 text-xs mt-2 text-center">{tFmt('zktPctPaidFmt', [(fulfillmentPct * 100).toFixed(0), lunarYear])}</p>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">{t('zktPaymentHistory')}</h2>
            <button onClick={handleShowPaymentForm} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm">{t('zktRecordPayment')}</button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🕌</p>
              <p>{tFmt('zktNoPaymentsFmt', [lunarYear])}</p>
              <p className="text-sm mt-1">{t('zktTapToLog')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => {
                const paidAt = p.paidAt as number;
                const date = new Date(paidAt < 1e12 ? paidAt * 1000 : paidAt);
                return (
                  <div key={p.id as number} className="bg-white rounded-xl p-4 flex items-center gap-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-xl">🕌</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary">{hideZakat ? '••••' : fmt(p.amount as number)}</p>
                      {p.recipient ? <p className="text-gray-500 text-sm truncate">{String(p.recipient)}</p> : null}
                      {p.notes ? <p className="text-gray-400 text-xs truncate">{String(p.notes)}</p> : null}
                      <p className="text-gray-400 text-xs">{date.toLocaleDateString(dateLocale)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditPayment(p)} className="text-gray-300 hover:text-primary transition" aria-label="Edit payment">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                      </button>
                      <button onClick={() => handleDeletePayment(p.id as number)} className="text-gray-300 hover:text-red-500 transition" aria-label="Delete payment">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pay Your Zakat Card */}
          <div className="mt-6 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">{t('zktReadyToPay')}</h3>
              <p className="text-green-100 text-sm">{t('zktPayDirectly')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <a
                href="https://www.zakatfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
              >
                Zakat Foundation
              </a>
              <a
                href="https://www.launchgood.com/zakat"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
              >
                LaunchGood
              </a>
              <a
                href="https://www.islamicrelief.org/zakat/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
              >
                Islamic Relief
              </a>
            </div>
            <p className="text-xs text-green-100">
              {t('zktNotAffiliated')}
            </p>
          </div>
        </>
      ) : tab === 'fitr' ? (
        <>
          {/* Zakat al-Fitr Calculator */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">{t('zktFitrHeading')}</p>
            <p>{t('zktFitrIntro')}</p>
          </div>

          <div className="bg-white rounded-xl p-5 mb-5">
            <label htmlFor="household-size" className="block text-sm font-medium text-gray-700 mb-3">{t('zktHouseholdSize')}</label>
            <input
              id="household-size"
              type="number"
              min="1"
              max="100"
              value={householdSize}
              onChange={(e) => handleHouseholdSizeChange(parseInt(e.target.value) || 1)}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-2">{t('zktHouseholdHint')}</p>
          </div>

          {loadingFitr ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : fitrData ? (
            <>
              <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-6 text-white text-center mb-6">
                <p className="text-amber-100 mb-2">{t('zktFitrDue')}</p>
                <p className="text-4xl font-bold">{fmt((fitrData.totalDue as number) || 0)}</p>
                <p className="text-amber-200 text-sm mt-2">{tFmt('zktFitrForPersonsFmt', [householdSize])}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-500 text-xs">{t('zktFitrMinimum')}</p>
                  <p className="text-xl font-bold text-primary">{fmt((fitrData.minimumAmount as number) || 0)}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('zktPerPerson')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-500 text-xs">{t('zktFitrRecommended')}</p>
                  <p className="text-xl font-bold text-primary">{fmt((fitrData.recommendedAmount as number) || 0)}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('zktPerPerson')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-500 text-xs">{t('zktFitrGenerous')}</p>
                  <p className="text-xl font-bold text-primary">{fmt((fitrData.generousAmount as number) || 0)}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('zktPerPerson')}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="font-semibold text-blue-900 mb-2">{t('zktKeyInfo')}</p>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li><strong>{t('zktDeadlineLabel')}</strong> {String(fitrData.deadline ?? t('zktDeadlineDefault'))}</li>
                  <li><strong>{t('zktEligibleRecipientsLabel')}</strong> {String(fitrData.eligibleRecipients ?? t('zktEligibleRecipientsDefault'))}</li>
                  {fitrData.hadithCitation ? <li><strong>{t('zktHadithLabel')}</strong> {String(fitrData.hadithCitation)}</li> : null}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5">
                <p className="font-semibold text-primary mb-3">{t('zktPurposeReward')}</p>
                <p className="text-sm text-gray-700">
                  {t('zktPurposeRewardDesc')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">{t('zktFitrLoadFailed')}</p>
              <button
                onClick={loadZakatAlFitr}
                className="text-primary font-medium hover:underline text-sm"
              >
                {t('zktTryAgain')}
              </button>
            </div>
          )}
        </>
      ) : tab === 'references' ? (
        <>
          {/* Scholarly Sources */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-800">
            <p className="font-semibold mb-1">{t('zktSourcesHeading')}</p>
            <p>{t('zktSourcesIntro')}</p>
          </div>

          {loadingReferences ? (
            <div className="flex justify-center py-12">
              <div role="status" aria-label={t('zktLoadingReferences')} className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full">
                <span className="sr-only">{t('zktLoadingShort')}</span>
              </div>
            </div>
          ) : Array.isArray(scholarlyReferences) && scholarlyReferences.length > 0 ? (
            <div className="space-y-4">
              {scholarlyReferences.map((ref, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-lg">📖</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary text-sm">{String(ref.ruling ?? '')}</h3>
                      {ref.source ? (
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>{t('zktSourceLabel')}</strong> {String(ref.source)}
                        </p>
                      ) : null}
                      {ref.verse ? (
                        <p className="text-xs text-gray-600">
                          <strong>{t('zktQuranLabel')}</strong> {String(ref.verse)}
                        </p>
                      ) : null}
                      {ref.hadith ? (
                        <p className="text-xs text-gray-600">
                          <strong>{t('zktHadithLabel')}</strong> {String(ref.hadith)}
                        </p>
                      ) : null}
                      {ref.opinion ? (
                        <p className="text-xs text-gray-700 mt-2 italic">
                          {String(ref.opinion)}
                        </p>
                      ) : null}
                      {ref.madhabs ? (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>{t('zktMadhabsLabel')}</strong> {String(ref.madhabs)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">{t('zktNoReferences')}</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-sm text-amber-800">
            <p className="font-semibold mb-2">{t('zktDisclaimer')}</p>
            <p>{t('zktDisclaimerBody')}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">{t('zktUnknownTab')}</p>
        </div>
      )}

      {/* Calculation Receipt Section */}
      {receipt && (
        <div className="mt-8 border-2 border-green-600 rounded-2xl bg-white shadow-lg overflow-hidden print:shadow-none print:border print:rounded-none">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{t('zktReceiptTitle')}</h2>
                <p className="text-green-100 text-sm mt-1">{t('zktReceiptPlatform')}</p>
              </div>
              <div className="text-right text-sm text-green-100">
                <p>{tFmt('zktReceiptLunarYearFmt', [((receipt.paymentStatus as Record<string, unknown>)?.currentLunarYear as number) || lunarYear])}</p>
                <p>{tFmt('zktReceiptGeneratedFmt', [new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })])}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Methodology Section */}
            {receipt.methodology ? (
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 border-b border-green-200 pb-2">{t('zktMethodology')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: t('zktMethMadhab'), value: String((receipt.methodology as Record<string, unknown>)?.madhab ?? 'N/A') },
                    { label: t('zktMethNisabMethod'), value: String((receipt.methodology as Record<string, unknown>)?.nisabMethodology ?? 'N/A').replace(/_/g, ' ') },
                    { label: t('zktMethGoldThreshold'), value: (receipt.methodology as Record<string, unknown>)?.goldThreshold != null ? fmt(Number((receipt.methodology as Record<string, unknown>).goldThreshold)) : 'N/A' },
                    { label: t('zktMethSilverThreshold'), value: (receipt.methodology as Record<string, unknown>)?.silverThreshold != null ? fmt(Number((receipt.methodology as Record<string, unknown>).silverThreshold)) : 'N/A' },
                    { label: t('zktMethZakatRate'), value: (receipt.methodology as Record<string, unknown>)?.zakatRate != null ? `${(Number((receipt.methodology as Record<string, unknown>).zakatRate) * 100).toFixed(1)}%` : '2.5%' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Fiqh Rules Applied */}
            {receipt.fiqhRules ? (
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 border-b border-green-200 pb-2">{t('zktFiqhRulesApplied')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: t('zktJewelryZakatable'), value: (receipt.fiqhRules as Record<string, unknown>)?.jewelryZakatable ? t('zktYes') : t('zktNo') },
                    { label: t('zktFitrType'), value: String((receipt.fiqhRules as Record<string, unknown>)?.fitrType ?? 'N/A').replace(/_/g, ' ') },
                    { label: t('zktDebtDeduction'), value: String((receipt.fiqhRules as Record<string, unknown>)?.debtDeductionMethod ?? 'N/A').replace(/_/g, ' ') },
                    { label: t('zktRetirementMethod'), value: String((receipt.fiqhRules as Record<string, unknown>)?.retirementMethod ?? 'N/A').replace(/_/g, ' ') },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* 10-Step Calculation Trace */}
            {receipt.calculationTrace ? (() => {
              const trace = receipt.calculationTrace as Record<string, unknown>;
              const steps = [
                { num: 1, label: t('zktStep1'), key: 'step1_totalWealth' },
                { num: 2, label: t('zktStep2'), key: 'step2_nonZakatableWealth' },
                { num: 3, label: t('zktStep3'), key: 'step3_grossZakatable' },
                { num: 4, label: t('zktStep4'), key: 'step4_deductibleDebt' },
                { num: 5, label: t('zktStep5'), key: 'step5_netZakatable' },
                { num: 6, label: t('zktStep6'), key: 'step6_nisabThreshold' },
                { num: 7, label: t('zktStep7'), key: 'step7_zakatEligible', isBool: true },
                { num: 8, label: t('zktStep8'), key: 'step8_zakatDue' },
                { num: 9, label: t('zktStep9'), key: 'step9_paid' },
                { num: 10, label: t('zktStep10'), key: 'step10_remaining' },
              ];
              return (
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 border-b border-green-200 pb-2">{t('zktStepTrace')}</h3>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    {steps.map((step, idx) => {
                      const raw = trace[step.key];
                      let displayValue: string;
                      if (step.isBool) {
                        displayValue = raw ? t('zktYes') : t('zktNo');
                      } else {
                        displayValue = raw != null ? fmt(Number(raw)) : '--';
                      }
                      const isHighlight = step.num === 8 || step.num === 10;
                      return (
                        <div
                          key={step.num}
                          className={`flex items-center justify-between px-4 py-3 ${idx < steps.length - 1 ? 'border-b border-gray-200' : ''} ${isHighlight ? 'bg-green-50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isHighlight ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'}`}>
                              {step.num}
                            </span>
                            <span className={`text-sm ${isHighlight ? 'font-semibold text-primary' : 'text-gray-700'}`}>{step.label}</span>
                          </div>
                          <span className={`text-sm font-mono ${isHighlight ? 'font-bold text-primary text-base' : 'text-gray-800'}`}>
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })() : null}

            {/* Payment Status */}
            {receipt.paymentStatus ? (
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 border-b border-green-200 pb-2">{t('zktPaymentStatus')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500 font-medium">{t('zktLunarYear')}</p>
                    <p className="text-lg font-bold text-primary mt-1">{String((receipt.paymentStatus as Record<string, unknown>)?.currentLunarYear ?? lunarYear)} {t('zktAhSuffix')}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500 font-medium">{t('zktZakatPaid')}</p>
                    <p className="text-lg font-bold text-primary mt-1">{fmt(Number((receipt.paymentStatus as Record<string, unknown>)?.zakatPaid) || 0)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500 font-medium">{t('zktRemainingLabel')}</p>
                    <p className="text-lg font-bold text-amber-700 mt-1">{fmt(Number((receipt.paymentStatus as Record<string, unknown>)?.zakatRemaining ?? (receipt.paymentStatus as Record<string, unknown>)?.remaining) || 0)}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* References */}
            {receipt.references ? (
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 border-b border-green-200 pb-2">{t('zktReferences')}</h3>
                <div className="space-y-2">
                  {Array.isArray((receipt.references as Record<string, unknown>)?.quran) && ((receipt.references as Record<string, unknown>).quran as string[]).map((verse: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
                      <span className="text-green-700 font-bold text-sm shrink-0">{t('zktQuranTag')}</span>
                      <p className="text-sm text-gray-700 italic">{String(verse)}</p>
                    </div>
                  ))}
                  {(receipt.references as Record<string, unknown>)?.hadith ? (
                    <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
                      <span className="text-amber-700 font-bold text-sm shrink-0">{t('zktHadithTag')}</span>
                      <p className="text-sm text-gray-700 italic">{String((receipt.references as Record<string, unknown>).hadith)}</p>
                    </div>
                  ) : null}
                  {(receipt.references as Record<string, unknown>)?.disclaimer ? (
                    <p className="text-xs text-gray-500 mt-2 italic">{String((receipt.references as Record<string, unknown>).disclaimer)}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Footer / Disclaimer */}
            <div className="border-t border-gray-200 pt-4 text-center">
              <p className="text-xs text-gray-400">{t('zktReceiptFooter')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('zktReceiptFooterConsult')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-2 print:hidden">
              <button
                onClick={() => setReceipt(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
              >
                {t('zktCloseReceipt')}
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm"
              >
                {t('zktPrintReceipt')}
              </button>
              {/* Viral loop: zakat is often paid once a year and Muslims naturally
                  share the act with family. Offering a share right on the receipt
                  captures that intent with the user's referral code attached. */}
              <ShareReceiptButton
                source="zakat_receipt"
                title={t('zktShareTitle')}
                pitch={t('zktSharePitch')}
                label={t('zktShareLabel')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Checklist Modal */}
      {showChecklist && (
        <ModalShell onClose={() => setShowChecklist(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-primary mb-4">{t('zktChecklistTitle')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('zktChecklistDesc')}</p>

            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.wealth}
                  onChange={e => setChecklist({ ...checklist, wealth: e.target.checked })}
                  className="mt-1 w-4 h-4"
                  disabled={!zakatEligible}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{t('zktCheckWealth')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{fmt((data?.totalWealth as number) || 0)} {zakatEligible ? '✓' : t('zktCheckNotYet')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.hawl}
                  onChange={e => setChecklist({ ...checklist, hawl: e.target.checked })}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{t('zktCheckHawl')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t('zktCheckHawlDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.debts}
                  onChange={e => setChecklist({ ...checklist, debts: e.target.checked })}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{t('zktCheckDebts')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t('zktCheckDebtsDesc')}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.quranic}
                  onChange={e => setChecklist({ ...checklist, quranic: e.target.checked })}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{t('zktCheckQuranic')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t('zktCheckQuranicDesc')}</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowChecklist(false); setShowForm(false); }} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 font-medium text-sm">{t('zktBack')}</button>
              <button
                onClick={() => {
                  setShowChecklist(false);
                  setShowForm(true);
                }}
                disabled={!checklist.wealth || !checklist.hawl || !checklist.debts || !checklist.quranic}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50 font-medium text-sm"
              >
                {t('zktContinueToPayment')}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <ModalShell onClose={() => setShowForm(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
            <h2 className="text-xl font-bold text-primary mb-2">{tFmt('zktRecordPaymentTitleFmt', [lunarYear])}</h2>

            {/* 2026-05-10 founder ask: "no charity rails — we compute the
                obligation, then dump them back to Google." Curated partner
                deep-links bridge the gap until true money-rail integration
                (Stripe Connect / Dwolla + KYC + non-profit shell) lands.
                Click → opens the partner's zakat-giving page in a new tab
                AND prefills the recipient field so the local ledger
                tracks who they paid through. */}
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-800 mb-2">
                {t('zktPayThroughPartner')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    name: 'NZF (USA / UK)',
                    url: 'https://nzf.org.uk/donate-zakat/',
                    note: t('zktPartnerNzfNote'),
                  },
                  {
                    name: 'LaunchGood Zakat',
                    url: 'https://www.launchgood.com/zakat',
                    note: t('zktPartnerLaunchgoodNote'),
                  },
                  {
                    name: 'Islamic Relief',
                    url: 'https://www.islamic-relief.org/zakat/',
                    note: t('zktPartnerIslamicReliefNote'),
                  },
                  {
                    name: 'Penny Appeal',
                    url: 'https://www.pennyappeal.org/appeal/zakat',
                    note: t('zktPartnerPennyNote'),
                  },
                  {
                    name: 'Helping Hand',
                    url: 'https://www.hhrd.org/Donate?cause=Zakat',
                    note: t('zktPartnerHelpingHandNote'),
                  },
                  {
                    name: 'Zakat Foundation US',
                    url: 'https://www.zakat.org/donate',
                    note: t('zktPartnerZakatFoundationNote'),
                  },
                ].map(p => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setForm(prev => ({ ...prev, recipient: prev.recipient || p.name }))}
                    className="text-left text-xs bg-white border border-emerald-200 rounded px-2 py-1.5 hover:border-emerald-500 hover:bg-emerald-50 transition"
                    title={p.note}
                  >
                    <p className="font-semibold text-emerald-900">{p.name} ↗</p>
                    <p className="text-[10px] text-emerald-700/80 leading-tight">{p.note}</p>
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-emerald-700/70 mt-2">
                {t('zktPartnerTapNote')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tFmt('zktAmountLabelFmt', [currency])}</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('zktRecipientOptional')}</label>
                <input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('zktRecipientPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('zktNotesOptional')}</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={t('zktNotesPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date paid</label>
                <input type="date" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50" disabled={saving}>{t('zktCancel')}</button>
              <button onClick={handleSavePayment} disabled={saving || !form.amount} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">{saving ? t('zktSaving') : t('zktRecord')}</button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Mabrook Dialog */}
      {showMabrook && (
        <ModalShell onClose={() => setShowMabrook(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
            <p className="text-6xl mb-4">🌟</p>
            <h2 className="text-2xl font-bold text-primary mb-2">{t('zktMabrook')}</h2>
            <p className="text-xl text-amber-600 font-bold mb-4">مبروك</p>
            <p className="text-gray-600 mb-2">{tFmt('zktMabrookBodyFmt', [lunarYear])}</p>
            <p className="text-gray-400 italic mb-6">تقبل الله منك</p>
            <button onClick={() => setShowMabrook(false)} className="w-full bg-primary text-primary-foreground rounded-lg py-3 hover:bg-primary/90 font-medium">{t('zktJazakallah')}</button>
          </div>
        </ModalShell>
      )}
      {confirmAction && (
        <ModalShell onClose={() => setConfirmAction(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">{t('zktCancel')}</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">{t('zktConfirm')}</button>
            </div>
          </div>
        </ModalShell>
      )}
      <HistoricalZakatModal
        currentLunarYear={lunarYear}
        open={historicalModalOpen}
        onClose={(savedYear) => {
          setHistoricalModalOpen(false);
          if (savedYear !== null) {
            toast(tFmt('zktHistoricalSavedFmt', [savedYear]), 'success');
            // Refresh payments / snapshot state by dispatching the same event
            // other tabs listen for.
            try { window.dispatchEvent(new Event('barakah:zakat-change')); } catch { /* no-op */ }
          }
        }}
      />
    </div>
  );
}
