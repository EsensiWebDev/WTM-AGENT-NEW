import FilterSidebar from "@/components/home/filter-sidebar";
import HotelResults from "@/components/home/hotel-results";
import { PromoBanner } from "@/components/home/promo-banner";
import SearchFilter from "@/components/home/search-filter";
import { getHotels } from "./fetch";

const HomePage = async () => {
  const hotelsPromise = getHotels();
  return (
    <div className="space-y-16">
      <div className="relative">
        <PromoBanner />
        <div className="absolute right-0 bottom-0 left-0 z-10 translate-y-1/2">
          <SearchFilter />
        </div>
      </div>
      <div>
        <div className="py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <FilterSidebar />
            <HotelResults promise={hotelsPromise} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
