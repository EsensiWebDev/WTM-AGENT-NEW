import { HistoryBooking } from "@/app/(protected)/history-booking/types";

export interface InvoiceData {
  // Basic booking information
  bookingId: string;
  guestName: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;

  // Hotel information
  hotelName: string;
  hotelAddress: string;
  roomType: string;
  numberOfNights: number;
  numberOfGuests: number;

  // Financial details
  basePrice: number;
  taxes: number;
  serviceFee: number;
  discount: number;
  totalAmount: number;
  currency: string;

  // Status information
  bookingStatus: "approved" | "waiting" | "rejected";
  paymentStatus: "paid" | "unpaid";

  // Invoice metadata
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  notes?: string;

  // Additional hotel details
  hotelRating: number;
  amenities: string[];
  roomDescription: string;
  cancellationPolicy: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceCompany {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface InvoiceCustomer {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  agentName?: string;
}

export interface ComprehensiveInvoiceData extends InvoiceData {
  company: InvoiceCompany;
  customer: InvoiceCustomer;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  discountRate: number;
  paymentMethod?: string;
  paymentDueDate?: string;
  termsAndConditions?: string;
}

// Props interface for invoice dialog component
export interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: HistoryBooking | null;
}

// State interface for invoice dialog
export interface InvoiceDialogState {
  isGeneratingPDF: boolean;
  invoiceData: InvoiceData | null;
  error: string | null;
  isLoading: boolean;
}

// Error types for better error handling
export enum InvoiceErrorType {
  INVOICE_GENERATION_FAILED = "Failed to generate invoice data",
  PDF_GENERATION_FAILED = "Failed to generate PDF document",
  DOWNLOAD_FAILED = "Failed to download PDF file",
  INVALID_BOOKING_DATA = "Invalid booking information provided",
}

export interface InvoiceError {
  type: InvoiceErrorType;
  message: string;
  originalError?: Error;
}
