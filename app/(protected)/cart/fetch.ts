"use server";
import { delay } from "@/lib/utils";
import { BookingDetail, Cart, ContactDetail } from "./types";
import { ApiResponse } from "@/types";
import { apiCall } from "@/lib/api";

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
  await delay(300);

  // return {
  //   data: {
  //     detail: [
  //       {
  //         additional: [
  //           {
  //             name: "Dinner",
  //             price: 20000,
  //           },
  //         ],
  //         check_in_date: "2023-04-01T07:00:00.000Z",
  //         check_out_date: "2023-04-03T03:00:00.000Z",
  //         guest: "John Doe",
  //         hotel_name: "Grand Hotel",
  //         hotel_rating: 5,
  //         id: 123,
  //         is_breakfast: true,
  //         price: 200000,
  //         promo: {
  //           benefit: "Free Upgrade",
  //           code: "UPGRADE",
  //           discount_percent: 10,
  //           fixed_price: 0,
  //           type: "discount",
  //           upgraded_to_id: 0,
  //         },
  //         room_type_name: "Standard Room",
  //         total_additional_price: 20000,
  //         total_price: 220000,
  //       },
  //       {
  //         additional: [],
  //         check_in_date: "2023-04-01T07:00:00.000Z",
  //         check_out_date: "2023-04-03T03:00:00.000Z",
  //         guest: "John Doe",
  //         hotel_name: "Grand Hotel",
  //         hotel_rating: 5,
  //         id: 124,
  //         is_breakfast: true,
  //         price: 200000,
  //         promo: {
  //           benefit: "Free Upgrade",
  //           code: "UPGRADE",
  //           discount_percent: 10,
  //           fixed_price: 0,
  //           type: "discount",
  //           upgraded_to_id: 0,
  //         },
  //         room_type_name: "Standard Room",
  //         total_additional_price: 20000,
  //         total_price: 220000,
  //       },
  //     ],
  //     grand_total: 220000,
  //     guest: ["John Doe"],
  //     id: 1,
  //   },
  //   message: "string",
  //   pagination: {
  //     limit: 0,
  //     page: 0,
  //     total: 0,
  //     total_pages: 0,
  //   },
  //   status: 200,
  // };

  const url = `/bookings/cart`;
  const apiResponse = await apiCall<Cart>(url);

  return apiResponse;
}
