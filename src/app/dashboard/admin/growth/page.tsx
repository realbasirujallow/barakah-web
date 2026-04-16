'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';
import { useAuth } from '../../../../context/AuthContext';
import GrowthSnapshot, { type GrowthResponse } from '../../../../components/admin/GrowthSnapshot';

/**
 * Dedicated growth KPIs page — DAU/WAU/MAU, trial conversion, revenue
 * by subscription source. Data comes from GET /admin/growth.
 *
 * The same GrowthSnapshot component is embedded on the funnel page
 * (as context above the stage chart); this page is for when you want
 * just the numbers without the funnel noise. Bookmark this URL for
 * the morning-stand-up view.
 */
export default function GrowthPage() {
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [growth, setGrowth] = useState<GrowthResponse | null>(null);
  const isAdmin = (user as { role?: string } | null)?.role === 'admin';

  // BUG FIX: frontend admin-role guard — redirect non-admins before any API call
  useEffect(() => {
    if (!isAuthLoading && user && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAuthLoading, router, user]);

  useEffect(() => {
    if (isAuthLoading || !user || !isAdmin) {
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.getAdminGrowth() as GrowthResponse;
        if (!cancelled) setGrowth(res);
      } catch (err) {
        logError(err, { context: 'Failed to load growth metrics' });
        if (!cancelled) toast('Failed to load growth metrics. Admin access required?', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isAdmin, isAuthLoading, toast, user]);

  if (!isAuthLoading && user && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back link — always the first thing on the page so returning to the
            main admin dashboard is a one-click action. Matches the standard
            breadcrumb style so users don't have to look for it. */}
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B5E20] hover:underline mb-4"
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </Link>

        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1B5E20]">Growth metrics</h1>
            <p className="text-sm text-gray-600 mt-1">
              Active users, trial conversion, MRR / ARR, and revenue by subscription source.
              All numbers are live — no caching — and roll up the same way as <code className="text-xs bg-white px-1 py-0.5 rounded">GET /admin/growth</code>.
            </p>
          </div>
          <Link
            href="/dashboard/admin/funnel"
            className="text-sm font-medium text-[#1B5E20] bg-white border border-[#1B5E20] rounded-lg px-4 py-2 hover:bg-green-50 transition"
          >
            View conversion funnel →
          </Link>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-600 shadow-sm">
            Loading growth metrics…
          </div>
        )}

        {!loading && growth && <GrowthSnapshot growth={growth} showTitle={false} />}

        {!loading && !growth && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
            No growth data available.
          </div>
        )}
      </div>
    </div>
  );
}
