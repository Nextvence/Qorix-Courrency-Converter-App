export default function CustomGridSection({
  heading,
  description,
  children,
  badge,
  isFreePlan,
}) {
  return (
    <s-stack padding="large">
      <s-query-container>
        <s-grid
          gridTemplateColumns="@container (inline-size < 590px) 1fr, 5fr 7fr"
          gap="base"
        >
          <s-grid-item>
            <div style={{ display: "grid", gap: "5px" }}>
              <s-stack direction="inline" gap="small">
                <s-heading>{heading} </s-heading>
                {isFreePlan && heading == "Active currencies" && (
                  <s-badge tone="caution">
                    {" "}
                    Full access to Standard & Pro Plan
                  </s-badge>
                )}
                {isFreePlan &&
                  (heading == "Flag style" || heading == "App behavior") && (
                    <s-badge tone="caution">
                      {" "}
                      Full access to Standard & Pro Plan
                    </s-badge>
                  )}
                {badge?.tone && (
                  <s-badge tone={badge?.tone}>{badge?.text}</s-badge>
                )}
              </s-stack>
              <s-paragraph color="subdued">{description}</s-paragraph>
            </div>
          </s-grid-item>
          <s-grid-item>{children}</s-grid-item>
        </s-grid>
      </s-query-container>
    </s-stack>
  );
}
