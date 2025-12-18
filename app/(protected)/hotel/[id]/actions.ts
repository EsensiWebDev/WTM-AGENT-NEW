"use server";

import { apiCall } from "@/lib/api";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface AddToCartRequest {
  check_in_date: string;
  check_out_date: string;
  promo_id?: number;
  quantity: number;
  room_price_id: number;
  room_type_additional_ids?: number[];
  other_preference_ids?: number[];
  additionals?: { id: number; name: string }[];
  other_preferences?: { id: number; name: string }[];
  bed_type?: string;
  additional_notes?: string; // Optional: Notes for admin only (not sent in automated emails)
}

export async function addRoomToCart(
  input: AddToCartRequest,
): Promise<ActionResponse<void>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";

    const response = await apiCall(`bookings/cart`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to add room to cart",
      };
    }

    revalidatePath("/hotel/[id]", "layout");
    revalidatePath("/cart", "layout");

    return {
      success: true,
      message: response.message || "Room has been successfully added to cart",
    };
  } catch (error) {
    console.error("Error adding room to cart:", error);

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
        error instanceof Error ? error.message : "Failed to add room to cart",
    };
  }
}
