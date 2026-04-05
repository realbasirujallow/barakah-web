'use client';

import { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" stroke="#FFD700" strokeWidth="2" fill="none" />
        <path
          d="M38 12a20 20 0 1 0 0 40 16 16 0 0 1 0-40z"
          fill="#FFD700"
        />
      </svg>
    ),
    title: 'Welcome to Barakah',
    description:
      'Your Islamic finance companion. Track your wealth, calculate zakat, and manage your finances the halal way.',
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="48" height="48" rx="8" stroke="#FFD700" strokeWidth="2" fill="none" />
        <line x1="8" y1="22" x2="56" y2="22" stroke="#FFD700" strokeWidth="2" />
        <text x="32" y="46" textAnchor="middle" fill="#FFD700" fontSize="20" fontWeight="bold" fontFamily="monospace">
          2.5%
        </text>
      </svg>
    ),
    title: 'Zakat Made Simple',
    description:
      'Zakat is 2.5% of your wealth held for one lunar year (hawl) above the nisab threshold. Barakah calculates it automatically using live gold prices and AMJA methodology.',
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="48" height="44" rx="6" stroke="#FFD700" strokeWidth="2" fill="none" />
        <line x1="8" y1="24" x2="56" y2="24" stroke="#FFD700" strokeWidth="2" />
        <line x1="20" y1="8" x2="20" y2="16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        <line x1="44" y1="8" x2="44" y2="16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        <text x="32" y="44" textAnchor="middle" fill="#FFD700" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          354d
        </text>
      </svg>
    ),
    title: 'What is Nisab & Hawl?',
    description:
      'Nisab is the minimum wealth threshold (85g of gold) before zakat becomes due. Hawl is the Islamic lunar year (354 days) you must hold wealth above nisab. We track both for you.',
  },
];

const STORAGE_KEY = 'barakah_onboarded';

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — don't show
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setVisible(false);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setDirection(index > current ? 'next' : 'prev');
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [animating, current],
  );

  const next = useCallback(() => {
    if (current === slides.length - 1) {
      dismiss();
    } else {
      goTo(current + 1);
    }
  }, [current, dismiss, goTo]);

  if (!visible) return null;

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      {/* Card */}
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#1B5E20' }}
      >
        {/* Top decorative bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FFD700, #FFC107, #FFD700)' }} />

        {/* Slide content */}
        <div
          className="px-8 pt-10 pb-6 text-center transition-all duration-300 ease-in-out"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === 'next'
                ? 'translateX(40px)'
                : 'translateX(-40px)'
              : 'translateX(0)',
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">{slide.icon}</div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#FFD700' }}>
            {slide.title}
          </h2>

          {/* Description */}
          <p className="text-green-100 leading-relaxed text-sm sm:text-base">{slide.description}</p>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 pb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                backgroundColor: i === current ? '#FFD700' : 'rgba(255,215,0,0.35)',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-8 pb-8">
          <button
            onClick={dismiss}
            className="text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            Skip
          </button>

          <button
            onClick={next}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: '#FFD700',
              color: '#1B5E20',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFC107')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFD700')}
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
