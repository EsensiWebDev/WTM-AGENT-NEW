"use client";

import { getHotels } from "@/app/(protected)/home/fetch";
import {
  FilterBedTypes,
  FilterDistricts,
  FilterPricing,
  FilterRatings,
  FilterTotalRooms,
} from "@/app/(protected)/home/types";
import { formatCurrency } from "@/lib/format";
import { useAgentCurrency } from "@/hooks/use-agent-currency";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import React, { useState } from "react";
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

function DistrictCard({
  filter_districts,
}: {
  filter_districts: FilterDistricts | null;
}) {
  const [showAll, setShowAll] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useQueryState(
    "district",
    parseAsNativeArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  // Handle case when filter_districts is null or empty
  if (!filter_districts || filter_districts.length === 0) {
    return (
      <Card className={"gap-0 rounded p-0 pb-4"}>
        <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
          <h3 className="font-medium">District / City</h3>
        </CardHeader>
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500">
            District/city filter is currently unavailable
          </p>
        </div>
      </Card>
    );
  }

  const handleDistrictChange = (districtId: string) => {
    const currentDistricts = selectedDistricts || [];
    const newDistricts = currentDistricts.includes(districtId)
      ? currentDistricts?.filter((id) => id !== districtId)
      : [...currentDistricts, districtId];
    setSelectedDistricts(newDistricts);
  };

  const displayedDistricts = showAll
    ? filter_districts
    : filter_districts.slice(0, 6);

  return (
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">District / City</h3>
      </CardHeader>
      <div className="grid grid-cols-2 gap-2 px-4 sm:grid-cols-3">
        {displayedDistricts.map((district) => (
          <div
            key={district}
            className={cn(
              "border-input ring-offset-priomary hover:bg-primary/90 focus-visible:ring-ring flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
              selectedDistricts?.includes(district)
                ? "bg-primary text-white hover:text-white"
                : "bg-white text-gray-800 hover:bg-gray-200",
            )}
            onClick={() => handleDistrictChange(district)}
          >
            <Checkbox
              id={district}
              checked={selectedDistricts?.includes(district)}
              className="sr-only"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    htmlFor={district}
                    className="max-w-full cursor-pointer truncate text-center text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {district}
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{district}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      {filter_districts.length > 6 && (
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

function PriceRangeCard({ filter_pricing }: { filter_pricing: FilterPricing }) {
  const [{ range_price_min, range_price_max }, setPrices] = useQueryStates({
    range_price_min: parseAsInteger
      .withDefault(filter_pricing ? filter_pricing.min_price : 0)
      .withOptions({ shallow: false }),
    range_price_max: parseAsInteger
      .withDefault(filter_pricing ? filter_pricing.max_price : 0)
      .withOptions({ shallow: false }),
  });

  // Currency for displaying the range – first prefer explicit filter currency,
  // then the selected/display currency from the URL, and finally use agent's default currency.
  const agentCurrency = useAgentCurrency();
  const [urlCurrency] = useQueryState(
    "currency",
    parseAsString.withOptions({ shallow: false }),
  );
  // Use agent's currency as default when URL doesn't have currency param
  const currency = filter_pricing.currency || urlCurrency || agentCurrency;

  return (
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Price</h3>
      </CardHeader>
      <div className="px-4">
        <Slider
          defaultValue={[range_price_min, range_price_max]}
          min={0}
          max={10_000_000}
          step={50_000}
          className={"py-2"}
          onValueCommit={async (e) => {
            await setPrices({
              range_price_min: e[0],
              range_price_max: e[1],
            });
          }}
        />
        <div className="mt-2 flex items-center justify-between text-sm">
          <span>{formatCurrency(range_price_min, currency)}</span>
          <span>{formatCurrency(range_price_max, currency)}</span>
        </div>
      </div>
    </Card>
  );
}

function StarRatingCard({
  filter_ratings,
}: {
  filter_ratings: FilterRatings[];
}) {
  const [star, setStar] = useQueryState(
    "rating",
    parseAsNativeArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  if (!filter_ratings) {
    return (
      <Card className="gap-0 rounded p-0 pb-4">
        <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
          <h3 className="font-medium">Hotel Classification</h3>
        </CardHeader>
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500">
            Hotel Classification filter is currently unavailable
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Hotel Classification</h3>
      </CardHeader>
      <div className="space-y-2 px-4">
        {filter_ratings?.map((rating) => (
          <label key={rating.rating} className="flex items-center gap-2">
            <Checkbox
              checked={star.includes(rating.rating.toString())}
              onCheckedChange={(checked: CheckedState) => {
                return checked
                  ? setStar([...star, rating.rating.toString()])
                  : setStar(
                      star?.filter(
                        (value) => value !== rating.rating.toString(),
                      ),
                    );
              }}
            />
            <span>
              <span className="text-yellow-500">
                {"★".repeat(rating.rating)}
              </span>{" "}
              {rating.rating}-Star ({rating.count})
            </span>
          </label>
        ))}
      </div>
    </Card>
  );
}

export function BedTypeCard({
  filter_bed_types,
}: {
  filter_bed_types: FilterBedTypes[] | null;
}) {
  const [bedType, setBedType] = useQueryState(
    "bed_type_id",
    parseAsNativeArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  // Handle case when filter_bed_types is null
  if (!filter_bed_types) {
    return (
      <Card className="gap-0 rounded p-0 pb-4">
        <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
          <h3 className="font-medium">Bed Type</h3>
        </CardHeader>
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500">
            Bed type filter is currently unavailable
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gap-0 rounded p-0 pb-4">
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Bed Type</h3>
      </CardHeader>
      <div className="space-y-2 px-4">
        {filter_bed_types.map((type) => (
          <label className="flex items-center gap-2" key={type.bed_type_id}>
            <Checkbox
              id={String(type.bed_type_id)}
              checked={bedType.includes(String(type.bed_type_id))}
              onCheckedChange={(checked) => {
                return checked
                  ? setBedType([...bedType, String(type.bed_type_id)])
                  : setBedType(
                      bedType?.filter(
                        (value) => value !== String(type.bed_type_id),
                      ),
                    );
              }}
            />
            <span className="capitalize">{type.bed_type}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}

function BedroomTypeCard({
  filter_total_rooms,
}: {
  filter_total_rooms: FilterTotalRooms[] | null;
}) {
  const [bedRoomType, setBedRoomType] = useQueryState(
    "total_bedrooms",
    parseAsNativeArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );

  // Handle case when filter_total_rooms is null
  if (!filter_total_rooms) {
    return (
      <Card className={"gap-0 rounded p-0 pb-4"}>
        <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
          <h3 className="font-medium">Bedroom Type</h3>
        </CardHeader>
        <div className="px-4 py-2">
          <p className="text-sm text-gray-500">
            Bedroom type filter is currently unavailable
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={"gap-0 rounded p-0 pb-4"}>
      <CardHeader className="mb-4 rounded-t bg-gray-200 px-4 pt-2">
        <h3 className="font-medium">Bedroom Type</h3>
      </CardHeader>
      <div className="space-y-2 px-4">
        {filter_total_rooms.map((type) => (
          <label className="flex items-center gap-2" key={type.total_bed_rooms}>
            <Checkbox
              id={String(type.total_bed_rooms)}
              checked={bedRoomType.includes(String(type.total_bed_rooms))}
              onCheckedChange={(checked) => {
                return checked
                  ? setBedRoomType([
                      ...bedRoomType,
                      String(type.total_bed_rooms),
                    ])
                  : setBedRoomType(
                      bedRoomType?.filter(
                        (value) => value !== String(type.total_bed_rooms),
                      ),
                    );
              }}
            />
            <span>
              {type.total_bed_rooms} Bedroom ({type.count})
            </span>
          </label>
        ))}
      </div>
    </Card>
  );
}

const FilterSidebar = ({
  promise,
}: {
  promise: Promise<Awaited<ReturnType<typeof getHotels>>>;
}) => {
  const hotelsData = React.use(promise);
  const { status } = hotelsData;

  if (status !== 200) return null;

  const {
    data: {
      filter_ratings,
      filter_bed_types,
      filter_total_rooms,
      filter_districts,
      filter_pricing,
    },
  } = hotelsData;

  return (
    <aside className="space-y-6 md:space-y-6">
      <DistrictCard filter_districts={filter_districts} />
      <PriceRangeCard filter_pricing={filter_pricing} />
      <StarRatingCard filter_ratings={filter_ratings} />
      <BedTypeCard filter_bed_types={filter_bed_types} />
      <BedroomTypeCard filter_total_rooms={filter_total_rooms} />
    </aside>
  );
};

export default FilterSidebar;
