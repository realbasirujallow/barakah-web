import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/email-capture
 *
 * Lightweight lead capture for learn-page email widgets.
 * Logs the email + source and optionally forwards to a mailing list provider.
 *
 * Body: { email: string, source: string }
 *
 * To connect a real provider (Mailchimp, Klaviyo, ConvertKit, Beehiiv):
 *   1. Add the API key to .env.local: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID
 *   2. Replace the TODO block below with the provider's API call
 *   3. The /signup redirect in RamadanEmailCapture.tsx will still work as a fallback
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
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
// Cap the map so a botnet spamming unique IPs can't exhaust memory.
const RATE_LIMIT_MAX_ENTRIES = 10_000;

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    // Opportunistic cleanup: when the map exceeds its cap, evict the
    // oldest-inserted entries until we're back under the limit.
    if (rateLimitMap.size >= RATE_LIMIT_MAX_ENTRIES) {
      const excess = rateLimitMap.size - RATE_LIMIT_MAX_ENTRIES + 1;
      const it = rateLimitMap.keys();
      for (let i = 0; i < excess; i++) {
        const next = it.next();
        if (next.done) break;
        rateLimitMap.delete(next.value);
      }
    }
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

async function isRateLimited(ip: string): Promise<boolean> {
  const redisResult = await isRateLimitedRedis(ip);
  if (redisResult !== null) return redisResult;
  return isRateLimitedInMemory(ip);
}

// Resolve the real client IP in order of trust, mirroring backend
// RateLimitService.resolveClientIp (fixed in backend commit 9e30c1e). Behind
// Cloudflare → Railway, the RIGHTMOST XFF entry is the Cloudflare edge PoP
// (varies per request, defeats rate limiting). CF-Connecting-IP is the only
// value Cloudflare sets that cannot be spoofed by end users. Fall back to
// LEFTMOST XFF (the outermost proxy's stamp of the real client) only when
// CF-Connecting-IP is absent.
function resolveClientIp(req: NextRequest): string {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) return cfIp.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[0];
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const ip = resolveClientIp(req);
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const email = (body?.email ?? '').trim().toLowerCase();
    const source = (body?.source ?? 'unknown').trim().substring(0, 100);

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // ── Forward to mailing list provider (fill in your provider below) ──────
    // TODO: Replace with your actual provider. Example for Mailchimp:
    //
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    // const MAILCHIMP_DC = MAILCHIMP_API_KEY?.split('-').pop(); // e.g. 'us21'
    // if (MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID && MAILCHIMP_DC) {
    //   await fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email_address: email,
    //       status: 'subscribed',
    //       tags: [source, 'learn-page'],
    //     }),
    //   });
    // }
    // ────────────────────────────────────────────────────────────────────────

    // Log source only — omit email to avoid PII in server log aggregators
    console.log(`[email-capture] source=${source} captured=1`);

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
