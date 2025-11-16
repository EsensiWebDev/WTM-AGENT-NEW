import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch("http://54.255.206.242:4816/api/login", {
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
    response.headers.set("set-cookie", refreshToken);
    response.headers.append(
      "set-cookie",
      `access_token=${data.data.token}; Path=/; Max-Age=1740; HttpOnly`,
    );
  }

  return response;
}
