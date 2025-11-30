"use client";

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
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  hotelName?: string;
  initialIndex?: number;
}

// Image component with fallback
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}> = ({ src, alt, className, fill, sizes }) => {
  const [hasError, setHasError] = useState(false);

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

const GalleryDialog: React.FC<GalleryDialogProps> = ({
  open,
  onOpenChange,
  images,
  hotelName = "Hotel",
  initialIndex = 0,
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

  // Reset carousel state when dialog opens and scroll to initial index
  useEffect(() => {
    if (open && mainApi) {
      const timer = setTimeout(() => {
        updateCarouselState();
        mainApi.scrollTo(initialIndex, true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [open, mainApi, updateCarouselState, initialIndex]);

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto bg-white px-4 sm:max-w-5xl sm:px-8">
        <DialogHeader>
          <DialogTitle className="text-left text-lg font-bold sm:text-2xl">
            {hotelName} Gallery
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 sm:space-y-4">
          <div className="relative">
            <Carousel setApi={setMainApi} className="w-full">
              <CarouselContent>
                {images.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg sm:aspect-[16/9]">
                      <ImageWithFallback
                        src={photo}
                        alt={`${hotelName} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 90vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-1 h-7 w-7 bg-white/90 shadow-md hover:bg-white sm:left-2 sm:h-8 sm:w-8" />
                  <CarouselNext className="right-1 h-7 w-7 bg-white/90 shadow-md hover:bg-white sm:right-2 sm:h-8 sm:w-8" />
                </>
              )}
            </Carousel>

            {count > 1 && (
              <div className="absolute right-1 bottom-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white sm:right-2 sm:bottom-2 sm:px-2 sm:py-1 sm:text-sm">
                {current} / {count}
              </div>
            )}
          </div>

          {/* Thumbnail Grid */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-8">
              {images.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => mainApi?.scrollTo(index)}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-all hover:opacity-75 ${
                    current === index + 1
                      ? "border-primary ring-primary/50 ring-2"
                      : "border-gray-200"
                  }`}
                >
                  <ImageWithFallback
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryDialog;
