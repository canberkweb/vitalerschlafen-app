import { cache } from "react";
import { db } from "@/lib/db";

/**
 * Get approved reviews for a product (public).
 */
export const getApprovedReviewsByProductId = cache(async (productId: string) => {
  return db.review.findMany({
    where: { productId, isApproved: true },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});

/**
 * Get average rating for a product (only approved reviews).
 */
export const getProductRatingStats = cache(async (productId: string) => {
  const result = await db.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count.rating,
  };
});

/**
 * Check if a user already reviewed a product.
 */
export const getUserReviewForProduct = cache(
  async (productId: string, userId: string) => {
    return db.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
  },
);

/**
 * Get all reviews for admin moderation.
 */
export const getAllReviewsAdmin = cache(async () => {
  return db.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});
