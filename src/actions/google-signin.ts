"use server";

import { signIn } from "@/auth";

export async function googleSignInAction(): Promise<void> {
  await signIn("google", { redirectTo: "/account" });
}
