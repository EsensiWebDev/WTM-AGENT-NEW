"use client";

import { AdditionalService } from "@/app/(protected)/hotel/[id]/types";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format";
import { useAgentCurrency } from "@/hooks/use-agent-currency";
import { getPriceForCurrency } from "@/lib/price-utils";
import { useSearchParams } from "next/navigation";

interface AdditionalServicesProps {
  additionals: AdditionalService[];
  selectedAdditionals: string[];
  onAdditionalChange: (serviceId: string, checked: boolean) => void;
}

export function AdditionalServices({
  additionals,
  selectedAdditionals,
  onAdditionalChange,
}: AdditionalServicesProps) {
  const searchParams = useSearchParams();
  const agentCurrency = useAgentCurrency();
  const selectedCurrency = searchParams.get("currency") || agentCurrency;

  return (
    <div className="mt-4 sm:mt-6">
      <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">
        Additional Services
      </h4>
      <div className="space-y-2.5 sm:space-y-3">
        {additionals.map((service) => {
          const serviceId = String(service.id);
          const isSelected = selectedAdditionals.includes(serviceId);
          const isRequired = service.is_required === true;
          const category = service.category || "price";

          return (
            <div
              key={serviceId}
              className="flex items-center gap-3"
            >
              <Checkbox
                id={serviceId}
                checked={isSelected}
                disabled={isRequired}
                onCheckedChange={(checked) =>
                  onAdditionalChange(serviceId, Boolean(checked))
                }
                className="shrink-0 mt-0.5"
              />
              <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                <label
                  htmlFor={serviceId}
                  className={`text-xs font-medium sm:text-sm cursor-pointer ${
                    isRequired ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {service.name}
                  {isRequired && (
                    <span className="ml-1.5 text-xs text-gray-500">(Required)</span>
                  )}
                </label>
                {category === "price" && (service.price > 0 || service.prices) && (
                  <span className="shrink-0 text-xs font-medium text-gray-700 sm:text-sm whitespace-nowrap">
                    {formatCurrency(
                      getPriceForCurrency(service.prices, service.price, selectedCurrency),
                      selectedCurrency,
                    )}
                  </span>
                )}
                {category === "pax" && service.pax !== undefined && (
                  <span className="shrink-0 text-xs font-medium text-gray-700 sm:text-sm whitespace-nowrap">
                    {service.pax} Pax
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
