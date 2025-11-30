import { cancelBookingAction } from "@/app/(protected)/history-booking/action";
import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { UploadReceiptDialog } from "./upload-receipt-dialog";
import ViewInvoiceDialog from "./view-invoice-dialog";
import ViewReceiptDialog from "./view-receipt-dialog";

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
      <DialogContent className="max-h-[90vh] w-[80vw] overflow-hidden bg-white px-8 sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        {booking ? (
          <div className="max-h-[calc(90vh-120px)] space-y-6 overflow-y-auto">
            <div className="overflow-x-auto">
              <Table className="min-w-full table-fixed">
                <TableHeader>
                  <TableRow className="!bg-white">
                    <TableHead>Guest Name</TableHead>
                    <TableHead>PIC Agent</TableHead>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead className="w-[200px]">Sub-booking ID</TableHead>
                    <TableHead className="w-[120px]">Booking Status</TableHead>
                    <TableHead className="w-[120px]">Payment Status</TableHead>
                    <TableHead className="w-[150px]"></TableHead>
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

                    return (
                      <TableRow
                        key={index}
                        className="[&:nth-child(odd)]:bg-white"
                      >
                        <TableCell className="font-medium capitalize">
                          {detail.guest_name}
                        </TableCell>
                        <TableCell className="capitalize">
                          {detail.agent_name}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium capitalize">
                              {detail.hotel_name}
                            </div>
                            <div className="text-muted-foreground text-sm capitalize">
                              {detail.additional?.join(", ")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{detail.sub_booking_id}</TableCell>
                        <TableCell className="capitalize">
                          <Badge
                            variant={
                              isConfirmed
                                ? "green"
                                : isWaiting
                                  ? "yellow"
                                  : "red"
                            }
                            className={"border font-medium capitalize"}
                          >
                            {detail.booking_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          <Badge
                            variant={isPaid ? "green" : "red"}
                            className={"border font-medium capitalize"}
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
                                {(() => {
                                  const invoiceCount = 1;
                                  return invoiceCount > 1 ? (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 text-xs"
                                    >
                                      {invoiceCount}
                                    </Badge>
                                  ) : null;
                                })()}
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-center gap-2 py-2">
                <Button asChild>
                  <Link href={`/contact-us?bookingId=${booking?.booking_code}`}>
                    Inquire This Booking
                  </Link>
                </Button>

                <DialogClose asChild>
                  <Button
                    variant={"secondary"}
                    className="border-primary border"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
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
