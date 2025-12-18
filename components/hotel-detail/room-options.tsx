"use client";

import { PriceOption, Promo } from "@/app/(protected)/hotel/[id]/types";
import { formatCurrency } from "@/lib/format";
import { useAgentCurrency } from "@/hooks/use-agent-currency";
import { getPriceForCurrency } from "@/lib/price-utils";
import { useSearchParams } from "next/navigation";

interface RoomOptionItemProps {
  option: PriceOption;
  isSelected: boolean;
  onChange: () => void;
  radioGroupName: string;
  label: string;
  promo?: Promo;
  isWithBreakfast?: boolean;
}

function RoomOptionItem({
  option,
  isSelected,
  onChange,
  radioGroupName,
  label,
  promo,
  isWithBreakfast = false,
}: RoomOptionItemProps) {
  const searchParams = useSearchParams();
  const agentCurrency = useAgentCurrency();
  const selectedCurrency = searchParams.get("currency") || agentCurrency;

  // Determine base price from multi-currency map when available
  const getBasePriceForCurrency = () => {
    return getPriceForCurrency(option.prices, option.price, selectedCurrency);
  };

  // Determine which price to display based on promo
  const getCurrentPrice = () => {
    if (!promo) return getBasePriceForCurrency();

    // For fixed price promos, use the multi-currency prices from detail
    if (promo.promo_type_id === 2 && promo.detail?.prices) {
      const promoPrice = getPriceForCurrency(
        promo.detail.prices,
        promo.detail.fixed_price || 0,
        selectedCurrency
      );
      if (promoPrice > 0) {
        return promoPrice;
      }
    }

    // For discount promos, calculate from base price
    if (promo.promo_type_id === 1 && promo.detail?.discount_percentage) {
      const basePrice = getBasePriceForCurrency();
      return (100 - promo.detail.discount_percentage) / 100 * basePrice;
    }

    // Fallback to backend-calculated prices (for backward compatibility)
    if (isWithBreakfast) {
      return promo.price_with_breakfast ?? getBasePriceForCurrency();
    }
    return promo.price_without_breakfast ?? getBasePriceForCurrency();
  };

  const currentPrice = getCurrentPrice();
  const showOriginalPrice =
    promo &&
    ((isWithBreakfast && promo.price_with_breakfast !== option.price) ||
      (!isWithBreakfast && promo.price_without_breakfast !== option.price));

  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 sm:p-4 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={onChange}
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <input
          type="radio"
          id={`option-${radioGroupName}-${option.id}`}
          name={radioGroupName}
          checked={isSelected}
          onChange={onChange}
          className="accent-primary h-4 w-4 cursor-pointer text-slate-800 focus:ring-slate-500"
        />
        <div className="cursor-pointer">
          <label
            htmlFor={`option-${radioGroupName}-${option.id}`}
            className="cursor-pointer text-sm font-medium text-gray-900 sm:text-base"
          >
            {label}
          </label>
          {!!option.pax && (
            <p className="text-xs text-gray-600 sm:text-sm">
              for {option.pax} pax
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        {showOriginalPrice && (
          <p className="text-xs text-gray-500 line-through sm:text-sm">
            <span>
              {formatCurrency(getBasePriceForCurrency(), selectedCurrency)}
            </span>
          </p>
        )}
        <p className="text-base font-semibold text-gray-900 sm:text-lg">
          <span>{formatCurrency(currentPrice, selectedCurrency)}</span>
        </p>
      </div>
    </div>
  );
}

interface RoomOptionsProps {
  with_breakfast: PriceOption;
  without_breakfast: PriceOption;
  selectedOption: number;
  onOptionChange: (index: number) => void;
  radioGroupName: string;
  promo?: Promo;
}

export function RoomOptions({
  with_breakfast,
  without_breakfast,
  selectedOption,
  onOptionChange,
  radioGroupName,
  promo,
}: RoomOptionsProps) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
        Room Options
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {without_breakfast && without_breakfast.is_show && (
          <RoomOptionItem
            option={without_breakfast}
            isSelected={selectedOption === without_breakfast.id}
            onChange={() => onOptionChange(without_breakfast.id)}
            radioGroupName={radioGroupName}
            label="Without Breakfast"
            promo={promo}
          />
        )}
        {with_breakfast && with_breakfast.is_show && (
          <RoomOptionItem
            option={with_breakfast}
            isSelected={selectedOption === with_breakfast.id}
            onChange={() => onOptionChange(with_breakfast.id)}
            radioGroupName={radioGroupName}
            label="With Breakfast"
            promo={promo}
            isWithBreakfast
          />
        )}
      </div>
    </div>
  );
}
