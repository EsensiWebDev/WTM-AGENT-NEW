import BookingDetailsSection from "@/components/cart/booking-details-section";
import { ContactDetailsSection } from "@/components/cart/contact-details-section";
import { GuestProvider } from "@/components/cart/guest-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { fetchCart } from "./fetch";

const CartPage = async () => {
  // Fetch booking details only since guest data is now handled by context
  const { data: cartData } = await fetchCart();
  const guests = cartData?.guest;
  const hasBookings = cartData?.detail && Array.isArray(cartData.detail) && cartData.detail.length > 0;

  return (
    <GuestProvider>
      <div className="container mx-auto space-y-6 py-6">
        <div className="grid gap-6">
          <React.Suspense
            fallback={
              <Card className="p-6">
                <Skeleton className="mb-4 h-8 w-48" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            }
          >
            <ContactDetailsSection 
              guests={guests} 
              cart_id={cartData?.id || 0} 
              hasBookings={hasBookings}
            />
          </React.Suspense>
          <React.Suspense
            fallback={
              <Card className="p-6">
                <Skeleton className="mb-4 h-8 w-48" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </Card>
            }
          >
            <BookingDetailsSection cartData={cartData} />
          </React.Suspense>
        </div>
      </div>
    </GuestProvider>
  );
};

export default CartPage;
