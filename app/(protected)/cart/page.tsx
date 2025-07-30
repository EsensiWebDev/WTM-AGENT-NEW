import BookingDetailsSection from "@/components/cart/booking-details-section";
import { ContactDetailsSection } from "@/components/cart/contact-details-section";
import React from "react";
import { getBookingDetails, getContactDetails } from "./fetch";

const CartPage = async () => {
  // Fetch data in parallel
  const [initialGuests, bookingDetails] = await Promise.all([
    getContactDetails(),
    getBookingDetails(),
  ]);

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="grid gap-6">
        <React.Suspense fallback="Loading...">
          <ContactDetailsSection initialGuests={initialGuests} />
        </React.Suspense>
        <React.Suspense fallback="Loading...">
          <BookingDetailsSection bookingDetailsList={bookingDetails} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default CartPage;
