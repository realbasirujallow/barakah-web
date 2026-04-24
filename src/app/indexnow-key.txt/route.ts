import { NextResponse } from 'next/server';

/**
 * IndexNow key-verification endpoint.
 *
 * The IndexNow protocol (indexnow.org) requires that the key used to
 * submit URLs is served as plain text at a stable, public URL on the
 * host. Search engines fetch this URL once and cache the key to verify
 * that submissions are actually authorized by the domain owner.
 *
 * Location convention: https://<host>/<KEY>.txt — but Next.js route
 * folders can't be dynamically-named, so we host at a fixed path
 * (/indexnow-key.txt) and include `keyLocation` in every POST body
 * pointing here. IndexNow accepts either convention (spec §2.2).
 *
 * The body is literally just the key string. Returns 503 if not
 * configured so the indexing protocol knows we're not ready yet.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return new NextResponse('INDEXNOW_KEY not configured', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new NextResponse(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
