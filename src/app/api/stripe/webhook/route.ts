import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, getStripeWebhookSecret } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";
import { generateInvoiceNumber } from "@/lib/invoice";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[WEBHOOK] Signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle payment_intent.succeeded
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      await handlePaymentSuccess(paymentIntent);
    } catch (err) {
      console.error("[WEBHOOK] Error handling payment_intent.succeeded:", err);
      // Return 200 to Stripe so it doesn't retry — log error for manual resolution
      return NextResponse.json({ received: true, warning: "processing_error" });
    }
  }

  // Handle payment_intent.payment_failed
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`[WEBHOOK] Payment failed for PI: ${paymentIntent.id}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Find order by Stripe PaymentIntent ID
  const order = await db.order.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: {
      items: {
        include: { variant: true },
      },
    },
  });

  if (!order) {
    console.error(`[WEBHOOK] No order found for PaymentIntent: ${paymentIntent.id}`);
    return;
  }

  // Idempotency: if already processed, skip
  if (
    order.status === "PAID" ||
    order.status === "PREPARING" ||
    order.status === "SHIPPED" ||
    order.status === "DELIVERED"
  ) {
    console.log(`[WEBHOOK] Order ${order.id} already processed (status: ${order.status}), skipping.`);
    return;
  }

  // Process payment in a transaction
  await db.$transaction(async (tx) => {
    // Check stock for all items first
    let needsManualReview = false;

    for (const item of order.items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant || variant.stock < item.quantity) {
        needsManualReview = true;
        break;
      }
    }

    if (needsManualReview) {
      // Mark for manual review — do not decrement stock
      await tx.order.update({
        where: { id: order.id },
        data: { status: "MANUAL_REVIEW" },
      });
      console.warn(
        `[WEBHOOK] Order ${order.id} marked for MANUAL_REVIEW — insufficient stock after payment.`,
      );
      return;
    }

    // Update order status to PAID and assign invoice number
    const invoiceNumber = generateInvoiceNumber();
    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID", invoiceNumber },
    });

    // Decrement stock for each variant
    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  // Re-fetch to check final status
  const updatedOrder = await db.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: { select: { title: true } } },
          },
        },
      },
    },
  });

  // Send confirmation email if order was marked as PAID
  if (updatedOrder && updatedOrder.status === "PAID") {
    const emailData = orderConfirmationEmail({
      orderId: updatedOrder.id,
      email: updatedOrder.email,
      shippingName: updatedOrder.shippingName,
      totalCents: updatedOrder.totalCents,
      subtotalCents: updatedOrder.subtotalCents,
      shippingCents: updatedOrder.shippingCents,
      invoiceNumber: updatedOrder.invoiceNumber,
      items: updatedOrder.items.map((item) => ({
        quantity: item.quantity,
        unitCents: item.unitCents,
        variant: { size: item.variant.size, lavenderIncluded: item.variant.lavenderIncluded },
        productTitle: item.variant.product.title,
      })),
    });
    await sendEmail({
      to: updatedOrder.email,
      ...emailData,
      replyTo: "info@vitalerschlafen.de",
    });
    console.log(`[WEBHOOK] Order ${updatedOrder.id} confirmed as PAID. Email sent.`);
  }
}
