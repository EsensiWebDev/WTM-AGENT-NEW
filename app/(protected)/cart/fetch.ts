"use server";
import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { BookingDetail, Cart, ContactDetail } from "./types";

export async function getContactDetails(): Promise<ContactDetail[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return dummy data
  return [
    {
      id: "guest-1",
      no: 1,
      name: "John Doe",
    },
    {
      id: "guest-2",
      no: 2,
      name: "Jane Smith",
    },
    {
      id: "guest-3",
      no: 3,
      name: "Mike Johnson",
    },
  ];
}

export async function getBookingDetails(): Promise<BookingDetail[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return dummy booking data for two hotels
  return [
    {
      id: "booking-1",
      hotelName: "Grand Luxury Hotel",
      roomType: "Business King Room",
      rating: 5,
      imageSrc: "/hotel-detail/WTM Prototype.png",
      checkIn: new Date("2025-02-15"),
      checkOut: new Date("2025-02-16"),
      checkInTime: "14.00 WIB",
      checkOutTime: "Before 11.00 WIB",
      cancellationPeriod: new Date("2025-02-15"),
      rooms: [
        {
          id: "room-1",
          name: "Business King Room",
          quantity: 2,
          price: 2800000,
          includes: ["Breakfast"],
          features: ["Smoking Room"],
        },
      ],
      additionalServices: [
        {
          id: "service-1",
          name: "Additional Lunch",
          price: 1000000,
        },
      ],
      totalPrice: 3800000,
    },
    {
      id: "booking-2",
      hotelName: "Seaside Resort",
      roomType: "Deluxe Ocean View",
      rating: 4,
      imageSrc: "/hotel-detail/WTM Prototype.png",
      checkIn: new Date("2025-03-10"),
      checkOut: new Date("2025-03-12"),
      checkInTime: "15.00 WIB",
      checkOutTime: "Before 12.00 WIB",
      cancellationPeriod: new Date("2025-03-09"),
      rooms: [
        {
          id: "room-2",
          name: "Deluxe Ocean View",
          quantity: 1,
          price: 3500000,
          includes: ["Breakfast", "Welcome Drink"],
          features: ["Non-Smoking Room", "Sea View"],
        },
      ],
      additionalServices: [],
      totalPrice: 3500000,
    },
  ];
}

export async function saveContactDetails(
  guests: ContactDetail[],
): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate saving data
  console.log("Saving contact details:", guests);

  return {
    success: true,
    message: "Contact details saved successfully",
  };
}

export async function fetchCart(): Promise<ApiResponse<Cart>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `/bookings/cart`;
  const apiResponse = await apiCall<Cart>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
}
