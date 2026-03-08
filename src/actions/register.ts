"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signIn } from "@/auth";
import { registerSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export interface RegisterState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function registerAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // ── Parse & validate ────────────────────────────────────────────────────
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = result.data;

  // ── Check for existing user ─────────────────────────────────────────────
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Diese E-Mail-Adresse ist bereits registriert." };
  }

  // ── Create user ─────────────────────────────────────────────────────────
  const passwordHash = await hashPassword(password);
  await db.user.create({
    data: { email, name, passwordHash },
  });

  // ── Sign in via Auth.js & redirect ──────────────────────────────────────
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Konto wurde erstellt, aber Anmeldung fehlgeschlagen. Bitte melden Sie sich manuell an." };
    }
    throw error;
  }

  redirect("/account");
}

