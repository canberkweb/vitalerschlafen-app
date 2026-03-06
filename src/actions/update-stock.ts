"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateStockSchema } from "@/lib/validations/product";

export interface UpdateStockState {
  success?: boolean;
  error?: string;
  variantId?: string;
}

export async function updateStockAction(
  _prev: UpdateStockState,
  formData: FormData
): Promise<UpdateStockState> {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  // ── Validate ────────────────────────────────────────────────────────────
  const raw = {
    variantId: formData.get("variantId"),
    stock: formData.get("stock"),
  };

  const result = updateStockSchema.safeParse(raw);
  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Ungültige Eingabe.",
      variantId: String(raw.variantId ?? ""),
    };
  }

  const { variantId, stock } = result.data;

  // ── Update ──────────────────────────────────────────────────────────────
  try {
    await db.productVariant.update({
      where: { id: variantId },
      data: { stock },
    });
  } catch {
    return { error: "Variante nicht gefunden.", variantId };
  }

  return { success: true, variantId };
}
