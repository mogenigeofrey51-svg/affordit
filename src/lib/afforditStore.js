// Lightweight client-side store for the prototype.
// Replace this with Supabase/Firebase/API persistence later without changing the
// decision engine contract.

const STORAGE_KEY = "affordit:v1";

const defaultState = {
  checks: [],
  reflections: [],
  wishlist: [],
  paydayPlans: [],
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadAfforditStore() {
  if (!canUseStorage()) return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveAfforditStore(nextState) {
  if (!canUseStorage()) return nextState;
  const state = { ...defaultState, ...nextState };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function recordAffordabilityCheck({ purchase, result }) {
  const state = loadAfforditStore();
  const check = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    purchase,
    result,
  };

  return saveAfforditStore({
    ...state,
    checks: [check, ...state.checks].slice(0, 100),
  });
}

export function recordTransactionReflection({ transaction, reflection }) {
  const state = loadAfforditStore();
  const entry = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    transaction,
    reflection,
  };

  return saveAfforditStore({
    ...state,
    reflections: [entry, ...state.reflections].slice(0, 200),
  });
}

export function addWishlistItem({ purchase, result, reminderDate = null }) {
  const state = loadAfforditStore();
  const item = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    purchase,
    result,
    reminderDate,
    status: "cooling_off",
  };

  return saveAfforditStore({
    ...state,
    wishlist: [item, ...state.wishlist].slice(0, 100),
  });
}

export function savePaydayPlan(plan) {
  const state = loadAfforditStore();
  const entry = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    plan,
  };

  return saveAfforditStore({
    ...state,
    paydayPlans: [entry, ...state.paydayPlans].slice(0, 50),
  });
}

export function clearAfforditStore() {
  if (canUseStorage()) window.localStorage.removeItem(STORAGE_KEY);
  return defaultState;
}

export default {
  loadAfforditStore,
  saveAfforditStore,
  recordAffordabilityCheck,
  recordTransactionReflection,
  addWishlistItem,
  savePaydayPlan,
  clearAfforditStore,
};
