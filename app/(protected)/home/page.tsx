import FilterSidebar from "@/components/home/filter-sidebar";
import HotelResults from "@/components/home/hotel-results";
import { PromoBanner } from "@/components/home/promo-banner";
import SearchFilter from "@/components/home/search-filter";
import React from "react";

const HomePage = () => {
  return (
    <>
      <PromoBanner />
      <SearchFilter />

      <div className="py-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <FilterSidebar />
          <HotelResults />
        </div>
      </div>

      {/* <div className="py-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {urlParams.location && urlParams.from && urlParams.to && (
            <>
              <FilterSidebar urlParams={urlParams} />

              <HotelResults urlParams={urlParams} />
            </>
          )}
        </div>
      </div> */}
    </>
  );
};

export default HomePage;
