'use client';
import { useEffect, useState, useCallback, useRef } from 'react';

interface PrayerTimings { Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string; }

interface CitySuggestion {
  city: string;
  country: string;
  countryCode: string;
  displayName: string;
}

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const PRAYER_ICONS: Record<string, string> = { Fajr: '🌙', Sunrise: '🌅', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌇', Isha: '🌃' };
const PRAYER_LABELS: Record<string, string> = { Fajr: 'Fajr', Sunrise: 'Sunrise', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' };

/**
 * Parse a time string from the Aladhan API.
 * Aladhan returns times already in 24h format: "05:23" or "05:23 (BST)".
 * We just extract HH:MM and leave it as-is — no 12h conversion needed.
 */
function parseTime(timeStr: string): string {
  const match = (timeStr || '').match(/(\d{1,2}):(\d{2})/);
  if (!match) return '00:00';
  const h = String(parseInt(match[1], 10)).padStart(2, '0');
  const m = match[2];
  return `${h}:${m}`;
}

function getNextPrayer(timings: PrayerTimings): string {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
  for (const p of prayers) {
    const t = parseTime((timings as unknown as Record<string, string>)[p]);
    const [h, m] = t.split(':').map(Number);
    if (h * 60 + m > nowMinutes) return p;
  }
  return 'Fajr'; // next day
}

function getCountdown(timeStr: string): string {
  const t = parseTime(timeStr);
  const [h, m] = t.split(':').map(Number);
  const now = new Date();
  let diff = (h * 60 + m) - (now.getHours() * 60 + now.getMinutes());
  if (diff < 0) diff += 1440;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

const CALC_METHODS = [
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 1, name: 'Muslim World League (MWL)' },
  { id: 3, name: 'Egyptian General Authority' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'University of Islamic Sciences, Karachi' },
  { id: 99, name: 'Custom / Other' },
];

export default function PrayerTimesPage() {
  const [timings, setTimings]       = useState<PrayerTimings | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [city, setCity]             = useState('');
  const [country, setCountry]       = useState('');
  const [method, setMethod]         = useState(2);
  const [searched, setSearched]     = useState(false);
  const [now, setNow]               = useState(new Date());

  // Autocomplete state
  const [suggestions, setSuggestions]     = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clock tick every minute
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch city suggestions from Nominatim (OpenStreetMap) as user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = city.trim();
    if (trimmed.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=7&addressdetails=1&featuretype=city`;
        const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        const data: Array<Record<string, unknown>> = await res.json();

        const seen = new Set<string>();
        const results: CitySuggestion[] = [];
        for (const item of data) {
          const addr = (item.address || {}) as Record<string, string>;
          const cityName = addr.city || addr.town || addr.village || addr.county || addr.municipality || '';
          const countryName = addr.country || '';
          const countryCode = (addr.country_code || '').toUpperCase();
          if (!cityName) continue;
          const key = `${cityName}|${countryCode}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const displayName = addr.state
            ? `${cityName}, ${addr.state}, ${countryName}`
            : `${cityName}, ${countryName}`;
          results.push({ city: cityName, country: countryCode || countryName, countryCode, displayName });
          if (results.length >= 6) break;
        }
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [city]);

  const handleSelectSuggestion = (s: CitySuggestion) => {
    setCity(s.city);
    setCountry(s.countryCode || s.country);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const fetchTimes = useCallback(async (c: string, co: string, m: number) => {
    if (!c.trim() || !co.trim()) return;
    setLoading(true); setError(null);
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(c)}&country=${encodeURIComponent(co)}&method=${m}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.code === 200 && data.data?.timings) {
        setTimings(data.data.timings as PrayerTimings);
        setSearched(true);
      } else {
        setError('City not found. Please check your city and country name.');
      }
    } catch {
      setError('Could not fetch prayer times. Please try again.');
    }
    setLoading(false);
  }, []);

  // Try to restore last search from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('prayerTimesLocation');
    if (saved) {
      try {
        const { city: c, country: co, method: m } = JSON.parse(saved);
        setCity(c); setCountry(co); setMethod(m);
        fetchTimes(c, co, m);
      } catch {}
    }
  }, [fetchTimes]);

  const handleSearch = () => {
    setShowSuggestions(false);
    localStorage.setItem('prayerTimesLocation', JSON.stringify({ city, country, method }));
    fetchTimes(city, country, method);
  };

  const nextPrayer = timings ? getNextPrayer(timings) : null;

  const today   = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">🕌 Prayer Times</h1>
        <p className="text-gray-500 text-sm mt-1">{dateStr} · {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* Location search */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Your Location</p>
        <div className="flex gap-2 flex-wrap">

          {/* City input with autocomplete */}
          <div className="relative flex-1 min-w-[200px]" ref={suggestionsRef}>
            <input
              value={city}
              onChange={e => { setCity(e.target.value); setShowSuggestions(true); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); if (e.key === 'Escape') setShowSuggestions(false); }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="City (e.g. London)"
              autoComplete="off"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B5E20]"
            />
            {loadingSuggestions && (
              <span className="absolute right-3 top-2.5 text-gray-400 text-xs">...</span>
            )}

            {/* Dropdown suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 hover:text-[#1B5E20] border-b border-gray-50 last:border-b-0 transition-colors"
                    onMouseDown={e => { e.preventDefault(); handleSelectSuggestion(s); }}
                  >
                    <span className="font-medium">{s.city}</span>
                    <span className="text-gray-400 ml-1 text-xs">{s.displayName.includes(',') ? s.displayName.slice(s.city.length) : `, ${s.country}`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            value={country}
            onChange={e => setCountry(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Country code (e.g. GB)"
            className="w-36 border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1B5E20]"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !city || !country}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E7D32] disabled:opacity-50 transition"
          >
            {loading ? '...' : 'Get Times'}
          </button>
        </div>
        <div className="mt-3">
          <select
            value={method}
            onChange={e => setMethod(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#1B5E20]"
          >
            {CALC_METHODS.map(cm => <option key={cm.id} value={cm.id}>{cm.name}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">{error}</div>
      )}

      {timings && (
        <>
          {/* Next prayer highlight */}
          {nextPrayer && (
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 text-white mb-4">
              <p className="text-green-200 text-sm">Next Prayer</p>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <p className="text-3xl font-bold">{PRAYER_ICONS[nextPrayer]} {PRAYER_LABELS[nextPrayer]}</p>
                  <p className="text-green-200 text-sm mt-1">at {(timings as unknown as Record<string, string>)[nextPrayer]}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{getCountdown((timings as unknown as Record<string, string>)[nextPrayer])}</p>
                  <p className="text-green-200 text-xs">remaining</p>
                </div>
              </div>
            </div>
          )}

          {/* All prayers grid */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {PRAYER_ORDER.map((prayer, i) => {
              const isNext     = prayer === nextPrayer;
              const isSunrise  = prayer === 'Sunrise';
              return (
                <div
                  key={prayer}
                  className={`flex items-center justify-between px-5 py-4 ${i < PRAYER_ORDER.length - 1 ? 'border-b border-gray-100' : ''} ${isNext ? 'bg-green-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{PRAYER_ICONS[prayer]}</span>
                    <div>
                      <p className={`font-semibold ${isNext ? 'text-[#1B5E20]' : 'text-gray-800'} ${isSunrise ? 'text-gray-500' : ''}`}>
                        {PRAYER_LABELS[prayer]}
                      </p>
                      {isSunrise && <p className="text-xs text-gray-400">Not a salah — marks end of Fajr time</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${isNext ? 'text-[#1B5E20]' : isSunrise ? 'text-gray-400' : 'text-gray-700'}`}>
                      {(timings as unknown as Record<string, string>)[prayer]}
                    </p>
                    {isNext && (
                      <p className="text-xs text-[#1B5E20] font-medium">
                        {getCountdown((timings as unknown as Record<string, string>)[prayer])} away
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Prayer times provided by{' '}
            <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Aladhan.com</a>
            {searched && city && ` for ${city}, ${country}`}
          </p>
        </>
      )}

      {!searched && !loading && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🕌</p>
          <p className="font-medium text-gray-600">Enter your city to see prayer times</p>
          <p className="text-sm mt-1">Times are calculated using established Islamic methods</p>
        </div>
      )}
    </div>
  );
}
