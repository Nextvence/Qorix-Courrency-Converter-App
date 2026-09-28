import { useEffect } from "react";
import FlagStyles from "../../../../essentials/elements/FlagStyles";
import flagStyleOptions from "../../../../../assets/data/flag_style_options.json";
import paidPlan from "../../../../essentials/paidPlan";
import { useRouteLoaderData } from "react-router";

export default function FlagStyle({ data, handleChange }) {
  const flagStyle = data?.widgetSettings?.flagStyle || "2d_flag";
  const { billing } = useRouteLoaderData("routes/app") || {};

  useEffect(() => {
    if (billing?.isFree && flagStyle === "3d_flag") {
      handleChange({
        target: "widget",
        subTarget: "flagStyle",
        value: "2d_flag",
      });
    }
  }, [billing?.isFree, flagStyle, handleChange]);

  const handleFlagStyleChange = (option) => {
    if (option.value === "3d_flag" && billing?.isFree) return;
    handleChange({
      target: "widget",
      subTarget: "flagStyle",
      value: option.value,
    });
  };

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <div style={{ display: "grid", gap: "3px" }}>
        <s-heading>Flag style</s-heading>
        <s-paragraph color="subdued">
          Visual style of country flags shown in the widget
        </s-paragraph>
      </div>

      <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="small">
        {flagStyleOptions?.map((option) => (
          <s-clickable
            borderRadius="base"
            overflow="hidden"
            disabled={option.value === "3d_flag" && billing?.isFree}
            key={option.value}
            onClick={() => handleFlagStyleChange(option)}
          >
            <div
              className={`flag-style-option ${
                flagStyle === option.value ? "selected" : ""
              }`}
            >
              <FlagStyles style={option.value} />
              <s-text>
                {option.label}
                {billing?.isFree &&
                  option.value === "3d_flag" &&
                  paidPlan(true)}
              </s-text>
            </div>
          </s-clickable>
        ))}
      </s-grid>

      <style>
        {`
          .flag-style-option {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px 4px;
            flex-direction: column;
            gap: 5px;
            background-color: transparent;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.2s ease;
            border: 1px solid #d4d4d4;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
          }
          .flag-style-option.selected {
            background-color: #CDFED4;
            border-color: #008060;
          }
        `}
      </style>
    </div>
  );
}
