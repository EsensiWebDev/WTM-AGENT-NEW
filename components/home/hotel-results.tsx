"use client";

import { getHotels } from "@/app/(protected)/home/fetch";
import { Hotel } from "@/app/(protected)/home/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatCurrency } from "@/lib/format";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React from "react";

interface HotelResultsProps {
  promise: Promise<Awaited<ReturnType<typeof getHotels>>>;
}

const HotelResults = ({ promise }: HotelResultsProps) => {
  const hotelsData = React.use(promise);

  const { status } = hotelsData;

  if (status !== 200) return null;

  return (
    <section className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
      <SearchByName />
      <React.Suspense fallback="Loading...">
        <HotelList promise={promise} />
      </React.Suspense>
    </section>
  );
};

const SearchByName = () => {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );
  const [searchInput, setSearchInput] = React.useState(search ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput || null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="col-span-1 flex gap-2 sm:col-span-2 lg:col-span-3">
      <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
        <Input
          className="rounded bg-white"
          placeholder={"Search Hotel Name Here..."}
          role="search"
          value={searchInput}
          onChange={handleInputChange}
        />
        <Button className="rounded" type="submit">
          <Search className="h-4 w-4" />
          <div className="hidden sm:inline">Search</div>
        </Button>
      </form>
    </div>
  );
};

type HotelListProps = HotelResultsProps;

const HotelList = ({ promise }: HotelListProps) => {
  const hotelsData = React.use(promise);
  const {
    data: { hotels },
    pagination,
  } = hotelsData;
  const pageCount = pagination?.total_pages || 1;

  console.log({ hotels });

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const handleFirst = () => {
    if (page > 1) setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < pageCount) setPage(page + 1);
  };

  const handleLast = () => {
    if (page < pageCount) setPage(pageCount);
  };

  return (
    <>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
      {hotels.length === 0 && (
        <div className="col-span-full py-8 text-center">
          <p className="text-muted-foreground">
            No hotels found matching your search.
          </p>
        </div>
      )}
      <div className="col-span-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label="Go to first page"
                variant="ghost"
                size="icon"
                className="hidden size-8 lg:flex"
                disabled={page <= 1}
                onClick={() => {
                  handleFirst();
                }}
              >
                <ChevronsLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                aria-disabled={page >= pageCount}
                className={
                  page >= pageCount ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Go to first page"
                variant="ghost"
                size="icon"
                className="hidden size-8 lg:flex"
                disabled={page >= pageCount}
                onClick={() => {
                  handleLast();
                }}
              >
                <ChevronsRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const searchParams = useSearchParams();
  const [imgError, setImgError] = React.useState(false);

  const params = new URLSearchParams(searchParams.toString());
  params.delete("location");
  const stringQuery = params.toString();

  const href = stringQuery ? `/hotel-detail?${stringQuery}` : "/hotel-detail";

  return (
    <Link href={href}>
      <Card className="gap-0 overflow-hidden rounded py-0 hover:opacity-75">
        <div className="relative aspect-[2/1]">
          {imgError || !hotel.photo ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Image not found</span>
            </div>
          ) : (
            <Image
              src={hotel.photo}
              alt={`${hotel.name} hotel`}
              fill
              className="object-cover"
              sizes={"cover"}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className="flex flex-col gap-1 p-4">
          <span className="text-yellow-500">{"★".repeat(hotel.rating)}</span>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-muted-foreground text-sm">{hotel.address}</p>

          <div className="mt-2 text-sm">
            <div className="text-xs">
              Start from{" "}
              <span className="text-base font-semibold">
                {formatCurrency(hotel.min_price, "IDR")}
              </span>
            </div>
            <span className="text-xs leading-relaxed">per room, per night</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default HotelResults;
