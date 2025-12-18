export type GuestHonorific = "Mr" | "Mrs" | "Miss";
export type GuestCategory = "Adult" | "Child";

export interface GuestPayload {
  name: string;
  honorific: GuestHonorific;
  category: GuestCategory;
  age?: number; // Required when category is "Child"
}

export type Cart = {
  detail: [
    {
      additional: [
        {
          name: string;
          price: number;
          category?: string;
          pax?: number;
        },
      ];
      bed_type?: string;
      bed_types?: string[];
      check_in_date: string;
      check_out_date: string;
      guest: string;
      hotel_name: string;
      hotel_rating: number;
      id: number;
      photo?: string;
      is_breakfast: true;
      other_preferences?: string[];
      additional_notes?: string;
      price: number;
      promo: {
        name?: string; // Promo name
        description?: string; // Promo description
        benefit?: string;
        benefit_note?: string; // Backend uses benefit_note
        code?: string;
        promo_code?: string; // Backend uses promo_code
        discount_percent?: number;
        fixed_price?: number;
        prices?: Record<string, number>; // Multi-currency prices
        type?: string;
        promo_type_id?: number; // Promo type ID
        upgraded_to_id?: number;
      };
      room_type_name: string;
      total_additional_price: number;
      total_price: number;
      cancellation_date?: string;
      /**
       * Optional currency code snapshot for this cart item (e.g. "IDR", "USD").
       * When provided, the UI will use this for price formatting.
       */
      currency?: string;
    },
  ];
  grand_total: number;
  /**
   * Optional currency code for the cart grand total.
   */
  currency?: string;
  guest: string[] | GuestPayload[];
  id: number;
};

export interface ContactDetail {
  id: string;
  no: number;
  name: string;
  honorific?: GuestHonorific;
  category?: GuestCategory;
  age?: number;
}

export interface ContactDetailsTableProps {
  data: ContactDetail[];
  onRemoveGuest: (id: string) => void;
  onUpdateGuest: (id: string, name: string) => void;
}

export interface BookingDetail {
  id: string;
  hotelName: string;
  roomType: string;
  rating: number;
  imageSrc: string;
  checkIn: Date;
  checkOut: Date;
  checkInTime: string;
  checkOutTime: string;
  cancellationPeriod: Date;
  rooms: RoomDetail[];
  additionalServices: AdditionalService[];
  totalPrice: number;
}

export interface RoomDetail {
  id: string;
  name: string;
  quantity: number;
  price: number;
  includes: string[];
  features: string[];
}

export type AdditionalServiceCategory = "price" | "pax";

export interface AdditionalService {
  id: string;
  name: string;
  category: AdditionalServiceCategory;
  price?: number; // Only set when category="price"
  pax?: number; // Only set when category="pax"
  is_required: boolean;
}
