"use client";

import { OtherPreference } from "@/app/(protected)/hotel/[id]/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OtherPreferencesProps {
  preferences: OtherPreference[];
  selectedPreferences: number[];
  onPreferenceChange: (preferenceId: number, checked: boolean) => void;
}

export function OtherPreferences({
  preferences,
  selectedPreferences,
  onPreferenceChange,
}: OtherPreferencesProps) {
  if (!preferences || preferences.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 sm:mt-6 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">
        Other Preferences
      </h3>
      <div className="space-y-2">
        {preferences.map((preference) => (
          <div key={preference.id} className="flex items-center space-x-2">
            <Checkbox
              id={`preference-${preference.id}`}
              checked={selectedPreferences.includes(preference.id)}
              onCheckedChange={(checked) =>
                onPreferenceChange(preference.id, checked === true)
              }
            />
            <Label
              htmlFor={`preference-${preference.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {preference.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

