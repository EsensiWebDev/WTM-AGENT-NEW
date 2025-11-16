import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  const res = await fetch("http://54.255.206.242:4816/api/hotels/agent", {
    method: "GET",
    headers: {
      Authorization: token || "",
      cookie: req.headers.get("cookie") || "",
    },
    credentials: "include",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
