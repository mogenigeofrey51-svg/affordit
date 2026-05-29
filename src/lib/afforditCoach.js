import { VERDICTS, money } from "./afforditEngine.js";

// Copy and coaching helpers. The engine calculates; this layer explains.
// Keeping this separate prevents the AI/voice layer from inventing numbers.

export function verdictToPrimaryAction(verdict) {
  return {
    [VERDICTS.BUY_NOW]: "Buy now",
    [VERDICTS.FIND_CHEAPER]: "Find cheaper",
    [VERDICTS.WAIT]: "Wait for payday",
    [VERDICTS.SAVE_FIRST]: "Create save-up plan",
    [VERDICTS.SKIP]: "Skip today",
  }[verdict] || "Review spend";
}

export function buildMoneyBestieCopy(result, purchase = {}, options = {}) {
  const currency = options.currency || "KSh";
  const item = purchase.item || "this";
  const amount = money(purchase.amount, currency);
  const safeAfter = money(result.safeAfter, currency);
  const goalLine = result.goalImpact?.message || "Your goals stay protected.";

  switch (result.verdict) {
    case VERDICTS.BUY_NOW:
      return `You're good — enjoy it. ${item} at ${amount} still leaves you with ${safeAfter} safe to spend. ${goalLine}`;
    case VERDICTS.FIND_CHEAPER:
      return `You can make it work, but cheaper is smarter. ${item} leaves ${safeAfter} safe, so set a cap and keep the rest for your goals.`;
    case VERDICTS.WAIT:
      return `Easy — this one bites into payday. ${item} drops your safe number to ${safeAfter}. Best move: wait or lower the spend.`;
    case VERDICTS.SAVE_FIRST:
      return `This deserves a plan, not pressure. Save first so ${item} does not weaken bills, goals, or your comfort buffer.`;
    case VERDICTS.SKIP:
      return `This pushes you into the red before payday. Skip ${item} today and protect your essentials first.`;
    default:
      return result.explanation || "Let's review this spend before you tap pay.";
  }
}

export function buildCoachPrompts(stateSummary = {}) {
  const days = stateSummary.daysToPayday || 8;
  return [
    {
      id: "payday_survival",
      title: "Can I survive to payday?",
      prompt: `I have ${days} days to payday. Build me a survival plan.`,
    },
    {
      id: "cut_this_week",
      title: "What should I cut this week?",
      prompt: "Look at my recent spending and tell me what to cut without killing my lifestyle.",
    },
    {
      id: "afford_safely",
      title: "How do I afford this safely?",
      prompt: "Help me afford something I want without hurting my goals.",
    },
  ];
}

export function buildCoachSystemPrompt({ result, purchase, financialState }) {
  return [
    "You are Affordit, a Kenyan money bestie for young people.",
    "Explain affordability in a friendly, clear, non-judgmental way.",
    "Mention the consequence first.",
    "Use light Kenyan/Gen Z tone sparingly.",
    "Never invent numbers. Only use the structured result provided.",
    "Keep the answer under 80 words and end with one action.",
    "",
    `Purchase: ${purchase?.item || "unknown"}`,
    `Amount: ${money(purchase?.amount || 0, financialState?.currency || "KSh")}`,
    `Score: ${result?.score}`,
    `Verdict: ${result?.verdict}`,
    `Safe before: ${money(result?.safeBefore || 0, financialState?.currency || "KSh")}`,
    `Safe after: ${money(result?.safeAfter || 0, financialState?.currency || "KSh")}`,
    `Goal impact: ${result?.goalImpact?.message || "None"}`,
    `Category after: ${money(result?.categoryRemainingAfter || 0, financialState?.currency || "KSh")}`,
  ].join("\n");
}
