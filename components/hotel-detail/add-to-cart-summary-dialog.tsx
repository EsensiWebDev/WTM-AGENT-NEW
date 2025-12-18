"use client";

import { AdditionalService, OtherPreference, Promo } from "@/app/(protected)/hotel/[id]/types";
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
import { useAgentCurrency } from "@/hooks/use-agent-currency";
import { getPriceForCurrency } from "@/lib/price-utils";
import { format, differenceInDays } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
    roomOption: { 
      label: string; 
      price: number; 
      prices?: Record<string, number>;
      promo?: Promo;
    };
    additionalNotes?: string;
  };
}

export function AddToCartSummaryDialog({
  open,
  onOpenChange,
  summary,
}: AddToCartSummaryDialogProps) {
  const searchParams = useSearchParams();
  const agentCurrency = useAgentCurrency();
  const selectedCurrency = searchParams.get("currency") || agentCurrency;

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
          </div>

          {/* Room Option */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Room Option</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>{summary.roomOption.label}</span>
                <span className="font-medium">
                  {(() => {
                    // Calculate price using the same logic as room-options component
                    const getBasePriceForCurrency = () => {
                      return getPriceForCurrency(
                        summary.roomOption.prices,
                        summary.roomOption.price,
                        selectedCurrency
                      );
                    };

                    const getCurrentPrice = () => {
                      const promo = summary.roomOption.promo;
                      if (!promo) return getBasePriceForCurrency();

                      // For fixed price promos, use the multi-currency prices from detail
                      if (promo.promo_type_id === 2 && promo.detail?.prices) {
                        const promoPrice = getPriceForCurrency(
                          promo.detail.prices,
                          promo.detail.fixed_price || 0,
                          selectedCurrency
                        );
                        if (promoPrice > 0) {
                          return promoPrice;
                        }
                      }

                      // For discount promos, calculate from base price
                      if (promo.promo_type_id === 1 && promo.detail?.discount_percentage) {
                        const basePrice = getBasePriceForCurrency();
                        return (100 - promo.detail.discount_percentage) / 100 * basePrice;
                      }

                      // Fallback to backend-calculated prices (for backward compatibility)
                      if (summary.isBreakfast) {
                        return promo.price_with_breakfast ?? getBasePriceForCurrency();
                      }
                      return promo.price_without_breakfast ?? getBasePriceForCurrency();
                    };

                    return formatCurrency(getCurrentPrice(), selectedCurrency);
                  })()}
                </span>
              </div>
              {/* Promo Information */}
              {summary.roomOption.promo && (
                <div className="rounded-md bg-blue-50 p-2 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-900">
                      Promo: {summary.roomOption.promo.code_promo}
                    </span>
                    {summary.roomOption.promo.promo_type_name && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 font-medium text-blue-800">
                        {summary.roomOption.promo.promo_type_name}
                      </span>
                    )}
                  </div>
                  {summary.roomOption.promo.description && (
                    <p className="text-blue-700 mb-1">{summary.roomOption.promo.description}</p>
                  )}
                  {(() => {
                    const promo = summary.roomOption.promo!;
                    if (!promo.detail) return null;

                    const { detail } = promo;

                    // Fixed Price promo type
                    if (promo.promo_type_id === 2) {
                      if (detail.prices && Object.keys(detail.prices).length > 0) {
                        const price = getPriceForCurrency(
                          detail.prices,
                          detail.fixed_price || 0,
                          selectedCurrency
                        );
                        if (price > 0) {
                          return (
                            <p className="font-medium text-green-700">
                              Fixed price: {formatCurrency(price, selectedCurrency)}
                            </p>
                          );
                        }
                      } else if (detail.fixed_price && detail.fixed_price > 0) {
                        return (
                          <p className="font-medium text-green-700">
                            Fixed price: {formatCurrency(detail.fixed_price, selectedCurrency)}
                          </p>
                        );
                      }
                    }

                    // Discount promo type
                    if (promo.promo_type_id === 1 && detail.discount_percentage) {
                      return (
                        <p className="font-medium text-green-700">
                          {detail.discount_percentage}% discount
                        </p>
                      );
                    }

                    // Room Upgrade promo type
                    if (promo.promo_type_id === 3 && detail.upgraded_to_id) {
                      return (
                        <p className="font-medium text-green-700">
                          Room will be automatically upgraded
                        </p>
                      );
                    }

                    // Benefit promo type
                    if (promo.promo_type_id === 4 && detail.benefit_note) {
                      return (
                        <p className="font-medium text-green-700">{detail.benefit_note}</p>
                      );
                    }

                    return null;
                  })()}
                </div>
              )}
            </div>
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
                    {service.category === "price" &&
                      (service.price > 0 || service.prices) && (
                      <span className="font-medium">
                        {formatCurrency(
                          getPriceForCurrency(service.prices, service.price, selectedCurrency),
                          selectedCurrency,
                        )}
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

