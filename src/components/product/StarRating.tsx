import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            "transition-colors",
            rating >= star
              ? "fill-brand-gold text-brand-gold"
              : rating >= star - 0.5
                ? "fill-brand-gold/50 text-brand-gold"
                : "fill-none text-brand-neutral-light/30",
          )}
        />
      ))}
    </div>
  );
}
