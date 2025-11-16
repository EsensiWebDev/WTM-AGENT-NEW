"use server";

import { apiCall } from "@/lib/api";
import { cookies } from "next/headers";
import { ContactUsResponse, ContactUsSchema } from "./types";

export async function submitContactUs(
  formData: ContactUsSchema,
): Promise<ContactUsResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  try {
    let body: Partial<ContactUsSchema> = {};
    if (formData.type === "general") {
      const { booking_code, sub_booking_code, ...rest } = formData;
      // Explicitly acknowledge unused variables to satisfy linter
      void booking_code;
      void sub_booking_code;
      body = rest;
    } else {
      body = formData;
    }

    const response = await apiCall(`email/contact-us`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message:
          response.message ||
          "Failed to submit your inquiry. Please try again.",
      };
    }

    return {
      success: true,
      message:
        response.message || "Your inquiry has been submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit your inquiry. Please try again.",
    };
  }
}
