'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  /** Deep link the user is taken to when they tap the push or click
   *  the in-app CTA. Must match a route in the mobile allowlist
   *  (barakah_app/lib/main.dart:512); unknown routes fall through to
   *  /notifications on the client. */
  route: string;
};

/**
 * Deep-link targets the mobile app knows how to open. Keep in sync
 * with the allowlist in barakah_app/lib/main.dart:512. Anything not
 * on this list gets rewritten to /notifications by the mobile client,
 * which is defensive but not useful for targeted campaigns.
 */
const DEEP_LINK_ROUTES: Array<{ value: string; label: string }> = [
  { value: '/dashboard', label: '/dashboard — Home' },
  { value: '/assets', label: '/assets — Linked bank accounts' },
  { value: '/transactions', label: '/transactions — Transactions' },
  { value: '/budget', label: '/budget — Budgets' },
  { value: '/debts', label: '/debts — Debts' },
  { value: '/bills', label: '/bills — Bills & recurring' },
  { value: '/savings', label: '/savings — Savings goals' },
  { value: '/net-worth', label: '/net-worth — Net worth' },
  { value: '/zakat', label: '/zakat — Zakat calculator' },
  { value: '/hawl', label: '/hawl — Hawl tracker' },
  { value: '/sadaqah', label: '/sadaqah — Sadaqah tracker' },
  { value: '/waqf', label: '/waqf — Waqf planning' },
  { value: '/wasiyyah', label: '/wasiyyah — Islamic will' },
  { value: '/faraid', label: '/faraid — Faraid calculator' },
  { value: '/retirement-zakat', label: '/retirement-zakat' },
  { value: '/riba', label: '/riba — Riba detector' },
  { value: '/halal', label: '/halal — Stock screener' },
  { value: '/investments', label: '/investments — Investments' },
  { value: '/subscriptions', label: '/subscriptions — Subscription detector' },
  { value: '/ramadan', label: '/ramadan — Ramadan mode' },
  { value: '/prayers', label: '/prayers — Prayer times' },
  { value: '/barakah-score', label: '/barakah-score' },
  { value: '/billing', label: '/billing — Plan & billing' },
  { value: '/family', label: '/family — Family plan' },
  { value: '/household', label: '/household — Household profile' },
  { value: '/referral', label: '/referral — Refer a friend' },
  { value: '/settings', label: '/settings' },
  { value: '/notifications', label: '/notifications — Inbox' },
];

/**
 * Per-template smart default — when the admin picks a template card, we
 * pre-fill the most useful landing screen. Unknown templates default to
 * /dashboard (safe anywhere).
 */
const DEFAULT_ROUTE_BY_TEMPLATE: Record<string, string> = {
  activation_link_accounts: '/assets',
  activation_link_accounts_push: '/assets',
  activation_finish_setup: '/dashboard',
  ramadan: '/ramadan',
  eid_al_fitr: '/dashboard',
  inactive_checkin: '/dashboard',
  trial_ending: '/billing',
  upgrade_to_plus: '/billing',
  zakat_reminder: '/zakat',
};

type BroadcastStats = {
  broadcastId: string;
  delivered: number;
  failed: number;
  noToken: number;
  opened: number;
  openRate: number;
  notOpened: Array<{ userId: number; email: string; fullName: string }>;
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
  route: '/dashboard',
});

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);

const FALLBACK_TEMPLATES: Array<Record<string, unknown>> = [
  // ── Activation ──────────────────────────────────────────────────────────
  {
    key: 'activation_finish_setup',
    label: 'Finish Setup',
    category: 'Activation',
    emoji: '🏠',
    description: 'Nudge users who created an account but never finished onboarding.',
    channel: 'email',
    subject: 'Your Barakah dashboard is almost ready',
    title: 'Your financial home is almost ready',
    body: `Assalamu alaykum, {first_name}.\n\nYou already created your Barakah account — but your dashboard is still empty.\n\nFinish the 2-minute setup so Barakah can personalise your zakat, budget, and net-worth tracking the way you need it.\n\nTap below to finish where you left off.`,
  },
  {
    key: 'activation_link_accounts',
    label: 'Link Your Accounts (Email)',
    category: 'Activation',
    emoji: '🔗',
    description: 'Encourage users who completed setup but haven\'t connected a bank or card.',
    channel: 'email',
    subject: 'Unlock the full power of Barakah — connect your accounts',
    title: 'Bring your balances into one place',
    body: `Assalamu alaykum, {first_name}.\n\nBarakah is most powerful when it can see your real balances. Right now your dashboard shows estimates — connect your bank or card accounts via Plaid and Barakah will:\n\n• Keep your balances and spending updated automatically\n• Calculate your zakat on actual assets (not guesses)\n• Show your true net worth in one screen\n• Flag unusual spending before it becomes a problem\n\nIt takes about 60 seconds. Your credentials go directly to your bank — Barakah never sees them.\n\nTap below to connect your first account.`,
  },
  {
    key: 'activation_link_accounts_push',
    label: 'Link Your Accounts (Push)',
    category: 'Activation',
    emoji: '🔗',
    description: 'Push version — short nudge to link a bank or card.',
    channel: 'push',
    subject: '',
    title: 'Connect your accounts for accurate zakat & budgets',
    body: 'Your dashboard is ready. Link a bank or card so Barakah can track your real balances, zakat, and net worth automatically.',
  },
  {
    key: 'activation_feature_tour',
    label: 'What Barakah Offers',
    category: 'Activation',
    emoji: '✨',
    description: 'Educate new users on all features — great for the week-1 email.',
    channel: 'email',
    subject: 'Here is everything Barakah can do for you',
    title: 'Here is everything Barakah can do for you',
    body: `Assalamu alaykum, {first_name}.\n\nWelcome to Barakah. Here is a quick tour of what is waiting for you:\n\n🔗 Connected Accounts — Link your bank, cards, or investment accounts via Plaid. Barakah keeps everything in sync so you never have to manually enter balances again.\n\n🕌 Zakat Calculator — Barakah calculates your zakatable assets automatically based on your real balances. No spreadsheets, no guessing.\n\n📊 Halal Budget — Set monthly spending limits by category. Barakah flags when you are close so you can stay intentional.\n\n💰 Net Worth Dashboard — See every asset and liability in one screen. Watch your net worth grow month by month.\n\n📅 Hawl Tracker — Track the one-year anniversary of your nisab so you never miss a zakat obligation.\n\n🤲 Sadaqah & Charity Log — Record voluntary giving and see your full charitable giving history.\n\n📜 Islamic Finance Guidance — Built-in fiqh notes so you can make halal financial decisions with confidence.\n\nAll of this is waiting for you inside the app. Open Barakah now and start from the dashboard.`,
  },

  // ── Feature Discovery ────────────────────────────────────────────────────
  {
    key: 'feature_zakat',
    label: 'Discover: Zakat Calculator',
    category: 'Feature Discovery',
    emoji: '🕌',
    description: 'Remind users about the zakat tracker — good for mid-Ramadan or after nisab.',
    channel: 'push',
    subject: '',
    title: 'Your zakat calculation is ready',
    body: 'Open Barakah to see your current zakatable assets and whether you have reached nisab this year.',
  },
  {
    key: 'feature_net_worth',
    label: 'Discover: Net Worth',
    category: 'Feature Discovery',
    emoji: '📈',
    description: 'Push users to the net worth screen — works well after account linking.',
    channel: 'push',
    subject: '',
    title: 'See your full financial picture',
    body: 'Your net worth dashboard is live. Open Barakah to see every asset, liability, and how your wealth has changed this month.',
  },
  {
    key: 'feature_budget',
    label: 'Discover: Halal Budgeting',
    category: 'Feature Discovery',
    emoji: '📊',
    description: 'Introduce budgeting to users who have transactions but no budget set.',
    channel: 'email',
    subject: 'You are spending — but do you have a halal budget?',
    title: 'Set a halal budget in 2 minutes',
    body: `Assalamu alaykum, {first_name}.\n\nYou have been using Barakah to track your spending — great start. The next step is setting a monthly budget so you can be intentional about every dirham (or dollar).\n\nBarakah lets you set halal spending limits by category — groceries, dining, entertainment, sadaqah — and will alert you when you are getting close.\n\nIt takes about 2 minutes to set up. Open the Budgets section in Barakah and try it now.`,
  },
  {
    key: 'feature_hawl',
    label: 'Discover: Hawl Tracker',
    category: 'Feature Discovery',
    emoji: '📅',
    description: 'Educate users about the hawl tracker — great for non-Ramadan zakat reminders.',
    channel: 'email',
    subject: 'Are you tracking your hawl? Barakah can do it for you',
    title: 'Never miss your zakat hawl again',
    body: `Assalamu alaykum, {first_name}.\n\nZakat is only due after your wealth has been above nisab for one full lunar year — that period is called the hawl.\n\nMost Muslims either guess at the date or miss it entirely. Barakah tracks your hawl automatically based on when your assets first crossed nisab, and will remind you when your zakat due date is approaching.\n\nOpen Barakah and visit the Hawl section to set your start date. One minute of setup means you will never miss the obligation again.`,
  },

  // ── Re-engagement ────────────────────────────────────────────────────────
  {
    key: 'inactive_checkin',
    label: 'Check-In Nudge (Push)',
    category: 'Re-engagement',
    emoji: '👋',
    description: 'Push reminder for users inactive 7–30 days.',
    channel: 'push',
    subject: '',
    title: 'Come back to Barakah',
    body: 'Your balances, spending, and net worth may have changed. Open Barakah for a quick check-in — it only takes a minute.',
  },
  {
    key: 'inactive_checkin_email',
    label: 'Check-In Nudge (Email)',
    category: 'Re-engagement',
    emoji: '👋',
    description: 'Email version of the check-in nudge — more detail, better for 14+ day inactive users.',
    channel: 'email',
    subject: 'We saved your seat — come back to Barakah',
    title: 'Your finances did not pause. Your tracking should not either.',
    body: `Assalamu alaykum, {first_name}.\n\nIt has been a little while since your last visit. A lot can change in a week — new transactions, balance shifts, progress toward your zakat.\n\nBarakah has been tracking everything. Come back and spend 2 minutes reviewing where you stand:\n\n• Your balances are up to date\n• Any new spending has been categorised\n• Your zakat estimate has been recalculated\n\nOpen Barakah now. Everything is exactly as you left it — plus whatever happened while you were away.`,
  },
  {
    key: 'winback_30d',
    label: 'Win-Back (30 Days Inactive)',
    category: 'Re-engagement',
    emoji: '🤝',
    description: 'Stronger email for users gone 30+ days — remind them of the value, offer help.',
    channel: 'email',
    subject: 'Barakah misses you — is everything okay?',
    title: 'We want to make sure Barakah is working for you',
    body: `Assalamu alaykum, {first_name}.\n\nYou signed up for Barakah a while ago and we noticed it has been some time since your last visit.\n\nWe want to make sure Barakah is actually useful for you — not just another app collecting dust.\n\nIf something is not working, or you are not sure how to get the most out of it, reply to this email and we will help personally.\n\nIf life just got busy — that is okay too. Come back whenever you are ready. Your account and data are safe and waiting.\n\nMay Allah make it easy for you.`,
  },

  // ── Islamic Calendar ─────────────────────────────────────────────────────
  {
    key: 'ramadan',
    label: 'Ramadan Mubarak',
    category: 'Islamic Calendar',
    emoji: '🌙',
    description: 'Ramadan greeting with a zakat and sadaqah call to action.',
    channel: 'email',
    subject: 'Ramadan Mubarak from Barakah',
    title: 'Ramadan Mubarak',
    body: `Ramadan Mubarak, {first_name}.\n\nMay Allah accept your fasting, prayers, and good deeds this blessed month.\n\nRamadan is the best time to review your finances with intention. Open Barakah to:\n\n• Check your zakat readiness before Eid\n• Log your sadaqah and charitable giving\n• Review your spending and reset your budget for the month\n\nMay this Ramadan bring barakah into every corner of your life.`,
  },
  {
    key: 'eid_al_fitr',
    label: 'Eid al-Fitr Mubarak',
    category: 'Islamic Calendar',
    emoji: '🌟',
    description: 'Eid greeting after Ramadan — light and celebratory.',
    channel: 'email',
    subject: 'Eid Mubarak from Barakah',
    title: 'Eid Mubarak — Taqabbal Allahu Minna wa Minkum',
    body: `Eid Mubarak, {first_name}.\n\nTaqabbal Allahu Minna wa Minkum — may Allah accept from us and from you.\n\nMay this Eid bring joy, peace, and abundance to you and your family. Open Barakah any time to review your Ramadan spending, sadaqah log, and zakat history.`,
  },
  {
    key: 'dhul_hijja',
    label: 'Dhul Hijja / Eid al-Adha',
    category: 'Islamic Calendar',
    emoji: '🕋',
    description: 'Dhul Hijja greeting — emphasises the best 10 days and qurbani planning.',
    channel: 'email',
    subject: 'The best 10 days of the year are here',
    title: 'Dhul Hijja: the best 10 days of the year',
    body: `Assalamu alaykum, {first_name}.\n\nThe blessed days of Dhul Hijja are upon us. The Prophet \uFD3F said there are no days in which righteous deeds are more beloved to Allah than these ten days.\n\nUse this time wisely — and use Barakah to:\n\n• Budget for your qurbani (Eid al-Adha sacrifice)\n• Review your zakat and any outstanding obligations\n• Log your sadaqah and acts of generosity\n\nMay Allah accept your deeds and grant you and your family a blessed Eid al-Adha.`,
  },

  // ── Upgrade / Trials ─────────────────────────────────────────────────────
  {
    key: 'trial_ending',
    label: 'Trial Ending Soon',
    category: 'Upgrade',
    emoji: '⏰',
    description: 'Email for users whose free trial ends in 3–5 days.',
    channel: 'email',
    subject: 'Your Barakah trial ends soon — here is what you keep',
    title: 'Your trial ends in a few days',
    body: `Assalamu alaykum, {first_name}.\n\nYour Barakah Plus trial is ending soon. We wanted to make sure you know what happens next.\n\nIf you subscribe before your trial ends, you keep:\n\n✅ All your linked accounts and transaction history\n✅ Your zakat calculations and hawl tracking\n✅ Your budgets, net worth history, and sadaqah log\n✅ Full access to all Barakah Plus features\n\nIf you do not subscribe, your account switches to the free plan and some features will be limited — but your data is safe.\n\nSubscribe now to keep the full Barakah experience. JazakAllahu khairan for trying it.`,
  },
  {
    key: 'upgrade_to_plus',
    label: 'Upgrade to Plus (Free Users)',
    category: 'Upgrade',
    emoji: '⬆️',
    description: 'Nudge free users to upgrade — highlight what they are missing.',
    channel: 'email',
    subject: 'You are one step away from the full Barakah experience',
    title: 'Unlock the full Barakah experience',
    body: `Assalamu alaykum, {first_name}.\n\nYou are using Barakah Free — alhamdulillah, it is a great start.\n\nBarakah Plus takes it further:\n\n🔗 Link unlimited bank and card accounts via Plaid\n📊 Unlimited budget categories\n📅 Hawl tracking and automatic zakat calculation on real assets\n📈 Full net worth history and trends\n🤲 Sadaqah log with annual summary\n\nFor less than a coffee a month, you can manage your finances the way Islam intended.\n\nTap below to upgrade — and if you have any questions about whether Plus is right for you, just reply to this email.`,
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

// Derive unique categories in the order they first appear
function getCategories(templateList: Array<Record<string, unknown>>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of templateList) {
    const cat = String(t.category || 'Other');
    if (!seen.has(cat)) {
      seen.add(cat);
      out.push(cat);
    }
  }
  return out;
}

const CHANNEL_BADGE: Record<string, string> = {
  email: 'bg-blue-100 text-blue-700',
  push: 'bg-amber-100 text-amber-700',
  in_app: 'bg-purple-100 text-purple-700',
};

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
  // Per-status histogram ({sent: 11, skipped_quiet_hours: 30, ...}) so
  // admins can tell opt-outs from real failures. Populated alongside
  // deliveries via the /deliveries/breakdown endpoint.
  const [breakdowns, setBreakdowns] = useState<Record<number, Record<string, unknown>>>({});
  const [testEmail, setTestEmail] = useState('');
  const [savingRetention, setSavingRetention] = useState(false);
  const [broadcastStats, setBroadcastStats] = useState<BroadcastStats | null>(null);
  const [lastBroadcastId, setLastBroadcastId] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Ref for scrolling to the campaign form
  const campaignFormRef = useRef<HTMLDivElement>(null);

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
      // Fire both requests in parallel — the deliveries list gives the
      // per-row detail for troubleshooting; the breakdown gives the
      // per-status histogram the admin wants to see at a glance (so
      // "Failed: 77" never again hides 76 opt-outs behind the number).
      const [data, breakdown] = await Promise.all([
        api.getAdminLifecycleDeliveries(campaignId),
        api.getAdminLifecycleDeliveriesBreakdown(campaignId).catch(() => null),
      ]);
      setDeliveries(prev => ({
        ...prev,
        [campaignId]: (data?.deliveries as Array<Record<string, unknown>> | undefined) ?? [],
      }));
      if (breakdown) {
        setBreakdowns(prev => ({ ...prev, [campaignId]: breakdown as Record<string, unknown> }));
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load delivery report.', 'error');
    } finally {
      setLoadingDeliveries(null);
    }
  };

  /**
   * Export the loaded delivery rows as a CSV the admin can drop into a
   * spreadsheet or share with support. Avoids a server round-trip — uses
   * whatever rows are already in memory from loadCampaignDeliveries
   * (backend caps to 200 which covers the whole send for the sizes we
   * ship to today).
   */
  const exportDeliveriesCsv = (campaignId: number, campaignName: string) => {
    const rows = deliveries[campaignId] || [];
    if (rows.length === 0) {
      toast('No deliveries loaded yet — click View Deliveries first.', 'error');
      return;
    }
    const headers = ['userId', 'userEmail', 'channel', 'status', 'destination', 'errorMessage', 'createdAt', 'sentAt'];
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? '' : String(v);
      // RFC 4180: quote any field containing a comma, double quote, or newline,
      // and escape embedded quotes by doubling them.
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => escape((r as Record<string, unknown>)[h])).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignName.replace(/[^a-z0-9-]+/gi, '_').slice(0, 40)}_deliveries_${campaignId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveCampaignAndSend = async () => {
    setSavingCampaign(true);
    setBroadcastStats(null);
    try {
      // Push campaigns: bypass the lifecycle campaign table (which may not be
      // migrated) and call the direct broadcast endpoint instead.
      if (draft.channel === 'push') {
        const result = await api.broadcastPushNotification({
          title: draft.title || draft.name,
          body: draft.body,
          // Use the admin-selected deep link — tapping the push lands
          // the user on the intended screen (e.g. /assets for "link
          // your bank"), not the generic dashboard. Backend sanitizes
          // again server-side as a defense-in-depth layer.
          route: draft.route || '/dashboard',
          // BUG FIX: pass the full audienceFilters so all selected plans (and
          // other criteria) reach the backend — previously only plans[0] was
          // sent, silently dropping every other selected plan.
          filters: draft.audienceFilters,
        });
        const bid = (result as Record<string, unknown>)?.broadcastId as string | undefined;
        if (bid) {
          setLastBroadcastId(bid);
          // Poll stats after a short delay to let FCM finish the batch
          setTimeout(() => loadBroadcastStats(bid), 4000);
        }
        toast('Push notification sent to all users.', 'success');
        resetDraft();
        return;
      }

      // Email / in_app: use the lifecycle campaign flow
      const saved = await api.saveAdminLifecycleCampaign({
        ...draft,
        scheduledAt: null,
      });
      const id = (saved as Record<string, unknown>)?.id as number | undefined;
      if (id) {
        const result = await api.sendAdminLifecycleCampaign(id);
        const bid = (result as Record<string, unknown>)?.broadcastId as string | undefined;
        if (bid) {
          setLastBroadcastId(bid);
          setTimeout(() => loadBroadcastStats(bid), 4000);
        }
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

  const loadBroadcastStats = async (broadcastId: string) => {
    setLoadingStats(true);
    try {
      const result = await api.getBroadcastStats(broadcastId);
      setBroadcastStats(result as BroadcastStats);
    } catch {
      // non-fatal — stats may not be ready yet
    } finally {
      setLoadingStats(false);
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

  // ── Quick-action helpers ─────────────────────────────────────────────────
  const scrollToForm = () => {
    campaignFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applyStatCardAction = (
    filterPatch: Partial<Filters>,
    templateKey?: string,
  ) => {
    setDraft(prev => {
      const next: DraftCampaign = {
        ...prev,
        audienceFilters: { ...prev.audienceFilters, ...filterPatch },
      };
      if (templateKey) {
        const tpl = templates.find(t => String(t.key) === templateKey);
        next.templateKey = templateKey;
        if (tpl) {
          next.channel = String(tpl.channel || prev.channel) as DraftCampaign['channel'];
          next.subject = String(tpl.subject || '');
          next.title = String(tpl.title || '');
          next.body = String(tpl.body || '');
        }
        // Auto-pick a sensible landing screen for the template so the
        // admin doesn't have to remember that a "link accounts" push
        // should land on /assets, a zakat reminder on /zakat, etc.
        // They can still override via the Deep link dropdown.
        const suggested = DEFAULT_ROUTE_BY_TEMPLATE[templateKey];
        if (suggested) {
          next.route = suggested;
        }
      }
      return next;
    });
    scrollToForm();
  };

  const STAT_CARDS: Array<{
    label: string;
    valueKey: string;
    filterPatch: Partial<Filters>;
    templateKey?: string;
    color: string;
    actionLabel: string;
  }> = [
    {
      label: 'Incomplete Setup',
      valueKey: 'incompleteSetup',
      filterPatch: { hasCompletedSetup: false as unknown as boolean },
      color: 'text-amber-600',
      actionLabel: 'Target →',
    },
    {
      label: 'No Linked Accounts',
      valueKey: 'noLinkedAccounts',
      filterPatch: { hasLinkedAccounts: false as unknown as boolean },
      templateKey: 'activation_link_accounts_push',
      color: 'text-blue-600',
      actionLabel: 'Target →',
    },
    {
      label: 'Inactive 7d',
      valueKey: 'inactive7d',
      filterPatch: { inactiveDaysMin: 7 },
      templateKey: 'inactive_checkin',
      color: 'text-orange-600',
      actionLabel: 'Target →',
    },
    {
      label: 'Trials Ending Soon',
      valueKey: 'trialEndingSoon',
      filterPatch: { trialEndingWithinDays: 7 },
      templateKey: 'trial_ending',
      color: 'text-red-600',
      actionLabel: 'Target →',
    },
  ];

  const categories = useMemo(() => getCategories(templates), [templates]);
  const isPush = draft.channel === 'push';
  const isEmail = draft.channel === 'email';
  const bodyLength = draft.body.length;
  const pushOverLimit = isPush && bodyLength > 110;

  return (
    <div className="space-y-6">

      {/* ── Overview stat cards ─────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="rounded-2xl border bg-white p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{card.label}</p>
              <p className={`mt-2 text-3xl font-bold ${card.color}`}>
                {Number(overview?.[card.valueKey as string] ?? 0).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => applyStatCardAction(card.filterPatch, card.templateKey)}
              className="mt-3 self-start rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-[#F1F8E9] hover:border-[#1B5E20] hover:text-[#1B5E20] transition-colors"
            >
              {card.actionLabel}
            </button>
          </div>
        ))}
      </div>

      {/* ── Campaign Center + Retention Offer ───────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">

        {/* Campaign Center panel */}
        <div ref={campaignFormRef} className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-5">
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

          {/* ── Template gallery ─────────────────────────────────────────────── */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Pick a template</p>
            <div className="space-y-4">
              {/* Custom / blank option */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Custom</p>
                <button
                  type="button"
                  onClick={() => setDraft(prev => ({ ...prev, templateKey: '', subject: '', title: '', body: '' }))}
                  className={`rounded-xl border p-3 text-left w-44 transition-colors ${
                    draft.templateKey === ''
                      ? 'border-[#1B5E20] ring-2 ring-[#1B5E20]/20 bg-[#F1F8E9]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">✏️ Custom</p>
                  <p className="text-xs text-gray-400 mt-1">Write from scratch</p>
                </button>
              </div>

              {categories.map(category => {
                const categoryTemplates = templates.filter(t => String(t.category || 'Other') === category);
                return (
                  <div key={category}>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {categoryTemplates.map(tpl => {
                        const key = String(tpl.key || '');
                        const label = String(tpl.label || key);
                        const emoji = String(tpl.emoji || '📄');
                        const channel = String(tpl.channel || 'email');
                        const description = String(tpl.description || '');
                        const isSelected = draft.templateKey === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setDraft(prev => ({
                                ...prev,
                                templateKey: key,
                                channel: channel as DraftCampaign['channel'],
                                subject: String(tpl.subject || ''),
                                title: String(tpl.title || ''),
                                body: String(tpl.body || ''),
                              }));
                            }}
                            className={`rounded-xl border p-3 text-left w-52 transition-colors flex-shrink-0 ${
                              isSelected
                                ? 'border-[#1B5E20] ring-2 ring-[#1B5E20]/20 bg-[#F1F8E9]'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                              {emoji} {label}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CHANNEL_BADGE[channel] ?? 'bg-gray-100 text-gray-600'}`}>
                                {channel}
                              </span>
                            </div>
                            <p className="mt-1.5 text-[11px] text-gray-400 line-clamp-2 leading-snug">{description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Form fields ──────────────────────────────────────────────────── */}
          <div className="border-t border-gray-100 pt-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Campaign name</span>
                <input
                  value={draft.name}
                  onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                  placeholder="e.g. Link Accounts — April 2026"
                />
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

              {/* Subject — only shown for email */}
              {isEmail && (
                <label className="text-sm text-gray-600">
                  <span className="mb-2 block font-medium text-gray-800">Subject</span>
                  <input
                    value={draft.subject}
                    onChange={e => setDraft(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                  />
                </label>
              )}

              <label className="text-sm text-gray-600">
                <span className="mb-2 block font-medium text-gray-800">Title</span>
                <input
                  value={draft.title}
                  onChange={e => setDraft(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                />
              </label>

              <label className="text-sm text-gray-600 md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">Body</span>
                  {isPush && (
                    <span className={`text-xs font-medium tabular-nums ${pushOverLimit ? 'text-orange-500' : 'text-gray-400'}`}>
                      {bodyLength} / 110{pushOverLimit ? ' — keep it shorter for best delivery' : ''}
                    </span>
                  )}
                </div>
                <textarea
                  value={draft.body}
                  onChange={e => setDraft(prev => ({ ...prev, body: e.target.value }))}
                  rows={6}
                  className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-1 ${
                    pushOverLimit
                      ? 'border-orange-400 focus:border-orange-400 focus:ring-orange-400'
                      : 'border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20]'
                  }`}
                />
              </label>

              <label className="text-sm text-gray-600 md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-800">Deep link (where the tap lands)</span>
                  <span className="text-xs text-gray-400">mobile validates against an allowlist</span>
                </div>
                <select
                  value={draft.route}
                  onChange={e => setDraft(prev => ({ ...prev, route: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                >
                  {/* If the saved campaign has a route we don't know about,
                      render it anyway so the admin can see and change it. */}
                  {DEEP_LINK_ROUTES.some(r => r.value === draft.route)
                    ? null
                    : <option value={draft.route}>{draft.route} (saved)</option>}
                  {DEEP_LINK_ROUTES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* ── Audience filters ───────────────────────────────────────────── */}
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
        </div>

        {/* ── Retention Offer panel (unchanged) ───────────────────────────────── */}
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

      {/* ── Recent Lifecycle Campaigns ──────────────────────────────────────── */}
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
            const breakdown = breakdowns[id];
            const byStatus = (breakdown?.byStatus as Record<string, number> | undefined) || {};
            return (
              <div key={id} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{String(campaign.name || 'Untitled')}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {String(campaign.channel || 'email')} · {String(campaign.status || 'draft')} · {String(campaign.templateKey || 'custom')}
                      {campaign.route ? (
                        <> · taps go to <span className="font-mono text-[11px] text-gray-600">{String(campaign.route)}</span></>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Targets: <strong>{Number(campaign.targetCount || 0).toLocaleString()}</strong>
                      {' · '}
                      <span className="text-green-700">Sent: {Number(campaign.sentCount || 0).toLocaleString()}</span>
                      {' · '}
                      <span className="text-amber-700">Skipped: {Number(campaign.skippedCount || 0).toLocaleString()}</span>
                      {' · '}
                      <span className="text-red-700">Failed: {Number(campaign.failedCount || 0).toLocaleString()}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Skipped = users who opted out or were in quiet hours. Failed = actual delivery errors.
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
                    {rows && rows.length > 0 && (
                      <button
                        type="button"
                        onClick={() => exportDeliveriesCsv(id, String(campaign.name || `campaign_${id}`))}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        title="Download per-user delivery rows as CSV"
                      >
                        Export CSV
                      </button>
                    )}
                  </div>
                </div>
                {Object.keys(byStatus).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.entries(byStatus)
                      .sort((a, b) => (b[1] as number) - (a[1] as number))
                      .map(([status, count]) => (
                        <span
                          key={status}
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : status.startsWith('skipped')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                          title={`${count} user(s) with status "${status}"`}
                        >
                          {status}: {count.toLocaleString()}
                        </span>
                      ))}
                  </div>
                )}
                {rows && rows.length > 0 && (
                  <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-gray-100">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">User ID</th>
                          <th className="px-3 py-2 text-left font-medium">Email</th>
                          <th className="px-3 py-2 text-left font-medium">Channel</th>
                          <th className="px-3 py-2 text-left font-medium">Status</th>
                          <th className="px-3 py-2 text-left font-medium">Destination</th>
                          <th className="px-3 py-2 text-left font-medium">Error / Note</th>
                          <th className="px-3 py-2 text-left font-medium">Queued At</th>
                          <th className="px-3 py-2 text-left font-medium">Sent At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((delivery, index) => {
                          const status = String(delivery.status || '—');
                          const err = delivery.errorMessage ? String(delivery.errorMessage) : '';
                          const sentAtNum = typeof delivery.sentAt === 'number' ? delivery.sentAt : null;
                          const createdAtNum = typeof delivery.createdAt === 'number' ? delivery.createdAt : null;
                          const email = delivery.userEmail ? String(delivery.userEmail) : '';
                          return (
                            <tr key={`${id}-${index}`} className="border-t border-gray-100">
                              <td className="px-3 py-2 font-mono text-xs text-gray-700">{String(delivery.userId || '—')}</td>
                              <td className="px-3 py-2 text-xs text-gray-700 break-all" title={email || undefined}>
                                {email || <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-3 py-2 text-gray-700">{String(delivery.channel || '—')}</td>
                              <td className="px-3 py-2">
                                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                                  status === 'sent' ? 'bg-green-50 text-green-700' :
                                  status.startsWith('skipped') ? 'bg-amber-50 text-amber-700' :
                                  'bg-red-50 text-red-700'
                                }`}>{status}</span>
                              </td>
                              <td className="px-3 py-2 text-gray-500 font-mono text-[11px] break-all max-w-[12rem]">{String(delivery.destination || '—')}</td>
                              <td className="px-3 py-2 text-xs text-gray-500 max-w-sm break-words" title={err}>{err || '—'}</td>
                              <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">{createdAtNum ? toLocalDateTime(createdAtNum) : '—'}</td>
                              <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">{sentAtNum ? toLocalDateTime(sentAtNum) : '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
          {!campaigns.length && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
              No campaigns yet — pick a template above to create your first one.
            </div>
          )}
        </div>
      </div>

      {/* ── Broadcast Delivery & Open Stats ────────────────────────────────── */}
      {(broadcastStats || loadingStats || lastBroadcastId) && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Broadcast Results</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{lastBroadcastId}</p>
            </div>
            {lastBroadcastId && (
              <button
                type="button"
                onClick={() => loadBroadcastStats(lastBroadcastId)}
                disabled={loadingStats}
                className="text-sm font-medium text-[#1B5E20] hover:underline disabled:opacity-60"
              >
                {loadingStats ? 'Refreshing…' : 'Refresh'}
              </button>
            )}
          </div>

          {loadingStats && !broadcastStats && (
            <p className="text-sm text-gray-400">Loading stats — FCM batches can take a few seconds…</p>
          )}

          {broadcastStats && (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-5">
                {[
                  { label: 'Delivered', value: broadcastStats.delivered, color: 'text-green-700' },
                  { label: 'Opened', value: broadcastStats.opened, color: 'text-blue-700' },
                  { label: 'Open rate', value: `${broadcastStats.openRate}%`, color: 'text-[#1B5E20]' },
                  { label: 'Failed', value: broadcastStats.failed, color: 'text-red-600' },
                  { label: 'No token', value: broadcastStats.noToken, color: 'text-gray-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl border bg-gray-50 p-3 text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {broadcastStats.notOpened.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      Did not open ({broadcastStats.notOpened.length})
                      <span className="ml-2 text-xs font-normal text-gray-400">— retarget with a follow-up email or campaign</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const csv = ['email,name', ...broadcastStats.notOpened.map(u => `${u.email},${u.fullName}`)].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `not-opened-${lastBroadcastId?.slice(0, 8)}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-xs font-medium text-[#1B5E20] hover:underline"
                    >
                      Export CSV
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Name</th>
                          <th className="px-3 py-2 text-left font-medium">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {broadcastStats.notOpened.map(u => (
                          <tr key={u.userId} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-700">{u.fullName || '—'}</td>
                            <td className="px-3 py-2 text-gray-500">{u.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {broadcastStats.notOpened.length === 0 && broadcastStats.delivered > 0 && (
                <p className="text-sm text-gray-500">Everyone who received the notification has opened it.</p>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Recent Feedback & Leads ─────────────────────────────────────────── */}
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
