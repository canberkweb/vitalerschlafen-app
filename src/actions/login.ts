"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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

  // ── Sign in via Auth.js Credentials provider ────────────────────────────
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-Mail oder Passwort ist falsch." };
    }
    throw error;
  }

  redirect("/account");
}

