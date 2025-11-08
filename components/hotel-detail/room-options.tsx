"use client";

import { PriceOption, Promo } from "@/app/(protected)/hotel/[id]/types";

export function RoomOptions({
  with_breakfast,
  without_breakfast,
  selectedOption,
  onOptionChange,
  radioGroupName,
  promo,
}: {
  with_breakfast: PriceOption;
  without_breakfast: PriceOption;
  selectedOption: number;
  onOptionChange: (index: number) => void;
  radioGroupName: string;
  promo?: Promo;
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Room Options</h3>
      <div className="space-y-4">
        {without_breakfast && with_breakfast.is_show && (
          <div
            key={without_breakfast.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
              selectedOption === without_breakfast.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onOptionChange(without_breakfast.id)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${radioGroupName}-${without_breakfast.id}`}
                name={radioGroupName}
                checked={selectedOption === without_breakfast.id}
                onChange={() => onOptionChange(without_breakfast.id)}
                className="accent-primary h-4 w-4 cursor-pointer text-slate-800 focus:ring-slate-500"
              />
              <div className="cursor-pointer">
                <label
                  htmlFor={`option-${radioGroupName}-${without_breakfast.id}`}
                  className="cursor-pointer font-medium text-gray-900"
                >
                  Without Breakfast
                </label>
                {!!without_breakfast.pax && (
                  <p className="text-sm text-gray-600">
                    for {without_breakfast.pax} pax
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              {without_breakfast.price && promo && (
                <p className="text-sm text-gray-500 line-through">
                  {promo.price_without_breakfast !==
                    without_breakfast.price && (
                    <span>
                      Rp {without_breakfast.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900">
                {promo && (
                  <span>
                    Rp {promo.price_without_breakfast.toLocaleString("id-ID")}
                  </span>
                )}
                {!promo && (
                  <span>
                    Rp {without_breakfast.price.toLocaleString("id-ID")}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
        {with_breakfast && with_breakfast.is_show && (
          <div
            key={with_breakfast.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
              selectedOption === with_breakfast.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onOptionChange(with_breakfast.id)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${radioGroupName}-${with_breakfast.id}`}
                name={radioGroupName}
                checked={selectedOption === with_breakfast.id}
                onChange={() => onOptionChange(with_breakfast.id)}
                className="accent-primary h-4 w-4 cursor-pointer text-slate-800 focus:ring-slate-500"
              />
              <div className="cursor-pointer">
                <label
                  htmlFor={`option-${radioGroupName}-${with_breakfast.id}`}
                  className="cursor-pointer font-medium text-gray-900"
                >
                  With Breakfast
                </label>
                {!!with_breakfast.pax && (
                  <p className="text-sm text-gray-600">
                    for {with_breakfast.pax} pax
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              {with_breakfast.price && promo && (
                <p className="text-sm text-gray-500 line-through">
                  {promo.price_with_breakfast !== with_breakfast.price && (
                    <span>
                      Rp {with_breakfast.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900">
                {promo && (
                  <span>
                    Rp{" "}
                    {promo.price_with_breakfast?.toLocaleString("id-ID") ||
                      with_breakfast.price.toLocaleString("id-ID")}
                  </span>
                )}
                {!promo && (
                  <span>Rp {with_breakfast.price.toLocaleString("id-ID")}</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
