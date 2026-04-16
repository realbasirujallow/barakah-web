'use client';

import { useEffect, useState } from 'react';

const IOS_URL     = 'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.trybarakah.app';
const WEB_URL     = '/dashboard';
const DEEP_LINK   = 'barakah://open';

type Platform = 'ios' | 'android' | 'web';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'web';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'web';
}

function getFallbackUrl(platform: Platform): string {
  if (platform === 'ios') return IOS_URL;
  if (platform === 'android') return ANDROID_URL;
  return WEB_URL;
}

export default function OpenBarakahPage() {
  const [status, setStatus] = useState<'trying' | 'fallback'>('trying');

  useEffect(() => {
    const p = detectPlatform();

    // Desktop: skip the deep-link dance and go straight to the web dashboard
    if (p === 'web') {
      window.location.replace(WEB_URL);
      return;
    }

    // Mobile: try the custom scheme deep link.
    // If the app is installed the OS will hand off to it and the page becomes
    // hidden (visibilitychange). If the page stays visible for 2.5 s the app
    // is not installed, so we bounce to the correct store.
    const fallback = getFallbackUrl(p);
    const timer = setTimeout(() => {
      setStatus('fallback');
      window.location.replace(fallback);
    }, 2500);

    const onHidden = () => {
      if (document.visibilityState === 'hidden') {
        clearTimeout(timer);
      }
    };
    document.addEventListener('visibilitychange', onHidden);

    // Trigger the deep link
    window.location.href = DEEP_LINK;

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-6">
      <div className="mx-auto max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1B5E20] flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">B</span>
        </div>

        {status === 'trying' ? (
          <>
            <h1 className="text-xl font-bold text-[#1B5E20]">Opening Barakah…</h1>
            <p className="mt-2 text-sm text-gray-500">
              If the app does not open, we will take you to the right download page or the web dashboard.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#1B5E20] border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[#1B5E20]">Taking you to Barakah</h1>
            <p className="mt-2 text-sm text-gray-500">
              Get the Barakah app to manage your finances on the go.
            </p>
          </>
        )}

        {/* Manual fallback links shown while the deep link is resolving. */}
        <div className="mt-8 flex flex-col gap-3">
          <a
            href={DEEP_LINK}
            className="rounded-xl bg-[#1B5E20] px-4 py-3 text-sm font-semibold text-white"
          >
            Open in app
          </a>
          <a href={IOS_URL} className="rounded-xl border border-[#1B5E20]/20 px-4 py-3 text-sm font-semibold text-[#1B5E20]">
            Download on the App Store
          </a>
          <a href={ANDROID_URL} className="rounded-xl border border-[#1B5E20]/20 px-4 py-3 text-sm font-semibold text-[#1B5E20]">
            Get it on Google Play
          </a>
          <a href={WEB_URL} className="text-sm text-gray-400 underline underline-offset-2">
            Use Barakah on the web instead
          </a>
        </div>
      </div>
    </main>
  );
}
