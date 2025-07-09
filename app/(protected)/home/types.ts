export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  star: number;
  bedType: string;
  guestCount: number;
  image?: string;
}

export interface HotelListResponse {
  success: boolean;
  data: Hotel[];
  pageCount: number;
}
