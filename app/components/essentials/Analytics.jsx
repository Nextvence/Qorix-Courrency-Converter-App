import { Text } from "@shopify/polaris";

export default function Analytics({ data, onToggleCurrencyStatus, isTogglingCurrencyStatus = false }) {
    const analytics = data?.analytics || {};
    const featureStatus = data?.featureStatus || {};
    const formattedSessions = new Intl.NumberFormat("en-US").format(analytics.sessionsThisWeek || 0);
    const formattedSwitches = new Intl.NumberFormat("en-US").format(analytics.currencySwitches || 0);
    const currentWeekSwitches = analytics.currencySwitchesThisWeek || 0;
    const previousWeekSwitches = analytics.currencySwitchesPreviousWeek || 0;

    let switchTrendLabel = "No switches yet";
    let switchTrendTone = "subdued";

    if (previousWeekSwitches > 0) {
        const percentageChange = Math.round(((currentWeekSwitches - previousWeekSwitches) / previousWeekSwitches) * 100);

        if (percentageChange > 0) {
            switchTrendLabel = `+ ${percentageChange}% vs last week`;
            switchTrendTone = "success";
        } else if (percentageChange < 0) {
            switchTrendLabel = `- ${Math.abs(percentageChange)}% vs last week`;
            switchTrendTone = "critical";
        } else {
            switchTrendLabel = "No change vs last week";
        }
    } else if (currentWeekSwitches > 0) {
        switchTrendLabel = `${currentWeekSwitches} switch${currentWeekSwitches > 1 ? "es" : ""} this week`;
        switchTrendTone = "success";
    }
    const isCurrencyEnabled = Boolean(featureStatus.enableCurrency);
    return (
        <s-stack paddingBlockEnd="base">
            <s-query-container>
                <s-grid gap="base" gridTemplateColumns="@container (inline-size > 500px) '1fr 1fr 1fr', '1fr'">
                    <s-grid-item style={{ height: "100%" }}>
                        <s-box style={{ height: "100%" }}>
                            <s-section style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <s-stack
                                    direction="inline"
                                    gap="small"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <s-heading>Sessions this week</s-heading>
                                    <s-icon type="eye-check-mark" />
                                </s-stack>
                                <Text as="h2">{formattedSessions}</Text>
                                <s-paragraph color="subdued">
                                    Data appears after visitors switch currency.
                                </s-paragraph>
                            </s-section>
                        </s-box>
                    </s-grid-item>

                    <s-grid-item style={{ height: "100%" }}>
                        <s-box style={{ height: "100%" }}>
                            <s-section style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <s-stack
                                    direction="inline"
                                    gap="small"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <s-heading>Currency switches</s-heading>
                                    <s-icon type="currency-convert" />
                                </s-stack>
                                <Text as="h2">{formattedSwitches}</Text>
                                <s-paragraph tone={switchTrendTone}>{switchTrendLabel}</s-paragraph>
                            </s-section>
                        </s-box>
                    </s-grid-item>

                    <s-grid-item style={{ height: "100%" }}>
                        <s-box style={{ height: "100%" }}>
                            <s-section style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <s-heading>Feature status</s-heading>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        width: "100%",
                                        paddingBlock: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "44px",
                                            height: "44px",
                                            backgroundColor: "#f1f2f3",
                                            borderRadius: "8px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <s-icon type="currency-convert" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#303030", lineHeight: "1.3" }}>
                                            Currency conversion
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#6d7175", marginTop: "3px", lineHeight: "1.3" }}>
                                            {featureStatus.activeCurrenciesCount || 0} currencies • {isCurrencyEnabled ? "Auto detect on" : "Auto detect off"}
                                        </div>
                                    </div>
                                    <div style={{ flexShrink: 0, marginLeft: "8px" }}>
                                        <s-switch
                                            checked={Boolean(featureStatus.enableCurrency)}
                                            disabled={isTogglingCurrencyStatus}
                                            onChange={onToggleCurrencyStatus}
                                        />
                                    </div>
                                </div>
                            </s-section>
                        </s-box>
                    </s-grid-item>
                </s-grid>
            </s-query-container>
        </s-stack>
    );
}
