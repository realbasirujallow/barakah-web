'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { logError } from '../../../lib/logError';
import { safeParse, validateAsset } from '../../../lib/schemas';
import { hasPaidSyncAccess } from '../../../lib/subscription';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../lib/toast';
import { SyncBanksButton } from '../../../components/SyncBanksButton';
import { PageHeader } from '../../../components/dashboard/PageHeader';

interface Asset {
  id: number;
  name: string;
  type: string;
  value: number;
  penaltyRate?: number;
  taxRate?: number;
  address?: string;
  linkedSource?: string | null;
  linkedAccountId?: number | null;
  institutionName?: string | null;
  accountMask?: string | null;
  accountSubtype?: string | null;
  currency?: string | null;
  readOnly?: boolean;
  lastSyncedAt?: number | null;
  notes?: string | null;
}

interface AssetFormState {
  name: string; type: string; value: string;
  penaltyRate: string; taxRate: string; address: string;
}

interface SubscriptionStatus {
  plan: 'free' | 'plus' | 'family';
  status: string;
  hasSubscription: boolean;
}

const TYPE_GROUPS: Record<string, { value: string; label: string }[]> = {
  '💵 Cash & Savings': [
    { value: 'cash', label: 'Cash' },
    { value: 'savings_account', label: 'Savings Account' },
    { value: 'checking_account', label: 'Checking Account' },
  ],
  '🏠 Real Estate': [
    { value: 'primary_home', label: 'Primary Home' },
    { value: 'investment_property', label: 'Investment Property (Rental)' },
    { value: 'investment_property_resale', label: 'Investment Property (For Resale)' },
    { value: 'rental_property', label: 'Rental Property' },
  ],
  '📈 Investments': [
    { value: 'stock', label: 'Stocks / ETFs' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'business', label: 'Business' },
    { value: 'individual_brokerage', label: 'Individual Brokerage Account' },
  ],
  '🏦 Retirement': [
    { value: '401k', label: '401(k)' },
    { value: 'roth_ira', label: 'Roth IRA' },
    { value: 'ira', label: 'Traditional IRA' },
    { value: 'hsa', label: 'HSA' },
    { value: '403b', label: '403(b)' },
    { value: 'pension', label: 'Pension' },
  ],
  '🎓 Education': [
    { value: '529', label: '529 Plan' },
  ],
  '🥇 Precious Metals': [
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
  ],
  '🚗 Other': [
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'other', label: 'Other' },
  ],
};

const INVESTMENT_ASSET_TYPES = ['stock', 'crypto', 'individual_brokerage', 'etf', '401k', 'roth_ira', 'ira', '403b', 'pension', 'hsa', '529'];

const RETIREMENT_TYPES = ["401k","retirement_401k","ira","roth_ira","pension","retirement","403b","tsp","sep_ira","hsa"];
const EDUCATION_TYPES = ["529","529_plan","education_savings"];
const PENALTY_TAX_TYPES = [...RETIREMENT_TYPES, ...EDUCATION_TYPES];
const IRA_TYPES = ["ira"];
// Investment types: show capital gains tax rate field only (no early withdrawal penalty)
const INVESTMENT_TYPES = ["stock","individual_brokerage","crypto","etf"];
const ADDRESS_TYPES = ["primary_home","investment_property","investment_property_resale","rental_property","business"];

const EMPTY_FORM: AssetFormState = { name: '', type: 'cash', value: '', penaltyRate: '', taxRate: '', address: '' };

export default function AssetsPage() {
  const { fmt, currency } = useCurrency();
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Asset | null>(null);
  const [form, setForm] = useState<AssetFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  const load = () => {
    setLoading(true);
    setLoadError(null);
    Promise.allSettled([api.getAssets(), api.getAssetTotal(), api.subscriptionStatus()])
      .then((results) => {
        const aRaw = results[0].status === 'fulfilled' ? results[0].value : null;
        const tRaw = results[1].status === 'fulfilled' ? results[1].value : null;
        const subscriptionRaw = results[2].status === 'fulfilled' ? results[2].value : null;

        setSubscriptionStatus(
          subscriptionRaw
            ? (subscriptionRaw as SubscriptionStatus)
            : { plan: 'free', status: 'inactive', hasSubscription: false },
        );

        if (aRaw?.error) {
          logError(new Error(aRaw.error), { context: 'Asset API error' });
          setLoadError(aRaw.error as string);
          return;
        }
        if (tRaw?.error) {
          logError(new Error(tRaw.error), { context: 'Asset total API error' });
          setLoadError(tRaw.error as string);
          return;
        }

        // Validate each asset
        const assetList = Array.isArray(aRaw?.assets) ? aRaw.assets : Array.isArray(aRaw) ? aRaw : [];
        const validatedAssets: Asset[] = [];
        for (const item of assetList) {
          const itemId = typeof item === 'object' && item !== null && 'id' in item
            ? String((item as { id?: unknown }).id ?? 'unknown')
            : 'unknown';
          const result = safeParse(validateAsset, item, `asset/${itemId}`);
          if (result) {
            validatedAssets.push(result as Asset);
          } else {
            console.warn(`Skipped invalid asset (id=${itemId})`);
          }
        }

        setAssets(validatedAssets);
        setTotal(tRaw);
      })
      .catch((err) => {
        logError(err, { context: 'Failed to load assets' });
        setLoadError(err?.message || 'Failed to load assets. Please refresh.');
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const deletableAssets = assets.filter(asset => !asset.readOnly);
  const hasLinkedPlaidAssets = assets.some(asset => asset.linkedSource === 'plaid' || asset.readOnly);
  const { user } = useAuth();
  const plaidSyncAccess = hasPaidSyncAccess(subscriptionStatus) || (user?.plan === 'plus' || user?.plan === 'family');

  const typeLabel = (t: string) => {
    for (const items of Object.values(TYPE_GROUPS)) {
      const found = items.find(i => i.value === t);
      if (found) return found.label;
    }
    return t.replace(/_/g, ' ');
  };

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setSaveError(null); setShowForm(true); };
  const openEdit = (a: Asset) => {
    if (a.readOnly) return;
    setEditItem(a);
    setForm({
      name: a.name, type: a.type, value: String(a.value),
      penaltyRate: a.penaltyRate != null ? String(a.penaltyRate) : '',
      taxRate: a.taxRate != null ? String(a.taxRate) : '',
      address: a.address || '',
    });
    setSaveError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const val = parseFloat(form.value);
      // Validate asset value: must be finite, non-negative, and reasonable
      if (!Number.isFinite(val) || val < 0) {
        setSaveError('Please enter a valid positive number for value.');
        setSaving(false);
        return;
      }
      const MAX_VALUE = 1_000_000_000; // 1 billion max
      if (val > MAX_VALUE) {
        setSaveError(`Asset value cannot exceed ${fmt(MAX_VALUE)}.`);
        setSaving(false);
        return;
      }
      // Check decimal precision (max 2 decimal places for currency)
      if (!/^\d+(\.\d{1,2})?$/.test(form.value.trim())) {
        setSaveError('Please enter a value with up to 2 decimal places.');
        setSaving(false);
        return;
      }

      const data: Record<string, unknown> = {
        name: form.name.trim(), type: form.type, value: val,
        address: form.address?.trim() || null,
      };
      if (PENALTY_TAX_TYPES.includes(form.type)) {
        if (form.penaltyRate) {
          const penaltyVal = parseFloat(form.penaltyRate);
          if (Number.isFinite(penaltyVal) && penaltyVal >= 0 && penaltyVal <= 100) {
            data.penaltyRate = Math.round((penaltyVal / 100) * 10000) / 10000;
          }
        }
        if (form.taxRate) {
          const taxVal = parseFloat(form.taxRate);
          if (Number.isFinite(taxVal) && taxVal >= 0 && taxVal <= 100) {
            data.taxRate = Math.round((taxVal / 100) * 10000) / 10000;
          }
        }
      }
      // Investment types: only capital gains tax (no penalty)
      if (INVESTMENT_TYPES.includes(form.type)) {
        // Send 0 explicitly if blank (resets to default full-value zakat), or user-set rate
        if (form.taxRate) {
          const taxVal = parseFloat(form.taxRate);
          if (Number.isFinite(taxVal) && taxVal >= 0 && taxVal <= 100) {
            data.taxRate = Math.round((taxVal / 100) * 10000) / 10000;
          } else {
            data.taxRate = 0;
          }
        } else {
          data.taxRate = 0;
        }
      }
      let result;
      if (editItem) result = await api.updateAsset(editItem.id, data);
      else result = await api.addAsset(data);
      // Backend returns HTTP 200 even on error — check the body
      if (result?.error) throw new Error(result.error);
      setShowForm(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logError(err, { context: 'Failed to save asset' });
      setSaveError(message || 'Failed to save asset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    const asset = assets.find(item => item.id === id);
    if (asset?.readOnly) {
      toast('Linked Plaid balances are read-only here. Unlink or resync them from Import.', 'error');
      return;
    }
    setConfirmAction({
      message: 'Delete this asset?',
      action: async () => {
        try {
          const result = await api.deleteAsset(id);
          if (result?.error) throw new Error(result.error);
          toast('Asset deleted successfully', 'success');
          load();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          logError(err, { context: 'Failed to delete asset' });
          toast(message || 'Failed to delete asset. Please try again.', 'error');
        }
      }
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === deletableAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(deletableAssets.map(a => a.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirmAction({
      message: `Delete ${selectedIds.size} asset${selectedIds.size === 1 ? '' : 's'}? This cannot be undone.`,
      action: async () => {
        setBulkDeleting(true);
        try {
          const result = await api.bulkDeleteAssets(Array.from(selectedIds));
          if (result?.error) throw new Error(result.error);
          setSelectedIds(new Set());
          setSelectMode(false);
          load();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          toast(message || 'Failed to delete assets.', 'error');
        } finally {
          setBulkDeleting(false);
        }
      }
    });
  };

  // MEDIUM BUG FIX: guard against missing Maps API key. When key is absent the
  // embed API returns a Google error page inside the iframe — return null instead
  // so callers can render a fallback rather than showing a broken frame.
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapsUrl = (address: string): string | null =>
    mapsApiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(address)}`
      : null;

  const mapsLink = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  if (loading) return (
    <div className="flex justify-center py-20">
      <div role="status" aria-label="Loading assets..." className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Assets"
        subtitle="Cash, gold, real estate, and investments — flagged by zakat eligibility"
        className="mb-4"
        actions={
          <>
            <SyncBanksButton onSynced={load} label="Sync balances" />
            {deletableAssets.length > 0 && (
              <button
                type="button"
                onClick={() => { setSelectMode(s => !s); setSelectedIds(new Set()); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${selectMode ? 'bg-red-50 border-red-200 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {selectMode ? 'Cancel' : 'Select'}
              </button>
            )}
            <button type="button" onClick={openAdd} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm">+ Add Asset</button>
          </>
        }
      />

      <div className={`mb-4 rounded-2xl border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${
        plaidSyncAccess ? 'bg-[#F7FBF7] border-green-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <p className={`text-sm font-semibold ${plaidSyncAccess ? 'text-primary' : 'text-amber-900'}`}>
            {hasLinkedPlaidAssets
              ? (plaidSyncAccess ? 'Keep your linked balances fresh.' : 'Your linked balances are visible, but syncing is paused.')
              : 'Connect bank and investment accounts.'}
          </p>
          <p className={`text-sm mt-1 ${plaidSyncAccess ? 'text-gray-600' : 'text-amber-800'}`}>
            {hasLinkedPlaidAssets
              ? (plaidSyncAccess
                ? 'Resync Plaid balances and routes from Import so this page stays current.'
                : 'Upgrade to Plus or Family to keep syncing balances and new activity after your trial ends.')
              : (plaidSyncAccess
                ? 'Link Plaid accounts so cash, brokerage, and retirement balances land here without manual entry.'
                : 'Plaid account sync now lives on Plus and Family. Upgrade when you want live balances instead of manual updates.')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/import"
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              plaidSyncAccess ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {hasLinkedPlaidAssets ? 'Manage Linked Accounts' : 'Connect Accounts'}
          </Link>
          {!plaidSyncAccess && (
            <Link
              href="/dashboard/billing"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Upgrade to Keep Syncing
            </Link>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectMode && (
        <div className="flex items-center gap-3 mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <input type="checkbox" checked={selectedIds.size === deletableAssets.length && deletableAssets.length > 0} onChange={toggleSelectAll} className="w-4 h-4 cursor-pointer" />
          <span className="text-sm text-gray-600 flex-1">
            {selectedIds.size === 0 ? 'Select assets to delete' : `${selectedIds.size} selected`}
          </span>
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}`}
            </button>
          )}
        </div>
      )}

      {assets.some(a => INVESTMENT_ASSET_TYPES.includes(a.type)) && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 flex items-center justify-between">
          <span>📈 You have investment-type assets. Track detailed holdings, stock prices &amp; Halal screening in <strong>Investments</strong>.</span>
          <Link href="/dashboard/investments" className="ml-3 text-blue-700 font-semibold underline hover:no-underline whitespace-nowrap">Go to Investments →</Link>
        </div>
      )}

      {assets.some(a => a.linkedSource === 'plaid') && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800 flex items-center justify-between gap-3">
          <span>Linked Plaid balances now appear here as read-only accounts. Resync or manage them from <strong>Import</strong>.</span>
          <Link href="/dashboard/import" className="text-emerald-700 font-semibold underline hover:no-underline whitespace-nowrap">Manage Linked Accounts →</Link>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-green-100 text-sm">Net Worth</p>
        <p className="text-4xl font-bold">{fmt((total?.netWorthWithLinked as number) || (total?.netWorth as number) || (total?.totalWealthWithLinked as number) || (total?.totalWealth as number) || 0)}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-green-200 text-sm">Zakat {(total?.zakatEligible as boolean) ? 'Eligible' : 'Below Nisab'}</p>
          <span className="text-green-200 text-sm">•</span>
          {(total?.zakatFullyPaid as boolean) ? (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">PAID {String(total?.currentLunarYear ?? '')} AH ✓</span>
          ) : (
            <button type="button" onClick={() => setShowBreakdown(!showBreakdown)} className="text-green-100 text-sm underline hover:text-white font-medium">
              {((total?.zakatPaid as number) || 0) > 0
                ? `Remaining: ${fmt((total?.zakatRemaining as number) || 0)} (paid ${fmt((total?.zakatPaid as number) || 0)}) ↗`
                : `Due: ${fmt((total?.zakatDue as number) || 0)} ↗`}
            </button>
          )}
        </div>
        {((total?.linkedAssetTotal as number) || 0) > 0 || ((total?.linkedDebtTotal as number) || 0) > 0 ? (
          <p className="text-xs text-green-100 mt-2">
            Includes {fmt((total?.linkedAssetTotal as number) || 0)} in linked assets and {fmt((total?.linkedDebtTotal as number) || 0)} in linked debts.
          </p>
        ) : null}
      </div>

      {showBreakdown && total?.breakdown ? (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-primary">Zakat Calculation Breakdown</h2>
            <button type="button" onClick={() => setShowBreakdown(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3"><p className="text-xs text-gray-500">Net Worth</p><p className="font-bold text-blue-700">{fmt((total?.netWorth as number) || 0)}</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-xs text-gray-500">Zakatable</p><p className="font-bold text-green-700">{fmt((total?.zakatableWealth as number) || 0)}</p></div>
            <div className="bg-orange-50 rounded-xl p-3"><p className="text-xs text-gray-500">Exempt</p><p className="font-bold text-orange-700">{fmt((total?.nonZakatableWealth as number) || 0)}</p></div>
          </div>
          <div className="border-t pt-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Nisab Threshold: {fmt((total?.nisab as number) || 5686.20)}</p>
            <p className="text-xs text-gray-500">Zakat Rate: 2.5% of zakatable wealth</p>
            <p className="text-sm font-semibold text-primary mt-1">Zakat Due = {fmt((total?.zakatableWealth as number) || 0)} × 2.5% = {fmt((total?.zakatDue as number) || 0)}</p>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(total.breakdown as Array<Record<string, unknown>>).map((item, i) => (
              <div key={i} className={`flex justify-between items-start p-3 rounded-lg text-sm ${(item.zakatable as boolean) ? 'bg-green-50' : 'bg-orange-50'}`}>
                <div>
                  <p className="font-medium text-gray-900">{item.name as string}</p>
                  <p className="text-xs text-gray-500 capitalize">{typeLabel(item.type as string)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.reason as string}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">{fmt(item.value as number)}</p>
                  <p className={`text-xs font-medium ${(item.zakatable as boolean) ? 'text-green-600' : 'text-orange-600'}`}>
                    {(item.zakatable as boolean) ? `Zakatable: ${fmt(item.zakatableValue as number)}` : 'Exempt'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Failed to load assets</p>
          <p className="text-red-500 mt-1">{loadError}</p>
          <button type="button" onClick={load} className="mt-2 text-red-700 underline hover:text-red-900 text-xs">Retry</button>
        </div>
      )}

      {assets.length === 0 && !loadError ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💰</p>
          <p>No assets yet. Add your first asset.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.map(a => (
            <div key={a.id} className={`bg-white rounded-xl shadow-sm overflow-hidden transition ${selectMode && selectedIds.has(a.id) ? 'ring-2 ring-primary/40' : ''}`}>
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(a.id)}
                      disabled={a.readOnly}
                      onChange={() => toggleSelect(a.id)}
                      className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-primary">{a.name}</p>
                      {a.readOnly && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Linked via Plaid
                        </span>
                      )}
                    </div>
                    {a.name.toLowerCase() !== typeLabel(a.type).toLowerCase() && (
                      <p className="text-sm text-gray-500">{typeLabel(a.type)}</p>
                    )}
                    {a.readOnly && (
                      <p className="text-xs text-gray-500">
                        {[a.institutionName, a.accountSubtype, a.accountMask ? `••${a.accountMask}` : null].filter(Boolean).join(' • ')}
                        {a.lastSyncedAt ? ` • Synced ${new Date(a.lastSyncedAt).toLocaleDateString()}` : ''}
                      </p>
                    )}
                    {a.address && (
                      <a href={mapsLink(a.address)} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-0.5 block">
                        📍 {a.address}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-primary">{fmt(a.value)}</p>
                  {!selectMode && (
                    <>
                      {!a.readOnly && (
                        <>
                          <button type="button" onClick={() => openEdit(a)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                          <button type="button" onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600 text-sm">Delete</button>
                        </>
                      )}
                      {a.readOnly && (
                        <Link href="/dashboard/import" className="text-gray-500 hover:text-primary text-sm border border-gray-300 px-3 py-1 rounded-lg">
                          Manage
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
              {a.address && ADDRESS_TYPES.includes(a.type) && (
                <div className="border-t">
                  {mapsUrl(a.address) ? (
                    <iframe
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      sandbox="allow-scripts"
                      src={mapsUrl(a.address)!}
                    />
                  ) : (
                    <p className="text-xs text-gray-400 italic py-2 px-3">Map unavailable</p>
                  )}
                </div>
              )}
            </div>
          ))}
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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-4">
            <h2 className="text-xl font-bold text-primary mb-4">{editItem ? 'Edit Asset' : 'Add Asset'}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="asset-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input id="asset-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. My Home" />
              </div>
              <div>
                <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select id="asset-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {Object.entries(TYPE_GROUPS).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="asset-value" className="block text-sm font-medium text-gray-700 mb-1">Value ({currency})</label>
                <input id="asset-value" type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" />
              </div>

              {ADDRESS_TYPES.includes(form.type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="e.g. 123 Main St, Austin, TX 78701" />
                  {form.address && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      {mapsUrl(form.address) ? (
                        <iframe
                          width="100%" height="180" style={{ border: 0 }} loading="lazy" allowFullScreen
                          sandbox="allow-scripts"
                          src={mapsUrl(form.address)!}
                        />
                      ) : (
                        <p className="text-xs text-gray-400 italic py-2 px-3">Map unavailable</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Address is used for map display only. Enter your estimated value above.</p>
                </div>
              )}

              {PENALTY_TAX_TYPES.includes(form.type) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Early Withdrawal Penalty (%)
                    </label>
                    <input type="number" step="0.1" min="0" max="100" value={form.penaltyRate}
                      onChange={e => setForm({ ...form, penaltyRate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-gray-900"
                      placeholder={EDUCATION_TYPES.includes(form.type) || IRA_TYPES.includes(form.type) ? '0' : '10'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input type="number" step="0.1" min="0" max="100" value={form.taxRate}
                      onChange={e => setForm({ ...form, taxRate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-gray-900"
                      placeholder={EDUCATION_TYPES.includes(form.type) || IRA_TYPES.includes(form.type) ? '0' : '25'} />
                  </div>
                  {EDUCATION_TYPES.includes(form.type) ? (
                    <p className="text-xs text-gray-500">
                      529 plans: <strong>qualified</strong> withdrawals (for education) are tax-free &amp; penalty-free — leave both at 0%.
                      For <strong>non-qualified</strong> withdrawals, set 10% penalty + your income tax rate to zakat only on what you&apos;d actually keep.
                    </p>
                  ) : IRA_TYPES.includes(form.type) ? (
                    <p className="text-xs text-gray-500">
                      IRAs are tax-exempt by default (0% penalty, 0% tax). If your state charges income tax, add your state rate above.
                      States like TX, FL, NV, WA, WY, SD, AK, TN, NH have no state income tax.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Defaults: 10% penalty + 22% federal tax + state tax. Adjust if your state or plan differs.</p>
                  )}
                </>
              )}

              {INVESTMENT_TYPES.includes(form.type) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capital Gains Tax Rate (%)</label>
                    <input type="number" step="0.1" min="0" max="100" value={form.taxRate}
                      onChange={e => setForm({ ...form, taxRate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-gray-900"
                      placeholder="0" />
                  </div>
                  <p className="text-xs text-gray-500">
                    <strong>Optional:</strong> Set your estimated capital gains tax rate to zakat only on what you&apos;d keep after selling.
                    Common rates: <strong>15%</strong> long-term, <strong>22–37%</strong> short-term (depends on income).
                    Leave at 0% to zakat on the full market value (default — some scholars prefer this).
                  </p>
                </>
              )}
            </div>
            {saveError && (
              <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
                {saveError}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} disabled={saving} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.name || !form.value}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50">
                {saving ? 'Saving...' : editItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
