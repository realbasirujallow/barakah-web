import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge middleware — runs before page render on the Vercel edge.
 *
 * ## Round 18 scope
 *
 * Eliminates the ~100ms marketing-hero flash that logged-in users saw
 * when they hit `/`. Prior to this, the home page rendered server-side
 * with the full marketing HTML, then a client-side `useEffect` detected
 * `user` and `router.replace('/dashboard')` fired — visibly jarring on
 * slow networks.
 *
 * The auth cookie is httpOnly and set by our backend on login. We just
 * need to know whether it's present; the actual JWT validation stays
 * server-side on the Spring Boot side (every API call is authenticated
 * there). If the cookie turns out to be expired or forged, subsequent
 * API calls will 401 and the dashboard will redirect to /login via the
 * interceptor. False positives here are harmless — they just send the
 * user to the dashboard, which handles auth on its own.
 *
 * Scope is deliberately narrow: ONLY `/` gets rewritten. Expanding to
 * `/login` / `/signup` is tempting but would break sessions where a
 * user explicitly wants to re-auth (e.g. after copy-pasting a legacy
 * verification link).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only act on the bare homepage.
  if (pathname !== '/') return NextResponse.next();

  // Round 19: narrowed to the single canonical cookie name our backend
  // actually sets (`auth_token`, see AuthController#login / logout). The
  // previous round accepted `jwt` / `access_token` too for "future-
  // proofing", but that meant any stale cookie from a prior backend
  // version could trigger a redirect loop (middleware sends to
  // /dashboard, dashboard sees no real auth and bounces back). Also
  // require a non-empty cookie value.
  const authCookie = request.cookies.get('auth_token');
  const hasAuth = Boolean(authCookie?.value && authCookie.value.length > 0);

  if (hasAuth) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Limit the matcher to `/` so unrelated routes don't pay the middleware
// overhead. Edge middleware adds ~5-10ms per matched request.
export const config = {
  matcher: ['/'],
};
