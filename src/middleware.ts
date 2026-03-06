import { NextRequest, NextResponse } from "next/server";
import { getIronSession, type SessionOptions } from "iron-session";

// ─── Session types (mirrored from lib/auth) ──────────────────────────────────

interface SessionStore {
  user?: {
    userId: string;
    email: string;
    name: string | null;
    role: string;
  };
}

const SESSION_OPTIONS: SessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: "vs_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  },
};

// ─── Protected route config ──────────────────────────────────────────────────

const AUTH_ROUTES = ["/account", "/admin", "/checkout"];
const ADMIN_ROUTES = ["/admin"];
const GUEST_ROUTES = ["/login", "/register"];

// ─── Middleware ──────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read session from cookies
  const response = NextResponse.next();
  const session = await getIronSession<SessionStore>(
    request,
    response,
    SESSION_OPTIONS
  );
  const user = session.user;

  // ── Redirect logged-in users away from login/register ──────────────────
  if (user && GUEST_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // ── Require auth for protected routes ──────────────────────────────────
  if (!user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Require ADMIN role for admin routes ────────────────────────────────
  if (user && user.role !== "ADMIN" && ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*", "/login", "/register"],
};
