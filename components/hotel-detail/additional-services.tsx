"use client";

import { AdditionalService } from "@/app/(protected)/hotel/[id]/types";
import { Checkbox } from "@/components/ui/checkbox";

export function AdditionalServices({
  additionals,
  selectedAdditionals,
  onAdditionalChange,
}: {
  additionals: AdditionalService[];
  selectedAdditionals: Record<string, boolean>;
  onAdditionalChange: (serviceId: string, checked: boolean) => void;
}) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Additional Services
      </h4>
      <div className="space-y-3">
        {additionals.map((service) => (
          <div key={String(service.id)} className="flex items-center space-x-3">
            <Checkbox
              id={String(service.id)}
              checked={selectedAdditionals[service.id] || false}
              onCheckedChange={(checked) =>
                onAdditionalChange(String(service.id), checked as boolean)
              }
            />
            <label
              htmlFor={String(service.id)}
              className="text-sm font-medium text-gray-900"
            >
              {service.name}
            </label>
            {service.price > 0 && (
              <span className="text-sm text-gray-600">
                Rp {service.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
