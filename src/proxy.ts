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
 * ── Session contract (H-R4-4 fix, 2026-04-18) ──────────────────────────
 *
 * The backend sets TWO httpOnly cookies with different lifetimes:
 *   • auth_token    — short-lived access JWT (default 24h)
 *   • refresh_token — long-lived refresh token (default 30d)
 *
 * On a protected route we must treat "has session" as
 * `auth_token OR refresh_token`. If we only check `auth_token`, every user
 * whose access token expired (but whose refresh token is still valid) gets
 * kicked to /login — they never get a chance to run the client-side
 * silent-refresh flow that swaps a valid refresh_token for a new
 * auth_token. Previously this forced a re-login every 24h for active
 * users, which is the H-R4-4 finding.
 *
 * Redirect rules codify the two lifetimes:
 *   • `/` → `/dashboard` only if the user has an access token NOW (we
 *     don't want a refresh-only user to land on a page whose SSR/RSC
 *     immediately 401s on the API). They'll hit the client silent-refresh
 *     flow through normal navigation instead.
 *   • `/login` / `/signup` → `/dashboard` only on a fresh access token,
 *     for the same reason.
 *   • `/dashboard/...` → `/login` only if BOTH cookies are absent. A
 *     refresh-only user is allowed through so the client can run silent
 *     refresh before rendering.
 *
 * The proxy does NOT aggressively redirect — it allows through any request
 * that might have a valid session cookie. Only auth pages use this proxy,
 * and protected dashboard routes rely on the cookie-backed client/session
 * checks after hydration.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken    = request.cookies.has('auth_token');
  // H-R4-4: treat refresh_token as a valid session indicator on protected
  // routes so silent refresh can succeed before we kick the user to /login.
  const hasRefreshToken = request.cookies.has('refresh_token');

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
  //
  // H-R4-4: "clearly not logged in" means BOTH cookies are missing. If
  // the user has a valid refresh_token but an expired auth_token, we
  // let the request through so the client-side AuthContext can run
  // silent refresh. Otherwise we'd force a re-login every 24h for
  // active users.
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const hasAnySession = hasAuthToken || hasRefreshToken;
  if (isProtectedRoute && !hasAnySession) {
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
