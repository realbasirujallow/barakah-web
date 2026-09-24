'use client';

import { useRef, useState } from 'react';
import { FileUp, ShieldCheck } from 'lucide-react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';

type PreviewRow = {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  externalId?: string;
  selected: boolean;
};

const ACCEPT = '.ofx,.qfx,.mt940,.sta,.xml,.camt,.camt053,.pdf';

export default function StatementFileImport({ onImported }: { onImported?: () => void }) {
  const { currency } = useCurrency();
  const input = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [format, setFormat] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const preview = async (file: File) => {
    setBusy(true); setError(''); setResult('');
    try {
      const data = await api.statementPreview(file);
      setFormat(String(data?.format || '').toUpperCase());
      setRows(((data?.transactions || []) as Omit<PreviewRow, 'selected'>[]).map(r => ({ ...r, selected: true })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'This statement could not be read.');
    } finally { setBusy(false); }
  };

  const importRows = async () => {
    setBusy(true); setError('');
    try {
      const selected = rows.filter(r => r.selected);
      const res = await api.bulkImportTransactions(selected.map(r => ({
        timestamp: new Date(`${r.date}T12:00:00`).getTime(),
        amount: r.amount,
        type: r.type,
        direction: r.type === 'income' ? 'inflow' : 'outflow',
        category: r.type === 'income' ? 'income' : 'other',
        description: r.description.slice(0, 500),
        currency: currency || 'USD',
        externalId: r.externalId || undefined,
      })));
      const imported = Number(res?.imported || 0);
      const failed = Number(res?.failed || 0);
      setResult(`${imported} transaction${imported === 1 ? '' : 's'} imported${failed ? `; ${failed} skipped` : ''}.`);
      if (imported) onImported?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed. Nothing else was changed.');
    } finally { setBusy(false); }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start gap-3">
        <FileUp className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h2 className="font-bold text-gray-900">Import a bank or payment-app statement</h2>
          <p className="text-sm text-gray-500 mt-1">OFX, QFX, MT940, CAMT.053/XML, or a text-based PDF. You review every detected row before anything is saved.</p>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {result && <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{result}</p>}

      {!rows.length && (
        <>
          <input ref={input} type="file" accept={ACCEPT} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) preview(f); }} />
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="mt-5 w-full border-2 border-dashed border-gray-300 rounded-xl py-7 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50">
            {busy ? 'Reading statement…' : 'Choose statement file'}
          </button>
        </>
      )}

      {rows.length > 0 && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-semibold text-gray-800">{format}: {rows.filter(r => r.selected).length} of {rows.length} rows selected</span>
            <button type="button" onClick={() => { setRows([]); setResult(''); }} className="text-primary hover:underline">Choose another file</button>
          </div>
          <div className="max-h-72 overflow-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50"><tr><th className="p-2 text-start">Use</th><th className="p-2 text-start">Date</th><th className="p-2 text-start">Description</th><th className="p-2 text-end">Amount</th></tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={`${r.date}-${i}`} className="border-t border-gray-100">
                  <td className="p-2"><input type="checkbox" checked={r.selected} onChange={e => setRows(prev => prev.map((x, j) => j === i ? { ...x, selected: e.target.checked } : x))} aria-label={`Import ${r.description}`} /></td>
                  <td className="p-2 whitespace-nowrap">{r.date}</td>
                  <td className="p-2 max-w-xs truncate">{r.description}</td>
                  <td className={`p-2 text-end tabular-nums ${r.type === 'income' ? 'text-emerald-700' : 'text-gray-900'}`}>{r.type === 'income' ? '+' : '−'}{Number(r.amount).toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <button type="button" disabled={busy || !rows.some(r => r.selected)} onClick={importRows} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busy ? 'Importing…' : 'Import selected transactions'}</button>
        </div>
      )}

      <div className="mt-4 flex gap-2 text-xs leading-5 text-gray-500"><ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" /><span>Barakah never asks for your bank password. Scanned PDFs are rejected rather than guessed. Re-imported transactions are checked by the existing duplicate safeguards.</span></div>
    </section>
  );
}
