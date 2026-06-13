'use client';

/**
 * 2026-06-12 (parity W2): generic bank-CSV importer with client-side column
 * mapping — web equivalent of mobile's "Map CSV Columns" sheet
 * (transactions_screen.dart). Any bank export works: the user picks which
 * column holds the date / amount / description (+ optional category & type),
 * previews the mapped rows, then imports via POST /api/transactions/bulk-import,
 * which validates per-row and reports failures without rolling back the rest.
 */

import { useRef, useState } from 'react';
import { api } from '../../../lib/api';
import { useI18n } from '../../../lib/i18n';
import { useCurrency } from '../../../lib/useCurrency';
import { FileSpreadsheet, Upload } from 'lucide-react';

const MAX_ROWS = 500; // per-import cap (backend bulk endpoint allows more)
const CHUNK = 100;

type Mapping = { date: number; amount: number; description: number; category: number; type: number };

type MappedRow = {
  timestamp: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  skip: boolean;
  invalid?: string;
};

/** Minimal RFC-4180-ish parser: quoted fields, escaped quotes, CRLF. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(f => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some(f => f.trim() !== '')) rows.push(row);
  return rows;
}

function guessColumn(headers: string[], candidates: string[]): number {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const cand of candidates) {
    const idx = lower.findIndex(h => h === cand);
    if (idx >= 0) return idx;
  }
  for (const cand of candidates) {
    const idx = lower.findIndex(h => h.includes(cand));
    if (idx >= 0) return idx;
  }
  return -1;
}

export function parseAmount(raw: string): number | null {
  // strip currency symbols, thousands separators, spaces; keep - and ()
  let s = raw.replace(/[^0-9.,()-]/g, '').trim();
  if (!s) return null;
  const negative = /^\(.*\)$/.test(s);
  if (negative) s = s.slice(1, -1);
  // if both separators appear, the last one is the decimal point
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
  else s = s.replace(/,/g, '');
  const n = parseFloat(s);
  if (isNaN(n)) return null;
  return negative ? -n : n;
}

type DateOrder = 'mdy' | 'dmy';

/**
 * Parse a CSV date cell to epoch millis, anchored at LOCAL noon so the stored
 * instant's local calendar day equals the day the user sees (matches the
 * manual-add form's convention).
 *
 * Two correctness traps this avoids (both found live, 2026-06-12):
 *  1. ISO `YYYY-MM-DD` must be built from numeric parts, NOT `new Date(s)`:
 *     `new Date('2026-06-12')` is parsed as UTC midnight, and reading it back
 *     with LOCAL getters shifts the day backward for any negative-UTC user.
 *  2. Numeric `d/m/y` is ambiguous — `new Date('03/04/2026')` always assumes
 *     US MM/DD. The order is resolved per-column by `inferDateOrder` and
 *     passed in here, so a UK/EU `03/04/2026` (3 April) isn't read as 4 March.
 */
export function parseDate(raw: string, order: DateOrder): number | null {
  const s = raw.trim();
  if (!s) return null;
  // ISO YYYY-MM-DD (optionally with a time) → build from parts, local noon.
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return new Date(+iso[1], +iso[2] - 1, +iso[3], 12).getTime();
  }
  // Numeric d/m/y or m/d/y with / . - separators.
  const m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (m) {
    const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
    let y = parseInt(m[3], 10);
    if (y < 100) y += 2000;
    // First-part>12 forces dd/mm regardless of the column guess (a value that
    // can only be a day). Otherwise honor the resolved column order.
    const [day, month] = a > 12 ? [a, b] : (order === 'dmy' ? [a, b] : [b, a]);
    const d = new Date(y, month - 1, day, 12);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  // Anything with an explicit month name / timezone — let the engine try, then
  // re-anchor to local noon.
  const native = new Date(s);
  if (!isNaN(native.getTime()) && native.getFullYear() > 1970) {
    return new Date(native.getFullYear(), native.getMonth(), native.getDate(), 12).getTime();
  }
  return null;
}

/**
 * Resolve MM/DD vs DD/MM for a whole date column. If ANY cell has a first part
 * >12 it can only be a day → dd/mm. Else if any second part >12 → mm/dd. Else
 * the column is genuinely ambiguous and we default to the user-chosen order.
 */
export function inferDateOrder(cells: string[], fallback: DateOrder): DateOrder {
  for (const raw of cells) {
    const m = (raw ?? '').trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
    if (!m) continue;
    const a = parseInt(m[1], 10), b = parseInt(m[2], 10);
    if (a > 12) return 'dmy';
    if (b > 12) return 'mdy';
  }
  return fallback;
}

export default function GenericCsvImport({ onImported }: { onImported?: () => void }) {
  const { t, tFmt } = useI18n();
  const { currency: preferredCurrency } = useCurrency();
  const [step, setStep] = useState<'upload' | 'map' | 'done'>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Mapping>({ date: -1, amount: -1, description: -1, category: -1, type: -1 });
  // 2026-06-12: user-selectable ambiguous-date order. 'auto' lets
  // inferDateOrder decide per-column; mdy/dmy force it. Default 'auto'.
  const [dateOrder, setDateOrder] = useState<'auto' | 'mdy' | 'dmy'>('auto');
  // True when the uploaded file had more data rows than MAX_ROWS — surfaced so
  // the user isn't told an import was complete when 700 rows were dropped.
  const [truncatedFrom, setTruncatedFrom] = useState(0);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ imported: number; failed: number; errors?: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    if (!file.name.toLowerCase().endsWith('.csv')) { setError(t('importPleaseUploadCsv')); return; }
    if (file.size > 2 * 1024 * 1024) { setError(t('genericCsvTooLarge')); return; }
    const text = await file.text();
    const parsed = parseCsv(text);
    if (parsed.length < 2) { setError(t('genericCsvEmpty')); return; }
    const hdr = parsed[0].map(h => h.trim());
    const totalData = parsed.length - 1;
    const body = parsed.slice(1, MAX_ROWS + 1);
    setTruncatedFrom(totalData > MAX_ROWS ? totalData : 0);
    setHeaders(hdr);
    setRows(body);
    setDateOrder('auto');
    setMapping({
      date: guessColumn(hdr, ['date', 'transaction date', 'posted date', 'datetime', 'time']),
      amount: guessColumn(hdr, ['amount', 'value', 'debit', 'transaction amount', 'amount (usd)']),
      description: guessColumn(hdr, ['description', 'merchant', 'name', 'memo', 'payee', 'details', 'narrative']),
      category: guessColumn(hdr, ['category']),
      type: guessColumn(hdr, ['type', 'transaction type', 'credit/debit', 'dr/cr']),
    });
    setStep('map');
  };

  // Resolve MM/DD vs DD/MM once for the whole date column. 'auto' infers from
  // the data; an explicit pick wins. Default fallback is mdy (US) only when the
  // column is genuinely ambiguous (no cell disambiguates).
  const resolvedOrder: DateOrder =
    dateOrder === 'auto'
      ? (mapping.date >= 0
          ? inferDateOrder(rows.map(r => r[mapping.date] ?? ''), 'mdy')
          : 'mdy')
      : dateOrder;

  const mapped: MappedRow[] = step === 'map'
    ? rows.map((r) => {
        const ts = mapping.date >= 0 ? parseDate(r[mapping.date] ?? '', resolvedOrder) : null;
        const amt = mapping.amount >= 0 ? parseAmount(r[mapping.amount] ?? '') : null;
        const desc = mapping.description >= 0 ? (r[mapping.description] ?? '').trim() : '';
        const typeRaw = mapping.type >= 0 ? (r[mapping.type] ?? '').toLowerCase() : '';
        const isIncome = typeRaw
          ? /credit|income|deposit|cr\b/.test(typeRaw)
          : (amt ?? 0) > 0;
        const category = mapping.category >= 0 && (r[mapping.category] ?? '').trim()
          ? (r[mapping.category] ?? '').trim().toLowerCase()
          : (isIncome ? 'income' : 'other');
        let invalid: string | undefined;
        if (ts === null) invalid = t('genericCsvBadDate');
        else if (amt === null || amt === 0) invalid = t('genericCsvBadAmount');
        else if (!desc) invalid = t('genericCsvBadDescription');
        return {
          timestamp: ts ?? 0,
          amount: Math.abs(amt ?? 0),
          type: isIncome ? 'income' : 'expense',
          category,
          description: desc || '—',
          skip: Boolean(invalid),
          invalid,
        };
      })
    : [];

  const validCount = mapped.filter(r => !r.invalid).length;
  const ready = mapping.date >= 0 && mapping.amount >= 0 && mapping.description >= 0 && validCount > 0;

  const runImport = async () => {
    setImporting(true);
    setError('');
    setProgress(0);
    try {
      const payloadRows = mapped.filter(r => !r.invalid).map(r => ({
        type: r.type,
        direction: r.type === 'income' ? 'inflow' : 'outflow',
        category: r.category,
        amount: r.amount,
        // Stamp the user's preferred currency so non-USD users' imports aren't
        // silently coerced to USD by the backend default (which then drops them
        // from same-currency KPIs). A generic bank CSV carries no currency, so
        // the user's base currency is the only safe assumption.
        currency: preferredCurrency || 'USD',
        description: r.description.slice(0, 500),
        timestamp: r.timestamp,
      }));
      let imported = 0, failed = 0;
      const errors: string[] = [];
      for (let i = 0; i < payloadRows.length; i += CHUNK) {
        const chunk = payloadRows.slice(i, i + CHUNK);
        const res = await api.bulkImportTransactions(chunk);
        imported += res?.imported ?? 0;
        failed += res?.failed ?? 0;
        if (Array.isArray(res?.errors)) errors.push(...res.errors.slice(0, 20 - errors.length));
        setProgress(Math.min(i + CHUNK, payloadRows.length));
        // A mid-run failure (e.g. 402 plan cap, 429 rate limit) stops further
        // chunks, but we KEEP and report everything imported so far rather than
        // discarding partial success.
        if (res?.error) { setError(res.error); break; }
      }
      setResult({ imported, failed, errors: errors.length ? errors : undefined });
      setStep('done');
      onImported?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('importImportFailed'));
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setStep('upload'); setHeaders([]); setRows([]); setResult(null); setError('');
    setProgress(0); setTruncatedFrom(0); setDateOrder('auto');
  };

  const colSelect = (key: keyof Mapping, required: boolean) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {t(`genericCsvCol_${key}`)}{required ? ' *' : ''}
      </label>
      <select
        value={mapping[key]}
        onChange={e => setMapping(m => ({ ...m, [key]: Number(e.target.value) }))}
        className="w-full border rounded-lg px-2 py-1.5 text-sm text-gray-900"
      >
        <option value={-1}>{required ? t('genericCsvSelectColumn') : t('genericCsvNotPresent')}</option>
        {headers.map((h, i) => (
          <option key={i} value={i}>{h || `#${i + 1}`}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-1">
        <FileSpreadsheet className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-gray-900">{t('genericCsvTitle')}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">{t('genericCsvSubtitle')}</p>

      {error && <p className="text-sm text-red-600 mb-3" role="alert">{error}</p>}

      {step === 'upload' && (
        <>
          <input ref={fileRef} type="file" accept=".csv" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:border-primary hover:text-primary transition-colors"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm font-medium">{t('genericCsvChooseFile')}</span>
            <span className="text-xs">{tFmt('genericCsvRowCap', [MAX_ROWS])}</span>
          </button>
        </>
      )}

      {step === 'map' && (
        <div className="space-y-4">
          {truncatedFrom > 0 && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3" role="alert">
              {tFmt('genericCsvTruncatedWarn', [MAX_ROWS, truncatedFrom])}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {colSelect('date', true)}
            {colSelect('amount', true)}
            {colSelect('description', true)}
            {colSelect('category', false)}
            {colSelect('type', false)}
          </div>

          {/* Date format — only matters for ambiguous numeric dates. Default
              Auto infers from the column; the user can override if a file is
              all-ambiguous (e.g. every day ≤ 12). */}
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('genericCsvDateFormatLabel')}
            </label>
            <select
              value={dateOrder}
              onChange={e => setDateOrder(e.target.value as 'auto' | 'mdy' | 'dmy')}
              className="w-full border rounded-lg px-2 py-1.5 text-sm text-gray-900"
            >
              <option value="auto">{tFmt('genericCsvDateAuto', [resolvedOrder === 'dmy' ? t('genericCsvDateDMY') : t('genericCsvDateMDY')])}</option>
              <option value="mdy">{t('genericCsvDateMDY')}</option>
              <option value="dmy">{t('genericCsvDateDMY')}</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {tFmt('genericCsvPreviewCount', [validCount, rows.length])}
            {mapped.some(r => r.invalid) && (
              <span className="text-amber-700"> · {tFmt('genericCsvSkippedCount', [mapped.filter(r => r.invalid).length])}</span>
            )}
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-start px-3 py-2 font-medium text-gray-700">{t('genericCsvCol_date')}</th>
                  <th className="text-start px-3 py-2 font-medium text-gray-700">{t('genericCsvCol_description')}</th>
                  <th className="text-start px-3 py-2 font-medium text-gray-700">{t('genericCsvCol_category')}</th>
                  <th className="text-end px-3 py-2 font-medium text-gray-700">{t('genericCsvCol_amount')}</th>
                </tr>
              </thead>
              <tbody>
                {mapped.slice(0, 20).map((r, i) => (
                  <tr key={i} className={r.invalid ? 'bg-red-50 text-gray-400' : 'odd:bg-white even:bg-gray-50'}>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      {r.invalid && mapping.date >= 0 && !r.timestamp
                        ? <span className="text-red-500">{r.invalid}</span>
                        : new Date(r.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-1.5 max-w-[16rem] truncate">{r.description}</td>
                    <td className="px-3 py-1.5 capitalize">{r.category}</td>
                    <td className={`px-3 py-1.5 text-end tabular-nums ${r.type === 'income' ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {r.invalid ? '—' : `${r.type === 'income' ? '+' : '−'}${r.amount.toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">
              {t('txnCancel')}
            </button>
            <button
              onClick={runImport}
              disabled={!ready || importing}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50"
            >
              {importing
                ? tFmt('genericCsvImporting', [progress, validCount])
                : tFmt('genericCsvImportBtn', [validCount])}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && result && (
        <div className="space-y-3">
          <p className="text-sm text-gray-900">
            {tFmt('genericCsvDone', [result.imported])}
            {result.failed > 0 && <span className="text-amber-700"> · {tFmt('genericCsvDoneFailed', [result.failed])}</span>}
          </p>
          {result.errors && (
            <ul className="text-xs text-amber-800 bg-amber-50 rounded-lg p-3 space-y-1 max-h-32 overflow-y-auto">
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <button onClick={reset} className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            {t('genericCsvImportAnother')}
          </button>
        </div>
      )}
    </div>
  );
}
