import { Hotel, HotelListResponse } from "./types";

export const getHotels = async (): Promise<HotelListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Hotel Bali",
      location: "Bali",
      price: 500000,
      star: 5,
      bedType: "Twin Bed",
      guestCount: 2,
      image: undefined,
    },
    {
      id: "2",
      name: "Hotel Jakarta",
      location: "Jakarta",
      price: 400000,
      star: 4,
      bedType: "King Size Bed",
      guestCount: 2,
      image: undefined,
    },
  ] as Hotel[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};
