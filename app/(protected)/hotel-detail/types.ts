// =========================
// Shared Types
// =========================

export interface Feature {
  icon: string;
  text: string;
}

export interface NearbyPlace {
  name: string;
  distance: string;
}

// =========================
// Hotel Detail Types
// =========================

export interface HotelDetail {
  description: string;
  facilities: string[];
  images: string[];
  isPromoted?: boolean; // true if hotel is promoted
  location: string;
  name: string;
  nearby: NearbyPlace[]; // nearby places
  price: number;
  promoText?: string;
  rating: number;
  rooms: Room[];
}

// =========================
// Room Types
// =========================

export interface Room {
  additionals?: AdditionalService[]; // additional services available
  features: Feature[]; // room features with icon
  images: string[];
  name: string;
  options: RoomOption[];
}

export interface RoomOption {
  includes?: string; // included amenities or services
  label: string; // option label (e.g., 'Deluxe', 'Suite')
  price: number; // current price
}

export interface AdditionalService {
  id: string;
  label: string; // service name (e.g., 'Lunch', 'Dinner', 'Extra Bed')
  price: number; // additional cost
}

// =========================
// Gallery Props
// =========================

export interface HotelGalleryProps {
  images?: string[];
  maxDisplay?: number; // max images to display
}

// =========================
// Info Props
// =========================

export interface HotelInfoProps {
  description: string;
  facilities: string[];
  isPromoted?: boolean;
  location: string;
  name: string;
  nearby: NearbyPlace[];
  price: number;
  promoText?: string;
  rating: number;
}

// =========================
// Room Card Props
// =========================

export interface RoomCardProps {
  additionals?: AdditionalService[]; // additional services available
  features: Feature[];
  images: string[];
  name: string;
  options: RoomOption[];
}
