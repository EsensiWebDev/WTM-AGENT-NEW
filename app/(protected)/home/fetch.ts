import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { HotelListData } from "./types";

export const getHotels = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HotelListData>> => {
  const searchParamsWithDefaults = {
    ...searchParams,
    limit: searchParams.limit || "9",
    page: searchParams.page || "1",
  };

  const queryString = buildQueryParams(searchParamsWithDefaults);
  const url = `/hotels/agent${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HotelListData>(url);

  return apiResponse;
};
