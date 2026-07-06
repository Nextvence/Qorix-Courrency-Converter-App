import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

// 1 star → very unhappy ... 5 star → very happy
const REACTIONS = ["😢", "🙁", "😐", "🙂", "😍"];

const WIGGLE = {
    initial: { rotate: 0, scale: 0.4, opacity: 0 },
    animate: {
        rotate: [0, -15, 15, -12, 12, -6, 6, 0],
        scale: 1,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: { scale: 0.4, opacity: 0, transition: { duration: 0.15 } },
};

export default function ReviewWidget({ appName = "our app", onDismiss, onSubmitRating }) {
    const statusFetcher = useFetcher(); // checks whether shop already reviewed
    const submitFetcher = useFetcher(); // saves the review status

    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    // On mount, ask the server: has this shop already reviewed?
    useEffect(() => {
        statusFetcher.load("/api/review-status");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stillChecking = statusFetcher.state === "loading" || statusFetcher.data === undefined;
    const alreadyReviewed = statusFetcher.data?.reviewed === true;

    const activeRating = hovered || selected;
    const activeReaction = activeRating ? REACTIONS[activeRating - 1] : null;

    // Don't flash the widget while we're still checking, and never show it
    // again once this shop has already reviewed, or if the user dismissed it.
    if (dismissed || stillChecking || alreadyReviewed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    const handleSelect = async (rating) => {
        setSelected(rating);
        onSubmitRating?.(rating);

        // Save reviewed = true + rating + shop (shop is resolved server-side
        // from the authenticated session, so we don't need to pass it here).
        submitFetcher.submit({ rating: String(rating) }, { method: "post", action: "/api/review-status" });

        // Only trigger Shopify's native review modal for high ratings.
        // Shopify's guidelines require you to ask for a rating before
        // opening the review prompt, so gate this behind your own UI.
        if (rating >= 4 && typeof shopify !== "undefined") {
            try {
                const result = await shopify.reviews.request();
                if (!result.success) {
                    console.log(`Review modal not displayed. Reason: ${result.code}: ${result.message}`);
                }
            } catch (error) {
                console.error("Error requesting review:", error);
            }
        }
    };

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                background: "#fff",
                border: "1px solid #E3E3E3",
                borderRadius: "12px",
                padding: "16px 20px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                fontFamily: "inherit",
            }}
        >
            {/* Left: icon + text + stars */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                    style={{
                        flexShrink: 0,
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#FFF4D6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                    }}
                >
                    ⭐
                </div>

                <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#1A1A1A" }}>
                        Enjoying using {appName}?
                    </div>
                    <div style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "2px" }}>
                        Your success is our mission. A quick rating helps other merchants find us and fuels our development.
                    </div>

                    <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => handleSelect(star)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    fontSize: "25px",
                                    lineHeight: 1,
                                    color: star <= (hovered || selected) ? "#FFB800" : "#D0D0D0",
                                    transition: "color 0.15s ease",
                                }}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: animated reaction emoji */}
            <div
                style={{
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <AnimatePresence mode="wait">
                    {activeReaction && (
                        <motion.span
                            key={activeReaction}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={WIGGLE}
                            style={{ fontSize: "36px", display: "inline-block" }}
                        >
                            {activeReaction}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Close button */}
            <button
                type="button"
                aria-label="Dismiss"
                onClick={handleDismiss}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#8C8C8C",
                }}
            >
                ×
            </button>
        </div>
    );
}
