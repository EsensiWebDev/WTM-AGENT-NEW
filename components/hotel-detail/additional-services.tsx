"use client";

import { AdditionalService } from "@/app/(protected)/hotel/[id]/types";
import { Checkbox } from "@/components/ui/checkbox";

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
  return (
    <div className="mt-4 sm:mt-6">
      <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">
        Additional Services
      </h4>
      <div className="space-y-2 sm:space-y-3">
        {additionals.map((service) => {
          const serviceId = String(service.id);
          const isSelected = selectedAdditionals.includes(serviceId);
          
          // Backward compatibility: default to "price" if category is missing
          const category = service.category || "price";
          
          // Determine if service is required (backward compatibility: default to false)
          const isRequired = service.is_required ?? false;

          return (
            <div
              key={serviceId}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <Checkbox
                id={serviceId}
                checked={isSelected || isRequired}
                disabled={isRequired}
                onCheckedChange={(checked) =>
                  onAdditionalChange(serviceId, Boolean(checked))
                }
              />
              <label
                htmlFor={serviceId}
                className="text-xs font-medium text-gray-900 sm:text-sm"
              >
                {service.name}
                {isRequired && (
                  <span className="ml-1 text-xs text-red-500">*</span>
                )}
              </label>
              {category === "price" && service.price !== undefined && service.price > 0 && (
                <span className="text-xs text-gray-600 sm:text-sm">
                  Rp {service.price.toLocaleString("id-ID")}
                </span>
              )}
              {category === "pax" && service.pax !== undefined && service.pax > 0 && (
                <span className="text-xs text-gray-600 sm:text-sm">
                  {service.pax} {service.pax === 1 ? "person" : "people"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
