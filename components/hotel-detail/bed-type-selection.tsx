"use client";

import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BedTypeSelectionProps {
  bedTypes: string[];
  selectedBedType?: string;
  onSelect: (bedType: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function BedTypeSelection({
  bedTypes,
  selectedBedType,
  onSelect,
  required = false,
  disabled = false,
}: BedTypeSelectionProps) {
  // If no bed types available, don't render
  if (!bedTypes || bedTypes.length === 0) {
    return null;
  }

  // Auto-select if only one bed type and none selected
  useEffect(() => {
    if (bedTypes.length === 1 && !selectedBedType) {
      onSelect(bedTypes[0]);
    }
  }, [bedTypes, selectedBedType, onSelect]);

  // If only one bed type, optionally show it as selected but don't show radio buttons
  if (bedTypes.length === 1) {
    return (
      <div className="mt-4 sm:mt-6">
        <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">
          Bed Type
        </h4>
        <div className="text-xs text-gray-600 sm:text-sm">
          {bedTypes[0]}
        </div>
        <input
          type="hidden"
          name="bed_type"
          value={bedTypes[0]}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6">
      <Label className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-sm">
        Select Bed Type {required && <span className="text-red-500">*</span>}
      </Label>
      
      <RadioGroup
        value={selectedBedType || ""}
        onValueChange={onSelect}
        disabled={disabled}
        required={required}
        className="mt-2 space-y-3 sm:space-y-4"
      >
        {bedTypes.map((bedType, index) => {
          const isSelected = selectedBedType === bedType;
          return (
            <div
              key={index}
              className={`flex cursor-pointer items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-gray-50 sm:space-x-3 sm:p-4 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => !disabled && onSelect(bedType)}
            >
              <RadioGroupItem
                value={bedType}
                id={`bed-type-${index}`}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`bed-type-${index}`}
                className="flex-1 cursor-pointer text-xs font-medium text-gray-900 sm:text-sm"
              >
                {bedType}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

