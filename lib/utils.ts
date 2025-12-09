import { SearchParams } from "@/types";
import {
  IconArrowAutofitWidth,
  IconBed,
  IconFriends,
  IconSmoking,
  IconSmokingNo,
} from "@tabler/icons-react";
import { clsx, type ClassValue } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildQueryParams(searchParams: SearchParams): string {
  const queryParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryParams.append(key, item);
        });
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  return queryParams.toString();
}

export const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Square: IconArrowAutofitWidth,
  Users: IconFriends,
  Cigarette: IconSmoking,
  CigaretteOff: IconSmokingNo,
  Bed: IconBed,
};

export function getIcon(iconName: string) {
  const IconComponent = iconMap[iconName];
  return IconComponent
    ? React.createElement(IconComponent, { className: "h-4 w-4 text-gray-600" })
    : null;
}

export const isEmptyObject = (obj: Record<string, any>) =>
  JSON.stringify(obj) === "{}";
