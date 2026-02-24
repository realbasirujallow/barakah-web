'use client';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import Link from 'next/link';
import posthog from 'posthog-js';
export default function DashboardPage() {
  const [totals, setTotals] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    posthog.capture('dashboard_viewed');
    api.getAssetTotal()
      .then(data => setTotals(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  return <div>Landing page</div>;
}
