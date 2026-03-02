'use client';
import { AuthProvider } from '../context/AuthContext';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

function PostHogInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (key) {
      posthog.init(key, {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      });
      setReady(true);
    }
  }, []);

  if (ready) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  }
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogInit>
      <AuthProvider>{children}</AuthProvider>
    </PostHogInit>
  );
}