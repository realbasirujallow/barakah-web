'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { useCurrency } from '../../../../lib/useCurrency';
import { logError } from '../../../../lib/logError';
import { useToast } from '../../../../lib/toast';
import { useI18n } from '../../../../lib/i18n';
import { PageHeader } from '../../../../components/dashboard/PageHeader';
import { SkeletonPage } from '../../SkeletonCard';

interface Asset {
  id: number;
  name: string;
  type: string;
  value: number;
  currency?: string | null;
  linkedAccountId?: number | null;
  institutionName?: string | null;
  accountMask?: string | null;
  accountSubtype?: string | null;
  readOnly?: boolean;
  lastSyncedAt?: number | null;
  address?: string | null;
}

interface Tx {
  id: number;
  type: string;
  category?: string;
  amount: number;
  description?: string;
  merchantName?: string;
  timestamp: number;
  direction?: string;
}

interface Holding {
  id: number;
  symbol: string;
  name: string;
  shares?: number;
  currentPrice?: number;
  marketValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  holdingType?: string;
  sector?: string;
}

const INVESTMENT_TYPES = new Set([
  'stock', 'crypto', 'etf', 'business', 'individual_brokerage',
  '401k', 'retirement_401k', 'roth_ira', 'ira', 'hsa', '403b',
  'pension', 'retirement', 'tsp', 'sep_ira',
  '529', '529_plan', 'education_savings',
]);

const TYPE_OPTIONS: Array<{ value: string; label: string; group: string }> = [
  { value: 'cash', label: 'Cash', group: 'Cash & Savings' },
  { value: 'savings_account', label: 'Savings Account', group: 'Cash & Savings' },
  { value: 'checking_account', label: 'Checking Account', group: 'Cash & Savings' },
  { value: 'primary_home', label: 'Primary Home', group: 'Real Estate' },
  { value: 'investment_property', label: 'Investment Property (Rental)', group: 'Real Estate' },
  { value: 'investment_property_resale', label: 'Investment Property (For Resale)', group: 'Real Estate' },
  { value: 'rental_property', label: 'Rental Property', group: 'Real Estate' },
  { value: 'stock', label: 'Stocks / ETFs', group: 'Investments' },
  { value: 'crypto', label: 'Cryptocurrency', group: 'Investments' },
  { value: 'business', label: 'Business', group: 'Investments' },
  { value: 'individual_brokerage', label: 'Individual Brokerage', group: 'Investments' },
  { value: '401k', label: '401(k)', group: 'Retirement' },
  { value: 'roth_ira', label: 'Roth IRA', group: 'Retirement' },
  { value: 'ira', label: 'Traditional IRA', group: 'Retirement' },
  { value: 'hsa', label: 'HSA', group: 'Retirement' },
  { value: '403b', label: '403(b)', group: 'Retirement' },
  { value: 'pension', label: 'Pension', group: 'Retirement' },
  { value: '529', label: '529 Plan', group: 'Education' },
  { value: 'gold', label: 'Gold', group: 'Precious Metals' },
  { value: 'silver', label: 'Silver', group: 'Precious Metals' },
  { value: 'vehicle', label: 'Vehicle', group: 'Other' },
  { value: 'other', label: 'Other', group: 'Other' },
];

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assetId = Number(id);
  const { fmt, locale } = useCurrency();
  const { toast } = useToast();
  const { t } = useI18n();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingType, setSavingType] = useState(false);
  const [typeDraft, setTypeDraft] = useState<string>('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(assetId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await api.getAssets() as { assets?: Asset[] } | Asset[];
        const all: Asset[] = Array.isArray(list) ? list : (list?.assets ?? []);
        const found = all.find(a => a.id === assetId) ?? null;
        if (cancelled) return;
        if (!found) { setNotFound(true); setLoading(false); return; }
        setAsset(found);
        setTypeDraft(found.type);
        if (found.linkedAccountId) {
          // Fetch transactions + holdings in parallel. For investment-type
          // accounts the user is more interested in what's HELD inside the
          // account than the cash-in/out transactions, so we render holdings
          // first when present.
          const wantsHoldings = INVESTMENT_TYPES.has(found.type);
          const [trRes, hRes] = await Promise.allSettled([
            api.getTransactions(undefined, 0, 100, undefined, found.linkedAccountId),
            wantsHoldings
              ? api.getHoldingsByAccount(found.linkedAccountId)
              : Promise.resolve({ holdings: [] }),
          ]);
          if (cancelled) return;
          if (trRes.status === 'fulfilled') {
            const v = trRes.value as { transactions?: Tx[] };
            setTxs(v?.transactions ?? []);
          } else {
            logError(trRes.reason, { tags: { area: 'asset-detail.getTransactions' } });
          }
          if (hRes.status === 'fulfilled') {
            const v = hRes.value as { holdings?: Holding[] };
            setHoldings(v?.holdings ?? []);
          } else {
            logError(hRes.reason, { tags: { area: 'asset-detail.getHoldings' } });
          }
        }
      } catch (e) {
        logError(e, { tags: { area: 'asset-detail.load' } });
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [assetId]);

  const saveType = async () => {
    if (!asset || typeDraft === asset.type) return;
    setSavingType(true);
    try {
      await api.updateAsset(asset.id, { name: asset.name, type: typeDraft, value: asset.value });
      setAsset({ ...asset, type: typeDraft });
      toast(t('assetTypeUpdated'), 'success');
    } catch (e) {
      logError(e, { tags: { area: 'asset-detail.updateType' } });
      toast(t('assetTypeUpdateFailed'), 'error');
      setTypeDraft(asset.type);
    } finally {
      setSavingType(false);
    }
  };

  if (loading) return <SkeletonPage />;
  if (notFound || !asset) {
    // 2026-06-08 (ERR-RAW-ASSET-WEB-5): localized + link back to /assets.
    return (
      <div className="max-w-3xl mx-auto p-6">
        <PageHeader title={t('assetNotFoundTitle')} />
        <p className="text-sm text-gray-500 mt-4">{t('assetNotFoundBody')}</p>
        <Link href="/dashboard/assets" className="text-primary hover:underline text-sm mt-4 inline-block">← {t('assetBackToAssets')}</Link>
      </div>
    );
  }

  const groups = Array.from(new Set(TYPE_OPTIONS.map(o => o.group)));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href="/dashboard/assets" className="text-sm text-primary hover:underline">← Back to assets</Link>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-primary">{asset.name}</h1>
            {asset.readOnly && (
              <p className="text-xs text-emerald-700 font-medium mt-1">Linked via Plaid · {[asset.institutionName, asset.accountSubtype, asset.accountMask ? `••${asset.accountMask}` : null].filter(Boolean).join(' • ')}</p>
            )}
            {asset.address && <p className="text-xs text-gray-500 mt-1">📍 {asset.address}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Current value</p>
            <p className="text-3xl font-bold text-primary tabular-nums">{fmt(asset.value)}</p>
            {asset.lastSyncedAt && <p className="text-[11px] text-gray-400 mt-1">Synced {new Date(asset.lastSyncedAt).toLocaleDateString(locale)}</p>}
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Asset type</label>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={typeDraft}
              onChange={e => setTypeDraft(e.target.value)}
              disabled={asset.readOnly || savingType}
              className="border rounded-lg px-3 py-2 text-sm disabled:opacity-50"
            >
              {groups.map(g => (
                <optgroup key={g} label={g}>
                  {TYPE_OPTIONS.filter(o => o.group === g).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {typeDraft !== asset.type && (
              <button
                type="button"
                onClick={saveType}
                disabled={savingType}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {savingType ? 'Saving…' : 'Save type'}
              </button>
            )}
            {asset.readOnly && <span className="text-xs text-gray-400">Plaid-linked accounts use their reported type.</span>}
          </div>
        </div>
      </div>

      {holdings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Holdings</h2>
          <ul className="divide-y divide-gray-100">
            {holdings.map(h => {
              const gain = h.gainLoss ?? 0;
              const pct = h.gainLossPercent ?? 0;
              const isGain = gain >= 0;
              return (
                <li key={h.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{h.symbol}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {h.name}{h.shares ? ` · ${h.shares} shares` : ''}{h.currentPrice ? ` @ ${fmt(h.currentPrice)}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-foreground">{fmt(h.marketValue ?? 0)}</p>
                    {(Math.abs(gain) >= 0.005 || Math.abs(pct) >= 0.005) && (
                      <p className={`text-[11px] tabular-nums ${isGain ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isGain ? '▲' : '▼'} {fmt(Math.abs(gain))} ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-primary mb-3">Transactions</h2>
        {!asset.linkedAccountId && (
          <p className="text-sm text-gray-400">Manual asset — no transactions are tracked for this entry. Link a bank account via Plaid to see transactions here.</p>
        )}
        {asset.linkedAccountId && txs.length === 0 && (
          <p className="text-sm text-gray-400">
            {holdings.length > 0
              ? 'No cash transactions for this account — investment activity (buys, sells, dividends) is shown above as Holdings.'
              : 'No transactions yet for this account. Hit Sync banks on the dashboard to refresh.'}
          </p>
        )}
        {txs.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {txs.map(t => {
              const inflow = (t.direction === 'inflow') || t.type === 'income';
              return (
                <li key={t.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{t.merchantName || t.description || t.category || 'Transaction'}</p>
                    <p className="text-[11px] text-gray-500">{new Date(t.timestamp).toLocaleDateString(locale)}{t.category ? ` · ${t.category}` : ''}</p>
                  </div>
                  <p className={`text-sm font-semibold tabular-nums ${inflow ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {inflow ? '+' : '−'}{fmt(Math.abs(Number(t.amount) || 0))}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
