import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// ─── Protected route config ──────────────────────────────────────────────────

const AUTH_ROUTES = ["/account", "/admin", "/checkout"];
const ADMIN_ROUTES = ["/admin"];
const GUEST_ROUTES = ["/login", "/register"];

// ─── Middleware (edge-safe — no Prisma import) ───────────────────────────────

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // ── Redirect logged-in users away from login/register ──────────────────
  if (user && GUEST_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // ── Require auth for protected routes ──────────────────────────────────
  if (!user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Require ADMIN role for admin routes ────────────────────────────────
  if (
    user &&
    (user as { role?: string }).role !== "ADMIN" &&
    ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*", "/login", "/register"],
};


