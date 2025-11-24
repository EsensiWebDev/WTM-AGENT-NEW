"use client";

import { getData } from "@/app/(protected)/history-booking/fetch";
import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "@/hooks/use-data-table";
import {
  fetchListBookingStatus,
  fetchListPaymentStatus,
} from "@/server/general";
import type { DataTableRowAction } from "@/types/data-table";
import { AlertCircle } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import React, { useTransition } from "react";
import { UploadReceiptDialog } from "../dialog/upload-receipt-dialog";
import ViewDetailDialog from "../dialog/view-detail-dialog";
import ViewInvoiceDialog from "../dialog/view-invoice-dialog";
import ViewNotesDialog from "../dialog/view-notes-dialog";
import ViewReceiptDialog from "../dialog/view-receipt-dialog";
import { getHistoryBookingTableColumns } from "./history-booking-columns";

interface HistoryBookingTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getData>>,
      Awaited<ReturnType<typeof fetchListBookingStatus>>,
      Awaited<ReturnType<typeof fetchListPaymentStatus>>,
    ]
  >;
}

const HistoryBookingTable = ({ promises }: HistoryBookingTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [
    { status, data, message, pagination },
    bookingStatusOptions,
    paymentStatusOptions,
  ] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<HistoryBooking> | null>(null);
  const [uploadReceiptOpen, setUploadReceiptOpen] = React.useState(false);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] =
    React.useState<{ bookingId?: string; subBookingId?: string } | null>(null);

  const columns = React.useMemo(
    () =>
      getHistoryBookingTableColumns({
        setRowAction,
        bookingStatusOptions,
        paymentStatusOptions,
        onUploadReceipt: (bookingId: string) => {
          setSelectedBookingForReceipt({ bookingId });
          setUploadReceiptOpen(true);
        },
      }),
    [],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pagination?.total_pages || 1,
    getRowId: (originalRow) => originalRow.booking_id.toString(),
    shallow: false,
    // clearOnDefault: true,
    startTransition,
    debounceMs: 500,
  });

  const [searchBy, setSearchBy] = useQueryState(
    "search_by",
    parseAsString
      .withDefault("guest_name")
      .withOptions({ shallow: false, clearOnDefault: false }),
  );

  if (status !== 200) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Booking History</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              {message ||
                "Failed to load booking history. The server returned an error."}
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <DataTable table={table} isPending={isPending}>
          <DataTableToolbar
            table={table}
            isPending={isPending}
            reverseOrderChild
          >
            <Select
              defaultValue={searchBy}
              onValueChange={(value) => setSearchBy(value)}
            >
              <SelectTrigger className="!h-8 bg-white">
                <SelectValue placeholder="Select search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest_name">Guest Name</SelectItem>
                <SelectItem value="booking_id">ID Booking</SelectItem>
              </SelectContent>
            </Select>
          </DataTableToolbar>
        </DataTable>
      </div>
      <ViewInvoiceDialog
        open={rowAction?.variant === "invoice"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <ViewReceiptDialog
        open={rowAction?.variant === "receipt"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <ViewNotesDialog
        open={rowAction?.variant === "notes"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <ViewDetailDialog
        open={rowAction?.variant === "detail"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <UploadReceiptDialog
        open={uploadReceiptOpen}
        onOpenChange={setUploadReceiptOpen}
        bookingId={selectedBookingForReceipt?.bookingId}
        subBookingId={selectedBookingForReceipt?.subBookingId}
        onSuccess={() => {
          setSelectedBookingForReceipt(null);
          startTransition(() => {});
        }}
      />
    </>
  );
};

export default HistoryBookingTable;
