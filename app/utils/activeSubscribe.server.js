// utils/shopifySubscription.server.js
import { authenticate } from "../shopify.server";

export async function getShopifyActivePlan(request) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  const response = await admin.graphql(`
    {
      appInstallation {
        activeSubscriptions {
          name
          status
        }
      }
    }
  `);

  const data = await response.json();

  const subs = data.data.appInstallation.activeSubscriptions;

  const active = subs.find((s) => s.status === "ACTIVE");

  return {
    shop,
    activePlan: active?.name || null,
    activeStatus: active?.status || null,
  };
}

export const activeSubscribe = getShopifyActivePlan;
