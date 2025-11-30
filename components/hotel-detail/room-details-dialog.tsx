"use client";

import { RoomType } from "@/app/(protected)/hotel/[id]/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatUrl } from "@/lib/url-utils";
import { getIcon } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

interface RoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: RoomType | null;
  features: {
    icon: string;
    text: string;
  }[];
}

// Simplified image component with fallback
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}> = ({ src, alt, className, fill, sizes }) => {
  const [hasError, setHasError] = useState(false);

  // Handle cases where src is empty or undefined
  if (!src) {
    return (
      <div
        className={`${className} flex h-full items-center justify-center bg-gray-100`}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No Image Available</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`${className} flex h-full items-center justify-center bg-gray-100`}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={formatUrl(src) || ""}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      onError={() => setHasError(true)}
    />
  );
};

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
  open,
  onOpenChange,
  room,
  features,
}) => {
  const [mainApi, setMainApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  const handleSelect = useCallback(() => {
    if (!mainApi) return;
    setCurrent(mainApi.selectedScrollSnap() + 1);
  }, [mainApi]);

  const updateCarouselState = useCallback(() => {
    if (!mainApi) return;
    setCount(mainApi.scrollSnapList().length);
    setCurrent(mainApi.selectedScrollSnap() + 1);
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;

    updateCarouselState();
    mainApi.on("select", handleSelect);

    return () => {
      mainApi.off("select", handleSelect);
    };
  }, [mainApi, handleSelect, updateCarouselState]);

  // Reset carousel state when dialog opens
  useEffect(() => {
    if (open && mainApi) {
      // Delay to ensure carousel is properly initialized
      const timer = setTimeout(() => {
        updateCarouselState();
        setCurrent(1);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [open, mainApi, updateCarouselState]);

  if (!room) return null;

  const hasPhotos = room.photos && room.photos.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto bg-white px-4 sm:max-w-7xl sm:px-8">
        <DialogHeader>
          <DialogTitle className="text-left text-lg font-bold sm:text-2xl">
            {room.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
          {/* Main Image Carousel */}
          <div className="space-y-2 sm:space-y-4">
            <div className="relative">
              {hasPhotos ? (
                <Carousel setApi={setMainApi} className="w-full">
                  <CarouselContent>
                    {room.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <ImageWithFallback
                            src={photo}
                            alt={`${room.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {room.photos.length > 1 && (
                    <>
                      <CarouselPrevious className="left-1 h-7 w-7 bg-white/90 shadow-md hover:bg-white sm:left-2 sm:h-8 sm:w-8" />
                      <CarouselNext className="right-1 h-7 w-7 bg-white/90 shadow-md hover:bg-white sm:right-2 sm:h-8 sm:w-8" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No Images Available
                    </p>
                  </div>
                </div>
              )}

              {hasPhotos && count > 1 && (
                <div className="absolute right-1 bottom-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white sm:right-2 sm:bottom-2 sm:px-2 sm:py-1 sm:text-sm">
                  {current} / {count}
                </div>
              )}
            </div>
          </div>

          {/* Room Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                Room Information
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 sm:gap-2"
                  >
                    <div className="flex-shrink-0">{getIcon(feature.icon)}</div>
                    <span className="text-xs capitalize sm:text-sm">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                About This Room
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs leading-relaxed whitespace-pre-line text-gray-700 sm:text-sm">
                  {room.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsDialog;
