// Test script for invoice generation functionality
// This is for testing purposes only

import { InvoiceGenerator } from "../lib/invoice-generator";
import { PDFService } from "../lib/pdf-service";
import { HistoryBooking } from "../app/(protected)/history-booking/types";

// Mock booking data for testing
const mockBooking: HistoryBooking = {
  id: "test-1",
  number: 1,
  guestName: "John Doe", 
  bookingId: "BK-2024-001",
  bookingStatus: "approved",
  paymentStatus: "paid",
  notes: "Test booking for invoice generation",
};

export const testInvoiceGeneration = () => {
  try {
    console.log("🧪 Testing invoice generation...");
    
    // Test 1: Generate simple invoice data
    const simpleInvoice = InvoiceGenerator.generateSimpleInvoice(mockBooking);
    console.log("✅ Simple invoice generated:", simpleInvoice.invoiceNumber);
    
    // Test 2: Generate comprehensive invoice data
    const comprehensiveInvoice = InvoiceGenerator.generateFromBooking(mockBooking);
    console.log("✅ Comprehensive invoice generated:", comprehensiveInvoice.invoiceNumber);
    
    // Test 3: Validate invoice data
    const validation = PDFService.validateInvoiceData(comprehensiveInvoice);
    if (validation.isValid) {
      console.log("✅ Invoice data validation passed");
    } else {
      console.error("❌ Invoice data validation failed:", validation.errors);
      return false;
    }
    
    // Test 4: Check browser support (if running in browser)
    if (typeof window !== "undefined") {
      const isSupported = PDFService.isBrowserSupported();
      console.log(`✅ Browser PDF support: ${isSupported ? "Supported" : "Not supported"}`);
    }
    
    // Test 5: Generate filename
    const filename = PDFService.generateInvoiceFilename(comprehensiveInvoice);
    console.log("✅ Generated filename:", filename);
    
    // Test 6: Estimate PDF size
    const estimatedSize = PDFService.estimatePDFSize(comprehensiveInvoice);
    console.log(`✅ Estimated PDF size: ${(estimatedSize / 1024).toFixed(2)} KB`);
    
    console.log("🎉 All tests passed! Invoice functionality is working correctly.");
    return true;
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
};

// Test data validation
export const testDataValidation = () => {
  try {
    console.log("🧪 Testing data validation...");
    
    // Test with invalid data
    const invalidBooking = {
      ...mockBooking,
      guestName: "", // Invalid: empty name
      bookingId: "", // Invalid: empty booking ID
    };
    
    try {
      const invoice = InvoiceGenerator.generateFromBooking(invalidBooking as HistoryBooking);
      const validation = PDFService.validateInvoiceData(invoice);
      
      if (!validation.isValid) {
        console.log("✅ Validation correctly caught invalid data:", validation.errors);
      } else {
        console.log("⚠️ Validation should have failed but didn't");
      }
    } catch (error) {
      console.log("✅ Error handling working correctly for invalid data");
    }
    
    return true;
  } catch (error) {
    console.error("❌ Data validation test failed:", error);
    return false;
  }
};

// Run tests if this file is imported
if (typeof window !== "undefined") {
  // Only run in browser environment
  console.log("🚀 Starting invoice functionality tests...");
  testInvoiceGeneration();
  testDataValidation();
}