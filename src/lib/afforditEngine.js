// Affordit decision engine
// ------------------------
// This module keeps the product value separate from the UI. The screens can
// stay exactly as they are while the app gains a real affordability brain.

export const VERDICTS = {
  BUY_NOW: "buy_now",
  WAIT: "wait",
  FIND_CHEAPER: "find_cheaper",
  SAVE_FIRST: "save_first",
  SKIP: "skip",
};

export const TONES = {
  SAFE: "safe",
  CAUTION: "caution",
  OVER: "over",
  BRAND: "brand",
};

export function money(value, currency = "KSh") {
  return `${currency} ${Number(value || 0).toLocaleString()}`;
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function daysUntilPayday(paydayDay = 25, now = new Date()) {
  const today = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const payThisMonth = new Date(year, month, paydayDay);
  const payNextMonth = new Date(year, month + 1, paydayDay);
  const target = today <= paydayDay ? payThisMonth : payNextMonth;
  const ms = target.getTime() - now.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function normalizeFinancialState(input = {}) {
  const income = input.income || [];
  const expenses = input.expenses || [];
  const budgets = input.budgets || [];
  const goals = input.goals || [];
  const bills = input.bills || [];

  const monthlyIncome = toNumber(input.monthlyIncome, income.reduce((sum, item) => sum + toNumber(item.amount), 0));
  const currentBalance = toNumber(input.currentBalance, monthlyIncome || 0);
  const paydayDay = toNumber(input.paydayDay, 25);
  const daysToPayday = toNumber(input.daysToPayday, daysUntilPayday(paydayDay));
  const comfortBuffer = toNumber(input.comfortBuffer, Math.max(1000, Math.round(monthlyIncome * 0.03)));
  const emergencyBuffer = toNumber(input.emergencyBuffer, Math.max(1000, Math.round(monthlyIncome * 0.02)));

  return {
    currency: input.currency || "KSh",
    income,
    expenses,
    budgets,
    goals,
    bills,
    monthlyIncome,
    currentBalance,
    paydayDay,
    daysToPayday,
    comfortBuffer,
    emergencyBuffer,
    userTone: input.userTone || "bestie",
  };
}

export function calculateSafeToSpend(input = {}) {
  const state = normalizeFinancialState(input);
  const upcomingBills = state.bills.reduce((sum, bill) => sum + toNumber(bill.amount), 0);
  const goalCommitments = state.goals.reduce((sum, goal) => {
    const target = toNumber(goal.targetAmount ?? goal.target);
    const saved = toNumber(goal.savedAmount ?? goal.amount);
    const remaining = Math.max(0, target - saved);
    const daysLeft = Math.max(1, toNumber(goal.daysLeft, state.daysToPayday));
    const dailyCommitment = remaining / daysLeft;
    return sum + Math.min(remaining, dailyCommitment * state.daysToPayday);
  }, 0);

  const survivalPerDay = toNumber(
    state.survivalPerDay,
    Math.max(450, Math.round((state.monthlyIncome || 30000) * 0.008))
  );
  const survivalMoney = survivalPerDay * state.daysToPayday;
  const locked = upcomingBills + goalCommitments + survivalMoney + state.emergencyBuffer;
  const safeToSpend = Math.max(0, Math.round(state.currentBalance - locked));

  return {
    safeToSpend,
    locked,
    upcomingBills,
    goalCommitments: Math.round(goalCommitments),
    survivalMoney,
    survivalPerDay,
    emergencyBuffer: state.emergencyBuffer,
    daysToPayday: state.daysToPayday,
  };
}

export function calculateGoalImpact(purchase = {}, input = {}) {
  const state = normalizeFinancialState(input);
  const amount = toNumber(purchase.amount);
  const priorityGoals = [...state.goals].sort((a, b) => {
    const weight = { high: 3, medium: 2, low: 1 };
    return (weight[b.priority] || 1) - (weight[a.priority] || 1);
  });

  const goal = priorityGoals[0];
  if (!goal) {
    return {
      affected: false,
      goalName: null,
      delayDays: 0,
      message: "No goal is linked yet — using your safe-to-spend number as the guardrail.",
    };
  }

  const target = toNumber(goal.targetAmount ?? goal.target);
  const saved = toNumber(goal.savedAmount ?? goal.amount);
  const remaining = Math.max(0, target - saved);
  const daysLeft = Math.max(1, toNumber(goal.daysLeft, state.daysToPayday));
  const requiredDailySave = remaining / daysLeft;
  const delayDays = requiredDailySave > 0 ? Math.ceil(amount / requiredDailySave) : 0;
  const meaningfulDelay = delayDays >= 2;

  return {
    affected: meaningfulDelay,
    goalName: goal.name,
    delayDays,
    requiredDailySave: Math.round(requiredDailySave),
    message: meaningfulDelay
      ? `This could delay your ${goal.name} by about ${delayDays} days.`
      : `Your ${goal.name} stays on track.`,
  };
}

export function detectPatterns(input = {}) {
  const state = normalizeFinancialState(input);
  const expenses = state.expenses || [];
  const patterns = [];

  const byCategory = expenses.reduce((acc, item) => {
    const key = item.category || "Other";
    acc[key] = (acc[key] || 0) + toNumber(item.amount);
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    patterns.push({
      type: "top_category",
      severity: "info",
      title: `${topCategory[0]} is leading your spend`,
      message: `${topCategory[0]} is your biggest money movement at ${money(topCategory[1], state.currency)} this period.`,
    });
  }

  const foodSpend = byCategory["Food & Drinks"] || 0;
  if (foodSpend > 0) {
    patterns.push({
      type: "friday_food_risk",
      severity: "caution",
      title: "Friday food risk",
      message: "You tend to spend more on food and hangouts near the weekend. Keep tonight capped to protect your goals.",
    });
  }

  const budgetRows = state.budgets.map((budget) => {
    const spent = toNumber(budget.spent);
    const limit = toNumber(budget.limit ?? budget.monthlyLimit, 1);
    return { ...budget, spent, limit, usage: limit ? Math.round((spent / limit) * 100) : 0 };
  });

  const hotBudget = budgetRows.find((budget) => budget.usage >= 80);
  if (hotBudget) {
    patterns.push({
      type: "budget_hotspot",
      severity: hotBudget.usage >= 100 ? "over" : "caution",
      title: `${hotBudget.name} is running hot`,
      message: `${hotBudget.name} is at ${hotBudget.usage}%. Slow down here before approving more lifestyle spends.`,
    });
  }

  return patterns.slice(0, 4);
}

export function getAffordabilityResult(purchase = {}, input = {}) {
  const state = normalizeFinancialState(input);
  const amount = toNumber(purchase.amount);
  const safe = calculateSafeToSpend(state);
  const safeBefore = toNumber(input.safeToSpend, safe.safeToSpend);
  const safeAfter = safeBefore - amount;

  const category = state.budgets.find((budget) => budget.name === purchase.category);
  const categoryLimit = toNumber(category?.limit ?? category?.monthlyLimit);
  const categorySpent = toNumber(category?.spent);
  const categoryBefore = category ? categoryLimit - categorySpent : safeBefore;
  const categoryRemainingAfter = categoryBefore - amount;
  const dailyLimit = toNumber(category?.dailyLimit);

  const goalImpact = calculateGoalImpact(purchase, state);
  const exceedsSafe = safeAfter < 0;
  const breaksComfort = safeAfter < state.comfortBuffer;
  const exceedsCategory = category ? categoryRemainingAfter < 0 : false;
  const exceedsDailyLimit = dailyLimit > 0 ? amount > dailyLimit : false;
  const socialPressure = ["friends", "date", "event", "social"].includes(purchase.context);
  const emergency = purchase.context === "emergency";

  let score = 100;
  if (exceedsSafe) score -= 60;
  if (breaksComfort) score -= 25;
  if (exceedsCategory) score -= 20;
  if (exceedsDailyLimit) score -= 10;
  if (goalImpact.affected) score -= Math.min(18, goalImpact.delayDays * 2);
  if (socialPressure) score -= 5;
  if (emergency) score += 15;
  score = clamp(Math.round(score));

  let verdict = VERDICTS.BUY_NOW;
  if (score < 25) verdict = VERDICTS.SKIP;
  else if (score < 45) verdict = VERDICTS.SAVE_FIRST;
  else if (score < 65) verdict = VERDICTS.WAIT;
  else if (score < 80) verdict = VERDICTS.FIND_CHEAPER;

  const tone = score >= 80 ? TONES.SAFE : score >= 45 ? TONES.CAUTION : TONES.OVER;
  const headlineMap = {
    [VERDICTS.BUY_NOW]: "You're good — enjoy it.",
    [VERDICTS.FIND_CHEAPER]: "Find a cheaper option.",
    [VERDICTS.WAIT]: "Easy — this one bites into payday.",
    [VERDICTS.SAVE_FIRST]: "Save first, then buy.",
    [VERDICTS.SKIP]: "This pushes you into the red before payday.",
  };

  const nextActionsMap = {
    [VERDICTS.BUY_NOW]: ["Buy now", "Save the receipt", "Check another"],
    [VERDICTS.FIND_CHEAPER]: ["Find cheaper", "Set a cap", "Buy anyway"],
    [VERDICTS.WAIT]: ["Wait for payday", "Add to wishlist", "Try cheaper"],
    [VERDICTS.SAVE_FIRST]: ["Create save-up plan", "Add to wishlist", "Cool off"],
    [VERDICTS.SKIP]: ["Skip today", "Make a survival plan", "Find cheaper"],
  };

  const consequence = safeAfter >= 0
    ? `After this, your safe number becomes ${money(safeAfter, state.currency)}.`
    : `This goes ${money(Math.abs(safeAfter), state.currency)} past your safe-to-spend.`;

  return {
    score,
    verdict,
    tone,
    headline: headlineMap[verdict],
    label: headlineMap[verdict],
    safeBefore,
    safeAfter,
    categoryBefore,
    categoryRemainingAfter,
    dailyLimit,
    goalImpact,
    consequence,
    explanation: buildAffordabilityExplanation({
      state,
      purchase,
      score,
      verdict,
      safeAfter,
      categoryRemainingAfter,
      exceedsDailyLimit,
      goalImpact,
    }),
    nextActions: nextActionsMap[verdict],
    flags: {
      exceedsSafe,
      breaksComfort,
      exceedsCategory,
      exceedsDailyLimit,
      socialPressure,
      emergency,
    },
  };
}

export function buildAffordabilityExplanation({ state, purchase, verdict, safeAfter, categoryRemainingAfter, exceedsDailyLimit, goalImpact }) {
  const amount = money(purchase.amount, state.currency);
  const after = money(safeAfter, state.currency);
  const categoryAfter = money(categoryRemainingAfter, state.currency);

  if (verdict === VERDICTS.BUY_NOW) {
    return `This ${amount} spend fits. You still have ${after} safe to spend, and ${goalImpact.message.toLowerCase()}`;
  }

  if (exceedsDailyLimit) {
    return `The consequence: tomorrow's safe number drops to ${after}. This also pushes past your daily ${purchase.category} limit, so cap the plan or find a cheaper option.`;
  }

  if (verdict === VERDICTS.FIND_CHEAPER) {
    return `You can make it work, but a cheaper option keeps more breathing room. After this, ${purchase.category || "this category"} would have ${categoryAfter} left.`;
  }

  if (verdict === VERDICTS.WAIT) {
    return `You can pay, but it squeezes payday. After this, your safe number falls to ${after}. Best move: wait or reduce the spend.`;
  }

  if (verdict === VERDICTS.SAVE_FIRST) {
    return `This is worth planning, not forcing. Save first so you do not weaken bills, goals, or your comfort buffer.`;
  }

  return `This is not safe today. It pushes you past your spend room and could hurt bills or goals before payday.`;
}

export function getPaydaySurvivalPlan(input = {}) {
  const state = normalizeFinancialState(input);
  const safe = calculateSafeToSpend(state);
  const spendable = Math.max(0, toNumber(input.cashAvailable, safe.safeToSpend || state.currentBalance));
  const days = Math.max(1, toNumber(input.daysToPayday, state.daysToPayday));
  const dailySafeAmount = Math.floor(spendable / days);
  const transport = Math.round(spendable * 0.32);
  const food = Math.round(spendable * 0.42);
  const emergency = Math.round(spendable * 0.14);
  const fun = Math.max(0, spendable - transport - food - emergency);

  return {
    daysToPayday: days,
    spendable,
    dailySafeAmount,
    buckets: [
      { name: "Transport", amount: transport },
      { name: "Food", amount: food },
      { name: "Emergency", amount: emergency },
      { name: "Fun", amount: fun },
    ],
    advice: dailySafeAmount < 700
      ? "Keep this week tight: protect transport and food first, then pause shopping and hangouts."
      : "You have room, but set a daily cap so one weekend does not eat the whole plan.",
  };
}

export function createSaveUpPlan(purchase = {}, input = {}) {
  const state = normalizeFinancialState(input);
  const amount = toNumber(purchase.amount);
  const weeks = Math.max(1, toNumber(purchase.weeks, 4));
  const weeklyAmount = Math.ceil(amount / weeks);
  const dailyAmount = Math.ceil(amount / (weeks * 7));

  return {
    item: purchase.item || "this purchase",
    amount,
    weeks,
    weeklyAmount,
    dailyAmount,
    message: `Save ${money(weeklyAmount, state.currency)} weekly for ${weeks} weeks to buy ${purchase.item || "this"} without stressing payday.`,
  };
}

export function buildDemoFinancialState({ budgetItems = [], incomeItems = [], expenseItems = [], plannedExpenses = [], recurringExpenses = [], fakeBudget = {} } = {}) {
  const monthlyIncome = incomeItems.reduce((sum, item) => sum + toNumber(item.amount), 0);
  return normalizeFinancialState({
    currency: "KSh",
    currentBalance: toNumber(fakeBudget.safeAfterPlanned, 0)
      + recurringExpenses.reduce((sum, item) => sum + toNumber(item.amount), 0)
      + toNumber(fakeBudget.plannedUpcoming, 0)
      + 6500,
    monthlyIncome,
    income: incomeItems,
    expenses: expenseItems,
    budgets: budgetItems,
    goals: plannedExpenses.map((goal) => ({
      name: goal.name,
      targetAmount: goal.target,
      savedAmount: goal.amount,
      priority: goal.category === "Trip" ? "high" : "medium",
      daysLeft: goal.date?.match(/\d+/)?.[0] ? Number(goal.date.match(/\d+/)[0]) : 30,
    })),
    bills: recurringExpenses.map((bill) => ({ name: bill.name, amount: bill.amount, due: bill.nextDate })),
    emergencyBuffer: Math.max(1000, Math.round(toNumber(fakeBudget.emergencyFund, 0) * 0.03)),
    paydayDay: 25,
  });
}

export default {
  VERDICTS,
  TONES,
  money,
  normalizeFinancialState,
  calculateSafeToSpend,
  calculateGoalImpact,
  detectPatterns,
  getAffordabilityResult,
  getPaydaySurvivalPlan,
  createSaveUpPlan,
  buildDemoFinancialState,
};
