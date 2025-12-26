"use client";

import {
  checkoutCart,
  removeFromCart,
  selectGuest,
  updateAdditionalNotes,
} from "@/app/(protected)/cart/actions";
import { fetchCart } from "@/app/(protected)/cart/fetch";
import { GuestPayload } from "@/app/(protected)/cart/types";
import {
  HistoryBooking,
  InvoiceData,
} from "@/app/(protected)/history-booking/types";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconMoon } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Clock, Loader2, Plus, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import ViewInvoiceDialog from "../history-booking/dialog/view-invoice-dialog";
import { formatUrl } from "@/lib/url-utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { formatCurrency } from "@/lib/format";
import { getPriceForCurrency } from "@/lib/price-utils";

interface BookingDetailsSectionProps {
  cartData: Awaited<ReturnType<typeof fetchCart>>["data"];
}

const BookingDetailsSection = ({ cartData }: BookingDetailsSectionProps) => {
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceData[] | null>(null);

  const bookings = useMemo(() => ({ invoices }), [invoices]);

  const handleViewInvoice = (data: InvoiceData[]) => {
    setInvoices(data);
    setShowInvoiceDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Details</h2>
        <Button size="sm" asChild>
          <Link href="/home">
            <Plus className="mr-2 h-4 w-4" />
            Add More
          </Link>
        </Button>
      </div>
      {!cartData.detail && <p>No cart available.</p>}
      {cartData.detail && (
        <div className="grid gap-6 sm:gap-8">
          {cartData?.detail?.map((detail) => (
            <HotelRoomCard
              key={detail.id}
              bookingDetails={detail}
              guests={cartData.guest}
            />
          ))}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
            <BookingGrandTotalCard
              cartData={cartData}
              handleViewInvoice={handleViewInvoice}
            />
          </div>
        </div>
      )}
      <ViewInvoiceDialog
        open={showInvoiceDialog}
        onOpenChange={setShowInvoiceDialog}
        booking={bookings as HistoryBooking}
        viewBtnReceipt={false}
      />
    </div>
  );
};

interface HotelRoomCardProps {
  bookingDetails: Awaited<
    ReturnType<typeof fetchCart>
  >["data"]["detail"][number];
  guests: (string | GuestPayload)[] | null;
}

const HotelRoomCard = ({ bookingDetails, guests }: HotelRoomCardProps) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isSelecting, startSelectTransition] = useTransition();
  const [imageError, setImageError] = useState(false);
  const [isSavingNotes, startNotesTransition] = useTransition();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(bookingDetails.additional_notes || "");

  useEffect(() => {
    setNotes(bookingDetails.additional_notes || "");
    setIsEditingNotes(false);
  }, [bookingDetails.additional_notes]);

  // Normalize guests to string[] for Select component
  // Exclude guests with "Child" category from the guest name dropdown
  const normalizeGuests = useMemo(() => {
    if (!guests) return [];
    return guests
      .filter((guest) => {
        // Exclude guests with "Child" category
        if (typeof guest === "string") {
          return true; // Keep string guests (legacy format)
        }
        return guest.category !== "Child";
      })
      .map((guest) => {
        if (typeof guest === "string") {
          return guest;
        }
        // Format: "Mr John Doe" or "Mrs Jane Doe"
        return `${guest.honorific} ${guest.name}`;
      });
  }, [guests]);

  // Determine if we should show placeholder
  const shouldShowPlaceholder = !bookingDetails.photo || imageError;

  // Currency snapshot for this cart item (falls back to IDR)
  const currency = bookingDetails.currency || "IDR";

  const onRemove = async (id: string) => {
    startTransition(async () => {
      try {
        const response = await removeFromCart(id);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(
            response.message || "Room removed from cart successfully!",
          );
        } else {
          toast.error(
            response.message ||
              "Failed to remove room from cart. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to remove room from cart. Please try again.");
      }
    });
  };

  const handleSaveNotes = async () => {
    startNotesTransition(async () => {
      try {
        const response = await updateAdditionalNotes({
          sub_cart_id: bookingDetails.id,
          additional_notes: notes.trim(),
        });

        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(
            response.message || "Additional notes updated successfully.",
          );
          setIsEditingNotes(false);
        } else {
          toast.error(
            response.message ||
              "Failed to update additional notes. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to update additional notes. Please try again.");
      }
    });
  };

  const onSelect = async (id: number, guest: string) => {
    startSelectTransition(async () => {
      try {
        const response = await selectGuest({
          sub_cart_id: Number(id),
          guest: guest,
        });
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(response.message || "Guest selected successfully!");
        } else {
          toast.error(
            response.message || "Failed to select guest. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to select guest. Please try again.");
      }
    });
  };

  // Calculate the number of nights between check_in_date and check_out_date
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(
    bookingDetails.check_in_date,
    bookingDetails.check_out_date,
  );

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
      <div className="col-span-3 gap-0 p-0">
        <Card className="gap-0 p-0">
          <div className="p-6">
            <span className="text-yellow-500">
              {"★".repeat(bookingDetails.hotel_rating)}
            </span>
            <h3 className="font-semibold">
              {bookingDetails.hotel_name} | {bookingDetails.room_type_name}
            </h3>
          </div>
          <div className="relative aspect-[3/1] overflow-hidden rounded-b-xl">
            {shouldShowPlaceholder ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Image not found
                  </p>
                </div>
              </div>
            ) : (
              <Image
                src={formatUrl(bookingDetails.photo!) || ""}
                alt={bookingDetails.hotel_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </Card>
        <div className="mt-4 flex flex-1 justify-end bg-transparent text-sm text-red-500">
          {bookingDetails.cancellation_date && (
            <>
              Cancelation Period until{" "}
              {format(bookingDetails.cancellation_date, "dd MMM yyyy")}
            </>
          )}
        </div>
      </div>
      <Card className="relative col-span-2 flex flex-col gap-0 p-0">
        <div className="flex items-center justify-between p-6">
          <h3 className="font-semibold">Reservation Summary</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(String(bookingDetails.id))}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            ) : (
              <Trash2 className="h-5 w-5 cursor-pointer text-red-500" />
            )}
          </Button>
        </div>

        <div className="mt-2 flex flex-col items-center justify-between gap-4 px-6 md:flex-row md:gap-2">
          <div className="w-full rounded-lg bg-gray-200 p-4 text-center md:flex-1">
            <div className="text-muted-foreground text-xs">Check-in</div>
            <div className="text-sm font-medium">
              {format(bookingDetails.check_in_date, "eee, MMMM d yyyy")}
            </div>
            <div className="text-xs">
              {format(bookingDetails.check_in_date, "HH:mm")} WIB
            </div>
          </div>

          <div className="flex items-center md:flex-col">
            <div className="hidden items-center md:flex">
              <div className="h-[1px] w-4 bg-gray-600"></div>
              <div className="flex items-center justify-center rounded-full border border-gray-300 px-2 py-1 text-xs dark:border-gray-600">
                <IconMoon className="mr-1 h-3 w-3" />
                {nights} Night
              </div>
              <div className="h-[1px] w-4 bg-gray-600"></div>
            </div>
            <div className="flex items-center md:hidden">
              <div className="flex items-center justify-center rounded-full border border-gray-300 px-2 py-1 text-xs dark:border-gray-600">
                <Clock className="mr-1 h-3 w-3" />
                {nights} Night
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg bg-gray-200 p-4 text-center md:flex-1">
            <div className="text-muted-foreground text-xs">Check-out</div>
            <div className="text-sm font-medium">
              {format(bookingDetails.check_out_date, "eee, MMMM d yyyy")}
            </div>
            <div className="text-xs">
              {format(bookingDetails.check_out_date, "HH:mm")} WIB
            </div>
          </div>
        </div>

        <div className="my-4 grid grid-cols-1 gap-2 px-6 md:grid-cols-3 md:gap-0">
          <span className="text-muted-foreground col-span-1 text-xs md:col-span-3">
            Room Selected
          </span>

          <div className="col-span-1 md:col-span-2">
            <div className="leading-tight">
              <div className="text-sm leading-tight font-medium">
                {bookingDetails.room_type_name}
                {bookingDetails.bed_type && (
                  <span className="ml-2 text-xs font-normal text-gray-600">
                    ({bookingDetails.bed_type})
                  </span>
                )}
              </div>
              <div className="text-xs leading-tight font-extralight">
                {bookingDetails.is_breakfast ? "Breakfast Included" : ""}
              </div>
            </div>
          </div>

          <div className="flex text-sm md:flex-col md:justify-start">
            <span className="text-right text-sm font-medium">
              {formatCurrency(bookingDetails.price, currency)}
            </span>
          </div>

          {/* Promotion Applied */}
          {(() => {
            const promo = bookingDetails.promo;
            if (!promo) return false;
            
            // Check if promo has any meaningful data
            const hasPromoCode = (promo.promo_code && promo.promo_code.trim() !== "") || 
                                 (promo.code && promo.code.trim() !== "");
            const hasPromoType = promo.type && promo.type.trim() !== "";
            const hasDiscount = promo.discount_percent && promo.discount_percent > 0;
            const hasFixedPrice = promo.fixed_price && promo.fixed_price > 0;
            const hasUpgrade = promo.upgraded_to_id && promo.upgraded_to_id > 0;
            const hasBenefit = ((promo as any).benefit_note && (promo as any).benefit_note.trim() !== "") ||
                               (promo.benefit && promo.benefit.trim() !== "");
            
            return hasPromoCode || hasPromoType || hasDiscount || hasFixedPrice || hasUpgrade || hasBenefit;
          })() && (
            <>
              <span className="text-muted-foreground col-span-1 text-xs md:col-span-3 mt-2">
                Promotion Applied
              </span>
              <div className="col-span-1 md:col-span-2">
                <div className="rounded-md bg-blue-50 p-2 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-900">
                      Promo: {bookingDetails.promo.promo_code || bookingDetails.promo.code || "N/A"}
                    </span>
                    {bookingDetails.promo.type && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 font-medium text-blue-800">
                        {bookingDetails.promo.type}
                      </span>
                    )}
                  </div>
                  {bookingDetails.promo.description && 
                   bookingDetails.promo.description.trim() !== "" && (
                    <p className="text-blue-700 mb-1">{bookingDetails.promo.description}</p>
                  )}
                  {(() => {
                    const promo = bookingDetails.promo;
                    if (!promo) return null;

                    // Fixed Price promo type (ID 2)
                    if (promo.promo_type_id === 2) {
                      if (promo.prices && Object.keys(promo.prices).length > 0) {
                        const price = getPriceForCurrency(
                          promo.prices,
                          promo.fixed_price || 0,
                          currency
                        );
                        if (price > 0) {
                          return (
                            <p className="font-medium text-green-700">
                              Fixed price: {formatCurrency(price, currency)}
                            </p>
                          );
                        }
                      } else if (promo.fixed_price && promo.fixed_price > 0) {
                        return (
                          <p className="font-medium text-green-700">
                            Fixed price: {formatCurrency(promo.fixed_price, currency)}
                          </p>
                        );
                      }
                    }

                    // Discount promo type (ID 1)
                    if (promo.promo_type_id === 1 && promo.discount_percent && promo.discount_percent > 0) {
                      return (
                        <p className="font-medium text-green-700">
                          {promo.discount_percent}% discount
                        </p>
                      );
                    }

                    // Room Upgrade promo type (ID 3)
                    if (promo.promo_type_id === 3 && promo.upgraded_to_id && promo.upgraded_to_id > 0) {
                      return (
                        <p className="font-medium text-green-700">
                          Room will be automatically upgraded
                        </p>
                      );
                    }

                    // Benefit promo type (ID 4)
                    if (promo.promo_type_id === 4) {
                      const benefitText = (promo as any).benefit_note || promo.benefit;
                      if (benefitText && benefitText.trim() !== "") {
                        return (
                          <p className="font-medium text-green-700">{benefitText}</p>
                        );
                      }
                    }

                    // Fallback for backward compatibility (when promo_type_id is not available)
                    if (promo.fixed_price && promo.fixed_price > 0) {
                      return (
                        <p className="font-medium text-green-700">
                          Fixed price: {formatCurrency(promo.fixed_price, currency)}
                        </p>
                      );
                    }

                    if (promo.discount_percent && promo.discount_percent > 0) {
                      return (
                        <p className="font-medium text-green-700">
                          {promo.discount_percent}% discount
                        </p>
                      );
                    }

                    if (promo.upgraded_to_id && promo.upgraded_to_id > 0) {
                      return (
                        <p className="font-medium text-green-700">
                          Room will be automatically upgraded
                        </p>
                      );
                    }

                    const benefitText = (promo as any).benefit_note || promo.benefit;
                    if (benefitText && benefitText.trim() !== "") {
                      return (
                        <p className="font-medium text-green-700">{benefitText}</p>
                      );
                    }

                    return null;
                  })()}
                </div>
              </div>
              <div className="flex text-sm md:flex-col md:justify-center">
                <span className="text-right text-sm font-medium text-gray-400">
                  {/* Intentionally left blank */}
                </span>
              </div>
            </>
          )}

          {/* Bed Type */}
          {(bookingDetails.bed_type || (bookingDetails.bed_types && bookingDetails.bed_types.length > 0)) && (
            <>
              <span className="text-muted-foreground col-span-1 text-xs md:col-span-3 mt-2">
                Bed Type
              </span>
              <div className="col-span-1 md:col-span-2">
                <span className="text-sm font-medium">
                  {bookingDetails.bed_type || bookingDetails.bed_types?.join(", ")}
                </span>
              </div>
              <div className="flex text-sm md:flex-col md:justify-center">
                <span className="text-right text-sm font-medium text-gray-400">
                  {/* Intentionally left blank */}
                </span>
              </div>
            </>
          )}

          {/* Additional Services */}
          {bookingDetails.additional && bookingDetails.additional.length > 0 && (
            <>
              <span className="text-muted-foreground col-span-1 text-xs md:col-span-3 mt-2">
                Additional Services
              </span>
              {bookingDetails.additional.map((additional, idx) => {
                const category = additional.category || "price";
                const displayValue =
                  category === "pax" && additional.pax !== undefined
                    ? `${additional.pax} ${additional.pax === 1 ? "Pax" : "Pax"}`
                    : formatCurrency(additional.price || 0, currency);

                return (
                  <React.Fragment
                    key={`${bookingDetails.room_type_name}-additional-${idx}`}
                  >
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-sm font-medium">
                        <span className="mr-2 text-gray-500">•</span>
                        {additional.name}
                      </span>
                    </div>
                    <div className="flex text-sm md:flex-col md:justify-center">
                      <span className="text-right text-sm font-medium">
                        {displayValue}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </>
          )}

          {/* Other Preferences */}
          {bookingDetails.other_preferences &&
            bookingDetails.other_preferences.length > 0 && (
              <>
                <span className="text-muted-foreground col-span-1 text-xs md:col-span-3 mt-2">
                  Other Preferences
                </span>
                {bookingDetails.other_preferences.map((preference, idx) => (
                  <React.Fragment
                    key={`${bookingDetails.room_type_name}-preference-${idx}`}
                  >
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-sm font-medium">
                        <span className="mr-2 text-gray-500">•</span>
                        {preference}
                      </span>
                    </div>
                    <div className="flex text-sm md:flex-col md:justify-center">
                      <span className="text-right text-sm font-medium text-gray-400">
                        {/* Intentionally left blank */}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}

          {/* Additional Notes (read-only by default, editable on demand) */}
          {!isEditingNotes ? (
            <>
              <span className="text-muted-foreground col-span-1 text-xs md:col-span-3 mt-2">
                Additional Notes
              </span>
              <div className="col-span-1 md:col-span-2">
                <span
                  className={
                    bookingDetails.additional_notes
                      ? "whitespace-pre-line text-sm text-gray-700"
                      : "text-sm text-gray-400"
                  }
                >
                  {bookingDetails.additional_notes || "No additional notes"}
                </span>
              </div>
              <div className="flex items-center justify-end text-sm md:flex-col md:justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Update Notes
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="text-muted-foreground col-span-1 text-xs md:col-span-3 mt-2">
                Additional Notes
              </span>
              <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Enter any special notes or instructions for the admin."
                  className="min-h-[72px] resize-y text-sm"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{notes.length}/500 characters</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNotes(bookingDetails.additional_notes || "");
                        setIsEditingNotes(false);
                      }}
                      disabled={isSavingNotes}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                    >
                      {isSavingNotes && (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      )}
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex text-sm md:flex-col md:justify-center">
                <span className="text-right text-sm font-medium text-gray-400">
                  {/* Intentionally left blank */}
                </span>
              </div>
            </>
          )}

          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm whitespace-nowrap">Guest Name</span>
            <Select
              value={bookingDetails.guest}
              disabled={isSelecting}
              onValueChange={(value) => onSelect(bookingDetails.id, value)}
            >
              <SelectTrigger className="w-[180px] border-none shadow-none">
                <SelectValue placeholder="Select Guest" />
              </SelectTrigger>
              <SelectContent>
                {normalizeGuests.length > 0 ? (
                  normalizeGuests.map((guestName, index) => (
                    <SelectItem key={`${guestName}-${index}`} value={guestName}>
                      {guestName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-guests" disabled>
                    No guests added yet
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardFooter className="bg-gray-200 px-6 py-4">
          <div className="flex w-full flex-col gap-1">
            {/* First row: Total Room Price and line-through price */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-800">
                Total Room Price
              </div>
              {/* {bookingDetails.id === "booking-2" && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-white">
                    <IconRosetteDiscount className="h-4 w-4" />
                    {couponDiscount.code}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(bookingDetails.totalPrice)}
                  </div>
                </div>
              )} */}
            </div>

            {/* Second row: Room/night details and discounted price */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                1 room(s), {nights} night(s)
              </div>
              <div className="text-lg font-bold text-gray-800">
                {formatCurrency(bookingDetails.total_price, currency)}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const BookingGrandTotalCard = ({
  cartData,
  handleViewInvoice,
}: {
  cartData: Awaited<ReturnType<typeof fetchCart>>["data"];
  handleViewInvoice: (data: InvoiceData[]) => void;
}) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [missingGuestsList, setMissingGuestsList] = useState<string[]>([]);

  // Validate that all booking details have guests selected
  const validateGuests = (): { isValid: boolean; missingGuests: string[] } => {
    const missingGuests: string[] = [];
    
    if (!cartData.detail) {
      return { isValid: false, missingGuests: [] };
    }

    // TypeScript sees detail as a tuple, but at runtime it's an array
    // Use Array.from to convert tuple to array for iteration
    const details = Array.from(cartData.detail);
    
    if (details.length === 0) {
      return { isValid: false, missingGuests: [] };
    }

    details.forEach((detail) => {
      if (!detail.guest || detail.guest.trim() === "" || detail.guest === "Select Guest") {
        missingGuests.push(`${detail.hotel_name} - ${detail.room_type_name}`);
      }
    });

    return {
      isValid: missingGuests.length === 0,
      missingGuests,
    };
  };

  const handleCheckoutClick = () => {
    const validation = validateGuests();
    
    if (!validation.isValid) {
      // Store missing guests list and show validation dialog
      setMissingGuestsList(validation.missingGuests);
      setShowValidationDialog(true);
      return;
    }

    // All guests are selected, show confirmation dialog
    setShowConfirmDialog(true);
  };

  const onCheckOut = async () => {
    startTransition(async () => {
      try {
        const response = await checkoutCart();
        if (response.success) {
          if (response.data) {
            handleViewInvoice(response.data);
          }
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(response.message || "Cart checked out successfully!");
        } else {
          toast.error(
            response.message || "Failed to check out cart. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to check out cart. Please try again.");
      } finally {
        setShowConfirmDialog(false);
      }
    });
  };

  const currency = cartData.currency || "IDR";

  return (
    <div className="md:col-span-2 md:col-end-6">
      <Card className="relative flex flex-col gap-0 p-0">
        <div className="my-4 grid grid-cols-1 gap-2 space-y-3 px-6 md:grid-cols-3 md:gap-0">
          {cartData.detail.map((detail) => (
            <React.Fragment key={`${detail.id}-fragment`}>
              <div
                key={detail.id + "-name"}
                className="col-span-1 md:col-span-2"
              >
                <div className="leading-tight">
                  <div className="leading-tight font-medium">
                    {detail.hotel_name}
                  </div>
                  <div className="text-xs leading-tight font-extralight">
                    {detail.room_type_name}
                    {detail.bed_type && ` - ${detail.bed_type}`}
                    {detail.additional?.length > 0 &&
                      ` + ${detail.additional.map((s) => s.name).join(" + ")}`}
                  </div>
                </div>
              </div>
              <div
                key={detail.id + "-price"}
                className="flex text-sm md:flex-col md:justify-start"
              >
                <span className="text-right font-medium">
                  {formatCurrency(detail.total_price, detail.currency || currency)}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <CardFooter className="grid grid-cols-1 bg-gray-200 px-6 py-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <div className="text-sm font-medium">Grand Total</div>
          </div>
          <div className="flex h-full md:flex-col md:justify-end">
            <span className="text-right text-lg font-bold">
              {formatCurrency(cartData.grand_total, currency)}
            </span>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleCheckoutClick} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Check Outing...
            </>
          ) : (
            "Check Out"
          )}
        </Button>
      </div>

      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Guest Selection Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Please select a guest for all room bookings before proceeding with checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Missing guest selections for:
            </p>
            <ul className="max-h-60 space-y-2 overflow-y-auto rounded-md bg-red-50 p-4">
              {missingGuestsList.map((missingGuest, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-800"
                >
                  <span className="mt-0.5 text-red-600">•</span>
                  <span>{missingGuest}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Please go back to each booking and select a guest name from the dropdown menu.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowValidationDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Checkout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to proceed with checkout? This action will
              finalize your booking and cannot be undone. Please review all
              details before confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onCheckOut}
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Checkout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingDetailsSection;
