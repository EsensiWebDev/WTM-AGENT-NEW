import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://54.255.206.242:4816/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json();

  // Create response
  const response = NextResponse.json(data, { status: res.status });

  // Forward the refresh token cookie from backend to client
  const refreshToken = res.headers.get("set-cookie");
  if (refreshToken) {
    // Modify the refresh token Max-Age from 604800 (7 days) to 7200 (2 hours)
    const modifiedRefreshToken = refreshToken.replace(
      /Max-Age=\d+/,
      "Max-Age=7200",
    );
    response.headers.set("set-cookie", modifiedRefreshToken);
    response.headers.append(
      "set-cookie",
      `access_token=${data.data.token}; Path=/; Max-Age=7190; HttpOnly`,
    );
  }

  return response;
}
