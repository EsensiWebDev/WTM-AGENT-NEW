"use client";

import { ContactDetail, GuestPayload } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useTransition } from "react";
import { SelectUserDialog } from "./dialog/select-user-dialog";
import { ContactDetailsTable } from "./table/contact-details-table";
import { toast } from "sonner";
import { addGuest } from "@/app/(protected)/cart/actions";
import { useQueryClient } from "@tanstack/react-query";

interface ContactDetailsSectionProps {
  guests: (string | GuestPayload)[] | null;
  cart_id: number;
}

export function ContactDetailsSection({
  guests,
  cart_id,
}: ContactDetailsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const openGuestDialog = () => {
    setIsDialogOpen(true);
  };

  const handleAddGuest = (guestData: GuestPayload[]) => {
    startTransition(async () => {
      try {
        const response = await addGuest({
          cart_id: cart_id,
          guestData: guestData,
        });
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(response.message || "Guest(s) added successfully!");
        } else {
          toast.error(
            response.message || "Failed to add guest. Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to add guest. Please try again.");
      }
    });
  };

  // Parse guests to ContactDetail[]
  const parseGuestName = (
    guest: string | GuestPayload,
  ): Pick<ContactDetail, "name" | "honorific" | "category" | "age"> => {
    if (typeof guest === "string") {
      return { name: guest };
    }
    return {
      name: guest.name,
      honorific: guest.honorific,
      category: guest.category,
      age: guest.age,
    };
  };

  const contactDetails: ContactDetail[] = !guests
    ? []
    : guests.map((guest, index) => {
        const parsed = parseGuestName(guest);
        return {
          id: `guest-${index}`,
          no: index + 1,
          ...parsed,
        };
      });

  // Extract existing guests as GuestPayload[] for duplicate checking
  const existingGuests: GuestPayload[] = guests
    ? guests
        .filter((g): g is GuestPayload => typeof g !== "string")
        .map((g) => ({
          name: g.name,
          honorific: g.honorific,
          category: g.category,
          age: g.age,
        }))
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Details</h2>
        <Button onClick={openGuestDialog} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>

      {contactDetails.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          <p>No guests added yet.</p>
          <p className="text-sm">
            Click &quot;Add Guest&quot; to start adding contact details.
          </p>
        </div>
      ) : (
        <ContactDetailsTable data={contactDetails} cart_id={cart_id} />
      )}

      <SelectUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddGuest={handleAddGuest}
        existingGuests={existingGuests}
      />
    </div>
  );
}
