"use server";

import { User } from "@/types/user";
import { getContactDetails, saveContactDetails } from "./fetch";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";
import { apiCall } from "@/lib/api";
import { delay } from "@/lib/utils";

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
    console.log("deleting cart", cart_id);

    const response = await apiCall(`bookings/cart/${cart_id}`, {
      method: "DELETE",
    });

    console.log({ response });

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

export async function checkoutCart(): Promise<ActionResponse<void>> {
  await delay(1000);

  return {
    success: true,
    message: "Cart has been successfully checked out",
  };

  try {
    const response = await apiCall(`bookings/checkout`, {
      method: "POST",
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

export const addGuest = async (input: { cart_id: number; guest: string }) => {
  const body = {
    cart_id: input.cart_id,
    guests: [input.guest],
  };

  try {
    const response = await apiCall(`bookings/cart/guests`, {
      method: "POST",
      body: JSON.stringify(body),
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
  guest: string;
}) => {
  const body = {
    cart_id: input.cart_id,
    guest: [input.guest],
  };

  try {
    const response = await apiCall(`bookings/cart/guests`, {
      method: "DELETE",
      body: JSON.stringify(body),
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
