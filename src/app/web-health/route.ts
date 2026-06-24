import { NextResponse } from 'next/server';

/**
 * GET /web-health
 *
 * Lightweight liveness check for external uptime monitors (UptimeRobot,
 * BetterStack, Pingdom, etc.). Returns 200 with a timestamp so a synthetic
 * monitor can confirm the web frontend (Railway → Cloudflare → Next.js) is
 * serving and the Next.js runtime hasn't crashed. Does NOT touch the backend,
 * database, or auth — those have their own endpoints (/actuator/health on the
 * Railway backend). The intent is "is the web frontend up?".
 *
 * NOTE: this lives at /web-health, NOT /api/health — next.config rewrites
 * /api/* to the backend BEFORE page/route matching, so an /api/health route
 * here would never be reached (the backend's /api/health answers instead).
 *
 * No-cache so monitors always get a fresh response.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'barakah-web',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Robots-Tag': 'noindex',
      },
    },
  );
}
