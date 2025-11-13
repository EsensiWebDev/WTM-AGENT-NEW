"use client";

import { getData } from "@/app/(protected)/history-booking/fetch";
import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import {
  fetchListBookingStatus,
  fetchListPaymentStatus,
} from "@/server/general";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import ViewDetailDialog from "../dialog/view-detail-dialog";
import ViewInvoiceDialog from "../dialog/view-invoice-dialog";
import ViewNotesDialog from "../dialog/view-notes-dialog";
import ViewReceiptDialog from "../dialog/view-receipt-dialog";
import { getHistoryBookingTableColumns } from "./history-booking-columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsString, useQueryState } from "nuqs";

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
  const [{ data, pagination }, bookingStatusOptions, paymentStatusOptions] =
    React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<HistoryBooking> | null>(null);

  const columns = React.useMemo(
    () =>
      getHistoryBookingTableColumns({
        setRowAction,
        bookingStatusOptions,
        paymentStatusOptions,
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
  });

  const [searchBy, setSearchBy] = useQueryState(
    "search_by",
    parseAsString
      .withDefault("guest_name")
      .withOptions({ shallow: false, clearOnDefault: false }),
  );

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
    </>
  );
};

export default HistoryBookingTable;
