import { redirect } from "next/navigation";
import { isEmptyObject } from "./utils";

const API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://54.255.206.242:4816/api";

type BffFetchOptions = RequestInit & {
  /**
   * Fallback response to return when the upstream API responds with a non-OK status.
   */
  onError?: (response: Response) => Promise<Response>;
};

/**
 * Server-side helper that attaches the current access token to outbound requests.
 * Automatically relies on NextAuth token refresh flow through getServerSession.
 */
export async function bffFetch(
  input: string,
  { onError, headers, ...init }: BffFetchOptions = {},
) {
  const url =
    input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `${API_BASE_URL.replace(/\/$/, "")}/${input.replace(/^\//, "")}`;

  const normalizedHeaders = new Headers(headers);

  // Only set Content-Type to application/json if it's not already set
  // This allows FormData to work properly as the browser will set the correct Content-Type with boundary
  if (
    !normalizedHeaders.has("Content-Type") &&
    !(init?.body instanceof FormData)
  ) {
    normalizedHeaders.set("Content-Type", "application/json");
  }

  let response = await fetch(url, {
    ...init,
    headers: normalizedHeaders,
    cache: "no-store",
  });

  if (response.status === 401 && isEmptyObject(init)) {
    redirect("/logout");
  }

  if (!response.ok && onError) {
    return onError(response);
  }

  return response;
}
