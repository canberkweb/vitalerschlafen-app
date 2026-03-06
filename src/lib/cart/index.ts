import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  cartSchema,
  EMPTY_CART,
  type Cart,
  type CartItem,
  type EnrichedCart,
  type EnrichedCartItem,
} from "./schema";

// ─── Cookie config ───────────────────────────────────────────────────────────

const COOKIE_NAME = "vs_cart";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ─── Low-level cookie read/write ─────────────────────────────────────────────

export async function getCartFromCookie(): Promise<Cart> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return EMPTY_CART;

  try {
    const parsed = JSON.parse(raw);
    const result = cartSchema.safeParse(parsed);
    return result.success ? result.data : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

export async function setCartCookie(cart: Cart): Promise<void> {
  const cookieStore = await cookies();

  // Remove empty carts
  if (cart.items.length === 0) {
    cookieStore.delete(COOKIE_NAME);
    return;
  }

  cookieStore.set(COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

// ─── Cart mutations ──────────────────────────────────────────────────────────

export async function addItem(
  variantId: string,
  quantity: number,
): Promise<{ success: boolean; message?: string }> {
  // Validate variant exists and has stock
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant) {
    return { success: false, message: "Variante nicht gefunden." };
  }

  if (variant.stock <= 0) {
    return { success: false, message: "Dieses Produkt ist derzeit nicht verfügbar." };
  }

  const cart = await getCartFromCookie();
  const existing = cart.items.find((i) => i.variantId === variantId);

  const currentQty = existing?.quantity ?? 0;
  const requestedQty = currentQty + quantity;
  const finalQty = Math.min(requestedQty, variant.stock);

  let message: string | undefined;
  if (finalQty < requestedQty) {
    message = `Nur noch ${variant.stock} Stück verfügbar. Menge wurde angepasst.`;
  }

  if (existing) {
    existing.quantity = finalQty;
  } else {
    cart.items.push({ variantId, quantity: finalQty });
  }

  await setCartCookie(cart);
  return { success: true, message };
}

export async function updateItem(
  variantId: string,
  quantity: number,
): Promise<{ success: boolean; message?: string }> {
  const cart = await getCartFromCookie();
  const idx = cart.items.findIndex((i) => i.variantId === variantId);
  if (idx === -1) return { success: false, message: "Artikel nicht im Warenkorb." };

  if (quantity <= 0) {
    cart.items.splice(idx, 1);
    await setCartCookie(cart);
    return { success: true };
  }

  // Check stock
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant) {
    cart.items.splice(idx, 1);
    await setCartCookie(cart);
    return { success: false, message: "Variante nicht mehr verfügbar." };
  }

  const finalQty = Math.min(quantity, variant.stock);
  let message: string | undefined;
  if (finalQty < quantity) {
    message = `Nur noch ${variant.stock} Stück verfügbar.`;
  }

  if (finalQty <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].quantity = finalQty;
  }

  await setCartCookie(cart);
  return { success: true, message };
}

export async function removeItem(
  variantId: string,
): Promise<void> {
  const cart = await getCartFromCookie();
  cart.items = cart.items.filter((i) => i.variantId !== variantId);
  await setCartCookie(cart);
}

export async function clearCart(): Promise<void> {
  await setCartCookie(EMPTY_CART);
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCartFromCookie();
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

// ─── Enrichment: join cart cookie items with DB data ─────────────────────────

export async function getEnrichedCart(): Promise<EnrichedCart> {
  const cart = await getCartFromCookie();

  if (cart.items.length === 0) {
    return { items: [], subtotalCents: 0, totalItems: 0, hasStockWarning: false };
  }

  const variantIds = cart.items.map((i) => i.variantId);

  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  let hasStockWarning = false;
  const enrichedItems: EnrichedCartItem[] = [];
  const validCartItems: CartItem[] = [];

  for (const item of cart.items) {
    const v = variantMap.get(item.variantId);
    if (!v || !v.product) continue; // variant deleted — skip

    const clamped = item.quantity > v.stock;
    const finalQty = v.stock <= 0 ? 0 : Math.min(item.quantity, v.stock);

    if (clamped || v.stock <= 0) hasStockWarning = true;

    enrichedItems.push({
      variantId: v.id,
      productId: v.productId,
      productTitle: v.product.title,
      productSlug: v.product.slug,
      variantSize: v.size,
      lavenderIncluded: v.lavenderIncluded,
      priceCents: v.priceCents,
      stock: v.stock,
      quantity: finalQty,
      clamped,
      imageUrl: v.product.images[0]?.url ?? null,
    });

    if (finalQty > 0) {
      validCartItems.push({ variantId: v.id, quantity: finalQty });
    }
  }

  // Persist clamped quantities back to cookie
  const originalTotal = cart.items.reduce((s, i) => s + i.quantity, 0);
  const adjustedTotal = validCartItems.reduce((s, i) => s + i.quantity, 0);
  if (originalTotal !== adjustedTotal || validCartItems.length !== cart.items.length) {
    await setCartCookie({ items: validCartItems });
  }

  const subtotalCents = enrichedItems.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0,
  );
  const totalItems = enrichedItems.reduce((sum, i) => sum + i.quantity, 0);

  return { items: enrichedItems, subtotalCents, totalItems, hasStockWarning };
}
