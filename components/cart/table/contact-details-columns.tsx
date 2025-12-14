import { ContactDetail } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";

interface GetContactDetailsTableColumnsProps {
  onDeleteGuest: (contactDetail: ContactDetail) => void;
}

export function getContactDetailsTableColumns({
  onDeleteGuest,
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
      cell: ({ row }) => {
        const { honorific, name } = row.original;
        const displayName = honorific ? `${honorific} ${name}` : name;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{displayName}</span>
            {row.original.category && (
              <span className="text-xs text-gray-500">
                {row.original.category}
                {row.original.category === "Child" && row.original.age
                  ? ` (${row.original.age} ${row.original.age === 1 ? "year" : "years"})`
                  : ""}
              </span>
            )}
          </div>
        );
      },
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
            <DropdownMenuItem onClick={() => onDeleteGuest(row.original)}>
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
