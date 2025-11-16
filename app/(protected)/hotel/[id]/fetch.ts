import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { HotelDetail } from "./types";

export async function fetchHotelDetail({
  hotel_id,
}: {
  hotel_id: string;
}): Promise<ApiResponse<HotelDetail>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  // const queryString = buildQueryParams(searchParams);
  const url = `/hotels/agent/${hotel_id}`;
  const apiResponse = await apiCall<HotelDetail>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
}
