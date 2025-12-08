import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://54.255.206.242:4816/api";

export async function GET(req: NextRequest) {
  const refresh_token = req.cookies.get("refresh_token")?.value || "";

  const res = await fetch(`${API_BASE_URL}/refresh-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: `refresh_token=${refresh_token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  const response = NextResponse.json(data, { status: res.status });

  if (data.data) {
    response.headers.set(
      "set-cookie",
      `access_token=${data.data.token}; Path=/; Max-Age=1740; HttpOnly`,
    );
  }

  return response;
}
