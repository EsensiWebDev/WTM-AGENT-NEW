"use client";

import { fetchAccountProfile } from "@/app/(protected)/settings/fetch";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get the agent's default currency from their profile.
 * Returns "IDR" as fallback if currency is not set or profile is not loaded.
 */
export function useAgentCurrency(): string {
  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchAccountProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: isAuthenticated,
  });

  // Return agent's currency from profile, or "IDR" as default
  return profileData?.data?.currency || "IDR";
}

