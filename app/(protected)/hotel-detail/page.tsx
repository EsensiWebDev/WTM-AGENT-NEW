import { HotelGallery } from "@/components/hotel-detail/gallery";
import { HotelInfo } from "@/components/hotel-detail/info";
import RoomCard from "@/components/hotel-detail/room-card";
import { Suspense } from "react";
import { fetchHotelDetail } from "./fetch";

export default async function HotelDetailPage() {
  const hotel = await fetchHotelDetail();

  return (
    <div className="space-y-8">
      {/* Gallery Section */}
      <section>
        <HotelGallery images={hotel.images} />
      </section>
      {/* Info Section */}
      <section>
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
      <section className="space-y-8">
        <Suspense fallback={<div>Loading room options...</div>}>
          {hotel.rooms.map((room, i) => (
            <div key={i}>
              <RoomCard {...room} hotelName={hotel.name} />
            </div>
          ))}
        </Suspense>
      </section>
    </div>
  );
}
