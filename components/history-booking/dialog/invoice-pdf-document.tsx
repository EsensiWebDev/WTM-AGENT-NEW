import { ComprehensiveInvoiceData } from "@/types/invoice";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },

  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 20,
    marginBottom: 30,
  },

  companyInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },

  companyDetails: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
  },

  invoiceTitle: {
    flexDirection: "column",
    alignItems: "flex-end",
  },

  invoiceTitleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 5,
  },

  invoiceNumber: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "bold",
  },

  invoiceDate: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },

  // Section styles
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  // Customer and booking info
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  infoColumn: {
    flexDirection: "column",
    width: "48%",
  },

  infoLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
    fontWeight: "bold",
  },

  infoValue: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 8,
  },

  // Table styles
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },

  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f9fafb",
    padding: 8,
  },

  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },

  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },

  tableCell: {
    fontSize: 10,
    color: "#374151",
  },

  // Financial summary styles
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#374151",
  },

  summaryValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "bold",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 5,
  },

  totalLabel: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },

  totalValue: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },

  // Status badge styles
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },

  statusApproved: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  statusWaiting: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },

  statusRejected: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
  },

  statusPaid: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  statusUnpaid: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  // Footer styles
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 5,
  },

  notesText: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
  },

  termsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 5,
    marginTop: 15,
  },

  termsText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.3,
  },
});

// Format currency for PDF
const formatCurrency = (amount: number, currency: string = "IDR"): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date for PDF
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

// Main PDF Document Component
export const InvoicePDFDocument: React.FC<{
  invoice: ComprehensiveInvoiceData;
}> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Company Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 30,
          marginBottom: 30,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 5,
              color: "#111827",
            }}
          >
            PT. World Travel Marketing Bali test
          </Text>
          <Text style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.4 }}>
            Ikat Plaza Building - Jl. Bypass Ngurah Rai No. 505{"\n"}
            Pemogan - Denpasar Selatan{"\n"}
            80221 Denpasar - Bali - Indonesia
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: 5,
              color: "#111827",
            }}
          >
            Invoice
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#374151" }}>
            #{invoice.invoiceNumber}
          </Text>
        </View>
      </View>

      {/* Bill To Section */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 12,
          color: "#111827",
        }}
      >
        Bill To:
      </Text>

      {/* Billing and Invoice Details */}
      <View style={{ flexDirection: "row", marginBottom: 40, gap: 32 }}>
        {/* Bill To */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, marginBottom: 2, fontWeight: "500" }}>
            {invoice.customer.companyName || "Company Name"}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 2 }}>
            {invoice.customer.agentName || "Agent Name"}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {invoice.customer.email || "email@client.com"}
          </Text>
        </View>

        {/* Booking Details */}
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 10, color: "#6b7280" }}>Villa</Text>
              <Text style={{ fontSize: 10 }}>{invoice.hotelName}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 10, color: "#6b7280" }}>Guest Name</Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.checkInDate)}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 10, color: "#6b7280" }}>Period</Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.checkOutDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 10, color: "#6b7280" }}>
                Invoice Date
              </Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.invoiceDate)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 10, color: "#6b7280" }}>
                Confirmation Number
              </Text>
              <Text style={{ fontSize: 10 }}>{invoice.bookingId}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 10, color: "#6b7280" }}>COD</Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.checkOutDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Items Table */}
      <View style={[styles.table, { marginTop: 20 }]}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableColHeader,
              { width: "8%", backgroundColor: "#f9fafb" },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { fontSize: 11, fontWeight: "bold" },
              ]}
            >
              No.
            </Text>
          </View>
          <View
            style={[
              styles.tableColHeader,
              { width: "40%", backgroundColor: "#f9fafb" },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { fontSize: 11, fontWeight: "bold" },
              ]}
            >
              Description
            </Text>
          </View>
          <View
            style={[
              styles.tableColHeader,
              { width: "12%", backgroundColor: "#f9fafb", textAlign: "center" },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { fontSize: 11, fontWeight: "bold", textAlign: "center" },
              ]}
            >
              Qty
            </Text>
          </View>
          <View
            style={[
              styles.tableColHeader,
              { width: "12%", backgroundColor: "#f9fafb", textAlign: "center" },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { fontSize: 11, fontWeight: "bold", textAlign: "center" },
              ]}
            >
              Unit
            </Text>
          </View>
          <View
            style={[
              styles.tableColHeader,
              { width: "15%", backgroundColor: "#f9fafb", textAlign: "right" },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { fontSize: 11, fontWeight: "bold", textAlign: "right" },
              ]}
            >
              Unit Price
            </Text>
          </View>
          <View
            style={[
              styles.tableColHeader,
              { width: "13%", backgroundColor: "#f9fafb", textAlign: "right" },
            ]}
          >
            <Text
              style={[
                styles.tableCellHeader,
                { fontSize: 11, fontWeight: "bold", textAlign: "right" },
              ]}
            >
              Total Price
            </Text>
          </View>
        </View>

        {/* Table Rows */}
        <View style={styles.tableRow}>
          <View
            style={[styles.tableCol, { width: "8%", backgroundColor: "white" }]}
          >
            <Text style={[styles.tableCell, { fontSize: 10 }]}>1.</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "40%", backgroundColor: "white" },
            ]}
          >
            <Text style={[styles.tableCell, { fontSize: 10 }]}>
              Room Costs - {invoice.roomType}
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "12%", backgroundColor: "white" },
            ]}
          >
            <Text
              style={[styles.tableCell, { fontSize: 10, textAlign: "center" }]}
            >
              {invoice.numberOfNights}
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "12%", backgroundColor: "white" },
            ]}
          >
            <Text
              style={[styles.tableCell, { fontSize: 10, textAlign: "center" }]}
            >
              Nights
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "15%", backgroundColor: "white" },
            ]}
          >
            <Text
              style={[styles.tableCell, { fontSize: 10, textAlign: "right" }]}
            >
              {formatCurrency(
                invoice.subtotal / invoice.numberOfNights,
                invoice.currency,
              )}
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "13%", backgroundColor: "white" },
            ]}
          >
            <Text
              style={[
                styles.tableCell,
                { fontSize: 10, textAlign: "right", fontWeight: "500" },
              ]}
            >
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
        </View>

        {invoice.serviceFee > 0 && (
          <View style={styles.tableRow}>
            <View
              style={[
                styles.tableCol,
                { width: "8%", backgroundColor: "white" },
              ]}
            >
              <Text style={[styles.tableCell, { fontSize: 10 }]}>2.</Text>
            </View>
            <View
              style={[
                styles.tableCol,
                { width: "40%", backgroundColor: "white" },
              ]}
            >
              <Text style={[styles.tableCell, { fontSize: 10 }]}>
                Surcharge - Service Fee
              </Text>
            </View>
            <View
              style={[
                styles.tableCol,
                { width: "12%", backgroundColor: "white" },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  { fontSize: 10, textAlign: "center" },
                ]}
              >
                1
              </Text>
            </View>
            <View
              style={[
                styles.tableCol,
                { width: "12%", backgroundColor: "white" },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  { fontSize: 10, textAlign: "center" },
                ]}
              >
                Item
              </Text>
            </View>
            <View
              style={[
                styles.tableCol,
                { width: "15%", backgroundColor: "white" },
              ]}
            >
              <Text
                style={[styles.tableCell, { fontSize: 10, textAlign: "right" }]}
              >
                {formatCurrency(invoice.serviceFee, invoice.currency)}
              </Text>
            </View>
            <View
              style={[
                styles.tableCol,
                { width: "13%", backgroundColor: "white" },
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  { fontSize: 10, textAlign: "right", fontWeight: "500" },
                ]}
              >
                {formatCurrency(invoice.serviceFee, invoice.currency)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Total Section - Matching Dialog Layout */}
      <View style={{ alignItems: "flex-end", marginTop: 30 }}>
        <View style={{ width: 280 }}>
          {/* First row: Total Room Price and Strikethrough price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
              Total Room Price
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                textDecoration: "line-through",
              }}
            >
              {formatCurrency(
                invoice.subtotal + invoice.serviceFee,
                invoice.currency,
              )}
            </Text>
          </View>

          {/* Second row: Room/night info and Total price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 10, color: "#6b7280" }}>
              {invoice.numberOfGuests} room(s), {invoice.numberOfNights} night
            </Text>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
            >
              {formatCurrency(invoice.totalAmount, invoice.currency)}
            </Text>
          </View>

          {/* Third row: Voucher code badge */}
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                backgroundColor: "#2A3D45",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  color: "white",
                  fontWeight: "500",
                }}
              >
                September Promo | {formatCurrency(500000, "IDR")} Off!
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Note */}
      <View
        style={{
          marginTop: 40,
          marginBottom: 20,
          paddingTop: 15,
          paddingBottom: 10,
          borderTopWidth: 0,
          borderTopColor: "#e5e7eb",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <Text style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.4 }}>
          Payment and cancellation policy as per contract.{"\n"}
          *terms & condition applied
        </Text>
      </View>

      {/* Footer Information */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Payment Info */}
        <View style={{ flex: 1, marginRight: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
            Payments:
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
            Make checks payable to:{"\n"}
            Aina (Indira){"\n"}
            CIMB Niaga 704 904 511 700{"\n"}
            KCP Teuku Umar - Denpasar
          </Text>
        </View>

        {/* Questions */}
        <View style={{ flex: 1, marginRight: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
            Questions
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
            0361 4756583{"\n"}
            info.wtmbali@gmail.com{"\n"}
            www.wtmbali.com
          </Text>
        </View>

        {/* Action Buttons - Text only in PDF */}
        <View style={{ flex: 1 }} />
      </View>
    </Page>
  </Document>
);

export default InvoicePDFDocument;
