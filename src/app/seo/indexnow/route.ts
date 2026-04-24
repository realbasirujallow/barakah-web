import { NextResponse } from 'next/server';

/**
 * IndexNow submission endpoint.
 *
 * IndexNow is a joint protocol from Microsoft Bing + Yandex that lets
 * a site proactively tell search engines about new or updated URLs —
 * far faster than waiting for the next crawler visit. Submissions also
 * propagate to Seznam, Naver, and other partner engines.
 *
 * Usage:
 *   POST /seo/indexnow
 *     body: { "urls": ["https://trybarakah.com/learn/halal-budgeting", ...] }
 *
 *   GET /seo/indexnow?url=https://trybarakah.com/learn/...
 *     (convenience; shell-script friendly)
 *
 * Lives at /seo/ rather than /api/ because Next.js rewrites proxy every
 * /api/:path* request to the Spring backend (see next.config.ts). This
 * endpoint is Next-native and must not be forwarded.
 *
 * Auth: requires env INDEXNOW_KEY. The key must also be served as plain
 * text at https://trybarakah.com/<INDEXNOW_KEY>.txt (the GET verifier
 * endpoint for the protocol). That's handled by a sibling route at
 * /app/[key].txt/route.ts — see the layout comment.
 *
 * Why not just rely on the sitemap? Sitemaps are polled on the engine's
 * schedule (often days). IndexNow is real-time — the engine fetches the
 * URL within minutes, which matters for seasonal Ramadan / new-ticker /
 * zakat-year-boundary content.
 */

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

const HOST = 'trybarakah.com';
const KEY_LOCATION = `https://${HOST}/indexnow-key.txt`;

function getKey(): string | null {
  return process.env.INDEXNOW_KEY?.trim() || null;
}

function normalizeUrls(input: unknown): string[] {
  if (!input) return [];
  const raw = Array.isArray(input) ? input : [input];
  return raw
    .filter((u): u is string => typeof u === 'string' && u.length > 0)
    .map(u => u.trim())
    .filter(u => {
      try {
        const parsed = new URL(u);
        return parsed.hostname === HOST && parsed.protocol === 'https:';
      } catch {
        return false;
      }
    })
    .slice(0, 10_000); // IndexNow hard cap per submission
}

async function submitToIndexNow(urls: string[], key: string) {
  const payload = {
    host: HOST,
    key,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const results = await Promise.allSettled(
    INDEXNOW_ENDPOINTS.map(async endpoint => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Host: new URL(endpoint).host,
        },
        body: JSON.stringify(payload),
      });
      return { endpoint, status: res.status, statusText: res.statusText };
    }),
  );

  return results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { endpoint: 'unknown', status: -1, statusText: (r.reason as Error)?.message ?? 'submission failed' },
  );
}

export async function POST(req: Request) {
  const key = getKey();
  if (!key) {
    return NextResponse.json(
      { error: 'INDEXNOW_KEY not configured' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const urls = normalizeUrls(
    body && typeof body === 'object' && 'urls' in body
      ? (body as { urls: unknown }).urls
      : null,
  );

  if (urls.length === 0) {
    return NextResponse.json(
      { error: 'No valid URLs. Must be https://trybarakah.com/* and at most 10,000 per call.' },
      { status: 400 },
    );
  }

  const responses = await submitToIndexNow(urls, key);
  return NextResponse.json({ submitted: urls.length, responses });
}

export async function GET(req: Request) {
  const key = getKey();
  if (!key) {
    return NextResponse.json(
      { error: 'INDEXNOW_KEY not configured' },
      { status: 503 },
    );
  }

  const url = new URL(req.url).searchParams.get('url');
  const urls = normalizeUrls(url);
  if (urls.length === 0) {
    return NextResponse.json(
      { error: 'Provide ?url=https://trybarakah.com/<path>' },
      { status: 400 },
    );
  }

  const responses = await submitToIndexNow(urls, key);
  return NextResponse.json({ submitted: urls.length, responses });
}
