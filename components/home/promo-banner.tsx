"use client";

import { getBanners } from "@/app/(protected)/home/fetch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";

export function PromoBanner({
  bannersPromise,
}: {
  bannersPromise: Promise<Awaited<ReturnType<typeof getBanners>>>;
}) {
  const { data: banners, status, pagination } = React.use(bannersPromise);

  return (
    <div className="relative mb-2 w-full sm:mb-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="md:basis-1/1">
              <div className="relative aspect-[2/1] overflow-hidden rounded sm:aspect-[5/2] md:aspect-[3/1]">
                <Image
                  src={banner.image_url}
                  alt="Hotel promotional image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"default"} className="left-1 sm:left-2" />
        <CarouselNext variant={"default"} className="right-1 sm:right-2" />
      </Carousel>
    </div>
  );
}
