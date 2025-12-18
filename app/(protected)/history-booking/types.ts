import { SearchParams } from "@/types";

export interface InvoiceLineItemData {
  description: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  total_before_promo: number;
  category?: string;
}

export interface PromoData {
  benefit_note?: string;
  discount_percent?: number;
  fixed_price?: number;
  name?: string;
  promo_code?: string;
  type?: string;
  upgraded_to_id?: number;
}

export interface InvoiceData {
  agent: string;
  company_agent: string;
  email: string;
  guest: string;
  hotel: string;
  check_in: string;
  check_out: string;
  sub_booking_id: string;
  description_invoice: InvoiceLineItemData[];
  promo?: PromoData;
  description: string;
  total_price: number;
  total_before_promo?: number;
  /**
   * Optional currency code for this invoice (e.g. "IDR", "USD").
   * When not provided, the UI will default to "IDR".
   */
  currency?: string;
  invoice_number: string;
  invoice_date: string;
  receipt: string;
  bed_type?: string;
  additional_notes?: string;
}

export interface AdditionalServiceDetail {
  name: string;
  category: "pax" | "price";
  price: number | null;
  pax: number | null;
  is_required: boolean;
}

export interface SubBookingDetail {
  guest_name: string;
  agent_name: string;
  hotel_name: string;
  room_type_name?: string; // Room type selected
  is_breakfast: boolean; // Whether breakfast is included
  bed_type?: string; // Selected bed type
  room_price?: number; // Room price per night (after promo if any)
  total_price?: number; // Total price including room and additional services
  currency?: string; // Currency code for prices
  check_in_date?: string; // Check-in date
  check_out_date?: string; // Check-out date
  additional: string[] | null;
  additional_services?: AdditionalServiceDetail[];
  other_preferences?: string[] | null;
  sub_booking_id: string;
  booking_status: string;
  payment_status: string;
  cancellation_date: string;
  invoice: InvoiceData;
  receipt: string;
  additional_notes?: string;
  admin_notes?: string;
}

export interface HistoryBooking {
  booking_id: number;
  guest_name: string[];
  booking_code: string;
  booking_status: string;
  payment_status: string;
  detail: SubBookingDetail[];
  invoices: InvoiceData[];
  receipts: string[] | null;
  notes?: string;
  admin_notes?: string;
}

export interface HistoryBookingPageProps {
  searchParams: Promise<SearchParams>;
}
