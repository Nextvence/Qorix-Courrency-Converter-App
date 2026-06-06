import { Outlet, useFetcher, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useEffect, useRef } from "react";
import { authenticate } from "../shopify.server";
import { getBillingMode } from "../utils/hybridBilling.server";
import { ensureAppMetafields } from "../utils/metafields.server";
import {
  defaultCurrencyDesign,
  defaultCurrencyGeneral,
  defaultSettingsWidget,
} from "../utils/default-settings";
import { defaultSettingsGeneral } from "../utils/store-default.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const billing = await getBillingMode(request);
  const { currentAppInstallationId } = await ensureAppMetafields(admin, [
    "settings_general",
    "settings_widget",
  ]);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    appName: "Qorix Currency Converter",
    billing,
    currentAppInstallationId,
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const currentAppInstallationId = formData.get("currentAppInstallationId");

  if (actionType === "reset_all_settings" && currentAppInstallationId) {
    const defaultGeneralSettings = await defaultSettingsGeneral(admin);
    const metafields = [
      {
        ownerId: currentAppInstallationId,
        namespace: "currency_converter",
        key: "settings_general",
        type: "json",
        value: JSON.stringify(defaultGeneralSettings),
      },
      {
        ownerId: currentAppInstallationId,
        namespace: "currency_converter",
        key: "settings_widget",
        type: "json",
        value: JSON.stringify(defaultSettingsWidget),
      },
      {
        ownerId: currentAppInstallationId,
        namespace: "currency_converter",
        key: "currency_general",
        type: "json",
        value: JSON.stringify(defaultCurrencyGeneral),
      },
      {
        ownerId: currentAppInstallationId,
        namespace: "currency_converter",
        key: "currency_design",
        type: "json",
        value: JSON.stringify(defaultCurrencyDesign),
      },
    ];

    await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors {
            field
            message
          }
        }
      }`,
      { variables: { metafields } }
    );
  }

  return null;
};

export default function App() {
  const { apiKey, billing, currentAppInstallationId } = useLoaderData();
  const fetcher = useFetcher();
  const prevIsFreeRef = useRef(false);

  useEffect(() => {
    if (billing?.isFree && !prevIsFreeRef.current && currentAppInstallationId) {
      fetcher.submit(
        {
          actionType: "reset_all_settings",
          currentAppInstallationId,
        },
        { method: "post" }
      );
      prevIsFreeRef.current = true;
    } else if (!billing?.isFree) {
      prevIsFreeRef.current = false;
    }
  }, [billing?.isFree, currentAppInstallationId, fetcher]);

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Dashboard</s-link>
        <s-link href="/app/currency">Currency</s-link>
        <s-link href="/app/manage-plan">Manage Plan</s-link>
        <s-link href="/app/settings">Settings</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
