import { SearchParams } from "@/types";

export interface FilterBedTypes {
  bed_type: string;
  bed_type_id: number;
  count: number;
}

export type FilterDistricts = string[];

export interface FilterPricing {
  max_price: number;
  min_price: number;
  /**
   * Optional currency code for this price range (e.g. "IDR", "USD").
   * Falls back to the agent's default currency or "IDR" when not provided.
   */
  currency?: string;
}
export interface FilterRatings {
  rating: number;
  count: number;
}
export interface FilterTotalRooms {
  count: number;
  total_bed_rooms: number;
}

export interface Hotel {
  address: string;
  id: number;
  min_price: number; // DEPRECATED: Use prices instead
  /**
   * Multi-currency prices keyed by currency code, e.g. {"IDR": 500000, "USD": 200}.
   * When present, use prices[currency] instead of min_price.
   */
  prices?: Record<string, number>;
  name: string;
  photo: string;
  rating: number;
  /**
   * Optional currency code for the minimum price shown in the hotel card.
   * When omitted, the UI will fall back to the selected/display currency.
   */
  currency?: string;
}

export interface HotelListData {
  filter_bed_types: FilterBedTypes[];
  filter_districts: FilterDistricts;
  filter_pricing: FilterPricing;
  filter_ratings: FilterRatings[];
  filter_total_rooms: FilterTotalRooms[];
  hotels: Hotel[];
  total: number;
}

export interface PromoHomePage {
  code: string;
  description: string;
  hotel: string[];
  id: number;
  name: string;
  total_nights?: number; // Optional: minimum nights required for this promo
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  description: string;
}

export interface HomePageProps {
  searchParams: Promise<SearchParams>;
}
