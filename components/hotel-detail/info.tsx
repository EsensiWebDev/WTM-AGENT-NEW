"use client";

import { NearbyPlace, SocialMedia } from "@/app/(protected)/hotel/[id]/types";
import { Button } from "@/components/ui/button";
import {
  IconBrandInstagramFilled,
  IconBrandTiktokFilled,
  IconWorld,
} from "@tabler/icons-react";
import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function generateStars(rating: number) {
  return "★".repeat(rating);
}

function HotelDescription({
  description,
  social_media,
}: {
  description: string;
  social_media: SocialMedia[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const shouldTruncate = description.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? `${description.slice(0, maxLength)}...`
      : description;

  return (
    <div>
      <h2 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">
        Description
      </h2>
      <p className="text-muted-foreground mb-3 text-justify text-xs sm:mb-4 sm:text-sm">
        {displayText}
      </p>
      {shouldTruncate && (
        <Button
          variant={"ghost"}
          className="flex items-center text-xs font-medium sm:text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}{" "}
          <ChevronRight size={16} className={isExpanded ? "rotate-90" : ""} />
        </Button>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {social_media.map((media, index) => {
          if (media.platform === "instagram") {
            return (
              <Link href={media.link} key={media.platform}>
                <div className="bg-primary rounded-full p-1">
                  <IconBrandInstagramFilled className="h-4 w-4 text-white" />
                </div>
              </Link>
            );
          } else if (media.platform === "tiktok") {
            return (
              <Link href={media.link} key={media.platform}>
                <div className="bg-primary rounded-full p-1">
                  <IconBrandTiktokFilled className="h-4 w-4 text-white" />
                </div>
              </Link>
            );
          } else if (media.platform === "website") {
            return (
              <Link href={media.link} key={media.platform}>
                <div className="bg-primary rounded-full p-1">
                  <IconWorld className="h-4 w-4 text-white" />
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}

function HotelNearUs({ locations }: { locations: NearbyPlace[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLocations = 3;
  const shouldTruncate = locations.length > maxLocations;
  const displayLocations =
    shouldTruncate && !isExpanded
      ? locations.slice(0, maxLocations)
      : locations;

  return (
    <div>
      <h2 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Near Us</h2>
      <div className="space-y-2 sm:space-y-3">
        {displayLocations.map((location, index) => (
          <div key={index} className="flex w-full items-center">
            <MapPin size={14} className="mr-2 sm:mr-2" />
            <span className="text-xs font-medium sm:text-sm">
              {location.name}
            </span>
            <span className="text-muted-foreground ml-auto text-xs">
              {location.radius}m
            </span>
          </div>
        ))}
      </div>
      {shouldTruncate && (
        <Button
          variant={"ghost"}
          className="mt-3 flex items-center text-xs font-medium sm:mt-4 sm:text-sm"
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
      <h2 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">
        Main Facilities
      </h2>
      <ul className="text-muted-foreground mb-3 list-disc space-y-1 pl-5 text-xs sm:mb-4 sm:space-y-2 sm:text-sm">
        {displayFacilities.map((facility, index) => (
          <li key={index}>{facility}</li>
        ))}
      </ul>
      {shouldTruncate && (
        <Button
          variant={"ghost"}
          className="flex items-center text-xs font-medium sm:text-sm"
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
  price,
  description,
  facilities,
  nearby,
  social_media,
}: {
  name: string;
  location: string;
  rating: number;
  price: number;
  description: string;
  facilities: string[];
  nearby: NearbyPlace[];
  social_media: SocialMedia[];
}) {
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-3 sm:gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-yellow-500">{generateStars(rating)}</span>
          <h1 className="text-xl font-bold sm:text-2xl">{name}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">{location}</p>
        </div>
        <div className="hidden flex-col gap-1 sm:flex">
          <br />
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end sm:justify-end">
          <p className="text-muted-foreground text-xs sm:text-sm">Start from</p>
          <p className="text-lg font-bold sm:text-xl">
            Rp {price.toLocaleString("id-ID")}
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm">
            per room, per night
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
        <HotelDescription
          description={description}
          social_media={social_media}
        />
        <HotelNearUs locations={nearby} />
        <HotelFacilities facilities={facilities} />
      </div>
    </>
  );
}
