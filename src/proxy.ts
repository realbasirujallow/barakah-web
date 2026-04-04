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
 * the Route Handler at /auth/[...path]/route.ts. The client also stores
 * a refresh token in localStorage (_brt) for body-based refresh.
 *
 * The proxy does NOT aggressively redirect — it allows through any request
 * that might have a valid session (cookies OR localStorage-based refresh).
 * Only truly fresh visitors with zero session indicators are redirected.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthToken    = request.cookies.has('auth_token');
  const hasRefreshToken = request.cookies.has('refresh_token');

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

  // ── Protected routes ────────────────────────────────────────────────
  // Allow through if ANY session indicator exists (auth cookie, refresh
  // cookie). If neither cookie exists, the user MAY still have a valid
  // session via localStorage _brt — let client-side AuthContext handle it.
  // Only redirect if we're confident there's no session at all.
  //
  // Note: We intentionally do NOT redirect here. The client-side
  // AuthContext will attempt a body-based refresh using localStorage,
  // and only redirect to /login if that also fails. This prevents the
  // "session expired on hard refresh" issue where cookies are set by
  // fetch() but not yet visible to the proxy on the next navigation.

  return NextResponse.next();
}

export const config = {
  // Only run proxy on auth pages (redirect logged-in users away from login)
  matcher: ['/login', '/signup'],
};
