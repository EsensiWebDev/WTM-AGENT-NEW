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
import { useGuests } from "../guest-context";
import { getContactDetailsTableColumns } from "./contact-details-columns";

interface ContactDetailsTableProps {
  data: ContactDetail[];
}

export function ContactDetailsTable({ data }: ContactDetailsTableProps) {
  const { removeGuest } = useGuests();

  const handleDeleteGuest = (contactDetail: ContactDetail) => {
    // Extract index from the ID (format: "guest-{index}")
    const index = parseInt(contactDetail.id.replace("guest-", ""));
    removeGuest(index);
    toast.success(`Guest "${contactDetail.name}" removed successfully`);
  };

  const columns = React.useMemo(
    () =>
      getContactDetailsTableColumns({
        onDeleteGuest: handleDeleteGuest,
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
