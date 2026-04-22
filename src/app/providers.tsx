'use client';
import { AuthProvider } from '../context/AuthContext';
import { FeatureFlagsProvider } from '../context/FeatureFlagsContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import Script from 'next/script';

function PostHogInit({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  // Round 34: move `ui_host` out of source and into an env var so that
  // self-hosted PostHog instances and EU-region deployments don't require a
  // code change. Defaults to the US region to preserve the prior behavior.
  const uiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || 'https://us.posthog.com';

  useEffect(() => {
    if (key) {
      posthog.init(key, {
        api_host: '/ingest',
        ui_host: uiHost,
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      });
    }
  }, [key, uiHost]);

  if (key) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  }
  return <>{children}</>;
}

/** Google Analytics 4 — only loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is set */
function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Round 21: wrap the tree in our branded ErrorBoundary so runtime
  // crashes in any page (e.g. recharts on malformed data, third-party
  // widget exception) show a recoverable retry card instead of
  // bubbling to `global-error.tsx`. The boundary is a class component
  // — put it outside AuthProvider so auth state survives a render
  // error downstream.
  return (
    <PostHogInit>
      <GoogleAnalytics />
      <ErrorBoundary>
        <AuthProvider>
          <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </PostHogInit>
  );
}
