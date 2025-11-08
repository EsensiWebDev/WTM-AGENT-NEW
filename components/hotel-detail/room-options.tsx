"use client";

import { PriceOption, Promo } from "@/app/(protected)/hotel/[id]/types";

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
  // Determine which price to display based on promo
  const getCurrentPrice = () => {
    if (!promo) return option.price;

    if (isWithBreakfast) {
      return promo.price_with_breakfast ?? option.price;
    }
    return promo.price_without_breakfast ?? option.price;
  };

  const currentPrice = getCurrentPrice();
  const showOriginalPrice =
    promo &&
    ((isWithBreakfast && promo.price_with_breakfast !== option.price) ||
      (!isWithBreakfast && promo.price_without_breakfast !== option.price));

  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={onChange}
    >
      <div className="flex items-center space-x-3">
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
            className="cursor-pointer font-medium text-gray-900"
          >
            {label}
          </label>
          {!!option.pax && (
            <p className="text-sm text-gray-600">for {option.pax} pax</p>
          )}
        </div>
      </div>

      <div className="text-right">
        {showOriginalPrice && (
          <p className="text-sm text-gray-500 line-through">
            <span>Rp {option.price.toLocaleString("id-ID")}</span>
          </p>
        )}
        <p className="text-lg font-semibold text-gray-900">
          <span>Rp {currentPrice.toLocaleString("id-ID")}</span>
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
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Room Options</h3>
      <div className="space-y-4">
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
