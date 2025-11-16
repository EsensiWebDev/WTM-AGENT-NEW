import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/home"];
const AUTHENTICATED_REDIRECT_PATH = "/home";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token");
  const { pathname } = req.nextUrl;
  const isAuthenticated = Boolean(refreshToken);
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!isAuthenticated && !isPublicPath) {
    const callbackUrl = `${pathname}${req.nextUrl.search}`;
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(AUTHENTICATED_REDIRECT_PATH, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
