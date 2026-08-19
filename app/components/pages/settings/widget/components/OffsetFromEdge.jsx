import { useState } from "react";
import CustomSection from "../../../../essentials/CustomSection";
import CustomRange from "../elements/CustomRange";

export default function OffsetFromEdge({ data, handleChange }) {
    const offsetFromEdge = data?.widgetSettings?.offsetFromEdge || { horizontal: 20, vertical: 20 };
    const horizontal = offsetFromEdge.horizontal ?? 20;
    const vertical = offsetFromEdge.vertical ?? 20;

    const handleHorizontal = (event) => {
        handleChange({
            target: "widget",
            subTarget: "offsetFromEdge",
            value: {
                horizontal: event,
                vertical: vertical
            }
        });
    };
    const handleVertical = (event) => {
        handleChange({
            target: "widget",
            subTarget: "offsetFromEdge",
            value: {
                horizontal: horizontal,
                vertical: event
            }
        });
    };
    return (
        <s-stack gap="small">
            <s-heading>Offset from edge</s-heading>
            <s-stack gap="base">
                <CustomSection>
                    <CustomRange
                        label="Horizontal"
                        max={200}
                        defaultValue={horizontal}
                        onChange={handleHorizontal}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomRange
                        label="Vertical"
                        max={200}
                        defaultValue={vertical}
                        onChange={handleVertical}
                    />
                </CustomSection>
            </s-stack>
        </s-stack>
    )
}