import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Lightweight liveness check for external uptime monitors (UptimeRobot,
 * BetterStack, Pingdom, etc.). Returns 200 with a timestamp so a
 * synthetic monitor can confirm Vercel is serving the app and the
 * Next.js runtime hasn't crashed. Does NOT touch the backend, database,
 * or auth — those have their own health endpoints (/actuator/health
 * on Railway). The intent is "is the web frontend up?"
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
