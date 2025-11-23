"use server";

import { apiCall } from "@/lib/api";
import { cookies } from "next/headers";

export async function fetchListBookingStatus() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `bookings/booking-status`;
  const apiResponse = await apiCall<{ id: number; status: string }[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((agent) => ({
      label: agent.status,
      value: agent.id.toString(),
    }));
  }

  return [];
}

export async function fetchListPaymentStatus() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";
  const url = `bookings/payment-status`;
  const apiResponse = await apiCall<{ id: number; status: string }[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((agent) => ({
      label: agent.status,
      value: agent.id.toString(),
    }));
  }

  return [];
}

export async function fetchListProvince() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  if (!accessToken) return [];

  const url = `hotels/provinces`;
  const apiResponse = await apiCall<string[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((province) => ({
      label: province,
      value: province,
    }));
  }

  return [];
}
