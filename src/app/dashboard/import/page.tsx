'use client';
import { useState, useRef, DragEvent } from 'react';
import { api } from '../../../lib/api';

/* ── Asset / Debt type options (match the assets + debts pages) ────────────── */
const ASSET_TYPES = [
  { value: 'cash', label: 'Cash' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: '401k', label: '401(k)' },
  { value: 'roth_ira', label: 'Roth IRA' },
  { value: 'ira', label: 'Traditional IRA' },
  { value: 'hsa', label: 'HSA' },
  { value: '529', label: '529 Education' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'gold', label: 'Gold' },
  { value: 'other', label: 'Other' },
];

const DEBT_TYPES = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'conventional_mortgage', label: 'Mortgage' },
  { value: 'car_loan', label: 'Car Loan' },
  { value: 'student_loan', label: 'Student Loan' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'islamic_mortgage', label: 'Islamic Mortgage' },
  { value: 'other', label: 'Other' },
];

interface PreviewAccount {
  accountName: string;
  latestBalance: number;
  latestDate: string;
  recordCount: number;
  suggestedType: string;
  isDebt: boolean;
  skip: boolean;
  // user overrides
  type: string;
}

type Step = 'upload' | 'preview' | 'done';

export default function ImportPage() {
  const [step, setStep] = useState<Step>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<PreviewAccount[]>([]);
  const [meta, setMeta] = useState({ totalAccounts: 0, totalRecords: 0 });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ assetsCreated: number; debtsCreated: number; errors?: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Upload & preview ──────────────────────────────────────────────────── */
  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) { setError('Please upload a CSV file.'); return; }
    setError('');
    setUploading(true);
    try {
      const data = await api.monarchPreview(file);
      if (data.error) { setError(data.error); setUploading(false); return; }
      const parsed: PreviewAccount[] = (data.accounts as PreviewAccount[]).map(a => ({
        ...a,
        type: a.suggestedType,
      }));
      setAccounts(parsed);
      setMeta({ totalAccounts: data.totalAccounts, totalRecords: data.totalRecords });
      setStep('preview');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  /* ── Confirm & execute import ──────────────────────────────────────────── */
  const executeImport = async () => {
    setImporting(true); setError('');
    try {
      const payload = accounts.map(a => ({
        accountName: a.accountName,
        type: a.type,
        isDebt: a.isDebt,
        latestBalance: a.latestBalance,
        skip: a.skip,
      }));
      const data = await api.monarchExecute(payload);
      if (data.error) { setError(data.error); setImporting(false); return; }
      setResult(data);
      setStep('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  const updateAccount = (idx: number, patch: Partial<PreviewAccount>) => {
    setAccounts(prev => prev.map((a, i) => i === idx ? { ...a, ...patch } : a));
  };

  const activeCount = accounts.filter(a => !a.skip).length;
  const assetCount  = accounts.filter(a => !a.skip && !a.isDebt).length;
  const debtCount   = accounts.filter(a => !a.skip && a.isDebt).length;
  const fmt = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1B5E20]">📥 Import Data</h1>
      <p className="text-gray-600">
        Upload a <strong>Balances</strong> CSV export (Monarch Money, Chase, Wells Fargo, Bank of America, etc.) to import your accounts as Barakah assets &amp; debts.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      )}

      {/* ── Step 1: Upload ──────────────────────────────────────────────────── */}
      {step === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition ${
            dragActive ? 'border-[#1B5E20] bg-green-50' : 'border-gray-300 hover:border-[#1B5E20] hover:bg-green-50/50'
          }`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
          {uploading ? (
            <p className="text-gray-500 animate-pulse text-lg">Parsing CSV…</p>
          ) : (
            <>
              <p className="text-5xl mb-4">📄</p>
              <p className="text-lg font-medium text-gray-700">Drag &amp; drop your <code>Balances</code> CSV here</p>
              <p className="text-gray-400 mt-2">or click to browse</p>
            </>
          )}
        </div>
      )}

      {/* ── Step 2: Preview & map ──────────────────────────────────────────── */}
      {step === 'preview' && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Balance Records" value={meta.totalRecords.toLocaleString()} />
            <Stat label="Accounts Found" value={String(meta.totalAccounts)} />
            <Stat label="Assets" value={String(assetCount)} color="text-green-700" />
            <Stat label="Debts" value={String(debtCount)} color="text-red-600" />
          </div>

          {/* Toggle all skip */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{activeCount} of {accounts.length} accounts selected</span>
            <button
              onClick={() => setAccounts(prev => prev.map(a => ({ ...a, skip: false })))}
              className="text-[#1B5E20] hover:underline"
            >Select all</button>
            <button
              onClick={() => setAccounts(prev => prev.map(a => ({ ...a, skip: true })))}
              className="text-red-600 hover:underline"
            >Deselect all</button>
          </div>

          {/* Accounts table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 w-10">Import</th>
                  <th className="p-3">Account</th>
                  <th className="p-3 text-right">Latest Balance</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a, i) => (
                  <tr key={i} className={`border-t ${a.skip ? 'opacity-40' : ''}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={!a.skip}
                        onChange={() => updateAccount(i, { skip: !a.skip })}
                        className="accent-[#1B5E20] w-4 h-4"
                      />
                    </td>
                    <td className="p-3 font-medium max-w-xs truncate" title={a.accountName}>
                      {a.accountName}
                    </td>
                    <td className={`p-3 text-right font-mono ${a.isDebt ? 'text-red-600' : 'text-green-700'}`}>
                      {fmt(a.latestBalance)}
                    </td>
                    <td className="p-3 text-gray-500">{a.latestDate}</td>
                    <td className="p-3">
                      <select
                        value={a.isDebt ? 'debt' : 'asset'}
                        disabled={a.skip}
                        onChange={e => {
                          const isDebt = e.target.value === 'debt';
                          updateAccount(i, {
                            isDebt,
                            type: isDebt ? 'other' : 'other',
                          });
                        }}
                        className="px-2 py-1 border rounded text-sm bg-white"
                      >
                        <option value="asset">Asset</option>
                        <option value="debt">Debt</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={a.type}
                        disabled={a.skip}
                        onChange={e => updateAccount(i, { type: e.target.value })}
                        className="px-2 py-1 border rounded text-sm bg-white"
                      >
                        {(a.isDebt ? DEBT_TYPES : ASSET_TYPES).map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => { setStep('upload'); setAccounts([]); setError(''); }}
              className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={executeImport}
              disabled={importing || activeCount === 0}
              className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2"
            >
              {importing ? (
                <span className="animate-pulse">Importing…</span>
              ) : (
                <>Import {activeCount} Account{activeCount !== 1 ? 's' : ''}</>
              )}
            </button>
          </div>
        </>
      )}

      {/* ── Step 3: Done ───────────────────────────────────────────────────── */}
      {step === 'done' && result && (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center space-y-4">
          <p className="text-5xl">🎉</p>
          <h2 className="text-xl font-bold text-[#1B5E20]">Import Complete!</h2>
          <div className="flex justify-center gap-8 text-lg">
            <span className="text-green-700">{result.assetsCreated} asset{result.assetsCreated !== 1 ? 's' : ''}</span>
            <span className="text-red-600">{result.debtsCreated} debt{result.debtsCreated !== 1 ? 's' : ''}</span>
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-sm text-red-700">
              <p className="font-semibold mb-1">Some accounts failed:</p>
              <ul className="list-disc list-inside">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          <div className="flex justify-center gap-4 pt-4">
            <a href="/dashboard/assets" className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-green-800">
              View Assets
            </a>
            <a href="/dashboard/debts" className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">
              View Debts
            </a>
            <button
              onClick={() => { setStep('upload'); setAccounts([]); setResult(null); setError(''); }}
              className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Import Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tiny stat card component ──────────────────────────────────────────────── */
function Stat({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
