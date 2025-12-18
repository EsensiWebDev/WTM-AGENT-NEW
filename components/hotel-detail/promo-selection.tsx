"use client";

import { Promo } from "@/app/(protected)/hotel/[id]/types";
import { useAgentCurrency } from "@/hooks/use-agent-currency";
import { formatCurrency } from "@/lib/format";
import { getPriceForCurrency } from "@/lib/price-utils";

interface PromoOptionProps {
  promo: Promo | null;
  isSelected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
  promoTypeName?: string;
  entitlement?: string;
}

function PromoOption({
  promo,
  isSelected,
  onClick,
  label,
  description,
  promoTypeName,
  entitlement,
}: PromoOptionProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center rounded-lg border p-2 text-left transition-colors sm:p-3 ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 sm:h-5 sm:w-5">
          {isSelected && (
            <div className="bg-primary h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"></div>
          )}
        </div>
        <div className="ml-2 flex-1 sm:ml-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-900 sm:text-sm">
              {label}
            </span>
            {promoTypeName && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">
                {promoTypeName}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-gray-600">{description}</p>
          )}
          {entitlement && (
            <p className="mt-1 text-xs font-medium text-green-700">
              {entitlement}
            </p>
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
  const agentCurrency = useAgentCurrency();

  const getPromoEntitlement = (promo: Promo): string | undefined => {
    if (!promo.detail) return undefined;

    const { detail } = promo;

    // Fixed Price promo type (ID: 2)
    if (promo.promo_type_id === 2) {
      if (detail.prices && Object.keys(detail.prices).length > 0) {
        const price = getPriceForCurrency(
          detail.prices,
          detail.fixed_price || 0,
          agentCurrency
        );
        if (price > 0) {
          return `Fixed price: ${formatCurrency(price, agentCurrency)}`;
        }
      } else if (detail.fixed_price && detail.fixed_price > 0) {
        return `Fixed price: ${formatCurrency(detail.fixed_price, agentCurrency)}`;
      }
    }

    // Discount promo type (ID: 1)
    if (promo.promo_type_id === 1 && detail.discount_percentage) {
      return `${detail.discount_percentage}% discount`;
    }

    // Room Upgrade promo type (ID: 3)
    if (promo.promo_type_id === 3 && detail.upgraded_to_id) {
      return "Room will be automatically upgraded";
    }

    // Benefit promo type (ID: 4)
    if (promo.promo_type_id === 4 && detail.benefit_note) {
      return detail.benefit_note;
    }

    return undefined;
  };

  return (
    <div className="mt-4 sm:mt-6">
      <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">
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
        {promos?.map((promo) => (
          <PromoOption
            key={String(promo.promo_id)}
            promo={promo}
            isSelected={selectedPromo === String(promo.promo_id)}
            onClick={() => onPromoChange(String(promo.promo_id))}
            label={promo.code_promo}
            description={promo.description}
            promoTypeName={promo.promo_type_name}
            entitlement={getPromoEntitlement(promo)}
          />
        ))}
      </div>
    </div>
  );
}
