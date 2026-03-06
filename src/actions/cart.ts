"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from "@/lib/cart";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartActionResult {
  success: boolean;
  message?: string;
}

// ─── Add to cart ─────────────────────────────────────────────────────────────

export async function addToCartAction(
  variantId: string,
  quantity: number = 1,
): Promise<CartActionResult> {
  const result = await addItem(variantId, quantity);
  revalidatePath("/cart");
  revalidatePath("/", "layout"); // navbar badge
  return result;
}

// ─── Update quantity ─────────────────────────────────────────────────────────

export async function updateCartItemAction(
  variantId: string,
  quantity: number,
): Promise<CartActionResult> {
  const result = await updateItem(variantId, quantity);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return result;
}

// ─── Remove item ─────────────────────────────────────────────────────────────

export async function removeCartItemAction(
  variantId: string,
): Promise<CartActionResult> {
  await removeItem(variantId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true };
}

// ─── Clear cart ──────────────────────────────────────────────────────────────

export async function clearCartAction(): Promise<CartActionResult> {
  await clearCart();
  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Clear the cart and redirect back to /cart.
 * Used via <form action={…}> for reliable cookie + navigation handling.
 */
export async function clearCartAndRedirectAction(): Promise<never> {
  await clearCart();
  revalidatePath("/", "layout");
  redirect("/cart");
}
