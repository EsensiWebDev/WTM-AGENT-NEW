import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://54.255.206.242:4816/api";

export async function POST(req: NextRequest) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          data: null,
        },
        { status: 400 },
      );
    }

    // Create AbortController for timeout (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let res;
    try {
      res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // Handle network errors and timeout
      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            {
              success: false,
              message: "Request timeout. Please try again.",
              data: null,
            },
            { status: 504 },
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: "Network error. Please check your connection.",
            data: null,
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "An unexpected error occurred.",
          data: null,
        },
        { status: 500 },
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // Parse response JSON with error handling
    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from authentication server.",
          data: null,
        },
        { status: 502 },
      );
    }

    // Validate response structure
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response format.",
          data: null,
        },
        { status: 502 },
      );
    }

    // Create response
    const response = NextResponse.json(data, { status: res.status });

    // Forward the refresh token cookie from backend to client
    const refreshToken = res.headers.get("set-cookie");
    if (refreshToken) {
      // Validate token exists in response before setting cookie
      if (data.data && data.data.token) {
        // Modify the refresh token Max-Age from 604800 (7 days) to 7200 (2 hours)
        // const modifiedRefreshToken = refreshToken.replace(
        //   /Max-Age=\d+/,
        //   "Max-Age=7200",
        // );
        // response.headers.set("set-cookie", modifiedRefreshToken);
        response.headers.append(
          "set-cookie",
          `access_token=${data.data.token}; Path=/; Max-Age=7190; HttpOnly`,
        );
      }
    }

    return response;
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during login.",
        data: null,
      },
      { status: 500 },
    );
  }
}
