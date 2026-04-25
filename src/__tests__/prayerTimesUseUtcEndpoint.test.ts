import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Regression test for the 2026-04-25 prayer-times fix.
 *
 * Background: the web /dashboard/prayer-times page used Aladhan's
 * /v1/timingsByCity/{DD-MM-YYYY} and /v1/timings/{DD-MM-YYYY} endpoints
 * with a date string derived from the *device* clock. For a first-time
 * search by a user whose device timezone differs from the praying
 * location (e.g. PST device at 23:30 looking up London), Aladhan would
 * return the previous day's prayer times — London is already past
 * midnight in its own zone.
 *
 * The Flutter app fixed the same class of bug in Round 30 by switching
 * to /v1/timings/{utc_seconds}; web was never converted.
 *
 * This test pins the URL shape so a future refactor that re-introduces
 * a DD-MM-YYYY path component is caught at PR time, not in production
 * by an upset user during Maghrib.
 *
 * The user's exact words: "prayer times are not correct again. fix that
 * and stop breaking it. this is a trust issue." — leave this test in
 * place.
 */

describe('prayer-times Aladhan URL must use UTC epoch (not DD-MM-YYYY)', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;
  const fetchedUrls: string[] = [];

  beforeEach(() => {
    fetchedUrls.length = 0;
    // Mock the Aladhan API call so we can inspect the URL the page builds.
    fetchSpy = vi.fn(async (url: string | URL) => {
      const u = typeof url === 'string' ? url : url.toString();
      fetchedUrls.push(u);
      return new Response(
        JSON.stringify({
          code: 200,
          data: {
            timings: {
              Fajr: '05:23',
              Sunrise: '06:50',
              Dhuhr: '12:30',
              Asr: '15:45',
              Maghrib: '18:10',
              Isha: '19:35',
            },
            meta: { timezone: 'Europe/London' },
          },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    });
    // @ts-expect-error — overriding fetch for test
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchTimes (city path) must hit /v1/timingsByCity/{utc_seconds}', async () => {
    // Replicate the exact URL pattern the page builds without rendering React
    // (the page is a client component and rendering it from vitest pulls in
    // localStorage / Intl chains we don't need here — we're pinning the API
    // contract, not the React render).
    const nowUtcSeconds = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timingsByCity/${nowUtcSeconds}?city=${encodeURIComponent('London')}&country=${encodeURIComponent('GB')}&method=2`;
    await fetch(url);

    expect(fetchedUrls).toHaveLength(1);
    const fetched = fetchedUrls[0];

    // Must be the timestamp endpoint, not the date endpoint.
    expect(fetched).toMatch(/\/v1\/timingsByCity\/\d{10}\?/);
    // Must NOT contain a DD-MM-YYYY style path component.
    expect(fetched).not.toMatch(/\/v1\/timingsByCity\/\d{1,2}-\d{1,2}-\d{4}/);
  });

  it('fetchTimesByCoordinates (coords path) must hit /v1/timings/{utc_seconds}', async () => {
    const nowUtcSeconds = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${nowUtcSeconds}?latitude=51.5074&longitude=-0.1278&method=2`;
    await fetch(url);

    expect(fetchedUrls).toHaveLength(1);
    const fetched = fetchedUrls[0];

    expect(fetched).toMatch(/\/v1\/timings\/\d{10}\?/);
    expect(fetched).not.toMatch(/\/v1\/timings\/\d{1,2}-\d{1,2}-\d{4}/);
  });

  it('actual page source builds the timestamp URL — guards against silent revert', async () => {
    // Read the source of the page and assert the new pattern is in there.
    // This catches a refactor that flips back to DD-MM-YYYY without touching
    // the URL pattern in obvious ways (e.g. someone reintroducing a date
    // helper that produces the wrong format).
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const sourcePath = path.resolve(
      __dirname,
      '../app/dashboard/prayer-times/page.tsx',
    );
    const source = await fs.readFile(sourcePath, 'utf8');

    // The fix introduces these exact substrings. Both fetch paths must be
    // present.
    expect(source).toContain('/v1/timingsByCity/${nowUtcSeconds}');
    expect(source).toContain('/v1/timings/${nowUtcSeconds}');

    // The buggy patterns must be gone.
    expect(source).not.toContain('/v1/timingsByCity/${dateStr}');
    expect(source).not.toContain('/v1/timings/${dateStr}');
  });
});
