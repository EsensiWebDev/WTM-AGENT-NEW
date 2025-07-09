"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BedDouble, Search, Users } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import { formatCurrency } from "@/lib/format";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { HotelListResponse } from "@/app/(protected)/home/types";

interface HotelResultsProps {
  promise: Promise<HotelListResponse>;
}

const HotelResults = ({ promise }: HotelResultsProps) => {
  const hotelsData = React.use(promise);
  return (
    <section className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
      <SearchByName />
      <HotelList hotels={hotelsData.data} />
    </section>
  );
};

const SearchByName = () => {
  return (
    <div className="col-span-1 flex gap-2 sm:col-span-2 lg:col-span-3">
      <Input placeholder={"Search Hotel Name Here..."} role="search" />
      <Button>
        <Search className="h-4 w-4" />
        <div className="hidden sm:inline">Search</div>
      </Button>
    </div>
  );
};

interface HotelListProps {
  hotels: HotelListResponse["data"];
}

const HotelList = ({ hotels }: HotelListProps) => {
  return (
    <>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
      <div className="col-span-full mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

interface HotelCardProps {
  hotel: HotelListResponse["data"][number];
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Link href={`/hotel/${hotel.id}`}>
      <Card className="overflow-hidden py-0 hover:opacity-75">
        <div className="relative aspect-[4/3]">
          {/* <Image
            src={hotel.image}
            alt={`${hotel.name} hotel`}
            fill
            className="object-cover"
            sizes={"cover"}
          /> */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image Placeholder</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <span className="text-yellow-500">{"★".repeat(hotel.star)}</span>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-muted-foreground text-sm">{hotel.location}</p>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <BedDouble className="h-4 w-4" />
            <span>{hotel.bedType}</span>
            <Users className="h-4 w-4" />
            <span>{hotel.guestCount} Guests</span>
          </div>

          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">From</span>{" "}
            <span>{formatCurrency(hotel.price, "IDR")}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default HotelResults;
