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
  const isConfirmed = booking?.booking_status
    .toLowerCase()
    .includes("confirmed");

  const isWaiting = booking?.booking_status.toLowerCase().includes("waiting");

  const isPaid = booking?.payment_status.toLowerCase() === "paid";

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
                  variant={isConfirmed ? "green" : isWaiting ? "yellow" : "red"}
                  className="capitalize"
                >
                  {booking.booking_status}
                </Badge>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Payment Status
                </span>
                <Badge
                  variant={isPaid ? "green" : "red"}
                  className={"capitalize"}
                >
                  {booking.payment_status}
                </Badge>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-900">Notes</span>
                <div className="min-h-[60px] rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                  {booking.admin_notes || 
                   booking.notes || 
                   (booking.detail && booking.detail.length > 0 && booking.detail[0]?.admin_notes) ||
                   "No notes available"}
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
