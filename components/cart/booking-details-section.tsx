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
import { IconMoon, IconRosetteDiscount } from "@tabler/icons-react";
import ViewInvoiceDialog from "@/components/history-booking/dialog/view-invoice-dialog";

interface BookingDetailsSectionProps {
  bookingDetailsList: BookingDetail[];
}

const BookingDetailsSection = ({
  bookingDetailsList,
}: BookingDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Details</h2>
      </div>
      <div className="grid gap-6 sm:gap-8">
        {bookingDetailsList.map((bookingDetails) => (
          <HotelRoomCard
            key={bookingDetails.id}
            bookingDetails={bookingDetails}
          />
        ))}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
          <BookingGrandTotalCard bookingDetailsList={bookingDetailsList} />
        </div>
      </div>
    </div>
  );
};

interface HotelRoomCardProps {
  bookingDetails: BookingDetail;
}

const HotelRoomCard = ({ bookingDetails }: HotelRoomCardProps) => {
  const [isPending, startTransition] = useTransition();
  const { guestNames } = useGuests();

  // Sample coupon data - in real app this would come from props or API
  const couponDiscount = {
    code: "3D2NIGHT15",
    percentage: 15,
    amount: Math.floor(bookingDetails.totalPrice * 0.15),
  };

  const discountedPrice = bookingDetails.totalPrice - couponDiscount.amount;

  const onRemove = async () => {
    startTransition(async () => {
      await delay(1000);
      toast.success("Reservation removed");
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
      <div className="col-span-3 gap-0 p-0">
        <Card className="gap-0 p-0">
          <div className="p-6">
            <span className="text-yellow-500">
              {"★".repeat(bookingDetails.rating)}
            </span>
            <h3 className="font-semibold">
              {bookingDetails.hotelName} | {bookingDetails.roomType}
            </h3>
          </div>
          <div className="relative aspect-[3/1] overflow-hidden rounded-b-xl">
            <Image
              src={bookingDetails.imageSrc}
              alt={bookingDetails.hotelName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Card>
        <div className="mt-4 flex flex-1 justify-end bg-transparent text-sm text-red-500">
          Cancelation Period until{" "}
          {format(bookingDetails.cancellationPeriod, "dd MMM yyyy")}
        </div>
      </div>
      <Card className="relative col-span-2 flex flex-col gap-0 p-0">
        <div className="flex items-center justify-between p-6">
          <h3 className="font-semibold">Reservation Summary</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
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
              {format(bookingDetails.checkIn, "eee, MMMM d yyyy")}
            </div>
            <div className="text-xs">{bookingDetails.checkInTime}</div>
          </div>

          <div className="flex items-center md:flex-col">
            <div className="hidden items-center md:flex">
              <div className="h-[1px] w-4 bg-gray-600"></div>
              <div className="flex items-center justify-center rounded-full border border-gray-300 px-2 py-1 text-xs dark:border-gray-600">
                <IconMoon className="mr-1 h-3 w-3" />
                {Math.max(
                  1,
                  Math.ceil(
                    (+bookingDetails.checkOut - +bookingDetails.checkIn) /
                      (1000 * 60 * 60 * 24),
                  ),
                )}{" "}
                Night
              </div>
              <div className="h-[1px] w-4 bg-gray-600"></div>
            </div>
            <div className="flex items-center md:hidden">
              <div className="flex items-center justify-center rounded-full border border-gray-300 px-2 py-1 text-xs dark:border-gray-600">
                <Clock className="mr-1 h-3 w-3" />
                {Math.max(
                  1,
                  Math.ceil(
                    (+bookingDetails.checkOut - +bookingDetails.checkIn) /
                      (1000 * 60 * 60 * 24),
                  ),
                )}{" "}
                Night
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg bg-gray-200 p-4 text-center md:flex-1">
            <div className="text-muted-foreground text-xs">Check-out</div>
            <div className="text-sm font-medium">
              {format(bookingDetails.checkOut, "eee, MMMM d yyyy")}
            </div>
            <div className="text-xs">{bookingDetails.checkOutTime}</div>
          </div>
        </div>

        <div className="my-4 grid grid-cols-1 gap-2 px-6 md:grid-cols-3 md:gap-0">
          <span className="text-muted-foreground col-span-1 text-xs md:col-span-3">
            Room Selected
          </span>

          {/* Room Details */}
          {bookingDetails.rooms.map((room) => (
            <div key={room.id} className="col-span-1 md:col-span-2">
              <div className="leading-tight">
                <div className="text-sm leading-tight font-medium">
                  ({room.quantity}x) {room.name}
                </div>
                <div className="text-xs leading-tight font-extralight">
                  {room.includes.join(" | ")} | {room.features.join(" | ")}
                </div>
              </div>
            </div>
          ))}
          {bookingDetails.rooms.map((room) => (
            <div
              key={room.id}
              className="flex text-sm md:flex-col md:justify-start"
            >
              <span className="text-right text-sm font-medium">
                {formatPrice(room.price)}
              </span>
            </div>
          ))}

          {/* Additional Services */}
          {bookingDetails.additionalServices.map((service) => (
            <div key={service.id} className="col-span-1 md:col-span-2">
              <span className="text-sm font-medium">{service.name}</span>
            </div>
          ))}
          {bookingDetails.additionalServices.map((service) => (
            <div
              key={service.id}
              className="flex text-sm md:flex-col md:justify-start"
            >
              <span className="text-right text-sm font-medium">
                {formatPrice(service.price)}
              </span>
            </div>
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
              {bookingDetails.id === "booking-2" && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-white">
                    <IconRosetteDiscount className="h-4 w-4" />
                    {couponDiscount.code}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(bookingDetails.totalPrice)}
                  </div>
                </div>
              )}
            </div>

            {/* Second row: Room/night details and discounted price */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {bookingDetails.rooms.reduce(
                  (total, room) => total + room.quantity,
                  0,
                )}{" "}
                room(s),{" "}
                {Math.max(
                  1,
                  Math.ceil(
                    (+bookingDetails.checkOut - +bookingDetails.checkIn) /
                      (1000 * 60 * 60 * 24),
                  ),
                )}{" "}
                night
              </div>
              <div className="text-lg font-bold text-gray-800">
                {formatPrice(discountedPrice)}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const BookingGrandTotalCard = ({
  bookingDetailsList,
}: {
  bookingDetailsList: BookingDetail[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [generatedBooking, setGeneratedBooking] =
    useState<HistoryBooking | null>(null);

  // Function to convert BookingDetail to HistoryBooking for invoice generation
  const convertToHistoryBooking = (
    bookingDetails: BookingDetail[],
  ): HistoryBooking => {
    return {
      id: `booking-${Date.now()}`,
      number: Math.floor(Math.random() * 1000) + 1,
      guestName: "John Doe", // This would come from guest context in real app
      bookingId: `1`,
      bookingStatus: "approved" as const,
      paymentStatus: "unpaid" as const,
      notes: `Booking for ${bookingDetails.map((b) => b.hotelName).join(", ")}`,
    };
  };

  const onCheckOut = async () => {
    startTransition(async () => {
      await delay(1000);

      // Generate dummy booking data for invoice
      const historyBooking = convertToHistoryBooking(bookingDetailsList);
      setGeneratedBooking(historyBooking);

      toast.success("Checkout Success - Invoice Generated!");

      // Show invoice dialog
      setShowInvoiceDialog(true);
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const grandTotal = bookingDetailsList.reduce(
    (sum, b) => sum + b.totalPrice,
    0,
  );

  // Calculate total discount across all bookings
  const totalDiscount = bookingDetailsList.reduce(
    (sum, booking) => sum + Math.floor(booking.totalPrice * 0.15),
    0,
  );

  const discountedGrandTotal = grandTotal - totalDiscount;

  return (
    <div className="md:col-span-2 md:col-end-6">
      <Card className="relative flex flex-col gap-0 p-0">
        <div className="my-4 grid grid-cols-1 gap-2 space-y-3 px-6 md:grid-cols-3 md:gap-0">
          {bookingDetailsList.map((booking) => (
            <React.Fragment key={`${booking.id}-fragment`}>
              <div
                key={booking.id + "-name"}
                className="col-span-1 md:col-span-2"
              >
                <div className="leading-tight">
                  <div className="leading-tight font-medium">
                    {booking.hotelName}
                  </div>
                  <div className="text-xs leading-tight font-extralight">
                    {booking.roomType}
                    {booking.additionalServices.length > 0 &&
                      ` + ${booking.additionalServices.map((s) => s.name).join(" + ")}`}
                  </div>
                </div>
              </div>
              <div
                key={booking.id + "-price"}
                className="flex text-sm md:flex-col md:justify-start"
              >
                <span className="text-right font-medium">
                  {formatPrice(booking.totalPrice)}
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
              {formatPrice(discountedGrandTotal)}
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
