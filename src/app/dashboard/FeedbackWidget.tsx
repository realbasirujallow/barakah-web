'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

type Status = 'idle' | 'open' | 'sending' | 'sent' | 'error';

const TOPICS = [
  'Feature request',
  'Bug report',
  'Billing question',
  'General feedback',
  'Islamic finance question',
  'Other',
];

export function FeedbackWidget() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ subject: '', message: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const open = () => setStatus('open');
  const close = () => {
    setStatus('idle');
    setForm({ subject: '', message: '' });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message.trim()) return;
    setStatus('sending');
    setErrorMsg('');

    try {
      const result = await api.contact({ subject: form.subject, message: form.message });
      if (result?.success) {
        setStatus('sent');
      } else {
        setErrorMsg(result?.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      {status === 'idle' && (
        <button
          onClick={open}
          title="Send feedback"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:bg-primary/90 transition"
        >
          <span>💬</span>
          <span>Feedback</span>
        </button>
      )}

      {/* Slide-in panel */}
      {status !== 'idle' && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Send Feedback</span>
            <button
              onClick={close}
              className="text-green-200 hover:text-white text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {status === 'sent' ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🙏</div>
                <p className="font-semibold text-gray-800 text-sm">JazakAllahu Khayran!</p>
                <p className="text-gray-500 text-xs mt-1">Your feedback helps us improve Barakah for everyone.</p>
                <button
                  onClick={close}
                  className="mt-4 text-xs text-primary underline hover:no-underline"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Round 22: label/input association via htmlFor+id.
                    Matches the Round 19 auth-form-labels pattern. */}
                <div>
                  <label htmlFor="feedback-subject" className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                  <select
                    id="feedback-subject"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  >
                    <option value="">Select…</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
                  <textarea
                    id="feedback-message"
                    required
                    rows={4}
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    maxLength={2000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Submit Feedback'}
                </button>

                <p className="text-center text-xs text-gray-400">We read every message ✉️</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
