import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://54.255.206.242:4816/api";

export async function GET(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value || "";

  const response = NextResponse.json(
    {
      message: "Access token retrieved successfully",
      data: {
        access_token,
      },
    },
    { status: 200 },
  );

  return response;
}
