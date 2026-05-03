'use client';
/**
 * 2026-05-03 (Section B·2): "Ask Barakah" floating assistant.
 *
 * A demo-grade in-app assistant that answers questions about the
 * user's own data using a local pattern-match library (no LLM call
 * required, so the demo is free + offline-tolerant). Surfaces:
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
 *
 * Future swap-in: replace `runLocalIntentMatch` with a call to an
 * /api/assistant/ask endpoint that proxies to a real model. The
 * response shape (`{ text, links }`) is already structured for that.
 */
import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { useCurrency } from '../../lib/useCurrency';

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

const SUGGESTIONS = [
  "Am I on track for Hajj?",
  "How much zakat do I owe?",
  "What's my savings rate this month?",
  "Show my biggest recurring expenses",
];

const FALLBACK_TEXT =
  "I can answer questions about your zakat, savings goals, recurring bills, and monthly cash flow. " +
  "Try one of the suggestions above, or check the page that matches your question.";

function formatMoney(n: number, fmt: (n: number) => string) {
  return Number.isFinite(n) ? fmt(n) : '—';
}

/**
 * Pattern-match the user's question against a small intent library.
 * Each intent is a regex + a function that produces a `ChatMsg` from
 * the dashboard snapshot. Order matters — first match wins.
 */
function runLocalIntentMatch(
  q: string,
  snap: DashboardSnapshot,
  fmt: (n: number) => string
): ChatMsg {
  const t = q.toLowerCase().trim();

  // Hajj / Umrah / "on track" — savings goal progress.
  if (/hajj|umrah|on track|goal/.test(t)) {
    const total = snap.goalsTotal ?? 0;
    const saved = snap.goalsSaved ?? 0;
    if (total === 0) {
      return {
        role: 'barakah',
        text:
          "You don't have any savings goals set yet. Create one (Hajj, Umrah, emergency fund) " +
          'and Barakah will track your progress with milestone alerts.',
        links: [{ label: 'Set a goal', href: '/dashboard/savings' }],
      };
    }
    const pct = Math.round((saved / total) * 100);
    return {
      role: 'barakah',
      text:
        `Across ${snap.goalCount ?? 0} goal${(snap.goalCount ?? 0) === 1 ? '' : 's'}, ` +
        `you've saved ${formatMoney(saved, fmt)} of ${formatMoney(total, fmt)} (${pct}%). ` +
        (pct >= 75
          ? "Mashallah — you're nearly there. Stay consistent."
          : pct >= 50
          ? 'You\'re past the halfway mark — consider bumping your monthly contribution.'
          : 'Steady contributions get you there. Even small amounts compound.'),
      links: [{ label: 'See goals', href: '/dashboard/savings' }],
    };
  }

  // Zakat — when due, how much.
  if (/zakat|nisab/.test(t)) {
    const due = snap.zakatDue ?? 0;
    return {
      role: 'barakah',
      text:
        due > 0
          ? `Based on your current zakatable assets, your estimated zakat is ${formatMoney(due, fmt)}.` +
            (snap.zakatNextDate ? ` Your next zakat date is ${snap.zakatNextDate}.` : '')
          : "You're below the nisab threshold or haven't completed your zakat profile yet. " +
            'Open the Zakat page to set your hawl date and itemize your assets.',
      links: [{ label: 'Open Zakat', href: '/dashboard/zakat' }],
    };
  }

  // Savings rate / cash flow.
  if (/savings rate|how much.*sav|cash flow|spend/.test(t)) {
    const inc = snap.monthlyIncome ?? 0;
    const sav = snap.monthlySavings ?? 0;
    if (inc === 0) {
      return {
        role: 'barakah',
        text:
          "I don't see any income recorded this month. Once you log income transactions or " +
          'connect a bank, your savings rate will appear here.',
        links: [{ label: 'Open Cash Flow', href: '/dashboard/cash-flow' }],
      };
    }
    const rate = Math.round((sav / inc) * 100);
    return {
      role: 'barakah',
      text:
        `This month you earned ${formatMoney(inc, fmt)} and saved ${formatMoney(sav, fmt)} — ` +
        `a savings rate of ${rate}%. ` +
        (rate >= 20
          ? '20% is widely considered healthy — alhamdulillah.'
          : 'A 20% savings rate is a common target. Cash Flow shows where your dollars went.'),
      links: [{ label: 'Open Cash Flow', href: '/dashboard/cash-flow' }],
    };
  }

  // Recurring / subscriptions.
  if (/recurring|subscription|biggest|bill/.test(t)) {
    const recur = snap.recurringExpenseTotal ?? 0;
    if (recur === 0) {
      return {
        role: 'barakah',
        text:
          "You haven't marked any recurring transactions yet. Tag a transaction as recurring " +
          'on the Transactions page to start tracking subscriptions and bills.',
        links: [{ label: 'Open Transactions', href: '/dashboard/transactions' }],
      };
    }
    return {
      role: 'barakah',
      text:
        `You're committed to ${formatMoney(recur, fmt)}/month in recurring expenses. ` +
        'Open the Recurring page to see the full list and the new Calendar view to spot overlap days.',
      links: [{ label: 'Open Recurring', href: '/dashboard/recurring' }],
    };
  }

  // Net worth.
  if (/net worth|how rich|how much.*worth/.test(t)) {
    const nw = snap.netWorth ?? 0;
    return {
      role: 'barakah',
      text:
        nw > 0
          ? `Your current net worth is ${formatMoney(nw, fmt)}. The Net Worth page tracks the trend over time.`
          : 'Add accounts to your Assets page to start tracking net worth — Barakah will reconcile it monthly.',
      links: [{ label: 'Open Net Worth', href: '/dashboard/net-worth' }],
    };
  }

  return { role: 'barakah', text: FALLBACK_TEXT };
}

export function AskBarakah() {
  const { fmt } = useCurrency();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [snap, setSnap] = useState<DashboardSnapshot>({});
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'barakah',
      text:
        'Assalamu alaikum 👋 — I\'m Barakah, your Islamic finance guide. ' +
        'Ask me about zakat, savings goals, cash flow, or recurring bills.',
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate the snapshot once the panel opens (on demand to avoid
  // hammering the API on every dashboard mount). All endpoints are
  // best-effort — a 404 or 500 on any one shouldn't break the
  // assistant; the local intent matcher gracefully falls back to
  // "I don't have that data yet, here's where to set it up" copy.
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
        // swallow — assistant still works with whatever subset we got.
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

  const handleSend = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    // Tiny artificial delay so the response doesn't pop in instantly —
    // reads more conversational than telepathic.
    setTimeout(() => {
      setMessages(prev => [...prev, runLocalIntentMatch(q, snap, fmt)]);
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
          aria-label="Open Ask Barakah assistant"
        >
          <span aria-hidden="true">🕌</span>
          <span className="text-sm font-semibold">Ask Barakah</span>
        </button>
      )}

      {/* Side panel. Right-anchored, full-height, slides in. */}
      {open && (
        <>
          {/* Click-outside scrim */}
          <button
            type="button"
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
          />
          <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white dark:bg-card shadow-2xl flex flex-col">
            <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">🕌</span>
                <div>
                  <p className="font-semibold text-sm">Ask Barakah</p>
                  <p className="text-[11px] opacity-80">Your Islamic finance guide</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
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
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
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
                placeholder="Ask about zakat, savings, cash flow..."
                className="flex-1 bg-gray-50 dark:bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                aria-label="Message Barakah"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg px-3 py-2 text-sm font-semibold transition"
              >
                Send
              </button>
            </form>

            <p className="px-4 pb-3 text-[10px] text-muted-foreground text-center">
              Demo mode — answers come from your account data, not investment advice. Not a fatwa.
            </p>
          </div>
        </>
      )}
    </>
  );
}
