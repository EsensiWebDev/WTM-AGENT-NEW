"use client";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BedTypeSelectionProps {
  bedTypes: string[];
  selectedBedType: string | null;
  onBedTypeChange: (bedType: string) => void;
}

export function BedTypeSelection({
  bedTypes,
  selectedBedType,
  onBedTypeChange,
}: BedTypeSelectionProps) {
  if (!bedTypes || bedTypes.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 sm:mt-6">
      <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">
        Bed Type
      </h4>
      <RadioGroup
        value={selectedBedType || ""}
        onValueChange={onBedTypeChange}
        className="space-y-2 sm:space-y-3"
      >
        {bedTypes.map((bedType) => (
          <div key={bedType} className="flex items-center space-x-2 sm:space-x-3">
            <RadioGroupItem value={bedType} id={`bed-type-${bedType}`} />
            <Label
              htmlFor={`bed-type-${bedType}`}
              className="text-xs font-medium text-gray-900 cursor-pointer sm:text-sm"
            >
              {bedType}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

