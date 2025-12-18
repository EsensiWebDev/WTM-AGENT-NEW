import { cancelBookingAction } from "@/app/(protected)/history-booking/action";
import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { format, differenceInDays } from "date-fns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconCancel,
  IconCloudUpload,
  IconFileDescription,
  IconReceipt,
} from "@tabler/icons-react";
import { ChevronDown, ChevronUp, Ellipsis } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { UploadReceiptDialog } from "./upload-receipt-dialog";
import ViewInvoiceDialog from "./view-invoice-dialog";
import ViewReceiptDialog from "./view-receipt-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: HistoryBooking | null;
}

const ViewDetailDialog: React.FC<ViewDetailDialogProps> = ({
  open,
  onOpenChange,
  booking,
}) => {
  const isMobile = useIsMobile();
  const [invoiceIndex, setInvoiceIndex] = useState(0);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadReceiptOpen, setUploadReceiptOpen] = React.useState(false);
  const [selectedSubBookingId, setSelectedSubBookingId] = React.useState<
    string | null
  >(null);
  const [cancelSubBookingId, setCancelSubBookingId] = React.useState<
    string | null
  >(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleViewInvoice = (index: number) => {
    setInvoiceIndex(index);
    setInvoiceDialogOpen(true);
  };

  const handleViewReceipt = (booking: HistoryBooking) => {
    setReceiptDialogOpen(true);
  };

  const handleCancelClick = (subBookingId: string) => {
    setCancelSubBookingId(subBookingId);
    setConfirmDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!booking || !cancelSubBookingId) return;

    setIsLoading(true);
    try {
      const result = await cancelBookingAction(cancelSubBookingId);

      if (result.success) {
        toast.success(result.message);
        setConfirmDialogOpen(false);
        setCancelSubBookingId(null);
        onOpenChange(false); // Close the detail dialog
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDialogClose = () => {
    setConfirmDialogOpen(false);
    setCancelSubBookingId(null);
  };

  const handleUploadReceipt = (subBookingId: string) => {
    setSelectedSubBookingId(subBookingId);
    setUploadReceiptOpen(true);
  };

  const bookingDetails = booking?.detail || [];

  const getStatusBadge = (status: string, type: "booking" | "payment") => {
    if (type === "booking") {
      switch (status) {
        case "approved":
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Confirmed
            </Badge>
          );
        case "waiting":
          return (
            <Badge
              variant="outline"
              className="border-yellow-300 bg-yellow-100 text-yellow-800"
            >
              Waiting
            </Badge>
          );
        case "rejected":
          return <Badge variant="destructive">Rejected</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    } else {
      switch (status) {
        case "paid":
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Paid
            </Badge>
          );
        case "unpaid":
          return <Badge variant="destructive">Unpaid</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-[95vw] overflow-hidden bg-white px-4 sm:w-[90vw] sm:px-6 lg:w-[80vw] lg:px-8">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        {booking ? (
          <div className="max-h-[calc(90vh-120px)] space-y-4 overflow-y-auto sm:space-y-6">
            {isMobile ? (
              // Mobile Card View
              <div className="space-y-4">
                {bookingDetails.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    No data available
                  </div>
                ) : (
                  bookingDetails.map((detail, index) => {
                    const isConfirmed = detail.booking_status
                      .toLowerCase()
                      .includes("confirmed");

                    const isWaiting = detail.booking_status
                      .toLowerCase()
                      .includes("waiting");

                    const isPaid =
                      detail.payment_status.toLowerCase() === "paid";

                    return (
                      <div
                        key={index}
                        className="rounded-lg border bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold capitalize">
                              {detail.guest_name}
                            </h3>
                            <p className="text-muted-foreground text-sm capitalize">
                              Agent: {detail.agent_name}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-label="Open menu"
                                variant="ghost"
                                className="data-[state=open]:bg-muted -mr-2 size-8 p-0"
                              >
                                <Ellipsis
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onSelect={() => handleViewInvoice(index)}
                              >
                                <IconFileDescription className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              {detail.payment_status === "paid" ? (
                                <DropdownMenuItem
                                  onSelect={() => handleViewReceipt(booking)}
                                >
                                  <IconReceipt className="mr-2 h-4 w-4" /> View
                                  Receipt
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onSelect={() =>
                                    handleUploadReceipt(detail.sub_booking_id)
                                  }
                                >
                                  <IconCloudUpload className="mr-2 h-4 w-4" />
                                  Upload Receipt
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() =>
                                  handleCancelClick(detail.sub_booking_id)
                                }
                              >
                                <IconCancel className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Hotel
                            </p>
                            <p className="font-medium capitalize">
                              {detail.hotel_name}
                            </p>
                            
                            {/* Room Type */}
                            {detail.room_type_name && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">
                                  Room Type
                                </p>
                                <p className="text-sm font-medium capitalize">
                                  {detail.room_type_name}
                                </p>
                              </div>
                            )}

                            {/* Room Option (Breakfast) with Price */}
                            <div className="mt-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase">
                                    Room Option
                                  </p>
                                  <p className="text-sm font-medium">
                                    {detail.is_breakfast ? "Breakfast Included" : "Without Breakfast"}
                                  </p>
                                </div>
                                {detail.room_price !== undefined && detail.room_price > 0 && (
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">Per Night</p>
                                    <p className="text-sm font-semibold">
                                      {formatCurrency(
                                        detail.room_price,
                                        detail.currency || detail.invoice?.currency || "IDR"
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bed Type */}
                            {(detail.bed_type || detail.invoice?.bed_type) && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">
                                  Bed Type
                                </p>
                                <p className="text-sm font-medium capitalize">
                                  {detail.bed_type || detail.invoice?.bed_type}
                                </p>
                              </div>
                            )}

                            {/* Check-in and Check-out Dates */}
                            {(detail.check_in_date || detail.check_out_date) && (
                              <div className="mt-2 space-y-1">
                                {detail.check_in_date && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Check-in Date
                                    </p>
                                    <p className="text-sm font-medium">
                                      {format(new Date(detail.check_in_date), "EEE, MMMM d yyyy")}
                                    </p>
                                  </div>
                                )}
                                {detail.check_out_date && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Check-out Date
                                    </p>
                                    <p className="text-sm font-medium">
                                      {format(new Date(detail.check_out_date), "EEE, MMMM d yyyy")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Promotion Applied */}
                            {detail.invoice?.promo?.promo_code && (
                              <div className="mt-2 rounded-md bg-blue-50 p-2">
                                <p className="text-xs font-medium text-blue-900 uppercase">
                                  Promotion Applied
                                </p>
                                <div className="mt-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-blue-900">
                                      {detail.invoice.promo.promo_code}
                                    </span>
                                    {detail.invoice.promo.type && (
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        {detail.invoice.promo.type}
                                      </Badge>
                                    )}
                                  </div>
                                  {detail.invoice.promo.name && (
                                    <p className="text-xs text-blue-700">
                                      {detail.invoice.promo.name}
                                    </p>
                                  )}
                                  {(() => {
                                    const promo = detail.invoice.promo;
                                    const invoiceCurrency = detail.invoice?.currency || "IDR";
                                    
                                    // Fixed Price promo
                                    if (promo.fixed_price && promo.fixed_price > 0) {
                                      return (
                                        <p className="text-xs font-medium text-green-700">
                                          Fixed price: {formatCurrency(promo.fixed_price, invoiceCurrency)}
                                        </p>
                                      );
                                    }
                                    
                                    // Discount promo
                                    if (promo.discount_percent && promo.discount_percent > 0) {
                                      return (
                                        <p className="text-xs font-medium text-green-700">
                                          {promo.discount_percent}% discount
                                        </p>
                                      );
                                    }
                                    
                                    // Room Upgrade promo
                                    if (promo.upgraded_to_id && promo.upgraded_to_id > 0) {
                                      return (
                                        <p className="text-xs font-medium text-green-700">
                                          Room will be automatically upgraded
                                        </p>
                                      );
                                    }
                                    
                                    // Benefit promo
                                    if (promo.benefit_note) {
                                      return (
                                        <p className="text-xs font-medium text-green-700">
                                          {promo.benefit_note}
                                        </p>
                                      );
                                    }
                                    
                                    return null;
                                  })()}
                                </div>
                              </div>
                            )}

                            {detail.additional_services &&
                            detail.additional_services.length > 0 ? (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                  Additional Services
                                </p>
                                <ul className="space-y-1.5 list-none pl-0">
                                  {detail.additional_services.map(
                                    (service, idx) => {
                                      const category =
                                        service.category || "price";
                                      
                                      const invoiceCurrency = detail.invoice?.currency || "IDR";
                                      const displayValue =
                                        category === "pax" &&
                                        service.pax !== null &&
                                        service.pax !== undefined
                                          ? `${service.pax} ${
                                              service.pax === 1 ? "Pax" : "Pax"
                                            }`
                                          : category === "price" &&
                                              service.price !== null &&
                                              service.price !== undefined
                                            ? formatCurrency(service.price, invoiceCurrency)
                                            : "";

                                      return (
                                        <li
                                          key={`additional-service-${idx}`}
                                          className="flex items-center justify-between text-sm text-gray-700"
                                        >
                                          <span className="capitalize">
                                            <span className="mr-2 text-gray-500">•</span>
                                            {service.name}
                                            {service.is_required && (
                                              <span className="ml-1 text-xs text-gray-500">
                                                (Required)
                                              </span>
                                            )}
                                          </span>
                                          {displayValue && (
                                            <span className="ml-2 font-medium">
                                              {displayValue}
                                            </span>
                                          )}
                                        </li>
                                      );
                                    },
                                  )}
                                </ul>
                              </div>
                            ) : detail.additional &&
                              detail.additional.length > 0 ? (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                  Additional Services
                                </p>
                                <ul className="space-y-1 list-none pl-0">
                                  {detail.additional.map((item, idx) => (
                                    <li key={`additional-${idx}`} className="text-sm text-gray-700 capitalize">
                                      <span className="mr-2 text-gray-500">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                            {detail.additional_notes && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">
                                  Additional Notes
                                </p>
                                <p className="whitespace-pre-line text-sm text-gray-700">
                                  {detail.additional_notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Sub-booking ID
                            </p>
                            <p className="text-sm break-all">
                              {detail.sub_booking_id}
                            </p>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase">
                                Booking Status
                              </p>
                              <Badge
                                variant={
                                  isConfirmed
                                    ? "green"
                                    : isWaiting
                                      ? "yellow"
                                      : "red"
                                }
                                className="mt-1 border font-medium capitalize"
                              >
                                {detail.booking_status}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase">
                                Payment Status
                              </p>
                              <Badge
                                variant={isPaid ? "green" : "red"}
                                className="mt-1 border font-medium capitalize"
                              >
                                {detail.payment_status}
                              </Badge>
                            </div>
                          </div>

                          <div className="rounded bg-red-50 p-2">
                            <p className="text-xs font-medium text-red-600">
                              Cancellation Period
                            </p>
                            <p className="text-sm font-semibold text-red-600">
                              {detail.cancellation_date}
                            </p>
                          </div>

                          {/* Total Price Section */}
                          {detail.total_price !== undefined && detail.total_price > 0 && (
                            <div className="mt-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 uppercase">
                                    Total Booking Price
                                  </p>
                                  {detail.check_in_date && detail.check_out_date && (
                                    <p className="mt-1 text-xs text-gray-600">
                                      {(() => {
                                        try {
                                          const checkIn = new Date(detail.check_in_date);
                                          const checkOut = new Date(detail.check_out_date);
                                          const nights = differenceInDays(checkOut, checkIn);
                                          return `${nights} ${nights === 1 ? "Night" : "Nights"}`;
                                        } catch {
                                          return "";
                                        }
                                      })()}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(
                                      detail.total_price,
                                      detail.currency || detail.invoice?.currency || "IDR"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              // Desktop Table View
              <div className="overflow-x-auto">
                <Table className="min-w-full table-fixed">
                  <TableHeader>
                    <TableRow className="!bg-white">
                      <TableHead className="w-[140px] lg:w-[160px]">
                        Guest Name
                      </TableHead>
                      <TableHead className="w-[120px] lg:w-[140px]">
                        PIC Agent
                      </TableHead>
                      <TableHead className="w-[180px] lg:w-[220px]">
                        Hotel Name
                      </TableHead>
                      <TableHead className="w-[180px] lg:w-[200px]">
                        Sub-booking ID
                      </TableHead>
                      <TableHead className="w-[120px] lg:w-[140px]">
                        Booking Status
                      </TableHead>
                      <TableHead className="w-[120px] lg:w-[140px]">
                        Payment Status
                      </TableHead>
                      <TableHead className="w-[130px] lg:w-[150px]"></TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookingDetails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}

                    {bookingDetails.map((detail, index) => {
                      const isConfirmed = detail.booking_status
                        .toLowerCase()
                        .includes("confirmed");

                      const isWaiting = detail.booking_status
                        .toLowerCase()
                        .includes("waiting");

                      const isPaid =
                        detail.payment_status.toLowerCase() === "paid";
                      const isExpanded = expandedIndex === index;

                      return (
                        <React.Fragment key={index}>
                          {/* Summary row */}
                          <TableRow className="[&:nth-child(odd)]:bg-white">
                            <TableCell className="font-medium capitalize">
                              <div className="flex items-center justify-between gap-2">
                                <span>{detail.guest_name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    setExpandedIndex((prev) =>
                                      prev === index ? null : index,
                                    )
                                  }
                                  aria-label={
                                    isExpanded
                                      ? "Hide sub-booking details"
                                      : "Show sub-booking details"
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">
                              {detail.agent_name}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium capitalize">
                                {detail.hotel_name}
                              </div>
                            </TableCell>
                            <TableCell className="break-all">
                              {detail.sub_booking_id}
                            </TableCell>
                            <TableCell className="capitalize">
                              <Badge
                                variant={
                                  isConfirmed
                                    ? "green"
                                    : isWaiting
                                      ? "yellow"
                                      : "red"
                                }
                                className="border font-medium capitalize"
                              >
                                {detail.booking_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize">
                              <Badge
                                variant={isPaid ? "green" : "red"}
                                className="border font-medium capitalize"
                              >
                                {detail.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <div className="text-right text-red-600">
                                  Cancellation Period
                                </div>
                                <div className="text-right text-red-600">
                                  {detail.cancellation_date}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    className="data-[state=open]:bg-muted flex size-8 p-0"
                                  >
                                    <Ellipsis
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onSelect={() => handleViewInvoice(index)}
                                  >
                                    <IconFileDescription className="mr-2 h-4 w-4" />
                                    View Invoice
                                  </DropdownMenuItem>
                                  {detail.payment_status === "paid" ? (
                                    <DropdownMenuItem
                                      onSelect={() => handleViewReceipt(booking)}
                                    >
                                      <IconReceipt className="mr-2 h-4 w-4" />{" "}
                                      View Receipt
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        handleUploadReceipt(detail.sub_booking_id)
                                      }
                                    >
                                      <IconCloudUpload className="mr-2 h-4 w-4" />
                                      Upload Receipt
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={() =>
                                      handleCancelClick(detail.sub_booking_id)
                                    }
                                  >
                                    <IconCancel className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>

                          {/* Expanded detail row (only when toggled) */}
                          {isExpanded && (
                            <TableRow className="[&>td]:border-t-0">
                              <TableCell
                                colSpan={8}
                                className="bg-gray-50 px-6 py-4"
                              >
                                <div className="grid gap-4 md:grid-cols-3">
                                  {/* Room Type, Dates, and Promotion */}
                                  <div className="space-y-3">
                                    {/* Room Type */}
                                    {detail.room_type_name && (
                                      <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                          Room Type
                                        </p>
                                        <p className="text-sm font-medium capitalize">
                                          {detail.room_type_name}
                                        </p>
                                      </div>
                                    )}

                                    {/* Room Option (Breakfast) with Price */}
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-xs font-medium text-gray-500 uppercase">
                                            Room Option
                                          </p>
                                          <p className="text-sm font-medium">
                                            {detail.is_breakfast ? "Breakfast Included" : "Without Breakfast"}
                                          </p>
                                        </div>
                                        {detail.room_price !== undefined && detail.room_price > 0 && (
                                          <div className="text-right">
                                            <p className="text-xs text-gray-500">Per Night</p>
                                            <p className="text-sm font-semibold">
                                              {formatCurrency(
                                                detail.room_price,
                                                detail.currency || detail.invoice?.currency || "IDR"
                                              )}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Bed Type */}
                                    {(detail.bed_type || detail.invoice?.bed_type) && (
                                      <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                          Bed Type
                                        </p>
                                        <p className="text-sm font-medium capitalize">
                                          {detail.bed_type || detail.invoice?.bed_type}
                                        </p>
                                      </div>
                                    )}

                                    {/* Check-in and Check-out Dates */}
                                    {(detail.check_in_date || detail.check_out_date) && (
                                      <div className="space-y-2">
                                        {detail.check_in_date && (
                                          <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                              Check-in Date
                                            </p>
                                            <p className="text-sm font-medium">
                                              {format(new Date(detail.check_in_date), "EEE, MMMM d yyyy")}
                                            </p>
                                          </div>
                                        )}
                                        {detail.check_out_date && (
                                          <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                              Check-out Date
                                            </p>
                                            <p className="text-sm font-medium">
                                              {format(new Date(detail.check_out_date), "EEE, MMMM d yyyy")}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Promotion Applied */}
                                    {detail.invoice?.promo?.promo_code && (
                                      <div className="space-y-1 rounded-md bg-blue-50 p-2">
                                        <p className="text-xs font-medium text-blue-900 uppercase">
                                          Promotion Applied
                                        </p>
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-blue-900">
                                              {detail.invoice.promo.promo_code}
                                            </span>
                                            {detail.invoice.promo.type && (
                                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                                                {detail.invoice.promo.type}
                                              </Badge>
                                            )}
                                          </div>
                                          {detail.invoice.promo.name && (
                                            <p className="text-xs text-blue-700">
                                              {detail.invoice.promo.name}
                                            </p>
                                          )}
                                          {(() => {
                                            const promo = detail.invoice.promo;
                                            const invoiceCurrency = detail.invoice?.currency || "IDR";
                                            
                                            // Fixed Price promo
                                            if (promo.fixed_price && promo.fixed_price > 0) {
                                              return (
                                                <p className="text-xs font-medium text-green-700">
                                                  Fixed price: {formatCurrency(promo.fixed_price, invoiceCurrency)}
                                                </p>
                                              );
                                            }
                                            
                                            // Discount promo
                                            if (promo.discount_percent && promo.discount_percent > 0) {
                                              return (
                                                <p className="text-xs font-medium text-green-700">
                                                  {promo.discount_percent}% discount
                                                </p>
                                              );
                                            }
                                            
                                            // Room Upgrade promo
                                            if (promo.upgraded_to_id && promo.upgraded_to_id > 0) {
                                              return (
                                                <p className="text-xs font-medium text-green-700">
                                                  Room will be automatically upgraded
                                                </p>
                                              );
                                            }
                                            
                                            // Benefit promo
                                            if (promo.benefit_note) {
                                              return (
                                                <p className="text-xs font-medium text-green-700">
                                                  {promo.benefit_note}
                                                </p>
                                              );
                                            }
                                            
                                            return null;
                                          })()}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Additional Services */}
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Additional Services
                                    </p>
                                    {detail.additional_services &&
                                    detail.additional_services.length > 0 ? (
                                      <ul className="space-y-1.5 list-none pl-0">
                                        {detail.additional_services.map(
                                          (service, idx) => {
                                            const category =
                                              service.category || "price";
                                            
                                            const invoiceCurrency = detail.invoice?.currency || "IDR";
                                            const displayValue =
                                              category === "pax" &&
                                              service.pax !== null &&
                                              service.pax !== undefined
                                                ? `${service.pax} ${
                                                    service.pax === 1
                                                      ? "Pax"
                                                      : "Pax"
                                                  }`
                                                : category === "price" &&
                                                    service.price !== null &&
                                                    service.price !== undefined
                                                  ? formatCurrency(service.price, invoiceCurrency)
                                                  : "";

                                            return (
                                              <li
                                                key={`additional-service-${idx}`}
                                                className="flex items-center justify-between text-sm text-gray-700"
                                              >
                                                <span className="capitalize">
                                                  <span className="mr-2 text-gray-500">•</span>
                                                  {service.name}
                                                  {service.is_required && (
                                                    <span className="ml-1 text-xs text-gray-500">
                                                      (Required)
                                                    </span>
                                                  )}
                                                </span>
                                                {displayValue && (
                                                  <span className="ml-2 font-medium whitespace-nowrap">
                                                    {displayValue}
                                                  </span>
                                                )}
                                              </li>
                                            );
                                          },
                                        )}
                                      </ul>
                                    ) : detail.additional &&
                                        detail.additional.length > 0 ? (
                                      <ul className="space-y-1 list-none pl-0">
                                        {detail.additional.map((item, idx) => (
                                          <li key={`additional-${idx}`} className="text-sm text-gray-700 capitalize">
                                            <span className="mr-2 text-gray-500">•</span>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-400">
                                        No additional services
                                      </p>
                                    )}
                                  </div>

                                  {/* Other Preferences */}
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Other Preferences
                                    </p>
                                    {detail.other_preferences &&
                                    detail.other_preferences.length > 0 ? (
                                      <ul className="space-y-1.5 list-none pl-0">
                                        {detail.other_preferences.map((preference, idx) => (
                                          <li key={`preference-${idx}`} className="text-sm text-gray-700 capitalize">
                                            <span className="mr-2 text-gray-500">•</span>
                                            {preference}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-400">
                                        No other preferences
                                      </p>
                                    )}
                                  </div>

                                  {/* Additional Notes (always show header) */}
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                      Additional Notes
                                    </p>
                                    <p
                                      className={
                                        detail.additional_notes
                                          ? "whitespace-pre-line text-sm text-gray-700"
                                          : "text-sm text-gray-400"
                                      }
                                    >
                                      {detail.additional_notes ||
                                        "No additional notes"}
                                    </p>
                                  </div>

                                  {/* Total Price Section */}
                                  {detail.total_price !== undefined && detail.total_price > 0 && (
                                    <div className="mt-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-semibold text-gray-900 uppercase">
                                            Total Booking Price
                                          </p>
                                          {detail.check_in_date && detail.check_out_date && (
                                            <p className="mt-1 text-xs text-gray-600">
                                              {(() => {
                                                try {
                                                  const checkIn = new Date(detail.check_in_date);
                                                  const checkOut = new Date(detail.check_out_date);
                                                  const nights = differenceInDays(checkOut, checkIn);
                                                  return `${nights} ${nights === 1 ? "Night" : "Nights"}`;
                                                } catch {
                                                  return "";
                                                }
                                              })()}
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xl font-bold text-gray-900">
                                            {formatCurrency(
                                              detail.total_price,
                                              detail.currency || detail.invoice?.currency || "IDR"
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="flex flex-col justify-center gap-2 py-2 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/contact-us?bookingId=${booking?.booking_code}`}>
                  Inquire This Booking
                </Link>
              </Button>

              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="border-primary w-full border sm:w-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            No booking selected.
          </div>
        )}
      </DialogContent>

      {/* Invoice Dialog */}
      <ViewInvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        booking={booking}
        invoiceIndex={invoiceIndex}
      />

      {/* Receipt Dialog */}
      <ViewReceiptDialog
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        booking={booking}
      />

      <UploadReceiptDialog
        open={uploadReceiptOpen}
        onOpenChange={setUploadReceiptOpen}
        subBookingId={selectedSubBookingId ?? undefined}
        onSuccess={() => {
          setSelectedSubBookingId(null);
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelDialogClose}
        isLoading={isLoading}
        title={`Are you sure you want to cancel sub-booking ${cancelSubBookingId}?`}
        description={`This action cannot be undone and the sub-booking will be permanently cancelled.`}
      />
    </Dialog>
  );
};

export default ViewDetailDialog;
