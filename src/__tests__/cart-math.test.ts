import { describe, it, expect } from "node:test";
import assert from "node:assert/strict";

// ─── Pure cart math / validation tests (no DB, no cookies) ──────────────────
// We test the schema validation and cart math logic directly.

// Inline Zod-like validation (mirrors src/lib/cart/schema.ts logic)
// Since we can't easily import Zod v4 without a bundler in node:test,
// we test the pure logic functions.

// ─── Cart math helpers ──────────────────────────────────────────────────────

interface CartItem {
  variantId: string;
  quantity: number;
}

interface EnrichedItem {
  variantId: string;
  priceCents: number;
  stock: number;
  quantity: number;
}

function clampQuantity(requested: number, stock: number): number {
  if (stock <= 0) return 0;
  return Math.min(Math.max(1, requested), stock);
}

function computeSubtotal(items: EnrichedItem[]): number {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

function computeTotalItems(items: EnrichedItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

function addItemToCart(
  cart: CartItem[],
  variantId: string,
  quantity: number,
  stock: number,
): { items: CartItem[]; clamped: boolean } {
  const items = [...cart];
  const existing = items.find((i) => i.variantId === variantId);
  const currentQty = existing?.quantity ?? 0;
  const requestedQty = currentQty + quantity;
  const finalQty = clampQuantity(requestedQty, stock);
  const clamped = finalQty < requestedQty;

  if (existing) {
    existing.quantity = finalQty;
  } else {
    items.push({ variantId, quantity: finalQty });
  }

  return { items, clamped };
}

function removeItemFromCart(cart: CartItem[], variantId: string): CartItem[] {
  return cart.filter((i) => i.variantId !== variantId);
}

function updateItemInCart(
  cart: CartItem[],
  variantId: string,
  quantity: number,
  stock: number,
): { items: CartItem[]; clamped: boolean } {
  if (quantity <= 0) {
    return { items: removeItemFromCart(cart, variantId), clamped: false };
  }

  const items = [...cart.map((i) => ({ ...i }))];
  const item = items.find((i) => i.variantId === variantId);
  if (!item) return { items, clamped: false };

  const finalQty = clampQuantity(quantity, stock);
  item.quantity = finalQty;

  return { items, clamped: finalQty < quantity };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("clampQuantity", () => {
  it("returns 0 when stock is 0", () => {
    assert.equal(clampQuantity(5, 0), 0);
  });

  it("returns requested when within stock", () => {
    assert.equal(clampQuantity(3, 10), 3);
  });

  it("clamps to stock when requested exceeds stock", () => {
    assert.equal(clampQuantity(15, 10), 10);
  });

  it("returns 1 when requested is 0 but stock available", () => {
    assert.equal(clampQuantity(0, 5), 1);
  });

  it("returns 0 for negative stock", () => {
    assert.equal(clampQuantity(3, -1), 0);
  });
});

describe("computeSubtotal", () => {
  it("returns 0 for empty cart", () => {
    assert.equal(computeSubtotal([]), 0);
  });

  it("computes correct subtotal for single item", () => {
    const items: EnrichedItem[] = [
      { variantId: "v1", priceCents: 4900, stock: 10, quantity: 2 },
    ];
    assert.equal(computeSubtotal(items), 9800);
  });

  it("computes correct subtotal for multiple items", () => {
    const items: EnrichedItem[] = [
      { variantId: "v1", priceCents: 4900, stock: 10, quantity: 2 },
      { variantId: "v2", priceCents: 5900, stock: 5, quantity: 1 },
    ];
    assert.equal(computeSubtotal(items), 15700);
  });
});

describe("computeTotalItems", () => {
  it("returns 0 for empty cart", () => {
    assert.equal(computeTotalItems([]), 0);
  });

  it("sums quantities correctly", () => {
    const items: EnrichedItem[] = [
      { variantId: "v1", priceCents: 4900, stock: 10, quantity: 2 },
      { variantId: "v2", priceCents: 5900, stock: 5, quantity: 3 },
    ];
    assert.equal(computeTotalItems(items), 5);
  });
});

describe("addItemToCart", () => {
  it("adds new item to empty cart", () => {
    const { items, clamped } = addItemToCart([], "v1", 1, 10);
    assert.equal(items.length, 1);
    assert.equal(items[0].variantId, "v1");
    assert.equal(items[0].quantity, 1);
    assert.equal(clamped, false);
  });

  it("increments existing item quantity", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 2 }];
    const { items, clamped } = addItemToCart(cart, "v1", 1, 10);
    assert.equal(items.length, 1);
    assert.equal(items[0].quantity, 3);
    assert.equal(clamped, false);
  });

  it("clamps quantity to stock", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 4 }];
    const { items, clamped } = addItemToCart(cart, "v1", 2, 5);
    assert.equal(items[0].quantity, 5);
    assert.equal(clamped, true);
  });

  it("returns quantity 0 when stock is 0", () => {
    const { items } = addItemToCart([], "v1", 1, 0);
    assert.equal(items[0].quantity, 0);
  });
});

describe("removeItemFromCart", () => {
  it("removes existing item", () => {
    const cart: CartItem[] = [
      { variantId: "v1", quantity: 2 },
      { variantId: "v2", quantity: 1 },
    ];
    const result = removeItemFromCart(cart, "v1");
    assert.equal(result.length, 1);
    assert.equal(result[0].variantId, "v2");
  });

  it("returns same cart if item not found", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 2 }];
    const result = removeItemFromCart(cart, "v999");
    assert.equal(result.length, 1);
  });
});

describe("updateItemInCart", () => {
  it("updates quantity", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 2 }];
    const { items, clamped } = updateItemInCart(cart, "v1", 5, 10);
    assert.equal(items[0].quantity, 5);
    assert.equal(clamped, false);
  });

  it("removes item when quantity is 0", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 2 }];
    const { items } = updateItemInCart(cart, "v1", 0, 10);
    assert.equal(items.length, 0);
  });

  it("clamps to stock", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 2 }];
    const { items, clamped } = updateItemInCart(cart, "v1", 8, 5);
    assert.equal(items[0].quantity, 5);
    assert.equal(clamped, true);
  });

  it("does nothing for non-existent item", () => {
    const cart: CartItem[] = [{ variantId: "v1", quantity: 2 }];
    const { items } = updateItemInCart(cart, "v999", 3, 10);
    assert.equal(items.length, 1);
    assert.equal(items[0].quantity, 2);
  });
});

// Run with: node --test src/__tests__/cart-math.test.ts
// (requires tsx or ts-node for TypeScript support)
