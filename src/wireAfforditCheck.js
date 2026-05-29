import { getDemoAfforditBrain } from "./lib/demoState.js";
import { buildMoneyBestieCopy, verdictToPrimaryAction } from "./lib/afforditCoach.js";
import { recordAffordabilityCheck, addWishlistItem } from "./lib/afforditStore.js";

const categoryByLabel = {
  Food: "Food & Drinks",
  Rides: "Transport",
  Shopping: "Shopping",
  Events: "Entertainment",
  Trips: "Trip",
  More: "Others",
};

function findCheckHeading() {
  return [...document.querySelectorAll("h1")].find((node) => {
    const text = node.textContent || "";
    return /can i afford this/i.test(text) || /check before you spend/i.test(text);
  });
}

function isCheckScreen() {
  const heading = findCheckHeading();
  if (heading) return true;

  const activeNav = [...document.querySelectorAll("nav button")].find((button) =>
    button.className?.toString().includes("bg-white/10") || button.className?.toString().includes("bg-brand-soft")
  );

  return /ask|check/i.test(activeNav?.textContent || "") && Boolean(document.querySelector('main input[placeholder="Enter amount"]'));
}

function replaceTextNode(root, from, to) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (node.nodeValue?.trim() === from) node.nodeValue = node.nodeValue.replace(from, to);
  });
}

function renameAskToCheck() {
  replaceTextNode(document.body, "Ask", "Check");

  const heading = findCheckHeading();
  if (heading && heading.textContent !== "Check before you spend") {
    heading.textContent = "Check before you spend";
  }

  [...document.querySelectorAll("p")].forEach((node) => {
    if (node.textContent?.trim() === "Let's check your plan") {
      node.textContent = "Know the impact before you tap pay.";
    }
  });
}

function getAmountFromCheckScreen() {
  const input = document.querySelector('main input[placeholder="Enter amount"]');
  if (input?.value) return Number(input.value || 0);

  const amountNode = [...document.querySelectorAll("span, p, div")].find((node) =>
    /^KSh\s+[\d,]+$/.test(node.textContent?.trim() || "")
  );
  return Number((amountNode?.textContent || "0").replace(/[^0-9]/g, ""));
}

function getCategoryFromCheckScreen() {
  const chipButtons = [...document.querySelectorAll("main button")].filter((button) =>
    Object.keys(categoryByLabel).some((label) => button.textContent?.includes(label))
  );

  const active = chipButtons.find((button) => button.className?.toString().includes("bg-brand"));
  const label = Object.keys(categoryByLabel).find((key) => active?.textContent?.includes(key));
  return categoryByLabel[label] || "Food & Drinks";
}

function getPurchase() {
  const amount = getAmountFromCheckScreen() || 0;
  const category = getCategoryFromCheckScreen();
  return {
    item: category === "Food & Drinks" ? "Friday dinner" : `${category} spend`,
    merchant: "Manual check",
    amount,
    category,
    context: category === "Food & Drinks" || category === "Entertainment" ? "friends" : "solo",
  };
}

function scoreToneClass(tone) {
  if (tone === "safe") return "affordit-score-safe";
  if (tone === "over") return "affordit-score-over";
  return "affordit-score-caution";
}

function renderEngineCard() {
  if (!isCheckScreen()) return;

  const purchase = getPurchase();
  const brain = getDemoAfforditBrain();
  const result = brain.check(purchase);
  const coachCopy = buildMoneyBestieCopy(result, purchase, brain.state);

  let card = document.querySelector(".affordit-engine-verdict");
  if (!card) {
    card = document.createElement("section");
    card.className = "affordit-engine-verdict";

    const aiCard = [...document.querySelectorAll("p")]
      .find((node) => /affordit ai says/i.test(node.textContent || ""))
      ?.closest("div.rounded-2xl, div");

    if (aiCard?.parentNode) {
      aiCard.parentNode.insertBefore(card, aiCard.nextSibling);
    } else {
      document.querySelector("main .space-y-4")?.appendChild(card);
    }
  }

  const primaryAction = verdictToPrimaryAction(result.verdict);
  card.innerHTML = `
    <div class="affordit-engine-topline">
      <span class="affordit-engine-label">Affordit score</span>
      <span class="affordit-engine-score ${scoreToneClass(result.tone)}">${result.score}/100</span>
    </div>
    <h2>${result.headline}</h2>
    <p class="affordit-engine-copy">${coachCopy}</p>
    <div class="affordit-impact-grid">
      <div><span>Before</span><strong>KSh ${Number(result.safeBefore).toLocaleString()}</strong></div>
      <div><span>After</span><strong>KSh ${Number(result.safeAfter).toLocaleString()}</strong></div>
      <div><span>Goal</span><strong>${result.goalImpact?.affected ? `-${result.goalImpact.delayDays} days` : "On track"}</strong></div>
    </div>
    <div class="affordit-action-row">
      <button type="button" data-affordit-action="primary">${primaryAction}</button>
      <button type="button" data-affordit-action="wishlist">Cool off</button>
    </div>
  `;

  card.querySelector('[data-affordit-action="primary"]')?.addEventListener("click", () => {
    recordAffordabilityCheck({ purchase, result });
    showToast(`${primaryAction} saved to your Affordit history.`);
  });

  card.querySelector('[data-affordit-action="wishlist"]')?.addEventListener("click", () => {
    addWishlistItem({ purchase, result });
    showToast("Added to cool-off wishlist. Check again later before buying.");
  });
}

function showToast(message) {
  let toast = document.querySelector(".affordit-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "affordit-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function wireAddToPlanButton() {
  if (!isCheckScreen()) return;
  const addButton = [...document.querySelectorAll("button")].find((node) =>
    node.textContent?.trim() === "Add to plan"
  );
  if (!addButton || addButton.dataset.afforditWired === "true") return;

  addButton.dataset.afforditWired = "true";
  addButton.addEventListener("click", () => {
    const purchase = getPurchase();
    const result = getDemoAfforditBrain().check(purchase);
    recordAffordabilityCheck({ purchase, result });
  }, true);
}

function refresh() {
  const checkVisible = isCheckScreen();
  document.body.classList.toggle("affordit-check-wired", checkVisible);

  if (checkVisible) {
    renameAskToCheck();
    renderEngineCard();
    wireAddToPlanButton();
  } else {
    replaceTextNode(document.body, "Ask", "Check");
  }
}

export function installAfforditCheckWiring() {
  refresh();

  let scheduled = false;
  const scheduleRefresh = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      refresh();
    });
  };

  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  document.addEventListener("input", scheduleRefresh, true);
  document.addEventListener("click", scheduleRefresh, true);

  return () => {
    observer.disconnect();
    document.removeEventListener("input", scheduleRefresh, true);
    document.removeEventListener("click", scheduleRefresh, true);
  };
}

export default installAfforditCheckWiring;
