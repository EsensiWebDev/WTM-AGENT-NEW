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
  min_price: number;
  name: string;
  photo: string;
  rating: number;
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
