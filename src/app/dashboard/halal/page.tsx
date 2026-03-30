'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';

interface HalalResult { symbol: string; name: string; isHalal: boolean; reason: string; sector: string; debtRatio?: number; }
interface StockStats { totalStocks: number; halalCount: number; haramCount: number; sectorCount: number; }

const PAGE_SIZE = 50;

export default function HalalPage() {
  // Single stock check
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState<{ symbol: string; name: string; status: string; reason: string; sector: string; debtRatio?: number } | null>(null);
  const [checking, setChecking] = useState(false);

  // List state
  const [stocks, setStocks] = useState<HalalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [compliance, setCompliance] = useState<'all' | 'halal' | 'haram'>('all');
  const [sector, setSector] = useState('');
  const [page, setPage] = useState(0);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalInDb, setTotalInDb] = useState(0);

  // Stats & sectors
  const [stats, setStats] = useState<StockStats | null>(null);
  const [sectors, setSectors] = useState<{ sector: string; count: number }[]>([]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load stats and sectors on mount
  useEffect(() => {
    api.getHalalStats().then(setStats).catch(() => {});
    api.getHalalSectors().then((d: { sectors: { sector: string; count: number }[] }) => setSectors(d?.sectors || [])).catch(() => {});
  }, []);

  // Fetch stocks when filters or page change
  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.getHalalStocks({ search: debouncedSearch, sector, compliance, page, size: PAGE_SIZE });
      setStocks(Array.isArray(d?.stocks) ? d.stocks : []);
      setTotalFiltered(d?.totalFiltered || 0);
      setTotalPages(d?.totalPages || 0);
      setTotalInDb(d?.totalInDatabase || 0);
    } catch (err: unknown) {
      logError(err, { context: 'Failed to load stocks' });
    }
    setLoading(false);
  }, [debouncedSearch, sector, compliance, page]);

  useEffect(() => { fetchStocks(); }, [fetchStocks]);

  // Reset to page 0 when filters change
  useEffect(() => { setPage(0); }, [debouncedSearch, sector, compliance]);

  const handleCheck = async () => {
    if (!symbol.trim()) return;
    setChecking(true); setResult(null);
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
    } catch {
      setResult({ symbol: symbol.toUpperCase(), name: '', status: 'UNKNOWN', reason: 'Could not find stock data', sector: '' });
    }
    setChecking(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Halal Stock Screener</h1>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stats.totalStocks.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Stocks</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700">{stats.halalCount.toLocaleString()}</p>
            <p className="text-xs text-green-600">Halal</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-600">{stats.haramCount.toLocaleString()}</p>
            <p className="text-xs text-red-500">Haram</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-700">{stats.sectorCount}</p>
            <p className="text-xs text-blue-500">Sectors</p>
          </div>
        </div>
      )}

      {/* Single stock check */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Check a Stock</h2>
        <div className="flex gap-3">
          <input
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            className="flex-1 border rounded-lg px-4 py-2 text-gray-900 text-lg"
            placeholder="Enter ticker (e.g. AAPL, MSFT, TSLA)"
          />
          <button
            onClick={handleCheck}
            disabled={checking || !symbol.trim()}
            className="bg-[#1B5E20] text-white px-6 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 font-medium"
          >
            {checking ? '...' : 'Check'}
          </button>
        </div>
      </div>

      {result && (
        <div className={`rounded-2xl p-6 mb-6 ${result.status === 'HALAL' ? 'bg-green-50 border border-green-200' : result.status === 'HARAM' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{result.status === 'HALAL' ? '\u2705' : result.status === 'HARAM' ? '\u274C' : '\u2753'}</span>
            <div>
              <p className="text-xl font-bold text-gray-900">{result.symbol}{result.name ? ` \u2014 ${result.name}` : ''}</p>
              <p className={`text-lg font-semibold ${result.status === 'HALAL' ? 'text-green-700' : result.status === 'HARAM' ? 'text-red-700' : 'text-gray-600'}`}>{result.status}</p>
            </div>
          </div>
          {result.reason && <p className="text-gray-600">{result.reason}</p>}
          {result.sector && <p className="text-sm text-gray-500 mt-1">Sector: {result.sector}</p>}
          {result.debtRatio !== undefined && <p className="text-sm text-gray-500">Debt Ratio: {(result.debtRatio * 100).toFixed(1)}%</p>}
        </div>
      )}

      {/* Screener list */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Stock Screener
            <span className="text-sm font-normal text-gray-400 ml-2">
              {totalFiltered.toLocaleString()} of {totalInDb.toLocaleString()} stocks
            </span>
          </h2>

          {/* Compliance toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 text-sm">
            {(['all', 'halal', 'haram'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCompliance(c)}
                className={`px-4 py-1.5 rounded-md font-medium transition ${
                  compliance === c
                    ? c === 'halal' ? 'bg-green-600 text-white' : c === 'haram' ? 'bg-red-500 text-white' : 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {c === 'all' ? 'All' : c === 'halal' ? 'Halal' : 'Haram'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 text-gray-900"
            placeholder="Search by ticker, name, or sector..."
          />
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-900 text-sm min-w-[180px]"
          >
            <option value="">All Sectors</option>
            {sectors.map(s => (
              <option key={s.sector} value={s.sector}>{s.sector} ({s.count})</option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
          </div>
        )}

        {/* Results */}
        {!loading && stocks.length > 0 && (
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {stocks.map((s, i) => (
              <div key={`${s.symbol}-${i}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                <span className={`text-lg ${s.isHalal ? 'text-green-600' : 'text-red-500'}`}>
                  {s.isHalal ? '\u2705' : '\u274C'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {s.symbol}
                    <span className="font-normal text-gray-500 ml-2">{s.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 truncate">{s.sector} &middot; {s.reason}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.isHalal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.isHalal ? 'Halal' : 'Haram'}
                </span>
              </div>
            ))}
          </div>
        )}

        {!loading && stocks.length === 0 && (
          <p className="text-center text-gray-400 py-8">No stocks found matching your filters.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-sm text-[#1B5E20] font-medium disabled:opacity-30"
            >
              &larr; Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-sm text-[#1B5E20] font-medium disabled:opacity-30"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Methodology note */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2">How We Screen Stocks</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          Our screening follows <strong>AAOIFI Standard 21</strong> guidelines used by major Islamic finance institutions.
          A stock is considered <strong>Halal</strong> if: (1) the company&apos;s core business is permissible,
          (2) debt-to-total-assets ratio is below 33%, (3) interest-bearing securities and cash are below 33% of total assets,
          and (4) non-permissible revenue is less than 5% of total revenue. Industries like gambling, alcohol, tobacco,
          conventional banking, weapons, and adult entertainment are excluded entirely.
        </p>
        <p className="text-xs text-amber-600 mt-2">
          Screening data is updated periodically. Always consult a qualified Islamic finance scholar for personal investment decisions.
        </p>
      </div>
    </div>
  );
}
