"use server";

import { apiCall } from "@/lib/api";
import { ActionResponse } from "@/types";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { InvoiceData } from "../history-booking/types";
import { getContactDetails, saveContactDetails } from "./fetch";
import { GuestPayload } from "./types";

export async function addUserAsGuest(user: User) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Simulate validation
    if (!user.id || !user.name || !user.email) {
      return {
        success: false,
        message: "Invalid user data provided",
      };
    }

    // Simulate success response
    return {
      success: true,
      message: `${user.name} has been added as a guest`,
    };
  } catch (error) {
    console.error("Error adding user as guest:", error);
    return {
      success: false,
      message: "Failed to add user as guest. Please try again.",
    };
  }
}

export async function deleteContactDetail(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const current = await getContactDetails();
    const exists = current.some((c) => c.id === id);
    if (!exists) {
      return {
        success: false,
        message: "Contact not found.",
      };
    }
    const updated = current.filter((c) => c.id !== id);
    const result = await saveContactDetails(updated);
    if (result.success) {
      return {
        success: true,
        message: "Contact deleted successfully.",
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to delete contact.",
      };
    }
  } catch (error) {
    console.error("Error deleting contact detail:", error);
    return {
      success: false,
      message: "An error occurred while deleting the contact.",
    };
  }
}

export async function removeFromCart(
  cart_id: string,
): Promise<ActionResponse<void>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";

    const response = await apiCall(`bookings/cart/${cart_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to remove room from cart",
      };
    }

    revalidatePath("/cart", "layout");

    return {
      success: true,
      message:
        response.message || "Room has been successfully removed from cart",
    };
  } catch (error) {
    console.error("Error removing room from cart:", error);

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
          : "Failed to remove room from cart",
    };
  }
}

export async function checkoutCart(): Promise<ActionResponse<InvoiceData[]>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  try {
    const response = await apiCall<InvoiceData[]>(`bookings/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to checkout cart",
      };
    }

    revalidatePath("/cart", "layout");

    return {
      success: true,
      message: response.message || "Cart has been successfully checked out",
      data: response.data,
    };
  } catch (error) {
    console.error("Error removing room from cart:", error);

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
        error instanceof Error ? error.message : "Failed to checkout cart",
    };
  }
}

export const addGuest = async (input: {
  cart_id: number;
  guest?: string;
  guests?: string[];
  guestData?: GuestPayload[];
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  // Convert to structured GuestPayload[] format
  let guestPayloads: GuestPayload[] = [];
  if (input.guestData) {
    guestPayloads = input.guestData;
  } else if (input.guests) {
    // Legacy: convert string[] to GuestPayload[]
    guestPayloads = input.guests.map((name) => ({
      name,
      honorific: "Mr",
      category: "Adult",
    }));
  } else if (input.guest) {
    // Legacy: convert string to GuestPayload[]
    guestPayloads = [
      {
        name: input.guest,
        honorific: "Mr",
        category: "Adult",
      },
    ];
  }

  const body = {
    cart_id: input.cart_id,
    guests: guestPayloads,
  };

  try {
    const response = await apiCall(`bookings/cart/guests`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to add guest",
      };
    }

    revalidatePath("/cart", "layout");

    return {
      success: true,
      message: response.message || "Guest has been successfully added",
    };
  } catch (error) {
    console.error("Error adding guest:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add guest",
    };
  }
};

export const removeGuest = async (input: {
  cart_id: number;
  guest?: string;
  guestData?: GuestPayload;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  // Convert to structured GuestPayload format
  let guestPayload: GuestPayload;
  if (input.guestData) {
    guestPayload = input.guestData;
  } else if (input.guest) {
    // Legacy: convert string to GuestPayload
    guestPayload = {
      name: input.guest,
      honorific: "Mr",
      category: "Adult",
    };
  } else {
    return {
      success: false,
      message: "Guest data is required",
    };
  }

  const body = {
    cart_id: input.cart_id,
    guest: guestPayload,
  };

  try {
    const response = await apiCall(`bookings/cart/guests`, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to remove guest",
      };
    }

    revalidatePath("/cart", "layout");

    return {
      success: true,
      message: response.message || "Guest has been successfully removed",
    };
  } catch (error) {
    console.error("Error removing guest:", error);

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
        error instanceof Error ? error.message : "Failed to remove guest",
    };
  }
};

export const selectGuest = async (input: {
  sub_cart_id: number;
  guest: string;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";
  const body = {
    ...input,
  };

  try {
    const response = await apiCall(`bookings/cart/sub-guest`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to select guest",
      };
    }

    revalidatePath("/cart", "layout");

    return {
      success: true,
      message: response.message || "Guest has been successfully selected",
    };
  } catch (error) {
    console.error("Error selecting guest:", error);

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
        error instanceof Error ? error.message : "Failed to select guest",
    };
  }
};
