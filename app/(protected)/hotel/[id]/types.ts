export interface HotelDetail {
  id: number;
  name: string;
  province: string;
  city: string;
  sub_district: string;
  description: string;
  photos: string[];
  rating: number;
  email: string;
  facilities: string[];
  nearby_place: NearbyPlace[];
  social_media: SocialMedia[];
  room_type: RoomType[];
  cancellation_period: number;
  check_in_hour: string;
  check_out_hour: string;
}

export interface NearbyPlace {
  id: number;
  name: string;
  radius: number;
}

export interface SocialMedia {
  platform: string;
  link: string;
}

export interface RoomType {
  name: string;
  without_breakfast: PriceOption;
  with_breakfast: PriceOption;
  room_size: number;
  max_occupancy: number;
  bed_types: string[];
  is_smoking_room: boolean;
  additional: AdditionalService[];
  description: string;
  promos: Promo[];
  photos: string[];
}

export interface PriceOption {
  id: number;
  price: number;
  pax: number;
  is_show: boolean;
}

export type AdditionalServiceCategory = "price" | "pax";

export interface AdditionalService {
  id: number;
  name: string;
  category: AdditionalServiceCategory;
  price?: number; // Only set when category="price"
  pax?: number; // Only set when category="pax"
  is_required: boolean;
}

export interface Promo {
  promo_id: number;
  description: string;
  code_promo: string;
  price_with_breakfast: number;
  price_without_breakfast: number;
  total_nights: number;
  other_notes: string;
}
