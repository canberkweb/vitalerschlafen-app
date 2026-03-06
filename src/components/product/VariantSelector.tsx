"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import type { ProductVariantData } from "@/server/repositories/products";
import { formatPrice } from "@/lib/utils/format";

interface VariantSelectorProps {
  variants: ProductVariantData[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-neutral">
        Größe wählen
      </legend>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const outOfStock = v.stock <= 0;
          return (
            <motion.button
              key={v.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(v.id)}
              whileHover={outOfStock ? undefined : { scale: 1.03 }}
              whileTap={outOfStock ? undefined : { scale: 0.97 }}
              className={cn(
                "relative rounded-xl border-2 px-5 py-3.5 text-sm transition-all duration-200",
                active
                  ? "border-brand-gold bg-brand-gold/8 shadow-md shadow-brand-gold/10"
                  : "border-brand-neutral-light/25 bg-white hover:border-brand-gold-light/60 hover:shadow-sm",
                outOfStock && "cursor-not-allowed opacity-35",
              )}
              aria-pressed={active}
            >
              {/* Active indicator dot */}
              {active && (
                <motion.span
                  layoutId="variant-indicator"
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-gold shadow-sm shadow-brand-gold/30"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <span
                className={cn(
                  "block font-medium",
                  active ? "text-brand-dark" : "text-brand-dark/80",
                  outOfStock && "line-through",
                )}
              >
                {v.label}
              </span>
              <span
                className={cn(
                  "mt-1 block text-xs",
                  active ? "text-brand-gold-dark" : "text-brand-neutral",
                )}
              >
                {formatPrice(v.priceCents)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}
