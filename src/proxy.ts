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
  // Note: We intentionally do NOT redirect protected routes here. The
  // client-side AuthContext verifies the cookie-backed session and handles
  // refresh/logout after hydration.

  return NextResponse.next();
}

export const config = {
  // Only run proxy on auth pages (redirect logged-in users away from login)
  matcher: ['/login', '/signup'],
};
