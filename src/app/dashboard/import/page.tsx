'use client';
import { useState, useRef, useEffect, useCallback, DragEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';
import { api } from '../../../lib/api';
import { clearPendingPlaidLinkToken, savePendingPlaidLinkToken } from '../../../lib/plaid';
import { useCurrency } from '../../../lib/useCurrency';

/* -- Asset / Debt type options (match the assets + debts pages) ------------ */
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

interface ExistingAccount {
  id: number;
  name: string;
  type: string;
  value?: number;
  remainingAmount?: number;
}

interface SuggestedMatch {
  id: number;
  name: string;
  type: string;
  value?: number;
  remainingAmount?: number;
  score: number;
}

interface PreviewAccount {
  accountName: string;
  latestBalance: number;
  latestDate: string;
  recordCount: number;
  suggestedType: string;
  isDebt: boolean;
  skip: boolean;
  suggestedMatch?: SuggestedMatch | null;
  type: string;
  action: 'create' | 'update';
  existingId: number | null;
}

interface PreviewTransaction {
  date: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  notes: string;
  skip: boolean;
}

type CsvFormat = 'balances' | 'transactions';
type Step = 'upload' | 'preview' | 'done';

interface PlaidAccount {
  id: number;
  institutionName: string;
  accountName: string;
  officialName?: string;
  accountMask: string;
  accountType: string;
  accountSubtype?: string;
  accountRole?: string;
  currentBalance: number | null;
  availableBalance: number | null;
  currencyCode: string;
  lastSyncedAt: number | null;
}

interface SubscriptionStatus {
  plan: 'free' | 'plus' | 'family';
  status: string;
  hasSubscription: boolean;
}

interface BalancesResult {
  format: 'balances';
  assetsCreated: number;
  assetsUpdated: number;
  debtsCreated: number;
  debtsUpdated: number;
  investmentAccountsCreated: number;
  transactionsCreated: number;
  errors?: string[];
}

interface DeltaStats {
  derivedTransactionCount: number;
  derivedIncomeCount: number;
  derivedExpenseCount: number;
  derivedTotalIncome: number;
  derivedTotalExpense: number;
}

interface TransactionsResult {
  format: 'transactions';
  transactionsCreated: number;
  skipped: number;
  errors?: string[];
}

type ImportResult = BalancesResult | TransactionsResult;

function formatPlaidBalance(value: number | null | undefined, currencyCode = 'USD') {
  if (value == null || Number.isNaN(Number(value))) return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(value);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
}

export default function ImportPage() {
  const { fmt } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('upload');
  const [csvFormat, setCsvFormat] = useState<CsvFormat>('balances');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<PreviewAccount[]>([]);
  const [existingAssets, setExistingAssets] = useState<ExistingAccount[]>([]);
  const [existingDebts, setExistingDebts] = useState<ExistingAccount[]>([]);
  const [meta, setMeta] = useState({ totalAccounts: 0, totalRecords: 0 });
  const [transactions, setTransactions] = useState<PreviewTransaction[]>([]);
  const [txnMeta, setTxnMeta] = useState({
    totalTransactions: 0, incomeCount: 0, expenseCount: 0,
    totalIncome: 0, totalExpense: 0,
  });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [generateTransactions, setGenerateTransactions] = useState(false);

  // ── Plaid Bank Linking ──────────────────────────────────────────────────
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [plaidAccounts, setPlaidAccounts] = useState<PlaidAccount[]>([]);
  const [plaidSyncing, setPlaidSyncing] = useState<number | null>(null);
  const [plaidMessage, setPlaidMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const loadPlaidAccounts = useCallback(async () => {
    try {
      const data = await api.plaidGetAccounts();
      setPlaidAccounts(data?.accounts || []);
    } catch { /* silent */ }
  }, []);

  const loadSubscriptionStatus = useCallback(async () => {
    try {
      const data = await api.subscriptionStatus();
      setSubscriptionStatus(data as SubscriptionStatus);
    } catch {
      setSubscriptionStatus({ plan: 'free', status: 'inactive', hasSubscription: false });
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaidAccounts();
    loadSubscriptionStatus();
  }, [loadPlaidAccounts, loadSubscriptionStatus]);

  useEffect(() => {
    const plaidStatus = searchParams.get('plaid');
    const rawMessage = searchParams.get('message');
    if (!plaidStatus) return;

    if (plaidStatus === 'linked') {
      setPlaidMessage(rawMessage || 'Bank linked successfully. Balances now appear in Assets or Debts, and synced activity shows in Transactions.');
      loadPlaidAccounts();
    } else if (plaidStatus === 'error') {
      setError(rawMessage || 'Plaid authentication did not complete.');
    }

    router.replace('/dashboard/import');
  }, [loadPlaidAccounts, router, searchParams]);

  const [plaidLoading, setPlaidLoading] = useState(false);
  const plaidAccess = Boolean(
    subscriptionStatus?.hasSubscription
      || subscriptionStatus?.plan === 'plus'
      || subscriptionStatus?.plan === 'family',
  );

  const handlePlaidConnect = async () => {
    if (!plaidAccess) {
      setError('Plaid bank sync is available on Plus and Family. Upgrade to connect new accounts.');
      return;
    }
    setPlaidLoading(true);
    setError('');
    try {
      const data = await api.plaidCreateLinkToken();
      if (data?.linkToken) {
        savePendingPlaidLinkToken(data.linkToken);
        setPlaidLinkToken(data.linkToken);
      } else {
        setError('Failed to get link token from Plaid');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize bank linking');
    } finally {
      setPlaidLoading(false);
    }
  };

  const onPlaidSuccess = useCallback(async (publicToken: string, metadata: { institution: { name: string; institution_id: string } | null }) => {
    try {
      const result = await api.plaidExchangeToken(publicToken, metadata?.institution?.name);
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setPlaidLoading(false);
      const imported = Number(result?.transactionsImported || 0);
      setPlaidMessage(
        imported > 0
          ? `Bank linked and ${imported} transaction(s) imported. Balances now appear in Assets or Debts, and activity shows in Transactions.`
          : 'Bank linked successfully. Balances now appear in Assets or Debts, and you can sync again anytime from here.',
      );
      await loadPlaidAccounts();
    } catch (err) {
      setPlaidLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to link bank');
    }
  }, [loadPlaidAccounts]);

  const onPlaidExit = useCallback((exitError: { display_message?: string | null } | null) => {
    clearPendingPlaidLinkToken();
    setPlaidLinkToken(null);
    setPlaidLoading(false);
    if (exitError?.display_message) {
      setError(exitError.display_message);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: plaidLinkToken ?? '',
    onSuccess: onPlaidSuccess,
    onExit: onPlaidExit,
  });

  useEffect(() => {
    if (!plaidLinkToken || !ready) return;
    open();
  }, [open, plaidLinkToken, ready]);

  const handlePlaidSync = async (accountId: number) => {
    setPlaidSyncing(accountId);
    setPlaidMessage('');
    try {
      const result = await api.plaidSync(accountId);
      setPlaidMessage(`Imported ${result?.added || 0} new transaction(s)`);
      loadPlaidAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setPlaidSyncing(null);
    }
  };

  const handlePlaidUnlink = async (accountId: number) => {
    if (!confirm('Unlink this bank account? Your imported transactions will remain.')) return;
    try {
      await api.plaidUnlinkAccount(accountId);
      loadPlaidAccounts();
      setPlaidMessage('Account unlinked');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlink');
    }
  };
  const [deltaStats, setDeltaStats] = useState<DeltaStats>({
    derivedTransactionCount: 0, derivedIncomeCount: 0, derivedExpenseCount: 0,
    derivedTotalIncome: 0, derivedTotalExpense: 0,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) { setError('Please upload a CSV file.'); return; }
    setError('');
    setUploading(true);
    try {
      const data = await api.monarchPreview(file);
      if (data.error) { setError(data.error); setUploading(false); return; }

      const format: CsvFormat = data.format === 'transactions' ? 'transactions' : 'balances';
      setCsvFormat(format);

      if (format === 'transactions') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed: PreviewTransaction[] = (data.transactions || []).map((t: any) => ({ ...t, skip: false }));
        setTransactions(parsed);
        setTxnMeta({
          totalTransactions: data.totalTransactions || 0,
          incomeCount: data.incomeCount || 0,
          expenseCount: data.expenseCount || 0,
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
        });
      } else {
        const assets: ExistingAccount[] = data.existingAssets || [];
        const debts: ExistingAccount[] = data.existingDebts || [];
        setExistingAssets(assets);
        setExistingDebts(debts);
        const parsed: PreviewAccount[] = (Array.isArray(data.accounts) ? data.accounts as PreviewAccount[] : []).map(a => ({
          ...a,
          type: a.suggestedType,
          action: a.suggestedMatch ? 'update' as const : 'create' as const,
          existingId: a.suggestedMatch?.id ?? null,
        }));
        setAccounts(parsed);
        setMeta({ totalAccounts: data.totalAccounts, totalRecords: data.totalRecords });
        setDeltaStats({
          derivedTransactionCount: data.derivedTransactionCount || 0,
          derivedIncomeCount: data.derivedIncomeCount || 0,
          derivedExpenseCount: data.derivedExpenseCount || 0,
          derivedTotalIncome: data.derivedTotalIncome || 0,
          derivedTotalExpense: data.derivedTotalExpense || 0,
        });
      }
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

  const executeImport = async () => {
    setImporting(true); setError('');
    try {
      let payload: Record<string, unknown>;
      if (csvFormat === 'transactions') {
        payload = {
          format: 'transactions',
          transactions: transactions.map(t => ({
            date: t.date, merchant: t.merchant, category: t.category,
            account: t.account, amount: t.amount, notes: t.notes, skip: t.skip,
          })),
        };
      } else {
        payload = {
          format: 'balances',
          accounts: accounts.map(a => ({
            accountName: a.accountName, type: a.type, isDebt: a.isDebt,
            latestBalance: a.latestBalance, skip: a.skip,
            action: a.action, existingId: a.existingId,
          })),
          generateTransactions,
        };
      }
      const data = await api.monarchExecuteChunked(payload);
      if (data.error) { setError(data.error); setImporting(false); return; }
      setResult(data as ImportResult);
      setStep('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const updateAccount = (idx: number, patch: Partial<PreviewAccount>) => {
    setAccounts(prev => prev.map((a, i) => i === idx ? { ...a, ...patch } : a));
  };

  const updateTransaction = (idx: number, patch: Partial<PreviewTransaction>) => {
    setTransactions(prev => prev.map((t, i) => i === idx ? { ...t, ...patch } : t));
  };

  const activeCount = accounts.filter(a => !a.skip).length;
  const assetCount  = accounts.filter(a => !a.skip && !a.isDebt).length;
  const debtCount   = accounts.filter(a => !a.skip && a.isDebt).length;
  const updateCount = accounts.filter(a => !a.skip && a.action === 'update').length;
  const createCount = accounts.filter(a => !a.skip && a.action === 'create').length;
  const activeTxnCount = transactions.filter(t => !t.skip).length;

  const resetAll = () => {
    setStep('upload'); setCsvFormat('balances');
    setAccounts([]); setTransactions([]); setResult(null); setError('');
    setGenerateTransactions(false);
    setDeltaStats({ derivedTransactionCount: 0, derivedIncomeCount: 0, derivedExpenseCount: 0, derivedTotalIncome: 0, derivedTotalExpense: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1B5E20]">Import Data</h1>

      {/* ── Plaid Bank Linking ──────────────────────────────────────────── */}
      <div className="bg-white border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1B5E20]">Connect Your Bank</h2>
            <p className="text-sm text-gray-500">Automatically import balances and transactions from supported institutions.</p>
          </div>
          {statusLoading ? (
            <button
              disabled
              className="bg-gray-200 text-gray-500 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed"
            >
              Checking access...
            </button>
          ) : plaidAccess ? (
            <button
              onClick={handlePlaidConnect}
              disabled={plaidLoading}
              className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition text-sm disabled:opacity-50"
            >
              {plaidLoading ? 'Opening Plaid...' : '+ Link Bank Account'}
            </button>
          ) : (
            <Link
              href="/dashboard/billing"
              className="border border-[#1B5E20] text-[#1B5E20] px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition text-sm"
            >
              Upgrade for Plaid
            </Link>
          )}
        </div>

        {!statusLoading && !plaidAccess && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 mb-4 text-sm">
            Plaid bank sync is available on <strong>Plus</strong> and <strong>Family</strong>. Upgrade to connect new accounts and keep syncing them. If you already linked an account during a trial, you can still view or unlink it below.
          </div>
        )}

        {plaidMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{plaidMessage}</div>
        )}

        {plaidAccounts.length > 0 ? (
          <div className="space-y-3">
                    {plaidAccounts.map(acct => (
                      <div key={acct.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div>
                          <p className="font-semibold text-gray-900">{acct.institutionName}</p>
                          <p className="text-sm text-gray-500">
                            {(acct.officialName || acct.accountName)} {acct.accountMask ? `••${acct.accountMask}` : ''} · {acct.accountType}{acct.accountSubtype ? `/${acct.accountSubtype}` : ''}
                          </p>
                          {acct.accountRole && (
                            <p className="text-xs text-emerald-700 mt-1 font-medium capitalize">
                              Appears as a linked {acct.accountRole === 'debt' ? 'debt' : 'asset'} inside Barakah
                            </p>
                          )}
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            Current balance {formatPlaidBalance(acct.currentBalance, acct.currencyCode) ?? 'Unavailable'}
                          </p>
                          {acct.availableBalance != null && (
                            <p className="text-xs text-gray-500">
                              Available {formatPlaidBalance(acct.availableBalance, acct.currencyCode)}
                            </p>
                          )}
                          {acct.lastSyncedAt && (
                            <p className="text-xs text-gray-400">Last synced: {new Date(acct.lastSyncedAt).toLocaleDateString()}</p>
                          )}
                        </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlaidSync(acct.id)}
                    disabled={plaidSyncing === acct.id || !plaidAccess}
                    className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2E7D32] transition disabled:opacity-50"
                  >
                    {plaidSyncing === acct.id ? 'Syncing...' : plaidAccess ? 'Sync' : 'Upgrade to Sync'}
                  </button>
                  <button
                    onClick={() => handlePlaidUnlink(acct.id)}
                    className="border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                  >
                    Unlink
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No bank accounts linked yet. Click &quot;Link Bank Account&quot; to get started.</p>
        )}
      </div>

      {/* ── CSV Import ─────────────────────────────────────────────────── */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Or Import via CSV</h2>
        <p className="text-gray-600 text-sm mb-4">
          Upload a <strong>CSV export</strong> from your bank or budgeting app (Monarch Money, YNAB, Mint, and others).
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      )}

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
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} aria-label="Upload CSV file" />
          {uploading ? (
            <p className="text-gray-500 animate-pulse text-lg">Detecting format &amp; parsing CSV...</p>
          ) : (
            <>
              <p className="text-5xl mb-4">&#128196;</p>
              <p className="text-lg font-medium text-gray-700">Drag &amp; drop your CSV here</p>
              <p className="text-gray-400 mt-2">or click to browse</p>
              <p className="text-gray-400 text-sm mt-3">
                Supports: Balances CSV (accounts &amp; net worth) · Transactions CSV (income &amp; expenses)
              </p>
              <p className="text-gray-400 text-xs mt-1">Compatible with Monarch Money, YNAB, Mint, and bank statement exports</p>
            </>
          )}
        </div>
      )}

      {step === 'preview' && csvFormat === 'balances' && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            Detected <strong>Balances</strong> CSV &mdash; This will import your accounts as assets, debts &amp; investment accounts.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Stat label="Balance Records" value={meta.totalRecords.toLocaleString()} />
            <Stat label="Accounts Found" value={String(meta.totalAccounts)} />
            <Stat label="Assets" value={String(assetCount)} color="text-green-700" />
            <Stat label="Debts" value={String(debtCount)} color="text-red-600" />
            {updateCount > 0 && <Stat label="Updates" value={String(updateCount)} color="text-blue-600" />}
          </div>

          {deltaStats.derivedTransactionCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateTransactions}
                  onChange={() => setGenerateTransactions(prev => !prev)}
                  className="accent-[#1B5E20] w-5 h-5"
                />
                <div>
                  <span className="text-sm font-medium text-amber-900">
                    Also estimate transactions from daily balance changes
                  </span>
                  <p className="text-xs text-amber-700 mt-0.5">
                    ⚠️ These are <strong>estimated</strong> — not real transactions. Only enable if you don&apos;t have a separate Transactions CSV. Real transactions imported from a Transactions CSV are always more accurate.
                  </p>
                </div>
              </label>
              {generateTransactions && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 ml-8">
                  <Stat label="Transactions" value={deltaStats.derivedTransactionCount.toLocaleString()} />
                  <Stat label="Income" value={String(deltaStats.derivedIncomeCount)} color="text-green-700" />
                  <Stat label="Expenses" value={String(deltaStats.derivedExpenseCount)} color="text-red-600" />
                  <Stat label="Net Flow" value={fmt(deltaStats.derivedTotalIncome - deltaStats.derivedTotalExpense)} color={deltaStats.derivedTotalIncome >= deltaStats.derivedTotalExpense ? 'text-green-700' : 'text-red-600'} />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{activeCount} of {accounts.length} accounts selected</span>
            {updateCount > 0 && (
              <span className="text-blue-600 font-medium">({updateCount} updating existing, {createCount} new)</span>
            )}
            <button onClick={() => setAccounts(prev => prev.map(a => ({ ...a, skip: false })))} className="text-[#1B5E20] hover:underline">Select all</button>
            <button onClick={() => setAccounts(prev => prev.map(a => ({ ...a, skip: true })))} className="text-red-600 hover:underline">Deselect all</button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 w-10">Import</th>
                  <th className="p-3">Account</th>
                  <th className="p-3 text-right">Latest Balance</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a, i) => {
                  const existingList = a.isDebt ? existingDebts : existingAssets;
                  const matchedExisting = a.action === 'update' && a.existingId
                    ? existingList.find(e => e.id === a.existingId) : null;
                  return (
                    <tr key={i} className={`border-t ${a.skip ? 'opacity-40' : ''}`}>
                      <td className="p-3">
                        <input type="checkbox" checked={!a.skip} onChange={() => updateAccount(i, { skip: !a.skip })} className="accent-[#1B5E20] w-4 h-4" aria-label={`Import ${a.accountName}`} />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="font-medium truncate" title={a.accountName}>{a.accountName}</div>
                        {matchedExisting && (
                          <div className="text-xs text-blue-600 mt-0.5">Merging with: {matchedExisting.name} ({fmt(matchedExisting.value ?? matchedExisting.remainingAmount ?? 0)})</div>
                        )}
                      </td>
                      <td className={`p-3 text-right font-mono ${a.isDebt ? 'text-red-600' : 'text-green-700'}`}>{fmt(a.latestBalance)}</td>
                      <td className="p-3">
                        <select value={a.isDebt ? 'debt' : 'asset'} disabled={a.skip} aria-label="Category"
                          onChange={e => { const isDebt = e.target.value === 'debt'; updateAccount(i, { isDebt, type: 'other', action: 'create', existingId: null }); }}
                          className="px-2 py-1 border rounded text-sm bg-white">
                          <option value="asset">Asset</option>
                          <option value="debt">Debt</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select value={a.type} disabled={a.skip} onChange={e => updateAccount(i, { type: e.target.value })} className="px-2 py-1 border rounded text-sm bg-white" aria-label="Type">
                          {(a.isDebt ? DEBT_TYPES : ASSET_TYPES).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          value={a.action === 'update' && a.existingId ? `update-${a.existingId}` : 'create'} disabled={a.skip} aria-label="Action"
                          onChange={e => { const val = e.target.value; if (val === 'create') { updateAccount(i, { action: 'create', existingId: null }); } else { updateAccount(i, { action: 'update', existingId: parseInt(val.replace('update-', '')) }); } }}
                          className={`px-2 py-1 border rounded text-sm bg-white ${a.action === 'update' ? 'border-blue-400 text-blue-700' : ''}`}>
                          <option value="create">+ Create New</option>
                          {existingList.length > 0 && (
                            <optgroup label="Update Existing">
                              {existingList.map(ex => <option key={ex.id} value={`update-${ex.id}`}>Update: {ex.name} ({fmt(ex.value ?? ex.remainingAmount ?? 0)})</option>)}
                            </optgroup>
                          )}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 justify-end">
            <button onClick={resetAll} className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={executeImport} disabled={importing || activeCount === 0}
              className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2">
              {importing ? <span className="animate-pulse">Importing...</span> : <>Import {activeCount} Account{activeCount !== 1 ? 's' : ''}</>}
            </button>
          </div>
        </>
      )}

      {step === 'preview' && csvFormat === 'transactions' && (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
            Detected <strong>Transactions</strong> CSV &mdash; This will import your income &amp; expense records.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Stat label="Transactions" value={String(txnMeta.totalTransactions)} />
            <Stat label="Income" value={String(txnMeta.incomeCount)} color="text-green-700" />
            <Stat label="Expenses" value={String(txnMeta.expenseCount)} color="text-red-600" />
            <Stat label="Total Income" value={fmt(txnMeta.totalIncome)} color="text-green-700" />
            <Stat label="Total Expenses" value={fmt(txnMeta.totalExpense)} color="text-red-600" />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{activeTxnCount} of {transactions.length} transactions selected</span>
            <button onClick={() => setTransactions(prev => prev.map(t => ({ ...t, skip: false })))} className="text-[#1B5E20] hover:underline">Select all</button>
            <button onClick={() => setTransactions(prev => prev.map(t => ({ ...t, skip: true })))} className="text-red-600 hover:underline">Deselect all</button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 w-10">Import</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Merchant</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Account</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 200).map((t, i) => (
                  <tr key={i} className={`border-t ${t.skip ? 'opacity-40' : ''}`}>
                    <td className="p-3">
                      <input type="checkbox" checked={!t.skip} onChange={() => updateTransaction(i, { skip: !t.skip })} className="accent-[#1B5E20] w-4 h-4" aria-label={`Import transaction ${t.merchant || t.category}`} />
                    </td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{t.date}</td>
                    <td className="p-3 max-w-xs">
                      <div className="font-medium truncate" title={t.merchant}>{t.merchant || '\u2014'}</div>
                      {t.notes && <div className="text-xs text-gray-400 truncate">{t.notes}</div>}
                    </td>
                    <td className="p-3 text-gray-600">{t.category}</td>
                    <td className="p-3 text-gray-500 text-xs truncate max-w-[150px]" title={t.account}>{t.account}</td>
                    <td className={`p-3 text-right font-mono ${t.amount >= 0 ? 'text-green-700' : 'text-red-600'}`}>{fmt(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length > 200 && (
              <div className="p-3 text-center text-gray-400 text-sm border-t">
                Showing first 200 of {transactions.length} transactions. All will be imported.
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button onClick={resetAll} className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={executeImport} disabled={importing || activeTxnCount === 0}
              className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2">
              {importing ? <span className="animate-pulse">Importing...</span> : <>Import {activeTxnCount} Transaction{activeTxnCount !== 1 ? 's' : ''}</>}
            </button>
          </div>
        </>
      )}

      {step === 'done' && result && (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center space-y-4">
          <p className="text-5xl">&#127881;</p>
          <h2 className="text-xl font-bold text-[#1B5E20]">Import Complete!</h2>

          {result.format === 'balances' && (() => { const r = result as BalancesResult; return (
            <div className="flex justify-center gap-6 text-lg flex-wrap">
              {r.assetsCreated > 0 && <span className="text-green-700">{r.assetsCreated} asset{r.assetsCreated !== 1 ? 's' : ''} created</span>}
              {r.assetsUpdated > 0 && <span className="text-blue-600">{r.assetsUpdated} asset{r.assetsUpdated !== 1 ? 's' : ''} updated</span>}
              {r.debtsCreated > 0 && <span className="text-red-600">{r.debtsCreated} debt{r.debtsCreated !== 1 ? 's' : ''} created</span>}
              {r.debtsUpdated > 0 && <span className="text-orange-600">{r.debtsUpdated} debt{r.debtsUpdated !== 1 ? 's' : ''} updated</span>}
              {r.investmentAccountsCreated > 0 && <span className="text-purple-600">{r.investmentAccountsCreated} investment account{r.investmentAccountsCreated !== 1 ? 's' : ''} created</span>}
              {r.transactionsCreated > 0 && <span className="text-indigo-600">{r.transactionsCreated} transaction{r.transactionsCreated !== 1 ? 's' : ''} generated</span>}
              {r.assetsCreated === 0 && r.assetsUpdated === 0 && r.debtsCreated === 0 && r.debtsUpdated === 0 && r.transactionsCreated === 0 && <span className="text-gray-500">No changes made</span>}
            </div>
          ); })()}

          {result.format === 'transactions' && (() => { const r = result as TransactionsResult; return (
            <div className="flex justify-center gap-6 text-lg flex-wrap">
              {r.transactionsCreated > 0 && <span className="text-green-700">{r.transactionsCreated} transaction{r.transactionsCreated !== 1 ? 's' : ''} imported</span>}
              {r.skipped > 0 && <span className="text-gray-500">{r.skipped} skipped</span>}
              {r.transactionsCreated === 0 && <span className="text-gray-500">No transactions imported</span>}
            </div>
          ); })()}

          {result.errors && result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-sm text-red-700">
              <p className="font-semibold mb-1">Some items failed:</p>
              <ul className="list-disc list-inside">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4 flex-wrap">
            {result.format === 'balances' && (
              <>
                <a href="/dashboard/assets" className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-green-800">View Assets</a>
                <a href="/dashboard/debts" className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">View Debts</a>
                {(result as BalancesResult).investmentAccountsCreated > 0 && (
                  <a href="/dashboard/investments" className="px-5 py-2.5 border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50">View Investments</a>
                )}
                {(result as BalancesResult).transactionsCreated > 0 && (
                  <a href="/dashboard/transactions" className="px-5 py-2.5 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50">View Transactions</a>
                )}
              </>
            )}
            {result.format === 'transactions' && (
              <a href="/dashboard/transactions" className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-green-800">View Transactions</a>
            )}
            <button onClick={resetAll} className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">Import Another</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
