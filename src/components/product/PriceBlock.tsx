"use client";

import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { Check, X } from "lucide-react";

interface PriceBlockProps {
  priceCents: number;
  stock: number;
}

export function PriceBlock({ priceCents, stock }: PriceBlockProps) {
  const inStock = stock > 0;

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        <motion.p
          key={priceCents}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="font-heading text-4xl font-semibold tracking-tight text-brand-dark"
        >
          {formatPrice(priceCents)}
        </motion.p>
      </AnimatePresence>

      <p className="text-xs text-brand-neutral">
        inkl. MwSt. zzgl.{" "}
        <Link
          href="/versand-zahlung"
          className="underline underline-offset-2 transition-colors hover:text-brand-gold-dark"
        >
          Versandkosten
        </Link>
      </p>

      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
          inStock
            ? "bg-brand-success/8 text-brand-success"
            : "bg-brand-error/8 text-brand-error",
        )}
      >
        {inStock ? (
          <Check className="h-3 w-3" />
        ) : (
          <X className="h-3 w-3" />
        )}
        {inStock ? "Auf Lager — Versandfertig" : "Nicht verfügbar"}
      </div>
    </div>
  );
}
