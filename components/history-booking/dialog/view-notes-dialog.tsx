import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ViewNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: HistoryBooking | null;
}

const ViewNotesDialog: React.FC<ViewNotesDialogProps> = ({
  open,
  onOpenChange,
  booking,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    if (status === "approved" || status === "paid") {
      return "default";
    }
    if (status === "rejected" || status === "unpaid") {
      return "destructive";
    }
    return "secondary";
  };

  const getBookingStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return "border-green-200 bg-green-100 text-green-800 hover:bg-green-100";
      case "waiting":
        return "border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "rejected":
        return "border-red-200 bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getPaymentStatusStyles = (status: string) => {
    switch (status) {
      case "paid":
        return "border-green-200 bg-green-100 text-green-800 hover:bg-green-100";
      case "unpaid":
        return "border-red-200 bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "approved") return "Confirmed";
    if (status === "waiting") return "Waiting";
    if (status === "rejected") return "Rejected";
    if (status === "paid") return "Paid";
    if (status === "unpaid") return "Unpaid";
    return status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {booking ? (
            <>
              {/* Booking Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Booking Status
                </span>
                <Badge
                  variant={getStatusBadgeVariant(booking.bookingStatus)}
                  className={getBookingStatusStyles(booking.bookingStatus)}
                >
                  {getStatusLabel(booking.bookingStatus)}
                </Badge>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Payment Status
                </span>
                <Badge
                  variant={getStatusBadgeVariant(booking.paymentStatus)}
                  className={getPaymentStatusStyles(booking.paymentStatus)}
                >
                  {getStatusLabel(booking.paymentStatus)}
                </Badge>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-900">Notes</span>
                <div className="min-h-[60px] rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                  {booking.notes || "No notes available"}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-primary px-8 text-white hover:bg-gray-700"
                >
                  Close
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              No booking selected.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotesDialog;
