"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { Flower2 } from "lucide-react";

interface LavenderSelectorProps {
  hasLavender: boolean;
  onChange: (value: boolean) => void;
  surchargeFormatted: string;
}

export function LavenderSelector({
  hasLavender,
  onChange,
  surchargeFormatted,
}: LavenderSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-neutral">
        Lavendel-Option
      </legend>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        {/* Ohne Lavendel */}
        <motion.button
          type="button"
          onClick={() => onChange(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative flex items-center gap-3 rounded-xl border-2 px-5 py-3.5 text-left text-sm transition-all duration-200",
            !hasLavender
              ? "border-brand-gold bg-brand-gold/8 shadow-md shadow-brand-gold/10"
              : "border-brand-neutral-light/25 bg-white hover:border-brand-gold-light/60 hover:shadow-sm",
          )}
          aria-pressed={!hasLavender}
        >
          {!hasLavender && (
            <motion.span
              layoutId="lavender-indicator"
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-gold shadow-sm shadow-brand-gold/30"
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            />
          )}
          <span className={cn("font-medium", !hasLavender ? "text-brand-dark" : "text-brand-dark/80")}>
            Ohne Lavendel
          </span>
        </motion.button>

        {/* Mit Lavendel */}
        <motion.button
          type="button"
          onClick={() => onChange(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative flex items-center gap-3 rounded-xl border-2 px-5 py-3.5 text-left text-sm transition-all duration-200",
            hasLavender
              ? "border-brand-gold bg-brand-gold/8 shadow-md shadow-brand-gold/10"
              : "border-brand-neutral-light/25 bg-white hover:border-brand-gold-light/60 hover:shadow-sm",
          )}
          aria-pressed={hasLavender}
        >
          {hasLavender && (
            <motion.span
              layoutId="lavender-indicator"
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-gold shadow-sm shadow-brand-gold/30"
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            />
          )}
          <Flower2
            className={cn(
              "h-4 w-4 flex-shrink-0",
              hasLavender ? "text-purple-500" : "text-brand-neutral-light",
            )}
            strokeWidth={1.5}
          />
          <div>
            <span className={cn("block font-medium", hasLavender ? "text-brand-dark" : "text-brand-dark/80")}>
              Mit Lavendel
            </span>
            <span className={cn("block text-xs", hasLavender ? "text-brand-gold-dark" : "text-brand-neutral")}>
              +{surchargeFormatted}
            </span>
          </div>
        </motion.button>
      </div>
    </fieldset>
  );
}
