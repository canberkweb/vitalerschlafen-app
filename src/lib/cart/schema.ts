import { z } from "zod/v4";

// ─── Cookie schema ───────────────────────────────────────────────────────────

export const cartItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.int().min(1).max(99),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;

export const EMPTY_CART: Cart = { items: [] };

// ─── Enriched cart item (after DB lookup) ────────────────────────────────────

export interface EnrichedCartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  variantLabel: string;
  priceCents: number;
  stock: number;
  quantity: number;
  /** quantity was clamped because stock < requested qty */
  clamped: boolean;
  imageUrl: string | null;
}

export interface EnrichedCart {
  items: EnrichedCartItem[];
  subtotalCents: number;
  totalItems: number;
  hasStockWarning: boolean;
}
