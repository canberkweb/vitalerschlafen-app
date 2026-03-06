"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { updateCartItemAction, removeCartItemAction } from "@/actions/cart";
import type { EnrichedCartItem } from "@/lib/cart/schema";

interface CartItemRowProps {
  item: EnrichedCartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const lineTotal = item.priceCents * quantity;
  const outOfStock = item.stock <= 0;

  function handleUpdate(newQty: number) {
    if (newQty < 1) {
      handleRemove();
      return;
    }
    setQuantity(newQty);
    setMessage(null);
    startTransition(async () => {
      const result = await updateCartItemAction(item.variantId, newQty);
      if (result.message) setMessage(result.message);
      if (!result.success) setQuantity(item.quantity);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCartItemAction(item.variantId);
    });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "grid grid-cols-[80px_1fr] gap-4 rounded-2xl border p-4 transition-colors sm:grid-cols-[100px_1fr]",
        outOfStock
          ? "border-red-200 bg-red-50/50"
          : "border-brand-neutral-light/10 bg-white",
        isPending && "opacity-60",
      )}
    >
      {/* Image */}
      <Link
        href={`/product/${item.productSlug}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-brand-bg-white"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productTitle}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="100px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-neutral-light">
            <span className="text-3xl">🛏️</span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-col justify-between gap-2">
        <div>
          <Link
            href={`/product/${item.productSlug}`}
            className="font-heading text-sm font-semibold text-brand-dark transition-colors hover:text-brand-gold-dark sm:text-base"
          >
            {item.productTitle}
          </Link>
          <p className="mt-0.5 text-xs text-brand-neutral">{item.variantLabel}</p>

          {/* Stock warning */}
          {(item.clamped || outOfStock) && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              {outOfStock
                ? "Nicht verfügbar"
                : `Nur noch ${item.stock} Stück verfügbar`}
            </div>
          )}

          {message && (
            <p className="mt-1 text-xs text-amber-600">{message}</p>
          )}
        </div>

        {/* Bottom row: quantity + price */}
        <div className="flex items-end justify-between gap-4">
          {/* Quantity controls */}
          {!outOfStock && (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleUpdate(quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-neutral-light/15 text-brand-neutral transition-colors hover:border-brand-gold/30 hover:text-brand-dark disabled:opacity-40"
                aria-label="Menge verringern"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="flex h-8 w-10 items-center justify-center text-sm font-medium tabular-nums text-brand-dark">
                {quantity}
              </span>
              <button
                type="button"
                disabled={isPending || quantity >= item.stock}
                onClick={() => handleUpdate(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-neutral-light/15 text-brand-neutral transition-colors hover:border-brand-gold/30 hover:text-brand-dark disabled:opacity-40"
                aria-label="Menge erhöhen"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Price + remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tabular-nums text-brand-dark">
              {outOfStock ? "—" : formatPrice(lineTotal)}
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={handleRemove}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-neutral transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
              aria-label="Entfernen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
