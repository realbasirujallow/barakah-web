'use client';

/**
 * 2026-06-07: web parity for the mobile GoogleSignInButton.
 *
 * Renders Google's officially-themed "Continue with Google" button via
 * Google Identity Services (GIS). On a successful credential the
 * Google-issued ID token is exchanged for a Barakah session through
 * AuthContext.signInWithGoogle, which talks to POST /auth/google.
 *
 * Behaves like the mobile widget:
 *   - Hidden entirely if `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` is unset
 *     (stock dev builds that never configured GIS stay clean).
 *   - On a successful sign-in, navigates to /onboarding/locale-confirm
 *     when the backend signals `requiresPhoneCapture` (matches mobile's
 *     post-SSO phone-capture flow), otherwise to /dashboard.
 *   - When the backend returns SEC-AUTH-1's link-confirmation 202
 *     response, the button shows the message inline and does NOT
 *     navigate.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../lib/i18n';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: GsiConfig) => void;
          renderButton: (parent: HTMLElement, opts: GsiRenderOpts) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GsiConfig {
  client_id: string;
  callback: (resp: { credential: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  ux_mode?: 'popup' | 'redirect';
}

interface GsiRenderOpts {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface Props {
  /** "continue_with" (default) for /login. "signup_with" for /signup. */
  ctaLabel?: 'continue_with' | 'signup_with' | 'signin_with';
}

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export default function GoogleSignInButton({ ctaLabel = 'continue_with' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle } = useAuth();
  const { t, locale } = useI18n();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [sending, setSending] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  // 2026-06-07 UX: /sso/confirm-link redirects here with ?ssoAuto=1 after
  // the user clicks the email confirmation link. We immediately re-prompt
  // the GIS One Tap so the user signs in with ONE click after the email
  // bounce — no orphaned tabs.
  const [crossTabAuto, setCrossTabAuto] = useState(false);
  const autoTrigger = searchParams.get('ssoAuto') === '1' || crossTabAuto;

  // 2026-06-07 v2: cross-tab signal. When /sso/confirm-link succeeds
  // in ANOTHER tab of the same origin, it broadcasts "ssoConfirmed".
  // Catching the broadcast HERE flips autoTrigger to true so the
  // ORIGINAL tab (the one that opened /login first) fires One-Tap on
  // its own — user signs in here even though they clicked the email
  // in a different tab. Eliminates the orphaned-tab feeling.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let bc: BroadcastChannel | null = null;
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'ssoConfirmed') {
        setCrossTabAuto(true);
        try { window.focus(); } catch { /* no-op */ }
      }
    };
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('barakah-sso');
        bc.addEventListener('message', onMsg);
      }
    } catch { /* no-op */ }
    // Storage-event fallback.
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'barakah-sso-confirmed-at') {
        setCrossTabAuto(true);
        try { window.focus(); } catch { /* no-op */ }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      try { bc?.removeEventListener('message', onMsg); bc?.close(); } catch { /* no-op */ }
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (!clientId || !targetRef.current) return;

    // Load the GIS client script once. If another component already
    // injected it (e.g. signup + login both mount the button), reuse.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SCRIPT_SRC}"]`,
    );
    const ensureLoaded = () =>
      new Promise<void>((resolve) => {
        if (window.google?.accounts?.id) return resolve();
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true });
          return;
        }
        const s = document.createElement('script');
        s.src = GIS_SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    let cancelled = false;
    ensureLoaded().then(() => {
      if (cancelled || !targetRef.current) return;
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp) => {
          if (!resp.credential) return;
          setSending(true);
          setError('');
          setInfo('');
          try {
            const result = await signInWithGoogle(resp.credential);
            if (result.state === 'requires_link_confirmation') {
              setInfo(result.message);
              return;
            }
            // signed_in — match mobile's post-SSO phone-capture branch.
            router.replace(
              result.requiresPhoneCapture ? '/onboarding/locale-confirm' : '/dashboard',
            );
          } catch (e) {
            setError(
              e instanceof Error ? e.message : t('googleSignInError'),
            );
          } finally {
            setSending(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(targetRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: ctaLabel,
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320,
        locale,
      });
    });

    return () => {
      cancelled = true;
      try { window.google?.accounts?.id?.cancel(); } catch { /* no-op */ }
    };
  }, [clientId, ctaLabel, locale, router, signInWithGoogle, t]);

  // 2026-06-07 v2: dedicated auto-trigger effect. Separated from the
  // GIS init useEffect above because autoTrigger can flip true LONG
  // after init (when the cross-tab BroadcastChannel signals "ssoConfirmed"
  // from /sso/confirm-link). The init effect's dep array intentionally
  // does NOT include autoTrigger — re-initializing GIS would re-render
  // the button and cause flicker. Instead, this effect just calls
  // prompt() whenever autoTrigger becomes true and GIS is ready.
  useEffect(() => {
    if (!autoTrigger) return;
    if (!clientId) return;
    let cancelled = false;
    const tryPrompt = () => {
      if (cancelled) return;
      if (window.google?.accounts?.id?.prompt) {
        try { window.google.accounts.id.prompt(); } catch { /* no-op */ }
      } else {
        // GIS not loaded yet — poll briefly (init useEffect injects the
        // script async; usually <500ms but allow up to 5s).
        setTimeout(tryPrompt, 250);
      }
    };
    tryPrompt();
    return () => { cancelled = true; };
  }, [autoTrigger, clientId]);

  if (!clientId) return null;

  return (
    <div className="flex flex-col items-stretch gap-2">
      <div className="flex items-center gap-3 my-2">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {t('orLabel')}
        </span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
      <div ref={targetRef} className="flex justify-center" aria-busy={sending} />
      {info && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
          {info}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
