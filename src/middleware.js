import { NextResponse } from "next/server";
import { getCookie } from "./shared/utils/session";

export default async function middleware(req) {
  const token = getCookie("authToken", req);
  const { pathname } = req.nextUrl;
  if (
    !token &&
    pathname !== "/login" &&
    pathname !== "/welcome" &&
    pathname !== "/" &&
    pathname !== "/help" &&
    pathname !== "/register" &&
    pathname !== "/management" // Permitir acceso a /management sin login
  ) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
  }
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/welcome", req.url)); // Redirect to login page
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Routes to match
};
