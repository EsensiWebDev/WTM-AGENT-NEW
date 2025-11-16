"use server";

import { apiCall } from "@/lib/api";
import { cookies } from "next/headers";
import { UserAccountData } from "./types";

export async function fetchUserAccount(): Promise<UserAccountData> {
  // Simulate fetching user account data
  // In a real application, this would fetch from your authentication system/database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    id: "user_123",
    name: "John Doe",
    email: "john.doe@example.com",
  };
}

export async function fetchUserBookings(): Promise<
  { label: string; value: string }[]
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `bookings/ids`;
  const apiResponse = await apiCall<string[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((id) => ({
      label: id,
      value: id,
    }));
  }

  return [];
}

export async function fetchUserSubBookings(
  booking_id: string,
): Promise<{ label: string; value: string }[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `bookings/${booking_id}/sub-ids`;
  const apiResponse = await apiCall<string[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log({ data: apiResponse.data });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((id) => ({
      label: id,
      value: id,
    }));
  }

  return [];
}
