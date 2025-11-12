"use client";

import { BookingDetail } from "@/app/(protected)/cart/types";
import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { delay } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { useGuests } from "./guest-context";
import { IconMoon } from "@tabler/icons-react";
import ViewInvoiceDialog from "@/components/history-booking/dialog/view-invoice-dialog";
import { fetchCart } from "@/app/(protected)/cart/fetch";
import { checkoutCart, removeFromCart } from "@/app/(protected)/cart/actions";
import { useQueryClient } from "@tanstack/react-query";

interface BookingDetailsSectionProps {
  cartData: Awaited<ReturnType<typeof fetchCart>>["data"];
}

const BookingDetailsSection = ({ cartData }: BookingDetailsSectionProps) => {
  console.log({ detail: cartData.detail });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Details</h2>
      </div>
      <div className="grid gap-6 sm:gap-8">
        {cartData.detail.map((detail) => (
          <HotelRoomCard key={detail.id} bookingDetails={detail} />
        ))}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
          <BookingGrandTotalCard cartData={cartData} />
        </div>
      </div>
    </div>
  );
};

interface HotelRoomCardProps {
  bookingDetails: Awaited<
    ReturnType<typeof fetchCart>
  >["data"]["detail"][number];
}

const HotelRoomCard = ({ bookingDetails }: HotelRoomCardProps) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const { guestNames } = useGuests();

  // Sample coupon data - in real app this would come from props or API
  const couponDiscount = {
    code: "3D2NIGHT15",
    percentage: 15,
    // amount: Math.floor(bookingDetails.totalPrice * 0.15),
    amount: bookingDetails.price,
  };

  const discountedPrice = bookingDetails.price - couponDiscount.amount;

  const onRemove = async (id: string) => {
    startTransition(async () => {
      toast.promise(removeFromCart(id), {
        loading: "Removing room from cart...",
        success: ({ message }) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return message || "Room removed from cart successfully!";
        },
        error: ({ message }) =>
          message || "Failed to remove room from cart. Please try again.",
      });
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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
            <Image
              src={"/hotel-detail/WTM Prototype.png"}
              // src={bookingDetails.imageSrc}
              alt={bookingDetails.hotel_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Card>
        <div className="mt-4 flex flex-1 justify-end bg-transparent text-sm text-red-500">
          Cancelation Period until{" "}
          {/* {format(bookingDetails.cancellationPeriod, "dd MMM yyyy")} */}
          {format(new Date(), "dd MMM yyyy")}
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
              </div>
              <div className="text-xs leading-tight font-extralight">
                {bookingDetails.is_breakfast ? "Breakfast Included" : ""}
              </div>
            </div>
          </div>

          <div className="flex text-sm md:flex-col md:justify-start">
            <span className="text-right text-sm font-medium">
              {formatPrice(bookingDetails.price)}
            </span>
          </div>

          {/* Additional Services */}
          {bookingDetails.additional.map((additional, idx) => (
            <React.Fragment
              key={`${bookingDetails.room_type_name}-additional-${idx}`}
            >
              <div className="col-span-1 md:col-span-2">
                <span className="text-sm font-medium">{additional.name}</span>
              </div>
              <div className="flex text-sm md:flex-col md:justify-center">
                <span className="text-right text-sm font-medium">
                  {formatPrice(additional.price)}
                </span>
              </div>
            </React.Fragment>
          ))}

          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm whitespace-nowrap">Guest Name</span>
            <Select>
              <SelectTrigger className="w-[180px] border-none shadow-none">
                <SelectValue placeholder="Select Guest" />
              </SelectTrigger>
              <SelectContent>
                {guestNames.length > 0 ? (
                  guestNames.map((guestName, index) => (
                    <SelectItem key={index} value={`guest-${index}`}>
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
                {formatPrice(bookingDetails.total_price)}
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
}: {
  cartData: Awaited<ReturnType<typeof fetchCart>>["data"];
}) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [generatedBooking, setGeneratedBooking] =
    useState<HistoryBooking | null>(null);

  // Function to convert BookingDetail to HistoryBooking for invoice generation
  const convertToHistoryBooking = (
    bookingDetailsList: BookingDetail[],
  ): HistoryBooking => {
    return {
      booking_code: `booking-${Date.now()}`,
      booking_id: Math.floor(Math.random() * 1000) + 1,
      booking_status: "approved",
      detail: [
        {
          additional: [],
          agent_name: "Agent Name",
          booking_status: "approved",
          cancellation_date: new Date().toISOString(),
          guest_name: "John Doe",
          hotel_name: bookingDetailsList.map((b) => b.hotelName).join(", "),
          payment_status: "unpaid",
          sub_booking_id: "1",
        },
      ],
      guest_name: ["John Doe"], // This would come from guest context in real app
      payment_status: "unpaid",
    };
  };

  const onCheckOut = async () => {
    startTransition(async () => {
      toast.promise(checkoutCart(), {
        loading: "Checking out cart...",
        success: ({ message }) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return message || "Cart checked out successfully!";
        },
        error: ({ message }) =>
          message || "Failed to check out cart. Please try again.",
      });

      // await delay(1000);

      // Generate dummy booking data for invoice
      // const historyBooking = convertToHistoryBooking(cartData);
      // setGeneratedBooking(historyBooking);

      // toast.success("Checkout Success - Invoice Generated!");

      // Show invoice dialog
      // setShowInvoiceDialog(true);
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // const grandTotal = cartData.reduce((sum, b) => sum + b.totalPrice, 0);

  // // Calculate total discount across all bookings
  // const totalDiscount = cartData.reduce(
  //   (sum, booking) => sum + Math.floor(booking.totalPrice * 0.15),
  //   0,
  // );

  // const discountedGrandTotal = grandTotal - totalDiscount;

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
                    {detail.additional.length > 0 &&
                      ` + ${detail.additional.map((s) => s.name).join(" + ")}`}
                  </div>
                </div>
              </div>
              <div
                key={detail.id + "-price"}
                className="flex text-sm md:flex-col md:justify-start"
              >
                <span className="text-right font-medium">
                  {formatPrice(detail.total_price)}
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
              {formatPrice(cartData.grand_total)}
            </span>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4 flex justify-end">
        <Button onClick={onCheckOut} disabled={isPending}>
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

      {/* Invoice Dialog */}
      <ViewInvoiceDialog
        open={showInvoiceDialog}
        onOpenChange={setShowInvoiceDialog}
        booking={generatedBooking}
      />
    </div>
  );
};

export default BookingDetailsSection;
