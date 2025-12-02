"use server";

import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { Banner, HotelListData, PromoHomePage } from "./types";

export const getHotels = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HotelListData>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const searchParamsWithDefaults = {
    ...searchParams,
    limit: searchParams.limit || "9",
    page: searchParams.page || "1",
    from: searchParams.from || format(today, "yyyy-MM-dd"),
    to: searchParams.to || format(tomorrow, "yyyy-MM-dd"),
  };

  const queryString = buildQueryParams(searchParamsWithDefaults);
  const url = `/hotels/agent${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HotelListData>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
};

export const getPromos = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<PromoHomePage[]>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  if (!accessToken)
    return {
      status: 401,
      message: "Unauthorized",
      data: [],
    };

  const queryString = buildQueryParams(searchParams);
  const url = `/promos/agent${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<PromoHomePage[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
};

export const getBanners = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<Banner[]>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  const url = `/banners/active`;
  const apiResponse = await apiCall<Banner[]>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return apiResponse;
};
