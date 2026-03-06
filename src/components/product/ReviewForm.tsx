"use client";

import { useState, useActionState } from "react";
import { Star, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createReviewAction, type CreateReviewState } from "@/actions/reviews";
import { motion, AnimatePresence } from "motion/react";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [state, formAction, isPending] = useActionState<CreateReviewState, FormData>(
    createReviewAction,
    {},
  );

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
      >
        <CheckCircle className="h-5 w-5 text-emerald-600" />
        <p className="text-sm text-emerald-800">
          Vielen Dank! Ihre Bewertung wird nach Prüfung veröffentlicht.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      {/* Star rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-brand-dark">
          Ihre Bewertung
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} Stern${star !== 1 ? "e" : ""}`}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hoveredRating || rating) >= star
                    ? "fill-brand-gold text-brand-gold"
                    : "fill-none text-brand-neutral-light/40",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label htmlFor="review-body" className="mb-2 block text-sm font-medium text-brand-dark">
          Ihr Kommentar <span className="font-normal text-brand-neutral">(optional)</span>
        </label>
        <textarea
          id="review-body"
          name="body"
          rows={3}
          maxLength={2000}
          placeholder="Erzählen Sie anderen von Ihren Erfahrungen..."
          className="w-full rounded-xl border border-brand-neutral-light/20 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-brand-neutral-light/60 outline-none transition-all focus:border-brand-gold/40 focus:ring-2 focus:ring-brand-gold/10"
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className={cn(
          "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200",
          rating > 0
            ? "bg-brand-dark text-white shadow-lg shadow-brand-dark/15 hover:bg-brand-dark-soft hover:shadow-xl"
            : "cursor-not-allowed bg-brand-neutral-light/20 text-brand-neutral-light",
        )}
      >
        <Send className="h-4 w-4" />
        {isPending ? "Wird gesendet…" : "Bewertung abschicken"}
      </button>
    </form>
  );
}
