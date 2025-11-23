import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  fetchListBookingStatus,
  fetchListPaymentStatus,
} from "@/server/general";
import { DataTableRowAction } from "@/types/data-table";
import {
  IconCloudUpload,
  IconEye,
  IconFileDescription,
  IconNote,
  IconReceipt,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import React from "react";

interface GetHistoryBookingTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<HistoryBooking> | null>
  >;
  bookingStatusOptions: Awaited<ReturnType<typeof fetchListBookingStatus>>;
  paymentStatusOptions: Awaited<ReturnType<typeof fetchListPaymentStatus>>;
  onUploadReceipt: (bookingId: string) => void;
}

export function getHistoryBookingTableColumns({
  setRowAction,
  bookingStatusOptions,
  paymentStatusOptions,
  onUploadReceipt,
}: GetHistoryBookingTableColumnsProps): ColumnDef<HistoryBooking>[] {
  return [
    {
      id: "number",
      accessorKey: "number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="No." />
      ),
      cell: ({ row }) => row.index + 1,
      enableHiding: false,
      size: 24,
    },
    {
      id: "search",
      accessorFn: (row) => row.guest_name?.join(", ") || "Not found",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Guest Name" />
      ),
      enableHiding: false,
      meta: {
        label: "Search",
        placeholder: "Search ...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "booking_code",
      accessorKey: "booking_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID Booking" />
      ),
      enableHiding: false,
    },
    {
      id: "status_booking_id",
      accessorKey: "status_booking_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking Status" />
      ),
      cell: ({ row }) => {
        const isConfirmed = row.original.booking_status
          .toLowerCase()
          .includes("confirmed");

        const isWaiting = row.original.booking_status
          .toLowerCase()
          .includes("waiting");

        return (
          <Badge
            variant={isConfirmed ? "green" : isWaiting ? "yellow" : "red"}
            className={cn("border font-medium capitalize")}
          >
            {row.original.booking_status || "Not found"}
          </Badge>
        );
      },
      enableHiding: false,
      meta: {
        label: "Booking Status",
        placeholder: "Filter by status...",
        variant: "multiSelect",
        options: bookingStatusOptions,
      },
      enableColumnFilter: true,
    },
    {
      id: "status_payment_id",
      accessorKey: "status_payment_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.payment_status;
        const isPaid = row.original.payment_status.toLowerCase() === "paid";

        return (
          <Badge
            variant={isPaid ? "green" : "red"}
            className={cn("border font-medium capitalize")}
          >
            {status || "Not found"}
          </Badge>
        );
      },
      enableHiding: false,
      meta: {
        label: "Payment Status",
        placeholder: "Filter by payment...",
        variant: "multiSelect",
        options: paymentStatusOptions,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const invoiceCount = row.original.invoices.length || 0;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "invoice" })}
              >
                <IconFileDescription className="mr-2 h-4 w-4" />
                View Invoice
                {invoiceCount > 1 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {invoiceCount}
                  </Badge>
                )}
              </DropdownMenuItem>
              {row.original.receipts && row.original.receipts?.length > 0 && (
                <DropdownMenuItem
                  onSelect={() => setRowAction({ row, variant: "receipt" })}
                >
                  <IconReceipt className="mr-2 h-4 w-4" /> View Receipt
                </DropdownMenuItem>
              )}
              {row.original.payment_status.toLowerCase() === "unpaid" && (
                <DropdownMenuItem
                  onSelect={() =>
                    onUploadReceipt(String(row.original.booking_code))
                  }
                >
                  <IconCloudUpload className="mr-2 h-4 w-4" /> Upload Receipt
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "notes" })}
              >
                <IconNote className="mr-2 h-4 w-4" /> View Notes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "detail" })}
              >
                <IconEye className="mr-2 h-4 w-4" /> View Detail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 60,
    },
  ];
}
