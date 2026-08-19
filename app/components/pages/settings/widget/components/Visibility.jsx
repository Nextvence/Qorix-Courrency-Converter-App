import { useState } from "react";

export default function Visibility({ data, handleChange }) {
    const visibility = data?.widgetSettings?.visibility || { enableOnDesktop: true, enableOnMobile: true };
    const enableOnDesktop = visibility.enableOnDesktop !== false;
    const enableOnMobile = visibility.enableOnMobile !== false;

    const handleEnableOnDesktop = () => {
        const updated = !enableOnDesktop;
        handleChange({
            target: "widget",
            subTarget: "visibility",
            value: {
                ...visibility,
                enableOnDesktop: updated
            }
        });
    };
    const handleEnableOnMobile = () => {
        const updated = !enableOnMobile;
        handleChange({
            target: "widget",
            subTarget: "visibility",
            value: {
                ...visibility,
                enableOnMobile: updated
            }
        });
    };
    return (
        <div style={{ display: "grid", gap: "7px" }}>
            <div style={{ display: "grid", gap: "3px" }}>
                <s-heading>Visibility</s-heading>
                <s-paragraph color="subdued">
                    You can control the visibility of the widget on different devices.
                </s-paragraph>
            </div>
            <div style={{ display: "grid", gap: "5px" }}>
                <s-switch
                    label="Show on desktop"
                    details=""
                    checked={enableOnDesktop}
                    onChange={handleEnableOnDesktop}
                />
                <s-switch
                    label="Show on mobile"
                    details=""
                    checked={enableOnMobile}
                    onChange={handleEnableOnMobile}
                />
            </div>
        </div>
    )
}