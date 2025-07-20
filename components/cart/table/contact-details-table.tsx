"use client";

import { ContactDetail } from "@/app/(protected)/cart/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import { DeleteContactDetailDialog } from "../dialog/delete-contact-detail-dialog";
import { getContactDetailsTableColumns } from "./contact-details-columns";

interface ContactDetailsTableProps {
  data: ContactDetail[];
}

export function ContactDetailsTable({ data }: ContactDetailsTableProps) {
  const [isPending, startTransition] = useTransition();
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<ContactDetail> | null>(null);

  const columns = React.useMemo(
    () =>
      getContactDetailsTableColumns({
        setRowAction,
      }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1, // Since this is a simple table without pagination
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    startTransition,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
  });

  return (
    <>
      <div className="relative">
        <DataTable table={table} isPending={isPending}>
          <DataTableToolbar table={table} isPending={isPending} />
        </DataTable>
      </div>
      <DeleteContactDetailDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        contactDetail={rowAction?.row.original ?? null}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
