"use server";

import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { AccountProfile } from "./types";

export async function fetchAccountProfile(): Promise<
  ApiResponse<AccountProfile>
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `/profile`;
  const apiResponse = await apiCall<AccountProfile>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
}
