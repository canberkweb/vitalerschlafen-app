import { cache } from "react";
import { db } from "@/lib/db";

export const getOrderById = cache(async (orderId: string) => {
  return db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      user: { select: { id: true, email: true, name: true } },
    },
  });
});

export const getOrdersByUserId = cache(async (userId: string) => {
  return db.order.findMany({
    where: { userId },
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
    orderBy: { createdAt: "desc" },
  });
});

export const getAllOrdersAdmin = cache(async () => {
  return db.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { title: true } },
            },
          },
        },
      },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getOrderByPaymentIntentId = async (paymentIntentId: string) => {
  return db.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: {
      items: {
        include: {
          variant: true,
        },
      },
    },
  });
};
