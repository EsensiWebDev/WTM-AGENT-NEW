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
  other_preferences?: OtherPreference[];
  description: string;
  promos: Promo[];
  photos: string[];
}

export interface OtherPreference {
  id: number;
  name: string;
}

export interface PriceOption {
  id: number;
  price: number;
  /**
   * Multi-currency prices keyed by currency code, e.g. {"IDR": 1600000, "USD": 100}.
   * This mirrors the backend `Prices` field and is preferred over `price` when present.
   */
  prices?: Record<string, number>;
  pax: number;
  is_show: boolean;
}

export interface AdditionalService {
  id: number;
  name: string;
  price: number;
  /**
   * Multi-currency prices keyed by currency code, mirroring the backend `Prices` field.
   * When present, the UI will use this map to display the price in the selected currency.
   */
  prices?: Record<string, number>;
  category?: "price" | "pax";
  pax?: number;
  is_required?: boolean;
}

export interface Promo {
  promo_id: number;
  description: string;
  code_promo: string;
  price_with_breakfast: number;
  price_without_breakfast: number;
  total_nights: number;
  other_notes: string;
  promo_type_id?: number;
  promo_type_name?: string;
  detail?: {
    discount_percentage?: number;
    fixed_price?: number; // DEPRECATED: Use prices instead
    prices?: Record<string, number>; // Multi-currency prices
    upgraded_to_id?: number;
    benefit_note?: string;
  };
}
