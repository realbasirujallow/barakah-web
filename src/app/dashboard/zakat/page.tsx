'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt, toHijri } from '../../../lib/format';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { safeParse, safeParseWithFallback, validateZakatCalculation, validateZakatPaymentsResponse, validateNisabInfo, formatTimeAgo } from '../../../lib/schemas';

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
  const { toast } = useToast();
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
  const [form, setForm] = useState({ amount: '', recipient: '', notes: '' });
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

  useEffect(() => {
    setHideZakat(safeGetItem('hideZakat') === 'true');
  }, []);

  const toggleHideZakat = () => {
    const next = !hideZakat;
    setHideZakat(next);
    safeSetItem('hideZakat', next ? 'true' : 'false');
  };

  const loadZakatAlFitr = async () => {
    setLoadingFitr(true);
    try {
      const fitr = await api.getZakatAlFitr(householdSize, 'USD');
      if (fitr) {
        // Map backend response shape to frontend expected keys.
        // Backend returns: { totalDue: { minimum, recommended, generous }, perPerson: { ... } }
        // Frontend expects: { totalDue (number), minimumAmount, recommendedAmount, generousAmount }
        const totalDue = fitr.totalDue;
        const perPerson = fitr.perPerson;
        const mapped: Record<string, unknown> = { ...fitr };

        // Validate response shape
        if (totalDue && typeof totalDue === 'object' && totalDue !== null && 'recommended' in totalDue) {
          mapped.totalDue = (totalDue as Record<string, number>).recommended ?? (totalDue as Record<string, number>).minimum ?? 0;
          mapped.minimumTotal = (totalDue as Record<string, number>).minimum ?? 0;
          mapped.recommendedTotal = (totalDue as Record<string, number>).recommended ?? 0;
          mapped.generousTotal = (totalDue as Record<string, number>).generous ?? 0;
        } else if (typeof totalDue === 'number') {
          mapped.totalDue = totalDue;
        } else {
          logError(new Error('Unexpected fitr response shape'), { context: 'fitr-response-validation', data: fitr });
          // Use safe defaults
          mapped.totalDue = 0;
        }
        if (perPerson && typeof perPerson === 'object') {
          mapped.minimumAmount = (perPerson as Record<string, number>).minimum ?? 0;
          mapped.recommendedAmount = (perPerson as Record<string, number>).recommended ?? 0;
          mapped.generousAmount = (perPerson as Record<string, number>).generous ?? 0;
        }
        // Map citation fields
        const citations = fitr.citations as Record<string, string> | undefined;
        if (citations) {
          mapped.hadithCitation = citations.hadith ?? '';
          mapped.deadline = fitr.deadline ?? citations.ruling ?? '';
        }
        // Map eligibleRecipients array to string
        const recipients = fitr.eligibleRecipients as string[] | undefined;
        if (Array.isArray(recipients)) {
          mapped.eligibleRecipients = recipients.join(', ');
        }

        setFitrData(mapped);
      }
    } catch (err) {
      logError(err, { context: 'Failed to load zakat al-fitr' });
    }
    setLoadingFitr(false);
  };

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
    setLoading(true);
    setLoadError(null);
    try {
      const results = await Promise.allSettled([
        api.getZakat(),
        api.getZakatPayments(), // load all years; filter by lunarYear after we know it
        api.getNisabInfo().catch(() => null),  // non-critical — live gold price display
        api.getNisabMethodologies().catch(() => null), // FEATURE 1: methodologies
      ]);
      const zakatRaw = results[0].status === 'fulfilled' ? results[0].value : null;
      const paymentsRaw = results[1].status === 'fulfilled' ? results[1].value : null;
      const nisabRaw = results[2].status === 'fulfilled' ? results[2].value : null;
      const methodologiesRaw = results[3].status === 'fulfilled' ? results[3].value : null;

      // Validate zakat data
      const zakatData = safeParse(validateZakatCalculation, zakatRaw, 'zakat/calculate');
      if (!zakatData && zakatRaw?.error) {
        logError(new Error(zakatRaw.error as string), { context: 'Zakat API error' });
        setLoading(false);
        return;
      }
      if (zakatRaw?.error) {
        logError(new Error(zakatRaw.error as string), { context: 'Zakat API error' });
        setLoading(false);
        return;
      }

      // Validate payments data
      const paymentsValidated = safeParse(validateZakatPaymentsResponse, paymentsRaw, 'zakat/payments');
      if (!paymentsValidated && paymentsRaw?.error) {
        logError(new Error(paymentsRaw.error as string), { context: 'Payments API error' });
        setLoading(false);
        return;
      }
      if (paymentsRaw?.error) {
        logError(new Error(paymentsRaw.error as string), { context: 'Payments API error' });
        setLoading(false);
        return;
      }

      // Use fallback for non-critical nisab info
      const nisabData = safeParseWithFallback(validateNisabInfo, nisabRaw, 'nisab/info');
      if (nisabData) setNisabInfo(nisabData);

      // FEATURE 1: Load nisab methodologies and user's current selection
      if (methodologiesRaw && Array.isArray(methodologiesRaw)) {
        // Backend returns { value, displayName, description } — normalize to { code, name, description }
        const normalized: NisabMethodology[] = methodologiesRaw.map((m: Record<string, unknown>) => ({
          code: String(m.value ?? m.code ?? ''),
          name: String(m.displayName ?? m.name ?? ''),
          description: String(m.description ?? ''),
        }));
        setNisabMethodologies(normalized);
      }
      // Load user's current methodology preference from backend
      try {
        const currentPref = await api.getNisabMethodology();
        if (currentPref?.methodology) {
          setSelectedMethodology(currentPref.methodology as string);
        }
      } catch { /* default to AMJA_GOLD if preference fetch fails */ }

      setData(zakatRaw as ZakatCalculation);

      // Filter payments to current lunar year
      const year = (zakatRaw?.currentLunarYear as number) || computeHijriYear();
      const filtered = (paymentsValidated?.payments || []).filter(p => !p.lunarYear || p.lunarYear === year);
      setPayments(filtered);
      // Use the backend's zakatPaid value for consistency with the dashboard.
      // Previously, summing individual payment records caused a rounding discrepancy
      // (e.g., dashboard showed $700.00 but zakat page showed $700.04).
      const backendPaid = (zakatRaw?.zakatPaid as number) ?? undefined;
      const clientPaid = filtered.reduce((s: number, p) => s + (p.amount || 0), 0);
      setTotalPaid(backendPaid != null ? backendPaid : clientPaid);
    } catch (err) {
      logError(err, { context: 'Failed to load zakat data' });
      setLoadError('Failed to load zakat data. Please try refreshing.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Use effectiveZakatAmount (locked amount) if available, otherwise use zakatDue
  const zakatDue = data && !data.error
    ? ((data?.effectiveZakatAmount as number) ?? (data?.zakatDue as number) ?? 0)
    : null;
  const zakatEligible = data?.zakatEligible as boolean;
  const remaining = zakatDue !== null ? Math.max(0, zakatDue - totalPaid) : 0;
  const fulfilled = zakatDue !== null && zakatEligible && totalPaid >= zakatDue && zakatDue > 0;
  const fulfillmentPct = zakatDue !== null && zakatDue > 0 ? Math.min(1, totalPaid / zakatDue) : 0;

  // Show Mabrook dialog if zakat is fulfilled
  useEffect(() => {
    if (fulfilled && zakatDue !== null && zakatDue > 0) {
      setShowMabrook(true);
    }
  }, [fulfilled, zakatDue]);

  const handleShowPaymentForm = () => {
    // Show checklist first, reset form
    setChecklist({ wealth: false, hawl: false, debts: false, quranic: false });
    setForm({ amount: '', recipient: '', notes: '' });
    setShowChecklist(true);
  };

  const handleSavePayment = async () => {
    const amount = parseFloat(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    setSaving(true);
    try {
      await api.addZakatPayment({
        amount,
        recipient: form.recipient || undefined,
        notes: form.notes || undefined,
        lunarYear,
      });
      setForm({ amount: '', recipient: '', notes: '' });
      setShowForm(false);
      setShowChecklist(false);
      // Calculate new total directly without relying on stale state
      await load();
      // Don't manually compute totalPaid — let it come from the server
    } catch { toast('Failed to save payment. Please try again.', 'error'); }
    setSaving(false);
  };

  const handleDeletePayment = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this zakat payment? This cannot be undone.');
    if (!confirmed) return;

    setConfirmAction({
      message: 'Delete this payment?',
      action: async () => {
        try {
          await api.deleteZakatPayment(id);
          toast('Payment deleted', 'success');
          load();
        } catch (err) {
          toast(err instanceof Error ? err.message : 'Failed to delete payment', 'error');
        }
      }
    });
  };

  // FEATURE 1: Handle Nisab Methodology Change
  const handleMethodologyChange = async (methodology: string) => {
    // Validate methodology
    const validMethodologies = ['AMJA_GOLD', 'CLASSICAL_SILVER', 'LOWER_OF_TWO'];
    if (!validMethodologies.includes(methodology)) {
      toast('Invalid methodology selected', 'error');
      return;
    }
    const previous = selectedMethodology;
    setSelectedMethodology(methodology);
    setSavingMethodology(true);
    try {
      await api.setNisabMethodology(methodology);
      toast('Nisab methodology updated', 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update methodology', 'error');
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
        loadZakatAlFitr();
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [householdSize, tab]);

  // FEATURE 3: PDF Export
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const report = await api.exportZakatReport();
      if (!report) {
        toast('No report data available', 'error');
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast('Please allow popups to export', 'error');
        return;
      }

      const summary = report.summary as Record<string, unknown> || {};
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Zakat Report - Barakah</title>
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
            <h1>${report.title || 'Zakat Report'}</h1>
            <p><strong>Prepared for:</strong> ${report.generatedFor || 'User'}</p>
            <p><strong>Lunar Year:</strong> ${report.lunarYear || lunarYear} AH</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>

            <div class="summary-box">
              <h2>Zakat Summary</h2>
              <table>
                <tr>
                  <td>Total Wealth</td>
                  <td class="amount">$${(summary.totalWealth as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>Zakatable Wealth</td>
                  <td class="amount">$${(summary.zakatableWealth as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>Nisab Threshold</td>
                  <td>$${((summary.nisab ?? summary.nisabThreshold) as number)?.toFixed(2) || '0.00'} (${summary.nisabMethodology || 'AMJA_GOLD'})</td>
                </tr>
                <tr>
                  <td>Zakat Due (2.5%)</td>
                  <td class="amount">$${(summary.zakatDue as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>Total Paid</td>
                  <td>$${(summary.totalPaid as number)?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td>Remaining</td>
                  <td class="amount">$${(summary.remaining as number)?.toFixed(2) || '0.00'}</td>
                </tr>
              </table>
            </div>

            <p class="citation">${report.complianceStatement || ''}</p>
            <p class="disclaimer">${report.disclaimer || 'This report is for informational purposes. Consult a scholar for your specific zakat obligation.'}</p>
            <div class="footer">
              <p>Generated by Barakah Islamic Finance Platform — trybarakah.com</p>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div role="status" aria-label="Loading zakat data..." className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-4">Failed to load zakat data.</p>
          <button
            onClick={load}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#1B5E20]">Zakat Calculator</h1>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{lunarYear} AH</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleHideZakat}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {hideZakat ? 'Show' : 'Hide'}
          </button>
          {tab === 'calculator' && (
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 disabled:opacity-50 font-medium"
              title="Export as PDF"
            >
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          )}
          <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap">
            <button onClick={() => setTab('calculator')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'calculator' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Overview</button>
            <button onClick={() => setTab('assets')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'assets' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Asset Calc</button>
            <button onClick={() => setTab('payments')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'payments' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Payments</button>
            <button onClick={() => setTab('fitr')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'fitr' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Al-Fitr</button>
            <button onClick={() => { setTab('references'); loadScholarlyReferences(); }} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'references' ? 'bg-white shadow text-[#1B5E20]' : 'text-gray-500'}`}>Sources</button>
          </div>
        </div>
      </div>

      {tab === 'calculator' ? (
        <>
          {/* Zakat Status Hero */}
          <div className={`rounded-2xl p-8 text-white mb-6 text-center ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-amber-600 to-yellow-500'}`}>
            <p className="text-4xl mb-2">{fulfilled ? '🌟' : zakatEligible ? '✅' : 'ℹ️'}</p>
            <p className="text-amber-100 mb-2">{fulfilled ? 'Zakat Fulfilled!' : 'Zakat Due (2.5%)'}</p>
            <p className="text-5xl font-bold">
              {hideZakat ? '••••••' : fmt(zakatDue ?? 0)}
            </p>
            <p className="text-amber-200 mt-4 text-sm">
              {fulfilled ? 'Mabrook! May Allah accept your Zakat. تقبل الله منك' : zakatEligible ? 'Your wealth exceeds Nisab — Zakat is obligatory' : 'Your wealth is below Nisab threshold'}
            </p>
            {totalPaid > 0 && (zakatDue ?? 0) > 0 && !hideZakat && (
              <div className="mt-4 max-w-md mx-auto">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${fulfilled ? 'bg-blue-300' : 'bg-white'}`} style={{ width: `${fulfillmentPct * 100}%` }} />
                </div>
                <p className="text-white/70 text-xs mt-2">
                  {fulfilled ? 'Fully paid ✓' : `Paid: ${fmt(totalPaid)} / Remaining: ${fmt(remaining)}`}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm">Total Wealth</p>
              <p className="text-2xl font-bold text-[#1B5E20]">
                {hideZakat ? '••••••' : fmt((data?.totalWealth as number) || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm">Zakatable Wealth</p>
              <p className="text-2xl font-bold text-[#1B5E20]">
                {hideZakat ? '••••••' : fmt((data?.zakatableWealth as number) || 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">After deductions &amp; exemptions</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-500 text-sm flex items-center gap-1">
                Nisab Threshold
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Live gold price" />
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {data?.nisab ? fmt(data.nisab as number) : '—'}
              </p>
              {nisabInfo?.goldPricePerGram && (
                <p className="text-xs text-gray-400 mt-1">
                  Gold: ${nisabInfo.goldPricePerGram!.toFixed(2)}/g · 85g standard
                  {nisabInfo.priceAgeMs !== undefined && (
                    <span className="ml-1">· updated {formatTimeAgo(nisabInfo.priceAgeMs)}</span>
                  )}
                </p>
              )}
              <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-0.5 mt-2 inline-block font-medium">
                {selectedMethodology === 'CLASSICAL_SILVER' ? 'Silver Standard (Classical Hanafi)' :
                 selectedMethodology === 'LOWER_OF_TWO' ? 'Lower of Gold/Silver (Al-Qaradawi)' :
                 'Gold Standard (AMJA)'} · <button onClick={() => { const el = document.getElementById('methodology-section'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="underline">Change</button>
              </p>
            </div>
          </div>

          {/* How Your Zakat Is Calculated — Asset Breakdown */}
          {!hideZakat && data?.breakdown && Array.isArray(data.breakdown) && (data.breakdown as Record<string, unknown>[]).length > 0 && (
            <div className="mt-6 bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#1B5E20] mb-3">How Your Zakat Is Calculated</h3>
              <p className="text-xs text-gray-500 mb-4">Each asset you&apos;ve added is classified as zakatable or exempt. Here&apos;s the breakdown:</p>
              <div className="space-y-2">
                {(data.breakdown as Record<string, unknown>[]).map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2.5 px-3 rounded-lg ${item.zakatable ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <span className={`mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${item.zakatable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {item.zakatable ? 'Zakatable' : 'Exempt'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-gray-800 truncate">{String(item.name)}</p>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-bold text-gray-800">{fmt(Number(item.value) || 0)}</p>
                          {Boolean(item.zakatable) && Number(item.zakatableValue) !== Number(item.value) && (
                            <p className="text-xs text-green-600">{fmt(Number(item.zakatableValue) || 0)} zakatable</p>
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
                  <span className="mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">Deduction</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-gray-800">Debt Deductions</p>
                      <p className="text-sm font-bold text-red-600">-{fmt(data.totalDebts as number)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Active debts deducted per your fiqh settings</p>
                  </div>
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <p className="text-sm font-medium text-gray-700">Net Zakatable Wealth</p>
                <p className="text-lg font-bold text-[#1B5E20]">{fmt((data?.zakatableWealth as number) || 0)}</p>
              </div>
            </div>
          )}

          {/* No assets message */}
          {!hideZakat && (!data?.breakdown || (data.breakdown as Record<string, unknown>[]).length === 0) && (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
              <p className="text-blue-800 text-sm font-medium mb-1">No assets found</p>
              <p className="text-blue-600 text-xs">Add your assets in the Assets page so Barakah can automatically calculate your zakat obligation.</p>
              <button onClick={() => window.location.href = '/dashboard/assets'} className="mt-3 text-sm bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32]">
                Go to Assets
              </button>
            </div>
          )}

          {nisabMethodologies.length > 0 && (
            <div id="methodology-section" className="mt-6 bg-white rounded-xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nisab Methodology
              </label>
              <p className="text-xs text-gray-400 mb-2">Choose how the minimum zakat threshold is calculated</p>
              <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1 mb-3">💡 This sets your <strong>nisab threshold</strong> only. For madhab-specific rules (jewelry exemption, debt deduction), go to <a href="/dashboard/fiqh" className="underline font-semibold">Fiqh Settings</a>.</p>
              <div className="space-y-2">
                {nisabMethodologies.map((m) => (
                  <label
                    key={m.code as string}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      selectedMethodology === m.code
                        ? 'border-[#1B5E20] bg-green-50'
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
                  <div className="animate-spin w-3 h-3 border-2 border-[#1B5E20] border-t-transparent rounded-full" />
                  <p className="text-xs text-gray-500">Updating methodology...</p>
                </div>
              )}
            </div>
          )}

          {nisabInfo?.staleWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 mt-4">
              <p className="text-amber-800 text-sm font-medium">
                ⚠ Price data may be outdated (last updated {formatTimeAgo(nisabInfo.priceAgeMs)}).
                Gold and silver prices are used to calculate your Nisab threshold.
                Consider refreshing or verifying current prices before making zakat decisions.
              </p>
            </div>
          )}

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Reminder:</strong> Zakat is 2.5% of wealth held for one Islamic lunar year (Hawl) above the Nisab threshold.
            The Nisab is based on the live gold price (85g, AMJA standard) and updates hourly — small changes are normal.
            Use the Hawl Tracker to track when each asset becomes eligible.
          </div>
        </>

      ) : tab === 'assets' ? (
        <>
          {/* Manual Zakat Asset Calculator */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">📌 Manual Asset Breakdown</p>
            <p>Enter each zakatable asset below. This calculator is independent of your connected accounts and uses the Nisab ({data?.nisab ? fmt(data.nisab as number) : '…'}) from live gold prices.</p>
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
                  Unable to determine nisab threshold. Gold/silver prices may be unavailable. Please try again later.
                </div>
              );
            }

            const isEligible = netWealth >= nisab;
            const zakatAmt = isEligible ? netWealth * 0.025 : 0;

            const setAsset = (key: string, val: number) =>
              setManualAssets(prev => ({ ...prev, [key]: Math.max(0, val) }));

            const AssetRow = ({ label, icon, fieldKey, hint }: { label: string; icon: string; fieldKey: string; hint?: string }) => (
              <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
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
                    className="w-28 border rounded-lg px-2 py-1.5 text-sm text-right text-gray-900 focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            );

            return (
              <>
                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-[#1B5E20] mb-3">Assets (Zakatable)</h3>
                  <AssetRow label="Cash & Bank Accounts" icon="💵" fieldKey="cash" hint="Checking, savings, and cash on hand" />
                  <AssetRow label="Gold" icon="🥇" fieldKey="gold" hint="Market value of gold owned" />
                  <AssetRow label="Silver" icon="🥈" fieldKey="silver" hint="Market value of silver owned" />
                  <AssetRow label="Stocks & Investments" icon="📈" fieldKey="stocks" hint="Halal stocks, ETFs, mutual funds (market value)" />
                  <AssetRow label="Business Inventory" icon="📦" fieldKey="businessGoods" hint="Stock / goods held for trade" />
                  <AssetRow label="Money Owed to You" icon="🤝" fieldKey="receivables" hint="Loans given that are likely to be returned" />
                  <AssetRow label="Rental Income Saved" icon="🏠" fieldKey="rentalIncome" hint="Net rental income received this hawl" />
                  <AssetRow label="Other Assets" icon="💼" fieldKey="otherAssets" hint="Any other zakatable wealth" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-red-600 mb-3">Deductions</h3>
                  <AssetRow label="Outstanding Debts Due" icon="💳" fieldKey="debts" hint="Debts that are immediately due" />
                  <AssetRow label="Essential Expenses" icon="📋" fieldKey="expenses" hint="Unavoidable expenses due within this month" />
                </div>

                {/* Result */}
                <div className={`rounded-2xl p-6 text-white text-center mb-4 ${isEligible ? 'bg-gradient-to-r from-amber-600 to-yellow-500' : 'bg-gradient-to-r from-gray-500 to-gray-400'}`}>
                  <p className="text-amber-100 text-sm mb-1">Net Zakatable Wealth</p>
                  <p className="text-4xl font-bold">{fmt(netWealth)}</p>
                  <p className="text-amber-200 text-sm mt-2">
                    {isEligible
                      ? `Above nisab (${fmt(nisab)}) — Zakat is obligatory`
                      : nisab > 0 ? `Below nisab (${fmt(nisab)}) — Zakat not obligatory` : 'Loading nisab…'}
                  </p>
                  {isEligible && (
                    <div className="mt-4 bg-white/20 rounded-xl p-4">
                      <p className="text-xs text-amber-100 mb-1">Zakat Due (2.5%)</p>
                      <p className="text-3xl font-bold">{fmt(zakatAmt)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Total Assets</p>
                    <p className="font-bold text-green-600">{fmt(totalIn)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Deductions</p>
                    <p className="font-bold text-red-500">−{fmt(totalOut)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Net Wealth</p>
                    <p className="font-bold text-[#1B5E20]">{fmt(netWealth)}</p>
                  </div>
                </div>

                {totalOut > totalIn && (
                  <p className="text-sm text-gray-500 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    Note: Your debts exceed your assets. Net zakatable wealth is capped at $0 — no zakat is due when debts exceed assets.
                  </p>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-xs text-blue-800">
                  <strong>Note:</strong> Stocks: many scholars say to use the market value of shares in companies whose primary business is halal. For mixed companies, apply the purification ratio. Consult a scholar for your specific situation.
                </div>
              </>
            );
          })()}
        </>
      ) : tab === 'payments' ? (
        <>
          {/* Payment Progress Summary */}
          <div className={`rounded-2xl p-6 text-white mb-6 ${fulfilled ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]'}`}>
            <p className="text-lg font-bold mb-4">{fulfilled ? '🌟 Zakat Fulfilled' : '📊 Zakat Progress'} — {lunarYear} AH</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{hideZakat ? '••••' : fmt(zakatDue ?? 0)}</p>
                <p className="text-white/60 text-xs">Due</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-300">{hideZakat ? '••••' : fmt(totalPaid)}</p>
                <p className="text-white/60 text-xs">Paid</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white/70">{hideZakat ? '••••' : fmt(remaining)}</p>
                <p className="text-white/60 text-xs">Remaining</p>
              </div>
            </div>
            {(zakatDue ?? 0) > 0 && !hideZakat && (
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className={`h-3 rounded-full ${fulfilled ? 'bg-blue-300' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, fulfillmentPct * 100)}%` }} />
                </div>
                <p className="text-white/60 text-xs mt-2 text-center">{(fulfillmentPct * 100).toFixed(0)}% of zakat paid for {lunarYear} AH</p>
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#1B5E20]">Payment History</h2>
            <button onClick={handleShowPaymentForm} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm">+ Record Payment</button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🕌</p>
              <p>No payments recorded for {lunarYear} AH</p>
              <p className="text-sm mt-1">Tap &quot;Record Payment&quot; to log your Zakat</p>
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
                      <p className="font-bold text-[#1B5E20]">{hideZakat ? '••••' : fmt(p.amount as number)}</p>
                      {p.recipient ? <p className="text-gray-500 text-sm truncate">{String(p.recipient)}</p> : null}
                      {p.notes ? <p className="text-gray-400 text-xs truncate">{String(p.notes)}</p> : null}
                      <p className="text-gray-400 text-xs">{date.toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDeletePayment(p.id as number)} className="text-gray-300 hover:text-red-500 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pay Your Zakat Card */}
          <div className="mt-6 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-1">Ready to Pay Your Zakat?</h3>
              <p className="text-green-100 text-sm">Pay directly to trusted platforms</p>
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
              Barakah is not affiliated with these organizations. Verify zakat eligibility with a qualified scholar.
            </p>
          </div>
        </>
      ) : tab === 'fitr' ? (
        <>
          {/* Zakat al-Fitr Calculator */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">🌙 Zakat al-Fitr Calculator</p>
            <p>Zakat al-Fitr is a charity given at the end of Ramadan, before the Eid prayer. It is mandatory on all Muslims and purifies those who fasted.</p>
          </div>

          <div className="bg-white rounded-xl p-5 mb-5">
            <label htmlFor="household-size" className="block text-sm font-medium text-gray-700 mb-3">Household Size</label>
            <input
              id="household-size"
              type="number"
              min="1"
              max="100"
              value={householdSize}
              onChange={(e) => handleHouseholdSizeChange(parseInt(e.target.value) || 1)}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#1B5E20]"
            />
            <p className="text-xs text-gray-500 mt-2">Enter the number of people in your household (1-100)</p>
          </div>

          {loadingFitr ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
            </div>
          ) : fitrData ? (
            <>
              <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-6 text-white text-center mb-6">
                <p className="text-amber-100 mb-2">Zakat al-Fitr Due</p>
                <p className="text-4xl font-bold">{fmt((fitrData.totalDue as number) || 0)}</p>
                <p className="text-amber-200 text-sm mt-2">For {householdSize} person{householdSize > 1 ? 's' : ''}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-500 text-xs">Minimum</p>
                  <p className="text-xl font-bold text-[#1B5E20]">{fmt((fitrData.minimumAmount as number) || 0)}</p>
                  <p className="text-xs text-gray-400 mt-1">Per person</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-500 text-xs">Recommended</p>
                  <p className="text-xl font-bold text-[#1B5E20]">{fmt((fitrData.recommendedAmount as number) || 0)}</p>
                  <p className="text-xs text-gray-400 mt-1">Per person</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-500 text-xs">Generous</p>
                  <p className="text-xl font-bold text-[#1B5E20]">{fmt((fitrData.generousAmount as number) || 0)}</p>
                  <p className="text-xs text-gray-400 mt-1">Per person</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="font-semibold text-blue-900 mb-2">Key Information</p>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li><strong>Deadline:</strong> {String(fitrData.deadline ?? 'Before Eid al-Fitr prayer')}</li>
                  <li><strong>Eligible Recipients:</strong> {String(fitrData.eligibleRecipients ?? 'The poor and needy')}</li>
                  {fitrData.hadithCitation ? <li><strong>Hadith:</strong> {String(fitrData.hadithCitation)}</li> : null}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5">
                <p className="font-semibold text-[#1B5E20] mb-3">Purpose & Reward</p>
                <p className="text-sm text-gray-700">
                  Zakat al-Fitr is prescribed to purify those who fasted from any indecent act or speech during Ramadan. It is an obligation and a form of charity that should be given before the Eid prayer for it to be accepted. All Muslims must give Zakat al-Fitr, including children, the elderly, and the sick.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">Unable to load Zakat al-Fitr information</p>
              <button
                onClick={loadZakatAlFitr}
                className="text-[#1B5E20] font-medium hover:underline text-sm"
              >
                Try again
              </button>
            </div>
          )}
        </>
      ) : tab === 'references' ? (
        <>
          {/* Scholarly Sources */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-800">
            <p className="font-semibold mb-1">📚 Scholarly Sources</p>
            <p>All zakat calculations are based on established Islamic jurisprudence from multiple madhabs (schools of thought) and contemporary scholarly research.</p>
          </div>

          {loadingReferences ? (
            <div className="flex justify-center py-12">
              <div role="status" aria-label="Loading scholarly references..." className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : Array.isArray(scholarlyReferences) && scholarlyReferences.length > 0 ? (
            <div className="space-y-4">
              {scholarlyReferences.map((ref, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-lg">📖</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1B5E20] text-sm">{String(ref.ruling ?? '')}</h3>
                      {ref.source ? (
                        <p className="text-xs text-gray-600 mt-1">
                          <strong>Source:</strong> {String(ref.source)}
                        </p>
                      ) : null}
                      {ref.verse ? (
                        <p className="text-xs text-gray-600">
                          <strong>Qur&apos;an:</strong> {String(ref.verse)}
                        </p>
                      ) : null}
                      {ref.hadith ? (
                        <p className="text-xs text-gray-600">
                          <strong>Hadith:</strong> {String(ref.hadith)}
                        </p>
                      ) : null}
                      {ref.opinion ? (
                        <p className="text-xs text-gray-700 mt-2 italic">
                          {String(ref.opinion)}
                        </p>
                      ) : null}
                      {ref.madhabs ? (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Madhabs:</strong> {String(ref.madhabs)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">No scholarly references available.</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-sm text-amber-800">
            <p className="font-semibold mb-2">Disclaimer</p>
            <p>While these references represent established Islamic scholarship, zakat is a complex matter that may vary based on individual circumstances. We strongly recommend consulting with a qualified Islamic scholar (mufti) regarding your specific zakat obligation.</p>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Unknown tab</p>
        </div>
      )}

      {/* Eligibility Checklist Modal */}
      {showChecklist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Zakat Eligibility Checklist</h2>
            <p className="text-sm text-gray-600 mb-4">Before recording your zakat payment, please confirm the following:</p>

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
                  <p className="font-medium text-gray-900 text-sm">My wealth exceeds the nisab threshold</p>
                  <p className="text-xs text-gray-500 mt-0.5">{fmt((data?.totalWealth as number) || 0)} {zakatEligible ? '✓' : '(not yet)'}</p>
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
                  <p className="font-medium text-gray-900 text-sm">I have held this wealth for one full lunar year (Hawl)</p>
                  <p className="text-xs text-gray-500 mt-0.5">Islamic requirement: wealth must be held 12 lunar months</p>
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
                  <p className="font-medium text-gray-900 text-sm">I have deducted all eligible debts from my calculation</p>
                  <p className="text-xs text-gray-500 mt-0.5">Debts reduce your zakatable wealth</p>
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
                  <p className="font-medium text-gray-900 text-sm">I understand this is my religious obligation (Qur'an 9:60)</p>
                  <p className="text-xs text-gray-500 mt-0.5">Zakat is a pillar of Islam — give with sincere intention</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowChecklist(false); setShowForm(false); }} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 font-medium text-sm">Back</button>
              <button
                onClick={() => {
                  setShowChecklist(false);
                  setShowForm(true);
                }}
                disabled={!checklist.wealth || !checklist.hawl || !checklist.debts || !checklist.quranic}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50 font-medium text-sm"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Record Zakat Payment — {lunarYear} AH</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient (optional)</label>
                <input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Local Masjid, Islamic Relief" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Add a comment..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50" disabled={saving}>Cancel</button>
              <button onClick={handleSavePayment} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Record'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Mabrook Dialog */}
      {showMabrook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
            <p className="text-6xl mb-4">🌟</p>
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">Mabrook!</h2>
            <p className="text-xl text-amber-600 font-bold mb-4">مبروك</p>
            <p className="text-gray-600 mb-2">You have fulfilled your Zakat obligation for {lunarYear} AH. May Allah accept it from you and bless your wealth.</p>
            <p className="text-gray-400 italic mb-6">تقبل الله منك</p>
            <button onClick={() => setShowMabrook(false)} className="w-full bg-[#1B5E20] text-white rounded-lg py-3 hover:bg-[#2E7D32] font-medium">Jazakallah Khayran</button>
          </div>
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
