'use client';

import { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { useI18n } from '../../lib/i18n';

interface MissingAccount { linkedAccountId: number; name: string; currency?: string }
interface CoverageItem { institutionName?: string; creditAccountCount: number; accounts?: MissingAccount[] }

export function BillCoverageNotice({ onAdd }: { onAdd: (name: string, currency?: string) => void }) {
  const { t } = useI18n();
  const [items, setItems] = useState<CoverageItem[]>([]);
  const [failed, setFailed] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    api.getPlaidLiabilitiesCoverage().then(result => {
      if (cancelled) return;
      if (result?.error || !Array.isArray(result?.items)) { setFailed(true); return; }
      setItems(result.items);
      setFailed(false);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [revision]);
  if (failed) return <section role="status" className="border-b border-amber-300 py-4 mb-4 text-sm text-amber-900 flex items-center gap-3">
    <p className="flex-1">{t('billsCoverageError')}</p>
    <button type="button" title={t('zktRetry')} aria-label={t('zktRetry')} onClick={() => setRevision(value => value + 1)}><RefreshCw size={18}/></button>
  </section>;
  if (!items.length) return null;
  return <section aria-label={t('billsCoverageTitle')} className="border-b border-amber-300 py-4 mb-4">
    <h2 className="font-semibold text-amber-900">{t('billsCoverageTitle')}</h2>
    <p className="text-sm text-gray-700 mt-1">{t('billsCoverageBody')}</p>
    <ul className="divide-y divide-gray-200 mt-2">
      {items.flatMap(item => item.accounts?.length ? item.accounts : [{ linkedAccountId: 0, name: item.institutionName ?? '', currency: undefined }]).map((account, index) =>
        <li key={`${account.linkedAccountId}-${index}`} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <span>{account.name}</span>
          <button type="button" className="inline-flex items-center gap-1 text-primary font-semibold" onClick={() => onAdd(account.name, account.currency)}><Plus size={16}/>{t('billsCoverageAdd')}</button>
        </li>)}
    </ul>
  </section>;
}
