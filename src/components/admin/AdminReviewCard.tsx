"use client";

import { useActionState } from "react";
import { Star, Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { adminReviewAction, type AdminReviewState } from "@/actions/reviews";

interface AdminReviewCardProps {
  review: {
    id: string;
    rating: number;
    body: string | null;
    isApproved: boolean;
    createdAt: Date;
    user: { name: string | null; email: string };
    product: { title: string; slug: string };
  };
}

export function AdminReviewCard({ review }: AdminReviewCardProps) {
  const [state, formAction, isPending] = useActionState<AdminReviewState, FormData>(
    adminReviewAction,
    {},
  );

  if (state.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Aktion erfolgreich durchgeführt.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-sm",
        review.isApproved
          ? "border-brand-neutral-light/10"
          : "border-amber-200",
      )}
    >
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3.5 w-3.5",
                      review.rating >= star
                        ? "fill-brand-gold text-brand-gold"
                        : "fill-none text-brand-neutral-light/30",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-brand-dark">
                {review.user.name ?? review.user.email}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-brand-neutral">
              {review.product.title} ·{" "}
              {new Date(review.createdAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              review.isApproved
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800",
            )}
          >
            {review.isApproved ? "Freigegeben" : "Ausstehend"}
          </span>
        </div>

        {/* Body */}
        {review.body && (
          <p className="mt-3 text-sm leading-relaxed text-brand-neutral">
            {review.body}
          </p>
        )}

        {/* Error */}
        {state.error && (
          <p className="mt-2 text-xs text-red-600">{state.error}</p>
        )}

        {/* Actions */}
        {!review.isApproved && (
          <div className="mt-4 flex gap-2 border-t border-brand-neutral-light/10 pt-4">
            <form action={formAction}>
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="action" value="approve" />
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Check className="h-3 w-3" />
                Freigeben
              </button>
            </form>
            <form action={formAction}>
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="action" value="reject" />
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <X className="h-3 w-3" />
                Ablehnen
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
