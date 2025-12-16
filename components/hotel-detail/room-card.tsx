"use client";

import {
  addRoomToCart,
  AddToCartRequest,
} from "@/app/(protected)/hotel/[id]/actions";
import { RoomType } from "@/app/(protected)/hotel/[id]/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AdditionalServices } from "./additional-services";
import { AddToCartSummaryDialog } from "./add-to-cart-summary-dialog";
import { BedTypeSelection } from "./bed-type-selection";
import { OtherPreferences } from "./other-preferences";
import { PromoSelection } from "./promo-selection";
import RoomDetailsDialog from "./room-details-dialog";
import { RoomFeatures } from "./room-features";
import { RoomImageGallery } from "./room-image-gallery";
import { RoomOptions } from "./room-options";

export default function RoomCard({ room }: { room: RoomType }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    quantity: number;
    bedType: string;
    additionalServices: typeof room.additional;
    otherPreferences: NonNullable<typeof room.other_preferences>;
    isBreakfast: boolean;
    additionalNotes?: string;
  } | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number>(0);
  const [roomQuantity, setRoomQuantity] = useState(1);
  
  // Initialize selectedAdditionals with required services
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>(() => {
    return room.additional
      .filter((add) => add.is_required === true)
      .map((add) => String(add.id));
  });
  
  const [selectedOtherPreferences, setSelectedOtherPreferences] = useState<number[]>([]);
  const [selectedBedType, setSelectedBedType] = useState<string | null>(
    room.bed_types && room.bed_types.length > 0 ? room.bed_types[0] : null
  );
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const roomImages = room.photos || [];

  // Get date parameters from URL
  const [from] = useQueryState("from", parseAsString);
  const [to] = useQueryState("to", parseAsString);

  // Generate unique radio group name for this room type
  const radioGroupName = `room-option-${room.name.toLowerCase().replace(/\s+/g, "-")}`;

  // Function to reset form to default values
  const resetForm = () => {
    setSelectedRoom(0);
    setRoomQuantity(1);
    // Reset to required services only
    setSelectedAdditionals(
      room.additional
        .filter((add) => add.is_required === true)
        .map((add) => String(add.id))
    );
    setSelectedOtherPreferences([]);
    setSelectedBedType(
      room.bed_types && room.bed_types.length > 0 ? room.bed_types[0] : null
    );
    setSelectedPromo(null);
    setAdditionalNotes("");
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

  const handleOtherPreferenceChange = (preferenceId: number, checked: boolean) => {
    setSelectedOtherPreferences((prev) => {
      if (checked) {
        return prev.includes(preferenceId) ? prev : [...prev, preferenceId];
      } else {
        return prev.filter((id) => id !== preferenceId);
      }
    });
  };

  const handleAddToCart = async () => {
    if (!from || !to) {
      toast.error("Please select a check-in and check-out date.");
      return;
    }

    // Get selected additional services with names
    const selectedAdditionalsWithNames = room.additional
      .filter((add) => selectedAdditionals.includes(String(add.id)))
      .map((add) => ({ id: add.id, name: add.name }));

    // Get selected other preferences with names
    const selectedOtherPreferencesWithNames = room.other_preferences
      ?.filter((pref) => selectedOtherPreferences.includes(pref.id))
      .map((pref) => ({ id: pref.id, name: pref.name })) || [];

    if (!selectedBedType) {
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
      other_preference_ids: selectedOtherPreferences,
      additionals: selectedAdditionalsWithNames,
      other_preferences: selectedOtherPreferencesWithNames,
      bed_type: selectedBedType,
      additional_notes: additionalNotes.trim() || undefined,
    } as AddToCartRequest;

    startTransition(async () => {
      const { success, message } = await addRoomToCart(body);

      if (success) {
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
        
        // Prepare summary data for dialog before resetting form
        const isBreakfast = selectedRoom === room.with_breakfast.id;
        const selectedAdditionalServices = room.additional.filter((add) =>
          selectedAdditionals.includes(String(add.id))
        );
        const selectedOtherPrefs = room.other_preferences?.filter((pref) =>
          selectedOtherPreferences.includes(pref.id)
        ) || [];

        // Store summary data before resetting
        setSummaryData({
          roomName: room.name,
          checkInDate: from!,
          checkOutDate: to!,
          quantity: roomQuantity,
          bedType: selectedBedType!,
          additionalServices: selectedAdditionalServices,
          otherPreferences: selectedOtherPrefs || [],
          isBreakfast,
          additionalNotes: additionalNotes.trim() || undefined,
        });

        resetForm();
        
        // Show summary dialog instead of toast
        setIsSummaryDialogOpen(true);
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

            {room.other_preferences && room.other_preferences.length > 0 && (
              <OtherPreferences
                preferences={room.other_preferences}
                selectedPreferences={selectedOtherPreferences}
                onPreferenceChange={handleOtherPreferenceChange}
              />
            )}

            {room.bed_types && room.bed_types.length > 0 && (
              <BedTypeSelection
                bedTypes={room.bed_types}
                selectedBedType={selectedBedType}
                onBedTypeChange={setSelectedBedType}
              />
            )}

            {/* Additional Notes Section */}
            <div className="mt-4 sm:mt-6">
              <Label htmlFor={`additional-notes-${room.name}`} className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
                Additional Notes
              </Label>
              <Textarea
                id={`additional-notes-${room.name}`}
                placeholder="Enter any special notes or instructions for the admin."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[80px] resize-y text-sm"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {additionalNotes.length}/500 characters
              </p>
            </div>

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

        {/* Add to Cart Summary Dialog */}
        {summaryData && (
          <AddToCartSummaryDialog
            open={isSummaryDialogOpen}
            onOpenChange={setIsSummaryDialogOpen}
            summary={summaryData}
          />
        )}
      </div>
    </Card>
  );
}
