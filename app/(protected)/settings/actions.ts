"use server";

import { PasswordChangeSchema } from "@/components/settings/account-setting-form";
import { ProfileSchema } from "@/components/settings/edit-profile-form";
import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AccountSettingResponse, LanguageChange } from "./types";

export async function updateAccountProfile(
  input: ProfileSchema,
): Promise<AccountSettingResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";

    const { agent_company, ...body } = input;

    const response = await apiCall(`profile`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update profile",
      };
    }

    revalidatePath("/settings", "layout");

    return {
      success: true,
      message: response.message || "Profile has been successfully updated",
    };
  } catch (error) {
    console.error("Error updating profile:", error);

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
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function updateNotificationSetting(input: {
  channel: string;
  isEnable: boolean;
  type: string;
}): Promise<AccountSettingResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";

    const body = {
      ...input,
    };

    const response = await apiCall(`notifications/settings`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update notification setting",
      };
    }

    revalidatePath("/settings", "layout");

    return {
      success: true,
      message:
        response.message ||
        "Notification setting has been successfully updated",
    };
  } catch (error) {
    console.error("Error updating notification setting:", error);

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
          : "Failed to update notification setting",
    };
  }
}

export async function changePassword(
  input: PasswordChangeSchema,
): Promise<AccountSettingResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";
    const body = {
      ...input,
    };

    const response = await apiCall(`profile/setting`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to change password",
      };
    }

    // revalidatePath("/settings", "layout");

    return {
      success: true,
      message: response.message || "Password has been successfully changed",
    };
  } catch (error) {
    console.error("Error changing password:", error);

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
        error instanceof Error ? error.message : "Failed to change password",
    };
  }
}

// Simulate changing language setting
export async function changeLanguage(
  input: LanguageChange,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate success response
  return {
    success: true,
    message: `Language changed to ${input.language} successfully`,
  };
}

export async function updateAccountProfilePhoto(
  formData: FormData,
): Promise<AccountSettingResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";
    const file = formData.get("photo_profile");

    if (!file || !(file instanceof File)) {
      return {
        success: false,
        message: "Please provide a valid image file.",
      };
    }

    const body = new FormData();

    body.append("file_type", "photo");
    body.append("photo", file);

    const response = await apiCall("profile/file", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update profile photo",
      };
    }

    revalidatePath("/settings", "layout");

    return {
      success: true,
      message: response.message || "Profile photo updated successfully",
    };
  } catch (error) {
    console.error("Error updating profile photo:", error);
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
          : "Failed to update profile photo",
    };
  }
}

// Simulate certificate upload
export async function uploadCertificate(
  formData: FormData,
): Promise<AccountSettingResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";
    const file = formData.get("certificate");

    if (!file || !(file instanceof File)) {
      return {
        success: false,
        message: "Please provide a valid certificate file.",
      };
    }

    const body = new FormData();

    body.append("file_type", "certificate");
    body.append("photo", file);

    const response = await apiCall("profile/file", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to upload certificate",
      };
    }

    revalidatePath("/settings", "layout");

    return {
      success: true,
      message: response.message || "Certificate uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading certificate:", error);
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload certificate",
    };
  }
}

// Simulate name card upload
export async function uploadNameCard(
  formData: FormData,
): Promise<AccountSettingResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";
    const file = formData.get("nameCard");

    if (!file || !(file instanceof File)) {
      return {
        success: false,
        message: "Please provide a valid name card file.",
      };
    }

    const body = new FormData();

    body.append("file_type", "name_card");
    body.append("photo", file);

    const response = await apiCall("profile/file", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to upload name card",
      };
    }

    revalidatePath("/settings", "layout");

    return {
      success: true,
      message: response.message || "Name card uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading name card:", error);
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload name card",
    };
  }
}
