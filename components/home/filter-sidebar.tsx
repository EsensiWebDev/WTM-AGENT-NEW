"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { Slider } from "../ui/slider";
import { CheckedState } from "@radix-ui/react-checkbox";

const DISTRICT_OPTIONS = [
  { id: "jakarta", name: "Jakarta" },
  { id: "bekasi", name: "Bekasi" },
  { id: "depok", name: "Depok" },
  { id: "bogor", name: "Bogor" },
  { id: "denpasar", name: "Denpasar" },
  { id: "surabaya", name: "Surabaya" },
  { id: "bali", name: "Bali" },
  { id: "bandung", name: "Bandung" },
  { id: "semarang", name: "Semarang" },
  { id: "makassar", name: "Makassar" },
  { id: "palembang", name: "Palembang" },
  { id: "medan", name: "Medan" },
];

function DistrictCard() {
  const [showAll, setShowAll] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useQueryState(
    "districts",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false })
  );

  const handleDistrictChange = (districtId: string) => {
    const currentDistricts = selectedDistricts || [];
    const newDistricts = currentDistricts.includes(districtId)
      ? currentDistricts.filter((id) => id !== districtId)
      : [...currentDistricts, districtId];
    setSelectedDistricts(newDistricts);
  };

  const displayedDistricts = showAll
    ? DISTRICT_OPTIONS
    : DISTRICT_OPTIONS.slice(0, 6);

  return (
    <Card className={"gap-0 p-4"}>
      <h3 className="mb-4 font-medium">District</h3>
      <div className="grid grid-cols-3 gap-2">
        {displayedDistricts.map((d) => (
          <div
            key={d.id}
            className={cn(
              "border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
              selectedDistricts?.includes(d.id) &&
                "bg-accent text-accent-foreground"
            )}
          >
            <Checkbox
              id={d.id}
              checked={selectedDistricts?.includes(d.id)}
              onCheckedChange={() => handleDistrictChange(d.id)}
              className="sr-only"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    htmlFor={d.id}
                    className="max-w-full cursor-pointer truncate text-center text-xs"
                  >
                    {d.name}
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{d.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      {DISTRICT_OPTIONS.length > 6 && (
        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              View Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              View More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </Card>
  );
}

function PriceRangeCard() {
  const [{ minPrice, maxPrice }, setPrices] = useQueryStates({
    minPrice: parseAsInteger.withDefault(0).withOptions({ shallow: false }),
    maxPrice: parseAsInteger
      .withDefault(5_000_000)
      .withOptions({ shallow: false }),
  });

  return (
    <Card className={"gap-0 p-4"}>
      <h3 className="mb-4 font-medium">Price</h3>
      <Slider
        defaultValue={[minPrice, maxPrice]}
        max={15000000}
        min={0}
        step={100000}
        className={"py-2"}
        onValueChange={async (e) => {
          await setPrices({
            minPrice: e[0],
            maxPrice: e[1],
          });
        }}
      />
      <div className="mt-2 flex items-center justify-between text-sm">
        <span>{formatCurrency(minPrice, "IDR")}</span>
        <span>{formatCurrency(maxPrice, "IDR")}</span>
      </div>
    </Card>
  );
}

function StarRatingCard() {
  const [star, setStar] = useQueryState(
    "star",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false })
  );

  return (
    <Card className={"gap-0 p-4"}>
      <h3 className="mb-4 font-medium">Hotel Classification</h3>
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = (i + 1).toString();
          return (
            <label key={starValue} className="flex items-center gap-2">
              <Checkbox
                checked={star.includes(starValue)}
                onCheckedChange={(checked: CheckedState) => {
                  return checked
                    ? setStar([...star, starValue])
                    : setStar(star.filter((value) => value !== starValue));
                }}
              />
              <span>
                {"★".repeat(Number(starValue))} {starValue} -Star (
                {123 - Number(starValue)})
              </span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}

const BEDTYPES = [
  {
    id: "king",
    label: "King Size Bed",
  },
  {
    id: "queen",
    label: "Queen Size Bed",
  },
  {
    id: "twin",
    label: "Twin Bed",
  },
  {
    id: "bunk",
    label: "Bunk Bed",
  },
];

export function BedTypeCard() {
  const [bedType, setBedType] = useQueryState(
    "bedType",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false })
  );

  return (
    <Card className="gap-0 p-4">
      <h3 className="mb-4 font-medium">Bed Type</h3>
      <div className="space-y-2">
        {BEDTYPES.map((type) => (
          <label className="flex items-center gap-2" key={type.id}>
            <Checkbox
              id={type.id}
              checked={bedType.includes(type.id)}
              onCheckedChange={(checked) => {
                return checked
                  ? setBedType([...bedType, type.id])
                  : setBedType(bedType.filter((value) => value !== type.id));
              }}
            />
            <span>{type.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}

const FilterSidebar = () => {
  return (
    <aside className="space-y-6 md:space-y-6">
      <DistrictCard />
      <PriceRangeCard />
      {/* <Suspense
        key={`filter-sidebar-${urlParamsString}`}
        fallback={<Skeleton className="h-[192px] w-full rounded-xl" />}
      >
        <StarRatingCard promise={starRatingsPromise} />
      </Suspense> */}
      <StarRatingCard />

      <BedTypeCard />
    </aside>
  );
};

export default FilterSidebar;
