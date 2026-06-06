import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  try {
    const { shop, payload , admin } = await authenticate.webhook(request);

    const subscription = payload?.app_subscription || payload;
    
    console.log("Received subscription webhook with payload:", admin);

    // Validate required fields
    if (!subscription?.status || !subscription?.name) {
      console.warn("Missing required subscription fields:", subscription);
      return new Response("Invalid subscription data", { status: 400 });
    }
    
     const trialEndsAt = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;

    // set the db subscription status based on the webhook received from Shopify
    const result = await prisma.shopBillingPolicy.upsert({
      where: { shop },
      update: {
        subscriptionId: subscription.admin_graphql_api_id,
        plan: subscription.name,
        planHandle: subscription.plan_handle,
        status: subscription.status,
        trialEndsAt: trialEndsAt,
      },
      create: {
        shop,
        subscriptionId: subscription.admin_graphql_api_id,
        plan: subscription.name,
        planHandle: subscription.plan_handle,
        status: subscription.status,
        trialEndsAt: trialEndsAt,
      },
    });

    console.log("Upserted subscription record in database:", result);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
};
