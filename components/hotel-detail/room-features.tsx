"use client";

import { getIcon } from "@/lib/utils";

export function RoomFeatures({
  features,
}: {
  features: {
    icon: string;
    text: string;
  }[];
}) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            {getIcon(feature.icon)}
            <span className="text-sm font-semibold text-gray-600 capitalize">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
