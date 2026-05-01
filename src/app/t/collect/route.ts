import { NextRequest, NextResponse } from 'next/server';

const RAW_BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';

const BACKEND_URL = RAW_BACKEND_URL || 'https://api.trybarakah.com';

export async function POST(request: NextRequest) {
  if (!RAW_BACKEND_URL && process.env.NODE_ENV !== 'production') {
    return new NextResponse(null, { status: 204 });
  }

  let body = '{}';
  try {
    body = await request.text();
  } catch {
    body = '{}';
  }

  const headers = new Headers({ 'Content-Type': 'application/json' });
  const passthroughHeaders: Array<[string, string]> = [
    ['user-agent', 'User-Agent'],
    ['accept-language', 'Accept-Language'],
    ['x-forwarded-for', 'X-Forwarded-For'],
    ['x-real-ip', 'X-Real-IP'],
    ['true-client-ip', 'True-Client-IP'],
    ['cf-ipcountry', 'CF-IPCountry'],
    ['x-vercel-ip-country', 'X-Vercel-IP-Country'],
  ];
  for (const [incoming, outgoing] of passthroughHeaders) {
    const value = request.headers.get(incoming);
    if (value) headers.set(outgoing, value);
  }

  const country = request.headers.get('x-vercel-ip-country')
    || request.headers.get('cf-ipcountry')
    || '';
  if (country) headers.set('X-App-Country', country);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4_000);
  try {
    const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/api/traffic/collect`, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
      cache: 'no-store',
    });
    return new NextResponse(null, { status: res.ok ? 202 : res.status });
  } catch {
    return new NextResponse(null, { status: 202 });
  } finally {
    clearTimeout(timeoutId);
  }
}
