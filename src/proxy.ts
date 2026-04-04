import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side route protection proxy (Next.js 16 convention).
 *
 * Two-tier cookie check for protected routes:
 *   1. auth_token present  → allow (normal case)
 *   2. auth_token absent but refresh_token present → allow and let client-side
 *      AuthContext perform a silent refresh before rendering. This eliminates
 *      the "session expired" redirect that previously happened when the JWT
 *      cookie was missing during full-page navigations (typed URLs, bookmarks,
 *      browser refresh) even though a valid refresh_token still existed.
 *   3. Neither cookie present → redirect to /login (truly unauthenticated)
 *
 * The client-side AuthContext remains the authoritative session guard — this
 * proxy is a performance optimisation that prevents unauthenticated users
 * from downloading protected page bundles.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken    = request.cookies.has('auth_token');
  const hasRefreshToken = request.cookies.has('refresh_token');

  // ── Protected routes ────────────────────────────────────────────────
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin');

  if (isProtected && !hasAuthToken && !hasRefreshToken) {
    // Truly unauthenticated — no session cookies at all
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('reason', 'expired');
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth pages: redirect to dashboard if already logged in ──────────
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup';

  if (isAuthPage && (hasAuthToken || hasRefreshToken)) {
    const reason = request.nextUrl.searchParams.get('reason');
    if (reason === 'logout' || reason === 'deleted' || reason === 'expired') {
      // Session ended — clear stale cookies and let /login render
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      response.cookies.delete('refresh_token');
      return response;
    }
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only run proxy on these routes (skip API, static, etc.)
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
