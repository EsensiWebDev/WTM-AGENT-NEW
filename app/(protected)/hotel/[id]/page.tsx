import { HotelGallery } from "@/components/hotel-detail/gallery";
import { HotelInfo } from "@/components/hotel-detail/info";
import RoomCard from "@/components/hotel-detail/room-card";
import { Suspense } from "react";
import { fetchHotelDetail } from "./fetch";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: hotel } = await fetchHotelDetail({ hotel_id: id });

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Gallery Section */}
      <section>
        <HotelGallery images={hotel.photos || []} hotelName={hotel.name} />
      </section>
      {/* Info Section */}
      <section>
        <HotelInfo
          name={hotel.name}
          location={`${hotel.sub_district}, ${hotel.city} - ${hotel.province}`}
          rating={hotel.rating}
          price={hotel.room_type[0].without_breakfast.price}
          description={hotel.description}
          facilities={hotel.facilities}
          nearby={hotel.nearby_place}
          social_media={hotel.social_media}
        />
      </section>
      {/* Room Card Section */}
      <section className="space-y-8">
        <Suspense fallback={<div>Loading room options...</div>}>
          {hotel.room_type.map((room, i) => (
            <div key={i}>
              <RoomCard room={room} />
            </div>
          ))}
        </Suspense>
      </section>
    </div>
  );
}
