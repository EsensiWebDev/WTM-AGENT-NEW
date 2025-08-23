"use client";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
      .withOptions({ shallow: false }),
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
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">District / City</h3>
      </CardHeader>
      <div className="grid grid-cols-3 gap-2 px-4">
        {displayedDistricts.map((d) => (
          <div
            key={d.id}
            className={cn(
              "border-input bg-primary ring-offset-priomary hover:bg-primary/90 focus-visible:ring-ring flex items-center justify-center rounded-md border px-3 py-2 text-sm text-white transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
              selectedDistricts?.includes(d.id) && "bg-primary text-white",
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
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Price</h3>
      </CardHeader>
      <div className="px-4">
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
      </div>
    </Card>
  );
}

function StarRatingCard() {
  const [star, setStar] = useQueryState(
    "star",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  return (
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Hotel Classification</h3>
      </CardHeader>
      <div className="space-y-2 px-4">
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
      .withOptions({ shallow: false }),
  );

  return (
    <Card className="gap-0 rounded p-0 pb-4">
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Hotel Classification</h3>
      </CardHeader>
      <div className="space-y-2 px-4">
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

function BedroomTypeCard() {
  const [bedRoomType, setBedRoomType] = useQueryState(
    "bedRoomType",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  return (
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Bedroom Type</h3>
      </CardHeader>
      <div className="space-y-2 px-4">
        {Array.from({ length: 3 }, (_, i) => {
          const bedValue = (i + 1).toString();
          return (
            <label key={bedValue} className="flex items-center gap-2">
              <Checkbox
                checked={bedRoomType.includes(bedValue)}
                onCheckedChange={(checked: CheckedState) => {
                  return checked
                    ? setBedRoomType([...bedRoomType, bedValue])
                    : setBedRoomType(
                        bedRoomType.filter((value) => value !== bedValue),
                      );
                }}
              />
              <span>{bedValue} Bedroom</span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}

const FilterSidebar = () => {
  return (
    <aside className="space-y-6 md:space-y-6">
      <DistrictCard />
      <PriceRangeCard />
      <StarRatingCard />
      <BedTypeCard />
      <BedroomTypeCard />
    </aside>
  );
};

export default FilterSidebar;
