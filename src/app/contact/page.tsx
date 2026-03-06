'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.trybarakah.com'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
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
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Nav */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
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
            <h2 className="text-lg font-bold text-[#1B5E20] mb-4">How can we help?</h2>
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
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-[#1B5E20] font-semibold text-sm mb-1">📧 Direct email</p>
            <p className="text-gray-600 text-xs">support@trybarakah.com</p>
            <p className="text-gray-400 text-xs mt-2">We aim to respond within 1–2 business days, in shaa Allah.</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-3">
          {status === 'sent' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-[#1B5E20] mb-2">Message received!</h3>
              <p className="text-gray-600 text-sm">JazakAllahu khayran for reaching out. We'll get back to you at your email address within 1–2 business days.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm text-[#1B5E20] underline hover:no-underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-800">Send us a message</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Your name</label>
                  <input
                    type="text"
                    placeholder="Ahmad Al-Farsi"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email address <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="ahmad@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Topic <span className="text-red-400">*</span></label>
                <select
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 bg-white"
                >
                  <option value="">Select a topic…</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  maxLength={5000}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 resize-none"
                />
                <p className="text-right text-xs text-gray-300 mt-1">{form.message.length}/5000</p>
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
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

              <p className="text-xs text-center text-gray-400">
                We read every message and respond personally. No bots, no auto-replies.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6 px-6 text-center text-xs text-gray-400">
        <Link href="/" className="hover:text-[#1B5E20] hover:underline transition">Home</Link>
        <span className="mx-2">·</span>
        <Link href="/disclaimer" className="hover:text-[#1B5E20] hover:underline transition">Disclaimer</Link>
        <span className="mx-2">·</span>
        <span>© {new Date().getFullYear()} Barakah</span>
      </footer>
    </div>
  );
}
