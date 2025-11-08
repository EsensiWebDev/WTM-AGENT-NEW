"use client";

import { Promo } from "@/app/(protected)/hotel/[id]/types";

interface PromoOptionProps {
  promo: Promo | null;
  isSelected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}

function PromoOption({
  promo,
  isSelected,
  onClick,
  label,
  description,
}: PromoOptionProps) {
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center rounded-lg border p-3 text-left transition-colors ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
          {isSelected && (
            <div className="bg-primary h-3 w-3 rounded-full"></div>
          )}
        </div>
        <div className="ml-3">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
      </button>
    </div>
  );
}

interface PromoSelectionProps {
  promos: Promo[];
  selectedPromo: string | null;
  onPromoChange: (promoId: string | null) => void;
}

export function PromoSelection({
  promos,
  selectedPromo,
  onPromoChange,
}: PromoSelectionProps) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Apply Promo Code
      </h4>
      <div className="space-y-2">
        {/* No Promo Option */}
        <PromoOption
          promo={null}
          isSelected={selectedPromo === null}
          onClick={() => onPromoChange(null)}
          label="No Promo"
        />

        {/* Promo Options */}
        {promos.map((promo) => (
          <PromoOption
            key={String(promo.promo_id)}
            promo={promo}
            isSelected={selectedPromo === String(promo.promo_id)}
            onClick={() => onPromoChange(String(promo.promo_id))}
            label={promo.code_promo}
            description={promo.description}
          />
        ))}
      </div>
    </div>
  );
}
