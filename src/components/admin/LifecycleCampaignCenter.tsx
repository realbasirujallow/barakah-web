'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast';

type Filters = {
  plans: string[];
  subscriptionStatuses: string[];
  emailVerified?: boolean;
  hasCompletedSetup?: boolean;
  hasLinkedAccounts?: boolean;
  hasTransactions?: boolean;
  inactiveDaysMin?: number;
  inactiveDaysMax?: number;
  trialEndingWithinDays?: number;
};

type DraftCampaign = {
  id?: number;
  name: string;
  description: string;
  channel: 'email' | 'push' | 'in_app';
  templateKey: string;
  subject: string;
  title: string;
  body: string;
  status: 'draft' | 'scheduled';
  scheduledAt: string;
  sendInUserTimezone: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
  audienceFilters: Filters;
};

type RetentionSettings = {
  enabled: boolean;
  percentOff: number;
  durationMonths: number;
  label: string;
  stripeCouponId: string;
};

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  source: string;
  createdAt: number;
};

const defaultDraft = (): DraftCampaign => ({
  name: '',
  description: '',
  channel: 'email',
  templateKey: '',
  subject: '',
  title: '',
  body: '',
  status: 'draft',
  scheduledAt: '',
  sendInUserTimezone: true,
  quietHoursStart: 22,
  quietHoursEnd: 7,
  audienceFilters: {
    plans: [],
    subscriptionStatuses: [],
  },
});

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);

const FALLBACK_TEMPLATES: Array<Record<string, unknown>> = [
  {
    key: 'ramadan',
    channel: 'email',
    subject: 'Ramadan Mubarak from Barakah',
    title: 'Ramadan Mubarak',
    body: 'Ramadan Mubarak, {first_name}.\n\nOpen Barakah to review your zakat readiness, track your sadaqah, and keep your household finances in order this blessed month.',
  },
  {
    key: 'eid_al_fitr',
    channel: 'email',
    subject: 'Eid Mubarak from Barakah',
    title: 'Eid Mubarak',
    body: 'Eid Mubarak, {first_name}.\n\nMay Allah accept your fasting and good deeds. Open Barakah any time to review your spending, balances, and zakat history.',
  },
  {
    key: 'activation_finish_setup',
    channel: 'email',
    subject: 'Finish setting up Barakah',
    title: 'Your financial home is almost ready',
    body: 'Assalamu alaykum, {first_name}.\n\nYou already created your Barakah account. Finish setup so we can personalize your dashboard and help you track zakat, budgets, and household finances properly.',
  },
  {
    key: 'activation_link_accounts',
    channel: 'email',
    subject: 'Connect your first account in Barakah',
    title: 'Bring your balances into one place',
    body: 'Assalamu alaykum, {first_name}.\n\nConnect your bank or card accounts so Barakah can keep your balances, spending, and net worth in sync.',
  },
  {
    key: 'inactive_checkin',
    channel: 'push',
    subject: '',
    title: 'Come back to Barakah',
    body: 'Your balances, spending, and net worth may have changed since your last visit. Open Barakah for a quick check-in.',
  },
];

const defaultRetentionSettings = (): RetentionSettings => ({
  enabled: true,
  percentOff: 50,
  durationMonths: 3,
  label: 'Stay with Barakah at 50% off for 3 months',
  stripeCouponId: '',
});

function toLocalDateTime(value?: number | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function fromLocalDateTime(value: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

export function LifecycleCampaignCenter({ active }: { active: boolean }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [templates, setTemplates] = useState<Array<Record<string, unknown>>>([]);
  const [campaigns, setCampaigns] = useState<Array<Record<string, unknown>>>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [retentionSettings, setRetentionSettings] = useState<RetentionSettings>(defaultRetentionSettings);
  const [retentionStatus, setRetentionStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftCampaign>(defaultDraft);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<number | null>(null);
  const [loadingDeliveries, setLoadingDeliveries] = useState<number | null>(null);
  const [deliveries, setDeliveries] = useState<Record<number, Array<Record<string, unknown>>>>({});
  const [testEmail, setTestEmail] = useState('');
  const [savingRetention, setSavingRetention] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewResult, templatesResult, campaignsResult, retentionResult, contactSubmissionsResult] = await Promise.allSettled([
        api.getAdminLifecycleOverview(),
        api.getAdminLifecycleTemplates(),
        api.getAdminLifecycleCampaigns(),
        api.getAdminRetentionOfferSettings(),
        api.getAdminContactSubmissions(),
      ]);

      if (overviewResult.status === 'fulfilled') {
        setOverview((overviewResult.value ?? {}) as Record<string, number>);
      } else {
        setOverview(prev => prev ?? {
          incompleteSetup: 0,
          noLinkedAccounts: 0,
          inactive7d: 0,
          trialEndingSoon: 0,
        });
      }

      if (templatesResult.status === 'fulfilled') {
        setTemplates((templatesResult.value?.templates as Array<Record<string, unknown>> | undefined) ?? []);
      } else {
        setTemplates(prev => prev.length > 0 ? prev : FALLBACK_TEMPLATES);
      }

      if (campaignsResult.status === 'fulfilled') {
        setCampaigns((campaignsResult.value?.campaigns as Array<Record<string, unknown>> | undefined) ?? []);
      }

      if (retentionResult.status === 'fulfilled') {
        const raw = (retentionResult.value ?? {}) as Record<string, unknown>;
        setRetentionSettings({
          enabled: Boolean(raw.enabled ?? true),
          percentOff: Number(raw.percentOff ?? 50),
          durationMonths: Number(raw.durationMonths ?? 3),
          label: String(raw.label ?? defaultRetentionSettings().label),
          stripeCouponId: String(raw.stripeCouponId ?? ''),
        });
        setRetentionStatus(null);
      } else {
        setRetentionSettings(prev => ({
          ...defaultRetentionSettings(),
          ...prev,
        }));
        setRetentionStatus('Saved retention settings could not be loaded right now. Showing safe defaults so you can still configure the offer.');
      }

      if (contactSubmissionsResult.status === 'fulfilled') {
        setContactSubmissions(((contactSubmissionsResult.value?.submissions as ContactSubmission[] | undefined) ?? []).slice(0, 20));
      }

      const failedSections = [overviewResult, templatesResult, campaignsResult, retentionResult, contactSubmissionsResult]
        .filter(result => result.status === 'rejected').length;

      if (failedSections >= 4) {
        toast('Lifecycle admin data is temporarily unavailable. Please try again shortly.', 'error');
      }
    } catch {
      toast('Lifecycle admin data is temporarily unavailable. Please try again shortly.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!active) return;
    loadData();
  }, [active, loadData]);

  const selectedTemplate = useMemo(
    () => templates.find(template => String(template.key || '') === draft.templateKey),
    [draft.templateKey, templates],
  );

  useEffect(() => {
    if (!selectedTemplate) return;
    setDraft(prev => ({
      ...prev,
      channel: (String(selectedTemplate.channel || prev.channel) as DraftCampaign['channel']),
      subject: prev.subject || String(selectedTemplate.subject || ''),
      title: prev.title || String(selectedTemplate.title || ''),
      body: prev.body || String(selectedTemplate.body || ''),
    }));
  }, [selectedTemplate]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setDraft(prev => ({
      ...prev,
      audienceFilters: {
        ...prev.audienceFilters,
        [key]: value,
      },
    }));
  };

  const toggleStringFilter = (key: 'plans' | 'subscriptionStatuses', value: string) => {
    setDraft(prev => {
      const current = prev.audienceFilters[key] ?? [];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return {
        ...prev,
        audienceFilters: {
          ...prev.audienceFilters,
          [key]: next,
        },
      };
    });
  };

  const resetDraft = () => setDraft(defaultDraft());

  const saveCampaign = async () => {
    setSavingCampaign(true);
    try {
      await api.saveAdminLifecycleCampaign({
        ...draft,
        scheduledAt: draft.status === 'scheduled' ? fromLocalDateTime(draft.scheduledAt) : null,
      });
      toast('Lifecycle campaign saved.', 'success');
      resetDraft();
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save lifecycle campaign.', 'error');
    } finally {
      setSavingCampaign(false);
    }
  };

  const sendCampaign = async (campaignId: number) => {
    setSendingCampaignId(campaignId);
    try {
      await api.sendAdminLifecycleCampaign(campaignId);
      toast('Campaign sent.', 'success');
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send campaign.', 'error');
    } finally {
      setSendingCampaignId(null);
    }
  };

  const sendTest = async (campaignId: number) => {
    if (!testEmail.trim()) {
      toast('Enter a test email first.', 'error');
      return;
    }
    setSendingCampaignId(campaignId);
    try {
      await api.testAdminLifecycleCampaign(campaignId, { email: testEmail.trim() });
      toast('Test send queued.', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send test email.', 'error');
    } finally {
      setSendingCampaignId(null);
    }
  };

  const loadCampaignDeliveries = async (campaignId: number) => {
    setLoadingDeliveries(campaignId);
    try {
      const data = await api.getAdminLifecycleDeliveries(campaignId);
      setDeliveries(prev => ({
        ...prev,
        [campaignId]: (data?.deliveries as Array<Record<string, unknown>> | undefined) ?? [],
      }));
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load delivery report.', 'error');
    } finally {
      setLoadingDeliveries(null);
    }
  };

  const saveCampaignAndSend = async () => {
    setSavingCampaign(true);
    try {
      const saved = await api.saveAdminLifecycleCampaign({
        ...draft,
        scheduledAt: null,
      });
      const id = (saved as Record<string, unknown>)?.id as number | undefined;
      if (id) {
        await api.sendAdminLifecycleCampaign(id);
        toast('Campaign sent.', 'success');
      } else {
        toast('Saved but could not send — find it in the list below.', 'error');
      }
      resetDraft();
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save & send.', 'error');
    } finally {
      setSavingCampaign(false);
    }
  };

  const saveRetentionSettings = async () => {
    setSavingRetention(true);
    try {
      const updated = await api.updateAdminRetentionOfferSettings(retentionSettings);
      setRetentionSettings({
        enabled: Boolean(updated?.enabled ?? true),
        percentOff: Number(updated?.percentOff ?? retentionSettings.percentOff),
        durationMonths: Number(updated?.durationMonths ?? retentionSettings.durationMonths),
        label: String(updated?.label ?? retentionSettings.label),
        stripeCouponId: String(updated?.stripeCouponId ?? retentionSettings.stripeCouponId),
      });
      setRetentionStatus(null);
      toast('Retention offer settings updated.', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save retention settings.', 'error');
    } finally {
      setSavingRetention(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Incomplete Setup', overview?.incompleteSetup ?? 0],
          ['No Linked Accounts', overview?.noLinkedAccounts ?? 0],
          ['Inactive 7d', overview?.inactive7d ?? 0],
          ['Trials Ending Soon', overview?.trialEndingSoon ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{Number(value).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Campaign Center</h2>
              <p className="text-sm text-gray-500 mt-1">Build Ramadan greetings, activation journeys, win-back nudges, and scheduled broadcasts.</p>
            </div>
            <button
              type="button"
              onClick={resetDraft}
              className="text-sm font-medium text-[#1B5E20] hover:underline"
            >
              Clear draft
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Campaign name</span>
              <input
                value={draft.name}
                onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                placeholder="Ramadan Mubarak 2026"
              />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Template</span>
              <select
                value={draft.templateKey}
                onChange={e => setDraft(prev => ({ ...prev, templateKey: e.target.value, subject: '', title: '', body: '' }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              >
                <option value="">Custom</option>
                {templates.map(template => (
                  <option key={String(template.key)} value={String(template.key)}>{String(template.key)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Channel</span>
              <select
                value={draft.channel}
                onChange={e => setDraft(prev => ({ ...prev, channel: e.target.value as DraftCampaign['channel'] }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              >
                <option value="email">Email</option>
                <option value="push">Push</option>
                <option value="in_app">In-App</option>
              </select>
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Status</span>
              <select
                value={draft.status}
                onChange={e => setDraft(prev => ({ ...prev, status: e.target.value as DraftCampaign['status'] }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </label>
          </div>

          {draft.status === 'scheduled' && (
            <label className="mt-4 block text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Scheduled for</span>
              <input
                type="datetime-local"
                value={draft.scheduledAt}
                onChange={e => setDraft(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </label>
          )}

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <label className="text-sm text-gray-600 md:col-span-2">
              <span className="mb-2 block font-medium text-gray-800">Description</span>
              <input
                value={draft.description}
                onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                placeholder="Optional internal notes for your team"
              />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Subject</span>
              <input
                value={draft.subject}
                onChange={e => setDraft(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Title</span>
              <input
                value={draft.title}
                onChange={e => setDraft(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </label>
            <label className="text-sm text-gray-600 md:col-span-2">
              <span className="mb-2 block font-medium text-gray-800">Body</span>
              <textarea
                value={draft.body}
                onChange={e => setDraft(prev => ({ ...prev, body: e.target.value }))}
                rows={6}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Audience filters</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Plans</p>
                <div className="flex flex-wrap gap-2">
                  {['free', 'plus', 'family'].map(plan => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => toggleStringFilter('plans', plan)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        draft.audienceFilters.plans.includes(plan)
                          ? 'bg-[#1B5E20] text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Subscription status</p>
                <div className="flex flex-wrap gap-2">
                  {['active', 'trial', 'trialing', 'past_due', 'inactive', 'canceled'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleStringFilter('subscriptionStatuses', status)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        draft.audienceFilters.subscriptionStatuses.includes(status)
                          ? 'bg-[#1B5E20] text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Inactive at least (days)</span>
                <input
                  type="number"
                  value={draft.audienceFilters.inactiveDaysMin ?? ''}
                  onChange={e => updateFilter('inactiveDaysMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </label>
              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Inactive no more than (days)</span>
                <input
                  type="number"
                  value={draft.audienceFilters.inactiveDaysMax ?? ''}
                  onChange={e => updateFilter('inactiveDaysMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </label>
              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Trial ending within days</span>
                <input
                  type="number"
                  value={draft.audienceFilters.trialEndingWithinDays ?? ''}
                  onChange={e => updateFilter('trialEndingWithinDays', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['hasCompletedSetup', 'Completed Setup'],
                  ['hasLinkedAccounts', 'Linked Accounts'],
                  ['hasTransactions', 'Has Transactions'],
                ].map(([key, label]) => (
                  <label key={key} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.audienceFilters[key as keyof Filters])}
                      onChange={e => updateFilter(key as keyof Filters, e.target.checked)}
                      className="mr-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={draft.sendInUserTimezone}
                onChange={e => setDraft(prev => ({ ...prev, sendInUserTimezone: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#1B5E20]"
              />
              Send in user timezone and respect quiet hours
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Quiet hours</span>
              <select
                value={draft.quietHoursStart}
                onChange={e => setDraft(prev => ({ ...prev, quietHoursStart: Number(e.target.value) }))}
                className="rounded-lg border border-gray-200 px-2 py-1"
              >
                {HOUR_OPTIONS.map(hour => <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>)}
              </select>
              <span>to</span>
              <select
                value={draft.quietHoursEnd}
                onChange={e => setDraft(prev => ({ ...prev, quietHoursEnd: Number(e.target.value) }))}
                className="rounded-lg border border-gray-200 px-2 py-1"
              >
                {HOUR_OPTIONS.map(hour => <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>)}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {draft.status !== 'scheduled' && (
              <button
                type="button"
                onClick={saveCampaignAndSend}
                disabled={savingCampaign || !draft.name.trim() || (!draft.body.trim() && !draft.templateKey)}
                className="rounded-xl bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2E7D32] disabled:opacity-60"
              >
                {savingCampaign ? 'Sending...' : 'Save & Send Now'}
              </button>
            )}
            <button
              type="button"
              onClick={saveCampaign}
              disabled={savingCampaign || !draft.name.trim() || (!draft.body.trim() && !draft.templateKey)}
              className="rounded-xl border border-[#1B5E20] px-4 py-2 text-sm font-semibold text-[#1B5E20] hover:bg-[#F1F8E9] disabled:opacity-60"
            >
              {savingCampaign ? 'Saving...' : draft.status === 'scheduled' ? 'Save Scheduled Campaign' : 'Save Draft'}
            </button>
            <input
              type="email"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="min-w-52 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Retention Offer</h2>
          <div className="space-y-4">
            {retentionStatus && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {retentionStatus}
              </p>
            )}
            <label className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <div>
                <p className="font-medium text-gray-800 text-sm">Enabled</p>
                <p className="text-xs text-gray-500 mt-0.5">Show a save offer before Stripe users cancel.</p>
              </div>
              <input
                type="checkbox"
                checked={retentionSettings.enabled}
                onChange={e => setRetentionSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#1B5E20]"
              />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Offer label</span>
              <input
                value={retentionSettings.label}
                onChange={e => setRetentionSettings(prev => ({ ...prev, label: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Percent off</span>
                <input
                  type="number"
                  value={retentionSettings.percentOff}
                  onChange={e => setRetentionSettings(prev => ({ ...prev, percentOff: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </label>
              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Duration (months)</span>
                <input
                  type="number"
                  value={retentionSettings.durationMonths}
                  onChange={e => setRetentionSettings(prev => ({ ...prev, durationMonths: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </label>
            </div>
            <label className="text-sm text-gray-600">
              <span className="mb-2 block font-medium text-gray-800">Stripe coupon ID</span>
              <input
                value={retentionSettings.stripeCouponId}
                onChange={e => setRetentionSettings(prev => ({ ...prev, stripeCouponId: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                placeholder="stay_50_off"
              />
            </label>
            <button
              type="button"
              onClick={saveRetentionSettings}
              disabled={savingRetention}
              className="rounded-xl bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2E7D32] disabled:opacity-60"
            >
              {savingRetention ? 'Saving...' : 'Save Retention Offer'}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Lifecycle Campaigns</h2>
            <p className="text-sm text-gray-500 mt-1">Send now, test, and inspect delivery results without leaving admin.</p>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="text-sm font-medium text-[#1B5E20] hover:underline disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {campaigns.map(campaign => {
            const id = Number(campaign.id);
            const rows = deliveries[id];
            return (
              <div key={id} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{String(campaign.name || 'Untitled')}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {String(campaign.channel || 'email')} · {String(campaign.status || 'draft')} · {String(campaign.templateKey || 'custom')}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Targets: {Number(campaign.targetCount || 0).toLocaleString()} · Sent: {Number(campaign.sentCount || 0).toLocaleString()} · Failed: {Number(campaign.failedCount || 0).toLocaleString()}
                    </p>
                    {campaign.scheduledAt ? (
                      <p className="text-xs text-gray-400 mt-1">Scheduled: {toLocalDateTime(Number(campaign.scheduledAt)) || '—'}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => sendCampaign(id)}
                      disabled={sendingCampaignId === id}
                      className="rounded-xl bg-[#1B5E20] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2E7D32] disabled:opacity-60"
                    >
                      {sendingCampaignId === id ? 'Sending...' : 'Send Now'}
                    </button>
                    <button
                      type="button"
                      onClick={() => sendTest(id)}
                      disabled={sendingCampaignId === id}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      Send Test
                    </button>
                    <button
                      type="button"
                      onClick={() => loadCampaignDeliveries(id)}
                      disabled={loadingDeliveries === id}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {loadingDeliveries === id ? 'Loading...' : 'View Deliveries'}
                    </button>
                  </div>
                </div>
                {rows && rows.length > 0 && (
                  <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">User</th>
                          <th className="px-3 py-2 text-left font-medium">Channel</th>
                          <th className="px-3 py-2 text-left font-medium">Status</th>
                          <th className="px-3 py-2 text-left font-medium">Destination</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 8).map((delivery, index) => (
                          <tr key={`${id}-${index}`} className="border-t border-gray-100">
                            <td className="px-3 py-2 text-gray-700">{String(delivery.userId || '—')}</td>
                            <td className="px-3 py-2 text-gray-700">{String(delivery.channel || '—')}</td>
                            <td className="px-3 py-2 text-gray-700">{String(delivery.status || '—')}</td>
                            <td className="px-3 py-2 text-gray-500">{String(delivery.destination || '—')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
          {!campaigns.length && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              No lifecycle campaigns yet. Save a draft on the left to start building Ramadan greetings, activation journeys, or win-back campaigns.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Feedback & Leads</h2>
            <p className="text-sm text-gray-500 mt-1">Keep a clean list of people who reached out so support and outreach never depend on a single inbox.</p>
          </div>
        </div>

        {contactSubmissions.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Contact</th>
                  <th className="px-3 py-2 text-left font-medium">Subject</th>
                  <th className="px-3 py-2 text-left font-medium">Source</th>
                  <th className="px-3 py-2 text-left font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {contactSubmissions.map(submission => (
                  <tr key={submission.id} className="border-t border-gray-100 align-top">
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-900">{submission.name || 'Anonymous'}</p>
                      <a href={`mailto:${submission.email}`} className="text-[#1B5E20] hover:underline">{submission.email}</a>
                      {submission.phoneNumber ? (
                        <p className="text-xs text-gray-500 mt-1">{submission.phoneNumber}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      <p className="font-medium text-gray-900">{submission.subject}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{submission.message}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-700 capitalize">{submission.source}</td>
                    <td className="px-3 py-3 text-gray-500">{new Date(submission.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
            No contact or feedback submissions yet. Once users start writing in, their details will show up here for support and outreach follow-up.
          </div>
        )}
      </div>
    </div>
  );
}
