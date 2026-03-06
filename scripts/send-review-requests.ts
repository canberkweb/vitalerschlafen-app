/**
 * Review Request Automation Script
 *
 * Sends review request emails to customers who:
 * 1. Have orders with status DELIVERED
 * 2. Have NOT been sent a review request before
 * 3. Order was delivered at least 7 days ago (configurable)
 *
 * Usage: npx tsx scripts/send-review-requests.ts
 * Cron:  0 10 * * * cd /path/to/app && npx tsx scripts/send-review-requests.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../src/generated/prisma";
import { sendEmail, reviewRequestEmail } from "../src/lib/email";

const DAYS_AFTER_DELIVERY = 7;
const MAX_EMAILS_PER_RUN = 50;

async function main() {
  // Database connection
  const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_AFTER_DELIVERY);

  console.log(
    `[review-requests] Looking for DELIVERED orders before ${cutoffDate.toISOString()} without review requests...`,
  );

  // Find eligible orders
  const orders = await db.order.findMany({
    where: {
      status: "DELIVERED",
      reviewRequestSentAt: null,
      updatedAt: { lte: cutoffDate },
      userId: { not: null },
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { title: true, slug: true } },
            },
          },
        },
      },
    },
    take: MAX_EMAILS_PER_RUN,
    orderBy: { updatedAt: "asc" },
  });

  console.log(`[review-requests] Found ${orders.length} eligible orders.`);

  let sent = 0;
  let failed = 0;

  for (const order of orders) {
    // Use the first product in the order for the review email
    const firstItem = order.items[0];
    if (!firstItem) {
      console.warn(`[review-requests] Order ${order.id} has no items, skipping.`);
      continue;
    }

    const product = firstItem.variant.product;

    try {
      const emailData = reviewRequestEmail({
        orderId: order.id,
        email: order.email,
        shippingName: order.shippingName,
        productSlug: product.slug,
        productTitle: product.title,
      });

      const success = await sendEmail({
        to: order.email,
        ...emailData,
        replyTo: "info@vitalerschlafen.de",
      });

      if (success) {
        await db.order.update({
          where: { id: order.id },
          data: { reviewRequestSentAt: new Date() },
        });
        sent++;
        console.log(
          `[review-requests] Sent to ${order.email} for order ${order.id}`,
        );
      } else {
        failed++;
        console.error(
          `[review-requests] Failed to send to ${order.email} for order ${order.id}`,
        );
      }
    } catch (err) {
      failed++;
      console.error(
        `[review-requests] Error for order ${order.id}:`,
        err,
      );
    }
  }

  console.log(
    `[review-requests] Done. Sent: ${sent}, Failed: ${failed}, Total eligible: ${orders.length}`,
  );

  await db.$disconnect();
  pool.end();
}

main().catch((err) => {
  console.error("[review-requests] Fatal error:", err);
  process.exit(1);
});
