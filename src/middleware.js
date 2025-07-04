import { NextResponse } from "next/server";
import { getCookie } from "./shared/utils/session";

export default async function middleware(req) {
  const token = getCookie("authToken", req);
  console.log(token);
  const { pathname } = req.nextUrl;
  let authorizedPaths = [
    "/",
    "/welcome",
    "/login",
    "/help",
    "/register",
    "/management",
    "/recover-password",
    "/reset-password",
  ];
  if (!token && !authorizedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
  }
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/welcome", req.url)); // Redirect to login page
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Routes to match
};
