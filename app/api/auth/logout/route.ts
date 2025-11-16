import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // const token = req.headers.get("authorization");
  // console.log({ token });

  // const res = await fetch("http://54.255.206.242:4816/api/logout", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `${req.headers.get("authorization") || ""}`,
  //   },
  //   credentials: "include",
  // });

  // const data = await res.json();
  // const response = NextResponse.json(data, { status: res.status });

  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 },
  );

  response.cookies.set("access_token", "", { maxAge: -1 });
  response.cookies.set("refresh_token", "", { maxAge: -1 });

  // const setCookie = res.headers.get("set-cookie");
  // if (setCookie) {
  //   response.headers.set("set-cookie", setCookie);
  // }

  return response;
}
