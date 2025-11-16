import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { cookies } from "next/headers";
import { HistoryBooking } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HistoryBooking[]>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const searchParamsWithDefaults = {
    ...searchParams,
    limit: searchParams.limit || "10",
    page: searchParams.page || "1",
    search_by: searchParams.search_by || "guest_name",
  };

  const queryString = buildQueryParams(searchParamsWithDefaults);

  const url = `/bookings/history${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HistoryBooking[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
};
