"use client";

import { ContactDetail } from "@/app/(protected)/cart/types";
import { DataTable } from "@/components/data-table/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const handleRemoveGuest = (contactDetail: ContactDetail) => {
    startTransition(async () => {
      try {
        // Reconstruct full name with honorific for API
        const fullName = contactDetail.honorific
          ? `${contactDetail.honorific} ${contactDetail.name}`
          : contactDetail.name;

        const response = await removeGuest({
          cart_id: cart_id,
          guest: fullName,
        });
        if (response.success) {
          toast.success(response.message || "Guest removed successfully!");
        } else {
          toast.error(
            response.message || "Failed to remove guest. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to remove guest. Please try again.");
      }
    });
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
