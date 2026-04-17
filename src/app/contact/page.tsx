'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Round 18: validate BEFORE flipping status to 'sending', so a
    // validation failure doesn't flash the button into its submitting
    // state for a frame. Validation failures stay in 'error' cleanly.
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address.');
      setStatus('error');
      return;
    }
    // Round 21: regex matches server-side validation (ContactController).
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    if (!form.subject) {
      setErrorMsg('Please select a topic.');
      setStatus('error');
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setErrorMsg('Please enter a message (at least 10 characters).');
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await api.contact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const topics = [
    'General question',
    'Feature request',
    'Bug report',
    'Billing / subscription',
    'Islamic finance question',
    'Partnership inquiry',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E1] dark:bg-gray-900 flex flex-col">
      {/* Nav */}
      <header className="bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20] dark:text-green-300">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#1B5E20] dark:text-green-300 font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#1B5E20] py-14 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Get in Touch</h1>
        <p className="text-green-200 text-base max-w-xl mx-auto">
          Have a question, suggestion, or just want to say salaam? We read every message and usually respond within 1–2 business days.
        </p>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 grid md:grid-cols-5 gap-10">
        {/* Left — contact info */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-[#1B5E20] dark:text-green-300 mb-4">How can we help?</h2>
            <div className="space-y-4">
              {[
                { icon: '💡', title: 'Feature Requests', desc: 'Tell us what would make Barakah better for your Islamic finance journey.' },
                { icon: '🐛', title: 'Bug Reports', desc: 'Found something broken? Let us know and we\'ll fix it promptly.' },
                { icon: '💳', title: 'Billing Questions', desc: 'Issues with your subscription, payments, or plan changes.' },
                { icon: '🤝', title: 'Partnerships', desc: 'Islamic finance educators, masajid, or platforms — reach out.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{item.title}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
            <p className="text-[#1B5E20] dark:text-green-300 font-semibold text-sm mb-1">📧 Direct email</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">support@trybarakah.com</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">We aim to respond within 1–2 business days, in shaa Allah.</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-3">
          {status === 'sent' ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-[#1B5E20] dark:text-green-300 mb-2">Message received!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">JazakAllahu khayran for reaching out. We&apos;ll get back to you at your email address within 1–2 business days.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm text-[#1B5E20] dark:text-green-300 underline hover:no-underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Send us a message</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Ahmad Al-Farsi"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Phone number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+1 (317) 555-0123"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Email address <span className="text-red-400">*</span></label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="ahmad@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Topic <span className="text-red-400">*</span></label>
                <select
                  id="contact-subject"
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 bg-white dark:bg-gray-700"
                >
                  <option value="">Select a topic…</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  maxLength={5000}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 resize-none"
                />
                <p className="text-right text-xs text-gray-300 dark:text-gray-500 mt-1">{form.message.length}/5000</p>
              </div>

              {status === 'error' && (
                <p className="text-red-600 dark:text-red-300 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#1B5E20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2E7D32] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                We read every message and respond personally. No bots, no auto-replies.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-6 px-6 text-center text-xs text-gray-400 dark:text-gray-500">
        <Link href="/" className="hover:text-[#1B5E20] dark:hover:text-green-300 hover:underline transition">Home</Link>
        <span className="mx-2">·</span>
        <Link href="/disclaimer" className="hover:text-[#1B5E20] dark:hover:text-green-300 hover:underline transition">Disclaimer</Link>
        <span className="mx-2">·</span>
        <span>© {new Date().getFullYear()} Barakah</span>
      </footer>
    </div>
  );
}
