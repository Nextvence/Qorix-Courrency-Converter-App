import { useEffect, useState } from "react";
import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";
import { useRouteLoaderData } from "react-router";

export default function ActiveCurrencies({ data, handleChange }) {
  const { generalSettings, currencies } = data;
  const [isAddCurrencyPopoverOpen, setIsAddCurrencyPopoverOpen] =
    useState(false);

  const [activeCurrencies, setActiveCurrencies] = useState(
    generalSettings.activeCurrencies,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { billing } = useRouteLoaderData("routes/app");
  const isFreePlan = billing?.isFree;
  
  // Default currency for free plan
  const DEFAULT_CURRENCY = "usd";
  const MAX_FREE_PLAN_CURRENCIES = 4; // 1 default + 3 additional

  // handling open search modal & input start
  const handleAddCurrencyInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  // handling open search modal & input end

  // handling add currency start
  const handleAddCurrency = (currency) => {
    // Free plan - enforce maximum 4 currencies (1 default + 3 additional)
    if (isFreePlan && activeCurrencies.length >= MAX_FREE_PLAN_CURRENCIES) {
      return;
    }

    const newCurrencies = [...activeCurrencies, currency];
    setActiveCurrencies(newCurrencies);
    handleChange({
      target: "general",
      subTarget: "activeCurrencies",
      value: newCurrencies,
    });
  };
  // handling add currency end

  // handling remove currency start
  const handleRemoveCurrency = (currency) => {
    // Prevent removing the last currency entirely
    if (activeCurrencies.length <= 1) {
      return;
    }

    const updated = activeCurrencies.filter((item) => item !== currency);
    setActiveCurrencies(updated);
    handleChange({
      target: "general",
      subTarget: "activeCurrencies",
      value: updated,
    });
  };
  // Auto-adjust currencies when switching to free plan
  useEffect(() => {
    if (isFreePlan && activeCurrencies.length > MAX_FREE_PLAN_CURRENCIES) {
      // Keep only the first 4 currencies in the order selected
      const adjusted = activeCurrencies.slice(0, MAX_FREE_PLAN_CURRENCIES);
      
      setActiveCurrencies(adjusted);
      handleChange({
        target: "general",
        subTarget: "activeCurrencies",
        value: adjusted,
      });
    }
  }, [isFreePlan]);

  useEffect(() => {
    const body = document.querySelector("body");
    const handleClickOutside = (event) => {
      const popover = document.getElementById("add-currency-popover");
      const searchField = document.querySelector("s-search-field");
      if (searchField && searchField.contains(event.target)) {
        return;
      }
      if (popover && !popover.contains(event.target)) {
        setIsAddCurrencyPopoverOpen(false);
      }
    };
    body.addEventListener("click", handleClickOutside);
    return () => {
      body.removeEventListener("click", handleClickOutside);
    };
  }, []);
  // handling remove currency end

  const handleSelectAllCurrencies = () => {
    // Free plan-Only default selected currencies will be allowed, so select all option will not work and show all currencies as disabled
    if (isFreePlan) return;

    if (activeCurrencies.length === Object.keys(currencies).length) {
      setActiveCurrencies([]);
      handleChange({
        target: "general",
        subTarget: "activeCurrencies",
        value: [],
      });
    } else {
      setActiveCurrencies(Object.keys(currencies));
      handleChange({
        target: "general",
        subTarget: "activeCurrencies",
        value: Object.keys(currencies),
      });
    }
  };

  return (
    <CustomGridSection
      heading="Active currencies"
      description="Select the currencies your store should support. Base currency is always included."
    >
      <CustomSection>
        <div style={{ position: "relative" }}>
          <s-search-field
            placeholder="Add currency..."
            onInput={handleAddCurrencyInput}
            onFocus={() => setIsAddCurrencyPopoverOpen(true)}
            value={searchQuery}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 6px",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            {activeCurrencies.map((currency) => (
              <s-clickable-chip
                key={currency}
                color="strong"
                accessibilityLabel={`${currencies[currency].name} (${currencies[currency].code})`}
                removable
                tone="success"
                onRemove={() => handleRemoveCurrency(currency)}
              >
                {currencies[currency].name} ({currencies[currency].code})
                {isFreePlan && currency === DEFAULT_CURRENCY && " (Default)"}
              </s-clickable-chip>
            ))}
          </div>
          {isAddCurrencyPopoverOpen && (
            <div
              id="add-currency-popover"
              style={{
                position: "absolute",
                top: "40px",
                left: "0",
                width: "calc(100% - 32px)",
                backgroundColor: "white",
                border: "1px solid #d8d8d8ff",
                borderRadius: "10px",
                padding: "8px 15px",
                zIndex: "999",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "nowrap",
                }}
              >
                <span>
                  {isFreePlan
                    ? `Free Plan : 1 Default + ${activeCurrencies.length - 1} Additional (Max 4 Total) - ${activeCurrencies.length} Selected`
                    : `Select ${activeCurrencies.length} of ${Object.keys(currencies).length} currencies`}
                </span>
                {!isFreePlan && (
                  <s-checkbox
                    checked={
                      activeCurrencies.length === Object.keys(currencies).length
                    }
                    onChange={handleSelectAllCurrencies}
                    label="Select all"
                  />
                )}
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {Object.entries(currencies)
                  .filter(
                    ([key, value]) =>
                      value.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      value.code
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      (value.country &&
                        value.country
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())),
                  )
                  .map(([key, value]) => {
                    // Free plan-only restrictions
                    const isDefaultCurrency = key === DEFAULT_CURRENCY;
                    const isAlreadySelected = activeCurrencies.includes(key);
                    const canAddMore =
                      activeCurrencies.length < MAX_FREE_PLAN_CURRENCIES;
                    const isDisabled =
                      isFreePlan &&
                      !isAlreadySelected &&
                      !canAddMore;

                    return activeCurrencies.includes(key) ? (
                      <s-stack
                        key={key}
                        direction="inline"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingInlineEnd="small"
                      >
                        <s-checkbox
                          checked
                          label={value.name}
                          onChange={() => handleRemoveCurrency(key)}
                        />
                        <s-text>{value.code}</s-text>
                        {isFreePlan && isDefaultCurrency && (
                          <s-text tone="subdued" size="small">(Default)</s-text>
                        )}
                      </s-stack>
                    ) : (
                      <s-stack
                        key={key}
                        direction="inline"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingInlineEnd="small"
                        style={{
                          opacity: isDisabled ? 0.5 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                        }}
                      >
                        <s-checkbox
                          disabled={isDisabled}
                          label={value.name}
                          onChange={() => handleAddCurrency(key)}
                        />
                        <s-text>{value.code}</s-text>
                      </s-stack>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </CustomSection>
    </CustomGridSection>
  );
}
