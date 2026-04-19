'use client';

import { useEffect, useState } from 'react';

// Estimated first fast of Ramadan 1448 AH — subject to lunar sighting.
// The Umm al-Qura and most Western calendars converge on evening of
// 16 Feb 2027, with the first day of fasting on 17 Feb 2027.
const RAMADAN_START_UTC = Date.UTC(2027, 1, 17, 0, 0, 0);

function diff(from: number, to: number) {
  const ms = Math.max(0, to - from);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return { days, hours, minutes, isZero: ms === 0 };
}

export default function RamadanCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return (
      <div
        className="mb-8 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
        aria-live="polite"
      >
        <p className="text-sm text-gray-500">Loading countdown…</p>
      </div>
    );
  }

  const { days, hours, minutes, isZero } = diff(now, RAMADAN_START_UTC);

  if (isZero) {
    return (
      <div className="mb-8 rounded-2xl bg-[#1B5E20] p-6 text-white">
        <p className="text-lg font-bold">Ramadan Mubarak 🌙</p>
        <p className="text-sm text-green-100 mt-1">Ramadan 1448 AH has begun, in sha&apos; Allah.</p>
      </div>
    );
  }

  return (
    <div
      className="mb-8 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
      aria-live="polite"
    >
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">
        Countdown to Ramadan 1448 AH · estimated first fast
      </p>
      <div className="flex items-baseline gap-4 flex-wrap">
        <div>
          <div className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">{days}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">days</div>
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">{hours}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">hours</div>
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-extrabold text-[#1B5E20]">{minutes}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">min</div>
        </div>
      </div>
      <p className="text-xs italic text-gray-500 mt-3">
        Actual first fast depends on local lunar sighting. Countdown targets 17 Feb 2027 UTC.
      </p>
    </div>
  );
}
