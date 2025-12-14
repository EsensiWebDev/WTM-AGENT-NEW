"use client";

import {
  addRoomToCart,
  AddToCartRequest,
} from "@/app/(protected)/hotel/[id]/actions";
import { RoomType } from "@/app/(protected)/hotel/[id]/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { AdditionalServices } from "./additional-services";
import { BedTypeSelection } from "./bed-type-selection";
import { PromoSelection } from "./promo-selection";
import RoomDetailsDialog from "./room-details-dialog";
import { RoomFeatures } from "./room-features";
import { RoomImageGallery } from "./room-image-gallery";
import { RoomOptions } from "./room-options";

export default function RoomCard({ room }: { room: RoomType }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number>(0);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);
  const [selectedBedType, setSelectedBedType] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const roomImages = room.photos || [];

  // Get date parameters from URL
  const [from] = useQueryState("from", parseAsString);
  const [to] = useQueryState("to", parseAsString);

  // Generate unique radio group name for this room type
  const radioGroupName = `room-option-${room.name.toLowerCase().replace(/\s+/g, "-")}`;

  // Auto-select required additional services on mount
  useEffect(() => {
    if (room.additional && room.additional.length > 0) {
      const requiredServiceIds = room.additional
        .filter((service) => service.is_required)
        .map((service) => String(service.id));
      
      if (requiredServiceIds.length > 0) {
        setSelectedAdditionals((prev) => {
          // Merge with existing selections, avoiding duplicates
          const merged = [...new Set([...prev, ...requiredServiceIds])];
          return merged;
        });
      }
    }
  }, [room.additional]);

  // Auto-select bed type if only one option available
  useEffect(() => {
    if (room.bed_types && room.bed_types.length === 1 && !selectedBedType) {
      setSelectedBedType(room.bed_types[0]);
    }
  }, [room.bed_types, selectedBedType]);

  // Function to reset form to default values
  const resetForm = () => {
    setSelectedRoom(0);
    setRoomQuantity(1);
    // Keep required services selected even after reset
    if (room.additional && room.additional.length > 0) {
      const requiredServiceIds = room.additional
        .filter((service) => service.is_required)
        .map((service) => String(service.id));
      setSelectedAdditionals(requiredServiceIds);
    } else {
      setSelectedAdditionals([]);
    }
    setSelectedPromo(null);
    // Reset bed type, but auto-select if only one option
    if (room.bed_types && room.bed_types.length === 1) {
      setSelectedBedType(room.bed_types[0]);
    } else {
      setSelectedBedType("");
    }
  };

  const handleAdditionalChange = (serviceId: string, checked: boolean) => {
    setSelectedAdditionals((prev) => {
      if (checked) {
        // Add serviceId to the array if not already present
        return prev.includes(serviceId) ? prev : [...prev, serviceId];
      } else {
        // Remove serviceId from the array
        return prev.filter((id) => id !== serviceId);
      }
    });
  };

  const handlePromoChange = (promoId: string | null) => {
    setSelectedPromo(promoId);
  };

  const handleAddToCart = async () => {
    if (!from || !to) {
      toast.error("Please select a check-in and check-out date.");
      return;
    }

    // Validate bed type selection if multiple bed types exist
    if (room.bed_types && room.bed_types.length > 1 && !selectedBedType) {
      toast.error("Please select a bed type.");
      return;
    }

    const body = {
      check_in_date: from,
      check_out_date: to,
      promo_id: Number(selectedPromo) || undefined,
      quantity: roomQuantity,
      room_price_id: selectedRoom,
      room_type_additional_ids: selectedAdditionals.map((id) => Number(id)),
      bed_type: selectedBedType || room.bed_types?.[0] || undefined,
    } as AddToCartRequest;

    startTransition(async () => {
      const { success, message } = await addRoomToCart(body);

      if (success) {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
        resetForm();
        toast.success(message || "Room added to cart successfully", {
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
          duration: 5000,
        });
      } else {
        toast.error(message || "Failed to add room to cart. Please try again.");
      }
    });
  };

  const features = [
    { icon: "Square", text: `${room.room_size} sqm` },
    { icon: "Users", text: `${room.max_occupancy} guests` },
    {
      icon: room.is_smoking_room ? "CigaretteOff" : "Cigarette",
      text: room.is_smoking_room ? "Non Smoking" : "Smoking",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">
          {room.name}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-5">
          <RoomImageGallery
            images={roomImages}
            onImageClick={() => setIsDialogOpen(true)}
          />

          <div className="col-span-1 flex flex-col lg:col-span-3">
            <RoomOptions
              with_breakfast={room.with_breakfast}
              without_breakfast={room.without_breakfast}
              selectedOption={selectedRoom}
              onOptionChange={setSelectedRoom}
              radioGroupName={radioGroupName}
              promo={room.promos?.find(
                (p) => String(p.promo_id) === selectedPromo,
              )}
            />

            <PromoSelection
              promos={room.promos}
              selectedPromo={selectedPromo}
              onPromoChange={handlePromoChange}
            />

            {room.additional && room.additional.length > 0 && (
              <AdditionalServices
                additionals={room.additional}
                selectedAdditionals={selectedAdditionals}
                onAdditionalChange={handleAdditionalChange}
              />
            )}

            {room.bed_types && room.bed_types.length > 0 && (
              <BedTypeSelection
                bedTypes={room.bed_types}
                selectedBedType={selectedBedType}
                onSelect={setSelectedBedType}
                required={room.bed_types.length > 1}
              />
            )}

            <RoomFeatures features={features} />

            <div className="mt-3 sm:mt-4">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
              >
                See Room Details & Benefit
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="mt-4 flex flex-col space-y-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
                disabled={isPending || selectedRoom === 0}
                className="w-full px-8 py-2 text-white hover:bg-slate-700 disabled:opacity-50 sm:w-auto"
              >
                {isPending && <Spinner />}
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
      </div>
    </Card>
  );
}
