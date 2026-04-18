import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side route protection proxy (Next.js 16 convention).
 *
 * IMPORTANT: The client-side AuthContext is the AUTHORITATIVE session guard.
 * This proxy is a lightweight optimization only — it prevents clearly
 * unauthenticated users from downloading protected page JS bundles.
 *
 * Session cookies (auth_token, refresh_token) are httpOnly and set by
 * the Route Handler at /auth/[...path]/route.ts.
 *
 * The proxy does NOT aggressively redirect — it allows through any request
 * that might have a valid session cookie. Only auth pages use this proxy,
 * and protected dashboard routes rely on the cookie-backed client/session
 * checks after hydration.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken    = request.cookies.has('auth_token');

  // ── Marketing homepage: redirect logged-in users straight to /dashboard ──
  //
  // Round 28: merged from the legacy middleware.ts file. Next 16 rejects
  // having both middleware.ts and proxy.ts at the same convention level
  // (error E900), and every `next build` was failing until we collapsed
  // these into a single proxy. This is the Round 18/19/21 homepage
  // redirect — eliminates the ~100ms marketing-hero flash that logged-in
  // users saw on `/`, preserves UTM/campaign query params across the
  // redirect, and requires a non-empty `auth_token` cookie (the single
  // canonical name set by the backend).
  if (pathname === '/' && hasAuthToken) {
    const authCookie = request.cookies.get('auth_token');
    // Guard against an empty cookie value sending a logged-out user into
    // a redirect loop (dashboard would bounce them back).
    if (authCookie?.value && authCookie.value.length > 0) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url);
    }
  }

  // ── Auth pages: redirect to dashboard if clearly logged in ──────────
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup';

  if (isAuthPage && hasAuthToken) {
    const reason = request.nextUrl.searchParams.get('reason');
    if (reason === 'logout' || reason === 'deleted' || reason === 'expired') {
      // Intentional logout/expiry — clear cookies and let /login render
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      response.cookies.delete('refresh_token');
      return response;
    }
    // Has valid auth cookie and no logout reason — redirect to dashboard
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // ── Protected routes: redirect if clearly not logged in ──────────
  const isProtectedRoute = pathname.startsWith('/dashboard');
  if (isProtectedRoute && !hasAuthToken) {
    // Detect bots (Googlebot, Bingbot, etc.) — return 403 + noindex
    // instead of redirect chain that pollutes search index
    const ua = request.headers.get('user-agent') || '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|slurp|facebookexternalhit|twitterbot|linkedinbot|bot|crawler|spider/i.test(ua);
    if (isBot) {
      return new NextResponse('This page requires authentication.', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow' },
      });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('reason', 'expired');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Round 28: `/` added when the legacy middleware.ts was merged in.
  matcher: ['/', '/login', '/signup', '/dashboard/:path*'],
};
