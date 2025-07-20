import { ContactDetail } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableRowAction } from "@/types/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";

interface GetContactDetailsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ContactDetail> | null>
  >;
}

export function getContactDetailsTableColumns({
  setRowAction,
}: GetContactDetailsTableColumnsProps): ColumnDef<ContactDetail>[] {
  return [
    {
      id: "no",
      accessorKey: "no",
      header: "No.",
      cell: ({ row }) => row.original.no,
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
      enableSorting: false,
      enableHiding: false,
      size: 600,
      minSize: 300,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                setRowAction({
                  variant: "delete",
                  row,
                })
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
  ];
}
