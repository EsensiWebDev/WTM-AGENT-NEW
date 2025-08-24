import { pdf } from "@react-pdf/renderer";
import { ComprehensiveInvoiceData, InvoiceErrorType } from "@/types/invoice";
import { InvoicePDFDocument } from "@/components/history-booking/dialog/invoice-pdf-document";

export class PDFService {
  /**
   * Generate a PDF blob from invoice data
   */
  static async generateInvoicePDF(invoiceData: ComprehensiveInvoiceData): Promise<Blob> {
    try {
      // Create the PDF document component
      const document = InvoicePDFDocument({ invoice: invoiceData });
      
      // Generate PDF blob
      const blob = await pdf(document).toBlob();
      
      if (!blob) {
        throw new Error("Failed to generate PDF blob");
      }
      
      return blob;
    } catch (error) {
      console.error("PDF generation error:", error);
      throw new Error(InvoiceErrorType.PDF_GENERATION_FAILED);
    }
  }

  /**
   * Download a PDF blob as a file
   */
  static downloadPDF(blob: Blob, filename: string): void {
    try {
      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      throw new Error(InvoiceErrorType.DOWNLOAD_FAILED);
    }
  }

  /**
   * Generate a standardized filename for invoice PDFs
   */
  static generateInvoiceFilename(invoiceData: ComprehensiveInvoiceData): string {
    const sanitizedInvoiceNumber = invoiceData.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, "_");
    const sanitizedGuestName = invoiceData.guestName
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();
    
    const date = new Date().toISOString().split("T")[0];
    
    return `invoice_${sanitizedInvoiceNumber}_${sanitizedGuestName}_${date}.pdf`;
  }

  /**
   * Generate and download invoice PDF in one operation
   */
  static async generateAndDownloadInvoice(
    invoiceData: ComprehensiveInvoiceData,
    onProgress?: (step: string) => void
  ): Promise<void> {
    try {
      // Step 1: Generate PDF
      onProgress?.("Generating PDF document...");
      const pdfBlob = await this.generateInvoicePDF(invoiceData);
      
      // Step 2: Prepare filename
      onProgress?.("Preparing download...");
      const filename = this.generateInvoiceFilename(invoiceData);
      
      // Step 3: Download
      onProgress?.("Starting download...");
      this.downloadPDF(pdfBlob, filename);
      
      onProgress?.("Download completed");
    } catch (error) {
      console.error("Invoice PDF generation and download error:", error);
      throw error;
    }
  }

  /**
   * Validate invoice data before PDF generation
   */
  static validateInvoiceData(invoiceData: ComprehensiveInvoiceData): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    // Required fields validation
    if (!invoiceData.bookingId) errors.push("Booking ID is required");
    if (!invoiceData.guestName) errors.push("Guest name is required");
    if (!invoiceData.invoiceNumber) errors.push("Invoice number is required");
    if (!invoiceData.hotelName) errors.push("Hotel name is required");
    if (!invoiceData.company?.name) errors.push("Company name is required");
    
    // Financial data validation
    if (invoiceData.totalAmount <= 0) errors.push("Total amount must be greater than 0");
    if (invoiceData.basePrice <= 0) errors.push("Base price must be greater than 0");
    
    // Date validation
    try {
      new Date(invoiceData.checkInDate);
      new Date(invoiceData.checkOutDate);
      new Date(invoiceData.invoiceDate);
    } catch {
      errors.push("Invalid date format in invoice data");
    }

    // Line items validation
    if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
      errors.push("At least one line item is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get PDF blob as data URL for preview
   */
  static async generateInvoicePDFDataURL(invoiceData: ComprehensiveInvoiceData): Promise<string> {
    try {
      const blob = await this.generateInvoicePDF(invoiceData);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert blob to data URL"));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read blob"));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("PDF data URL generation error:", error);
      throw new Error(InvoiceErrorType.PDF_GENERATION_FAILED);
    }
  }

  /**
   * Check if browser supports PDF download
   */
  static isBrowserSupported(): boolean {
    try {
      // Check for required browser APIs
      return !!(
        window.URL && 
        window.URL.createObjectURL && 
        document.createElement && 
        window.FileReader
      );
    } catch {
      return false;
    }
  }

  /**
   * Get estimated PDF size before generation (rough estimate)
   */
  static estimatePDFSize(invoiceData: ComprehensiveInvoiceData): number {
    // Rough estimation based on content complexity
    const baseSize = 50000; // 50KB base
    const lineItemSize = invoiceData.lineItems.length * 1000; // 1KB per line item
    const amenitySize = invoiceData.amenities.length * 200; // 200B per amenity
    const textContentSize = (
      invoiceData.notes?.length || 0 +
      invoiceData.termsAndConditions?.length || 0 +
      invoiceData.roomDescription?.length || 0
    ) * 10; // rough text size estimation

    return baseSize + lineItemSize + amenitySize + textContentSize;
  }
}

// Utility functions for common PDF operations
export const InvoicePDFUtils = {
  /**
   * Format invoice data for display in UI before PDF generation
   */
  formatInvoiceForDisplay: (invoiceData: ComprehensiveInvoiceData) => ({
    ...invoiceData,
    formattedTotalAmount: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: invoiceData.currency,
      minimumFractionDigits: 0,
    }).format(invoiceData.totalAmount),
    formattedCheckInDate: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long", 
      year: "numeric",
    }).format(new Date(invoiceData.checkInDate)),
    formattedCheckOutDate: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric", 
    }).format(new Date(invoiceData.checkOutDate)),
  }),

  /**
   * Create a shareable invoice summary
   */
  createInvoiceSummary: (invoiceData: ComprehensiveInvoiceData): string => {
    const formatted = InvoicePDFUtils.formatInvoiceForDisplay(invoiceData);
    return `Invoice ${invoiceData.invoiceNumber}
Guest: ${invoiceData.guestName}
Hotel: ${invoiceData.hotelName}
Check-in: ${formatted.formattedCheckInDate}
Check-out: ${formatted.formattedCheckOutDate}
Total: ${formatted.formattedTotalAmount}
Status: ${invoiceData.bookingStatus} / ${invoiceData.paymentStatus}`;
  },
};

export default PDFService;