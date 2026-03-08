import { auth } from "@/auth";

// ─── Session payload (kept for backwards-compat across actions) ──────────────

export interface SessionData {
  userId: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN";
}

/**
 * Get the currently logged-in user, or null if not authenticated.
 * Drop-in replacement for the old iron-session getCurrentUser().
 */
export async function getCurrentUser(): Promise<SessionData | null> {
  const session = await auth();
  if (!session?.user) return null;

  return {
    userId: session.user.id,
    email: session.user.email!,
    name: session.user.name ?? null,
    role: session.user.role,
  };
}

