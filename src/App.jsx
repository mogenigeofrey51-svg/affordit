import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Bell, CalendarDays, CheckCircle2,
  ChevronLeft, ChevronRight, Clock, CreditCard, Filter,
  Home, Info, Newspaper, PiggyBank, Plus, Search,
  ShoppingBag, Target, TrendingUp, TrendingDown, Wallet, XCircle, Pencil,
} from "lucide-react";

const currency = "KES";

const recurringExpenses = [
  { name: "Rent", category: "Housing", amount: 35000, frequency: "Monthly", nextDate: "June 1" },
  { name: "Netflix", category: "Recurring", amount: 1100, frequency: "Monthly", nextDate: "June 5" },
  { name: "Gym membership", category: "Health", amount: 3000, frequency: "Monthly", nextDate: "June 7" },
  { name: "Loan repayment", category: "Debt", amount: 8500, frequency: "Monthly", nextDate: "June 10" },
];

const plannedExpenses = [
  { name: "Mombasa trip", category: "Trip", amount: 11500, target: 25000, date: "In 35 days" },
  { name: "New iPhone", category: "Goal", amount: 8300, target: 15000, date: "In 60 days" },
  { name: "Birthday plan", category: "Event", amount: 2200, target: 5000, date: "In 20 days" },
];

const fakeBudget = {
  plannedUpcoming: 12500,
  safeAfterPlanned: 14250,
  emergencyFund: 42000,
  emergencyTarget: 100000,
};

const budgetCategories = [
  { name: "Food & Drinks", group: "needs",   spent: 6250, limit: 15000, hasDailyLimit: true,  dailyLimit: 2000, color: "#F59E0B" },
  { name: "Transport",     group: "needs",   spent: 2400, limit: 8000,  hasDailyLimit: true,  dailyLimit: 1200, color: "#22C55E" },
  { name: "Shopping",      group: "wants",   spent: 2812, limit: 10000, hasDailyLimit: false, dailyLimit: 0,    color: "#6C47FF" },
  { name: "Entertainment", group: "wants",   spent: 2062, limit: 7000,  hasDailyLimit: false, dailyLimit: 0,    color: "#06B6D4" },
  { name: "Others",        group: "wants",   spent: 1876, limit: 6000,  hasDailyLimit: false, dailyLimit: 0,    color: "#9CA3AF" },
];

const historyItems = [
  { item: "Friday dinner",     amount: 2800,  decision: "Hold up",     score: 48, date: "Today, 7:30 PM",      category: "Food & Drinks" },
  { item: "New sneakers",      amount: 8500,  decision: "Go for it",   score: 84, date: "Yesterday, 4:10 PM",  category: "Shopping" },
  { item: "Bolt to Westlands", amount: 350,   decision: "Go for it",   score: 90, date: "Yesterday, 9:15 AM",  category: "Transport" },
  { item: "Concert ticket",    amount: 3000,  decision: "Try cheaper", score: 58, date: "Sat, 8:45 PM",        category: "Entertainment" },
  { item: "Mombasa trip",      amount: 11500, decision: "Plan",        score: 72, date: "May 3, 2024",         category: "Trip" },
  { item: "Netflix",           amount: 1100,  decision: "Recurring",   score: 70, date: "May 1, 2024",         category: "Recurring" },
];

const demoScenarios = [
  { item: "Friday dinner",   merchant: "Kilimani rooftop", amount: 2800,  verdict: "dailyLimit", category: "Food & Drinks" },
  { item: "New sneakers",    merchant: "Online store",     amount: 8500,  verdict: "go",         category: "Shopping" },
  { item: "Weekend getaway", merchant: "Booking",          amount: 15000, verdict: "hold",       category: "Trip" },
  { item: "Concert ticket",  merchant: "Live event",       amount: 3000,  verdict: "cheaper",    category: "Entertainment" },
];

const expenseItems0 = [
  { merchant: "Burger King", category: "Food & Drinks", amount: 850,  date: "Today, 1:34 PM" },
  { merchant: "Bolt Ride",   category: "Transport",     amount: 320,  date: "Today, 10:12 AM" },
  { merchant: "Java House",  category: "Food & Drinks", amount: 580,  date: "Yesterday, 6:45 PM" },
  { merchant: "Naivas",      category: "Food & Drinks", amount: 3200, date: "May 20" },
];

const incomeSources0 = [
  { source: "Salary",           category: "Main income", amount: 45000, date: "May 25" },
  { source: "Freelance design", category: "Side income", amount: 15000, date: "May 18" },
];

const categoryOptions = [
  { name: "Food & Drinks", label: "Food",       icon: "🍽️" },
  { name: "Transport",     label: "Rides",      icon: "🚗" },
  { name: "Shopping",      label: "Shopping",   icon: "🛍️" },
  { name: "Entertainment", label: "Events",     icon: "🎵" },
  { name: "Trip",          label: "Trips",      icon: "✈️" },
  { name: "Others",        label: "More",       icon: "•••" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function money(v) { return `KSh ${Number(v || 0).toLocaleString()}`; }
function pct(v, t) { return t ? Math.round((Number(v || 0) / Number(t || 1)) * 100) : 0; }

function budgetTotals(budgetItems, incomeItems = incomeSources0) {
  const income   = incomeItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const needs    = budgetItems.filter(i => i.group === "needs").reduce((s, i) => s + Number(i.limit || 0), 0)
                 + recurringExpenses.filter(i => ["Housing","Debt"].includes(i.category)).reduce((s, i) => s + Number(i.amount || 0), 0);
  const wants    = budgetItems.filter(i => i.group === "wants").reduce((s, i) => s + Number(i.limit || 0), 0);
  const savings  = Math.max(fakeBudget.plannedUpcoming, income - needs - wants);
  const actual   = budgetItems.reduce((s, i) => s + Number(i.spent || 0), 0);
  return { income, needs, wants, savings, actual };
}

function budgetHealth(budgetItems, incomeItems = incomeSources0) {
  const t = budgetTotals(budgetItems, incomeItems);
  const rules = [
    { key: "needs",   label: "Needs",   target: 50, value: pct(t.needs,   t.income), color: "#22C55E" },
    { key: "savings", label: "Savings", target: 20, value: pct(t.savings, t.income), color: "#6C47FF" },
    { key: "wants",   label: "Wants",   target: 30, value: pct(t.wants,   t.income), color: "#06B6D4" },
  ];
  const score  = Math.max(0, Math.round(100 - rules.reduce((s, r) => s + Math.abs(r.value - r.target), 0)));
  const status = score >= 85 ? "Healthy" : score >= 70 ? "Watch" : "Needs work";
  return { ...t, rules, score, status };
}

function budgetRows(budgetItems) {
  return budgetItems.map(item => {
    const spent = Number(item.spent || 0), limit = Number(item.limit || 0);
    const remaining = limit - spent, used = pct(spent, limit);
    const status = remaining < 0 ? "Over" : used >= 85 ? "Close" : "On track";
    return { ...item, spent, limit, remaining, used, status };
  });
}

function aiInsights(budgetItems, incomeItems = incomeSources0) {
  const h = budgetHealth(budgetItems, incomeItems);
  const rows = budgetRows(budgetItems);
  const over  = rows.find(r => r.remaining < 0);
  const close = rows.find(r => r.remaining >= 0 && r.used >= 85);
  const top   = [...rows].sort((a, b) => b.used - a.used)[0];
  const ins   = [];
  if (h.rules.find(r => r.key === "needs").value > 50)    ins.push("Needs are above 50%. Keep essentials tight before approving lifestyle spends.");
  if (h.rules.find(r => r.key === "wants").value > 30)    ins.push("Wants are running hot. Be stricter on outfits, events, and entertainment until payday.");
  if (h.rules.find(r => r.key === "savings").value < 20)  ins.push("Savings are below 20%. Push extra money toward plans before increasing flexible categories.");
  if (over)       ins.push(`${over.name} is over budget by ${money(Math.abs(over.remaining))}. Hold new asks here.`);
  else if (close) ins.push(`${close.name} is close to its limit at ${close.used}%. Smaller choices here protect the month.`);
  else if (top)   ins.push(`${top.name} has the highest usage at ${top.used}%. Watch it before weekend spending starts.`);
  ins.push(`Budget health is ${h.status.toLowerCase()} at ${h.score}/100 based on the 50/20/30 rule.`);
  return ins.slice(0, 4);
}

function getVerdict(purchase, budgetItems = budgetCategories) {
  const amount = Number(purchase.amount || 0);
  const cat = budgetItems.find(b => b.name === purchase.category);
  const catRemaining = cat ? Number(cat.limit || 0) - Number(cat.spent || 0) : fakeBudget.safeAfterPlanned;
  const afterAsk = catRemaining - amount;
  const isOverDaily = cat?.hasDailyLimit && amount > Number(cat.dailyLimit || 0);
  const isOverCat   = cat && afterAsk < 0;
  const isOverSafe  = amount > fakeBudget.safeAfterPlanned;
  const key = isOverSafe ? "skip" : isOverCat ? "hold" : isOverDaily ? "dailyLimit" : amount <= Math.max(4800, catRemaining * 0.35) ? "go" : "cheaper";
  const budgetLine = cat
    ? `${cat.name} has ${money(catRemaining)} left before this ask and ${money(afterAsk)} after it.`
    : "No matching category — using safe-to-spend as fallback.";
  const map = {
    go:         { label: "You're good — enjoy it",       headline: "You're good",   score: 88, icon: CheckCircle2, tone: "safe",    summary: "This fits your spend room and keeps your plans on track.", why: `${budgetLine} Your safe-to-spend still has room.`, action: "Mark bought",  alt: "Check another" },
    dailyLimit: { label: "Easy — this bites into payday",headline: "Slow down",     score: 62, icon: Clock,        tone: "caution", summary: `This pushes past your daily ${purchase.category || "category"} limit.`, why: `Tomorrow's safe number drops if you go ahead. Daily limit is ${money(cat?.dailyLimit)}. ${budgetLine}`, action: "Try cheaper", alt: "Buy anyway" },
    hold:       { label: "This squeezes payday",          headline: "Hold up",       score: 48, icon: Clock,        tone: "caution", summary: "You can afford it technically, but it squeezes money reserved for plans.", why: `${budgetLine} Waiting until payday keeps goals comfortable.`, action: "Remind me",   alt: "Buy anyway" },
    cheaper:    { label: "Try a cheaper option",          headline: "Try cheaper",   score: 58, icon: ShoppingBag,  tone: "brand",   summary: "A cheaper option gets the same win without stressing your budget.", why: `${budgetLine} Look for a lower-priced option and keep the rest for plans.`, action: "Try cheaper", alt: "Buy anyway" },
    skip:       { label: "This pushes you into the red",  headline: "Skip it",       score: 20, icon: XCircle,      tone: "over",    summary: "This clears too much cash and pushes important goals back.", why: "This would exceed your safe-to-spend amount before payday.", action: "Cool off",    alt: "Buy anyway" },
  };
  return { ...map[key], catRemaining, afterAsk };
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function money2(v) { return Number(v || 0).toLocaleString(); }

// Count-up hook
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    let raf;
    function tick() {
      const p = Math.min((Date.now() - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

function AnimRing({ value, size = 52, sw = 4, color = "#6C47FF" }) {
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth={sw} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={sw} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }} />
    </svg>
  );
}

function ProgressBar({ value, color = "#6C47FF" }) {
  const safe = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${safe}%`, background: color }} />
    </div>
  );
}

function Chip({ label, tone = "safe", className = "" }) {
  const styles = {
    safe:    "bg-safe-bg text-safe",
    caution: "bg-caution-bg text-caution",
    over:    "bg-red-100 text-over",
    brand:   "bg-brand-soft text-brand",
    neutral: "bg-gray-100 text-ink-2",
  };
  return (
    <span className={`chip-pop rounded-full px-3 py-1 text-[11px] font-bold ${styles[tone] || styles.neutral} ${className}`}>
      {label}
    </span>
  );
}

function Label({ children, dark = false }) {
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${dark ? "text-white/50" : "text-ink-3"}`}>
      {children}
    </p>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ children, dark = false }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: dark ? "#0D0926" : "#EAE4D8" }}
    >
      <div
        className="relative w-full max-w-[440px] mx-auto flex flex-col overflow-hidden"
        style={{
          minHeight: "100svh",
          background: dark ? "#130D30" : "#F5F0E8",
        }}
      >
        <style>{`
          @media (min-width: 480px) {
            .app-inner {
              min-height: 860px !important;
              max-height: 920px !important;
              border-radius: 28px !important;
              overflow: hidden !important;
              box-shadow: 0 32px 80px rgba(0,0,0,0.25) !important;
            }
          }
        `}</style>
        <div className="app-inner relative flex flex-col flex-1" style={{ minHeight: "100svh" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function AppFrame({ children, nav, screen, setScreen }) {
  const darkScreens = ["ask", "result"];
  const dark = darkScreens.includes(screen);
  return (
    <AppShell dark={dark}>
      <div className="flex flex-col flex-1 min-h-0">
        {children}
        {nav && <BottomNav screen={screen} setScreen={setScreen} dark={dark} />}
      </div>
    </AppShell>
  );
}

function BottomNav({ screen, setScreen, dark = false }) {
  const tabs = [
    { id: "dashboard", label: "Home",     icon: Home },
    { id: "ask",       label: "Ask",      icon: ShoppingBag },
    { id: "budget",    label: "Budget",   icon: PiggyBank },
    { id: "expenses",  label: "Spend",    icon: CreditCard },
    { id: "news",      label: "Briefing", icon: Newspaper },
  ];
  return (
    <nav className={`border-t px-3 pb-5 pt-2 ${dark ? "bg-navy border-white/10" : "bg-white border-gray-100"}`}>
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = screen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold transition-all ${
                active
                  ? dark ? "text-brand bg-white/10" : "text-brand bg-brand-soft"
                  : dark ? "text-white/40 hover:text-white/70" : "text-ink-3 hover:text-ink-2"
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

function PageScroll({ children }) {
  return <main className="flex-1 min-h-0 overflow-y-auto pb-6 scrollbar-none">{children}</main>;
}

function IconBtn({ icon: Icon, onClick, label, dark = false }) {
  return (
    <button onClick={onClick} aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${dark ? "bg-white/10 text-white/70 hover:bg-white/15" : "bg-white text-ink-2 hover:text-ink shadow-sm"}`}>
      <Icon size={18} />
    </button>
  );
}

function Btn({ children, className = "", variant = "primary", dark = false, ...props }) {
  const base = "inline-flex items-center justify-center rounded-btn px-5 font-bold transition-all duration-150 active:scale-95";
  const styles = {
    primary:   "bg-brand text-white shadow-lg shadow-brand/20 hover:brightness-110",
    secondary: dark ? "bg-white/10 text-white hover:bg-white/15" : "bg-white text-ink shadow-sm hover:shadow-md",
    green:     "bg-safe text-white shadow-lg shadow-safe/20 hover:brightness-110",
    outline:   dark ? "border border-white/20 text-white hover:bg-white/10" : "border border-gray-200 text-ink-2 hover:bg-gray-50",
  };
  return (
    <button className={`${base} ${styles[variant] || styles.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing({ setScreen }) {
  return (
    <AppShell dark={false}>
      <div className="flex flex-col flex-1" style={{ minHeight: "100svh" }}>
        {/* Photo hero */}
        <div className="relative h-[52%]" style={{ minHeight: 300 }}>
          <img src="/affordit-theme.png" alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(245,240,232,0.6) 85%, #F5F0E8 100%)" }} />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-4">
            <h1 className="font-display text-[38px] font-bold leading-tight text-white drop-shadow-lg">
              Live better.<br />
              <span style={{ color: "#22C55E" }}>Spend smarter.</span>
            </h1>
            <p className="mt-2 text-[14px] text-white/90 drop-shadow">The lifestyle money check for a life you love.</p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 px-6 pt-4 pb-8 flex flex-col justify-center" style={{ background: "#F5F0E8" }}>
          <label className="block mb-3">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">Phone number</span>
            <input
              defaultValue="+254 712 345 678"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-ink outline-none focus:border-brand shadow-sm transition-colors placeholder:text-ink-3"
            />
          </label>
          <Btn onClick={() => setScreen("login")} className="h-12 w-full text-[15px]">
            Continue
          </Btn>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-3">
            <div className="h-px flex-1 bg-gray-200" />
            or continue with
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Btn variant="secondary" className="h-11">
              <span className="mr-2">🌐</span> Google
            </Btn>
            <Btn variant="secondary" className="h-11">
              <span className="mr-2">🍎</span> Apple
            </Btn>
          </div>

          <p className="mt-5 text-center text-[14px] text-ink-2">
            Already have an account?{" "}
            <button onClick={() => setScreen("dashboard")} className="font-bold text-brand">Log in</button>
          </p>
        </div>
      </div>
    </AppShell>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function Login({ setScreen }) {
  return (
    <AppShell dark={false}>
      <div className="flex flex-col flex-1 px-6 pt-14 pb-8" style={{ minHeight: "100svh" }}>
        <div className="mb-8">
          <p className="font-display text-2xl font-bold text-ink">Affordit</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">Karibu tena 👋</h1>
        <p className="mt-2 text-[15px] text-ink-2">Spend smarter. Live better.</p>

        <div className="mt-8 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">Phone number</span>
            <input
              defaultValue="+254 712 345 678"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-ink outline-none focus:border-brand shadow-sm transition-colors"
            />
          </label>
          <Btn onClick={() => setScreen("dashboard")} className="h-12 w-full text-[15px]">Continue</Btn>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-ink-3">
          <div className="h-px flex-1 bg-gray-200" />or continue with<div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Btn variant="secondary" className="h-11">🌐 Google</Btn>
          <Btn variant="secondary" className="h-11">🍎 Apple</Btn>
        </div>
        <p className="mt-5 text-center text-[14px] text-ink-2">
          Don't have an account? <span className="font-bold text-brand">Sign up</span>
        </p>
      </div>
    </AppShell>
  );
}

// ─── Dashboard / Home ─────────────────────────────────────────────────────────

function Dashboard({ setScreen, budgetItems }) {
  const now = new Date();
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
  const totalBills = recurringExpenses.reduce((s, i) => s + i.amount, 0);
  const billsK = Math.round(totalBills / 1000);
  const goalsK = Math.round(fakeBudget.plannedUpcoming / 1000);
  const safe = fakeBudget.safeAfterPlanned;
  const displaySafe = useCountUp(safe);

  return (
    <PageScroll>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-7 pb-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">Hujambo</p>
          <h1 className="mt-0.5 font-display text-[22px] font-bold text-ink">Hey Wanjiku 👋</h1>
          <p className="text-[13px] text-ink-2">Good morning</p>
        </div>
        <div className="h-11 w-11 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md"
          style={{ background: "linear-gradient(135deg, #6C47FF, #22C55E)" }}>
          W
        </div>
      </div>

      {/* Safe to spend hero */}
      <div className="px-5 pt-6 pb-4">
        <Label>Safe to spend today</Label>
        <div className="mt-3 count-up flex items-baseline gap-1.5">
          <span className="text-[20px] font-semibold text-ink-2">KSh</span>
          <span className="font-display font-bold text-safe" style={{ fontSize: 56, lineHeight: 1 }}>
            {displaySafe.toLocaleString()}
          </span>
          <button className="mb-1 ml-1 text-ink-3 hover:text-ink-2"><Info size={16} /></button>
        </div>
        <p className="mt-1.5 text-[13px] text-ink-2">
          After KSh {billsK}K in bills and KSh {goalsK}K to goals · {daysLeft} days left
        </p>
        <button onClick={() => setScreen("budget")} className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-brand">
          See breakdown <ChevronRight size={14} />
        </button>
      </div>

      {/* Can I afford this CTA */}
      <div className="px-5 pb-5">
        <Btn onClick={() => setScreen("ask")} className="h-14 w-full text-[15px] gap-3">
          <span className="text-xl">✦</span>
          Can I afford this?
          <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <ArrowRight size={15} />
          </div>
        </Btn>
      </div>

      {/* Goals */}
      <div>
        <div className="flex items-center justify-between px-5 mb-3">
          <Label>My goals</Label>
          <button onClick={() => setScreen("planned")} className="text-[11px] font-bold text-brand">See all</button>
        </div>
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-5 pb-3">
            {plannedExpenses.map(plan => <GoalCard key={plan.name} plan={plan} />)}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-cream to-transparent" />
        </div>
      </div>

      {/* Pattern insight */}
      <div className="px-5 mt-3 pb-8">
        <Label>Pattern insight</Label>
        <div className="mt-3 flex gap-3 rounded-2xl p-4" style={{ background: "#FDE8E4" }}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
            <TrendingUp size={20} style={{ color: "#E05A40" }} />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: "#C0432B" }}>Pattern noticed</p>
            <p className="text-[13px] leading-5 text-ink">
              You eat out 38% more on Fridays. Skip one this month and your Mombasa trip lands a week earlier.
            </p>
          </div>
        </div>
      </div>
    </PageScroll>
  );
}

function GoalCard({ plan }) {
  const p = plan.target ? Math.round((plan.amount / plan.target) * 100) : 0;
  const cfg = {
    Trip:  { emoji: "🏖️", color: "#22C55E" },
    Goal:  { emoji: "📱", color: "#6C47FF" },
    Event: { emoji: "🎂", color: "#F59E0B" },
  }[plan.category] || { emoji: "🎯", color: "#6C47FF" };

  return (
    <div className="w-36 flex-shrink-0 rounded-2xl bg-white p-4 shadow-sm" style={{ minHeight: 156 }}>
      <p className="text-[11px] font-bold text-ink leading-4">{plan.name}</p>
      <p className="mt-1 text-[11px] text-ink-2">{money(plan.amount)}</p>
      <div className="mt-2 text-2xl">{cfg.emoji}</div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10px] text-ink-3">{plan.date}</p>
        <div className="relative" style={{ width: 40, height: 40 }}>
          <AnimRing value={p} size={40} sw={3} color={cfg.color} />
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-ink">{p}%</div>
        </div>
      </div>
    </div>
  );
}

// ─── Ask ──────────────────────────────────────────────────────────────────────

function Ask({ setScreen, setPurchase, budgetItems }) {
  const [amount, setAmount]   = useState("2800");
  const [item, setItem]       = useState("Friday dinner");
  const [category, setCategory] = useState("Food & Drinks");
  const cat = budgetItems.find(b => b.name === category);
  const askAmt = Number(amount || 0);
  const catLeft = cat ? Number(cat.limit) - Number(cat.spent) : 0;
  const afterAsk = catLeft - askAmt;
  const verdictOk = afterAsk >= 0 && askAmt <= fakeBudget.safeAfterPlanned;

  function pickScenario(s) {
    setItem(s.item); setAmount(String(s.amount)); setCategory(s.category);
    setPurchase(s); setScreen("result");
  }

  return (
    <PageScroll>
      {/* Header */}
      <div className="px-5 pt-6 pb-5" style={{ background: "linear-gradient(180deg, rgba(108,71,255,0.12) 0%, transparent 100%)" }}>
        <div className="flex justify-between mb-6">
          <IconBtn icon={ChevronLeft} onClick={() => setScreen("dashboard")} dark label="Back" />
          <IconBtn icon={Info} dark label="Info" />
        </div>
        <h1 className="font-display text-[28px] font-bold text-white">Can I afford this?</h1>
        <p className="mt-1 text-[14px] text-white/60">Let's check your plan</p>
      </div>

      <div className="space-y-4 px-5">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {categoryOptions.map(opt => {
            const active = category === opt.name;
            return (
              <button key={opt.name} onClick={() => setCategory(opt.name)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all ${
                  active ? "bg-brand text-white" : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}>
                <span className="text-base">{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Amount display */}
        <div className="rounded-2xl bg-white/8 p-4" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Label dark>Amount</Label>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-display text-4xl font-bold text-white">{money(askAmt)}</span>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70">
              <Pencil size={16} />
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mt-2 h-0 w-0 opacity-0 absolute"
          />
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-2 h-10 w-full rounded-xl bg-white/10 px-3 text-[14px] text-white outline-none focus:bg-white/15 placeholder:text-white/30 transition-colors"
          />
        </div>

        {/* Verdict card */}
        {cat && (
          <div className={`rounded-2xl p-4 ${verdictOk ? "bg-safe-bg" : "bg-caution-bg"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${verdictOk ? "bg-safe" : "bg-caution"}`}>
                {verdictOk ? <CheckCircle2 size={20} className="text-white" /> : <Clock size={20} className="text-white" />}
              </div>
              <div>
                <p className={`text-[15px] font-bold ${verdictOk ? "text-safe" : "text-caution"}`}>
                  {verdictOk ? "Yes, you can afford this" : "Easy — slow down"}
                </p>
                <p className="text-[12px] text-ink-2">{verdictOk ? "It's in your budget" : "Watch your daily pace"}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">Before</p>
                <p className="mt-1 text-[13px] font-bold text-ink">{money(catLeft)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">This spend</p>
                <p className="mt-1 text-[13px] font-bold text-ink">{money(askAmt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">After</p>
                <p className={`mt-1 text-[13px] font-bold ${afterAsk >= 0 ? "text-safe" : "text-over"}`}>{money(afterAsk)}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI insight */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(108,71,255,0.15)", border: "1px solid rgba(108,71,255,0.25)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand">Affordit AI says</p>
          <p className="mt-2 text-[13px] leading-5 text-white/80">
            {verdictOk
              ? "Looks good! You'll still be on-track with your goals and have buffer for the week."
              : `Tomorrow's safe number drops to KES ${Math.max(0, fakeBudget.safeAfterPlanned - askAmt).toLocaleString()} if you go ahead — above your daily ${category} limit.`}
          </p>
          <button className="mt-2 text-[12px] font-semibold text-brand flex items-center gap-1">
            View details <ChevronRight size={13} />
          </button>
        </div>

        {/* Popular ideas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-white">Popular ideas</p>
            <button className="text-[11px] font-semibold text-brand">See all</button>
          </div>
          <div className="space-y-2">
            {demoScenarios.map(s => (
              <button key={s.item} onClick={() => pickScenario(s)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xl">
                  {s.category === "Food & Drinks" ? "🍽️" : s.category === "Shopping" ? "👟" : s.category === "Trip" ? "✈️" : "🎵"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">{s.item}</p>
                  <p className="text-[11px] text-white/45">{s.merchant}</p>
                </div>
                <p className="text-[12px] font-bold text-white/70">{money(s.amount)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <Btn variant="outline" dark className="h-12">View details</Btn>
          <Btn variant="green" className="h-12"
            onClick={() => { setPurchase({ item, amount: askAmt, category, merchant: "Manual check" }); setScreen("result"); }}>
            Add to plan
          </Btn>
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────────

function Result({ setScreen, purchase, budgetItems }) {
  const v = getVerdict(purchase, budgetItems);
  const VIcon = v.icon;
  const toneColor = { safe: "#22C55E", caution: "#F59E0B", over: "#EF4444", brand: "#6C47FF" }[v.tone] || "#6C47FF";

  return (
    <PageScroll>
      <div className="px-5 pt-6 pb-6" style={{ background: `linear-gradient(180deg, ${toneColor}18 0%, transparent 100%)` }}>
        <div className="flex justify-between mb-8">
          <IconBtn icon={ChevronLeft} onClick={() => setScreen("ask")} dark label="Back" />
          <IconBtn icon={Plus} dark label="Save" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">Verdict</p>
        <h1 className="mt-2 font-display text-[40px] font-bold" style={{ color: toneColor }}>{v.headline}</h1>
        <p className="mt-3 text-[14px] leading-6 text-white/70 max-w-xs">{v.summary}</p>
      </div>

      <div className="space-y-4 px-5">
        {/* Purchase row */}
        <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-3xl">
            {purchase.category === "Food & Drinks" ? "🍽️" : purchase.category === "Shopping" ? "🛍️" : purchase.category === "Trip" ? "✈️" : "🎯"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-white">{purchase.item}</p>
            <p className="mt-0.5 text-xl font-bold" style={{ color: toneColor }}>{money(purchase.amount)}</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${toneColor}20`, color: toneColor }}>
            <VIcon size={22} />
          </div>
        </div>

        {/* Verdict chip */}
        <div className="flex justify-center py-1">
          <Chip label={v.label} tone={v.tone} className="text-[13px] px-4 py-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Score",    value: `${v.score}/100`, color: "#6C47FF" },
            { label: "Left",     value: money(v.catRemaining), color: v.catRemaining >= 0 ? "#22C55E" : "#EF4444" },
            { label: "After",    value: money(v.afterAsk),    color: v.afterAsk >= 0 ? "#22C55E" : "#EF4444" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{s.label}</p>
              <p className="mt-1 text-[13px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Why */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40 mb-2">Why?</p>
          <p className="text-[13px] leading-5 text-white/70">{v.why}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-2">
          <Btn variant="outline" dark className="h-12" onClick={() => setScreen("ask")}>{v.action}</Btn>
          <Btn variant="green" className="h-12" onClick={() => setScreen("history")}>{v.alt}</Btn>
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Budget ───────────────────────────────────────────────────────────────────

function BudgetScreen({ budgetItems, setBudgetItems, incomeItems }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName]     = useState("");
  const [limit, setLimit]   = useState("");
  const [group, setGroup]   = useState("wants");
  const [daily, setDaily]   = useState("");
  const health   = budgetHealth(budgetItems, incomeItems);
  const rows     = budgetRows(budgetItems);
  const insights = aiInsights(budgetItems, incomeItems);

  function addBudget() {
    const l = Number(limit);
    if (!name || !l) return;
    setBudgetItems([{ name, group, spent: 0, limit: l, hasDailyLimit: Number(daily) > 0, dailyLimit: Number(daily), activeDays: 0, color: group === "needs" ? "#22C55E" : group === "savings" ? "#6C47FF" : "#F59E0B" }, ...budgetItems]);
    setName(""); setLimit(""); setDaily(""); setGroup("wants"); setShowForm(false);
  }

  function updateBudget(n, f, v) {
    setBudgetItems(budgetItems.map(b => b.name === n ? { ...b, [f]: ["limit","dailyLimit"].includes(f) ? Number(v) : v, hasDailyLimit: f === "dailyLimit" ? Number(v) > 0 : b.hasDailyLimit } : b));
  }

  const inputCls = "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-ink outline-none focus:border-brand shadow-sm transition-colors placeholder:text-ink-3";

  return (
    <PageScroll>
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-6 pb-4">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ink">Budget</h1>
          <p className="mt-0.5 text-[13px] text-ink-2">Health, limits & insights</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/20">
          <Plus size={18} />
        </button>
      </div>

      {/* Budget health card */}
      <div className="mx-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label>Budget health</Label>
            <p className="mt-2 font-display text-4xl font-bold text-ink">{health.score}/100</p>
            <p className="mt-1 text-[13px] text-ink-2">
              {health.score < 100
                ? `You're ${100 - health.score} pts away from a healthy budget`
                : "Perfect balance!"}
            </p>
          </div>
          <div className="relative" style={{ width: 64, height: 64 }}>
            <AnimRing value={health.score} size={64} sw={5} color="#6C47FF" />
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-ink">
              {health.score}
            </div>
          </div>
        </div>
      </div>

      {/* Category health */}
      <div className="px-5 mt-5">
        <Label>Category health</Label>
        <div className="mt-3 rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-50">
          {health.rules.map(rule => (
            <div key={rule.key} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: rule.color }} />
                  <p className="text-[14px] font-semibold text-ink">{rule.label}</p>
                  <p className="text-[12px] text-ink-3">Target {rule.target}%</p>
                </div>
                <Chip
                  label={`${rule.value}%`}
                  tone={Math.abs(rule.value - rule.target) <= 5 ? "safe" : "caution"}
                />
              </div>
              <ProgressBar value={rule.value} color={rule.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mx-5 mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-[15px] font-bold text-ink">Add budget category</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" className={`${inputCls} mb-3`} />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <input value={limit} onChange={e => setLimit(e.target.value)} placeholder="Monthly limit" className={inputCls} />
            <input value={daily} onChange={e => setDaily(e.target.value)} placeholder="Daily limit" className={inputCls} />
          </div>
          <select value={group} onChange={e => setGroup(e.target.value)} className={`${inputCls} mb-3`}>
            <option value="needs">Needs — 50%</option>
            <option value="savings">Savings — 20%</option>
            <option value="wants">Wants — 30%</option>
          </select>
          <Btn onClick={addBudget} className="h-11 w-full">Save budget</Btn>
        </div>
      )}

      {/* Actual vs budget */}
      <div className="px-5 mt-5">
        <Label>Actual vs budget</Label>
        <div className="mt-3 space-y-3">
          {rows.map(row => (
            <div key={row.name} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-[15px] font-bold text-ink">{row.name}</p>
                  <p className="text-[12px] text-ink-3">{row.group} · {money(row.spent)} of {money(row.limit)}</p>
                </div>
                <Chip label={row.status} tone={row.status === "Over" ? "over" : row.status === "Close" ? "caution" : "safe"} />
              </div>
              <ProgressBar value={row.used} color={row.color} />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[{ l: "Spent", v: money(row.spent) }, { l: "Budget", v: money(row.limit) }, { l: row.remaining >= 0 ? "Left" : "Over", v: money(Math.abs(row.remaining)) }].map(s => (
                  <div key={s.l} className="rounded-xl bg-gray-50 p-2.5">
                    <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-wide">{s.l}</p>
                    <p className="mt-0.5 text-[12px] font-bold text-ink">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI insights */}
      <div className="px-5 mt-5 pb-2">
        <Label>Affordit AI insights</Label>
        <div className="mt-3 space-y-3">
          {insights.map(i => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm" style={{ borderLeft: "3px solid #6C47FF" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand mb-1">Affordit AI</p>
              <p className="text-[13px] leading-5 text-ink-2">{i}</p>
            </div>
          ))}
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Spend ────────────────────────────────────────────────────────────────────

function Expenses({ expenseItems, setExpenseItems, incomeItems, setIncomeItems, budgetItems, setBudgetItems }) {
  const [mode, setMode]       = useState("expense");
  const [showForm, setShowForm] = useState(false);
  const [name, setName]       = useState("");
  const [category, setCategory] = useState("Food & Drinks");
  const [amount, setAmount]   = useState("");
  const totalSpent    = expenseItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalBudgeted = budgetItems.reduce((s, i) => s + Number(i.limit || 0), 0);

  function addEntry() {
    const a = Number(amount);
    if (!name || !a) return;
    if (mode === "income")       setIncomeItems([{ source: name, category: "Income", amount: a, date: "Today" }, ...incomeItems]);
    else if (mode === "budget")  setBudgetItems([{ name, group: "wants", spent: 0, limit: a, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#6C47FF" }, ...budgetItems]);
    else {
      setExpenseItems([{ merchant: name, category, amount: a, date: "Today" }, ...expenseItems]);
      setBudgetItems(budgetItems.map(b => b.name === category ? { ...b, spent: Number(b.spent) + a } : b));
    }
    setName(""); setAmount(""); setShowForm(false);
  }

  const inputCls = "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-ink outline-none focus:border-brand shadow-sm transition-colors placeholder:text-ink-3";

  return (
    <PageScroll>
      <div className="flex items-start justify-between px-5 pt-6 pb-4">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ink">Spend</h1>
          <p className="mt-0.5 text-[13px] text-ink-2">This month</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-ink-2">
          <Filter size={18} />
        </button>
      </div>

      <div className="px-5">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mb-5">
          {["This month", "This week", "Today"].map(t => (
            <button key={t} className={`pb-3 text-[13px] font-semibold transition-colors ${t === "This month" ? "border-b-2 border-brand text-ink" : "text-ink-3"}`}>{t}</button>
          ))}
        </div>

        {/* Donut + totals */}
        <div className="flex items-center gap-5">
          <div className="h-28 w-28 shrink-0 rounded-full grid place-items-center"
            style={{ background: "conic-gradient(#F59E0B 0 42%, #22C55E 42% 64%, #6C47FF 64% 79%, #06B6D4 79% 90%, #9CA3AF 90% 100%)" }}>
            <div className="h-[4.5rem] w-[4.5rem] rounded-full bg-cream grid place-items-center">
              <BarChart3 size={22} className="text-ink-3" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-[24px] font-bold text-ink">{money(totalSpent)}</p>
            <p className="text-[12px] text-ink-3">Total spent</p>
            <div className="mt-2 space-y-1.5">
              {budgetItems.slice(0, 5).map(b => (
                <div key={b.name} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-ink-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: b.color }} />{b.name}
                  </span>
                  <span className="font-bold text-ink">{money(b.spent)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Btn onClick={() => setShowForm(!showForm)} className="mt-5 h-12 w-full">
          <Plus size={16} className="mr-2" /> Add money movement
        </Btn>
        <p className="mt-1 text-center text-[12px] text-ink-3">Track transfers to and from your accounts</p>
      </div>

      {showForm && (
        <div className="mx-5 mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 grid grid-cols-3 gap-1.5 rounded-xl bg-gray-50 p-1">
            {["expense","income","budget"].map(t => (
              <button key={t} onClick={() => setMode(t)} className={`rounded-lg py-2 text-[12px] font-semibold capitalize transition-colors ${mode === t ? "bg-brand text-white" : "text-ink-3"}`}>{t}</button>
            ))}
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={mode === "income" ? "Income source" : mode === "budget" ? "Budget name" : "Expense name"} className={`${inputCls} mb-3`} />
          {mode === "expense" && (
            <select value={category} onChange={e => setCategory(e.target.value)} className={`${inputCls} mb-3`}>
              {budgetItems.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
          )}
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className={`${inputCls} mb-3`} />
          <Btn onClick={addEntry} className="h-11 w-full">Save</Btn>
        </div>
      )}

      {/* Recent expenses */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <Label>Recent expenses</Label>
          <button className="text-[11px] font-bold text-brand">See all</button>
        </div>
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-50">
          {expenseItems.map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-base">
                {e.category === "Food & Drinks" ? "🍽️" : e.category === "Transport" ? "🚗" : "🛍️"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink">{e.merchant}</p>
                <p className="text-[11px] text-ink-3">{e.date}</p>
              </div>
              <p className="text-[14px] font-bold text-ink">KSh {Number(e.amount).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Plans ────────────────────────────────────────────────────────────────────

function PlannedExpenses() {
  return (
    <PageScroll>
      <div className="flex items-start justify-between px-5 pt-6 pb-4">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ink">Plans</h1>
          <p className="mt-0.5 text-[13px] text-ink-2">Trips, goals, and events</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/20">
          <Plus size={18} />
        </button>
      </div>
      <div className="px-5">
        <div className="flex gap-5 border-b border-gray-100 mb-4">
          {["All","Trips","Goals","Events"].map(t => (
            <button key={t} className={`pb-3 text-[13px] font-semibold ${t === "All" ? "border-b-2 border-brand text-ink" : "text-ink-3"}`}>{t}</button>
          ))}
        </div>
        <div className="space-y-3">
          {plannedExpenses.map((plan, i) => {
            const p = plan.target ? Math.round((plan.amount / plan.target) * 100) : 0;
            const cfg = { Trip: { emoji: "🏖️", color: "#22C55E" }, Goal: { emoji: "📱", color: "#6C47FF" }, Event: { emoji: "🎂", color: "#F59E0B" } }[plan.category] || { emoji: "🎯", color: "#6C47FF" };
            return (
              <div key={plan.name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {i === 0 && (
                  <div className="h-28 flex items-center justify-center text-6xl"
                    style={{ background: "linear-gradient(135deg, #EDE8FF, #DCFCE7)" }}>
                    {cfg.emoji}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-bold text-ink">{plan.name}</p>
                      <p className="mt-0.5 text-[12px] text-ink-3">{money(plan.amount)} / {money(plan.target)}</p>
                    </div>
                    <span className="font-display text-[15px] font-bold text-brand">{p}%</span>
                  </div>
                  <div className="mt-3"><ProgressBar value={p} color={cfg.color} /></div>
                  <div className="mt-2 flex justify-between text-[11px] text-ink-3">
                    <span>{plan.date}</span>
                    <span>{money(Math.ceil((plan.target - plan.amount) / 35))}/day</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageScroll>
  );
}

// ─── Briefing / News ──────────────────────────────────────────────────────────

function NewsScreen({ budgetItems, incomeItems }) {
  const health   = budgetHealth(budgetItems, incomeItems);
  const insights = aiInsights(budgetItems, incomeItems);

  return (
    <PageScroll>
      <div className="flex items-start justify-between px-5 pt-6 pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">Affordit Briefing</p>
          <h1 className="mt-0.5 font-display text-[22px] font-bold text-ink">Your daily money insights</h1>
        </div>
      </div>

      {/* Hero briefing card */}
      <div className="mx-5 rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #6C47FF 0%, #4F35CC 100%)" }}>
        <div className="flex items-center gap-4 p-5">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 mb-1">AI Daily Briefing</p>
            <h2 className="font-display text-[18px] font-bold text-white leading-tight">
              You're on track! Keep moving smart.
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-white/70">
              Small, consistent choices today build the future you want.
            </p>
            <p className="mt-2 text-[10px] text-white/40">Today, {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })} EAT</p>
          </div>
          <div className="text-5xl shrink-0">🤖</div>
        </div>
      </div>

      {/* Budget health */}
      <div className="mx-5 mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Label>Budget health</Label>
            <p className="mt-1 font-display text-2xl font-bold text-ink">{health.score}/100</p>
          </div>
          <Chip
            label={health.status}
            tone={health.status === "Healthy" ? "safe" : health.status === "Watch" ? "caution" : "over"}
          />
        </div>
        <p className="mt-2 text-[13px] leading-5 text-ink-2">{insights[0]}</p>
      </div>

      {/* Spending insights */}
      <div className="px-5 mt-4">
        <Label>Spending insights</Label>
        <div className="mt-3 rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-50">
          {[
            { icon: "📊", title: "Spending insight", text: `You spend ${money(expenseItems0.filter(e => e.category === "Food & Drinks").reduce((s,i) => s + i.amount, 0))} on transport this week. Great job saving there!` },
            { icon: "🎯", title: "Goal update", text: `You're 46% closer to your Mombasa trip goal.` },
            { icon: "💡", title: "Smart tip", text: `Try the KSh 10,000 rule to keep your budget healthy and balanced.` },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-3 p-4">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-ink-2 leading-4">{item.text}</p>
              </div>
              <ChevronRight size={16} className="text-ink-3 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* NSE movers */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <Label>NSE movers watch</Label>
          <span className="text-[10px] font-semibold text-ink-3 uppercase tracking-wide">Demo data</span>
        </div>
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-50">
          {[{ sym: "NSE Gainer A", change: "+6.2%", up: true }, { sym: "NSE Gainer B", change: "+4.1%", up: true }, { sym: "NSE Loser A", change: "-3.4%", up: false }].map(m => (
            <div key={m.sym} className="flex items-center gap-3 p-3.5">
              <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${m.up ? "bg-safe-bg" : "bg-red-50"}`}>
                {m.up ? <TrendingUp size={16} className="text-safe" /> : <TrendingDown size={16} className="text-over" />}
              </div>
              <p className="flex-1 text-[13px] font-semibold text-ink">{m.sym}</p>
              <p className={`text-[13px] font-bold ${m.up ? "text-safe" : "text-over"}`}>{m.change}</p>
            </div>
          ))}
        </div>
      </div>
    </PageScroll>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────

function HistoryScreen() {
  return (
    <PageScroll>
      <div className="flex items-start justify-between px-5 pt-6 pb-4">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ink">History</h1>
          <p className="mt-0.5 text-[13px] text-ink-2">Past activity</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-ink-2">
          <Search size={18} />
        </button>
      </div>
      <div className="px-5">
        <div className="flex gap-5 border-b border-gray-100 mb-4">
          {["All","Verdicts","Expenses","Plans"].map(t => (
            <button key={t} className={`pb-3 text-[13px] font-semibold ${t === "All" ? "border-b-2 border-brand text-ink" : "text-ink-3"}`}>{t}</button>
          ))}
        </div>
        <p className="mb-2"><Label>This week</Label></p>
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-50 mb-4">
          {historyItems.slice(0, 4).map(item => (
            <HistoryRow key={item.item} item={item} />
          ))}
        </div>
        <p className="mb-2"><Label>This month</Label></p>
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-gray-50">
          {historyItems.slice(4).map(item => (
            <HistoryRow key={item.item} item={item} />
          ))}
        </div>
      </div>
    </PageScroll>
  );
}

function HistoryRow({ item }) {
  const toneMap = {
    "Go for it":   { tone: "safe",    icon: "✓" },
    "Hold up":     { tone: "caution", icon: "⏸" },
    "Try cheaper": { tone: "brand",   icon: "↓" },
    "Plan":        { tone: "brand",   icon: "📌" },
    "Recurring":   { tone: "neutral", icon: "🔄" },
  };
  const t = toneMap[item.decision] || { tone: "neutral", icon: "•" };
  return (
    <div className="flex items-center gap-3 p-3.5">
      <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-[13px]
        ${t.tone === "safe" ? "bg-safe-bg text-safe" : t.tone === "caution" ? "bg-caution-bg text-caution" : t.tone === "brand" ? "bg-brand-soft text-brand" : "bg-gray-50 text-ink-3"}`}>
        {t.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-ink">{item.item}</p>
        <p className="text-[11px] text-ink-3">{item.date}</p>
      </div>
      <Chip label={item.decision} tone={t.tone} />
      <p className="text-[13px] font-bold text-ink ml-1">{money(item.amount)}</p>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AfforditPrototype() {
  const [screen, setScreen]   = useState("landing");
  const [purchase, setPurchase] = useState({ item: "Friday dinner", amount: 2800, category: "Food & Drinks" });
  const [expenseItems, setExpenseItems] = useState(expenseItems0);
  const [incomeItems, setIncomeItems]   = useState(incomeSources0);
  const [budgetItems, setBudgetItems]   = useState(budgetCategories);

  if (screen === "landing") return <Landing setScreen={setScreen} />;
  if (screen === "login")   return <Login setScreen={setScreen} />;

  const screens = {
    dashboard: <Dashboard setScreen={setScreen} budgetItems={budgetItems} />,
    ask:       <Ask setScreen={setScreen} setPurchase={setPurchase} budgetItems={budgetItems} />,
    result:    <Result setScreen={setScreen} purchase={purchase} budgetItems={budgetItems} />,
    budget:    <BudgetScreen budgetItems={budgetItems} setBudgetItems={setBudgetItems} incomeItems={incomeItems} />,
    expenses:  <Expenses expenseItems={expenseItems} setExpenseItems={setExpenseItems} incomeItems={incomeItems} setIncomeItems={setIncomeItems} budgetItems={budgetItems} setBudgetItems={setBudgetItems} />,
    planned:   <PlannedExpenses />,
    news:      <NewsScreen budgetItems={budgetItems} incomeItems={incomeItems} />,
    history:   <HistoryScreen />,
  };

  return (
    <AppFrame nav screen={screen} setScreen={setScreen}>
      <AnimatePresence mode="wait">
        <motion.div key={screen} className="flex flex-col flex-1 min-h-0"
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.16 }}>
          {screens[screen] || screens.dashboard}
        </motion.div>
      </AnimatePresence>
    </AppFrame>
  );
}
