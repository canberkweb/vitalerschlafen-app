"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createReviewSchema } from "@/lib/validations/review";
import { adminReviewSchema } from "@/lib/validations/review";

// ─── Create Review (Customer) ────────────────────────────────────────────────

export interface CreateReviewState {
  success?: boolean;
  error?: string;
}

export async function createReviewAction(
  _prev: CreateReviewState,
  formData: FormData,
): Promise<CreateReviewState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = {
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    body: formData.get("body"),
  };

  const parsed = createReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { productId, rating, body } = parsed.data;

  try {
    // Check if user already reviewed this product
    const existing = await db.review.findUnique({
      where: { productId_userId: { productId, userId: user.userId } },
    });

    if (existing) {
      return { error: "Sie haben dieses Produkt bereits bewertet." };
    }

    // Check if user has purchased this product (at least one delivered/paid order)
    const hasPurchased = await db.orderItem.findFirst({
      where: {
        variant: { productId },
        order: {
          userId: user.userId,
          status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        },
      },
    });

    if (!hasPurchased) {
      return {
        error:
          "Sie können nur Produkte bewerten, die Sie gekauft haben.",
      };
    }

    await db.review.create({
      data: {
        productId,
        userId: user.userId,
        rating,
        body: body || null,
        isApproved: false, // Requires admin approval
      },
    });

    // Find product slug for revalidation
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });
    if (product) {
      revalidatePath(`/product/${product.slug}`);
    }

    return { success: true };
  } catch {
    return { error: "Fehler beim Speichern der Bewertung." };
  }
}

// ─── Admin: Approve / Reject Review ─────────────────────────────────────────

export interface AdminReviewState {
  success?: boolean;
  error?: string;
}

export async function adminReviewAction(
  _prev: AdminReviewState,
  formData: FormData,
): Promise<AdminReviewState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  const raw = {
    reviewId: formData.get("reviewId"),
    action: formData.get("action"),
  };

  const parsed = adminReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { reviewId, action } = parsed.data;

  try {
    if (action === "approve") {
      await db.review.update({
        where: { id: reviewId },
        data: { isApproved: true },
      });
    } else {
      // Reject = delete
      await db.review.delete({
        where: { id: reviewId },
      });
    }

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch {
    return { error: "Fehler beim Aktualisieren der Bewertung." };
  }
}
