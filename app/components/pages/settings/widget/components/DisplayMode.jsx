import displayModeOptions from "../../../../../assets/data/display_mode_options.json";

export default function DisplayMode({ data, handleChange }) {
  const displayMode = data?.widgetSettings?.displayMode || "currency_code";

  const handleDisplayModeChange = (e) => {
    handleChange({
      target: "widget",
      subTarget: "displayMode",
      value: e.target.value,
    });
  };

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <div style={{ display: "grid", gap: "3px" }}>
        <s-heading>Display mode</s-heading>
        <s-paragraph color="subdued">
          Select whether to show currency code or full currency name.
        </s-paragraph>
      </div>
      <s-select value={displayMode} onChange={handleDisplayModeChange}>
        {displayModeOptions?.map((option) => (
          <s-option
            key={option.value}
            value={option.value}
            selected={displayMode === option.value}
          >
            {option.label}
          </s-option>
        ))}
      </s-select>
    </div>
  );
}
