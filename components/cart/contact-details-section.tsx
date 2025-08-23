"use client";

import { ContactDetail } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { SelectUserDialog } from "./dialog/select-user-dialog";
import { useGuests } from "./guest-context";
import { ContactDetailsTable } from "./table/contact-details-table";

interface ContactDetailsSectionProps {
  // No props needed anymore
}

export function ContactDetailsSection({}: ContactDetailsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { guestNames, addGuest, removeGuest } = useGuests();

  const handleAddGuest = () => {
    setIsDialogOpen(true);
  };

  const handleGuestAdded = (guestName: string) => {
    addGuest(guestName);
  };

  // Convert guestNames to ContactDetail format for the table
  const contactDetails: ContactDetail[] = guestNames.map((name, index) => ({
    id: `guest-${index}`,
    no: index + 1,
    name: name,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Contact Details</h2>
        <Button onClick={handleAddGuest} size="sm">
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
        <ContactDetailsTable data={contactDetails} />
      )}

      <SelectUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddGuest={handleGuestAdded}
      />
    </div>
  );
}
