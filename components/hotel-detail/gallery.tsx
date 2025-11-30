"use client";

import { formatUrl } from "@/lib/url-utils";
import Image from "next/image";
import { useState } from "react";
import GalleryDialog from "./gallery-dialog";

function ImageItem({
  src,
  className = "",
  overlay,
  onClick,
}: {
  src: string;
  className?: string;
  overlay?: React.ReactNode;
  onClick?: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`group relative aspect-1/1 overflow-hidden rounded ${className} flex items-center justify-center bg-gray-100`}
      >
        <span className="text-sm text-gray-500">No Image Available</span>
        {overlay}
      </div>
    );
  }

  const formattedSrc = formatUrl(src);

  return (
    <div
      className={`group relative aspect-1/1 overflow-hidden rounded ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <Image
        alt="Hotel image"
        src={formattedSrc || ""}
        className="absolute size-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-90"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={() => setHasError(true)}
      />
      {overlay}
    </div>
  );
}

export function HotelGallery({
  images = [],
  maxDisplay = 5,
  hotelName,
}: {
  images?: string[];
  maxDisplay?: number;
  hotelName?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  };

  if (!images.length) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2 sm:gap-x-6 lg:gap-6">
        <div className="flex items-center justify-center rounded bg-gray-100 sm:col-span-2 sm:row-span-2 sm:aspect-square">
          <span className="text-sm text-gray-500 sm:text-base">
            No images available for this hotel
          </span>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="hidden items-center justify-center rounded bg-gray-100 sm:flex sm:aspect-auto"
          >
            <span className="text-gray-500">
              No images available for this hotel
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Calculate how many images to show and how many are hidden
  const showCount = Math.min(images.length, maxDisplay);
  const hiddenCount = images.length - showCount;
  const mainImage = images[0];
  const galleryImages = images.slice(1, showCount - (hiddenCount > 0 ? 1 : 0));
  const moreImage = images[showCount - 1];

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2 sm:gap-x-6 lg:gap-6">
        {/* Main image */}
        <ImageItem
          src={mainImage}
          className="sm:col-span-2 sm:row-span-2 sm:aspect-square"
          onClick={() => handleImageClick(0)}
        />

        {/* Gallery images */}
        {galleryImages.map((src, i) => (
          <ImageItem
            key={src + i}
            src={src}
            className="hidden sm:block sm:aspect-auto"
            onClick={() => handleImageClick(i + 1)}
          />
        ))}

        {/* More images overlay */}
        {hiddenCount > 0 && (
          <ImageItem
            src={moreImage}
            className="hidden sm:block sm:aspect-auto"
            onClick={() => handleImageClick(showCount - 1)}
            overlay={
              <>
                <div
                  className="absolute inset-0 bg-black opacity-50"
                  aria-hidden
                />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <span className="text-3xl text-white sm:text-5xl">
                    +{hiddenCount}
                  </span>
                </div>
              </>
            }
          />
        )}
      </div>

      {/* Gallery Dialog */}
      <GalleryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        images={images}
        hotelName={hotelName}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
