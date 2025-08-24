import { ComprehensiveInvoiceData, InvoiceLineItem } from "@/types/invoice";
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

// Status Badge Component
const StatusBadge: React.FC<{
  status: string;
  type: "booking" | "payment";
}> = ({ status, type }) => {
  const getStatusStyle = () => {
    if (type === "booking") {
      switch (status) {
        case "approved":
          return styles.statusApproved;
        case "waiting":
          return styles.statusWaiting;
        case "rejected":
          return styles.statusRejected;
        default:
          return styles.statusRejected;
      }
    } else {
      return status === "paid" ? styles.statusPaid : styles.statusUnpaid;
    }
  };

  const getStatusText = () => {
    if (type === "booking") {
      switch (status) {
        case "approved":
          return "Approved";
        case "waiting":
          return "Waiting Approval";
        case "rejected":
          return "Rejected";
        default:
          return "Unknown";
      }
    } else {
      return status === "paid" ? "Paid" : "Unpaid";
    }
  };

  return (
    <View style={[styles.statusBadge, getStatusStyle()]}>
      <Text style={styles.statusText}>{getStatusText()}</Text>
    </View>
  );
};

// Line Items Table Component
const LineItemsTable: React.FC<{ lineItems: InvoiceLineItem[] }> = ({
  lineItems,
}) => (
  <View style={styles.table}>
    {/* Table Header */}
    <View style={styles.tableRow}>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Description</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Quantity</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Unit Price</Text>
      </View>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellHeader}>Total</Text>
      </View>
    </View>

    {/* Table Rows */}
    {lineItems.map((item, index) => (
      <View style={styles.tableRow} key={index}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.description}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.quantity}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{formatCurrency(item.unitPrice)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{formatCurrency(item.total)}</Text>
        </View>
      </View>
    ))}
  </View>
);

// Financial Summary Component
const FinancialSummary: React.FC<{ invoice: ComprehensiveInvoiceData }> = ({
  invoice,
}) => (
  <View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Subtotal:</Text>
      <Text style={styles.summaryValue}>
        {formatCurrency(invoice.subtotal, invoice.currency)}
      </Text>
    </View>

    {invoice.discount > 0 && (
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          Discount ({(invoice.discountRate * 100).toFixed(0)}%):
        </Text>
        <Text style={styles.summaryValue}>
          -{formatCurrency(invoice.discount, invoice.currency)}
        </Text>
      </View>
    )}

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Tax ({(invoice.taxRate * 100).toFixed(0)}%):
      </Text>
      <Text style={styles.summaryValue}>
        {formatCurrency(invoice.taxes, invoice.currency)}
      </Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Service Fee:</Text>
      <Text style={styles.summaryValue}>
        {formatCurrency(invoice.serviceFee, invoice.currency)}
      </Text>
    </View>

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
      <Text style={styles.totalValue}>
        {formatCurrency(invoice.totalAmount, invoice.currency)}
      </Text>
    </View>
  </View>
);

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
          marginBottom: 40,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
            PT. World Travel Marketing Bali
          </Text>
          <Text style={{ fontSize: 10, color: "#666", lineHeight: 1.4 }}>
            Ikat Plaza Building - Jl. Bypass Ngurah Rai No. 505{"\n"}
            Pemogan - Denpasar Selatan{"\n"}
            80221 Denpasar - Bali - Indonesia
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 5 }}>
            Invoice
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            #{invoice.invoiceNumber}
          </Text>
        </View>
      </View>

      {/* Billing and Invoice Details */}
      <View style={{ flexDirection: "row", marginBottom: 30 }}>
        {/* Bill To */}
        <View style={{ flex: 1, marginRight: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
            Bill To:
          </Text>
          <Text style={{ fontSize: 11, marginBottom: 2 }}>
            {invoice.customer.companyName || "Company Name"}
          </Text>
          <Text style={{ fontSize: 11, marginBottom: 2 }}>
            {invoice.customer.agentName || "Agent Name"}
          </Text>
          <Text style={{ fontSize: 11 }}>
            {invoice.customer.email || "email@client.com"}
          </Text>
        </View>

        {/* Booking Details */}
        <View style={{ flex: 1, marginRight: 20 }}>
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>Villa</Text>
              <Text style={{ fontSize: 10 }}>{invoice.hotelName}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>Guest Name</Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.checkInDate)}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>Period</Text>
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
                marginBottom: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>Invoice Date</Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.invoiceDate)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>
                Confirmation Number
              </Text>
              <Text style={{ fontSize: 10 }}>{invoice.bookingId}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>COD</Text>
              <Text style={{ fontSize: 10 }}>
                {formatDate(invoice.checkOutDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: "8%" }]}>
            <Text style={styles.tableCellHeader}>No.</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "40%" }]}>
            <Text style={styles.tableCellHeader}>Description</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "12%" }]}>
            <Text style={styles.tableCellHeader}>Qty</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "12%" }]}>
            <Text style={styles.tableCellHeader}>Unit</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "15%" }]}>
            <Text style={styles.tableCellHeader}>Unit Price</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "13%" }]}>
            <Text style={styles.tableCellHeader}>Total Price</Text>
          </View>
        </View>

        {/* Table Rows */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: "8%" }]}>
            <Text style={styles.tableCell}>1.</Text>
          </View>
          <View style={[styles.tableCol, { width: "40%" }]}>
            <Text style={styles.tableCell}>
              Room Costs - {invoice.roomType}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "12%" }]}>
            <Text style={styles.tableCell}>{invoice.numberOfNights}</Text>
          </View>
          <View style={[styles.tableCol, { width: "12%" }]}>
            <Text style={styles.tableCell}>Nights</Text>
          </View>
          <View style={[styles.tableCol, { width: "15%" }]}>
            <Text style={styles.tableCell}>
              {formatCurrency(
                invoice.subtotal / invoice.numberOfNights,
                invoice.currency,
              )}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "13%" }]}>
            <Text style={styles.tableCell}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
        </View>

        {invoice.serviceFee > 0 && (
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text style={styles.tableCell}>2.</Text>
            </View>
            <View style={[styles.tableCol, { width: "40%" }]}>
              <Text style={styles.tableCell}>Surcharge - Service Fee</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text style={styles.tableCell}>1</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text style={styles.tableCell}>Item</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {formatCurrency(invoice.serviceFee, invoice.currency)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "13%" }]}>
              <Text style={styles.tableCell}>
                {formatCurrency(invoice.serviceFee, invoice.currency)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Total Section */}
      <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: 40 }}>
        <View style={{ width: 250 }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5 }}
                >
                  Total Room Price
                </Text>
                <Text style={{ fontSize: 10, color: "#666" }}>
                  {invoice.numberOfGuests} room(s), {invoice.numberOfNights}{" "}
                  night
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 3,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#333",
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 8,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      3D2NIGHT15
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#666",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatCurrency(
                      invoice.subtotal + invoice.serviceFee,
                      invoice.currency,
                    )}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Note */}
      <View
        style={{
          marginBottom: 20,
          paddingTop: 15,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <Text style={{ fontSize: 10, color: "#666" }}>
          Payment and cancellation policy as per contract.
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
