'use client';

import { useState } from 'react';
import { api } from '../../lib/api';
import { useI18n } from '../../lib/i18n';

type Status = 'idle' | 'open' | 'sending' | 'sent' | 'error';

// 2026-06-11 (i18n bug cluster): topic labels are now localized, but the
// VALUE submitted to /api/contact stays English so founder-side triage /
// email filters keep working regardless of the sender's UI language.
const TOPICS: Array<{ value: string; labelKey: string }> = [
  { value: 'Feature request',          labelKey: 'fbwTopicFeature' },
  { value: 'Bug report',               labelKey: 'fbwTopicBug' },
  { value: 'Billing question',         labelKey: 'fbwTopicBilling' },
  { value: 'General feedback',         labelKey: 'fbwTopicGeneral' },
  { value: 'Islamic finance question', labelKey: 'fbwTopicIslamic' },
  { value: 'Other',                    labelKey: 'wasRelOther' },
];

export function FeedbackWidget() {
  // 2026-05-19 Round 9: localize the floating-button label.
  // 2026-06-11: the panel itself (header, labels, placeholder, submit,
  // thanks state) was still hardcoded English — localized now.
  const { t } = useI18n();
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
        setErrorMsg(result?.error || t('errSomethingWentWrong'));
        setStatus('error');
      }
    } catch {
      setErrorMsg(t('fbwNetworkError'));
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      {status === 'idle' && (
        <button
          onClick={open}
          title={t('fbwPanelTitle')}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:bg-primary/90 transition"
        >
          <span>💬</span>
          <span>{t('feedbackButton')}</span>
        </button>
      )}

      {/* Slide-in panel */}
      {status !== 'idle' && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">{t('fbwPanelTitle')}</span>
            <button
              onClick={close}
              className="text-green-200 hover:text-white text-lg leading-none"
              aria-label={t('askBarakahCloseShortLabel')}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {status === 'sent' ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🙏</div>
                <p className="font-semibold text-gray-800 text-sm">{t('fbwThanksTitle')}</p>
                <p className="text-gray-500 text-xs mt-1">{t('fbwThanksBody')}</p>
                <button
                  onClick={close}
                  className="mt-4 text-xs text-primary underline hover:no-underline"
                >
                  {t('askBarakahCloseShortLabel')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Round 22: label/input association via htmlFor+id.
                    Matches the Round 19 auth-form-labels pattern. */}
                <div>
                  <label htmlFor="feedback-subject" className="block text-xs font-semibold text-gray-500 mb-1">{t('txnFieldType')}</label>
                  <select
                    id="feedback-subject"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  >
                    <option value="">{t('fbwSelectPlaceholder')}</option>
                    {TOPICS.map(topic => <option key={topic.value} value={topic.value}>{t(topic.labelKey)}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-semibold text-gray-500 mb-1">{t('fbwMessageLabel')}</label>
                  <textarea
                    id="feedback-message"
                    required
                    rows={4}
                    placeholder={t('fbwMessagePlaceholder')}
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
                  {status === 'sending' ? t('familySending') : t('fbwSubmit')}
                </button>

                <p className="text-center text-xs text-gray-400">{t('fbwFooterNote')}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
