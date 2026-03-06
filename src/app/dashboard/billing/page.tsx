'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';

// ── Plan definitions ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'gray',
    features: [
      '5 transactions per month',
      'Basic budget tracking',
      'Barakah Score overview',
      'Prayer times widget',
    ],
  },
  {
    id: 'plus',
    name: 'Barakah Plus',
    price: '$9.99',
    period: '/month',
    color: 'green',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited transactions',
      'Full Zakat calculator',
      'Debt Payoff Projector',
      'Ramadan Mode',
      'Analytics & Year-over-Year',
      'Recurring transactions',
      'Financial Summary reports',
      'CSV & PDF export',
    ],
  },
  {
    id: 'family',
    name: 'Barakah Family',
    price: '$14.99',
    period: '/month',
    color: 'blue',
    features: [
      'Everything in Plus',
      'Up to 6 family members',
      'Shared budgets & goals',
      'Family financial summary',
      'Shared expense splitting',
    ],
  },
] as const;

// ── Billing content (needs Suspense for useSearchParams) ─────────────────────
function BillingContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<{ plan: string; status: string; hasSubscription: boolean } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    api.subscriptionStatus()
      .then(setStatus)
      .catch(() => setStatus({ plan: 'free', status: 'inactive', hasSubscription: false }))
      .finally(() => setStatusLoading(false));
  }, []);

  const handleUpgrade = async (plan: 'plus' | 'family') => {
    setLoading(plan);
    try {
      const { url } = await api.createCheckout(plan);
      window.location.href = url;
    } catch {
      alert('Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading('portal');
    try {
      const { url } = await api.openPortal();
      window.location.href = url;
    } catch {
      alert('No active subscription found. Please contact support.');
      setLoading(null);
    }
  };

  const currentPlan = status?.plan || 'free';
  const isPastDue   = status?.status === 'past_due';
  const isCanceled  = status?.status === 'canceled';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">
          {statusLoading ? (
            <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              You're on the{' '}
              <span className="font-semibold capitalize text-gray-700">{currentPlan}</span> plan
              {isPastDue && (
                <span className="ml-2 text-red-600 font-medium text-sm">
                  ⚠️ Payment past due — please update your payment method
                </span>
              )}
              {isCanceled && (
                <span className="ml-2 text-orange-600 font-medium text-sm">
                  (Canceled — access ends at period end)
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Success / Cancel banners */}
      {params.get('success') === 'true' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold">Subscription activated!</p>
            <p className="text-sm">Jazakallah khayran — your Barakah plan is now active.</p>
          </div>
        </div>
      )}
      {params.get('canceled') === 'true' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <p className="text-sm">Checkout was canceled — no charge was made.</p>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {PLANS.map(plan => {
          const isCurrent   = currentPlan === plan.id;
          const isHighlight = 'highlight' in plan && plan.highlight;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border flex flex-col p-6 transition-shadow ${
                isCurrent
                  ? 'border-[#1B5E20] ring-2 ring-[#1B5E20] shadow-md'
                  : isHighlight
                  ? 'border-[#1B5E20] shadow-sm'
                  : 'border-gray-200'
              } bg-white`}
            >
              {/* Badge */}
              {'badge' in plan && plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B5E20] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <h2 className="text-lg font-bold text-gray-800 mt-1">{plan.name}</h2>

              <div className="mt-2 mb-4">
                <span className="text-3xl font-extrabold text-[#1B5E20]">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#1B5E20] font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div className="text-center text-sm font-semibold text-[#1B5E20] py-2 bg-green-50 rounded-xl">
                  ✅ Current Plan
                </div>
              ) : plan.id === 'free' ? (
                <div className="text-center text-sm text-gray-400 py-2">
                  Always free
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id as 'plus' | 'family')}
                  disabled={loading === plan.id}
                  className="w-full bg-[#1B5E20] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#155016] disabled:opacity-50 transition-colors"
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Redirecting to Stripe...
                    </span>
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Manage subscription */}
      {status?.hasSubscription && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h3 className="font-semibold text-gray-700 mb-1">Manage Subscription</h3>
          <p className="text-sm text-gray-500 mb-3">
            Update your payment method, view invoices, or cancel your subscription via the Stripe portal.
          </p>
          <button
            onClick={handleManage}
            disabled={loading === 'portal'}
            className="text-sm font-medium text-[#1B5E20] underline underline-offset-2 hover:text-[#155016] disabled:opacity-50"
          >
            {loading === 'portal' ? 'Opening portal...' : '→ Open billing portal'}
          </button>
        </div>
      )}

      {/* Security note */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        🔒 Payments are processed securely by Stripe. Barakah never stores your card details.
      </p>
    </div>
  );
}

// ── Page wrapper with Suspense ────────────────────────────────────────────────
export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}
