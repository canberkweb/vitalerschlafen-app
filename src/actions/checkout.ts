"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getCartFromCookie } from "@/lib/cart";
import { calculateShippingCents, isValidEUCountry } from "@/lib/shipping";
import { checkoutSchema } from "@/lib/validations/checkout";

// ─── Rate Limiting (basic in-memory) ────────────────────────────────────────
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(userId);
  if (last && now - last < RATE_LIMIT_MS) return false;
  rateLimitMap.set(userId, now);
  // Clean stale entries
  if (rateLimitMap.size > 500) {
    for (const [key, time] of rateLimitMap) {
      if (now - time > RATE_LIMIT_MS * 10) rateLimitMap.delete(key);
    }
  }
  return true;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CheckoutResult {
  success: boolean;
  clientSecret?: string;
  orderId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// ─── Action ─────────────────────────────────────────────────────────────────

export async function createCheckoutAction(formData: FormData): Promise<CheckoutResult> {
  // 1. Auth check
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?from=/checkout");
  }

  // 2. Rate limit
  if (!checkRateLimit(user.userId)) {
    return {
      success: false,
      error: "Bitte warten Sie einen Moment, bevor Sie es erneut versuchen.",
    };
  }

  // 3. Validate form inputs
  const raw = {
    shippingName: formData.get("shippingName"),
    email: formData.get("email"),
    shippingAddress1: formData.get("shippingAddress1"),
    shippingAddress2: formData.get("shippingAddress2"),
    shippingPostalCode: formData.get("shippingPostalCode"),
    shippingCity: formData.get("shippingCity"),
    shippingCountry: formData.get("shippingCountry"),
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const input = parsed.data;

  // 4. Validate country
  if (!isValidEUCountry(input.shippingCountry)) {
    return {
      success: false,
      error: "Versand ist nur innerhalb der EU möglich.",
    };
  }

  // 5. Get cart from cookie
  const cart = await getCartFromCookie();
  if (cart.items.length === 0) {
    return {
      success: false,
      error: "Ihr Warenkorb ist leer.",
    };
  }

  // 6. Re-check stock and compute totals server-side
  const variantIds = cart.items.map((item) => item.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
  });
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const stockErrors: string[] = [];
  let subtotalCents = 0;

  const orderItems: Array<{
    variantId: string;
    quantity: number;
    unitCents: number;
  }> = [];

  for (const cartItem of cart.items) {
    const variant = variantMap.get(cartItem.variantId);
    if (!variant) {
      stockErrors.push(`Artikel nicht mehr verfügbar.`);
      continue;
    }
    if (variant.stock < cartItem.quantity) {
      stockErrors.push(
        `„${variant.label}" — nur noch ${variant.stock} Stück verfügbar (${cartItem.quantity} gewünscht).`,
      );
      continue;
    }

    subtotalCents += variant.priceCents * cartItem.quantity;
    orderItems.push({
      variantId: variant.id,
      quantity: cartItem.quantity,
      unitCents: variant.priceCents,
    });
  }

  if (stockErrors.length > 0) {
    return {
      success: false,
      error: `Bestandsprobleme:\n${stockErrors.join("\n")}\n\nBitte passen Sie Ihren Warenkorb an.`,
    };
  }

  // 7. Calculate shipping
  const shippingCents = calculateShippingCents(input.shippingCountry, subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  if (totalCents < 50) {
    // Stripe minimum is 50 cents for EUR
    return {
      success: false,
      error: "Der Mindestbestellwert beträgt 0,50 €.",
    };
  }

  // 8. Create Order with PENDING_PAYMENT
  const order = await db.order.create({
    data: {
      userId: user.userId,
      status: "PENDING_PAYMENT",
      subtotalCents,
      shippingCents,
      totalCents,
      email: input.email,
      shippingName: input.shippingName,
      shippingAddress1: input.shippingAddress1,
      shippingAddress2: input.shippingAddress2 || null,
      shippingPostalCode: input.shippingPostalCode,
      shippingCity: input.shippingCity,
      shippingCountry: input.shippingCountry,
      items: {
        create: orderItems,
      },
    },
  });

  // 9. Create Stripe PaymentIntent
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      metadata: {
        orderId: order.id,
        userId: user.userId,
      },
      description: `Vitalerschlafen Bestellung ${order.id}`,
      receipt_email: input.email,
    });

    // Store PaymentIntent ID on Order
    await db.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      orderId: order.id,
    };
  } catch (err: unknown) {
    // Clean up the order if Stripe fails
    await db.order.delete({ where: { id: order.id } }).catch(() => {});

    // Log full error details
    if (err instanceof Error) {
      console.error("[CHECKOUT] Stripe PaymentIntent creation failed:", err.message);
      console.error("[CHECKOUT] Full error:", JSON.stringify(err, null, 2));
    } else {
      console.error("[CHECKOUT] Stripe PaymentIntent creation failed:", err);
    }

    // Surface Stripe-specific errors for debugging
    const stripeErr = err as { type?: string; code?: string; message?: string };
    const detail = stripeErr?.message ?? "Unbekannter Fehler";
    return {
      success: false,
      error: `Zahlungsfehler: ${detail}`,
    };
  }
}
