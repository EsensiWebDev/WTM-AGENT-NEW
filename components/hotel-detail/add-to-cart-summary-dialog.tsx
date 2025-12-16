"use client";

import { AdditionalService, OtherPreference } from "@/app/(protected)/hotel/[id]/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { format, differenceInDays } from "date-fns";
import { CheckCircle2 } from "lucide-react";

interface AddToCartSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: {
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    quantity: number;
    bedType: string;
    additionalServices: AdditionalService[];
    otherPreferences: OtherPreference[];
    isBreakfast: boolean;
    additionalNotes?: string;
  };
}

export function AddToCartSummaryDialog({
  open,
  onOpenChange,
  summary,
}: AddToCartSummaryDialogProps) {
  const checkIn = new Date(summary.checkInDate);
  const checkOut = new Date(summary.checkOutDate);
  const nights = differenceInDays(checkOut, checkIn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <DialogTitle className="text-2xl font-bold">Added to Cart</DialogTitle>
          </div>
          <DialogDescription>
            Your room has been successfully added to the cart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Room Name */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Room</h3>
            <p className="text-sm text-gray-700">{summary.roomName}</p>
            {summary.isBreakfast && (
              <p className="text-xs text-gray-500 mt-1">Breakfast Included</p>
            )}
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Dates</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-medium">
                  {format(checkIn, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-medium">
                  {format(checkOut, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">
                  {nights} {nights === 1 ? "Night" : "Nights"}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity & Bed Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">
                  {summary.quantity} {summary.quantity === 1 ? "Room" : "Rooms"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bed Type:</span>
                <span className="font-medium">{summary.bedType}</span>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          {summary.additionalServices.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Additional Services
              </h3>
              <div className="space-y-1">
                {summary.additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>{service.name}</span>
                    {service.category === "price" && service.price > 0 && (
                      <span className="font-medium">
                        {formatCurrency(service.price, "IDR")}
                      </span>
                    )}
                    {service.category === "pax" && service.pax !== undefined && (
                      <span className="font-medium">{service.pax} Pax</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Preferences */}
          {summary.otherPreferences.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Other Preferences
              </h3>
              <div className="space-y-1">
                {summary.otherPreferences.map((preference) => (
                  <div
                    key={preference.id}
                    className="text-sm text-gray-700"
                  >
                    {preference.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {summary.additionalNotes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Additional Notes
              </h3>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {summary.additionalNotes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

