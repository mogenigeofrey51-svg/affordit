import { useMemo } from "react";
import {
  buildDemoFinancialState,
  calculateSafeToSpend,
  detectPatterns,
  getAffordabilityResult,
  getPaydaySurvivalPlan,
  createSaveUpPlan,
} from "../lib/afforditEngine.js";

// UI-safe hook for the current prototype. It does not change the look of the app;
// it gives screens a single product brain to call when we wire the flows.

export function useAfforditBrain({
  budgetItems = [],
  incomeItems = [],
  expenseItems = [],
  plannedExpenses = [],
  recurringExpenses = [],
  fakeBudget = {},
} = {}) {
  const state = useMemo(() => buildDemoFinancialState({
    budgetItems,
    incomeItems,
    expenseItems,
    plannedExpenses,
    recurringExpenses,
    fakeBudget,
  }), [budgetItems, incomeItems, expenseItems, plannedExpenses, recurringExpenses, fakeBudget]);

  return useMemo(() => {
    const safe = calculateSafeToSpend(state);
    const patterns = detectPatterns(state);

    return {
      state,
      safe,
      patterns,
      checkSpend: (purchase) => getAffordabilityResult(purchase, state),
      getPaydayPlan: (input = {}) => getPaydaySurvivalPlan({ ...state, ...input }),
      getSaveUpPlan: (purchase) => createSaveUpPlan(purchase, state),
    };
  }, [state]);
}

export default useAfforditBrain;
