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

// ── In-process IP rate limit (5 requests per minute per IP) ────────────────
// Prevents a single client from spamming the endpoint. Not horizontally shared,
// but sufficient for an MVP endpoint running on a small number of instances.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
// Cap the map so a botnet spamming unique IPs can't exhaust memory.
// When we exceed this, drop the oldest entries (approximated by insertion
// order via Map iteration semantics).
const RATE_LIMIT_MAX_ENTRIES = 10_000;

function isRateLimited(ip: string): boolean {
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
    if (isRateLimited(ip)) {
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
