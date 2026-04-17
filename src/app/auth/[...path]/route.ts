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

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.trybarakah.com';

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

  // Forward the real client IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) headers.set('X-Forwarded-For', forwarded);

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

  // Build response with backend body
  const responseBody = await backendRes.text();
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
