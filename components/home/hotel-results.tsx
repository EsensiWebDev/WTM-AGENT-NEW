"use client";

import { getHotels } from "@/app/(protected)/home/fetch";
import { Hotel } from "@/app/(protected)/home/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { formatUrl } from "@/lib/url-utils";
import { useAgentCurrency } from "@/hooks/use-agent-currency";
import { getPriceForCurrency } from "@/lib/price-utils";
import { format } from "date-fns";
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

  console.log("[HotelResults] Data received:", {
    status,
    hotelsCount: hotelsData.data?.hotels?.length || 0,
    pagination: hotelsData.data?.pagination,
    message: hotelsData.message,
  });

  if (status !== 200) {
    console.error("[HotelResults] Error loading data:", {
      status,
      message: hotelsData.message,
    });
    return "Error loading data";
  }

  return (
    <section className="grid auto-rows-min grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:col-span-3 lg:grid-cols-3">
      <SearchByName />
      <React.Suspense
        fallback={
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[2/1] w-full" />
                <div className="p-3 sm:p-4">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="mb-4 h-4 w-full" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </Card>
            ))}
          </>
        }
      >
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

  console.log("[HotelList] Rendering hotel list:", {
    hotelsCount: hotels?.length || 0,
    pageCount,
    currentPage: pagination?.current_page || 1,
    totalHotels: pagination?.total || 0,
  });

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );

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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    // Always include first and last page
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pageCount - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (pageCount >= 1) {
      rangeWithDots.push(1);
    }

    // Add dots if needed
    if (range.length > 0 && range[0] > 2) {
      rangeWithDots.push("ellipsis");
    }

    rangeWithDots.push(...range);

    // Add dots if needed
    if (range.length > 0 && range[range.length - 1] < pageCount - 1) {
      rangeWithDots.push("ellipsis");
    }

    // Add last page
    if (pageCount > 1) {
      rangeWithDots.push(pageCount);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <>
      {hotels?.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
      {(hotels?.length === 0 || hotels === null) && (
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
                onClick={handleFirst}
              >
                <ChevronsLeft className="size-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber as number);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
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
                aria-label="Go to last page"
                variant="ghost"
                size="icon"
                className="hidden size-8 lg:flex"
                disabled={page >= pageCount}
                onClick={handleLast}
              >
                <ChevronsRight className="size-4" />
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
  const agentCurrency = useAgentCurrency();

  // Get tomorrow and day after tomorrow dates (users can't book for today)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Create a new URLSearchParams object with default date values
  const params = new URLSearchParams(searchParams.toString());
  params.delete("location");

  // Add default values for 'from' and 'to' parameters if not present
  if (!params.has("from")) {
    params.set("from", format(tomorrow, "yyyy-MM-dd"));
  }
  if (!params.has("to")) {
    params.set("to", format(dayAfterTomorrow, "yyyy-MM-dd"));
  }

  const stringQuery = params.toString();
  const href = `/hotel/${hotel.id}?${stringQuery}`;

  // Prefer currency from API if available, otherwise fall back to selected/display currency from URL,
  // and finally use agent's default currency from profile
  const selectedCurrency = searchParams.get("currency") || agentCurrency;
  const currency = hotel.currency || selectedCurrency;
  
  // Get the price for the selected currency from prices object, or fall back to min_price
  const displayPrice = getPriceForCurrency(hotel.prices, hotel.min_price, currency);

  React.useEffect(() => {
    console.log("[HotelCard] Rendering hotel:", {
      hotelId: hotel.id,
      hotelName: hotel.name,
      minPrice: hotel.min_price,
      prices: hotel.prices,
      selectedCurrency,
      finalCurrency: currency,
      displayPrice,
    });
  }, [hotel.id, hotel.currency, selectedCurrency, currency, displayPrice]);

  return (
    <Link href={href} className="flex">
      <Card className="flex h-full w-full flex-col gap-0 overflow-hidden rounded py-0 hover:opacity-75">
        <div className="relative aspect-[2/1] flex-shrink-0">
          {imgError || !hotel.photo ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-sm text-gray-500 sm:text-base">
                Image not found
              </span>
            </div>
          ) : (
            <Image
              src={formatUrl(hotel.photo) || ""}
              alt={`${hotel.name} hotel`}
              fill
              className="object-cover"
              sizes={"cover"}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className="flex flex-grow flex-col gap-1 p-3 sm:p-4">
          <span className="text-yellow-500">{"★".repeat(hotel.rating)}</span>
          <h3 className="text-base font-semibold sm:text-lg">{hotel.name}</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {hotel.address}
          </p>

          <div className="mt-auto pt-2 text-sm">
            <div className="text-xs">
              Start from{" "}
              <span className="text-sm font-semibold sm:text-base">
                {formatCurrency(displayPrice, currency)}
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
