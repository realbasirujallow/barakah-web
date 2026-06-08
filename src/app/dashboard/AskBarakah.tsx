'use client';
/**
 * 2026-05-03 (Section B·2): "Ask Barakah" — guided help over the user's
 * own data.
 *
 * In-app guided help that answers questions about the user's own
 * records using a local pattern-match library, so the panel works
 * offline-tolerantly and never sends user data anywhere. Surfaces:
 *
 *   1. Floating green/gold pill button in the bottom-right
 *   2. On click, a right-anchored side panel slides in with:
 *        - Greeting + suggestion chips
 *        - Conversation transcript
 *        - Free-form text input
 *
 * Responses are derived from data we already load on the dashboard
 * (zakat status, savings goals, recurring rows, net-worth deltas).
 * For questions outside the supported intents we surface a friendly
 * fallback that points the user at the relevant page — never invent
 * a financial answer we can't back with their data.
 */
import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { useCurrency } from '../../lib/useCurrency';
import { useI18n } from '../../lib/i18n';

interface ChatMsg {
  role: 'user' | 'barakah';
  text: string;
  links?: Array<{ label: string; href: string }>;
}

interface DashboardSnapshot {
  netWorth?: number;
  monthlyIncome?: number;
  monthlySavings?: number;
  zakatDue?: number;
  zakatNextDate?: string;
  goalCount?: number;
  goalsTotal?: number;
  goalsSaved?: number;
  recurringExpenseTotal?: number;
}

function formatMoney(n: number, fmt: (n: number) => string) {
  return Number.isFinite(n) ? fmt(n) : '—';
}

/**
 * Pattern-match the user's question against a small intent library.
 * Each intent is a regex + a function that produces a `ChatMsg` from
 * the dashboard snapshot. Order matters — first match wins.
 *
 * Response bodies + link labels resolve through the i18n layer so the
 * panel renders in the user's selected locale.
 */
type IntentI18n = {
  t: (key: string) => string;
  tFmt: (key: string, args: ReadonlyArray<string | number>) => string;
};

function runLocalIntentMatch(
  q: string,
  snap: DashboardSnapshot,
  fmt: (n: number) => string,
  fallbackText: string,
  i18n: IntentI18n,
): ChatMsg {
  const { t, tFmt } = i18n;
  const query = q.toLowerCase().trim();

  // Hajj / Umrah / "on track" — savings goal progress.
  if (/hajj|umrah|on track|goal/.test(query)) {
    const total = snap.goalsTotal ?? 0;
    const saved = snap.goalsSaved ?? 0;
    if (total === 0) {
      return {
        role: 'barakah',
        text: t('askBarakahGoalsEmpty'),
        links: [{ label: t('askBarakahLinkSetGoal'), href: '/dashboard/savings' }],
      };
    }
    const pct = Math.round((saved / total) * 100);
    const goalCount = snap.goalCount ?? 0;
    const progressKey = goalCount === 1 ? 'askBarakahGoalsProgressSingular' : 'askBarakahGoalsProgressPlural';
    const progress = tFmt(progressKey, [goalCount, formatMoney(saved, fmt), formatMoney(total, fmt), pct]);
    const suffixKey =
      pct >= 75 ? 'askBarakahGoalsNearlyThere' : pct >= 50 ? 'askBarakahGoalsHalfway' : 'askBarakahGoalsSlow';
    return {
      role: 'barakah',
      text: progress + t(suffixKey),
      links: [{ label: t('askBarakahLinkSeeGoals'), href: '/dashboard/savings' }],
    };
  }

  // Zakat — when due, how much.
  if (/zakat|nisab/.test(query)) {
    const due = snap.zakatDue ?? 0;
    let text: string;
    if (due > 0) {
      text = tFmt('askBarakahZakatDue', [formatMoney(due, fmt)]);
      if (snap.zakatNextDate) text += tFmt('askBarakahZakatNextDate', [snap.zakatNextDate]);
    } else {
      text = t('askBarakahZakatBelowNisab');
    }
    return {
      role: 'barakah',
      text,
      links: [{ label: t('askBarakahLinkOpenZakat'), href: '/dashboard/zakat' }],
    };
  }

  // Savings rate / cash flow.
  if (/savings rate|how much.*sav|cash flow|spend/.test(query)) {
    const inc = snap.monthlyIncome ?? 0;
    const sav = snap.monthlySavings ?? 0;
    if (inc === 0) {
      return {
        role: 'barakah',
        text: t('askBarakahCashflowNoIncome'),
        links: [{ label: t('askBarakahLinkOpenCashFlow'), href: '/dashboard/cash-flow' }],
      };
    }
    const rate = Math.round((sav / inc) * 100);
    const summary = tFmt('askBarakahCashflowSummary', [formatMoney(inc, fmt), formatMoney(sav, fmt), rate]);
    const suffix = rate >= 20 ? t('askBarakahCashflowHealthy') : t('askBarakahCashflowLow');
    return {
      role: 'barakah',
      text: summary + suffix,
      links: [{ label: t('askBarakahLinkOpenCashFlow'), href: '/dashboard/cash-flow' }],
    };
  }

  // Recurring / subscriptions.
  if (/recurring|subscription|biggest|bill/.test(query)) {
    const recur = snap.recurringExpenseTotal ?? 0;
    if (recur === 0) {
      return {
        role: 'barakah',
        text: t('askBarakahRecurringNone'),
        links: [{ label: t('askBarakahLinkOpenTransactions'), href: '/dashboard/transactions' }],
      };
    }
    return {
      role: 'barakah',
      text: tFmt('askBarakahRecurringSummary', [formatMoney(recur, fmt)]),
      links: [{ label: t('askBarakahLinkOpenRecurring'), href: '/dashboard/recurring' }],
    };
  }

  // Net worth.
  if (/net worth|how rich|how much.*worth/.test(query)) {
    const nw = snap.netWorth ?? 0;
    return {
      role: 'barakah',
      text: nw > 0 ? tFmt('askBarakahNetWorthSummary', [formatMoney(nw, fmt)]) : t('askBarakahNetWorthEmpty'),
      links: [{ label: t('askBarakahLinkOpenNetWorth'), href: '/dashboard/net-worth' }],
    };
  }

  return { role: 'barakah', text: fallbackText };
}

export function AskBarakah() {
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  const suggestions = [
    t('askBarakahSuggestion1'),
    t('askBarakahSuggestion2'),
    t('askBarakahSuggestion3'),
    t('askBarakahSuggestion4'),
  ];
  const fallbackText = t('askBarakahFallbackBody');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [snap, setSnap] = useState<DashboardSnapshot>({});
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'barakah',
      text: t('askBarakahWelcomeBody'),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate the snapshot once the panel opens (on demand to avoid
  // hammering the API on every dashboard mount). All endpoints are
  // best-effort — a 404 or 500 on any one shouldn't break the panel;
  // the local intent matcher gracefully falls back to "I don't have
  // that data yet, here's where to set it up" copy.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const [zakat, goals, recurring, cashflow] = await Promise.allSettled([
          api.getZakatSummary(),
          api.getSavingsGoals(),
          api.getRecurringTransactions(),
          api.getCashflowMonths(2),
        ]);
        if (cancelled) return;
        const next: DashboardSnapshot = {};
        if (zakat.status === 'fulfilled' && zakat.value) {
          const z = zakat.value as { zakatDue?: number; nextZakatDate?: string };
          next.zakatDue = z.zakatDue;
          next.zakatNextDate = z.nextZakatDate;
        }
        if (cashflow.status === 'fulfilled' && cashflow.value) {
          const c = cashflow.value as { months?: Array<{ income: number; savings: number }> };
          const months = c.months ?? [];
          // Most-recent fully-populated month (skip the trailing month
          // with all-zeros which is the in-progress current month).
          const last = months.findLast?.(m => (m.income ?? 0) > 0) ?? months[months.length - 1];
          if (last) {
            next.monthlyIncome = last.income;
            next.monthlySavings = last.savings;
          }
        }
        if (goals.status === 'fulfilled' && goals.value) {
          const g = goals.value as { goals?: Array<{ targetAmount: number; currentAmount: number }> } | Array<{ targetAmount: number; currentAmount: number }>;
          const list = Array.isArray(g) ? g : (g.goals ?? []);
          next.goalCount = list.length;
          next.goalsTotal = list.reduce((s, x) => s + (x.targetAmount || 0), 0);
          next.goalsSaved = list.reduce((s, x) => s + (x.currentAmount || 0), 0);
        }
        if (recurring.status === 'fulfilled' && recurring.value) {
          const r = recurring.value as { transactions?: Array<{ type: string; amount: number; recurringActive: boolean }> } | Array<{ type: string; amount: number; recurringActive: boolean }>;
          const list = Array.isArray(r) ? r : (r.transactions ?? []);
          next.recurringExpenseTotal = list
            .filter(t => t.recurringActive && t.type !== 'income')
            .reduce((s, t) => s + (t.amount || 0), 0);
        }
        setSnap(next);
      } catch {
        // swallow — panel still works with whatever subset we got.
      }
    })();
    return () => { cancelled = true; };
  }, [open]);

  // Auto-scroll the transcript on each new message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // 2026-06-08 (A11Y-ASKBARAKAH-PANEL-1): Escape closes the panel.
  // Pairs with the role=dialog/aria-modal annotations on the surface
  // so keyboard users have a non-mouse exit path.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleSend = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    // Tiny artificial delay so the response doesn't pop in instantly —
    // reads more conversational than telepathic.
    setTimeout(() => {
      setMessages(prev => [...prev, runLocalIntentMatch(q, snap, fmt, fallbackText, { t, tFmt })]);
    }, 280);
  };

  return (
    <>
      {/* Floating launcher button. Bottom-right, above the FeedbackWidget. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-6 z-40 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg rounded-full pl-4 pr-5 py-3 flex items-center gap-2 transition"
          aria-label={t('askBarakahLauncherLabel')}
        >
          <span aria-hidden="true">🕌</span>
          <span className="text-sm font-semibold">{t('askBarakahLauncherLabel')}</span>
        </button>
      )}

      {/* Side panel. Right-anchored, full-height, slides in. */}
      {open && (
        <>
          {/* Click-outside scrim */}
          <button
            type="button"
            aria-label={t('askBarakahCloseLabel')}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
          />
          {/* 2026-06-08 (A11Y-ASKBARAKAH-PANEL-1, robustness sweep):
              role=dialog + aria-modal + labelledby tell screen readers
              this is a modal surface; without these Tab focus escaped
              into the inert dashboard behind. Escape close handler
              wired below in the existing useEffect. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="askbarakah-header-title"
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white dark:bg-card shadow-2xl flex flex-col">
            <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">🕌</span>
                <div>
                  <p id="askbarakah-header-title" className="font-semibold text-sm">{t('askBarakahHeaderTitle')}</p>
                  <p className="text-[11px] opacity-80">{t('askBarakahHeaderSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('askBarakahCloseShortLabel')}
                className="text-white/80 hover:text-white text-xl leading-none px-2"
              >
                ×
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-gray-100 dark:bg-muted text-foreground mr-auto'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.links.map(l => (
                        <a
                          key={l.href}
                          href={l.href}
                          className="inline-block text-xs font-semibold underline underline-offset-2 hover:opacity-80"
                        >
                          {l.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">{t('askBarakahTryAskingLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50 rounded-full px-3 py-1.5 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="border-t border-border p-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('askBarakahPlaceholder')}
                className="flex-1 bg-gray-50 dark:bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                aria-label={t('askBarakahMessageInputLabel')}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg px-3 py-2 text-sm font-semibold transition"
              >
                {t('askBarakahSendLabel')}
              </button>
            </form>

            <p className="px-4 pb-3 text-[10px] text-muted-foreground text-center">
              {t('askBarakahDisclaimer')}
            </p>
          </div>
        </>
      )}
    </>
  );
}
