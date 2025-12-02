import FilterSidebar from "@/components/home/filter-sidebar";
import HotelResults from "@/components/home/hotel-results";
import { PromoBanner } from "@/components/home/promo-banner";
import SearchFilter from "@/components/home/search-filter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchListProvince } from "@/server/general";
import React from "react";
import { getBanners, getHotels } from "./fetch";
import { HomePageProps } from "./types";

const HomePage = async (props: HomePageProps) => {
  const searchParams = await props.searchParams;

  const hotelsPromise = getHotels({
    searchParams,
  });

  const provincesPromise = fetchListProvince();

  const bannersPromise = getBanners({
    searchParams,
  });

  return (
    <div className="pb-8 sm:space-y-12 md:space-y-16">
      <div className="relative">
        <React.Suspense
          fallback={<Skeleton className="h-[300px] w-full sm:h-[400px] md:h-[500px]" />}
        >
          <PromoBanner bannersPromise={bannersPromise} />
        </React.Suspense>
        {/* Mobile: Stack below banner */}
        <div className="px-2 sm:px-4 md:hidden">
          <React.Suspense
            fallback={
              <div className="container mx-auto">
                <Card className="p-3 shadow-lg sm:p-4">
                  <div className="grid gap-2 sm:gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="mt-2 h-10 w-full sm:mt-4" />
                </Card>
              </div>
            }
          >
            <SearchFilter provincesPromise={provincesPromise} />
          </React.Suspense>
        </div>
        {/* Desktop: Absolute overlay */}
        <div className="absolute right-0 bottom-0 left-0 z-10 hidden translate-y-1/2 px-2 sm:px-4 md:block">
          <React.Suspense
            fallback={
              <div className="container mx-auto">
                <Card className="p-3 shadow-lg sm:p-4 md:p-6">
                  <div className="grid gap-2 sm:gap-4 md:grid-cols-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="mt-2 h-10 w-full sm:mt-4" />
                </Card>
              </div>
            }
          >
            <SearchFilter provincesPromise={provincesPromise} />
          </React.Suspense>
        </div>
      </div>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="pt-4 sm:pt-6 md:pt-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
            <React.Suspense
              fallback={
                <Card className="hidden p-6 md:block">
                  <Skeleton className="mb-4 h-6 w-32" />
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              }
              key={`filter-${JSON.stringify(searchParams)}`}
            >
              <div>
                <FilterSidebar promise={hotelsPromise} />
              </div>
            </React.Suspense>

            <React.Suspense
              fallback={
                <section className="grid auto-rows-min grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:col-span-3 lg:grid-cols-3">
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
                </section>
              }
              key={`results-${JSON.stringify(searchParams)}`}
            >
              <HotelResults promise={hotelsPromise} />
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
