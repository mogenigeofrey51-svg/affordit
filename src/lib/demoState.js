import {
  buildDemoFinancialState,
  calculateSafeToSpend,
  detectPatterns,
  getAffordabilityResult,
  getPaydaySurvivalPlan,
  createSaveUpPlan,
} from "./afforditEngine.js";

// Central demo state adapter. This mirrors the data currently hard-coded in
// App.jsx without changing the UI. When the app moves to real data, replace the
// arrays here with API/database state and the decision engine will keep working.

export const demoRecurringExpenses = [
  { name: "Rent", category: "Housing", amount: 35000, frequency: "Monthly", nextDate: "June 1" },
  { name: "Netflix", category: "Recurring", amount: 1100, frequency: "Monthly", nextDate: "June 5" },
  { name: "Gym membership", category: "Health", amount: 3000, frequency: "Monthly", nextDate: "June 7" },
  { name: "Loan repayment", category: "Debt", amount: 8500, frequency: "Monthly", nextDate: "June 10" },
];

export const demoGoals = [
  { name: "Mombasa trip", category: "Trip", amount: 11500, target: 25000, date: "In 35 days" },
  { name: "New iPhone", category: "Goal", amount: 8300, target: 15000, date: "In 60 days" },
  { name: "Birthday plan", category: "Event", amount: 2200, target: 5000, date: "In 20 days" },
];

export const demoBudget = {
  plannedUpcoming: 12500,
  safeAfterPlanned: 14250,
  emergencyFund: 42000,
  emergencyTarget: 100000,
};

export const demoBudgetCategories = [
  { name: "Food & Drinks", group: "needs", spent: 6250, limit: 15000, hasDailyLimit: true, dailyLimit: 2000, color: "#F59E0B" },
  { name: "Transport", group: "needs", spent: 2400, limit: 8000, hasDailyLimit: true, dailyLimit: 1200, color: "#22C55E" },
  { name: "Shopping", group: "wants", spent: 2812, limit: 10000, hasDailyLimit: false, dailyLimit: 0, color: "#6C47FF" },
  { name: "Entertainment", group: "wants", spent: 2062, limit: 7000, hasDailyLimit: false, dailyLimit: 0, color: "#06B6D4" },
  { name: "Others", group: "wants", spent: 1876, limit: 6000, hasDailyLimit: false, dailyLimit: 0, color: "#9CA3AF" },
];

export const demoExpenses = [
  { merchant: "Burger King", category: "Food & Drinks", amount: 850, date: "Today, 1:34 PM" },
  { merchant: "Bolt Ride", category: "Transport", amount: 320, date: "Today, 10:12 AM" },
  { merchant: "Java House", category: "Food & Drinks", amount: 580, date: "Yesterday, 6:45 PM" },
  { merchant: "Naivas", category: "Food & Drinks", amount: 3200, date: "May 20" },
];

export const demoIncome = [
  { source: "Salary", category: "Main income", amount: 45000, date: "May 25" },
  { source: "Freelance design", category: "Side income", amount: 15000, date: "May 18" },
];

export function getDemoFinancialState(overrides = {}) {
  return buildDemoFinancialState({
    budgetItems: overrides.budgetItems || demoBudgetCategories,
    incomeItems: overrides.incomeItems || demoIncome,
    expenseItems: overrides.expenseItems || demoExpenses,
    plannedExpenses: overrides.plannedExpenses || demoGoals,
    recurringExpenses: overrides.recurringExpenses || demoRecurringExpenses,
    fakeBudget: overrides.fakeBudget || demoBudget,
  });
}

export function getDemoAfforditBrain(overrides = {}) {
  const state = getDemoFinancialState(overrides);
  return {
    state,
    safe: calculateSafeToSpend(state),
    patterns: detectPatterns(state),
    check: (purchase) => getAffordabilityResult(purchase, state),
    paydayPlan: (input = {}) => getPaydaySurvivalPlan({ ...state, ...input }),
    saveUpPlan: (purchase) => createSaveUpPlan(purchase, state),
  };
}
