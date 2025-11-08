"use client";

import Image from "next/image";
import { useState } from "react";

export function RoomImageGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: () => void;
}) {
  // If no images, show fallback
  if (!images || images.length === 0) {
    return (
      <div className="col-span-2 flex flex-col gap-2">
        <div
          className="group relative col-span-3 aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100"
          onClick={onImageClick}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-500">No Image Available</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="group relative col-span-1 aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={onImageClick}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500">No Image Available</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col gap-2">
      <div
        className="group relative col-span-3 aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
        onClick={onImageClick}
      >
        <ImageWithFallback
          alt="Room main image"
          src={images[0]}
          className="absolute size-full object-cover transition-opacity group-hover:opacity-90"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.slice(1, 4).map((image, index) => (
          <div
            key={index}
            className="group relative col-span-1 aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={onImageClick}
          >
            <ImageWithFallback
              alt={`Room image ${index + 2}`}
              src={image}
              className="absolute size-full object-cover transition-opacity group-hover:opacity-90"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Add this custom image component with fallback
function ImageWithFallback({
  src,
  alt,
  className,
  fill,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No Image Available</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
