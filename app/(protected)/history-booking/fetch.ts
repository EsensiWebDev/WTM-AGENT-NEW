import { SearchParams } from "@/types";
import { HistoryBooking, HistoryBookingTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<HistoryBookingTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data: HistoryBooking[] = [
    {
      id: "1",
      number: 1,
      guestName: "John Doe",
      bookingId: "BK-001",
      bookingStatus: "approved",
      paymentStatus: "paid",
      notes: "VIP guest, early check-in.",
    },
    {
      id: "2",
      number: 2,
      guestName: "Jane Smith",
      bookingId: "BK-002",
      bookingStatus: "waiting",
      paymentStatus: "unpaid",
      notes: "Requires airport pickup.",
    },
    {
      id: "3",
      number: 3,
      guestName: "Alice Brown",
      bookingId: "BK-003",
      bookingStatus: "rejected",
      paymentStatus: "unpaid",
      notes: "Card declined.",
    },
  ];

  return {
    success: true,
    data,
    pageCount: 1,
  };
};
