import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BedDouble, Search, Users } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
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

const HotelResults = () => {
  return (
    <section className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
      <SearchByName />

      {/* <Suspense
        key={`hotel-results-${urlParamsString}`}
        fallback={<HotelSkeletons />}
      >
        <HotelList search={search} promise={hotelsPromise} />
      </Suspense> */}
      <HotelList />
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

const hotels = Array.from({ length: 9 }, (_, index) => index);

const HotelList = () => {
  return (
    <>
      {hotels.map((hotel, index) => (
        <HotelCard key={index} />
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

const HotelCard = () => {
  return (
    <Link href={`/hotel/1`}>
      <Card className="overflow-hidden py-0 hover:opacity-75">
        <div className="relative aspect-[4/3]">
          {/* <Image
            src={thumbnail}
            alt={`${name} hotel`}
            fill
            className="object-cover"
            sizes={"cover"}
          /> */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image Placeholder</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <span className="text-yellow-500">★★★★★</span>
          <h3 className="text-lg font-semibold">Hotel Name</h3>
          <p className="text-muted-foreground text-sm">Location</p>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <BedDouble className="h-4 w-4" />
            <span>Twin Bed</span>
            <Users className="h-4 w-4" />
            <span>2 Guests</span>
          </div>

          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">From</span>{" "}
            <span>{formatCurrency(500_000, "IDR")}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default HotelResults;
