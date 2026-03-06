import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// ─── Session payload ─────────────────────────────────────────────────────────

export interface SessionData {
  userId: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN";
}

// We store a wrapper so iron-session can detect an empty session
interface SessionStore {
  user?: SessionData;
}

// ─── iron-session options ────────────────────────────────────────────────────

const SESSION_OPTIONS: SessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: "vs_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionStore>(cookieStore, SESSION_OPTIONS);
}

/**
 * Create (or overwrite) the session after successful login/register.
 */
export async function createSession(data: SessionData): Promise<void> {
  const session = await getSession();
  session.user = data;
  await session.save();
}

/**
 * Destroy the session (logout).
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Get the currently logged-in user, or null if not authenticated.
 */
export async function getCurrentUser(): Promise<SessionData | null> {
  const session = await getSession();
  return session.user ?? null;
}
