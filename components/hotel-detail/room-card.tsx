"use client";

import {
  AdditionalService,
  PriceOption,
  Promo,
  RoomType,
} from "@/app/(protected)/hotel/[id]/types";
import { getIcon } from "@/lib/utils";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import RoomDetailsDialog from "./room-details-dialog";

// Add interface for the confirmation dialog props
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean; // Add loading state prop
  roomData: {
    hotelName: string;
    roomName: string;
    selectedOption: {
      includes?: string;
      label: string;
      price: number;
    };
    quantity: number;
    selectedAdditionals: Record<string, boolean>;
    additionalServices: AdditionalService[];
    promoCode: string | null;
    totalPrice: number;
    roomTotal: number;
    servicesTotal: number;
    discount: number;
    numberOfNights: number;
  };
}

// Add the confirmation dialog component
function AddToCartConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  roomData,
}: ConfirmationDialogProps) {
  const {
    hotelName,
    roomName,
    selectedOption,
    quantity,
    selectedAdditionals,
    additionalServices,
    promoCode,
    totalPrice,
    roomTotal,
    servicesTotal,
    discount,
    numberOfNights,
  } = roomData;

  // Get selected additional services
  const selectedServices = additionalServices.filter(
    (service) => selectedAdditionals[service.id],
  );

  // Get date parameters from URL
  const [from] = useQueryState("from", parseAsString);
  const [to] = useQueryState("to", parseAsString);

  // Parse dates
  const checkinDate = from ? new Date(from) : new Date();
  const checkoutDate = to
    ? new Date(to)
    : new Date(checkinDate.getTime() + 24 * 60 * 60 * 1000); // Default to tomorrow

  // Format dates for display
  const formattedCheckinDate = checkinDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedCheckoutDate = checkoutDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details
          </DialogDescription>
        </DialogHeader>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <h4 className="font-medium">{hotelName}</h4>
            <p className="text-sm text-gray-600">{roomName}</p>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="font-medium">Check-in Date</p>
            <p className="text-sm text-gray-600">{formattedCheckinDate}</p>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="font-medium">Check-out Date</p>
            <p className="text-sm text-gray-600">{formattedCheckoutDate}</p>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="font-medium">Duration</p>
            <p className="text-sm text-gray-600">
              {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{selectedOption.label}</p>
                {selectedOption.includes && (
                  <p className="text-sm text-gray-600">
                    {selectedOption.includes}
                  </p>
                )}
              </div>
              <p className="font-medium">
                Rp {selectedOption.price.toLocaleString("id-ID")}
                <span className="text-xs font-normal text-gray-500">
                  /night
                </span>
              </p>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <div>
                <div>Quantity:</div>
                <div>Duration:</div>
              </div>
              <div className="text-right">
                <div>
                  {quantity} room{quantity > 1 ? "s" : ""}
                </div>
                <div>
                  {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-between font-medium">
              <span>Room Total:</span>
              <span>Rp {roomTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {promoCode && (
            <div className="mt-4">
              <div className="flex justify-between">
                <span>Promo Code:</span>
                <span className="font-medium text-green-600">{promoCode}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Discount:</span>
                <span className="font-medium text-green-600">
                  -Rp {discount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          {selectedServices.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Additional Services</h4>
              <div className="mt-2 space-y-2">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between text-sm"
                  >
                    <span>{service.name}</span>
                    <span>Rp {service.price.toLocaleString("id-ID")}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium">
                  <span>Services Total:</span>
                  <span>Rp {servicesTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 hover:bg-slate-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Adding to Cart...
              </>
            ) : (
              "Confirm & Add to Cart"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RoomCard({ room }: { room: RoomType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<
    Record<string, boolean>
  >({});
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const roomImages = room.photos || [];

  // Get date parameters from URL
  const [from] = useQueryState("from", parseAsString);
  const [to] = useQueryState("to", parseAsString);

  // Generate unique radio group name for this room type
  const radioGroupName = `room-option-${room.name.toLowerCase().replace(/\s+/g, "-")}`;

  const handleAdditionalChange = (serviceId: string, checked: boolean) => {
    setSelectedAdditionals((prev) => ({
      ...prev,
      [serviceId]: checked,
    }));
  };

  const handlePromoChange = (promoId: string | null) => {
    setSelectedPromo(promoId);
  };

  const handleAddToCart = () => {
    // Open confirmation dialog instead of directly adding to cart
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmAddToCart = () => {
    startTransition(async () => {});
  };

  // Function to reset form to default values
  const resetForm = () => {
    setSelectedOption(0);
    setRoomQuantity(1);
    setSelectedAdditionals({});
    setSelectedPromo(null);
  };

  const features = [
    { icon: "Square", text: `${room.room_size} sqm` },
    { icon: "Users", text: `${room.max_occupancy} guests` },
    {
      icon: room.is_smoking_room ? "CigaretteOff" : "Cigarette",
      text: room.is_smoking_room ? "Non Smoking" : "Smoking",
    },
    { icon: "Bed", text: `${room.bed_types.join(", ")}` },
  ];

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          {room.name}
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <RoomImageGallery
            images={roomImages}
            onImageClick={() => setIsDialogOpen(true)}
          />

          <div className="col-span-3 flex flex-col">
            <RoomOptions
              with_breakfast={room.with_breakfast}
              without_breakfast={room.without_breakfast}
              selectedOption={selectedOption}
              onOptionChange={setSelectedOption}
              radioGroupName={radioGroupName}
              promo={room.promos.find(
                (p) => String(p.promo_id) === selectedPromo,
              )}
            />

            {/* Promo Selection */}
            <PromoSelection
              promos={room.promos}
              selectedPromo={selectedPromo}
              onPromoChange={handlePromoChange}
            />

            {/* Additional Services */}
            {room.additional && room.additional.length > 0 && (
              <AdditionalServices
                additionals={room.additional}
                selectedAdditionals={selectedAdditionals}
                onAdditionalChange={handleAdditionalChange}
              />
            )}

            <RoomFeatures features={features} />

            <div className="mt-4">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
              >
                See Room Details & Benefit
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Room</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRoomQuantity(Math.max(1, roomQuantity - 1))
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {roomQuantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoomQuantity(roomQuantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isPending}
                className="px-8 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        <RoomDetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          room={room}
          features={features}
        />

        {/* Add confirmation dialog */}
        {/* <AddToCartConfirmationDialog
          open={isConfirmationDialogOpen}
          onOpenChange={setIsConfirmationDialogOpen}
          onConfirm={handleConfirmAddToCart}
          isLoading={isPending} // Pass the loading state
          roomData={{
            hotelName,
            roomName: name,
            selectedOption: options[selectedOption],
            quantity: roomQuantity,
            selectedAdditionals,
            additionalServices: additionals || [],
            promoCode:
              availablePromos.find((p) => p.id === selectedPromo)?.code || null,
            totalPrice,
            roomTotal,
            servicesTotal,
            discount,
            numberOfNights,
          }}
        /> */}
      </div>
    </Card>
  );
}

function RoomImageGallery({
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

function RoomOptions({
  with_breakfast,
  without_breakfast,
  selectedOption,
  onOptionChange,
  radioGroupName,
  promo,
}: {
  with_breakfast: PriceOption;
  without_breakfast: PriceOption;
  selectedOption: number;
  onOptionChange: (index: number) => void;
  radioGroupName: string;
  promo?: Promo;
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Room Options</h3>
      <div className="space-y-4">
        {without_breakfast && with_breakfast.is_show && (
          <div
            key={without_breakfast.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
              selectedOption === without_breakfast.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onOptionChange(without_breakfast.id)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${radioGroupName}-${without_breakfast.id}`}
                name={radioGroupName}
                checked={selectedOption === without_breakfast.id}
                onChange={() => onOptionChange(without_breakfast.id)}
                className="accent-primary h-4 w-4 cursor-pointer text-slate-800 focus:ring-slate-500"
              />
              <div className="cursor-pointer">
                <label
                  htmlFor={`option-${radioGroupName}-${without_breakfast.id}`}
                  className="cursor-pointer font-medium text-gray-900"
                >
                  Without Breakfast
                </label>
                {!!without_breakfast.pax && (
                  <p className="text-sm text-gray-600">
                    for {without_breakfast.pax} pax
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              {without_breakfast.price && promo && (
                <p className="text-sm text-gray-500 line-through">
                  {promo.price_without_breakfast !==
                    without_breakfast.price && (
                    <span>
                      Rp {without_breakfast.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900">
                {promo && (
                  <span>
                    Rp {promo.price_without_breakfast.toLocaleString("id-ID")}
                  </span>
                )}
                {!promo && (
                  <span>
                    Rp {without_breakfast.price.toLocaleString("id-ID")}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
        {with_breakfast && with_breakfast.is_show && (
          <div
            key={with_breakfast.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
              selectedOption === with_breakfast.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onOptionChange(with_breakfast.id)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${radioGroupName}-${with_breakfast.id}`}
                name={radioGroupName}
                checked={selectedOption === with_breakfast.id}
                onChange={() => onOptionChange(with_breakfast.id)}
                className="accent-primary h-4 w-4 cursor-pointer text-slate-800 focus:ring-slate-500"
              />
              <div className="cursor-pointer">
                <label
                  htmlFor={`option-${radioGroupName}-${with_breakfast.id}`}
                  className="cursor-pointer font-medium text-gray-900"
                >
                  With Breakfast
                </label>
                {!!with_breakfast.pax && (
                  <p className="text-sm text-gray-600">
                    for {with_breakfast.pax} pax
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              {with_breakfast.price && promo && (
                <p className="text-sm text-gray-500 line-through">
                  {promo.price_with_breakfast !== with_breakfast.price && (
                    <span>
                      Rp {with_breakfast.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900">
                {promo && (
                  <span>
                    Rp{" "}
                    {promo.price_with_breakfast?.toLocaleString("id-ID") ||
                      with_breakfast.price.toLocaleString("id-ID")}
                  </span>
                )}
                {!promo && (
                  <span>Rp {with_breakfast.price.toLocaleString("id-ID")}</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdditionalServices({
  additionals,
  selectedAdditionals,
  onAdditionalChange,
}: {
  additionals: AdditionalService[];
  selectedAdditionals: Record<string, boolean>;
  onAdditionalChange: (serviceId: string, checked: boolean) => void;
}) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Additional Services
      </h4>
      <div className="space-y-3">
        {additionals.map((service) => (
          <div key={String(service.id)} className="flex items-center space-x-3">
            <Checkbox
              id={String(service.id)}
              checked={selectedAdditionals[service.id] || false}
              onCheckedChange={(checked) =>
                onAdditionalChange(String(service.id), checked as boolean)
              }
            />
            <label
              htmlFor={String(service.id)}
              className="text-sm font-medium text-gray-900"
            >
              {service.name}
            </label>
            {service.price > 0 && (
              <span className="text-sm text-gray-600">
                Rp {service.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomFeatures({
  features,
}: {
  features: {
    icon: string;
    text: string;
  }[];
}) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            {getIcon(feature.icon)}
            <span className="text-sm font-semibold text-gray-600 capitalize">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add the new PromoSelection component here
function PromoSelection({
  promos,
  selectedPromo,
  onPromoChange,
}: {
  promos: Promo[];
  selectedPromo: string | null;
  onPromoChange: (promoId: string | null) => void;
}) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Apply Promo Code
      </h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onPromoChange(null)}
            className={`flex w-full items-center rounded-lg border p-3 text-left transition-colors ${
              selectedPromo === null
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
              {selectedPromo === null && (
                <div className="bg-primary h-3 w-3 rounded-full"></div>
              )}
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              No Promo
            </span>
          </button>
        </div>

        {promos.map((promo) => (
          <div
            key={String(promo.promo_id)}
            className="flex items-center space-x-3"
          >
            <button
              type="button"
              onClick={() => onPromoChange(String(promo.promo_id))}
              className={`flex flex-1 items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                selectedPromo === String(promo.promo_id)
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                  {selectedPromo === String(promo.promo_id) && (
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                  )}
                </div>
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    {promo.code_promo}
                  </span>
                  <p className="text-xs text-gray-600">{promo.description}</p>
                </div>
              </div>
              {/* <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                {promo.discount}% off
              </span> */}
            </button>
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
