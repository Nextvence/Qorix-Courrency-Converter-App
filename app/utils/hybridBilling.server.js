// utils/hybridBilling.server.js
import prisma from "../db.server";
import { getShopifyActivePlan } from "./activeSubscribe.server";

const PLAN_NAMES = {
  FREE: "Free Plan",
  STANDARD: "Standard Plan",
  PRO: "Pro Plan",
};

function normalizePlanMode(planName) {
  const normalized = String(planName || "").trim().toLowerCase();

  if (normalized === PLAN_NAMES.PRO.toLowerCase() || normalized === "pro") {
    return "PRO";
  }

  if (
    normalized === PLAN_NAMES.STANDARD.toLowerCase() ||
    normalized === "standard" ||
    normalized === "basic"
  ) {
    return "STANDARD";
  }

  return "FREE";
}

export async function getBillingMode(request) {
  const { session } = await import("../shopify.server").then(m =>
    m.authenticate.admin(request)
  );

  const shop = session.shop;

  // 1. DB (fast)
  const dbBilling = await prisma.shopBillingPolicy.findUnique({
    where: { shop },
  });

  // 2. Shopify (truth)
  const shopify = await getShopifyActivePlan(request);
  // console.log("Shopify subscription info:", shopify);
  // 3. Sync DB if mismatch
  if (
    dbBilling &&
    shopify.activePlan &&
    dbBilling.plan !== shopify.activePlan
  ) {
    await prisma.shopBillingPolicy.update({
      where: { shop },
      data: {
        plan: shopify.activePlan,
        status: shopify.activeStatus,
      },
    });
  }

  // 4. FINAL DECISION
  const hasActiveSubscription = shopify.activeStatus === "ACTIVE" && shopify.activePlan;
  const mode = hasActiveSubscription ? normalizePlanMode(shopify.activePlan) : "FREE";
// temporarily disable plan differentiation until we have multiple plans to avoid confusion, will re-enable once we have more than 1 plan
// const mode = hasActiveSubscription ? normalizePlanMode("Standard Plan") : "FREE";
  const finalPlan = hasActiveSubscription ? shopify.activePlan : PLAN_NAMES.FREE;
  const finalStatus = hasActiveSubscription ? "ACTIVE" : "FREE";
  const isPaid = mode === "STANDARD" || mode === "PRO";

  return {
    mode,
    plan: finalPlan,
    planDisplayName: PLAN_NAMES[mode],
    status: finalStatus,
    hasActiveSubscription: Boolean(hasActiveSubscription),
    isPaid,
    isFree: mode === "FREE",
    isStandard: mode === "STANDARD",
    isPro: mode === "PRO",
  };
}
