'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useFocusTrap } from '../lib/useFocusTrap';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: '🕌',
    title: 'Welcome to Barakah',
    subtitle: 'Halal-first Islamic finance platform',
    body: 'Barakah helps you manage your wealth according to Islamic principles — from Zakat calculation to halal investment screening, right from your browser.',
  },
  {
    icon: '⏰',
    title: 'Set Up Your Zakat in 2 Minutes',
    subtitle: 'Track your Hawl — the Islamic lunar year',
    body: 'Add your zakatable assets (cash, gold, stocks, crypto) and Barakah will track the 354-day Hawl period and remind you when Zakat is due.',
    action: { label: 'Go to Hawl Tracker', href: '/dashboard/hawl' },
  },
  {
    icon: '📊',
    title: 'Track Income & Expenses',
    subtitle: 'Automatic categorization with halal-awareness',
    body: 'Record your transactions and Barakah will sort them by category, flag interest-bearing charges, and show what share of your spending is Islamic-compliant.',
    action: { label: 'Add First Transaction', href: '/dashboard/transactions' },
  },
  {
    icon: '💰',
    title: 'Manage Your Assets',
    subtitle: 'Net worth tracking across currencies',
    body: 'Add cash, gold, silver, real estate, stocks, and crypto. Barakah calculates your net worth and Zakat eligibility across multiple currencies.',
    action: { label: 'Add Assets', href: '/dashboard/assets' },
  },
  {
    icon: '📜',
    title: 'Plan Your Estate (Wasiyyah)',
    subtitle: "Prepare your Islamic will according to Qur'anic inheritance",
    body: "Add beneficiaries with Islamic Fara'id shares, record financial obligations, and generate a printable PDF — all based on Qur'an and Sunnah.",
    action: { label: 'Start Your Wasiyyah', href: '/dashboard/wasiyyah' },
  },
  {
    icon: '🤲',
    title: "You're All Set!",
    subtitle: 'May your wealth be blessed with Barakah',
    body: 'Explore features like Halal Stock Screener, Riba Detector, Prayer Times, Sadaqah Tracker, Budget Planning, and more from your dashboard.',
  },
];

const STEP_KEY = 'barakah_onboarding_step';

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  // BUG FIX: persist the current step so navigating to an action destination
  // and returning resumes from where the user left off rather than resetting
  // to step 0 or permanently dismissing the wizard.
  //
  // Round 19: hydrate in a useEffect instead of reading localStorage in
  // the useState initializer. SSR returns 0; returning user mid-tour has
  // a non-zero stored step; mismatch otherwise triggers a hydration warning.
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = Number(localStorage.getItem(STEP_KEY) || '0');
        if (!Number.isNaN(saved)) {
          setStep(Math.min(saved, steps.length - 1));
        }
      } catch { /* SSR / incognito */ }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      try {
        localStorage.setItem('barakah_onboarded', 'true');
        localStorage.removeItem(STEP_KEY);
      } catch {}
      onComplete();
    } else {
      const next = step + 1;
      try { localStorage.setItem(STEP_KEY, String(next)); } catch {}
      setStep(next);
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('barakah_onboarded', 'true');
      localStorage.removeItem(STEP_KEY);
    } catch {}
    onComplete();
  };

  // HIGH BUG FIX (H-10): Escape key dismisses the onboarding wizard (acts
  // like "Skip tour"). The wrapper below now also carries role="dialog" and
  // aria-modal="true" for screen-reader users.
  //
  // Round 21: use a ref for `onComplete` so the escape handler always
  // calls the latest function, even if the parent re-renders with a new
  // callback. Prior `eslint-disable` hid a real stale-closure hazard —
  // unlikely in normal flow but worth closing off cleanly.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try {
          localStorage.setItem('barakah_onboarded', 'true');
          localStorage.removeItem(STEP_KEY);
        } catch {}
        onCompleteRef.current();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Round 29: focus trap. A keyboard user who Tabs past the dialog
  // reaches the dashboard behind and lands on nav links they can't see.
  const wizardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(wizardRef, true);

  return (
    <div
      ref={wizardRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-wizard-title"
    >
      <div className="bg-card rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-border">
        {/* Progress — Phase 6.4 polish: bg-primary token + bg-muted track */}
        <div className="flex gap-1 px-6 pt-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <div className="px-6 pt-2 pb-1">
          <p className="text-xs text-muted-foreground tabular-nums">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pt-2 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-3xl mb-3">
            <span aria-hidden="true">{current.icon}</span>
          </div>
          <h2 id="onboarding-wizard-title" className="text-2xl font-semibold tracking-tight text-foreground mb-1">{current.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{current.subtitle}</p>
          <p className="text-foreground/80 text-sm leading-relaxed mb-5 max-w-md mx-auto">{current.body}</p>

          {current.action && (
            // BUG FIX: was onClick={handleSkip} which permanently dismissed
            // the wizard; now advances to the next step so returning to the
            // dashboard after visiting the linked feature resumes from step N+1.
            <Link
              href={current.action.href}
              onClick={handleNext}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary px-5 py-2 rounded-md text-sm font-medium hover:bg-primary/15 border border-primary/20 transition-colors mb-2"
            >
              {current.action.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2 border-t border-border">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => {
                  try { localStorage.setItem(STEP_KEY, String(step - 1)); } catch {}
                  setStep(step - 1);
                }}
                className="px-5 py-2 border border-border rounded-md text-sm text-foreground hover:bg-accent transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
