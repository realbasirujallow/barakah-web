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

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Take the RIGHTMOST XFF entry (appended by the trusted edge proxy) — the
    // leftmost entry is client-supplied and spoofable. An attacker sending
    // `X-Forwarded-For: 1.1.1.1,2.2.2.2,...` can cycle arbitrary first values
    // to defeat the 5/min limit. Mirrors backend RateLimitService.resolveClientIp.
    const xff = req.headers.get('x-forwarded-for');
    const xffParts = xff ? xff.split(',').map(s => s.trim()).filter(Boolean) : [];
    const ip = xffParts.length > 0
      ? xffParts[xffParts.length - 1]
      : (req.headers.get('x-real-ip') ?? 'unknown');
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
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
