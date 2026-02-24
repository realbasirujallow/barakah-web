'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Asset { id: number; name: string; type: string; value: number; penaltyRate?: number; taxRate?: number; }

interface AssetFormState {
  name: string;
  type: string;
  value: string;
  penaltyRate: string;
  taxRate: string;
}

const TYPE_GROUPS: Record<string, { value: string; label: string }[]> = {
  '💵 Cash & Savings': [
    { value: 'cash', label: 'Cash' },
    { value: 'savings_account', label: 'Savings Account' },
    { value: 'checking_account', label: 'Checking Account' },
  ],
  '🏠 Real Estate': [
    { value: 'primary_home', label: 'Primary Home' },
    { value: 'investment_property', label: 'Investment Property' },
  ],
  '📈 Investments': [
    { value: 'stock', label: 'Stocks / ETFs' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'business', label: 'Business' },
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

const RETIREMENT_TYPES = ["401k","retirement_401k","ira","roth_ira","pension","retirement","403b","tsp","sep_ira","hsa","529"];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Asset | null>(null);
  const [form, setForm] = useState<AssetFormState>({ name: '', type: 'cash', value: '', penaltyRate: '', taxRate: '' });
  const [saving, setSaving] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.getAssets(), api.getAssetTotal()])
      .then(([a, t]) => { setAssets(a || []); setTotal(t); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const typeLabel = (t: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash', savings_account: 'Savings Account', checking_account: 'Checking Account',
      primary_home: 'Primary Home', investment_property: 'Investment Property',
      stock: 'Stocks / ETFs', stocks: 'Stocks', crypto: 'Cryptocurrency', business: 'Business',
      '401k': '401(k)', roth_ira: 'Roth IRA', ira: 'Traditional IRA', hsa: 'HSA',
      '403b': '403(b)', pension: 'Pension', gold: 'Gold', silver: 'Silver',
      '529': '529 Plan',
      vehicle: 'Vehicle', property: 'Property', real_estate: 'Real Estate', other: 'Other',
    };
    return labels[t] || t.replace(/_/g, ' ');
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', type: 'cash', value: '', penaltyRate: '', taxRate: '' });
    setShowForm(true);
  };

  const openEdit = (a: Asset) => {
    setEditItem(a);
    setForm({
      name: a.name,
      type: a.type,
      value: String(a.value),
      penaltyRate: a.penaltyRate != null ? String(a.penaltyRate) : '',
      taxRate: a.taxRate != null ? String(a.taxRate) : ''
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: Record<string, unknown> = { name: form.name, type: form.type, value: parseFloat(form.value) };
      if (RETIREMENT_TYPES.includes(form.type)) {
        if (form.penaltyRate) data.penaltyRate = parseFloat(form.penaltyRate) / 100;
        if (form.taxRate) data.taxRate = parseFloat(form.taxRate) / 100;
      }
      if (editItem) await api.updateAsset(editItem.id, data);
      else await api.addAsset(data);
      setShowForm(false);
      load();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this asset?')) return;
    await api.deleteAsset(id).catch(() => {});
    load();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Assets</h1>
        <button onClick={openAdd} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">
          + Add Asset
        </button>
      </div>

      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-green-100 text-sm">Net Worth</p>
        <p className="text-4xl font-bold">{fmt((total?.netWorth as number) || (total?.totalWealth as number) || 0)}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-green-200 text-sm">Zakat {(total?.zakatEligible as boolean) ? 'Eligible' : 'Below Nisab'}</p>
          <span className="text-green-200 text-sm">•</span>
          <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-green-100 text-sm underline hover:text-white font-medium">
            Due: {fmt((total?.zakatDue as number) || 0)} ↗
          </button>
        </div>
      </div>

      {showBreakdown && total?.breakdown ? (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1B5E20]">Zakat Calculation Breakdown</h2>
            <button onClick={() => setShowBreakdown(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3"><p className="text-xs text-gray-500">Net Worth</p><p className="font-bold text-blue-700">{fmt((total?.netWorth as number) || 0)}</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-xs text-gray-500">Zakatable</p><p className="font-bold text-green-700">{fmt((total?.zakatableWealth as number) || 0)}</p></div>
            <div className="bg-orange-50 rounded-xl p-3"><p className="text-xs text-gray-500">Exempt</p><p className="font-bold text-orange-700">{fmt((total?.nonZakatableWealth as number) || 0)}</p></div>
          </div>
          <div className="border-t pt-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Nisab Threshold: {fmt((total?.nisab as number) || 5686.20)}</p>
            <p className="text-xs text-gray-500">Zakat Rate: 2.5% of zakatable wealth</p>
            <p className="text-sm font-semibold text-[#1B5E20] mt-1">Zakat Due = {fmt((total?.zakatableWealth as number) || 0)} × 2.5% = {fmt((total?.zakatDue as number) || 0)}</p>
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

      {assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#1B5E20]">{a.name}</p>
                <p className="text-sm text-gray-500">{typeLabel(a.type)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-[#1B5E20]">{fmt(a.value)}</p>
                <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-blue-600 text-sm">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💰</p>
          <p>No assets yet. Add your first asset.</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">{editItem ? 'Edit Asset' : 'Add Asset'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Savings Account" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {Object.entries(TYPE_GROUPS).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (USD)</label>
                <input type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" />
              </div>
              {RETIREMENT_TYPES.includes(form.type) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Rate (%)</label>
                    <input type="number" step="0.1" min="0" max="100" value={form.penaltyRate}
                      onChange={e => setForm({ ...form, penaltyRate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input type="number" step="0.1" min="0" max="100" value={form.taxRate}
                      onChange={e => setForm({ ...form, taxRate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="25" />
                  </div>
                  <p className="text-xs text-gray-500">Defaults: 10% penalty, 25% tax. Adjust if your state or plan is different.</p>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.value}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">
                {saving ? 'Saving...' : editItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}