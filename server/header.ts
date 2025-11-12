"use server";

import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";

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
  const url = `/notifications`;
  const apiResponse = await apiCall<Notification[]>(url);

  return apiResponse;
}
