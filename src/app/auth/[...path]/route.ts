import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth proxy route handler — forwards /auth/* requests to the backend
 * and properly passes Set-Cookie headers through to the browser.
 *
 * Next.js rewrite rules (in next.config.ts) do NOT forward Set-Cookie
 * headers from the upstream server to the browser. This means httpOnly
 * cookies like auth_token and refresh_token set by the backend never
 * reach the browser, breaking session persistence on hard refresh.
 *
 * This Route Handler replaces the rewrite for /auth/* paths by:
 *   1. Forwarding the request (with cookies) to the backend
 *   2. Copying ALL Set-Cookie headers from the backend response
 *   3. Returning the body + headers to the browser
 */

// H-R4-2 fix (2026-04-18): fail closed on missing BACKEND_URL in production.
// Previously this silently fell back to https://api.trybarakah.com, which
// could route a misconfigured non-prod deploy at the prod backend. In
// production we now refuse to serve auth traffic without an explicit URL;
// in dev we keep the localhost-friendly fallback.
const RAW_BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';

// GitHub Actions build should not require prod env vars — see next.config.ts
// for the matching rationale. Railway / Vercel / any real production deploy
// does not set GITHUB_ACTIONS, so the hard-fail still fires where it matters.
if (
  process.env.NODE_ENV === 'production' &&
  process.env.GITHUB_ACTIONS !== 'true' &&
  !RAW_BACKEND_URL
) {
  throw new Error(
    'Auth proxy misconfigured: BACKEND_URL (or NEXT_PUBLIC_API_URL) must be ' +
    'set in production. Refusing to default to https://api.trybarakah.com.'
  );
}

const BACKEND_URL = RAW_BACKEND_URL || 'https://api.trybarakah.com';

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const backendPath = '/auth/' + path.join('/');
  const url = new URL(backendPath, BACKEND_URL);

  // Forward query parameters (e.g., ?token=xxx for verify-email)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  // Forward headers (including cookies for httpOnly auth)
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('Cookie', cookie);

  // Forward CSRF token
  const csrf = request.headers.get('x-xsrf-token');
  if (csrf) headers.set('X-XSRF-TOKEN', csrf);

  // Forward idempotency key
  const idempotency = request.headers.get('idempotency-key');
  if (idempotency) headers.set('Idempotency-Key', idempotency);

  // Forward the real client IP — R5 audit (2026-04-21):
  //
  // Previously we relayed whatever X-Forwarded-For the caller sent us.
  // Because the backend RateLimitService honours XFF when
  // TRUST_PROXY=true (its default in production behind Cloudflare/
  // Railway), a client could script arbitrary XFF values to rotate their
  // apparent IP identity and dilute the IP-keyed brute-force throttle on
  // /auth/login, /auth/forgot-password, /auth/refresh, /auth/admin-verify.
  //
  // Vercel populates request.headers.get('x-forwarded-for') with the
  // authenticated edge-derived chain (comma-separated, right-most = the
  // Vercel edge, left-most = the originating client). We want the
  // LEFT-MOST entry, which is the real client IP, and we discard anything
  // the attacker prepended by trimming to the first segment.
  const xffRaw = request.headers.get('x-forwarded-for') ?? '';
  const clientIp = xffRaw.split(',')[0]?.trim();
  // Only relay if the left-most segment looks like an IP literal — this
  // drops obviously spoofed values like "127.0.0.1, 8.8.8.8" or random
  // strings stuffed in by a malicious client.
  if (clientIp && /^[0-9a-f:.]+$/i.test(clientIp)) {
    headers.set('X-Forwarded-For', clientIp);
  }

  let body: string | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.text();
    } catch {
      // No body — that's fine for some requests
    }
  }

  // Abort the upstream call if the backend hangs beyond 30s so the route
  // handler returns a proper 504 instead of holding the socket open.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);
  let backendRes: Response;
  try {
    backendRes = await fetch(url.toString(), {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Upstream auth service timed out. Please try again.' },
        { status: 504 },
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  // Build response with backend body.
  // Per the Fetch spec, a "null body status" (101, 103, 204, 205, 304) MUST
  // have a null body — passing any body (including an empty string) makes
  // `new Response(...)` throw `TypeError: Invalid response status code 204`.
  // This fired in production whenever the backend answered /auth/csrf with
  // 204 No Content. Normalize to null for those statuses.
  const NULL_BODY_STATUSES = new Set([101, 103, 204, 205, 304]);
  const responseBody = NULL_BODY_STATUSES.has(backendRes.status)
    ? null
    : await backendRes.text();
  const response = new NextResponse(responseBody, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  // Copy content-type
  const resContentType = backendRes.headers.get('content-type');
  if (resContentType) response.headers.set('Content-Type', resContentType);

  // Copy ALL Set-Cookie headers — this is the critical part that
  // next.config.ts rewrites fail to do.
  // Use getSetCookie() if available (Node 20+), fall back to raw header.
  if (typeof backendRes.headers.getSetCookie === 'function') {
    const setCookies = backendRes.headers.getSetCookie();
    for (const c of setCookies) {
      response.headers.append('Set-Cookie', c);
    }
  } else {
    // Fallback for older Node: raw header access
    const raw = backendRes.headers.get('set-cookie');
    if (raw) {
      // Multiple Set-Cookie headers are comma-joined by the fetch spec,
      // but cookies themselves can contain commas in Expires. Split on
      // patterns that look like a new cookie name start.
      const parts = raw.split(/,(?=\s*[A-Za-z_-]+=)/);
      for (const c of parts) {
        response.headers.append('Set-Cookie', c.trim());
      }
    }
  }

  // Copy CORS headers
  for (const [key, value] of backendRes.headers.entries()) {
    if (key.startsWith('access-control-') || key === 'vary') {
      response.headers.set(key, value);
    }
  }

  // Copy security headers
  const securityHeaders = [
    'cache-control', 'pragma', 'expires',
    'x-content-type-options', 'x-frame-options',
    'referrer-policy', 'content-security-policy',
  ];
  for (const name of securityHeaders) {
    const val = backendRes.headers.get(name);
    if (val) response.headers.set(name, val);
  }

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
