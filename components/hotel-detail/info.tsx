"use client";

import type { HotelInfoProps } from "@/app/(protected)/hotel-detail/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";

function generateStars(rating: number) {
  return "★".repeat(rating);
}

function HotelDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const shouldTruncate = description.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? `${description.slice(0, maxLength)}...`
      : description;

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Description</h2>
      <p className="text-muted-foreground mb-4 text-sm">{displayText}</p>
      {shouldTruncate && (
        <Button
          variant={"ghost"}
          className="flex items-center text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}{" "}
          <ChevronRight size={16} className={isExpanded ? "rotate-90" : ""} />
        </Button>
      )}
    </div>
  );
}

function HotelNearUs({
  locations,
}: {
  locations: { name: string; distance: string }[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLocations = 3;
  const shouldTruncate = locations.length > maxLocations;
  const displayLocations =
    shouldTruncate && !isExpanded
      ? locations.slice(0, maxLocations)
      : locations;

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Near Us</h2>
      <div className="space-y-3">
        {displayLocations.map((location, index) => (
          <div key={index} className="flex items-center w-full">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm font-medium">{location.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              ({location.distance})
            </span>
          </div>
        ))}
      </div>
      {shouldTruncate && (
        <Button
          variant={"ghost"}
          className="mt-4 flex items-center text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}{" "}
          <ChevronRight size={16} className={isExpanded ? "rotate-90" : ""} />
        </Button>
      )}
    </div>
  );
}

function HotelFacilities({ facilities }: { facilities: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxFacilities = 3;
  const shouldTruncate = facilities.length > maxFacilities;
  const displayFacilities =
    shouldTruncate && !isExpanded
      ? facilities.slice(0, maxFacilities)
      : facilities;

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Main Facilities</h2>
      <ul className="text-muted-foreground mb-4 list-disc space-y-2 pl-5 text-sm">
        {displayFacilities.map((facility, index) => (
          <li key={index}>{facility}</li>
        ))}
      </ul>
      {shouldTruncate && (
        <Button
          variant={"ghost"}
          className="flex items-center text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}{" "}
          <ChevronRight size={16} className={isExpanded ? "rotate-90" : ""} />
        </Button>
      )}
    </div>
  );
}

export function HotelInfo({
  name,
  location,
  rating,
  isPromoted,
  promoText,
  price,
  description,
  facilities,
  nearby,
}: HotelInfoProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-10">
        <div className="flex flex-col gap-1">
          <span className="text-yellow-500">{generateStars(rating)}</span>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-xsm text-muted-foreground">{location}</p>
        </div>
        <div className="flex flex-col gap-1">
          <br />
          {isPromoted && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5"
            >
              3D2YIBIS4U
            </Badge>
          )}
          {promoText && (
            <span className="text-xs text-green-600 font-medium">
              {promoText}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end justify-end gap-1">
          <p className="text-muted-foreground text-sm">Start from</p>
          <p className="text-xl font-bold">
            Rp {price.toLocaleString("id-ID")}
          </p>
          <p className="text-muted-foreground text-sm">per room, per night</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <HotelDescription description={description} />
        <HotelNearUs locations={nearby} />
        <HotelFacilities facilities={facilities} />
      </div>
    </>
  );
}
