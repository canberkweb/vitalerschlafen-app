"use client";

import { useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { clearCartAction } from "@/actions/cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import type { EnrichedCart } from "@/lib/cart/schema";

interface CartClientProps {
  cart: EnrichedCart;
}

export function CartClient({ cart }: CartClientProps) {
  const [isPending, startTransition] = useTransition();

  const isEmpty = cart.items.length === 0;
  const allOutOfStock = cart.items.every((i) => i.stock <= 0);

  function handleClear() {
    startTransition(async () => {
      await clearCartAction();
    });
  }

  // ─── Empty state ──────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gold/8">
          <ShoppingBag className="h-9 w-9 text-brand-gold" />
        </div>
        <h2 className="mt-6 font-heading text-2xl font-semibold text-brand-dark">
          Ihr Warenkorb ist leer
        </h2>
        <p className="mt-2 max-w-sm text-sm text-brand-neutral">
          Entdecken Sie unser Premium-Hirsekissen und gönnen Sie sich erholsamen
          Schlaf.
        </p>
        <Link
          href="/product/hirsekissen"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-200 hover:bg-brand-dark-soft hover:shadow-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Zum Hirsekissen
        </Link>
      </motion.div>
    );
  }

  // ─── Cart with items ──────────────────────────────────────────────────
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      {/* Left: Item list */}
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-neutral">
            {cart.totalItems} {cart.totalItems === 1 ? "Artikel" : "Artikel"} im
            Warenkorb
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-brand-neutral transition-colors hover:text-red-500 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Alle entfernen
          </button>
        </div>

        {/* Stock warning banner */}
        {cart.hasStockWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-700">
              Einige Artikel haben eine begrenzte Verfügbarkeit. Mengen wurden
              automatisch angepasst.
            </p>
          </motion.div>
        )}

        {/* Item rows */}
        <AnimatePresence mode="popLayout">
          {cart.items.map((item) => (
            <CartItemRow key={item.variantId} item={item} />
          ))}
        </AnimatePresence>

        {/* Continue shopping */}
        <Link
          href="/product/hirsekissen"
          className="mt-4 inline-flex items-center gap-2 text-sm text-brand-neutral transition-colors hover:text-brand-dark"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Weiter einkaufen
        </Link>
      </div>

      {/* Right: Order summary */}
      <div className="lg:sticky lg:top-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm"
        >
          <h2 className="font-heading text-lg font-semibold text-brand-dark">
            Zusammenfassung
          </h2>
          <div className="mt-1 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

          {/* Line items summary */}
          <div className="mt-5 space-y-3 border-b border-brand-neutral-light/10 pb-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-neutral">Zwischensumme</span>
              <span className="font-medium tabular-nums text-brand-dark">
                {formatPrice(cart.subtotalCents)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-neutral">Versand</span>
              <Link
                href="/versand-zahlung"
                className="text-xs text-brand-gold-dark underline-offset-2 hover:underline"
              >
                Wird an der Kasse berechnet
              </Link>
            </div>
          </div>

          {/* Total */}
          <div className="mt-5 flex items-center justify-between">
            <span className="font-heading text-base font-semibold text-brand-dark">
              Gesamt
            </span>
            <span className="font-heading text-xl font-bold tabular-nums text-brand-dark">
              {formatPrice(cart.subtotalCents)}
            </span>
          </div>

          {/* Shipping note */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-gold/5 px-3 py-2">
            <Truck className="h-4 w-4 text-brand-gold" />
            <p className="text-xs text-brand-neutral">
              Kostenloser Versand ab 100,00 €
            </p>
          </div>

          {/* VAT note */}
          <p className="mt-3 text-[11px] text-brand-neutral-light">
            Alle Preise inkl. MwSt.
          </p>

          {/* CTA */}
          <Link
            href="/checkout"
            className={cn(
              "mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-200",
              allOutOfStock
                ? "cursor-not-allowed bg-brand-neutral-light/30 text-brand-neutral"
                : "bg-brand-dark text-white shadow-lg shadow-brand-dark/15 hover:bg-brand-dark-soft hover:shadow-xl hover:shadow-brand-dark/20",
            )}
            aria-disabled={allOutOfStock}
            onClick={allOutOfStock ? (e) => e.preventDefault() : undefined}
          >
            Zur Kasse
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
