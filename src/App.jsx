import React, { useState } from "react";
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
  PiggyBank,
  Plus,
  Search,
  ShoppingBag,
  Target,
  Wallet,
  XCircle,
} from "lucide-react";

const currency = "KES";
const HERO_BACKGROUND = "/affordit-theme.png";

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
  { name: "Food & Drinks", spent: 6250, limit: 15000, hasDailyLimit: true, dailyLimit: 2000, activeDays: 20, color: "#ff9f1c" },
  { name: "Transport", spent: 2400, limit: 8000, hasDailyLimit: true, dailyLimit: 1200, activeDays: 22, color: "#27d17f" },
  { name: "Shopping", spent: 2812, limit: 10000, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#7c3cff" },
  { name: "Entertainment", spent: 2062, limit: 7000, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#5ba7ff" },
  { name: "Others", spent: 1876, limit: 6000, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#f97316" },
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

function Button({ children, className = "", variant = "primary", ...props }) {
  const styles =
    variant === "secondary"
      ? "bg-[#111824] text-white ring-1 ring-white/10 hover:bg-[#182233]"
      : variant === "ghost"
        ? "bg-transparent text-white/70 hover:text-white"
        : "bg-gradient-to-r from-[#8D3CFF] to-[#4E2DE2] text-white shadow-lg shadow-[#5B2AF2]/30 hover:brightness-110";

  return (
    <button className={`inline-flex items-center justify-center rounded-2xl px-4 font-black transition ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function AppFrame({ children, nav, screen, setScreen }) {
  return (
    <div className="min-h-screen bg-[#020306] text-white sm:flex sm:items-center sm:justify-center sm:p-6">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#05080D] shadow-2xl shadow-black/70 ring-1 ring-white/15 sm:min-h-[880px] sm:max-h-[920px] sm:rounded-[2rem] sm:border sm:border-white/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,60,255,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(22,104,128,0.22),transparent_42%)]" />
        <div className="relative flex min-h-0 flex-1 flex-col">
          {children}
          {nav && <BottomNav screen={screen} setScreen={setScreen} />}
        </div>
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "ask", label: "Ask", icon: ShoppingBag },
    { id: "expenses", label: "Spend", icon: CreditCard },
    { id: "planned", label: "Plans", icon: CalendarDays },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <nav className="border-t border-white/10 bg-[#05080D]/95 px-4 pb-4 pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = screen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-semibold transition ${
                active ? "text-[#B36BFF]" : "text-white/55 hover:text-white"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 3 : 2} />
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
    <button onClick={onClick} aria-label={label} className={`grid h-10 w-10 place-items-center rounded-2xl bg-black/30 text-white ring-1 ring-white/10 backdrop-blur ${className}`}>
      <Icon size={18} />
    </button>
  );
}

function ImageTile({ className = "", position = "center" }) {
  return <div className={`bg-cover ${className}`} style={{ backgroundImage: `url(${HERO_BACKGROUND})`, backgroundPosition: position }} />;
}

function Progress({ value, color = "#8D3CFF" }) {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)));

  return (
    <div className="h-1.5 w-full rounded-full bg-white/10">
      <div className="h-1.5 rounded-full" style={{ width: `${safeValue}%`, background: color }} />
    </div>
  );
}

function ScreenHeader({ title, subtitle, leftIcon = Menu, rightIcon = Bell, onLeft, onRight }) {
  const Left = leftIcon;
  const Right = rightIcon;

  return (
    <div className="flex items-start justify-between px-5 pt-5">
      <div>
        <button onClick={onLeft} className="mb-5 text-white/85">
          <Left size={22} />
        </button>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/70">{subtitle}</p>}
      </div>
      <IconButton icon={Right} onClick={onRight} label="Action" />
    </div>
  );
}

function StatCard({ label, value, tone = "neutral" }) {
  const toneClass = {
    good: "text-[#54F28A]",
    bad: "text-[#FF6B3D]",
    purple: "text-[#B36BFF]",
    neutral: "text-white",
  }[tone];

  return (
    <div className="rounded-xl bg-[#101723] p-4 ring-1 ring-white/5">
      <p className="text-xs font-semibold text-white/55">{label}</p>
      <p className={`mt-1 text-sm font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function Landing({ setScreen }) {
  return (
    <AppFrame>
      <div className="relative min-h-screen overflow-hidden sm:min-h-[880px]">
        <ImageTile className="absolute inset-0 opacity-95" position="center top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#06111B]/45 to-[#04070C]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

        <div className="relative z-10 flex min-h-screen flex-col px-6 pb-6 pt-7 sm:min-h-[880px]">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black">Affordit</p>
            <IconButton icon={Bell} label="Notifications" />
          </div>

          <div className="mt-auto">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h1 className="max-w-xs text-4xl font-black leading-tight tracking-tight">
                Check the fit, the trip, the spend.
              </h1>
              <p className="mt-3 max-w-[18rem] text-sm leading-6 text-white/85">
                Affordit is your lifestyle money check before you buy the outfit, book the trip, order the food, or tap pay.
              </p>
            </motion.div>

            <div className="mt-6 rounded-2xl bg-[#101723]/90 p-3 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur">
              <MiniDecision title="Weekend outfit" amount={4800} label="Fits your budget" good />
              <MiniDecision title="Mombasa trip" amount={18500} label="Hold for payday" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <Benefit icon={ShieldMark} title="Know before you spend" />
              <Benefit icon={BarChart3} title="Stay on budget" />
              <Benefit icon={Target} title="More life, less limits" />
            </div>

            <Button onClick={() => setScreen("login")} className="mt-5 h-14 w-full">
              Let's go <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function ShieldMark(props) {
  return <CheckCircle2 {...props} />;
}

function MiniDecision({ title, amount, label, good }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2">
      <ImageTile className="h-12 w-12 shrink-0 rounded-xl" position={good ? "center 70%" : "center top"} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-white/85">{title}</p>
        <p className="font-black">{money(amount)}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-[10px] font-black ${good ? "bg-[#54F28A] text-[#06110D]" : "bg-[#FF9F1C] text-black"}`}>
        {label}
      </span>
    </div>
  );
}

function Benefit({ icon: Icon, title }) {
  return (
    <div className="rounded-2xl bg-black/25 px-2 py-3 ring-1 ring-white/10 backdrop-blur">
      <Icon size={18} className="mx-auto text-[#B36BFF]" />
      <p className="mt-2 text-[11px] font-semibold leading-4 text-white/80">{title}</p>
    </div>
  );
}

function Login({ setScreen }) {
  return (
    <AppFrame>
      <div className="relative min-h-screen overflow-hidden sm:min-h-[880px]">
        <ImageTile className="absolute inset-0 opacity-95" position="center top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-[#070A11]/35 to-[#05080D]" />

        <div className="relative z-10 flex min-h-screen flex-col px-6 pb-7 pt-7 sm:min-h-[880px]">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black">Affordit</p>
            <IconButton icon={ChevronLeft} onClick={() => setScreen("landing")} label="Back" className="rotate-180" />
          </div>

          <div className="mt-auto">
            <h1 className="text-3xl font-black">Welcome back</h1>
            <p className="mt-2 text-sm text-white/75">Spend smarter. Live better.</p>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-white/65">Phone number</span>
                <input
                  defaultValue="+254 712 345 678"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none backdrop-blur placeholder:text-white/35 focus:border-[#8D3CFF]"
                />
              </label>
              <Button onClick={() => setScreen("dashboard")} className="h-12 w-full">
                Continue
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-white/40">
              <div className="h-px flex-1 bg-white/10" />
              or continue with
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="h-12">
                Google
              </Button>
              <Button variant="secondary" className="h-12">
                Apple
              </Button>
            </div>
            <p className="mt-5 text-center text-sm text-white/70">
              Don't have an account? <span className="font-bold text-[#B36BFF]">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function Dashboard({ setScreen, incomeItems, expenseItems, budgetItems }) {
  const totalIncome = incomeItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalSpent = expenseItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const planned = fakeBudget.plannedUpcoming;
  const left = Math.max(0, totalIncome - totalSpent - planned);

  return (
    <PageScroll>
      <ScreenHeader title="Hey, Jay" subtitle="Here's your money map." />

      <div className="mx-5 mt-5 overflow-hidden rounded-2xl bg-[#101723] ring-1 ring-white/10">
        <div className="relative p-5">
          <ImageTile className="absolute inset-0 opacity-20" position="center top" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101723] via-[#101723]/90 to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/55">Available to spend</p>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-black/30 text-white/70">
                <Eye size={15} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-black">{money(fakeBudget.safeAfterPlanned)}</p>
            <p className="mt-1 text-xs text-white/55">This month</p>
          </div>
        </div>
      </div>

      <SectionHeader title="Quick overview" action="See all" />
      <div className="grid grid-cols-2 gap-2 px-5">
        <StatCard label="Income" value={money(totalIncome)} tone="good" />
        <StatCard label="Spent" value={money(totalSpent)} tone="bad" />
        <StatCard label="Planned" value={money(planned)} tone="purple" />
        <StatCard label="Left" value={money(left)} />
      </div>

      <SectionHeader title="Budgets" action="See all" onClick={() => setScreen("expenses")} />
      <div className="space-y-3 px-5">
        {budgetItems.slice(0, 4).map((budget) => (
          <BudgetStrip key={budget.name} budget={budget} />
        ))}
      </div>
    </PageScroll>
  );
}

function SectionHeader({ title, action, onClick }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between px-5">
      <h2 className="text-sm font-black">{title}</h2>
      {action && (
        <button onClick={onClick} className="text-xs font-bold text-[#B36BFF]">
          {action}
        </button>
      )}
    </div>
  );
}

function BudgetStrip({ budget }) {
  const pct = budget.limit ? Math.round((Number(budget.spent || 0) / Number(budget.limit || 1)) * 100) : 0;

  return (
    <div className="rounded-xl bg-[#101723] p-3 ring-1 ring-white/5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ImageTile className="h-10 w-10 shrink-0 rounded-lg" position="center 70%" />
          <div className="min-w-0">
            <p className="text-sm font-bold">{budget.name}</p>
            <p className="text-[11px] text-white/45">Daily limit: {money(budget.dailyLimit || Math.round(budget.limit / 30))}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black">{money(budget.spent)}</p>
          <p className="text-[11px] text-white/45">of {money(budget.limit)}</p>
        </div>
      </div>
      <Progress value={pct} color={budget.color || "#8D3CFF"} />
    </div>
  );
}

function Ask({ setScreen, setPurchase, budgetItems }) {
  const [amount, setAmount] = useState("2800");
  const [item, setItem] = useState("Friday dinner");
  const [category, setCategory] = useState("Food & Drinks");

  function chooseScenario(scenario) {
    setItem(scenario.item);
    setAmount(String(scenario.amount));
    setCategory(scenario.category);
    setPurchase(scenario);
    setScreen("result");
  }

  return (
    <PageScroll flush>
      <div className="relative h-72 overflow-hidden">
        <ImageTile className="absolute inset-0 opacity-90" position="center top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-[#05080D]" />
        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-6 pt-5">
          <div className="flex justify-between">
            <IconButton icon={ChevronLeft} onClick={() => setScreen("dashboard")} label="Back" />
            <IconButton icon={Info} label="Info" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">What's the move?</h1>
            <p className="mt-2 text-sm text-white/75">Tell us what you're planning to spend on.</p>
          </div>
        </div>
      </div>

      <div className="-mt-2 space-y-5 px-5">
        <label className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 text-white/65">
          <Search size={17} />
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Search or choose a category"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </label>

        <div className="grid grid-cols-6 gap-2">
          {categoryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.name}
                onClick={() => setCategory(option.name === "Food" ? "Food & Drinks" : option.name)}
                className="rounded-xl bg-[#101723] px-1 py-3 ring-1 ring-white/5 transition hover:bg-[#171F2D]"
              >
                <Icon size={18} className="mx-auto text-[#B36BFF]" />
                <span className="mt-2 block text-[10px] font-bold text-white/80">{option.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="h-12 rounded-xl border border-white/10 bg-[#101723] px-4 text-sm text-white outline-none focus:border-[#8D3CFF]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-[#101723] px-3 text-sm text-white outline-none focus:border-[#8D3CFF]"
          >
            {budgetItems.map((budget) => (
              <option key={budget.name} value={budget.name}>
                {budget.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <SectionRow title="Popular ideas" action="See all" />
          <div className="mt-3 space-y-2">
            {demoScenarios.map((scenario) => (
              <button key={scenario.item} onClick={() => chooseScenario(scenario)} className="flex w-full items-center gap-3 rounded-xl bg-[#101723] p-3 text-left ring-1 ring-white/5">
                <ImageTile className="h-10 w-10 shrink-0 rounded-lg" position="center 70%" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{scenario.item}</p>
                  <p className="text-xs text-white/45">{scenario.merchant}</p>
                </div>
                <p className="text-xs font-black">{money(scenario.amount)}</p>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-[#B36BFF]/45 text-[#B36BFF]">
                  <Plus size={15} />
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
          className="h-12 w-full"
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
      <h2 className="text-sm font-black">{title}</h2>
      {action && <button className="text-xs font-bold text-[#B36BFF]">{action}</button>}
    </div>
  );
}

function getVerdict(purchase, budgetItems = budgetCategories) {
  const amount = Number(purchase.amount || 0);
  const dailyRule = budgetItems.find((budget) => budget.name === purchase.category && budget.hasDailyLimit);
  const isOverDailyLimit = dailyRule && amount > Number(dailyRule.dailyLimit || 0);
  const verdict = purchase.verdict || (isOverDailyLimit ? "dailyLimit" : amount <= 4800 ? "go" : amount <= 12000 ? "cheaper" : amount <= 32000 ? "hold" : "skip");
  const map = {
    dailyLimit: {
      label: "Hold up",
      headline: "Hold up",
      score: 64,
      icon: Clock,
      color: "#FFCE3D",
      summary: `This will push you over your daily ${purchase.category || "category"} limit.`,
      action: "Try cheaper",
      secondary: "See options",
      why: dailyRule
        ? `You've already spent ${money(1250)} today on ${dailyRule.name}. Your daily limit is ${money(dailyRule.dailyLimit)}.`
        : "This purchase is above today's category pace.",
    },
    go: {
      label: "Go for it",
      headline: "Go for it",
      score: 88,
      icon: CheckCircle2,
      color: "#54F28A",
      summary: "This fits your spend room and keeps your plans moving.",
      action: "Mark bought",
      secondary: "Check another",
      why: "Your safe-to-spend amount still has room after this purchase.",
    },
    hold: {
      label: "Hold up",
      headline: "Hold up",
      score: 48,
      icon: Clock,
      color: "#FFCE3D",
      summary: "You can afford this, but it squeezes money already reserved for upcoming plans.",
      action: "Remind me",
      secondary: "Buy anyway",
      why: "Waiting until payday keeps the Mombasa plan and emergency fund more comfortable.",
    },
    cheaper: {
      label: "Try cheaper",
      headline: "Try cheaper",
      score: 58,
      icon: ShoppingBag,
      color: "#B36BFF",
      summary: "A cheaper option gets the same lifestyle win without stressing your budget.",
      action: "Try cheaper",
      secondary: "Original",
      why: "Look for an option around KES 5,000 and keep the rest for plans.",
    },
    skip: {
      label: "Skip it",
      headline: "Skip it",
      score: 22,
      icon: XCircle,
      color: "#FF4D6D",
      summary: "This clears too much discretionary cash and pushes important goals out.",
      action: "Cool off",
      secondary: "Buy anyway",
      why: "This purchase would take more than your current safe-to-spend amount.",
    },
  };

  return map[verdict] || map.hold;
}

function Result({ setScreen, purchase, budgetItems }) {
  const verdict = getVerdict(purchase, budgetItems);
  const VerdictIcon = verdict.icon;

  return (
    <PageScroll flush>
      <div className="relative h-80 overflow-hidden">
        <ImageTile className="absolute inset-0 opacity-85" position="center top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-[#05080D]" />
        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-6 pt-5">
          <div className="flex justify-between">
            <IconButton icon={ChevronLeft} onClick={() => setScreen("ask")} label="Back" />
            <IconButton icon={Plus} label="Save" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/65">Verdict</p>
            <h1 className="mt-1 text-4xl font-black tracking-tight" style={{ color: verdict.color }}>
              {verdict.headline}
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/85">{verdict.summary}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5">
        <div className="-mt-2 flex items-center gap-3 rounded-xl bg-[#101723] p-3 ring-1 ring-white/5">
          <ImageTile className="h-14 w-14 shrink-0 rounded-xl" position="center 70%" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{purchase.item}</p>
            <p className="mt-1 text-xl font-black text-[#C39BFF]">{money(purchase.amount)}</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-black/25" style={{ color: verdict.color }}>
            <VerdictIcon size={24} />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-black">Why?</p>
          <p className="rounded-xl bg-[#101723] p-4 text-sm leading-6 text-white/75 ring-1 ring-white/5">{verdict.why}</p>
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
      setBudgetItems([{ name, spent: 0, limit: cleanAmount, hasDailyLimit: false, dailyLimit: 0, activeDays: 0, color: "#8D3CFF" }, ...budgetItems]);
    } else {
      setExpenseItems([{ merchant: name, category, amount: cleanAmount, date: "Today" }, ...expenseItems]);
      setBudgetItems(budgetItems.map((budget) => (budget.name === category ? { ...budget, spent: Number(budget.spent || 0) + cleanAmount } : budget)));
    }

    setName("");
    setAmount("");
    setShowForm(false);
  }

  return (
    <PageScroll>
      <ScreenHeader title="Spend" subtitle="This month" rightIcon={Filter} />

      <div className="px-5">
        <Tabs items={["This month", "This week", "Today"]} active="This month" />
        <div className="mt-5 flex items-center gap-5">
          <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#8D3CFF 0 42%, #27D17F 42% 64%, #5BA7FF 64% 79%, #FFCE3D 79% 90%, #F97316 90% 100%)" }}>
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#05080D]">
              <BarChart3 size={26} className="text-white/70" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-black">{money(totalSpent)}</p>
            <p className="text-xs text-white/50">Total spent</p>
            <div className="mt-4 space-y-2">
              {budgetItems.slice(0, 5).map((budget) => (
                <div key={budget.name} className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-2 text-white/65">
                    <span className="h-2 w-2 rounded-full" style={{ background: budget.color }} />
                    {budget.name}
                  </span>
                  <span className="font-bold">{money(budget.spent)}</span>
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
        <div className="mx-5 mt-4 rounded-2xl bg-[#101723] p-4 ring-1 ring-white/10">
          <div className="mb-3 grid grid-cols-3 gap-2 rounded-xl bg-black/25 p-1">
            {["expense", "income", "budget"].map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`rounded-lg py-2 text-xs font-bold ${mode === item ? "bg-[#8D3CFF]" : "text-white/55"}`}>
                {item}
              </button>
            ))}
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={mode === "income" ? "Income source" : mode === "budget" ? "Budget name" : "Expense name"} className="mb-3 h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm outline-none focus:border-[#8D3CFF]" />
          {mode === "expense" && (
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mb-3 h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm outline-none focus:border-[#8D3CFF]">
              {budgetItems.map((budget) => (
                <option key={budget.name} value={budget.name}>
                  {budget.name}
                </option>
              ))}
            </select>
          )}
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={mode === "budget" ? "Monthly limit" : "Amount"} className="mb-3 h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm outline-none focus:border-[#8D3CFF]" />
          <Button onClick={addEntry} className="h-11 w-full">
            Save
          </Button>
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

function Tabs({ items, active }) {
  return (
    <div className="flex gap-7 border-b border-white/10">
      {items.map((item) => (
        <button key={item} className={`pb-3 text-xs font-bold ${item === active ? "border-b-2 border-[#B36BFF] text-white" : "text-white/45"}`}>
          {item}
        </button>
      ))}
    </div>
  );
}

function PlannedExpenses() {
  return (
    <PageScroll>
      <ScreenHeader title="Plans" subtitle="Trips, goals, and events" rightIcon={Plus} />
      <div className="px-5">
        <Tabs items={["All", "Trips", "Goals", "Events"]} active="All" />
      </div>
      <div className="mt-4 space-y-3 px-5">
        {plannedExpenses.map((plan, index) => {
          const pct = plan.target ? Math.round((plan.amount / plan.target) * 100) : 0;
          return (
            <div key={plan.name} className="overflow-hidden rounded-2xl bg-[#101723] ring-1 ring-white/5">
              {index === 0 && (
                <div className="relative h-36">
                  <ImageTile className="absolute inset-0 opacity-90" position="center 65%" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101723] to-transparent" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black">{plan.name}</p>
                    <p className="mt-1 text-xs text-white/55">
                      {money(plan.amount)} / {money(plan.target)}
                    </p>
                  </div>
                  <p className="text-sm font-black">{pct}%</p>
                </div>
                <div className="mt-3">
                  <Progress value={pct} color="#8D3CFF" />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-white/45">
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
    good: "bg-[#1E9E55] text-white",
    bad: "bg-[#D63E22] text-white",
    warning: "bg-[#FF9F1C] text-black",
    purple: "bg-[#8D3CFF] text-white",
    neutral: "bg-[#101723] text-white",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#101723] p-3 ring-1 ring-white/5">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneMap[tone]}`}>
        <CreditCard size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{item}</p>
        <p className="text-xs text-white/45">{meta}</p>
      </div>
      {label && <p className={`text-xs font-black ${tone === "good" ? "text-[#54F28A]" : tone === "warning" ? "text-[#FF9F1C]" : tone === "purple" ? "text-[#B36BFF]" : "text-[#FF6B3D]"}`}>{label}</p>}
      <p className="text-xs font-black">{money(amount)}</p>
    </div>
  );
}

function PageScroll({ children, flush }) {
  return <main className={`min-h-0 flex-1 overflow-y-auto pb-6 ${flush ? "" : "pt-0"}`}>{children}</main>;
}

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
    history: <HistoryScreen />,
  };

  return (
    <AppFrame nav screen={screen} setScreen={setScreen}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="flex min-h-0 flex-1 flex-col"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {screens[screen] || screens.dashboard}
        </motion.div>
      </AnimatePresence>
    </AppFrame>
  );
}
