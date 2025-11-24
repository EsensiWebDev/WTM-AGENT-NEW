"use server";

import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function cancelBookingAction(
  subBookingId: string,
): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  try {
    const response = await apiCall(`bookings/${subBookingId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to cancel booking",
      };
    }

    revalidatePath("/history-booking", "layout");

    // For now, just return success without actual processing
    return {
      success: true,
      message: response.message || "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel booking",
    };
  }
}

export async function uploadReceipt(formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  try {
    const receipt = formData.get("receipt") as File | null;
    const bookingId = formData.get("booking_id") as string | null;
    const subBookingId = formData.get("sub_booking_id") as string | null;

    if (!receipt) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    const response = await apiCall("bookings/receipt", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to upload receipt",
      };
    }

    revalidatePath("/history-booking", "layout");

    // For now, just return success without actual processing
    return {
      success: true,
      message: response.message || "Receipt uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading receipt:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload receipt",
    };
  }
}
