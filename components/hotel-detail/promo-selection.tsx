"use client";

import { Promo } from "@/app/(protected)/hotel/[id]/types";

export function PromoSelection({
  promos,
  selectedPromo,
  onPromoChange,
}: {
  promos: Promo[];
  selectedPromo: string | null;
  onPromoChange: (promoId: string | null) => void;
}) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Apply Promo Code
      </h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onPromoChange(null)}
            className={`flex w-full items-center rounded-lg border p-3 text-left transition-colors ${
              selectedPromo === null
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
              {selectedPromo === null && (
                <div className="bg-primary h-3 w-3 rounded-full"></div>
              )}
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              No Promo
            </span>
          </button>
        </div>

        {promos.map((promo) => (
          <div
            key={String(promo.promo_id)}
            className="flex items-center space-x-3"
          >
            <button
              type="button"
              onClick={() => onPromoChange(String(promo.promo_id))}
              className={`flex flex-1 items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                selectedPromo === String(promo.promo_id)
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                  {selectedPromo === String(promo.promo_id) && (
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                  )}
                </div>
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    {promo.code_promo}
                  </span>
                  <p className="text-xs text-gray-600">{promo.description}</p>
                </div>
              </div>
              {/* <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                {promo.discount}% off
              </span> */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
