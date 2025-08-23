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
}

export function getHistoryBookingTableColumns({
  setRowAction,
}: GetHistoryBookingTableColumnsProps): ColumnDef<HistoryBooking>[] {
  return [
    {
      id: "number",
      accessorKey: "number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="No." />
      ),
      cell: ({ row }) => row.original.number,
      enableHiding: false,
      size: 24,
    },
    {
      id: "guestName",
      accessorKey: "guestName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Guest Name" />
      ),
      cell: ({ row }) => row.original.guestName,
      enableHiding: false,
      meta: {
        label: "Guest Name",
        placeholder: "Search guest name...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "bookingId",
      accessorKey: "bookingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID Booking" />
      ),
      cell: ({ row }) => row.original.bookingId,
      enableHiding: false,
    },
    {
      id: "bookingStatus",
      accessorKey: "bookingStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.bookingStatus;
        let color = "";
        let label = "";
        switch (status) {
          case "approved":
            color = "bg-green-100 text-green-700 border-green-200";
            label = "Approved";
            break;
          case "waiting":
            color = "bg-yellow-100 text-yellow-700 border-yellow-200";
            label = "Waiting Approval";
            break;
          default:
            color = "bg-red-100 text-red-700 border-red-200";
            label = "Rejected";
        }
        return <Badge className={`border font-medium ${color}`}>{label}</Badge>;
      },
      enableHiding: false,
      meta: {
        label: "Booking Status",
        placeholder: "Filter by status...",
        variant: "multiSelect",
        options: [
          { label: "Approved", value: "approved" },
          { label: "Waiting Approval", value: "waiting" },
          { label: "Rejected", value: "rejected" },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "paymentStatus",
      accessorKey: "paymentStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.paymentStatus;
        let color = "";
        let label = "";
        switch (status) {
          case "paid":
            color = "bg-green-100 text-green-700 border-green-200";
            label = "Paid";
            break;
          default:
            color = "bg-red-100 text-red-700 border-red-200";
            label = "Unpaid";
        }
        return <Badge className={`border font-medium ${color}`}>{label}</Badge>;
      },
      enableHiding: false,
      meta: {
        label: "Payment Status",
        placeholder: "Filter by payment...",
        variant: "multiSelect",
        options: [
          { label: "Paid", value: "paid" },
          { label: "Unpaid", value: "unpaid" },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
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
                <IconFileDescription className="mr-2 h-4 w-4" /> View Invoice
              </DropdownMenuItem>
              {row.original.paymentStatus === "paid" && (
                <DropdownMenuItem
                  onSelect={() => setRowAction({ row, variant: "receipt" })}
                >
                  <IconReceipt className="mr-2 h-4 w-4" /> View Receipt
                </DropdownMenuItem>
              )}
              {row.original.paymentStatus === "unpaid" && (
                <DropdownMenuItem
                  onSelect={() => setRowAction({ row, variant: "receipt" })}
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
