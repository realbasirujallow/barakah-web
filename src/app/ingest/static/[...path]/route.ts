import { NextRequest } from 'next/server';

// PostHog static-asset reverse proxy (session replay / surveys / web-vitals /
// dead-clicks scripts). A plain Next.js rewrite to us-assets.i.posthog.com
// forwards the incoming `Host: trybarakah.com` header, and that CDN rejects it
// with 403 — so the optional PostHog feature scripts never loaded in
// production (config.js / decide / flags still worked because us.i.posthog.com
// is lenient about Host). A Route Handler proxies via server-side `fetch`,
// which sets `Host: us-assets.i.posthog.com` correctly, so the assets load.
// This file takes precedence over the next.config `/ingest/static/:path*`
// rewrite (filesystem routes are matched before afterFiles rewrites).

const ASSET_HOST = 'https://us-assets.i.posthog.com';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const search = new URL(req.url).search;
  const target = `${ASSET_HOST}/static/${path.map(encodeURIComponent).join('/')}${search}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, { cache: 'no-store' });
  } catch {
    return new Response('PostHog asset proxy upstream error', { status: 502 });
  }

  const headers = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) headers.set('content-type', ct);
  // PostHog static assets are content-hash/version pinned (?v=1.x.y), so a long
  // cache is safe; fall back to the upstream value when present.
  headers.set(
    'cache-control',
    upstream.headers.get('cache-control') ?? 'public, max-age=86400, immutable',
  );

  return new Response(upstream.body, { status: upstream.status, headers });
}
