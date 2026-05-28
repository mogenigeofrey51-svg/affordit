import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  Eye,
  Filter,
  History,
  Home,
  Info,
  Menu,
  Newspaper,
  PiggyBank,
  Plus,
  Search,
  ShoppingBag,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";

const currency = "KES";

const recurringExpenses = [
  { name: "Rent", category: "Housing", amount: 35000, frequency: "Monthly", nextDate: "June 1" },
  { name: "Netflix", category: "Recurring", amount: 1100, frequency: "Monthly", nextDate: "June 5" },
  { name: "Gym membership", category: "Health", amount: 3000, frequency: "Monthly", nextDate: "June 7" },
  { name: "Loan repayment", category: "Debt", amount: 8500, frequency: "Monthly", nextDate: "June 10" },
];

const dailyRecurringExpenses = [
  { name: "Daily transport", category: "Transport", dailyAmount: 400, daysPerMonth: 22 },
  { name: "Lunch at work", category: "Food & Drinks", dailyAmount: 350, daysPerMonth: 20 },
];

const plannedExpenses = [
  { name: "Mombasa trip", category: "Trip", amount: 11500, target: 25000, date: "In 35 days", priority: "Plan" },
  { name: "New iPhone", category: "Goal", amount: 8300, target: 15000, date: "In 60 days", priority: "Goal" },
  { name: "Birthday plan", category: "Event", amount: 2200, target: 5000, date: "In 20 days", priority: "Event" },
];

const fakeBudget = {
  plannedUpcoming: 12500,
  safeAfterPlanned: 14250,
  emergencyFund: 42000,
  emergencyTarget: 100000,
};

const budgetCategories = [
  { name: "Food & Drinks", group: "needs", spent: 6250, limit: 15000, hasDailyLimit: true, dailyLimit: 2000, activeDays: 20, color: "#FFB23E" },
  { name: "Transport", group: "needs", spent: 2400, limit: 8000, hasDailyLimit: true, dailyLimit: 1200, activeDays: 22, color: "#2FD08A" },
  { name: "Shopping", group: "wants", spent: 2812, limit: 10000, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#7C5CFC" },
  { name: "Entertainment", group: "wants", spent: 2062, limit: 7000, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#5BA7FF" },
  { name: "Others", group: "wants", spent: 1876, limit: 6000, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#9AA3B2" },
];

const history = [
  { item: "Friday dinner", amount: 2800, decision: "Hold up", score: 48, date: "Today, 7:30 PM", category: "Food & Drinks" },
  { item: "New sneakers", amount: 8500, decision: "Go for it", score: 84, date: "Yesterday, 4:10 PM", category: "Shopping" },
  { item: "Bolt to Westlands", amount: 350, decision: "Go for it", score: 90, date: "Yesterday, 9:15 AM", category: "Transport" },
  { item: "Concert ticket", amount: 3000, decision: "Try cheaper", score: 58, date: "Sat, 8:45 PM", category: "Entertainment" },
  { item: "Mombasa trip", amount: 11500, decision: "Plan", score: 72, date: "May 3, 2024", category: "Trip" },
  { item: "Netflix", amount: 1100, decision: "Recurring", score: 70, date: "May 1, 2024", category: "Recurring" },
];

const demoScenarios = [
  { item: "Friday dinner", merchant: "Kilimani rooftop", amount: 2800, verdict: "dailyLimit", category: "Food & Drinks" },
  { item: "New sneakers", merchant: "Online store", amount: 8500, verdict: "go", category: "Shopping" },
  { item: "Weekend getaway", merchant: "Booking", amount: 15000, verdict: "hold", category: "Trip" },
  { item: "Concert ticket", merchant: "Live event", amount: 3000, verdict: "cheaper", category: "Entertainment" },
];

const expenses = [
  { merchant: "Burger King", category: "Food & Drinks", amount: 850, date: "Today, 1:34 PM" },
  { merchant: "Bolt Ride", category: "Transport", amount: 320, date: "Today, 10:12 AM" },
  { merchant: "Java House", category: "Food & Drinks", amount: 580, date: "Yesterday, 6:45 PM" },
  { merchant: "Naivas", category: "Food & Drinks", amount: 3200, date: "May 20" },
];

const incomeSources = [
  { source: "Salary", category: "Main income", amount: 45000, date: "May 25" },
  { source: "Freelance design", category: "Side income", amount: 15000, date: "May 18" },
];

const marketBriefing = {
  updatedAt: "Today, 8:00 AM EAT",
  headline: "AI briefing: watch liquidity, NSE movers, and fund yields before big spends.",
  summary:
    "Markets can change your financial mood even when your budget looks stable. Affordit tracks local market headlines, NSE movers, and fund watch items so spending advice can stay context-aware.",
  bullets: [
    "NSE watch: review top gainers and losers before making investment-linked spending decisions.",
    "Mansa X watch: compare yields, fees, liquidity, and withdrawal timing before treating returns as spendable cash.",
    "Budget link: if markets are volatile, Affordit should protect emergency funds and tighten discretionary approvals.",
  ],
  movers: [
    { symbol: "NSE Gainer A", name: "Top mover placeholder", change: "+6.2%", tone: "up" },
    { symbol: "NSE Gainer B", name: "Banking watchlist", change: "+4.1%", tone: "up" },
    { symbol: "NSE Loser A", name: "Profit taking watch", change: "-3.4%", tone: "down" },
  ],
  funds: [
    { name: "Mansa X", note: "Check latest factsheet, yield, fees, liquidity window, and risk notes before using gains in a budget." },
    { name: "Money market funds", note: "Good for near-term goals only if withdrawal timing matches upcoming plans." },
    { name: "Emergency fund", note: "Keep this separate from lifestyle spending, even when markets are green." },
  ],
};

const categoryOptions = [
  { name: "Outfits", icon: ShoppingBag },
  { name: "Food", icon: CreditCard },
  { name: "Rides", icon: Wallet },
  { name: "Events", icon: CalendarDays },
  { name: "Trips", icon: Target },
  { name: "More", icon: Plus },
];

function money(value) {
  const amount = Number(value || 0);
  return `${currency} ${amount.toLocaleString()}`;
}

function pct(value, total) {
  return total ? Math.round((Number(value || 0) / Number(total || 1)) * 100) : 0;
}

function budgetTotals(budgetItems, incomeItems = incomeSources) {
  const income = incomeItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const actual = budgetItems.reduce((sum, item) => sum + Number(item.spent || 0), 0);
  const planned = budgetItems.reduce((sum, item) => sum + Number(item.limit || 0), 0);
  const needs = budgetItems.filter((item) => item.group === "needs").reduce((sum, item) => sum + Number(item.limit || 0), 0) + recurringExpenses.filter((item) => ["Housing", "Debt"].includes(item.category)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const wants = budgetItems.filter((item) => item.group === "wants").reduce((sum, item) => sum + Number(item.limit || 0), 0);
  const savingsBudget = budgetItems.filter((item) => item.group === "savings").reduce((sum, item) => sum + Number(item.limit || 0), 0) + fakeBudget.plannedUpcoming;
  const savings = Math.max(savingsBudget, income - needs - wants);
  const remaining = planned - actual;
  return { income, actual, planned, needs, wants, savings, remaining };
}

function budgetHealth(budgetItems, incomeItems = incomeSources) {
  const totals = budgetTotals(budgetItems, incomeItems);
  const rules = [
    { key: "needs", label: "Needs", target: 50, value: pct(totals.needs, totals.income), amount: totals.needs, color: "#2FD08A" },
    { key: "savings", label: "Savings", target: 20, value: pct(totals.savings, totals.income), amount: totals.savings, color: "#7C5CFC" },
    { key: "wants", label: "Wants", target: 30, value: pct(totals.wants, totals.income), amount: totals.wants, color: "#5BA7FF" },
  ];
  const score = Math.max(0, Math.round(100 - rules.reduce((sum, rule) => sum + Math.abs(rule.value - rule.target), 0)));
  const status = score >= 85 ? "Healthy" : score >= 70 ? "Watch" : "Needs work";
  return { ...totals, rules, score, status };
}

function budgetComparisonRows(budgetItems) {
  return budgetItems.map((item) => {
    const spent = Number(item.spent || 0);
    const limit = Number(item.limit || 0);
    const remaining = limit - spent;
    const used = pct(spent, limit);
    const status = remaining < 0 ? "Over" : used >= 85 ? "Close" : "On track";
    return { ...item, spent, limit, remaining, used, status };
  });
}

function generateBudgetInsights(budgetItems, incomeItems = incomeSources) {
  const health = budgetHealth(budgetItems, incomeItems);
  const rows = budgetComparisonRows(budgetItems);
  const over = rows.filter((row) => row.remaining < 0);
  const close = rows.filter((row) => row.remaining >= 0 && row.used >= 85);
  const highest = rows.slice().sort((a, b) => b.used - a.used)[0];
  const insights = [];

  if (health.rules.find((rule) => rule.key === "needs").value > 50) {
    insights.push("Needs are above the 50% target. Keep essentials tight before approving lifestyle spends.");
  }
  if (health.rules.find((rule) => rule.key === "wants").value > 30) {
    insights.push("Wants are running hot. Be stricter on outfits, events, and entertainment until payday.");
  }
  if (health.rules.find((rule) => rule.key === "savings").value < 20) {
    insights.push("Savings are below 20%. Push extra money toward plans before increasing flexible categories.");
  }
  if (over.length) {
    insights.push(`${over[0].name} is over budget by ${money(Math.abs(over[0].remaining))}. New asks here should be held or reduced.`);
  } else if (close.length) {
    insights.push(`${close[0].name} is close to its limit at ${close[0].used}%. Smaller choices here will protect the month.`);
  } else if (highest) {
    insights.push(`${highest.name} has the highest usage at ${highest.used}%. Watch it before weekend spending starts.`);
  }
  insights.push(`Budget health is ${health.status.toLowerCase()} at ${health.score}/100 based on the 50/20/30 rule.`);
  return insights.slice(0, 4);
}

function generateAskInsights({ amount, category }, budgetItems) {
  const selectedBudget = budgetItems.find((budget) => budget.name === category);
  const askAmount = Number(amount || 0);
  const insights = [];

  if (!selectedBudget) {
    return [
      "Choose a budget category so Affordit can compare this spend against your actual monthly limit.",
      `This ask is ${money(askAmount)}. Affordit is using safe-to-spend as the fallback check.`,
    ];
  }

  const spent = Number(selectedBudget.spent || 0);
  const limit = Number(selectedBudget.limit || 0);
  const remaining = limit - spent;
  const afterAsk = remaining - askAmount;
  const usedAfterAsk = pct(spent + askAmount, limit);
  const dailyLimit = Number(selectedBudget.dailyLimit || 0);

  if (afterAsk < 0) {
    insights.push(`This pushes ${selectedBudget.name} over budget by ${money(Math.abs(afterAsk))}. Consider a cheaper option or waiting.`);
  } else {
    insights.push(`${selectedBudget.name} has ${money(remaining)} left. After this, you'd still have ${money(afterAsk)} — you're good.`);
  }

  if (selectedBudget.hasDailyLimit && askAmount > dailyLimit) {
    const tomorrowSafe = fakeBudget.safeAfterPlanned - askAmount;
    insights.push(`Tomorrow's safe number drops to KES ${Math.max(0, tomorrowSafe).toLocaleString()} if you go ahead — above your daily ${selectedBudget.name.toLowerCase()} limit of ${money(dailyLimit)}.`);
  }

  if (usedAfterAsk >= 90) {
    insights.push(`This would push ${selectedBudget.name} to ${usedAfterAsk}% used. Future asks here should be stricter this month.`);
  } else if (usedAfterAsk >= 70) {
    insights.push(`This puts ${selectedBudget.name} at ${usedAfterAsk}% used. Still doable — keep the next few spends smaller.`);
  } else {
    insights.push(`This keeps ${selectedBudget.name} at ${usedAfterAsk}% used, which is comfortable for the month.`);
  }

  if (askAmount > fakeBudget.safeAfterPlanned) {
    insights.push(`This one bites into payday — it's higher than your safe-to-spend of ${money(fakeBudget.safeAfterPlanned)} after plans and commitments.`);
  } else {
    insights.push(`Stays within your safe-to-spend of ${money(fakeBudget.safeAfterPlanned)} after plans and commitments.`);
  }

  return insights.slice(0, 4);
}

// ─── Design tokens as inline style helpers ─────────────────────────────────

function Button({ children, className = "", variant = "primary", ...props }) {
  const styles =
    variant === "secondary"
      ? "bg-surface-2 text-text ring-1 ring-border hover:bg-[#2A303D]"
      : variant === "ghost"
        ? "bg-transparent text-muted hover:text-text"
        : "bg-brand text-white shadow-lg shadow-brand/20 hover:brightness-110 active:scale-95";

  return (
    <button className={`inline-flex items-center justify-center rounded-btn px-5 font-bold transition-all duration-150 ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function AppShell({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 60% 0%, #13111F 0%, #0E1117 60%)",
      }}
    >
      <div
        className="relative w-full max-w-[440px] mx-auto flex flex-col overflow-hidden bg-bg"
        style={{
          minHeight: "100svh",
          boxShadow: "0 0 0 1px #2C323D, 0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Desktop: constrained with rounded corners */}
        <style>{`
          @media (min-width: 480px) {
            .app-shell-inner {
              min-height: 860px !important;
              max-height: 920px !important;
              border-radius: 28px !important;
              border: 1px solid #2C323D !important;
            }
          }
        `}</style>
        <div className="app-shell-inner relative flex flex-col flex-1 overflow-hidden" style={{ minHeight: "100svh" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function AppFrame({ children, nav, screen, setScreen }) {
  return (
    <AppShell>
      <div className="relative flex flex-col flex-1 min-h-0">
        {children}
        {nav && <BottomNav screen={screen} setScreen={setScreen} />}
      </div>
    </AppShell>
  );
}

function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "ask", label: "Ask", icon: ShoppingBag },
    { id: "budget", label: "Budget", icon: PiggyBank },
    { id: "expenses", label: "Spend", icon: CreditCard },
    { id: "news", label: "News", icon: Newspaper },
  ];

  return (
    <nav className="border-t border-border bg-bg/95 px-3 pb-5 pt-2 backdrop-blur-sm">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = screen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold tracking-wide transition-all duration-150 ${
                active
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:text-text"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function IconButton({ icon: Icon, onClick, label, className = "" }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-muted ring-1 ring-border hover:text-text transition-colors ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}

function Label({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
      {children}
    </p>
  );
}

function Progress({ value, color = "#7C5CFC" }) {
  const safe = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-2">
      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${safe}%`, background: color }} />
    </div>
  );
}

function AnimatedRing({ value, size = 48, strokeWidth = 4, color = "#7C5CFC" }) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const id = `ring-${color.replace("#", "")}`;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#2C323D" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.7s ease-out",
        }}
      />
    </svg>
  );
}

function GoalCard({ plan }) {
  const progress = plan.target ? Math.round((plan.amount / plan.target) * 100) : 0;
  const configs = {
    Trip: { emoji: "🏖️", accent: "#2FD08A" },
    Goal: { emoji: "📱", accent: "#7C5CFC" },
    Event: { emoji: "🎂", accent: "#FFB23E" },
  };
  const config = configs[plan.category] || { emoji: "🎯", accent: "#7C5CFC" };

  return (
    <div
      className="relative w-36 flex-shrink-0 rounded-card p-4 bg-surface ring-1 ring-border"
      style={{ minHeight: 152 }}
    >
      <p className="text-xs font-bold leading-4 text-text">{plan.name}</p>
      <div className="mt-3 text-3xl">{config.emoji}</div>
      <div className="absolute bottom-3 right-3">
        <div className="relative" style={{ width: 48, height: 48 }}>
          <AnimatedRing value={progress} size={48} strokeWidth={4} color={config.accent} />
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-text">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenHeader({ title, subtitle, leftIcon = Menu, rightIcon = Bell, onLeft, onRight }) {
  const Left = leftIcon;
  const Right = rightIcon;
  return (
    <div className="flex items-start justify-between px-5 pt-6">
      <div>
        <button onClick={onLeft} className="mb-4 text-muted hover:text-text transition-colors">
          <Left size={22} />
        </button>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      <IconButton icon={Right} onClick={onRight} label="Action" />
    </div>
  );
}

function StatCard({ label, value, tone = "neutral" }) {
  const toneClass = {
    good: "text-safe",
    bad: "text-over",
    purple: "text-brand",
    neutral: "text-text",
  }[tone];

  return (
    <div className="rounded-card bg-surface-2 p-3 ring-1 ring-border">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-1 text-sm font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

// ─── Hero Number with count-up ───────────────────────────────────────────────

function HeroNumber({ target, tone = "safe" }) {
  const [displayed, setDisplayed] = useState(0);
  const start = useRef(Date.now());
  const duration = 900;

  useEffect(() => {
    let raf;
    function tick() {
      const elapsed = Date.now() - start.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const colorMap = {
    safe: "#2FD08A",
    caution: "#FFB23E",
    over: "#FF5C5C",
  };
  const shadowMap = {
    safe: "0 0 48px 10px rgba(47,208,138,0.15)",
    caution: "0 0 48px 10px rgba(255,178,62,0.15)",
    over: "0 0 48px 10px rgba(255,92,92,0.15)",
  };
  const color = colorMap[tone] || colorMap.safe;

  return (
    <div className="hero-animate inline-block" style={{ filter: `drop-shadow(${shadowMap[tone]})` }}>
      <span className="font-display font-bold" style={{ fontSize: 60, lineHeight: 1, color }}>
        {displayed.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Landing ────────────────────────────────────────────────────────────────

function Landing({ setScreen }) {
  return (
    <AppFrame>
      <div className="relative flex flex-col flex-1 px-6 pb-8 pt-7 overflow-hidden">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse at 70% 20%, rgba(124,92,252,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(47,208,138,0.10) 0%, transparent 50%)",
        }} />

        {/* Top bar */}
        <div className="relative flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-text">Affordit</span>
          <IconButton icon={Bell} label="Notifications" />
        </div>

        {/* Main content pushed to bottom */}
        <div className="relative mt-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-display max-w-xs text-[38px] font-bold leading-tight tracking-tight text-text">
              Check the fit,<br />the trip, the spend.
            </h1>
            <p className="mt-3 max-w-[17rem] text-[15px] leading-6 text-muted">
              Know if you can afford it before you tap pay — outfits, trips, food, rides, and more.
            </p>
          </motion.div>

          {/* Mini preview card */}
          <div className="mt-6 rounded-card bg-surface p-3 ring-1 ring-border shadow-card">
            <LandingMiniRow title="Weekend outfit" amount={4800} good />
            <LandingMiniRow title="Mombasa trip" amount={18500} good={false} />
          </div>

          {/* Benefit pills */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
            {[
              { icon: CheckCircle2, label: "Know before\nyou spend" },
              { icon: BarChart3, label: "Stay on\nbudget" },
              { icon: Target, label: "More life,\nless limits" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl bg-surface px-2 py-3.5 ring-1 ring-border">
                <Icon size={18} className="mx-auto text-brand" />
                <p className="mt-2 whitespace-pre text-[10px] font-semibold leading-4 text-muted">{label}</p>
              </div>
            ))}
          </div>

          <Button onClick={() => setScreen("login")} className="mt-5 h-14 w-full text-[15px]">
            Twendeni <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>
    </AppFrame>
  );
}

function LandingMiniRow({ title, amount, good }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2">
      <div className="h-11 w-11 shrink-0 rounded-xl bg-surface-2 flex items-center justify-center text-lg">
        {good ? "👗" : "🏖️"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-text">{title}</p>
        <p className="text-sm font-bold text-text">{money(amount)}</p>
      </div>
      <VerdictPill good={good} label={good ? "You're good" : "Hold up"} />
    </div>
  );
}

function VerdictPill({ good, label, tone }) {
  const t = tone || (good ? "safe" : "caution");
  const styles = {
    safe: "bg-safe/15 text-safe ring-safe/20",
    caution: "bg-caution/15 text-caution ring-caution/20",
    over: "bg-over/15 text-over ring-over/20",
    brand: "bg-brand-soft text-brand ring-brand/20",
  };
  return (
    <span className={`chip-pop rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${styles[t] || styles.safe}`}>
      {label}
    </span>
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────

function Login({ setScreen }) {
  return (
    <AppFrame>
      <div className="relative flex flex-col flex-1 px-6 pb-8 pt-7 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,92,252,0.14) 0%, transparent 50%)",
        }} />

        <div className="relative flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-text">Affordit</span>
          <IconButton icon={ChevronLeft} onClick={() => setScreen("landing")} label="Back" />
        </div>

        <div className="relative mt-auto">
          <h1 className="font-display text-3xl font-bold text-text">Karibu tena</h1>
          <p className="mt-2 text-[15px] text-muted">Spend smarter. Live better.</p>

          <div className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Phone number</span>
              <input
                defaultValue="+254 712 345 678"
                className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-[15px] text-text outline-none placeholder:text-muted focus:border-brand transition-colors"
              />
            </label>
            <Button onClick={() => setScreen("dashboard")} className="h-12 w-full text-[15px]">
              Continue
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            or continue with
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="h-12">Google</Button>
            <Button variant="secondary" className="h-12">Apple</Button>
          </div>

          <p className="mt-5 text-center text-[15px] text-muted">
            Don't have an account? <span className="font-bold text-brand">Sign up</span>
          </p>
        </div>
      </div>
    </AppFrame>
  );
}

// ─── Dashboard (Home) ────────────────────────────────────────────────────────

function Dashboard({ setScreen, incomeItems, expenseItems, budgetItems }) {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();
  const monthName = now.toLocaleString("default", { month: "long" });

  const totalBills = recurringExpenses.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const billsK = Math.round(totalBills / 1000);
  const goalsK = Math.round(fakeBudget.plannedUpcoming / 1000);
  const safeToSpend = fakeBudget.safeAfterPlanned;

  const totalSpent = budgetItems.reduce((sum, i) => sum + Number(i.spent || 0), 0);
  const totalBudget = budgetItems.reduce((sum, i) => sum + Number(i.limit || 0), 0);
  const spendPct = pct(totalSpent, totalBudget);
  const heroTone = safeToSpend <= 0 ? "over" : spendPct >= 80 ? "caution" : "safe";

  const patternInsight =
    "You eat out 38% more on Fridays. Skip one this month and your Mombasa trip lands a week earlier.";

  return (
    <PageScroll>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-7 pb-2">
        <div>
          <Label>Hujambo</Label>
          <h1 className="mt-1 font-display text-2xl font-bold text-text">Wanjiku 👋</h1>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white text-sm"
          style={{ background: "linear-gradient(135deg, #7C5CFC, #2FD08A)" }}
        >
          W
        </div>
      </div>

      {/* Safe to Spend hero */}
      <div className="px-5 pt-7 pb-5">
        <Label>Safe to spend today</Label>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-semibold text-muted">Ksh</span>
          <HeroNumber target={safeToSpend} tone={heroTone} />
        </div>
        <p className="mt-2.5 text-[14px] leading-6 text-muted">
          After Ksh {billsK}K in bills and Ksh {goalsK}K to goals. {daysLeft} days left in {monthName}.
        </p>
      </div>

      {/* Can I afford this CTA */}
      <div className="px-5 pb-6">
        <button
          onClick={() => setScreen("ask")}
          className="flex w-full items-center gap-4 rounded-card bg-brand p-4 shadow-lg shadow-brand/25 hover:brightness-110 active:scale-95 transition-all duration-150"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white text-xl font-bold">
            ✦
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-white text-[15px]">Can I afford this?</p>
            <p className="text-[13px] text-white/75">Ask before you tap pay</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
            <ArrowRight size={16} className="text-brand" />
          </div>
        </button>
      </div>

      {/* Goals */}
      <div>
        <div className="mb-3 flex items-center justify-between px-5">
          <Label>Goals</Label>
          <button onClick={() => setScreen("planned")} className="text-[11px] font-bold text-brand uppercase tracking-[0.08em]">
            See all
          </button>
        </div>
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-5 pb-3">
            {plannedExpenses.map((plan) => (
              <GoalCard key={plan.name} plan={plan} />
            ))}
          </div>
          {/* Gradient fade to signal scroll */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-bg to-transparent" />
        </div>
      </div>

      {/* Pattern insight */}
      <div className="mt-4 px-5 pb-8">
        <Label>Pattern</Label>
        <div className="mt-3 flex gap-3 rounded-card bg-surface p-4 ring-1 ring-border">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-caution/10">
            <TrendingUp size={20} className="text-caution" />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-caution">Pattern noticed</p>
            <p className="text-[14px] leading-5 text-muted">{patternInsight}</p>
          </div>
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Ask ─────────────────────────────────────────────────────────────────────

function Ask({ setScreen, setPurchase, budgetItems }) {
  const [amount, setAmount] = useState("2800");
  const [item, setItem] = useState("Friday dinner");
  const [category, setCategory] = useState("Food & Drinks");
  const selectedBudget = budgetItems.find((budget) => budget.name === category);
  const askAmount = Number(amount || 0);
  const categoryRemaining = selectedBudget ? Number(selectedBudget.limit || 0) - Number(selectedBudget.spent || 0) : 0;
  const afterAskRemaining = categoryRemaining - askAmount;
  const askInsights = generateAskInsights({ amount: askAmount, category }, budgetItems);

  function chooseScenario(scenario) {
    setItem(scenario.item);
    setAmount(String(scenario.amount));
    setCategory(scenario.category);
    setPurchase(scenario);
    setScreen("result");
  }

  const inputCls = "h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text outline-none focus:border-brand transition-colors placeholder:text-muted";

  return (
    <PageScroll flush>
      {/* Top gradient area */}
      <div className="relative px-5 pb-6 pt-6" style={{
        background: "linear-gradient(180deg, rgba(124,92,252,0.12) 0%, transparent 100%)",
      }}>
        <div className="flex justify-between mb-6">
          <IconButton icon={ChevronLeft} onClick={() => setScreen("dashboard")} label="Back" />
          <IconButton icon={Info} label="Info" />
        </div>
        <h1 className="font-display text-[28px] font-bold tracking-tight text-text">What's the move?</h1>
        <p className="mt-2 text-[15px] text-muted">Tell us what you're planning to spend on.</p>
      </div>

      <div className="space-y-5 px-5">
        {/* Search */}
        <label className="flex h-12 items-center gap-3 rounded-xl border border-border bg-surface-2 px-4">
          <Search size={17} className="text-muted shrink-0" />
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="What are you buying?"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-muted"
          />
        </label>

        {/* Category chips */}
        <div className="grid grid-cols-6 gap-2">
          {categoryOptions.map((option) => {
            const Icon = option.icon;
            const active = category === (option.name === "Food" ? "Food & Drinks" : option.name);
            return (
              <button
                key={option.name}
                onClick={() => setCategory(option.name === "Food" ? "Food & Drinks" : option.name)}
                className={`rounded-xl px-1 py-3 ring-1 transition-all ${active ? "bg-brand-soft ring-brand/30 text-brand" : "bg-surface-2 ring-border text-muted hover:text-text"}`}
              >
                <Icon size={18} className="mx-auto" />
                <span className="mt-1.5 block text-[10px] font-semibold">{option.name}</span>
              </button>
            );
          })}
        </div>

        {/* Amount + category */}
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className={inputCls} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border border-border bg-surface-2 px-3 text-[14px] text-text outline-none focus:border-brand transition-colors"
          >
            {budgetItems.map((budget) => (
              <option key={budget.name} value={budget.name}>{budget.name}</option>
            ))}
          </select>
        </div>

        {/* Budget check */}
        {selectedBudget && (
          <div className="rounded-card bg-surface p-4 ring-1 ring-border">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Budget check</p>
                <p className="mt-1 text-[15px] font-bold text-text">{selectedBudget.name}</p>
              </div>
              <VerdictPill
                tone={afterAskRemaining >= 0 ? "safe" : "over"}
                label={afterAskRemaining >= 0 ? "You're good" : "Over budget"}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <StatCard label="Left" value={money(categoryRemaining)} tone={categoryRemaining >= 0 ? "good" : "bad"} />
              <StatCard label="This ask" value={money(askAmount)} tone="purple" />
              <StatCard label="After" value={money(afterAskRemaining)} tone={afterAskRemaining >= 0 ? "good" : "bad"} />
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div>
          <SectionRow title="Affordit AI insights" action="Budget-aware" />
          <div className="mt-3 space-y-3">
            {askInsights.map((insight) => (
              <InsightCard key={insight} text={insight} compact />
            ))}
          </div>
        </div>

        {/* Popular ideas */}
        <div>
          <SectionRow title="Popular ideas" action="See all" />
          <div className="mt-3 space-y-2">
            {demoScenarios.map((scenario) => (
              <button key={scenario.item} onClick={() => chooseScenario(scenario)} className="flex w-full items-center gap-3 rounded-xl bg-surface p-3 text-left ring-1 ring-border hover:bg-surface-2 transition-colors">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-2 flex items-center justify-center text-base">
                  {scenario.category === "Food & Drinks" ? "🍽️" : scenario.category === "Shopping" ? "👟" : scenario.category === "Trip" ? "✈️" : "🎵"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-text">{scenario.item}</p>
                  <p className="text-xs text-muted">{scenario.merchant}</p>
                </div>
                <p className="text-[13px] font-bold text-text">{money(scenario.amount)}</p>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-brand/30 text-brand">
                  <Plus size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            setPurchase({ item, amount: Number(amount) || 0, category, merchant: "Manual check" });
            setScreen("result");
          }}
          className="h-12 w-full text-[15px]"
        >
          Ask Affordit
        </Button>
      </div>
    </PageScroll>
  );
}

function SectionRow({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[15px] font-bold text-text">{title}</h2>
      {action && <button className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">{action}</button>}
    </div>
  );
}

// ─── Verdict / Result ─────────────────────────────────────────────────────────

function getVerdict(purchase, budgetItems = budgetCategories) {
  const amount = Number(purchase.amount || 0);
  const selectedBudget = budgetItems.find((budget) => budget.name === purchase.category);
  const dailyRule = selectedBudget?.hasDailyLimit ? selectedBudget : null;
  const categoryRemaining = selectedBudget ? Number(selectedBudget.limit || 0) - Number(selectedBudget.spent || 0) : fakeBudget.safeAfterPlanned;
  const afterAskRemaining = categoryRemaining - amount;
  const isOverDailyLimit = dailyRule && amount > Number(dailyRule.dailyLimit || 0);
  const isOverCategoryBudget = selectedBudget && afterAskRemaining < 0;
  const isOverSafeSpend = amount > fakeBudget.safeAfterPlanned;
  const verdict = isOverSafeSpend ? "skip" : isOverCategoryBudget ? "hold" : isOverDailyLimit ? "dailyLimit" : amount <= Math.max(4800, categoryRemaining * 0.35) ? "go" : "cheaper";
  const budgetLine = selectedBudget
    ? `${selectedBudget.name} has ${money(categoryRemaining)} left before this ask and ${money(afterAskRemaining)} after it.`
    : "No matching budget category — falling back to safe-to-spend.";

  const map = {
    dailyLimit: {
      label: "Easy — slow down",
      headline: "Easy — slow down",
      score: 64,
      icon: Clock,
      tone: "caution",
      summary: `This one bites into tomorrow's budget. Your daily ${purchase.category || "category"} limit is already stretched.`,
      action: "Try cheaper",
      secondary: "See options",
      why: dailyRule
        ? `Tomorrow's safe number drops if you go ahead. You've already spent ${money(1250)} on ${dailyRule.name} today. Daily limit is ${money(dailyRule.dailyLimit)}. ${budgetLine}`
        : "This purchase is above today's category pace.",
    },
    go: {
      label: "You're good — enjoy it",
      headline: "You're good",
      score: 88,
      icon: CheckCircle2,
      tone: "safe",
      summary: "This fits your spend room and keeps your plans on track. Enjoy it.",
      action: "Mark bought",
      secondary: "Check another",
      why: `${budgetLine} Your safe-to-spend still has room after this.`,
    },
    hold: {
      label: "This pushes into payday",
      headline: "Hold up",
      score: 48,
      icon: Clock,
      tone: "caution",
      summary: "You can afford this technically, but it squeezes the category or money reserved for upcoming plans.",
      action: "Remind me",
      secondary: "Buy anyway",
      why: `${budgetLine} Waiting until payday keeps the Mombasa plan and emergency fund comfortable.`,
    },
    cheaper: {
      label: "Try a cheaper option",
      headline: "Try cheaper",
      score: 58,
      icon: ShoppingBag,
      tone: "brand",
      summary: "A cheaper option gets the same lifestyle win without stressing your budget.",
      action: "Try cheaper",
      secondary: "Buy anyway",
      why: `${budgetLine} Look for a lower-priced option and keep the rest for plans.`,
    },
    skip: {
      label: "This pushes you into the red",
      headline: "Skip it",
      score: 22,
      icon: XCircle,
      tone: "over",
      summary: "This clears too much discretionary cash and pushes important goals back.",
      action: "Cool off",
      secondary: "Buy anyway",
      why: "This purchase would exceed your current safe-to-spend amount before payday.",
    },
  };

  return map[verdict] || map.hold;
}

function Result({ setScreen, purchase, budgetItems }) {
  const verdict = getVerdict(purchase, budgetItems);
  const VerdictIcon = verdict.icon;
  const toneColor = { safe: "#2FD08A", caution: "#FFB23E", over: "#FF5C5C", brand: "#7C5CFC" }[verdict.tone] || "#7C5CFC";

  return (
    <PageScroll flush>
      {/* Header zone */}
      <div
        className="relative px-5 pb-8 pt-6"
        style={{ background: `linear-gradient(180deg, ${toneColor}14 0%, transparent 100%)` }}
      >
        <div className="flex justify-between mb-8">
          <IconButton icon={ChevronLeft} onClick={() => setScreen("ask")} label="Back" />
          <IconButton icon={Plus} label="Save" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Verdict</p>
        <h1 className="mt-2 font-display text-[40px] font-bold tracking-tight" style={{ color: toneColor }}>
          {verdict.headline}
        </h1>
        <p className="mt-3 max-w-xs text-[15px] leading-6 text-muted">{verdict.summary}</p>
      </div>

      <div className="space-y-5 px-5">
        {/* Purchase row */}
        <div className="flex items-center gap-3 rounded-card bg-surface p-4 ring-1 ring-border">
          <div className="h-14 w-14 shrink-0 rounded-xl bg-surface-2 flex items-center justify-center text-2xl">
            {purchase.category === "Food & Drinks" ? "🍽️" : purchase.category === "Shopping" ? "🛍️" : purchase.category === "Trip" ? "✈️" : "🎯"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-text">{purchase.item}</p>
            <p className="mt-1 text-xl font-bold" style={{ color: toneColor }}>{money(purchase.amount)}</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-2" style={{ color: toneColor }}>
            <VerdictIcon size={24} />
          </div>
        </div>

        {/* Big verdict chip */}
        <div className="flex justify-center">
          <VerdictPill tone={verdict.tone} label={verdict.label} />
        </div>

        {/* Why */}
        <div>
          <p className="mb-2 text-[15px] font-bold text-text">Why?</p>
          <p className="rounded-card bg-surface p-4 text-[14px] leading-6 text-muted ring-1 ring-border">{verdict.why}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Score" value={`${verdict.score}/100`} tone="purple" />
          <StatCard label="Category" value={purchase.category || "Spend"} />
          <StatCard label="Safe" value={money(fakeBudget.safeAfterPlanned)} tone="good" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => setScreen("ask")} variant="secondary" className="h-12">
            {verdict.action}
          </Button>
          <Button onClick={() => setScreen("history")} className="h-12">
            {verdict.secondary}
          </Button>
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Budget ───────────────────────────────────────────────────────────────────

function BudgetScreen({ budgetItems, setBudgetItems, incomeItems }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [group, setGroup] = useState("wants");
  const [dailyLimit, setDailyLimit] = useState("");
  const health = budgetHealth(budgetItems, incomeItems);
  const rows = budgetComparisonRows(budgetItems);
  const insights = generateBudgetInsights(budgetItems, incomeItems);

  function updateBudget(categoryName, field, value) {
    setBudgetItems(
      budgetItems.map((budget) =>
        budget.name === categoryName
          ? {
              ...budget,
              [field]: field === "limit" || field === "dailyLimit" ? Number(value || 0) : value,
              hasDailyLimit: field === "dailyLimit" ? Number(value || 0) > 0 : budget.hasDailyLimit,
            }
          : budget,
      ),
    );
  }

  function addBudget() {
    const cleanLimit = Number(limit);
    if (!name || !cleanLimit) return;
    setBudgetItems([
      {
        name,
        group,
        spent: 0,
        limit: cleanLimit,
        hasDailyLimit: Number(dailyLimit || 0) > 0,
        dailyLimit: Number(dailyLimit || 0),
        activeDays: Number(dailyLimit || 0) > 0 ? 30 : 0,
        color: group === "needs" ? "#2FD08A" : group === "savings" ? "#7C5CFC" : "#FFB23E",
      },
      ...budgetItems,
    ]);
    setName(""); setLimit(""); setDailyLimit(""); setGroup("wants"); setShowForm(false);
  }

  const inputCls = "h-11 w-full rounded-xl border border-border bg-surface-2 px-3 text-[14px] text-text outline-none focus:border-brand transition-colors placeholder:text-muted";

  return (
    <PageScroll>
      <ScreenHeader title="Budget" subtitle="Health, limits, and AI insights" rightIcon={Plus} onRight={() => setShowForm(!showForm)} />

      {/* Health card */}
      <div className="mx-5 mt-5 rounded-card bg-surface p-5 ring-1 ring-border">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label>50/20/30 health</Label>
            <p className="mt-2 font-display text-4xl font-bold text-text">{health.score}/100</p>
            <p className="mt-1 text-[14px] text-muted">{health.status} budget structure</p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/20">
            <BarChart3 size={28} />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {health.rules.map((rule) => (
            <BudgetRuleCard key={rule.key} rule={rule} />
          ))}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mx-5 mt-4 rounded-card bg-surface p-4 ring-1 ring-border">
          <p className="mb-3 text-[15px] font-bold text-text">Add budget category</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className={`${inputCls} mb-3`} />
          <div className="mb-3 grid grid-cols-2 gap-3">
            <input value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Monthly limit" className={inputCls} />
            <input value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} placeholder="Daily limit" className={inputCls} />
          </div>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${inputCls} mb-3`}>
            <option value="needs">Needs — 50%</option>
            <option value="savings">Savings/plans — 20%</option>
            <option value="wants">Wants — 30%</option>
          </select>
          <Button onClick={addBudget} className="h-11 w-full">Save budget</Button>
        </div>
      )}

      <SectionHeader title="Actual vs budget" />
      <div className="space-y-3 px-5">
        {rows.map((row) => (
          <BudgetComparisonCard key={row.name} row={row} updateBudget={updateBudget} />
        ))}
      </div>

      <SectionHeader title="Affordit AI insights" />
      <div className="space-y-3 px-5">
        {insights.map((insight) => (
          <InsightCard key={insight} text={insight} />
        ))}
      </div>
    </PageScroll>
  );
}

function BudgetRuleCard({ rule }) {
  const delta = rule.value - rule.target;
  const okay = Math.abs(delta) <= 5;
  return (
    <div className="rounded-xl bg-surface-2 p-4 ring-1 ring-border">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-bold text-text">{rule.label}</p>
          <p className="text-[12px] text-muted">Target {rule.target}% — {money(rule.amount)}</p>
        </div>
        <VerdictPill tone={okay ? "safe" : "caution"} label={`${rule.value}%`} />
      </div>
      <Progress value={Math.min(100, rule.value)} color={rule.color} />
      <p className="mt-2 text-[12px] text-muted">
        {delta === 0 ? "Exactly on target." : `${Math.abs(delta)}% ${delta > 0 ? "above" : "below"} target.`}
      </p>
    </div>
  );
}

function BudgetComparisonCard({ row, updateBudget }) {
  const statusTone = row.status === "Over" ? "over" : row.status === "Close" ? "caution" : "safe";
  return (
    <div className="rounded-card bg-surface p-4 ring-1 ring-border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-bold text-text">{row.name}</p>
          <p className="mt-1 text-[12px] text-muted">{row.group || "wants"} · {money(row.spent)} actual / {money(row.limit)} budget</p>
        </div>
        <VerdictPill tone={statusTone} label={row.status} />
      </div>
      <div className="mt-3">
        <Progress value={row.used} color={row.color} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <StatCard label="Actual" value={money(row.spent)} tone={row.remaining >= 0 ? "neutral" : "bad"} />
        <StatCard label="Budget" value={money(row.limit)} tone="purple" />
        <StatCard label={row.remaining >= 0 ? "Left" : "Over"} value={money(Math.abs(row.remaining))} tone={row.remaining >= 0 ? "good" : "bad"} />
      </div>
      <div className="mt-3 grid grid-cols-[1fr_110px] gap-2">
        <select value={row.group || "wants"} onChange={(e) => updateBudget(row.name, "group", e.target.value)} className="h-10 rounded-xl border border-border bg-surface-2 px-3 text-[13px] text-text outline-none focus:border-brand transition-colors">
          <option value="needs">Needs</option>
          <option value="savings">Savings</option>
          <option value="wants">Wants</option>
        </select>
        <input value={row.limit || ""} onChange={(e) => updateBudget(row.name, "limit", e.target.value)} className="h-10 rounded-xl border border-border bg-surface-2 px-3 text-[13px] text-text outline-none focus:border-brand transition-colors" />
      </div>
    </div>
  );
}

function InsightCard({ text, compact = false }) {
  return (
    <div className={`rounded-card bg-surface ring-1 ring-brand/15 ${compact ? "p-3" : "p-4"}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">Affordit AI</p>
      <p className={`${compact ? "mt-1 text-[13px] leading-5" : "mt-2 text-[14px] leading-6"} text-muted`}>{text}</p>
    </div>
  );
}

// ─── Expenses / Spend ─────────────────────────────────────────────────────────

function Expenses({ expenseItems, setExpenseItems, incomeItems, setIncomeItems, budgetItems, setBudgetItems }) {
  const [mode, setMode] = useState("expense");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food & Drinks");
  const [amount, setAmount] = useState("");
  const totalSpent = expenseItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + Number(item.limit || 0), 0);

  function addEntry() {
    const cleanAmount = Number(amount);
    if (!name || !cleanAmount) return;
    if (mode === "income") {
      setIncomeItems([{ source: name, category: "Income", amount: cleanAmount, date: "Today" }, ...incomeItems]);
    } else if (mode === "budget") {
      setBudgetItems([{ name, group: "wants", spent: 0, limit: cleanAmount, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#7C5CFC" }, ...budgetItems]);
    } else {
      setExpenseItems([{ merchant: name, category, amount: cleanAmount, date: "Today" }, ...expenseItems]);
      setBudgetItems(budgetItems.map((budget) => (budget.name === category ? { ...budget, spent: Number(budget.spent || 0) + cleanAmount } : budget)));
    }
    setName(""); setAmount(""); setShowForm(false);
  }

  const inputCls = "h-11 w-full rounded-xl border border-border bg-surface-2 px-3 text-[14px] text-text outline-none focus:border-brand transition-colors placeholder:text-muted";

  return (
    <PageScroll>
      <ScreenHeader title="Spend" subtitle="This month" rightIcon={Filter} />

      <div className="px-5">
        <Tabs items={["This month", "This week", "Today"]} active="This month" />

        <div className="mt-5 flex items-center gap-5">
          {/* Donut */}
          <div
            className="grid h-32 w-32 shrink-0 place-items-center rounded-full"
            style={{
              background: "conic-gradient(#FFB23E 0 42%, #2FD08A 42% 64%, #7C5CFC 64% 79%, #5BA7FF 79% 90%, #9AA3B2 90% 100%)",
            }}
          >
            <div className="grid h-20 w-20 place-items-center rounded-full bg-bg">
              <BarChart3 size={24} className="text-muted" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-bold text-text">{money(totalSpent)}</p>
            <p className="text-[12px] text-muted">Total spent</p>
            <div className="mt-3 space-y-1.5">
              {budgetItems.slice(0, 5).map((budget) => (
                <div key={budget.name} className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: budget.color }} />
                    {budget.name}
                  </span>
                  <span className="font-bold text-text">{money(budget.spent)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="mt-6 h-12 w-full">
          Add money movement
        </Button>
      </div>

      {showForm && (
        <div className="mx-5 mt-4 rounded-card bg-surface p-4 ring-1 ring-border">
          <div className="mb-3 grid grid-cols-3 gap-2 rounded-xl bg-surface-2 p-1">
            {["expense", "income", "budget"].map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`rounded-lg py-2 text-[13px] font-semibold transition-colors capitalize ${mode === item ? "bg-brand text-white" : "text-muted"}`}>
                {item}
              </button>
            ))}
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={mode === "income" ? "Income source" : mode === "budget" ? "Budget name" : "Expense name"} className={`${inputCls} mb-3`} />
          {mode === "expense" && (
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} mb-3`}>
              {budgetItems.map((budget) => (
                <option key={budget.name} value={budget.name}>{budget.name}</option>
              ))}
            </select>
          )}
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={mode === "budget" ? "Monthly limit" : "Amount"} className={`${inputCls} mb-3`} />
          <Button onClick={addEntry} className="h-11 w-full">Save</Button>
        </div>
      )}

      <SectionHeader title="Recent expenses" action="See all" />
      <div className="space-y-2 px-5">
        {expenseItems.map((expense) => (
          <ActivityRow key={`${expense.merchant}-${expense.date}`} item={expense.merchant} meta={expense.date} amount={expense.amount} tone="bad" />
        ))}
      </div>
      <SectionHeader title="Budgets" />
      <div className="space-y-3 px-5">
        {budgetItems.map((budget) => (
          <BudgetStrip key={budget.name} budget={budget} />
        ))}
      </div>
      <div className="px-5 pt-4">
        <StatCard label="Budgeted" value={money(totalBudgeted)} tone="purple" />
      </div>
    </PageScroll>
  );
}

function BudgetStrip({ budget }) {
  const used = budget.limit ? Math.round((Number(budget.spent || 0) / Number(budget.limit || 1)) * 100) : 0;
  return (
    <div className="rounded-card bg-surface p-3 ring-1 ring-border">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-2 flex items-center justify-center text-sm font-bold" style={{ color: budget.color }}>
            {budget.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-text">{budget.name}</p>
            <p className="text-[11px] text-muted">Daily limit: {money(budget.dailyLimit || Math.round(budget.limit / 30))}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-bold text-text">{money(budget.spent)}</p>
          <p className="text-[11px] text-muted">of {money(budget.limit)}</p>
        </div>
      </div>
      <Progress value={used} color={budget.color || "#7C5CFC"} />
    </div>
  );
}

function Tabs({ items, active }) {
  return (
    <div className="flex gap-7 border-b border-border">
      {items.map((item) => (
        <button key={item} className={`pb-3 text-[13px] font-semibold transition-colors ${item === active ? "border-b-2 border-brand text-text" : "text-muted"}`}>
          {item}
        </button>
      ))}
    </div>
  );
}

// ─── Planned Expenses ─────────────────────────────────────────────────────────

function PlannedExpenses() {
  return (
    <PageScroll>
      <ScreenHeader title="Plans" subtitle="Trips, goals, and events" rightIcon={Plus} />
      <div className="px-5">
        <Tabs items={["All", "Trips", "Goals", "Events"]} active="All" />
      </div>
      <div className="mt-4 space-y-3 px-5">
        {plannedExpenses.map((plan, index) => {
          const progress = plan.target ? Math.round((plan.amount / plan.target) * 100) : 0;
          return (
            <div key={plan.name} className="overflow-hidden rounded-card bg-surface ring-1 ring-border">
              {index === 0 && (
                <div className="h-32 bg-gradient-to-br from-brand-soft to-surface flex items-center justify-center text-5xl">
                  🏖️
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-text">{plan.name}</p>
                    <p className="mt-1 text-[12px] text-muted">{money(plan.amount)} / {money(plan.target)}</p>
                  </div>
                  <p className="font-display text-[15px] font-bold text-brand">{progress}%</p>
                </div>
                <div className="mt-3">
                  <Progress value={progress} color="#7C5CFC" />
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-muted">
                  <span>{plan.date}</span>
                  <span>{money(Math.ceil((plan.target - plan.amount) / 35))}/day</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageScroll>
  );
}

// ─── News ─────────────────────────────────────────────────────────────────────

function NewsScreen({ budgetItems, incomeItems }) {
  const health = budgetHealth(budgetItems, incomeItems);
  const insights = generateBudgetInsights(budgetItems, incomeItems);

  return (
    <PageScroll>
      <ScreenHeader title="Briefing" subtitle="Financial news and market context" rightIcon={Newspaper} />

      {/* AI Daily Briefing */}
      <div className="mx-5 mt-5 rounded-card bg-surface p-5 ring-1 ring-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Label>AI daily briefing</Label>
            <h2 className="mt-2 font-display text-[20px] font-bold leading-tight text-text">{marketBriefing.headline}</h2>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/20">
            <Newspaper size={22} />
          </div>
        </div>
        <p className="mt-3 text-[14px] leading-6 text-muted">{marketBriefing.summary}</p>
        <p className="mt-3 text-[11px] font-semibold text-muted/60">{marketBriefing.updatedAt} · demo market briefing</p>
      </div>

      <SectionHeader title="What matters today" />
      <div className="space-y-3 px-5">
        {marketBriefing.bullets.map((item) => (
          <InsightCard key={item} text={item} compact />
        ))}
      </div>

      <SectionHeader title="NSE movers watch" action="Demo data" />
      <div className="space-y-3 px-5">
        {marketBriefing.movers.map((mover) => (
          <MarketMoverCard key={mover.symbol} mover={mover} />
        ))}
      </div>

      <SectionHeader title="Mansa X & fund watch" />
      <div className="space-y-3 px-5">
        {marketBriefing.funds.map((fund) => (
          <FundWatchCard key={fund.name} fund={fund} />
        ))}
      </div>

      <SectionHeader title="Budget impact" />
      <div className="space-y-3 px-5">
        <div className="rounded-card bg-surface p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Budget health</p>
              <p className="mt-1 font-display text-2xl font-bold text-text">{health.score}/100</p>
            </div>
            <VerdictPill
              tone={health.status === "Healthy" ? "safe" : health.status === "Watch" ? "caution" : "over"}
              label={health.status}
            />
          </div>
          <p className="mt-3 text-[14px] leading-6 text-muted">{insights[0]}</p>
        </div>
        <InsightCard compact text="Production version: this section pulls live NSE data, fund factsheets, and financial headlines every morning, then generates a fresh AI brief from a backend." />
      </div>
    </PageScroll>
  );
}

function MarketMoverCard({ mover }) {
  const up = mover.tone === "up";
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="flex items-center gap-3 rounded-card bg-surface p-4 ring-1 ring-border">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${up ? "bg-safe/10 text-safe" : "bg-over/10 text-over"}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-text">{mover.symbol}</p>
        <p className="text-[12px] text-muted">{mover.name}</p>
      </div>
      <p className={`text-[14px] font-bold ${up ? "text-safe" : "text-over"}`}>{mover.change}</p>
    </div>
  );
}

function FundWatchCard({ fund }) {
  return (
    <div className="rounded-card bg-surface p-4 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <PiggyBank size={18} />
        </div>
        <div>
          <p className="text-[14px] font-bold text-text">{fund.name}</p>
          <p className="mt-1 text-[13px] leading-5 text-muted">{fund.note}</p>
        </div>
      </div>
    </div>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────

function HistoryScreen() {
  return (
    <PageScroll>
      <ScreenHeader title="History" subtitle="Past activity" rightIcon={Search} />
      <div className="px-5">
        <Tabs items={["All", "Verdicts", "Expenses", "Plans"]} active="All" />
      </div>
      <SectionHeader title="This week" />
      <div className="space-y-2 px-5">
        {history.slice(0, 4).map((item) => (
          <ActivityRow key={item.item} item={item.item} meta={item.date} amount={item.amount} label={item.decision} tone={item.decision === "Go for it" ? "good" : item.decision === "Try cheaper" ? "warning" : "bad"} />
        ))}
      </div>
      <SectionHeader title="This month" />
      <div className="space-y-2 px-5">
        {history.slice(4).map((item) => (
          <ActivityRow key={item.item} item={item.item} meta={item.date} amount={item.amount} label={item.decision} tone="purple" />
        ))}
      </div>
    </PageScroll>
  );
}

function ActivityRow({ item, meta, amount, label, tone = "neutral" }) {
  const toneMap = {
    good: "bg-safe/15 text-safe",
    bad: "bg-over/10 text-over",
    warning: "bg-caution/15 text-caution",
    purple: "bg-brand-soft text-brand",
    neutral: "bg-surface-2 text-muted",
  };
  const iconTone = {
    good: "bg-safe/15 text-safe",
    bad: "bg-surface-2 text-muted",
    warning: "bg-caution/10 text-caution",
    purple: "bg-brand-soft text-brand",
    neutral: "bg-surface-2 text-muted",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-border">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconTone[tone]}`}>
        <CreditCard size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-text">{item}</p>
        <p className="text-[12px] text-muted">{meta}</p>
      </div>
      {label && (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>{label}</span>
      )}
      <p className="text-[13px] font-bold text-text">{money(amount)}</p>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, action, onClick }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between px-5">
      <h2 className="text-[15px] font-bold text-text">{title}</h2>
      {action && (
        <button onClick={onClick} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">
          {action}
        </button>
      )}
    </div>
  );
}

// ─── PageScroll ───────────────────────────────────────────────────────────────

function PageScroll({ children, flush }) {
  return <main className={`min-h-0 flex-1 overflow-y-auto pb-6 scrollbar-none ${flush ? "" : "pt-0"}`}>{children}</main>;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AfforditPrototype() {
  const [screen, setScreen] = useState("landing");
  const [purchase, setPurchase] = useState({ item: "Friday dinner", amount: 2800, category: "Food & Drinks", verdict: "dailyLimit" });
  const [expenseItems, setExpenseItems] = useState(expenses);
  const [incomeItems, setIncomeItems] = useState(incomeSources);
  const [budgetItems, setBudgetItems] = useState(budgetCategories);

  if (screen === "landing") return <Landing setScreen={setScreen} />;
  if (screen === "login") return <Login setScreen={setScreen} />;

  const screens = {
    dashboard: <Dashboard setScreen={setScreen} incomeItems={incomeItems} expenseItems={expenseItems} budgetItems={budgetItems} />,
    ask: <Ask setScreen={setScreen} setPurchase={setPurchase} budgetItems={budgetItems} />,
    result: <Result setScreen={setScreen} purchase={purchase} budgetItems={budgetItems} />,
    budget: <BudgetScreen budgetItems={budgetItems} setBudgetItems={setBudgetItems} incomeItems={incomeItems} />,
    expenses: (
      <Expenses
        expenseItems={expenseItems}
        setExpenseItems={setExpenseItems}
        incomeItems={incomeItems}
        setIncomeItems={setIncomeItems}
        budgetItems={budgetItems}
        setBudgetItems={setBudgetItems}
      />
    ),
    planned: <PlannedExpenses />,
    news: <NewsScreen budgetItems={budgetItems} incomeItems={incomeItems} />,
    history: <HistoryScreen />,
  };

  return (
    <AppFrame nav screen={screen} setScreen={setScreen}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="flex min-h-0 flex-1 flex-col"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {screens[screen] || screens.dashboard}
        </motion.div>
      </AnimatePresence>
    </AppFrame>
  );
}
