'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    subtitle: 'Smart categorization with halal insights',
    body: 'Record your transactions and get AI-powered halal spending analysis — see what percentage of your spending is Islamic-compliant.',
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
    icon: '✨',
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
  const [step, setStep] = useState(() => {
    try { return Math.min(Number(localStorage.getItem(STEP_KEY) || '0'), steps.length - 1); } catch { return 0; }
  });
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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // handleSkip closes over onComplete (caller-owned) and step-state setters;
    // all are stable for the lifetime of the modal, so we can leave deps empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-wizard-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        {/* Progress */}
        <div className="flex gap-1 px-6 pt-5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-[#1B5E20]' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 id="onboarding-wizard-title" className="text-2xl font-bold text-[#1B5E20] mb-1">{current.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{current.subtitle}</p>
          <p className="text-gray-700 text-sm leading-relaxed mb-5">{current.body}</p>

          {current.action && (
            // BUG FIX: was onClick={handleSkip} which permanently dismissed
            // the wizard; now advances to the next step so returning to the
            // dashboard after visiting the linked feature resumes from step N+1.
            <Link href={current.action.href} onClick={handleNext}
              className="inline-block bg-green-50 text-[#1B5E20] px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-100 border border-green-200 transition mb-2">
              {current.action.label} →
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6">
          <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-gray-600">
            Skip tour
          </button>
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => {
                try { localStorage.setItem(STEP_KEY, String(step - 1)); } catch {}
                setStep(step - 1);
              }}
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Back
              </button>
            )}
            <button onClick={handleNext}
              className="px-6 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-medium hover:bg-[#2E7D32]">
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
