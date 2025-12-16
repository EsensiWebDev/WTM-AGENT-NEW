"use client";

import { ContactDetail, GuestPayload } from "@/app/(protected)/cart/types";
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
import { useQueryClient } from "@tanstack/react-query";

interface ContactDetailsTableProps {
  data: ContactDetail[];
  cart_id: number;
}

export function ContactDetailsTable({
  data,
  cart_id,
}: ContactDetailsTableProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleRemoveGuest = (contactDetail: ContactDetail) => {
    startTransition(async () => {
      try {
        // Construct GuestPayload from ContactDetail
        const guestData: GuestPayload = {
          name: contactDetail.name,
          honorific: contactDetail.honorific || "Mr",
          category: contactDetail.category || "Adult",
          age: contactDetail.age,
        };

        const response = await removeGuest({
          cart_id: cart_id,
          guestData: guestData,
        });
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
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
