"use client";

import { ContactDetail } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { SelectUserDialog } from "./dialog/select-user-dialog";
import { useGuests } from "./guest-context";
import { ContactDetailsTable } from "./table/contact-details-table";
import { toast } from "sonner";
import { addGuest } from "@/app/(protected)/cart/actions";

interface ContactDetailsSectionProps {
  guests: string[] | null;
  cart_id: number;
}

export function ContactDetailsSection({
  guests,
  cart_id,
}: ContactDetailsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const openGuestDialog = () => {
    setIsDialogOpen(true);
  };

  const handleAddGuest = (guestName: string) => {
    toast.promise(addGuest({ cart_id: cart_id, guest: guestName }), {
      loading: "Adding guest...",
      success: ({ message }) => message || "Guest added successfully!",
      error: ({ message }) =>
        message || "Failed to add guest. Please try again.",
    });
  };

  const contactDetails: ContactDetail[] = !guests
    ? []
    : guests.map((name, index) => ({
        id: `guest-${index}`,
        no: index + 1,
        name: name,
      }));

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
      />
    </div>
  );
}
