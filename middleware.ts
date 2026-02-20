import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware for authentication guard and redirection logic.
// Ensures dashboard pages require a valid token cookie and prevents
// logged-in users from visiting /login again.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  // 1. protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // token exists -> allow access
    return NextResponse.next();
  }

  // 2. if the user is already authenticated and tries to hit login page,
  //    send them to dashboard instead (avoid seeing login again)
  if (pathname === "/login" && token) {
    const dashUrl = req.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  // otherwise just continue
  return NextResponse.next();
}

// specify the paths the middleware should run on
export const config = {
  matcher: [
    ,
    "/login",
  ],
};
