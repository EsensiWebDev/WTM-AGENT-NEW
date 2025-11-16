"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const promoData = [
  {
    id: 1,
    image: "/hotel-detail/WTM Prototype (1).png",
  },
  {
    id: 2,
    image: "/hotel-detail/WTM Prototype (2).png",
  },
  {
    id: 3,
    image: "/hotel-detail/WTM Prototype (3).png",
  },
  {
    id: 4,
    image: "/hotel-detail/WTM Prototype (4).png",
  },
  {
    id: 5,
    image: "/hotel-detail/WTM Prototype.png",
  },
];

export function PromoBanner() {
  // const { accessToken } = useAuth();

  // const {
  //   data: dataProfile,
  //   isLoading: isLoadingProfile,
  //   isError: isErrorProfile,
  //   error: errorProfile,
  // } = useQuery({
  //   queryKey: ["hotels"],
  //   queryFn: async (): Promise<ApiResponse<HotelListData>> => {
  //     return await api("/api/hotels/agent", {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });
  //   },
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  //   retry: 2,
  // });

  return (
    <div className="relative mb-4 w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {promoData.map((promo) => (
            <CarouselItem key={promo.id} className="md:basis-1/1">
              <div className="relative aspect-[3/1] overflow-hidden rounded">
                <Image
                  src={promo.image}
                  alt="Hotel promotional image"
                  fill
                  className="object-cover"
                  priority={promo.id === 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"default"} className="left-2" />
        <CarouselNext variant={"default"} className="right-2" />
      </Carousel>
    </div>
  );
}
