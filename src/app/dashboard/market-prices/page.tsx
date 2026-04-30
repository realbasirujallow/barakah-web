'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import EmptyState from '../../../components/EmptyState';
import { PageHeader } from '../../../components/dashboard/PageHeader';

/**
 * Market Prices — live crypto + stock + watchlist.
 *
 * 2026-04-25: created to close the web/Flutter parity gap. Flutter has
 * lib/screens/market_prices_screen.dart (3 tabs: Crypto / Stock Search /
 * Watchlist). Backend endpoints (/api/prices/crypto, /api/prices/stock/{sym},
 * /api/prices/crypto/{sym}) were already wired and used internally for
 * zakat valuation, but never surfaced as a user dashboard page on web.
 *
 * Watchlist persists to localStorage (no server storage on either side
 * today — the Flutter app uses SharedPreferences with the same shape).
 *
 * Backend cache-control: 5-minute s-maxage on each /api/prices/* response,
 * so repeated tab-switches and watchlist refreshes don't hammer the
 * upstream provider.
 */

interface CryptoPrice {
  symbol: string;
  name?: string;
  price: number;
  change24h?: number;
  marketCap?: number;
}

interface StockPrice {
  symbol: string;
  currentPrice: number;
  highPrice?: number;
  lowPrice?: number;
  openPrice?: number;
  previousClose?: number;
}

type Tab = 'crypto' | 'stock' | 'watchlist';

const WATCHLIST_KEY = 'barakah_market_watchlist';

function safeGetWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(s => typeof s === 'string').slice(0, 50);
  } catch {
    return [];
  }
}

function safeSetWatchlist(list: string[]): void {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* private browsing or quota exceeded */
  }
}

function fmtPrice(value: number, currency = 'USD'): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

function fmtChange(pct: number | undefined): { text: string; positive: boolean } {
  if (pct == null || !Number.isFinite(pct)) return { text: '—', positive: false };
  const sign = pct >= 0 ? '+' : '';
  return { text: `${sign}${pct.toFixed(2)}%`, positive: pct >= 0 };
}

export default function MarketPricesPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('crypto');

  // Crypto state
  const [supportedCryptos, setSupportedCryptos] = useState<string[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, CryptoPrice>>({});
  const [loadingCryptos, setLoadingCryptos] = useState(false);

  // Stock search state
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockResult, setStockResult] = useState<StockPrice | null>(null);
  const [searchingStock, setSearchingStock] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistPrices, setWatchlistPrices] = useState<Record<string, StockPrice>>({});

  // Restore watchlist on first mount
  useEffect(() => {
    setWatchlist(safeGetWatchlist());
  }, []);

  // Load supported cryptos + prices when tab opens
  const loadCryptos = useCallback(async () => {
    setLoadingCryptos(true);
    try {
      const list = (await api.getSupportedCryptos()) as { supported?: string[] };
      const supported = Array.isArray(list?.supported) ? list.supported : [];
      setSupportedCryptos(supported);

      // Fetch each crypto's price in parallel. Backend caches each response
      // for 5 minutes (s-maxage), so this is cheap on repeat visits.
      const results = await Promise.allSettled(
        supported.slice(0, 12).map(s =>
          api.getCryptoPrice(s).then(r => [s, r] as const),
        ),
      );
      const next: Record<string, CryptoPrice> = {};
      for (const r of results) {
        if (r.status === 'fulfilled') {
          const [sym, payload] = r.value as [string, { price?: CryptoPrice }];
          if (payload?.price) next[sym] = payload.price;
        }
      }
      setCryptoPrices(next);
    } catch (err) {
      logError(err, { context: 'Failed to load crypto prices' });
      toast('Could not load crypto prices. Try again in a moment.', 'error');
    } finally {
      setLoadingCryptos(false);
    }
  }, [toast]);

  useEffect(() => {
    if (tab === 'crypto' && supportedCryptos.length === 0) {
      void loadCryptos();
    }
  }, [tab, supportedCryptos.length, loadCryptos]);

  // Load watchlist prices when watchlist tab opens or watchlist changes
  const loadWatchlistPrices = useCallback(async () => {
    if (watchlist.length === 0) {
      setWatchlistPrices({});
      return;
    }
    const results = await Promise.allSettled(
      watchlist.map(sym =>
        api.getStockPrice(sym).then(r => [sym, r] as const),
      ),
    );
    const next: Record<string, StockPrice> = {};
    for (const r of results) {
      if (r.status === 'fulfilled') {
        const [sym, payload] = r.value as [string, { price?: StockPrice }];
        if (payload?.price) next[sym] = payload.price;
      }
    }
    setWatchlistPrices(next);
  }, [watchlist]);

  useEffect(() => {
    if (tab === 'watchlist') {
      void loadWatchlistPrices();
    }
  }, [tab, loadWatchlistPrices]);

  const handleStockSearch = async () => {
    const sym = stockSymbol.trim().toUpperCase();
    if (!sym) {
      setStockError('Enter a ticker symbol (e.g. AAPL)');
      return;
    }
    setSearchingStock(true);
    setStockError(null);
    setStockResult(null);
    try {
      const r = (await api.getStockPrice(sym)) as { price?: StockPrice };
      if (!r?.price) {
        setStockError('No price data returned. Check the symbol and try again.');
      } else {
        setStockResult(r.price);
      }
    } catch (err) {
      logError(err, { context: 'Stock price lookup', symbol: sym });
      setStockError('Could not fetch price. The provider may be rate-limiting; try again in a moment.');
    } finally {
      setSearchingStock(false);
    }
  };

  const addToWatchlist = (sym: string) => {
    const upper = sym.trim().toUpperCase();
    if (!upper || watchlist.includes(upper)) return;
    if (watchlist.length >= 50) {
      toast('Watchlist limit (50) reached. Remove one to add another.', 'error');
      return;
    }
    const next = [...watchlist, upper];
    setWatchlist(next);
    safeSetWatchlist(next);
    toast(`${upper} added to watchlist`, 'success');
  };

  const removeFromWatchlist = (sym: string) => {
    const next = watchlist.filter(s => s !== sym);
    setWatchlist(next);
    safeSetWatchlist(next);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Market Prices"
        subtitle="Live crypto and stock prices. Used for zakat asset valuation and general market reference."
        className="mb-4"
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-4">
        {(['crypto', 'stock', 'watchlist'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              tab === t
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-gray-600 hover:bg-green-50 hover:text-primary'
            }`}
          >
            {t === 'crypto' && '💎 Crypto'}
            {t === 'stock' && '📈 Stock Search'}
            {t === 'watchlist' && `⭐ Watchlist${watchlist.length ? ` (${watchlist.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Crypto tab */}
      {tab === 'crypto' && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Top {Math.min(supportedCryptos.length, 12)} cryptos</p>
            <button
              type="button"
              onClick={() => void loadCryptos()}
              disabled={loadingCryptos}
              className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
            >
              {loadingCryptos ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          {loadingCryptos && Object.keys(cryptoPrices).length === 0 ? (
            <div className="text-center py-12 text-gray-400">Loading crypto prices…</div>
          ) : Object.keys(cryptoPrices).length === 0 ? (
            <div className="text-center py-12 text-gray-400">No crypto prices available right now.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {Object.entries(cryptoPrices).map(([sym, price]) => {
                const ch = fmtChange(price.change24h);
                return (
                  <li key={sym} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-800">{sym}</p>
                      {price.name && <p className="text-xs text-gray-500">{price.name}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{fmtPrice(price.price)}</p>
                      <p className={`text-xs font-medium ${ch.positive ? 'text-green-600' : 'text-red-600'}`}>
                        24h {ch.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-center text-xs text-gray-400 mt-4">
            Prices cached up to 5 min server-side · for reference only, not financial advice.
          </p>
        </div>
      )}

      {/* Stock search tab */}
      {tab === 'stock' && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Look up a stock by ticker</p>
          <div className="flex gap-2">
            <input
              value={stockSymbol}
              onChange={e => setStockSymbol(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStockSearch()}
              placeholder="Ticker (e.g. AAPL, TSLA)"
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary uppercase"
              maxLength={10}
            />
            <button
              type="button"
              onClick={handleStockSearch}
              disabled={searchingStock || !stockSymbol.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {searchingStock ? '…' : 'Look Up'}
            </button>
          </div>
          {stockError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mt-3">
              {stockError}
            </div>
          )}
          {stockResult && (
            <div className="mt-4 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold text-primary">{stockResult.symbol}</p>
                <button
                  type="button"
                  onClick={() => addToWatchlist(stockResult.symbol)}
                  disabled={watchlist.includes(stockResult.symbol)}
                  className="text-xs px-3 py-1 rounded-full border border-primary text-primary font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {watchlist.includes(stockResult.symbol) ? 'In watchlist ✓' : '+ Add to watchlist'}
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-800">{fmtPrice(stockResult.currentPrice)}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
                {stockResult.openPrice != null && <p>Open: <span className="font-medium">{fmtPrice(stockResult.openPrice)}</span></p>}
                {stockResult.previousClose != null && <p>Prev close: <span className="font-medium">{fmtPrice(stockResult.previousClose)}</span></p>}
                {stockResult.highPrice != null && <p>High: <span className="font-medium">{fmtPrice(stockResult.highPrice)}</span></p>}
                {stockResult.lowPrice != null && <p>Low: <span className="font-medium">{fmtPrice(stockResult.lowPrice)}</span></p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Watchlist tab */}
      {tab === 'watchlist' && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {watchlist.length === 0 ? (
            <EmptyState
              variant="bare"
              icon="⭐"
              title="Build your market watchlist"
              description="Track gold (PAXG), Shariah-compliant stocks, or anything you check often. Prices refresh every 5 minutes."
              actions={[
                { label: 'Search a stock', onClick: () => setTab('stock'), primary: true },
              ]}
              preview={
                <div className="space-y-2">
                  {[
                    { sym: 'PAXG', desc: 'Pax Gold', price: '$4,705.20', ch: '+2.1%', cls: 'text-green-600' },
                    { sym: 'AAPL', desc: 'Apple Inc.', price: '$235.40', ch: '+0.4%', cls: 'text-green-600' },
                    { sym: 'BTC', desc: 'Bitcoin', price: '$108,420', ch: '+1.8%', cls: 'text-green-600' },
                  ].map((s) => (
                    <div key={s.sym} className="bg-white rounded-xl p-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-gray-700">{s.sym}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-700">{s.price}</p>
                        <p className={`text-xs font-medium ${s.cls}`}>{s.ch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Watching {watchlist.length} stock{watchlist.length === 1 ? '' : 's'}</p>
                <button
                  type="button"
                  onClick={() => void loadWatchlistPrices()}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Refresh
                </button>
              </div>
              <ul className="divide-y divide-gray-100">
                {watchlist.map(sym => {
                  const price = watchlistPrices[sym];
                  const change = price && price.previousClose
                    ? ((price.currentPrice - price.previousClose) / price.previousClose) * 100
                    : undefined;
                  const ch = fmtChange(change);
                  return (
                    <li key={sym} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{sym}</p>
                        {price?.previousClose != null && <p className="text-xs text-gray-500">Prev close {fmtPrice(price.previousClose)}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{price ? fmtPrice(price.currentPrice) : '—'}</p>
                          {change != null && (
                            <p className={`text-xs font-medium ${ch.positive ? 'text-green-600' : 'text-red-600'}`}>{ch.text}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromWatchlist(sym)}
                          aria-label={`Remove ${sym} from watchlist`}
                          className="text-gray-400 hover:text-red-600 px-2"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
