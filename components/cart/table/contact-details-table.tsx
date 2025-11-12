"use client";

import { ContactDetail } from "@/app/(protected)/cart/types";
import { DataTable } from "@/components/data-table/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { toast } from "sonner";
import { getContactDetailsTableColumns } from "./contact-details-columns";
import { removeGuest } from "@/app/(protected)/cart/actions";

interface ContactDetailsTableProps {
  data: ContactDetail[];
  cart_id: number;
}

export function ContactDetailsTable({
  data,
  cart_id,
}: ContactDetailsTableProps) {
  const handleRemoveGuest = (contactDetail: ContactDetail) => {
    toast.promise(
      removeGuest({ cart_id: cart_id, guest: contactDetail.name }),
      {
        loading: "Removing guest...",
        success: ({ message }) => message || "Guest removed successfully!",
        error: ({ message }) =>
          message || "Failed to remove guest. Please try again.",
      },
    );
  };

  const columns = React.useMemo(
    () =>
      getContactDetailsTableColumns({
        onDeleteGuest: handleRemoveGuest,
      }),
    [],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return <DataTable table={table} />;
}
