"use client";

import { ContactDetail } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useTransition } from "react";
import { SelectUserDialog } from "./dialog/select-user-dialog";
import { ContactDetailsTable } from "./table/contact-details-table";
import { toast } from "sonner";
import { addGuest } from "@/app/(protected)/cart/actions";

interface ContactDetailsSectionProps {
  guests: string[] | null;
  cart_id: number;
  hasBookings?: boolean;
}

export function ContactDetailsSection({
  guests,
  cart_id,
  hasBookings = false,
}: ContactDetailsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const openGuestDialog = () => {
    if (!hasBookings) {
      toast.error("Please add a booking to your cart before adding guests.");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleAddGuest = (guests: Array<{
    honorific: "Mr" | "Mrs" | "Miss";
    name: string;
    category: "Adult" | "Child";
    age?: number;
  }>) => {
    startTransition(async () => {
      try {
        // Prepare structured guest data for API
        const guestData = guests.map((guest) => ({
          name: guest.name.trim(),
          honorific: guest.honorific,
          category: guest.category,
          ...(guest.category === "Child" && guest.age !== undefined
            ? { age: guest.age }
            : {}),
        }));

        // Add all guests at once with structured data
        const response = await addGuest({ 
          cart_id: cart_id, 
          guestData: guestData 
        });
        
        if (response.success) {
          const guestCount = guests.length;
          toast.success(
            response.message || 
            `${guestCount} guest${guestCount > 1 ? "s" : ""} added successfully!`
          );
        } else {
          toast.error(
            response.message || "Failed to add guest(s). Please try again.",
          );
        }
      } catch (error) {
        toast.error("Failed to add guest(s). Please try again.");
      }
    });
  };

  // Parse guest names to extract honorifics if present
  const parseGuestName = (fullName: string): Pick<ContactDetail, "name" | "honorific"> => {
    const honorifics = ["Mr", "Mrs", "Miss"];
    const parts = fullName.trim().split(" ");
    
    // Check if first part is an honorific
    if (parts.length > 1 && honorifics.includes(parts[0])) {
      return {
        honorific: parts[0] as "Mr" | "Mrs" | "Miss",
        name: parts.slice(1).join(" "),
      };
    }
    
    return {
      name: fullName,
    };
  };

  const contactDetails: ContactDetail[] = !guests
    ? []
    : guests.map((fullName, index) => {
        const parsed = parseGuestName(fullName);
        return {
          id: `guest-${index}`,
          no: index + 1,
          name: parsed.name,
          honorific: parsed.honorific,
          // Note: category and age are not available from API yet
          // They will be populated when backend is updated
        };
      });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Details</h2>
        <Button 
          onClick={openGuestDialog} 
          size="sm"
          disabled={!hasBookings}
          title={!hasBookings ? "Please add a booking to your cart first" : undefined}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>

      {!hasBookings ? (
        <div className="text-muted-foreground py-8 text-center">
          <p>No bookings in cart yet.</p>
          <p className="text-sm">
            Please add a booking to your cart before adding guests.
          </p>
        </div>
      ) : contactDetails.length === 0 ? (
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
