"use client";

import { AdditionalService } from "@/app/(protected)/hotel/[id]/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { parseAsString, useQueryState } from "nuqs";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
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

export function AddToCartConfirmationDialog({
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
                IDR {selectedOption.price.toLocaleString("id-ID")}
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
              <span>IDR {roomTotal.toLocaleString("id-ID")}</span>
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
                  -IDR {discount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          {selectedServices.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Additional Services</h4>
              <div className="mt-2 space-y-2">
                {selectedServices.map((service) => {
                  // Backward compatibility: default to "price" if category is missing
                  const category = service.category || "price";
                  
                  return (
                    <div
                      key={service.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {service.name}
                        {service.is_required && (
                          <span className="ml-1 text-xs text-red-500">*</span>
                        )}
                      </span>
                      <span>
                        {category === "price" && service.price !== undefined
                          ? `IDR ${service.price.toLocaleString("id-ID")}`
                          : category === "pax" && service.pax !== undefined
                            ? `${service.pax} ${service.pax === 1 ? "person" : "people"}`
                            : "N/A"}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-medium">
                  <span>Services Total:</span>
                  <span>IDR {servicesTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>IDR {totalPrice.toLocaleString("id-ID")}</span>
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
