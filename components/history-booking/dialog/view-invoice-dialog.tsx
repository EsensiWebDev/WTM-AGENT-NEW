"use client";

import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import { PDFService } from "@/lib/pdf-service";
import { InvoiceDialogState } from "@/types/invoice";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCloudUpload,
  IconFileDescription,
  IconFileText,
  IconReceipt,
  IconRosetteDiscount,
} from "@tabler/icons-react";
import { format, isValid } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { NewInvoiceData } from "./new-invoice-pdf-document";
import { UploadReceiptDialog } from "./upload-receipt-dialog";
import ViewReceiptDialog from "./view-receipt-dialog";

/**
 * Validates and formats a date string. Returns formatted date or error message.
 * @param dateString - The date string to validate and format
 * @param errorMessage - The error message to return if validation fails
 * @param formatPattern - The date format pattern (default: "dd.MM.yy")
 * @returns Formatted date string or error message
 */
const validateAndFormatDate = (
  dateString: string | undefined | null,
  errorMessage: string,
  formatPattern: string = "dd.MM.yy",
): string => {
  // Check if dateString is missing or empty
  if (
    !dateString ||
    typeof dateString !== "string" ||
    dateString.trim() === ""
  ) {
    return errorMessage;
  }

  try {
    const date = new Date(dateString);

    // Validate if the date is a valid date object
    if (!isValid(date)) {
      return errorMessage;
    }

    // Check if the date string is actually a valid date (not just any string)
    if (isNaN(date.getTime())) {
      return errorMessage;
    }

    return format(date, formatPattern);
  } catch {
    return errorMessage;
  }
};

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: HistoryBooking | null;
  viewBtnReceipt?: boolean;
  invoiceIndex?: number;
}

const ViewInvoiceDialog: React.FC<ViewInvoiceDialogProps> = ({
  open,
  onOpenChange,
  booking,
  viewBtnReceipt = true,
  invoiceIndex = 0,
}) => {
  const [state, setState] = useState<InvoiceDialogState>({
    isGeneratingPDF: false,
    invoiceData: null,
    error: null,
    isLoading: false,
  });
  const [uploadReceiptOpen, setUploadReceiptOpen] = useState(false);
  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(invoiceIndex);

  useEffect(() => {
    setCurrentInvoiceIndex(invoiceIndex);
  }, [invoiceIndex]);

  if (!booking) {
    return null;
  }

  const isReceiptAvailable =
    booking && booking.receipts && booking.receipts.length > 0;

  const allInvoiceData = booking.invoices || [];
  const invoice = allInvoiceData[currentInvoiceIndex];

  const newInvoiceData = {
    invoiceNumber: invoice?.invoice_number || "Invoice Number Not Found",
    companyName: invoice?.company_agent || "",
    agentName: invoice?.agent || "Agent Name Not Found",
    agentEmail: invoice?.email || "Email Not Found",
    hotelName: invoice?.hotel || "Hotel Name Not Found",
    guestName: invoice?.guest || "Guest Name Not Found",
    checkInDate: validateAndFormatDate(
      invoice?.check_in,
      "Check-in Date Not Found",
      "dd.MM.yy",
    ),
    checkOutDate: validateAndFormatDate(
      invoice?.check_out,
      "Check-out Date Not Found",
      "dd.MM.yy",
    ),
    invoiceDate: validateAndFormatDate(
      invoice?.invoice_date,
      "Invoice Date Not Found",
      "dd.MM.yy",
    ),
    subBookingId: invoice?.sub_booking_id || "Sub-Booking ID Not Found",
    items: invoice?.description_invoice || [],
    totalPrice: invoice?.total_price || 0,
    totalBeforePromo: invoice?.total_before_promo || 0,
    promo: {
      ...invoice?.promo,
    },
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!newInvoiceData) {
      toast.error("No invoice data available");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isGeneratingPDF: true, error: null }));

      // Use centralized PDFService for PDF generation and download
      await PDFService.generateAndDownloadNewInvoice(
        newInvoiceData as NewInvoiceData,
        (step) => {
          // Optional: You could show progress here if needed
        },
      );

      toast.success("Invoice PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to download PDF";
      setState((prev) => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setState((prev) => ({ ...prev, isGeneratingPDF: false }));
    }
  };

  const navigateToPrevious = () => {
    if (currentInvoiceIndex > 0) {
      setCurrentInvoiceIndex(currentInvoiceIndex - 1);
    }
  };

  const navigateToNext = () => {
    if (currentInvoiceIndex < allInvoiceData.length - 1) {
      setCurrentInvoiceIndex(currentInvoiceIndex + 1);
    }
  };

  if (!newInvoiceData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-7xl px-8">
          <DialogHeader>
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <p className="text-muted-foreground">Loading invoice data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-7xl overflow-y-auto bg-white px-4 sm:min-w-[95vw] sm:px-6 md:px-8">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
            <div className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              <span className="text-base sm:text-lg">
                Invoice #{invoice?.invoice_number}
              </span>
            </div>

            {/* Navigation arrows for multiple invoices */}
            {allInvoiceData.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={navigateToPrevious}
                  disabled={currentInvoiceIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground text-sm font-normal">
                  {currentInvoiceIndex + 1} of {allInvoiceData.length}
                </span>
                <Button
                  size="sm"
                  onClick={navigateToNext}
                  disabled={currentInvoiceIndex === allInvoiceData.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {state.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
              <p className="text-xs text-red-700 sm:text-sm">{state.error}</p>
            </div>
          )}

          {/* Company Header */}
          <div className="flex flex-col items-start gap-4 pb-4 sm:flex-row sm:justify-between sm:pb-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg md:text-xl">
                PT. World Travel Marketing Bali
              </h2>
              <p className="text-xs text-gray-600 sm:text-sm">
                Ikat Plaza Building - Jl. Bypass Ngurah Rai No. 505
              </p>
              <p className="text-xs text-gray-600 sm:text-sm">
                Pemogan - Denpasar Selatan
              </p>
              <p className="text-xs text-gray-600 sm:text-sm">
                80221 Denpasar - Bali - Indonesia
              </p>
            </div>
            <div className="text-left sm:text-right">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Invoice
              </h1>
              <p className="text-xl font-bold text-gray-700 sm:text-2xl">
                #{newInvoiceData.invoiceNumber}
              </p>
            </div>
          </div>

          <Separator />

          {/* Billing and Invoice Details */}
          <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base">
            Bill To:
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
            {/* Bill To */}
            <div>
              <div className="space-y-1 text-xs sm:text-sm">
                {newInvoiceData.companyName !== "" && (
                  <p className="font-medium">{newInvoiceData.companyName}</p>
                )}
                <p>{newInvoiceData.agentName}</p>
                <p className="break-all">{newInvoiceData.agentEmail}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Villa</span>
                  <span className="text-right">{newInvoiceData.hotelName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Guest Name</span>
                  <span className="text-right">{newInvoiceData.guestName}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Check-In</span>
                  <span className="text-right">
                    {newInvoiceData.checkInDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Invoice Date</span>
                  <span className="text-right">
                    {newInvoiceData.invoiceDate}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Sub Booking ID</span>
                  <span className="text-right">
                    {newInvoiceData.subBookingId}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Check-Out</span>
                  <span className="text-right">
                    {newInvoiceData.checkOutDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            {/* Mobile Card View */}
            <div className="block space-y-3 md:hidden">
              {newInvoiceData.items.map((item, index) => (
                <div key={index} className="rounded-lg border bg-white p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">
                        {index + 1}. {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Price:</span>
                      <span className="font-medium">
                        {formatCurrency(item.price, "IDR")}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-1.5">
                      <span className="font-semibold text-gray-900">
                        Total:
                      </span>
                      <div className="flex flex-col items-end gap-0.5">
                        {newInvoiceData.promo?.promo_code &&
                          item.total_before_promo > item.total && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatCurrency(item.total_before_promo, "IDR")}
                            </span>
                          )}
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.total, "IDR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto rounded-lg border md:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-900 lg:px-4 lg:py-3 lg:text-sm">
                      No.
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-900 lg:px-4 lg:py-3 lg:text-sm">
                      Description
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-900 lg:px-4 lg:py-3 lg:text-sm">
                      Qty
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-900 lg:px-4 lg:py-3 lg:text-sm">
                      Unit
                    </th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-900 lg:px-4 lg:py-3 lg:text-sm">
                      Unit Price
                    </th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-900 lg:px-4 lg:py-3 lg:text-sm">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {newInvoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2.5 text-xs lg:px-4 lg:py-3 lg:text-sm">
                        {index + 1}.
                      </td>
                      <td className="px-3 py-2.5 text-xs lg:px-4 lg:py-3 lg:text-sm">
                        {item.description}
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs lg:px-4 lg:py-3 lg:text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs lg:px-4 lg:py-3 lg:text-sm">
                        {item.unit}
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs lg:px-4 lg:py-3 lg:text-sm">
                        {formatCurrency(item.price, "IDR")}
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs font-medium lg:px-4 lg:py-3 lg:text-sm">
                        <div className="flex flex-col items-end gap-1">
                          {/* Conditionally show strikethrough price when promo is applied to this item */}
                          {newInvoiceData.promo?.promo_code &&
                            item.total_before_promo > item.total && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatCurrency(item.total_before_promo, "IDR")}
                              </span>
                            )}
                          <span>{formatCurrency(item.total, "IDR")}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="flex justify-end">
            <div className="w-full space-y-2 sm:max-w-sm">
              <div className="flex flex-col items-start gap-2 border-t pt-3 sm:flex-row sm:justify-between sm:border-t-0 sm:pt-0 sm:pb-2">
                <div>
                  <span className="text-base font-medium text-gray-900 sm:text-lg">
                    Total Room Price
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  {/* Conditionally show strikethrough price when promo is applied */}
                  {newInvoiceData.promo?.promo_code &&
                    newInvoiceData.totalBeforePromo >
                      newInvoiceData.totalPrice && (
                      <div className="mb-1 flex items-center justify-start gap-2 sm:justify-end">
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(
                            newInvoiceData.totalBeforePromo,
                            "IDR",
                          )}
                        </span>
                      </div>
                    )}
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {formatCurrency(newInvoiceData.totalPrice, "IDR")}
                  </p>
                </div>
              </div>
              {/* Conditionally show promo badge when promo code exists */}
              {newInvoiceData.promo?.promo_code && (
                <div className="flex items-end justify-start sm:justify-end">
                  <span className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">
                    Promo
                    <IconRosetteDiscount size={14} />
                    <span className="font-semibold">
                      {newInvoiceData.promo.promo_code}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mb-3 border-b pt-4 pb-3 sm:mb-4 sm:pt-6 sm:pb-4 md:pt-8">
            <p className="text-xs text-gray-600 sm:text-sm">
              Payment and cancellation policy as per contract.
            </p>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
          {/* Payment Info */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base">
              Payments
            </h4>
            <div className="space-y-1 text-xs text-gray-600 sm:text-sm">
              <p>Make checks payable to:</p>
              <p>Aina (Indira)</p>
              <p>CIMB Niaga 704 904 511 700</p>
              <p>KCP Teuku Umar - Denpasar</p>
            </div>
          </div>

          {/* Questions */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base">
              Questions
            </h4>
            <div className="space-y-1 text-xs text-gray-600 sm:text-sm">
              <p>0361 4756583</p>
              <p className="break-all">info.wtmbali@gmail.com</p>
              <p>www.wtmbali.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              className="w-full text-xs sm:text-sm"
              onClick={() => setUploadReceiptOpen(true)}
            >
              <IconCloudUpload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Payment Receipt</span>
              <span className="inline sm:hidden">Upload Receipt</span>
            </Button>
            {viewBtnReceipt && isReceiptAvailable && (
              <Button
                variant="outline"
                className="w-full bg-[#D0D6DB] text-xs sm:text-sm"
                onClick={() => setViewReceiptOpen(true)}
              >
                <IconReceipt className="h-4 w-4" /> View Receipt
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full bg-[#D0D6DB] text-xs sm:text-sm"
              onClick={handleDownloadPDF}
              disabled={state.isGeneratingPDF}
            >
              {state.isGeneratingPDF ? (
                <>
                  <IconFileDescription className="h-4 w-4" /> Generating...
                </>
              ) : (
                <>
                  <IconFileDescription className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Download Invoice (.pdf)
                  </span>
                  <span className="inline sm:hidden">Download (.pdf)</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      <UploadReceiptDialog
        open={uploadReceiptOpen}
        onOpenChange={setUploadReceiptOpen}
        subBookingId={newInvoiceData.subBookingId}
        onSuccess={() => {
          toast.success("Receipt uploaded successfully!");
        }}
      />
      <ViewReceiptDialog
        open={viewReceiptOpen}
        onOpenChange={setViewReceiptOpen}
        booking={booking}
        receipt={invoice?.receipt}
        invoiceIndex={currentInvoiceIndex}
      />
    </Dialog>
  );
};

export default ViewInvoiceDialog;
