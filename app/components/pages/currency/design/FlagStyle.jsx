import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";
import { useEffect, useState } from "react";
import FlagStyles from "../../../essentials/elements/FlagStyles";
import flagStyleOptions from "../../../../assets/data/flag_style_options.json";
import paidPlan from "../../../essentials/paidPlan";
import { useRouteLoaderData } from "react-router";

export default function FlagStyle({ handleChange, data }) {
  const { flagStyle } = data.designSettings;
  const { billing } = useRouteLoaderData("routes/app");
  console.log("billing to golobal function", billing);
  const [selectedFlagStyle, setSelectedFlagStyle] = useState(flagStyle);

  useEffect(() => {
    if (billing?.isFree && selectedFlagStyle === "3d_flag") {
      setSelectedFlagStyle("2d_flag");
      handleChange({
        target: "design",
        subTarget: "flagStyle",
        value: "2d_flag",
      });
    }
  }, [billing?.isFree, selectedFlagStyle, handleChange]);

  const handleFlagStyleChange = (e) => {
    setSelectedFlagStyle(e.value);
    handleChange({
      target: "design",
      subTarget: "flagStyle",
      value: e.value,
    });
  };

  console.log("Selected flag style:", flagStyle);
  return (
    <CustomGridSection
      heading="Flag style"
      description="Visual style of country flags shown in the widget"
      isFreePlan={billing?.isFree}
    >
      <CustomSection>
        <div style={{ position: "relative" }}>
          <s-grid gridTemplateColumns="repeat(3, 80px)" gap="base">
            {flagStyleOptions?.map((option) => (
              <s-clickable
                borderRadius="base"
                overflow="hidden"
                disabled={option.value === "3d_flag" && billing?.isFree}
                key={option.value}
                onClick={() => handleFlagStyleChange(option)}
              >
                <div
                  className={`
                                    flag-style-option

                                    ${selectedFlagStyle === option.value ? "selected" : ""}
                                `}
                >
                  <FlagStyles style={option.value} />
                  <s-text>
                    {option.label}
                    {billing?.isFree &&
                      option.value === "3d_flag" &&
                      paidPlan(true)}
                    {/* {option.value === "3d_flag" &&   paidPlan()} */}
                  </s-text>
                </div>
              </s-clickable>
            ))}
          </s-grid>
        </div>
        <style>
          {`
                        .flag-style-option{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 10px;
                            flex-direction: column;
                            gap: 5px;
                            background-color: transparent;
                            width: calc(100% - 22px);
                            height: calc(100% - 22px);
                            transition: all 0.3s ease;
                            border: 1px solid #ddddddff;
                            border-radius: 9px;
                        }
                        .flag-style-option.selected{
                            background-color: #CDFED4;
                        }
                    `}
        </style>
      </CustomSection>
    </CustomGridSection>
  );
}
