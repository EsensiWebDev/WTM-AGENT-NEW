import { HotelGallery } from "@/components/hotel-detail/gallery";
import { HotelInfo } from "@/components/hotel-detail/info";
import { RoomCard } from "@/components/hotel-detail/room-card";
import { Suspense } from "react";
import { fetchHotelDetail } from "./fetch";

export default async function HotelDetailPage() {
  const hotel = await fetchHotelDetail();

  return (
    <main className="flex flex-col gap-8 p-6 md:pt-0 md:p-12 bg-[#f6fdff] min-h-screen">
      {/* Gallery Section */}
      <section className="w-full max-w-6xl mx-auto">
        <HotelGallery images={hotel.images} />
      </section>
      {/* Info Section */}
      <section className="w-full max-w-6xl mx-auto gap-8">
        <HotelInfo
          name={hotel.name}
          location={hotel.location}
          rating={hotel.rating}
          isPromoted={hotel.isPromoted}
          promoText={hotel.promoText}
          price={hotel.price}
          description={hotel.description}
          facilities={hotel.facilities}
          nearby={hotel.nearby}
        />
      </section>
      {/* Room Card Section */}
      <section className="w-full max-w-6xl mx-auto">
        <Suspense fallback={<div>Loading room options...</div>}>
          {hotel.rooms.map((room, i) => (
            <div key={i} className="mb-6">
              <RoomCard {...room} />
            </div>
          ))}
        </Suspense>
      </section>
    </main>
  );
}
