import Stripe from "stripe";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
  }
  return key;
}

export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set in environment variables.");
  }
  return secret;
}
