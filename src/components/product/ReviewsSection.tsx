import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";
import {
  getApprovedReviewsByProductId,
  getProductRatingStats,
  getUserReviewForProduct,
} from "@/server/repositories/reviews";
import { getCurrentUser } from "@/lib/auth";

interface ReviewsSectionProps {
  productId: string;
}

export async function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, stats, user] = await Promise.all([
    getApprovedReviewsByProductId(productId),
    getProductRatingStats(productId),
    getCurrentUser(),
  ]);

  // Check if current user already reviewed
  let hasReviewed = false;
  if (user) {
    const existing = await getUserReviewForProduct(productId, user.userId);
    hasReviewed = !!existing;
  }

  return (
    <section id="bewertung" className="mt-20 border-t border-brand-neutral-light/10 pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="font-heading text-xl font-semibold text-brand-dark">
            Kundenbewertungen
          </h2>
          <div className="mt-2 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        </div>
        {stats.count > 0 && (
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(stats.average)} size="md" />
            <span className="text-sm text-brand-neutral">
              {stats.average.toFixed(1)} von 5 · {stats.count} Bewertung{stats.count !== 1 ? "en" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {user && !hasReviewed && (
        <div className="mb-10 rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-brand-dark">
            Ihre Bewertung
          </h3>
          <ReviewForm productId={productId} />
        </div>
      )}

      {!user && (
        <div className="mb-10 rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm text-center">
          <p className="text-sm text-brand-neutral">
            <a href="/login" className="font-medium text-brand-dark underline underline-offset-2 hover:text-brand-gold">
              Melden Sie sich an
            </a>
            , um eine Bewertung zu schreiben.
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-brand-neutral">
          Noch keine Bewertungen. Seien Sie der Erste!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} />
                  <span className="text-sm font-medium text-brand-dark">
                    {review.user.name ?? "Anonym"}
                  </span>
                </div>
                <time className="text-xs text-brand-neutral">
                  {new Date(review.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              {review.body && (
                <p className="mt-3 text-sm leading-relaxed text-brand-neutral">
                  {review.body}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
