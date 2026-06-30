'use client';
import { Suspense, useState, useRef, useEffect, useCallback, DragEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  clearPendingPlaidLinkToken,
  getPlaidUiErrorMessage,
  savePendingPlaidLinkToken,
} from '../../../lib/plaid';
import { hasPaidSyncAccess } from '../../../lib/subscription';
import { safeDate } from '../../../lib/format';
import { useCurrency } from '../../../lib/useCurrency';
import { trackFirstAccountLink, trackOnce } from '../../../lib/analytics';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import GenericCsvImport from './GenericCsvImport';
import { useI18n, t as tStandalone } from '../../../lib/i18n';

/* -- Asset / Debt type options (match the assets + debts pages) ------------ */
const ASSET_TYPES: ReadonlyArray<{ value: string; labelKey: string }> = [
  { value: 'cash', labelKey: 'importAssetTypeCash' },
  { value: 'savings', labelKey: 'importAssetTypeSavings' },
  { value: 'investment', labelKey: 'importAssetTypeInvestment' },
  { value: 'real_estate', labelKey: 'importAssetTypeRealEstate' },
  { value: 'vehicle', labelKey: 'importAssetTypeVehicle' },
  { value: '401k', labelKey: 'importAssetType401k' },
  { value: 'roth_ira', labelKey: 'importAssetTypeRothIra' },
  { value: 'ira', labelKey: 'importAssetTypeIra' },
  { value: 'hsa', labelKey: 'importAssetTypeHsa' },
  { value: '529', labelKey: 'importAssetType529' },
  { value: 'crypto', labelKey: 'importAssetTypeCrypto' },
  { value: 'gold', labelKey: 'importAssetTypeGold' },
  { value: 'other', labelKey: 'importAssetTypeOther' },
];

const DEBT_TYPES: ReadonlyArray<{ value: string; labelKey: string }> = [
  { value: 'credit_card', labelKey: 'importDebtTypeCreditCard' },
  { value: 'conventional_mortgage', labelKey: 'importDebtTypeMortgage' },
  { value: 'car_loan', labelKey: 'importDebtTypeCarLoan' },
  { value: 'student_loan', labelKey: 'importDebtTypeStudentLoan' },
  { value: 'personal_loan', labelKey: 'importDebtTypePersonalLoan' },
  { value: 'islamic_mortgage', labelKey: 'importDebtTypeIslamicMortgage' },
  { value: 'other', labelKey: 'importDebtTypeOther' },
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
  syncStatus?: 'idle' | 'syncing' | 'error' | null;
  lastSyncError?: string | null;
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
  // Rows that were already in Barakah (dedup) and therefore not re-imported.
  // Surfaced so a re-import of the same CSV reads "N already in Barakah" instead
  // of the misleading "No transactions imported".
  duplicatesSkipped?: number;
  errors?: string[];
}

type ImportResult = BalancesResult | TransactionsResult;

function formatPlaidBalance(value: number | null | undefined, currencyCode = 'USD') {
  if (value == null || Number.isNaN(Number(value))) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
}

function ImportPageInner() {
  const { fmt, locale: dateLocale } = useCurrency();
  const { t, tFmt } = useI18n();
  const { user } = useAuth();
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
    totalIncome: 0, totalExpense: 0, skippedMalformed: 0,
  });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [generateTransactions, setGenerateTransactions] = useState(false);

  // ── Plaid Bank Linking ──────────────────────────────────────────────────
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [plaidAccounts, setPlaidAccounts] = useState<PlaidAccount[]>([]);
  const [plaidSyncing, setPlaidSyncing] = useState<number | null>(null);
  const [plaidSyncingAll, setPlaidSyncingAll] = useState(false);
  const [plaidMessage, setPlaidMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadPlaidAccounts = useCallback(async () => {
    try {
      const data = await api.plaidGetAccounts();
      if (!mountedRef.current) return;
      setPlaidAccounts(data?.accounts || []);
    } catch { /* silent */ }
  }, []);

  const loadSubscriptionStatus = useCallback(async () => {
    try {
      const data = await api.subscriptionStatus();
      if (!mountedRef.current) return;
      setSubscriptionStatus(data as SubscriptionStatus);
    } catch {
      // Retry once after a short delay — the first call can fail during token refresh.
      if (!mountedRef.current) return;
      try {
        await new Promise(r => setTimeout(r, 2000));
        if (!mountedRef.current) return;
        const data = await api.subscriptionStatus();
        if (!mountedRef.current) return;
        setSubscriptionStatus(data as SubscriptionStatus);
      } catch {
        if (!mountedRef.current) return;
        setSubscriptionStatus({ plan: 'free', status: 'inactive', hasSubscription: false });
      }
    } finally {
      if (mountedRef.current) setStatusLoading(false);
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
      setPlaidMessage(rawMessage || t('importPlaidLinkedDefault'));
      loadPlaidAccounts();
    } else if (plaidStatus === 'error') {
      setError(rawMessage || t('importPlaidAuthIncomplete'));
    }

    router.replace('/dashboard/import');
    // `t` is a fresh identity each render; including it would refire this effect
    // (which calls loadPlaidAccounts) on every render. The plaid-status branches
    // read `t` lazily and the effect no-ops without a `?plaid` param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPlaidAccounts, router, searchParams]);

  const [plaidLoading, setPlaidLoading] = useState(false);
  const plaidAccess = hasPaidSyncAccess(subscriptionStatus)
    || (user?.plan === 'plus' || user?.plan === 'family');

  const handlePlaidConnect = async () => {
    if (statusLoading) return;
    if (!plaidAccess) {
      setError(t('importPlaidNotPaid'));
      return;
    }
    clearPendingPlaidLinkToken();
    setPlaidLinkToken(null);
    setPlaidLoading(true);
    setError('');
    setPlaidMessage('');
    try {
      let countryHint: string | undefined;
      const storedCountry = (user?.country ?? '').trim().toUpperCase();
      if (!storedCountry) {
        const picked = await promptForCountry();
        if (!picked) {
          setPlaidLoading(false);
          return; // user cancelled
        }
        countryHint = picked;
      }
      const data = await api.plaidCreateLinkToken(countryHint);
      if (data?.linkToken) {
        savePendingPlaidLinkToken(data.linkToken);
        setPlaidLinkToken(data.linkToken);
      } else {
        throw new Error(t('importLinkTokenFailed'));
      }
    } catch (err) {
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setError(getPlaidUiErrorMessage(err, 'start'));
    } finally {
      setPlaidLoading(false);
    }
  };

  function promptForCountry(): Promise<string | null> {
    return new Promise((resolve) => {
      const supported = 'US, CA, GB, FR, IE, ES, NL, DE, IT, PT, BE, DK, NO, SE, EE, LT, LV, PL, AU';
      const answer = window.prompt(
        tStandalone('importCountryPromptFmt').replace('{0}', supported),
        '',
      );
      if (answer === null) {
        resolve(null);
        return;
      }
      const cleaned = answer.trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(cleaned)) {
        window.alert(tStandalone('importInvalidCountry'));
        resolve(null);
        return;
      }
      resolve(cleaned);
    });
  }

  const onPlaidSuccess = useCallback(async (publicToken: string, metadata: { institution: { name: string; institution_id: string } | null }) => {
    try {
      const result = await api.plaidExchangeToken(publicToken, metadata?.institution?.name);
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setPlaidLoading(false);
      try {
        trackOnce('first_account_link', () =>
          trackFirstAccountLink(metadata?.institution?.name || 'unknown'));
      } catch { /* GA4 unavailable */ }
      const imported = Number(result?.transactionsImported || 0);
      setPlaidMessage(
        imported > 0
          ? tFmt('importPlaidLinkedImportedFmt', [imported])
          : t('importPlaidLinkedNoneDefault'),
      );
      await loadPlaidAccounts();
    } catch (err) {
      clearPendingPlaidLinkToken();
      setPlaidLinkToken(null);
      setPlaidLoading(false);
      setError(getPlaidUiErrorMessage(err, 'exchange'));
    }
  }, [loadPlaidAccounts, t, tFmt]);

  const onPlaidExit = useCallback((exitError: { display_message?: string | null } | null) => {
    clearPendingPlaidLinkToken();
    setPlaidLinkToken(null);
    setPlaidLoading(false);
    if (exitError?.display_message) {
      setError(exitError.display_message);
    } else if (exitError) {
      setError(getPlaidUiErrorMessage(exitError, 'start'));
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
      setPlaidMessage(tFmt('importImportedTxnCountFmt', [result?.added || 0]));
      loadPlaidAccounts();
    } catch (err) {
      setError(getPlaidUiErrorMessage(err, 'sync'));
    } finally {
      setPlaidSyncing(null);
    }
  };

  const handlePlaidSyncAll = async () => {
    if (!plaidAccess || plaidAccounts.length === 0) return;
    setPlaidSyncingAll(true);
    setPlaidMessage('');
    setError('');
    try {
      // SYNC-1: sync-all is async (202 + background job). Kick it off, then
      // poll for completion instead of holding a request open past the 30s
      // client timeout (which surfaced a false error for multi-account users).
      await api.plaidSyncAll();
      const POLL_INTERVAL_MS = 3000;
      const MAX_POLLS = 40;
      let settled = false;
      for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        let status: { status?: string; totalAdded?: number } | null = null;
        try {
          status = (await api.plaidSyncAllStatus()) as {
            status?: string;
            totalAdded?: number;
          } | null;
        } catch {
          continue;
        }
        const state = status?.status;
        if (state === 'done' || state === 'idle') {
          const total = status?.totalAdded ?? 0;
          setPlaidMessage(
            total > 0
              ? tFmt('importSyncedAllFmt', [total])
              : t('importSyncedAllNone')
          );
          loadPlaidAccounts();
          settled = true;
          break;
        }
        if (state === 'failed') {
          setError(getPlaidUiErrorMessage(null, 'sync'));
          settled = true;
          break;
        }
      }
      if (!settled) {
        setPlaidMessage(t('importSyncedAllNone'));
        loadPlaidAccounts();
      }
    } catch (err) {
      setError(getPlaidUiErrorMessage(err, 'sync'));
    } finally {
      setPlaidSyncingAll(false);
    }
  };

  const handlePlaidUnlink = async (accountId: number) => {
    if (!confirm(t('importUnlinkConfirm'))) return;
    try {
      await api.plaidUnlinkAccount(accountId);
      loadPlaidAccounts();
      setPlaidMessage(t('importAccountUnlinked'));
    } catch (err) {
      setError(getPlaidUiErrorMessage(err, 'unlink'));
    }
  };
  const [deltaStats, setDeltaStats] = useState<DeltaStats>({
    derivedTransactionCount: 0, derivedIncomeCount: 0, derivedExpenseCount: 0,
    derivedTotalIncome: 0, derivedTotalExpense: 0,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) { setError(t('importPleaseUploadCsv')); return; }
    setError('');
    setUploading(true);
    try {
      const data = await api.monarchPreview(file);
      if (data?.error) { setError(data.error); setUploading(false); return; }

      const format: CsvFormat = data.format === 'transactions' ? 'transactions' : 'balances';
      setCsvFormat(format);

      if (format === 'transactions') {
        const parsed: PreviewTransaction[] = ((data.transactions || []) as Partial<PreviewTransaction>[]).map((t) => ({
          date: '',
          merchant: '',
          category: '',
          account: '',
          amount: 0,
          notes: '',
          ...t,
          skip: false,
        }));
        setTransactions(parsed);
        setTxnMeta({
          totalTransactions: data.totalTransactions || 0,
          incomeCount: data.incomeCount || 0,
          expenseCount: data.expenseCount || 0,
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
          skippedMalformed: data.skippedMalformed || 0,
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
      setError(e instanceof Error ? e.message : t('importUploadFailed'));
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
      if (data?.error) { setError(data.error); setImporting(false); return; }
      setResult(data as ImportResult);
      setStep('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('importImportFailed'));
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
      <PageHeader
        title={t('importTitle')}
        subtitle={t('importSubtitle')}
        className="mb-0"
      />

      {/* ── Plaid Bank Linking ──────────────────────────────────────────── */}
      <div className="bg-white border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-primary">{t('importConnectBankTitle')}</h2>
            <p className="text-sm text-gray-500">{t('importConnectBankSubtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            {plaidAccounts.length > 1 && plaidAccess && (
              <button
                onClick={handlePlaidSyncAll}
                disabled={plaidSyncingAll || plaidSyncing !== null}
                className="border border-primary text-primary px-4 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition text-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {plaidSyncingAll ? (
                  <><span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-green-700 border-t-transparent rounded-full" />{t('importSyncingAll')}</>
                ) : (
                  <>{t('importSyncAll')}</>
                )}
              </button>
            )}
            {statusLoading ? (
              <button
                disabled
                className="bg-gray-200 text-gray-500 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed"
              >
                {t('importCheckingAccess')}
              </button>
            ) : plaidAccess ? (
              <button
                onClick={handlePlaidConnect}
                disabled={plaidLoading}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition text-sm disabled:opacity-50"
              >
                {plaidLoading ? t('importOpeningPlaid') : t('importLinkBankAccount')}
              </button>
            ) : (
              <Link
                href="/dashboard/billing"
                className="border border-primary text-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition text-sm"
              >
                {t('importUpgradeForPlaid')}
              </Link>
            )}
          </div>
        </div>

        {!statusLoading && !plaidAccess && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-4">
            <h3 className="text-lg font-bold text-primary mb-2">{t('importUpgradePromptTitle')}</h3>
            <p className="text-sm text-gray-600 mb-3">
              {t('importUpgradePromptDesc')}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">&#10003;</span> {t('importBenefitSync')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">&#10003;</span> {t('importBenefitTxn')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">&#10003;</span> {t('importBenefitBills')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-600">&#10003;</span> {t('importBenefitSubs')}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/billing"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
              >
                {t('importViewPlansUpgrade')}
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-3">{t('importTrialNote')}</p>
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
                              {acct.accountRole === 'debt' ? t('importAcctRoleDebt') : t('importAcctRoleAsset')}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            {tFmt('importAcctCurrentBalanceFmt', [formatPlaidBalance(acct.currentBalance, acct.currencyCode) ?? t('importAcctUnavailable')])}
                          </p>
                          {acct.availableBalance != null && (
                            <p className="text-xs text-gray-500">
                              {tFmt('importAcctAvailableFmt', [formatPlaidBalance(acct.availableBalance, acct.currencyCode) ?? ''])}
                            </p>
                          )}
                          {/* Per-account sync status indicator (Monarch parity) */}
                          {acct.syncStatus === 'syncing' ? (
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                              <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                              {t('importAcctSyncing')}
                            </p>
                          ) : acct.syncStatus === 'error' ? (
                            <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-0.5 mt-1 inline-block">
                              {t('importAcctSyncErrorPrefix')}{acct.lastSyncError || t('importAcctSyncErrorFallback')}
                            </p>
                          ) : (() => {
                            const d = safeDate(acct.lastSyncedAt);
                            return d ? (
                              <p className="text-xs text-gray-400">{tFmt('importAcctSyncedRelFmt', [d.toLocaleDateString(dateLocale)])}</p>
                            ) : null;
                          })()}
                        </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlaidSync(acct.id)}
                    disabled={plaidSyncing === acct.id || plaidSyncingAll || !plaidAccess}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {plaidSyncing === acct.id ? t('importSyncing') : plaidAccess ? t('importSync') : t('importUpgradeToSync')}
                  </button>
                  <button
                    onClick={() => handlePlaidUnlink(acct.id)}
                    className="border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                  >
                    {t('importUnlink')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">{t('importNoAccountsLinked')}</p>
        )}
      </div>

      {/* ── CSV Import ─────────────────────────────────────────────────── */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">{t('importOrCsv')}</h2>
        <p className="text-gray-600 text-sm mb-4">
          {t('importCsvUploadHelp')}
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
            dragActive ? 'border-primary bg-green-50' : 'border-gray-300 hover:border-primary hover:bg-green-50/50'
          }`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} aria-label={t('importAriaUploadCsv')} />
          {uploading ? (
            <p className="text-gray-500 animate-pulse text-lg">{t('importDetectingCsv')}</p>
          ) : (
            <>
              <p className="text-5xl mb-4">&#128196;</p>
              <p className="text-lg font-medium text-gray-700">{t('importDragDropCsv')}</p>
              <p className="text-gray-400 mt-2">{t('importOrClickBrowse')}</p>
              <p className="text-gray-400 text-sm mt-3">
                {t('importSupportsLine')}
              </p>
              <p className="text-gray-400 text-xs mt-1">{t('importCompatibleLine')}</p>
            </>
          )}
        </div>
      )}

      {/* 2026-06-12 (parity W2): generic any-bank CSV importer with column
          mapping — web equivalent of mobile's "Map CSV Columns" sheet. Shown
          alongside the Monarch dropzone (only while it's idle, so the two
          flows never stack mid-import). */}
      {step === 'upload' && <GenericCsvImport />}

      {step === 'preview' && csvFormat === 'balances' && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            {t('importDetectedBalances')}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Stat label={t('importBalanceRecords')} value={meta.totalRecords.toLocaleString()} />
            <Stat label={t('importAccountsFound')} value={String(meta.totalAccounts)} />
            <Stat label={t('importAssetsLabel')} value={String(assetCount)} color="text-green-700" />
            <Stat label={t('importDebtsLabel')} value={String(debtCount)} color="text-red-600" />
            {updateCount > 0 && <Stat label={t('importUpdatesLabel')} value={String(updateCount)} color="text-blue-600" />}
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
                    {t('importEstimateTxnLabel')}
                  </span>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {t('importEstimateTxnHelp')}
                  </p>
                </div>
              </label>
              {generateTransactions && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 ml-8">
                  <Stat label={t('importTransactionsLabel')} value={deltaStats.derivedTransactionCount.toLocaleString()} />
                  <Stat label={t('importIncomeLabel')} value={String(deltaStats.derivedIncomeCount)} color="text-green-700" />
                  <Stat label={t('importExpensesLabel')} value={String(deltaStats.derivedExpenseCount)} color="text-red-600" />
                  <Stat label={t('importNetFlowLabel')} value={fmt(deltaStats.derivedTotalIncome - deltaStats.derivedTotalExpense)} color={deltaStats.derivedTotalIncome >= deltaStats.derivedTotalExpense ? 'text-green-700' : 'text-red-600'} />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{tFmt('importSelectedAccountsFmt', [activeCount, accounts.length])}</span>
            {updateCount > 0 && (
              <span className="text-blue-600 font-medium">{tFmt('importUpdatingNewCountFmt', [updateCount, createCount])}</span>
            )}
            <button onClick={() => setAccounts(prev => prev.map(a => ({ ...a, skip: false })))} className="text-primary hover:underline">{t('importSelectAll')}</button>
            <button onClick={() => setAccounts(prev => prev.map(a => ({ ...a, skip: true })))} className="text-red-600 hover:underline">{t('importDeselectAll')}</button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 w-10">{t('importColImport')}</th>
                  <th className="p-3">{t('importColAccount')}</th>
                  <th className="p-3 text-right">{t('importColLatestBalance')}</th>
                  <th className="p-3">{t('importColCategory')}</th>
                  <th className="p-3">{t('importColType')}</th>
                  <th className="p-3">{t('importColAction')}</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a, i) => {
                  const existingList = a.isDebt ? existingDebts : existingAssets;
                  const matchedExisting = a.action === 'update' && a.existingId
                    ? existingList.find(e => e.id === a.existingId) : null;
                  return (
                    <tr key={`${a.accountName}-${a.type}-${a.latestBalance}-${i}`} className={`border-t ${a.skip ? 'opacity-40' : ''}`}>
                      <td className="p-3">
                        <input type="checkbox" checked={!a.skip} onChange={() => updateAccount(i, { skip: !a.skip })} className="accent-[#1B5E20] w-4 h-4" aria-label={tFmt('importAriaImportAccountFmt', [a.accountName])} />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="font-medium truncate" title={a.accountName}>{a.accountName}</div>
                        {matchedExisting && (
                          <div className="text-xs text-blue-600 mt-0.5">{tFmt('importMergingFmt', [matchedExisting.name, fmt(matchedExisting.value ?? matchedExisting.remainingAmount ?? 0)])}</div>
                        )}
                      </td>
                      <td className={`p-3 text-right font-mono ${a.isDebt ? 'text-red-600' : 'text-green-700'}`}>{fmt(a.latestBalance)}</td>
                      <td className="p-3">
                        <select value={a.isDebt ? 'debt' : 'asset'} disabled={a.skip} aria-label={t('importColCategory')}
                          onChange={e => { const isDebt = e.target.value === 'debt'; updateAccount(i, { isDebt, type: 'other', action: 'create', existingId: null }); }}
                          className="px-2 py-1 border rounded text-sm bg-white">
                          <option value="asset">{t('importCatAsset')}</option>
                          <option value="debt">{t('importCatDebt')}</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select value={a.type} disabled={a.skip} onChange={e => updateAccount(i, { type: e.target.value })} className="px-2 py-1 border rounded text-sm bg-white" aria-label={t('importColType')}>
                          {(a.isDebt ? DEBT_TYPES : ASSET_TYPES).map(typ => <option key={typ.value} value={typ.value}>{t(typ.labelKey)}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          value={a.action === 'update' && a.existingId ? `update-${a.existingId}` : 'create'} disabled={a.skip} aria-label={t('importColAction')}
                          onChange={e => { const val = e.target.value; if (val === 'create') { updateAccount(i, { action: 'create', existingId: null }); } else { updateAccount(i, { action: 'update', existingId: parseInt(val.replace('update-', '')) }); } }}
                          className={`px-2 py-1 border rounded text-sm bg-white ${a.action === 'update' ? 'border-blue-400 text-blue-700' : ''}`}>
                          <option value="create">{t('importActionCreateNew')}</option>
                          {existingList.length > 0 && (
                            <optgroup label={t('importActionUpdateExisting')}>
                              {existingList.map(ex => <option key={ex.id} value={`update-${ex.id}`}>{tFmt('importActionUpdateFmt', [ex.name, fmt(ex.value ?? ex.remainingAmount ?? 0)])}</option>)}
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
            <button onClick={resetAll} className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50">{t('importCancel')}</button>
            <button onClick={executeImport} disabled={importing || activeCount === 0}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2">
              {importing ? <span className="animate-pulse">{t('importImporting')}</span> : <>{tFmt('importImportNAccountsFmt', [activeCount, activeCount !== 1 ? 's' : ''])}</>}
            </button>
          </div>
        </>
      )}

      {step === 'preview' && csvFormat === 'transactions' && (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
            {t('importDetectedTransactions')}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Stat label={t('importTransactionsLabel')} value={String(txnMeta.totalTransactions)} />
            <Stat label={t('importIncomeLabel')} value={String(txnMeta.incomeCount)} color="text-green-700" />
            <Stat label={t('importExpensesLabel')} value={String(txnMeta.expenseCount)} color="text-red-600" />
            <Stat label={t('importTotalIncomeLabel')} value={fmt(txnMeta.totalIncome)} color="text-green-700" />
            <Stat label={t('importTotalExpensesLabel')} value={fmt(txnMeta.totalExpense)} color="text-red-600" />
          </div>

          {txnMeta.skippedMalformed > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm" role="alert">
              {tFmt('importMalformedSkippedFmt', [txnMeta.skippedMalformed])}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{tFmt('importSelectedTxnFmt', [activeTxnCount, transactions.length])}</span>
            <button onClick={() => setTransactions(prev => prev.map(t => ({ ...t, skip: false })))} className="text-primary hover:underline">{t('importSelectAll')}</button>
            <button onClick={() => setTransactions(prev => prev.map(t => ({ ...t, skip: true })))} className="text-red-600 hover:underline">{t('importDeselectAll')}</button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 w-10">{t('importColImport')}</th>
                  <th className="p-3">{t('importColDate')}</th>
                  <th className="p-3">{t('importColMerchant')}</th>
                  <th className="p-3">{t('importColCategory')}</th>
                  <th className="p-3">{t('importColAccount')}</th>
                  <th className="p-3 text-right">{t('importColAmount')}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 200).map((txn, i) => (
                  <tr key={`${txn.date}-${txn.merchant}-${txn.amount}-${i}`} className={`border-t ${txn.skip ? 'opacity-40' : ''}`}>
                    <td className="p-3">
                      <input type="checkbox" checked={!txn.skip} onChange={() => updateTransaction(i, { skip: !txn.skip })} className="accent-[#1B5E20] w-4 h-4" aria-label={tFmt('importAriaImportTxnFmt', [txn.merchant || txn.category])} />
                    </td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{txn.date}</td>
                    <td className="p-3 max-w-xs">
                      <div className="font-medium truncate" title={txn.merchant}>{txn.merchant || '—'}</div>
                      {txn.notes && <div className="text-xs text-gray-400 truncate">{txn.notes}</div>}
                    </td>
                    <td className="p-3 text-gray-600">{txn.category}</td>
                    <td className="p-3 text-gray-500 text-xs truncate max-w-[150px]" title={txn.account}>{txn.account}</td>
                    <td className={`p-3 text-right font-mono ${txn.amount >= 0 ? 'text-green-700' : 'text-red-600'}`}>{fmt(txn.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length > 200 && (
              <div className="p-3 text-center text-gray-400 text-sm border-t">
                {tFmt('importTxnRowsCapFmt', [transactions.length])}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button onClick={resetAll} className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50">{t('importCancel')}</button>
            <button onClick={executeImport} disabled={importing || activeTxnCount === 0}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2">
              {importing ? <span className="animate-pulse">{t('importImporting')}</span> : <>{tFmt('importImportNTxnFmt', [activeTxnCount, activeTxnCount !== 1 ? 's' : ''])}</>}
            </button>
          </div>
        </>
      )}

      {step === 'done' && result && (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center space-y-4">
          <p className="text-5xl">&#127881;</p>
          <h2 className="text-xl font-bold text-primary">{t('importImportComplete')}</h2>

          {result.format === 'balances' && (() => { const r = result as BalancesResult; return (
            <div className="flex justify-center gap-6 text-lg flex-wrap">
              {r.assetsCreated > 0 && <span className="text-green-700">{tFmt('importAssetsCreatedFmt', [r.assetsCreated, r.assetsCreated !== 1 ? 's' : ''])}</span>}
              {r.assetsUpdated > 0 && <span className="text-blue-600">{tFmt('importAssetsUpdatedFmt', [r.assetsUpdated, r.assetsUpdated !== 1 ? 's' : ''])}</span>}
              {r.debtsCreated > 0 && <span className="text-red-600">{tFmt('importDebtsCreatedFmt', [r.debtsCreated, r.debtsCreated !== 1 ? 's' : ''])}</span>}
              {r.debtsUpdated > 0 && <span className="text-orange-600">{tFmt('importDebtsUpdatedFmt', [r.debtsUpdated, r.debtsUpdated !== 1 ? 's' : ''])}</span>}
              {r.investmentAccountsCreated > 0 && <span className="text-purple-600">{tFmt('importInvestmentsCreatedFmt', [r.investmentAccountsCreated, r.investmentAccountsCreated !== 1 ? 's' : ''])}</span>}
              {r.transactionsCreated > 0 && <span className="text-indigo-600">{tFmt('importTransactionsGeneratedFmt', [r.transactionsCreated, r.transactionsCreated !== 1 ? 's' : ''])}</span>}
              {r.assetsCreated === 0 && r.assetsUpdated === 0 && r.debtsCreated === 0 && r.debtsUpdated === 0 && r.transactionsCreated === 0 && <span className="text-gray-500">{t('importNoChanges')}</span>}
            </div>
          ); })()}

          {result.format === 'transactions' && (() => {
            const r = result as TransactionsResult;
            const dupes = r.duplicatesSkipped ?? 0;
            return (
            <div className="flex justify-center gap-6 text-lg flex-wrap">
              {r.transactionsCreated > 0 && <span className="text-green-700">{tFmt('importTransactionsImportedFmt', [r.transactionsCreated, r.transactionsCreated !== 1 ? 's' : ''])}</span>}
              {r.skipped > 0 && <span className="text-gray-500">{tFmt('importSkippedFmt', [r.skipped])}</span>}
              {dupes > 0 && <span className="text-gray-500">{tFmt('importDuplicatesSkippedFmt', [dupes])}</span>}
              {txnMeta.skippedMalformed > 0 && <span className="text-amber-600">{tFmt('importMalformedSkippedFmt', [txnMeta.skippedMalformed])}</span>}
              {r.transactionsCreated === 0 && dupes === 0 && <span className="text-gray-500">{t('importNoTxnImported')}</span>}
            </div>
          ); })()}

          {result.errors && result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-sm text-red-700">
              <p className="font-semibold mb-1">{t('importSomeFailed')}</p>
              <ul className="list-disc list-inside">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4 flex-wrap">
            {result.format === 'balances' && (
              <>
                <Link href="/dashboard/assets" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-green-800">{t('importViewAssets')}</Link>
                <Link href="/dashboard/debts" className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">{t('importViewDebts')}</Link>
                {(result as BalancesResult).investmentAccountsCreated > 0 && (
                  <Link href="/dashboard/investments" className="px-5 py-2.5 border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50">{t('importViewInvestments')}</Link>
                )}
                {(result as BalancesResult).transactionsCreated > 0 && (
                  <Link href="/dashboard/transactions" className="px-5 py-2.5 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50">{t('importViewTransactions')}</Link>
                )}
              </>
            )}
            {result.format === 'transactions' && (
              <Link href="/dashboard/transactions" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-green-800">{t('importViewTransactions')}</Link>
            )}
            <button onClick={resetAll} className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">{t('importImportAnother')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImportPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse text-gray-400">{tStandalone('importLoading')}</div>}>
      <ImportPageInner />
    </Suspense>
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
