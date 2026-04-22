import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /email-capture
 *
 * Lightweight lead capture for learn-page email widgets.
 *
 * Body: { email: string, source: string }
 *
 * ── R5-H1 fix (2026-04-18 later): moved out of /api/* ──────────────────────
 *
 * Cloudflare/Railway edge routing forwards `trybarakah.com/api/*` directly to
 * the Spring Boot service at api.trybarakah.com. That meant the prior path
 * `/api/email-capture` never reached this Next.js handler — every waitlist
 * POST hit the backend, was rejected by Spring Security's CSRF filter with
 * `application/json;charset=ISO-8859-1` "CSRF token validation failed", and
 * the M-R4-1 Resend-Audience fix (below) was not actually executing in
 * production. Renamed to `/email-capture` (no `/api/` prefix) so it reaches
 * the Next.js runtime.
 *
 * ── M-R4-1 fix (2026-04-18): wire to durable storage ───────────────────────
 *
 * Prior behaviour: logged `source=... captured=1` and dropped the email on
 * the floor. A Medium audit finding because it silently lost every lead
 * captured from the learn pages — the route returned 200 OK but nothing
 * downstream ever saw the email.
 *
 * New behaviour: when RESEND_API_KEY and RESEND_AUDIENCE_ID are both set we
 * forward the address to the Resend Audiences API, which is durable managed
 * storage (Resend handles de-duplication, GDPR opt-out links, export to CSV,
 * and is already wired for transactional mail). When either env var is
 * missing we still accept the submission (so the UX doesn't regress) but
 * log a loud warning in production — operators can grep for
 * "email-capture: durable storage disabled" in Railway logs to catch a
 * misconfiguration.
 *
 * Environment variables:
 *   RESEND_API_KEY        — same key already used for transactional mail
 *   RESEND_AUDIENCE_ID    — UUID from https://resend.com/audiences
 *   EMAIL_CAPTURE_TIMEOUT — optional ms override for the Resend call (default 4000)
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

// ── Redis-backed rate limit (Railway's REDIS_URL) ──────────────────────────
// When REDIS_URL is set (backend and web share the same Railway Redis plugin
// or a web-specific one) we use Redis so multiple Next.js instances share
// one rate-limit state. Keys are prefixed "wrl:email-capture:" so they don't
// collide with the Spring backend's "rl:*" keys in the same Redis.
//
// When REDIS_URL is absent (local dev, preview deployments), the in-memory
// limiter below is used. Fine for single-instance or testing contexts.
//
// ioredis gets imported lazily inside the helper so `npm run build` in a
// non-Redis environment doesn't need the runtime package installed.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redisClient: any = null;
let redisInitFailed = false;

async function getRedis() {
  if (redisClient) return redisClient;
  if (redisInitFailed) return null;
  const url = process.env.REDIS_URL;
  if (!url) {
    redisInitFailed = true;
    return null;
  }
  try {
    const { default: Redis } = await import('ioredis');
    redisClient = new Redis(url, {
      // Short connect timeout — if Redis is unreachable we fall back to the
      // in-memory limiter rather than stalling every request for seconds.
      connectTimeout: 2_000,
      commandTimeout: 1_500,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    redisClient.on('error', (err: Error) => {
      console.warn('[email-capture] Redis error:', err.message);
    });
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.warn('[email-capture] Redis init failed, using in-memory fallback:', err);
    redisInitFailed = true;
    return null;
  }
}

async function isRateLimitedRedis(ip: string): Promise<boolean | null> {
  const redis = await getRedis();
  if (!redis) return null; // caller falls back to in-memory
  const key = `wrl:email-capture:${ip}`;
  try {
    // INCR + PEXPIRE in a pipeline keeps it to one round-trip. If PEXPIRE
    // fires on the same existing key it's a no-op, which is fine — the
    // original TTL still governs expiry.
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.pexpire(key, RATE_LIMIT_WINDOW_MS);
    const results: [Error | null, number | string][] = await pipeline.exec();
    const count = Number(results?.[0]?.[1] ?? 0);
    return count > RATE_LIMIT_MAX;
  } catch (err) {
    // Fail open — never block lead capture on Redis flake.
    console.warn('[email-capture] Redis INCR failed, failing open:', err);
    return false;
  }
}

// ── In-process IP rate limit fallback ──────────────────────────────────────
// Used when REDIS_URL isn't configured or Redis is unreachable.
//
// Implemented as a true LRU: on every access (hit OR miss) we delete-then-
// insert the key so the Map's insertion-order iteration puts the freshest
// key at the tail and the coldest at the head. Eviction then walks from the
// head, guaranteeing we drop the least-recently-touched IP — not just the
// least-recently-inserted. Prior revision used plain `set` on hit, leaving
// hot-but-not-re-inserted entries floating near the head and making it
// possible for a long-standing abuser to slip past eviction while recent
// first-time visitors got purged.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
// Cap the map so a botnet spamming unique IPs can't exhaust memory.
const RATE_LIMIT_MAX_ENTRIES = 10_000;

function evictIfOverCap(): void {
  if (rateLimitMap.size <= RATE_LIMIT_MAX_ENTRIES) return;
  const excess = rateLimitMap.size - RATE_LIMIT_MAX_ENTRIES;
  const it = rateLimitMap.keys();
  for (let i = 0; i < excess; i++) {
    const next = it.next();
    if (next.done) break;
    rateLimitMap.delete(next.value);
  }
}

function touchLru(ip: string, value: { count: number; resetAt: number }): void {
  // delete + set = move-to-tail; keeps Map iteration order aligned with LRU.
  rateLimitMap.delete(ip);
  rateLimitMap.set(ip, value);
}

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    // New window. Insert at tail, then trim from head if over cap.
    touchLru(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    evictIfOverCap();
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    // Still touch LRU so that hot (even if blocked) IPs stay remembered
    // until their window expires — dropping them mid-window would reset
    // their counter and let the abuser keep going.
    touchLru(ip, entry);
    return true;
  }
  entry.count++;
  touchLru(ip, entry);
  return false;
}

async function isRateLimited(ip: string): Promise<boolean> {
  const redisResult = await isRateLimitedRedis(ip);
  if (redisResult !== null) return redisResult;
  return isRateLimitedInMemory(ip);
}

// R11 audit M-3 (2026-04-22): the prior implementation trusted the leftmost
// X-Forwarded-For / cf-connecting-ip header value unconditionally, which meant
// anyone reaching the Next origin directly (bypassing Cloudflare / Vercel edge)
// could rotate these headers per request and fragment per-IP rate-limit buckets.
// Hardened version:
//   1. Only honour forwarded-IP headers when TRUST_PROXY=true is set
//      explicitly in the environment. Railway prod deploys are Cloudflare-
//      fronted and should set this; plain Railway / local dev should not.
//   2. Validate the header value is an actual IP literal (IPv4 or IPv6);
//      attacker-supplied non-IP strings fall through to a single bucket.
//   3. If none of the above applies, return a single constant bucket so
//      the per-IP throttle collapses to a global throttle — still rate-
//      limited, just not fragmented per fake IP.
const IP_LITERAL_RE = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}|[0-9a-fA-F:]+)$/;

function looksLikeIp(s: string | null | undefined): s is string {
  return !!s && IP_LITERAL_RE.test(s.trim());
}

function resolveClientIp(req: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY === 'true';
  if (trustProxy) {
    const cfIp = req.headers.get('cf-connecting-ip');
    if (looksLikeIp(cfIp)) return cfIp.trim();
    const xff = req.headers.get('x-forwarded-for');
    if (xff) {
      const parts = xff.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 0 && looksLikeIp(parts[0])) return parts[0];
    }
    const xRealIp = req.headers.get('x-real-ip');
    if (looksLikeIp(xRealIp)) return xRealIp.trim();
  }
  // Without a trusted proxy upstream, any forwarded-IP header is
  // attacker-controlled. Return a constant bucket so all such requests
  // share one rate-limit budget — conservative but not bypassable.
  return 'untrusted-origin';
}

// ── Durable storage via Resend Audiences ──────────────────────────────────
//
// Resend's audience API is a drop-in durable store:
//   POST https://api.resend.com/audiences/{audienceId}/contacts
//   { email, unsubscribed: false }
//
// It returns 201 with a contact UUID, or 200 if the contact already exists
// (the call is idempotent on email). Any other status is a storage error
// that we surface in the log but do NOT propagate to the client — we'd
// rather capture-but-warn than break the UX on a Resend outage.
//
// Returns:
//   "resend:created"   — 2xx from Resend
//   "resend:failed"    — Resend reachable but returned non-2xx
//   "resend:timeout"   — AbortController fired
//   "resend:error"     — unexpected fetch error
//   "disabled"         — RESEND_API_KEY or RESEND_AUDIENCE_ID not set
type DurableResult =
  | 'resend:created'
  | 'resend:failed'
  | 'resend:timeout'
  | 'resend:error'
  | 'disabled';

async function forwardToResendAudience(
  email: string,
  source: string,
): Promise<DurableResult> {
  const apiKey      = process.env.RESEND_API_KEY;
  const audienceId  = process.env.RESEND_AUDIENCE_ID;
  const timeoutMs   = Number(process.env.EMAIL_CAPTURE_TIMEOUT ?? 4000);

  if (!apiKey || !audienceId) {
    // Loud in production — this is the signal that lead capture is NOT
    // durable. Silent in dev / preview so local work isn't noisy.
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[email-capture] durable storage disabled: set RESEND_API_KEY + ' +
        'RESEND_AUDIENCE_ID in Railway to persist leads. Captured addresses ' +
        'are currently being logged-and-dropped.',
      );
    }
    return 'disabled';
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          // Resend doesn't support arbitrary tags on the contact record, but
          // first/last name is free-form — we stash the capture source
          // there so segmentation in the Resend dashboard is possible.
          first_name: source.substring(0, 80),
        }),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(
        `[email-capture] Resend audience write failed status=${res.status} body=${body.substring(0, 200)}`,
      );
      return 'resend:failed';
    }
    return 'resend:created';
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn('[email-capture] Resend audience write timed out');
      return 'resend:timeout';
    }
    console.warn('[email-capture] Resend audience write error:', err);
    return 'resend:error';
  } finally {
    clearTimeout(timer);
  }
}

// R11 audit M-4 (2026-04-22): `source` is forwarded verbatim to Resend's
// audience API as `first_name`, where it's visible to admins viewing the
// audience in the Resend dashboard. An attacker could post a URL-looking
// string and phish support staff on click. Restrict to a known allowlist
// of originating surfaces + strip anything else to a safe bucket.
const SOURCE_ALLOWLIST = new Set<string>([
  'unknown',
  'homepage',
  'pricing',
  'try',
  'refer',
  'signup-bounce',
  'login-bounce',
  'learn',
  'contact',
  'footer',
  'methodology',
  'ambassadors',
  'transparency',
]);

function normalizeSource(raw: string): string {
  const trimmed = raw.trim().substring(0, 64);
  // Reject anything that looks like a URL or contains HTML/control chars.
  if (/[<>"'`{}\\]|:\/\/|javascript:/i.test(trimmed)) return 'rejected';
  // Collapse to allowlist; accept `/learn/...` style slugs up to /learn/x-y-z.
  if (SOURCE_ALLOWLIST.has(trimmed)) return trimmed;
  if (/^[a-z0-9\-_/]{1,64}$/.test(trimmed)) return trimmed;
  return 'other';
}

// R11 audit M-2 (2026-04-22): enforce same-origin for this POST. Without a
// CSRF token check, any site can fire <form action="https://trybarakah.com
// /email-capture"> and drop victim emails into the Resend audience. Require
// an `Origin` header that matches our own host (or absent Sec-Fetch-Site
// → modern browsers always send this for cross-site requests). This keeps
// the endpoint unauthenticated (which it must be — the user isn't logged
// in yet) while rejecting off-origin form submissions.
function isSameOriginRequest(req: NextRequest): boolean {
  const sfs = req.headers.get('sec-fetch-site');
  if (sfs) {
    return sfs === 'same-origin' || sfs === 'same-site' || sfs === 'none';
  }
  const origin = req.headers.get('origin');
  if (!origin) {
    // Legacy browsers + server-to-server clients may not send Origin. Allow
    // only when the UA shape looks like a modern browser (has Accept);
    // otherwise fail closed.
    return !!req.headers.get('accept');
  }
  try {
    const url = new URL(req.url);
    const originUrl = new URL(origin);
    return originUrl.host === url.host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
    }

    const ip = resolveClientIp(req);
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const email = (body?.email ?? '').trim().toLowerCase();
    const source = normalizeSource(String(body?.source ?? 'unknown'));

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // ── Forward to Resend Audiences (durable storage) ──────────────────────
    const durableResult = await forwardToResendAudience(email, source);

    // Log source + durable-storage outcome. Never log the email itself —
    // server log aggregators (Sentry / Railway) are a PII leak risk.
    console.log(
      `[email-capture] source=${source} captured=1 durable=${durableResult}`,
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[email-capture] error:', err);
    // Return 200 anyway — the client still redirects to /signup
    return NextResponse.json({ ok: true });
  }
}

// Only POST is supported
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
