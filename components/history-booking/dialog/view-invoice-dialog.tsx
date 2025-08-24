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
import { formatCurrency, formatDate } from "@/lib/format";
import { InvoiceGenerator } from "@/lib/invoice-generator";
import { PDFService } from "@/lib/pdf-service";
import { ComprehensiveInvoiceData, InvoiceDialogState } from "@/types/invoice";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCloudUpload,
  IconFileDescription,
  IconFileText,
  IconRosetteDiscount,
} from "@tabler/icons-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: HistoryBooking | null;
}

const ViewInvoiceDialog: React.FC<ViewInvoiceDialogProps> = ({
  open,
  onOpenChange,
  booking,
}) => {
  const [state, setState] = useState<InvoiceDialogState>({
    isGeneratingPDF: false,
    invoiceData: null,
    error: null,
    isLoading: false,
  });
  const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(0);

  // Helper function to get consistent invoice count
  const getInvoiceCount = useCallback((booking: HistoryBooking): number => {
    // Generate invoice count based on booking ID to ensure consistency
    const hash = booking.bookingId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 3) + 1; // 1-3 invoices
  }, []);

  // Generate multiple invoice data when booking changes
  const allInvoiceData = useMemo<ComprehensiveInvoiceData[]>(() => {
    if (!booking) return [];
    try {
      // Use consistent invoice count logic
      const invoiceCount = getInvoiceCount(booking);
      const invoices: ComprehensiveInvoiceData[] = [];

      for (let i = 0; i < invoiceCount; i++) {
        const invoice = InvoiceGenerator.generateFromBooking(booking);
        // Make each invoice slightly different by modifying the invoice number
        invoice.invoiceNumber =
          invoice.invoiceNumber + (i > 0 ? `-${i + 1}` : "");
        invoices.push(invoice);
      }

      return invoices;
    } catch (error) {
      console.error("Failed to generate invoice data:", error);
      return [];
    }
  }, [booking, getInvoiceCount]);

  // Get current invoice data
  const invoiceData = useMemo<ComprehensiveInvoiceData | null>(() => {
    return allInvoiceData[currentInvoiceIndex] || null;
  }, [allInvoiceData, currentInvoiceIndex]);

  // Navigation functions
  const navigateToPrevious = useCallback(() => {
    setCurrentInvoiceIndex((prev) =>
      prev > 0 ? prev - 1 : allInvoiceData.length - 1,
    );
  }, [allInvoiceData.length]);

  const navigateToNext = useCallback(() => {
    setCurrentInvoiceIndex((prev) =>
      prev < allInvoiceData.length - 1 ? prev + 1 : 0,
    );
  }, [allInvoiceData.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open || allInvoiceData.length <= 1) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, allInvoiceData.length, navigateToPrevious, navigateToNext]);

  // Reset navigation when dialog opens/closes or booking changes
  useEffect(() => {
    setCurrentInvoiceIndex(0);
  }, [booking, open]);

  // Update state when invoice data changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      invoiceData,
      error: invoiceData ? null : "Failed to generate invoice data",
    }));
  }, [invoiceData]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoiceData) {
      toast.error("No invoice data available");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isGeneratingPDF: true, error: null }));

      // Validate invoice data
      const validation = PDFService.validateInvoiceData(invoiceData);
      if (!validation.isValid) {
        throw new Error(
          `Invalid invoice data: ${validation.errors.join(", ")}`,
        );
      }

      // Generate and download PDF
      await PDFService.generateAndDownloadInvoice(invoiceData, (step) => {
        // You could show progress here if needed
        console.log("PDF Generation:", step);
      });

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

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-7xl px-8">
          <DialogHeader>
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground py-8 text-center">
            No booking selected.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!invoiceData) {
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
      <DialogContent className="max-h-[90vh] min-w-7xl overflow-y-auto bg-white px-8">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="sr-only flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Invoice #{invoiceData.invoiceNumber}
            </div>

            {/* Navigation arrows for multiple invoices */}
            {allInvoiceData.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={navigateToPrevious}
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
                  className="h-8 w-8 p-0"
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {state.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          {/* Company Header */}
          <div className="flex items-start justify-between pb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">
                PT. World Travel Marketing Bali test
              </h2>
              <p className="text-sm text-gray-600">
                Ikat Plaza Building - Jl. Bypass Ngurah Rai No. 505
              </p>
              <p className="text-sm text-gray-600">
                Pemogan - Denpasar Selatan
              </p>
              <p className="text-sm text-gray-600">
                80221 Denpasar - Bali - Indonesia
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
              <p className="text-2xl font-bold text-gray-700">
                #{invoiceData.invoiceNumber}
              </p>
            </div>
          </div>

          <Separator />

          {/* Billing and Invoice Details */}
          <h3 className="mb-3 font-semibold text-gray-900">Bill To:</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Bill To */}
            <div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {invoiceData.customer.companyName || "Company Name"}
                </p>
                <p>{invoiceData.customer.agentName || "Agent Name"}</p>
                <p>{invoiceData.customer.email || "email@client.com"}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Villa</span>
                  <span>{invoiceData.hotelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest Name</span>
                  <span>{formatDate(invoiceData.checkInDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Period</span>
                  <span>{formatDate(invoiceData.checkOutDate)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date</span>
                  <span>{formatDate(invoiceData.invoiceDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmation Number</span>
                  <span>{invoiceData.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">COD</span>
                  <span>{formatDate(invoiceData.checkOutDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-4 py-3 text-sm">1.</td>
                    <td className="px-4 py-3 text-sm">
                      Room Costs - {invoiceData.roomType}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {invoiceData.numberOfNights}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">Nights</td>
                    <td className="px-4 py-3 text-right text-sm">
                      {formatCurrency(
                        invoiceData.subtotal / invoiceData.numberOfNights,
                        invoiceData.currency,
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatCurrency(
                        invoiceData.subtotal,
                        invoiceData.currency,
                      )}
                    </td>
                  </tr>
                  {invoiceData.serviceFee > 0 && (
                    <tr>
                      <td className="px-4 py-3 text-sm">2.</td>
                      <td className="px-4 py-3 text-sm">
                        Surcharge - Service Fee
                      </td>
                      <td className="px-4 py-3 text-center text-sm">1</td>
                      <td className="px-4 py-3 text-center text-sm">Item</td>
                      <td className="px-4 py-3 text-right text-sm">
                        {formatCurrency(
                          invoiceData.serviceFee,
                          invoiceData.currency,
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {formatCurrency(
                          invoiceData.serviceFee,
                          invoiceData.currency,
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-start justify-between border-b pb-2">
                <div>
                  <span className="text-lg font-medium text-gray-900">
                    Total Room Price
                  </span>
                  <p className="mt-1 text-sm text-gray-600">
                    {invoiceData.numberOfGuests} room(s),{" "}
                    {invoiceData.numberOfNights} night
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-1 flex items-center justify-end gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">
                      <IconRosetteDiscount size={14} />
                      3D2NIGHT15
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(
                        invoiceData.subtotal + invoiceData.serviceFee,
                        invoiceData.currency,
                      )}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      invoiceData.totalAmount,
                      invoiceData.currency,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mb-4 border-b pt-8 pb-4">
            <p className="text-sm text-gray-600">
              Payment and cancellation policy as per contract.
            </p>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Payment Info */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Payments</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Make checks payable to:</p>
              <p>Aina (Indira)</p>
              <p>CIMB Niaga 704 904 511 700</p>
              <p>KCP Teuku Umar - Denpasar</p>
            </div>
          </div>

          {/* Questions */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Questions</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>0361 4756583</p>
              <p>info.wtmbali@gmail.com</p>
              <p>www.wtmbali.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button className="w-full">
              <IconCloudUpload /> Upload Payment Receipt
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[#D0D6DB]"
              onClick={handleDownloadPDF}
              disabled={state.isGeneratingPDF}
            >
              {state.isGeneratingPDF ? (
                <>
                  <IconFileDescription /> Generating...
                </>
              ) : (
                <>
                  <IconFileDescription />
                  Download Invoice (.pdf)
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDialog;
