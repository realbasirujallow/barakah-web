'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { submitCareerApplication } from '../lib/careers';

const MAX_NOTE_LENGTH = 5000;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ACCEPT_ATTR = '.pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/octet-stream',
]);

type Status = 'idle' | 'sending' | 'sent' | 'error';

type FormState = {
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  linkedinUrl: string;
  note: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  portfolioUrl: '',
  linkedinUrl: '',
  note: '',
};

function hasAllowedResumeExtension(filename: string) {
  const lower = filename.toLowerCase();
  return ALLOWED_RESUME_EXTENSIONS.some(extension => lower.endsWith(extension));
}

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function CareersPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(
    () => Boolean(form.name.trim() && form.email.trim() && (form.note.trim() || resume)),
    [form.email, form.name, form.note, resume],
  );

  const validate = () => {
    const trimmedEmail = form.email.trim();
    if (!form.name.trim()) return 'Please enter your name.';
    if (!trimmedEmail) return 'Please enter your email address.';
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      return 'Please enter a valid email address.';
    }
    if (!form.note.trim() && !resume) {
      return 'Please either tell us about yourself or upload a resume.';
    }
    if (form.portfolioUrl.trim() && !isValidUrl(form.portfolioUrl.trim())) {
      return 'Please enter a valid portfolio URL.';
    }
    if (form.linkedinUrl.trim() && !isValidUrl(form.linkedinUrl.trim())) {
      return 'Please enter a valid LinkedIn URL.';
    }
    if (form.note.length > MAX_NOTE_LENGTH) {
      return `Please keep your note under ${MAX_NOTE_LENGTH} characters.`;
    }
    if (resume) {
      if (!hasAllowedResumeExtension(resume.name) || (resume.type && !ALLOWED_RESUME_TYPES.has(resume.type))) {
        return 'Please upload a PDF, DOC, DOCX, or TXT resume.';
      }
      if (resume.size > MAX_RESUME_BYTES) {
        return 'Resume is too large. Please keep it under 5 MB.';
      }
    }
    return '';
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setResume(null);
      return;
    }

    if (!hasAllowedResumeExtension(file.name) || (file.type && !ALLOWED_RESUME_TYPES.has(file.type))) {
      setResume(null);
      setErrorMsg('Please upload a PDF, DOC, DOCX, or TXT resume.');
      setStatus('error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResume(null);
      setErrorMsg('Resume is too large. Please keep it under 5 MB.');
      setStatus('error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setResume(file);
    if (status === 'error') {
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    try {
      await submitCareerApplication({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        portfolioUrl: form.portfolioUrl.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
        note: form.note.trim(),
        resume,
      });
      setStatus('sent');
      setForm(initialForm);
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EA] text-gray-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <Link href="/" className="transition hover:text-[#1B5E20]">Home</Link>
            <Link href="/pricing" className="transition hover:text-[#1B5E20]">Pricing</Link>
            <Link href="/learn" className="transition hover:text-[#1B5E20]">Learn</Link>
            <Link href="/careers" className="font-semibold text-[#1B5E20]">Careers</Link>
            <Link href="/contact" className="transition hover:text-[#1B5E20]">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#1B5E20] hover:underline">Sign In</Link>
            <Link href="/signup" className="rounded-lg bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2E7D32]">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="overflow-hidden bg-[#103A1B] px-6 py-20 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-100">
                Barakah Careers
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Help us tell the Barakah story with content people actually want to watch.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-green-100/90 md:text-lg">
                We’re hiring a content and video creator who can turn Islamic finance, money habits, and product trust into clear, compelling short-form and long-form content. If you can make useful ideas feel human, memorable, and honest, we’d love to hear from you.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Role', 'Content & Video Creator'],
                  ['Focus', 'Education, storytelling, product trust'],
                  ['Application', 'Free-form note, resume upload, or both'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-200">{label}</p>
                    <p className="mt-2 text-sm font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-200">What we need</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-green-50/95">
                <p>Create social clips, product explainers, testimonial narratives, launch videos, and founder-led content that feels trustworthy instead of salesy.</p>
                <p>Work across scripting, filming direction, editing instincts, and publishing judgment with a real understanding of what performs without sacrificing substance.</p>
                <p>Translate product details like zakat, riba cleanup, referrals, billing, and app flows into content that earns trust with Muslim households.</p>
              </div>
              <div className="mt-6 rounded-2xl bg-[#F9C846] p-5 text-[#17351F]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Strong applications usually show</p>
                <ul className="mt-3 space-y-2 text-sm leading-6">
                  <li>Real editing taste, not just trend-chasing.</li>
                  <li>An instinct for educational storytelling and creator-led hooks.</li>
                  <li>Evidence that you can make complex ideas feel simple and believable.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1B5E20]">What you’d own</h2>
                <div className="mt-5 grid gap-4">
                  {[
                    'Turn product launches, feature updates, and trust messaging into content people actually share.',
                    'Create short-form video concepts for TikTok, Instagram Reels, YouTube Shorts, and ad creative.',
                    'Develop longer-form explainers, founder clips, educational narratives, and customer proof content.',
                    'Help shape Barakah’s voice so the brand feels serious, warm, and useful in every format.',
                  ].map(item => (
                    <div key={item} className="rounded-2xl bg-[#F7F4EA] px-4 py-4 text-sm leading-6 text-gray-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-black/5 bg-[#FFF6D9] p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1B5E20]">How to apply</h2>
                <p className="mt-4 text-sm leading-7 text-gray-700">
                  Send us either a thoughtful free-form note, a resume upload, or both. Links to a portfolio, channel, or standout work are especially helpful. Every submission is reviewed by a real human, and we’ll follow up by email if there’s a fit.
                </p>
                <div className="mt-5 rounded-2xl border border-[#E7D8A2] bg-white px-5 py-4 text-sm text-gray-600">
                  Uploads accepted: PDF, DOC, DOCX, or TXT up to 5 MB.
                </div>
              </div>
            </div>

            <div id="apply" className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm">
              {status === 'sent' ? (
                <div className="rounded-[24px] border border-green-200 bg-green-50 p-8 text-center" aria-live="polite">
                  <p className="text-5xl">✅</p>
                  <h2 className="mt-4 text-2xl font-bold text-[#1B5E20]">Application received</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600">
                    JazakAllahu khayran for applying. We’ve received your information and will review it carefully. If there’s a fit, we’ll reach out at the email address you shared.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm font-semibold text-[#1B5E20] underline hover:no-underline"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20]">Apply now</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Tell us about yourself</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Free-form note, resume upload, or both. We review every application manually.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="career-name" className="mb-1.5 block text-xs font-semibold text-gray-500">
                        Your name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="career-name"
                        type="text"
                        value={form.name}
                        onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
                        placeholder="Basiru Jallow"
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/10"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="career-email" className="mb-1.5 block text-xs font-semibold text-gray-500">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="career-email"
                        type="email"
                        value={form.email}
                        onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/10"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="career-phone" className="mb-1.5 block text-xs font-semibold text-gray-500">
                        Phone number
                      </label>
                      <input
                        id="career-phone"
                        type="tel"
                        value={form.phone}
                        onChange={event => setForm(current => ({ ...current, phone: event.target.value }))}
                        placeholder="+1 (317) 555-0100"
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/10"
                      />
                    </div>
                    <div>
                      <label htmlFor="career-portfolio" className="mb-1.5 block text-xs font-semibold text-gray-500">
                        Portfolio or channel URL
                      </label>
                      <input
                        id="career-portfolio"
                        type="url"
                        value={form.portfolioUrl}
                        onChange={event => setForm(current => ({ ...current, portfolioUrl: event.target.value }))}
                        placeholder="https://yourportfolio.com"
                        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="career-linkedin" className="mb-1.5 block text-xs font-semibold text-gray-500">
                      LinkedIn URL
                    </label>
                    <input
                      id="career-linkedin"
                      type="url"
                      value={form.linkedinUrl}
                      onChange={event => setForm(current => ({ ...current, linkedinUrl: event.target.value }))}
                      placeholder="https://www.linkedin.com/in/yourname"
                      className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="career-note" className="mb-1.5 block text-xs font-semibold text-gray-500">
                      Free-form application note
                    </label>
                    <textarea
                      id="career-note"
                      rows={7}
                      value={form.note}
                      onChange={event => setForm(current => ({ ...current, note: event.target.value }))}
                      placeholder="Tell us about your content instincts, the formats you love, the work you're proud of, or why Barakah feels meaningful to you."
                      maxLength={MAX_NOTE_LENGTH}
                      className="w-full resize-none rounded-2xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/10"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>Optional if you upload a resume.</span>
                      <span>{form.note.length}/{MAX_NOTE_LENGTH}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-[#1B5E20]/25 bg-[#F7F4EA] p-5">
                    <label htmlFor="career-resume" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#1B5E20]">
                      Resume upload
                    </label>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Upload a PDF, DOC, DOCX, or TXT file. This can replace the free-form note, or you can send both.
                    </p>
                    <input
                      ref={fileInputRef}
                      id="career-resume"
                      type="file"
                      accept={ACCEPT_ATTR}
                      onChange={handleResumeChange}
                      className="mt-4 block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#1B5E20] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2E7D32]"
                    />
                    {resume ? (
                      <p className="mt-3 text-sm font-medium text-[#1B5E20]">
                        Selected: {resume.name}
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-gray-400">No file selected yet.</p>
                    )}
                  </div>

                  {status === 'error' && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" aria-live="polite">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending' || !canSubmit}
                    className="w-full rounded-2xl bg-[#1B5E20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2E7D32] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending application...' : 'Submit Application'}
                  </button>

                  <p className="text-center text-xs leading-6 text-gray-400">
                    We review every application and will get back to you by email if there’s a fit.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white px-6 py-8 text-sm text-gray-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
          <p>© {new Date().getFullYear()} Barakah. Building trustworthy Islamic finance tools.</p>
          <div className="flex items-center gap-4">
            <Link href="/trust" className="transition hover:text-[#1B5E20]">Trust</Link>
            <Link href="/contact" className="transition hover:text-[#1B5E20]">Contact</Link>
            <a href="mailto:support@trybarakah.com" className="transition hover:text-[#1B5E20]">support@trybarakah.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
