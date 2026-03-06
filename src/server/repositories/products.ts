import { cache } from "react";
import { db } from "@/lib/db";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductWithDetails = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;

export type ProductVariantData = ProductWithDetails["variants"][number];
export type ProductImageData = ProductWithDetails["images"][number];

// ─── Queries (React cache for request deduplication) ─────────────────────────

/**
 * Get a single product by slug, including variants (ordered by price)
 * and images (ordered by sortOrder).
 */
export const getProductBySlug = cache(async (slug: string) => {
  return db.product.findUnique({
    where: { slug, active: true },
    include: {
      category: true,
      variants: { orderBy: { priceCents: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
});

/**
 * Get all active products with their cheapest variant price.
 * Used on homepage / product listings.
 */
export const getActiveProducts = cache(async () => {
  return db.product.findMany({
    where: { active: true },
    include: {
      category: true,
      variants: { orderBy: { priceCents: "asc" }, take: 1 },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { title: "asc" },
  });
});

/**
 * Get all variants for a product (admin usage).
 */
export const getProductVariants = cache(async (productId: string) => {
  return db.productVariant.findMany({
    where: { productId },
    orderBy: { priceCents: "asc" },
  });
});

/**
 * Get all products with all variants (admin listing).
 */
export const getAllProductsAdmin = cache(async () => {
  return db.product.findMany({
    include: {
      category: true,
      variants: { orderBy: { priceCents: "asc" } },
    },
    orderBy: { title: "asc" },
  });
});

/**
 * Get all active products in a category.
 */
export const getProductsByCategory = cache(async (categorySlug: string) => {
  return db.product.findMany({
    where: { active: true, category: { slug: categorySlug } },
    include: {
      category: true,
      variants: { orderBy: { priceCents: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { title: "asc" },
  });
});

/**
 * Get a category by slug.
 */
export const getCategoryBySlug = cache(async (slug: string) => {
  return db.category.findUnique({ where: { slug } });
});

/**
 * Get all categories.
 */
export const getAllCategories = cache(async () => {
  return db.category.findMany({ orderBy: { name: "asc" } });
});
