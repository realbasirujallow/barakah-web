'use client';
import { useState } from 'react';
import { api } from '../../../lib/api';

interface HalalResult { symbol: string; name: string; status: string; reason: string; sector: string; debtRatio?: number; }

export default function HalalPage() {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState<HalalResult | null>(null);
  const [halalList, setHalalList] = useState<HalalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [listSearch, setListSearch] = useState('');

  const handleCheck = async () => {
    if (!symbol.trim()) return;
    setLoading(true); setResult(null);
    try {
      const r = await api.checkHalal(symbol.trim().toUpperCase());
      setResult({
        symbol: r.symbol,
        name: r.name || '',
        status: !r.found ? 'UNKNOWN' : r.isHalal ? 'HALAL' : 'HARAM',
        reason: !r.found ? 'Stock not found in our database' : (r.reason || ''),
        sector: r.sector || '',
        debtRatio: r.debtRatio,
      });
    } catch { setResult({ symbol: symbol.toUpperCase(), name: '', status: 'UNKNOWN', reason: 'Could not find stock data', sector: '' }); }
    setLoading(false);
  };

  const loadList = async () => {
    setLoading(true);
    try { const d = await api.getHalalStocks(); setHalalList(d?.stocks || []); setShowList(true); } catch (err: any) { console.error(err); }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Halal Stock Screener</h1>

      <div className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Check a Stock</h2>
        <div className="flex gap-3">
          <input value={symbol} onChange={e => setSymbol(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCheck()} className="flex-1 border rounded-lg px-4 py-2 text-gray-900 text-lg" placeholder="Enter ticker (e.g. AAPL, MSFT, TSLA)" />
          <button onClick={handleCheck} disabled={loading || !symbol.trim()} className="bg-[#1B5E20] text-white px-6 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 font-medium">{loading ? '...' : 'Check'}</button>
        </div>
      </div>

      {result && (
        <div className={`rounded-2xl p-6 mb-6 ${result.status === 'HALAL' ? 'bg-green-50 border border-green-200' : result.status === 'HARAM' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{result.status === 'HALAL' ? '✅' : result.status === 'HARAM' ? '❌' : '❓'}</span>
            <div>
              <p className="text-xl font-bold text-gray-900">{result.symbol}{result.name ? ` — ${result.name}` : ''}</p>
              <p className={`text-lg font-semibold ${result.status === 'HALAL' ? 'text-green-700' : result.status === 'HARAM' ? 'text-red-700' : 'text-gray-600'}`}>{result.status}</p>
            </div>
          </div>
          {result.reason && <p className="text-gray-600">{result.reason}</p>}
          {result.sector && <p className="text-sm text-gray-500 mt-1">Sector: {result.sector}</p>}
          {result.debtRatio !== undefined && <p className="text-sm text-gray-500">Debt Ratio: {(result.debtRatio * 100).toFixed(1)}%</p>}
        </div>
      )}

      <div className="text-center">
        <button onClick={loadList} disabled={loading} className="text-[#1B5E20] hover:underline font-medium">{showList ? 'Refresh' : 'View All Halal Stocks →'}</button>
      </div>

      {showList && halalList.length > 0 && (() => {
        const q = listSearch.toLowerCase();
        const filtered = q ? halalList.filter((s: HalalResult) =>
          (s.symbol || '').toLowerCase().includes(q) ||
          (s.name || '').toLowerCase().includes(q) ||
          (s.sector || '').toLowerCase().includes(q)
        ) : halalList;
        return (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">Pre-Screened Halal Stocks ({filtered.length})</h2>
          </div>
          <input value={listSearch} onChange={e => setListSearch(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-gray-900 mb-3" placeholder="Search by ticker, name, or sector..." />
          <div className="grid md:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto">
            {filtered.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <p className="font-semibold text-gray-900">{s.symbol}{s.name ? ` — ${s.name}` : ''}</p>
                  <p className="text-xs text-gray-500">{s.sector || s.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })()}
    </div>
  );
}
