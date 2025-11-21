import FilterSidebar from "@/components/home/filter-sidebar";
import HotelResults from "@/components/home/hotel-results";
import { PromoBanner } from "@/components/home/promo-banner";
import SearchFilter from "@/components/home/search-filter";
import { fetchListProvince } from "@/server/general";
import React from "react";
import { getHotels } from "./fetch";
import { HomePageProps } from "./types";

const HomePage = async (props: HomePageProps) => {
  const searchParams = await props.searchParams;

  const hotelsPromise = getHotels({
    searchParams,
  });

  const provincesPromise = fetchListProvince();

  return (
    <div className="space-y-16">
      <div className="relative">
        <PromoBanner />
        <div className="absolute right-0 bottom-0 left-0 z-10 translate-y-1/2">
          <React.Suspense fallback="Loading...">
            <SearchFilter provincesPromise={provincesPromise} />
          </React.Suspense>
        </div>
      </div>
      <div>
        <div className="py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <React.Suspense
              fallback="Loading..."
              key={`filter-${JSON.stringify(searchParams)}`}
            >
              <FilterSidebar promise={hotelsPromise} />
            </React.Suspense>

            <React.Suspense
              fallback="Loading..."
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
