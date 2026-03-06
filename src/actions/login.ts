"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export interface LoginState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  // ── Parse & validate ────────────────────────────────────────────────────
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = result.data;

  // ── Verify credentials ──────────────────────────────────────────────────
  const user = await db.user.findUnique({ where: { email } });

  // Generic message — don't reveal whether e-mail exists
  const GENERIC_ERROR = "E-Mail oder Passwort ist falsch.";

  if (!user) {
    // Perform a dummy hash to prevent timing attacks
    await verifyPassword(password, "$2b$12$invalidhashpaddingtoresist");
    return { error: GENERIC_ERROR };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: GENERIC_ERROR };
  }

  // ── Create session & redirect ───────────────────────────────────────────
  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/account");
}
