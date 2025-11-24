"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationOption {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

interface NotificationSectionProps {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  options?: NotificationOption[];
  showAllCheckbox?: boolean;
  allChecked?: boolean;
  onAllCheckedChange?: (checked: boolean) => void;
}

const NotificationSection = ({
  title,
  enabled,
  onEnabledChange,
  options = [],
  showAllCheckbox = false,
  allChecked = false,
  onAllCheckedChange,
}: NotificationSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-3">
          <Badge
            variant={enabled ? "default" : "secondary"}
            className={
              enabled
                ? "bg-green-200 text-green-800 hover:bg-green-200"
                : "bg-gray-200 text-gray-600 hover:bg-gray-200"
            }
          >
            {enabled ? "Active" : "Non-Active"}
          </Badge>
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      {options.length > 0 && (
        <div className="space-y-3 pl-2">
          {/* All Checkbox (optional) */}
          {showAllCheckbox && onAllCheckedChange && (
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`all-${title.toLowerCase().replace(/\s+/g, "-")}`}
                checked={allChecked}
                onCheckedChange={onAllCheckedChange}
                disabled={!enabled}
              />
              <Label
                htmlFor={`all-${title.toLowerCase().replace(/\s+/g, "-")}`}
                className="cursor-pointer text-base font-normal"
              >
                All
              </Label>
            </div>
          )}

          {/* Individual Options */}
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <Checkbox
                id={option.id}
                checked={option.checked}
                onCheckedChange={option.onCheckedChange}
                disabled={!enabled}
              />
              <Label
                htmlFor={option.id}
                className="cursor-pointer text-base font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationSection;
