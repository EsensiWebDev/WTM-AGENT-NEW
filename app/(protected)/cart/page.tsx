import BookingDetailsSection from "@/components/cart/booking-details-section";
import { ContactDetailsSection } from "@/components/cart/contact-details-section";
import { GuestProvider } from "@/components/cart/guest-context";
import React from "react";
import { getBookingDetails } from "./fetch";

const CartPage = async () => {
  // Fetch booking details only since guest data is now handled by context
  const bookingDetails = await getBookingDetails();

  return (
    <GuestProvider>
      <div className="container mx-auto space-y-6 py-6">
        <div className="grid gap-6">
          <React.Suspense fallback="Loading...">
            <ContactDetailsSection />
          </React.Suspense>
          <React.Suspense fallback="Loading...">
            <BookingDetailsSection bookingDetailsList={bookingDetails} />
          </React.Suspense>
        </div>
      </div>
    </GuestProvider>
  );
};

export default CartPage;
