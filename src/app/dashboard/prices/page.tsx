'use client';
import { useState } from 'react';
import { api } from '../../../lib/api';

interface CryptoPrice { symbol: string; name: string; priceUsd: number; change24h: number; marketCap: number; }
interface StockPrice { symbol: string; name: string; price: number; change: number; changePercent: number; high: number; low: number; }

export default function PricesPage() {
  const [tab, setTab] = useState<'crypto' | 'stock'>('crypto');
  const [symbol, setSymbol] = useState('');
  const [cryptoResult, setCryptoResult] = useState<CryptoPrice | null>(null);
  const [stockResult, setStockResult] = useState<StockPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSearch = async () => {
    if (!symbol.trim()) return;
    setLoading(true); setError(''); setCryptoResult(null); setStockResult(null);
    try {
      if (tab === 'crypto') {
        const r = await api.getCryptoPrice(symbol.trim().toLowerCase());
        setCryptoResult(r);
      } else {
        const r = await api.getStockPrice(symbol.trim().toUpperCase());
        setStockResult(r);
      }
    } catch { setError('Could not find price data. Check the symbol.'); }
    setLoading(false);
  };

  const POPULAR_CRYPTO = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'];
  const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Live Prices</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => { setTab('crypto'); setSymbol(''); setCryptoResult(null); setStockResult(null); setError(''); }} className={`px-4 py-2 rounded-lg font-medium ${tab === 'crypto' ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600'}`}>Crypto</button>
        <button onClick={() => { setTab('stock'); setSymbol(''); setCryptoResult(null); setStockResult(null); setError(''); }} className={`px-4 py-2 rounded-lg font-medium ${tab === 'stock' ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600'}`}>Stocks</button>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex gap-3">
          <input value={symbol} onChange={e => setSymbol(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="flex-1 border rounded-lg px-4 py-2 text-gray-900 text-lg" placeholder={tab === 'crypto' ? 'e.g. bitcoin, ethereum' : 'e.g. AAPL, MSFT'} />
          <button onClick={handleSearch} disabled={loading || !symbol.trim()} className="bg-[#1B5E20] text-white px-6 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 font-medium">{loading ? '...' : 'Search'}</button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {(tab === 'crypto' ? POPULAR_CRYPTO : POPULAR_STOCKS).map(s => (
            <button key={s} onClick={() => { setSymbol(s); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{s}</button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">{error}</div>}

      {cryptoResult && (
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">{cryptoResult.symbol?.toUpperCase()}</p>
              <p className="text-2xl font-bold text-gray-900">{cryptoResult.name}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#1B5E20]">{fmt(cryptoResult.priceUsd)}</p>
              <p className={`text-lg font-semibold ${cryptoResult.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cryptoResult.change24h >= 0 ? '▲' : '▼'} {Math.abs(cryptoResult.change24h).toFixed(2)}%
              </p>
            </div>
          </div>
          {cryptoResult.marketCap > 0 && <p className="text-sm text-gray-500">Market Cap: {fmt(cryptoResult.marketCap)}</p>}
        </div>
      )}

      {stockResult && (
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">{stockResult.symbol}</p>
              <p className="text-2xl font-bold text-gray-900">{stockResult.name || stockResult.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#1B5E20]">{fmt(stockResult.price)}</p>
              <p className={`text-lg font-semibold ${stockResult.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockResult.change >= 0 ? '▲' : '▼'} {fmt(Math.abs(stockResult.change))} ({Math.abs(stockResult.changePercent).toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Day High</p><p className="text-lg font-semibold text-green-600">{fmt(stockResult.high)}</p></div>
            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Day Low</p><p className="text-lg font-semibold text-red-600">{fmt(stockResult.low)}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
