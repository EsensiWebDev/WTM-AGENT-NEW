"use server";

import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";

export type Notification = {
  id: number;
  is_read: boolean;
  message: string;
  read_at: string;
  redirect_url: string;
  title: string;
  user_id: number;
};

export async function fetchNotifications(): Promise<
  ApiResponse<Notification[]>
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `/notifications`;
  const apiResponse = await apiCall<Notification[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
}
