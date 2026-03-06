"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check, Leaf, Shield, Truck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ProductGallery } from "@/components/product/ProductGallery";
import { LavenderSelector } from "@/components/product/LavenderSelector";
import { PriceBlock } from "@/components/product/PriceBlock";
import { addToCartAction } from "@/actions/cart";
import { formatPrice } from "@/lib/utils/format";
import type {
  ProductVariantData,
  ProductImageData,
} from "@/server/repositories/products";

interface ProductDetailClientProps {
  productTitle: string;
  productDescription?: string | null;
  variants: ProductVariantData[];
  images: ProductImageData[];
}

const BENEFITS = [
  { icon: Leaf, text: "100\u00A0% Bio Hirsenschalen-Füllung" },
  { icon: Shield, text: "Der Bezug besteht aus 100\u00A0% Bionassel" },
  { icon: Truck, text: "EU-weiter Versand — 14 Tage Rückgabe" },
] as const;

export function ProductDetailClient({
  productTitle,
  productDescription,
  variants,
  images,
}: ProductDetailClientProps) {
  const hasLavenderOption = variants.some((v) => v.lavenderIncluded);
  const [wantsLavender, setWantsLavender] = useState(false);

  const selected = useMemo(() => {
    if (!hasLavenderOption) return variants[0];
    return variants.find((v) => v.lavenderIncluded === wantsLavender) ?? variants[0];
  }, [variants, wantsLavender, hasLavenderOption]);

  const lavenderSurcharge = useMemo(() => {
    const base = variants.find((v) => !v.lavenderIncluded)?.priceCents ?? 0;
    const lav = variants.find((v) => v.lavenderIncluded)?.priceCents ?? 0;
    return lav - base;
  }, [variants]);

  const [added, setAdded] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAddToCart() {
    if (!selected || selected.stock <= 0) return;
    setCartMessage(null);
    startTransition(async () => {
      const result = await addToCartAction(selected.id, 1);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        router.refresh();
      }
      if (result.message) setCartMessage(result.message);
    });
  }

  if (!selected) return null;

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <ProductGallery images={images} productTitle={productTitle} />
      </motion.div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        <div>
          <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-dark md:text-4xl lg:text-[2.75rem]">
            {productTitle}
          </h1>
          <div className="mt-4 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
          {productDescription && (
            <p className="mt-4 text-sm leading-relaxed text-brand-neutral">
              {productDescription}
            </p>
          )}
        </div>

        <PriceBlock priceCents={selected.priceCents} stock={selected.stock} />

        {/* Size info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-neutral">
            Größe
          </p>
          <p className="mt-1.5 text-sm font-medium text-brand-dark">
            {selected.size}
          </p>
        </div>

        {/* Lavender selector */}
        {hasLavenderOption && (
          <LavenderSelector
            hasLavender={wantsLavender}
            onChange={setWantsLavender}
            surchargeFormatted={formatPrice(lavenderSurcharge)}
          />
        )}

        {/* Add to cart */}
        <motion.button
          type="button"
          disabled={selected.stock <= 0 || isPending}
          onClick={handleAddToCart}
          whileHover={selected.stock > 0 ? { scale: 1.02 } : undefined}
          whileTap={selected.stock > 0 ? { scale: 0.98 } : undefined}
          className={cn(
            "relative mt-2 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 text-sm font-medium transition-all duration-300 md:w-auto",
            added
              ? "bg-brand-success text-white shadow-lg shadow-brand-success/25"
              : "bg-brand-dark text-white shadow-lg shadow-brand-dark/20 hover:bg-brand-dark-soft hover:shadow-xl hover:shadow-brand-dark/25",
            (selected.stock <= 0 || isPending) &&
              "cursor-not-allowed opacity-40 shadow-none hover:shadow-none",
          )}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Hinzugefügt
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> In den Warenkorb
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {cartMessage && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {cartMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="mt-4 space-y-3 border-t border-brand-neutral-light/15 pt-6">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 text-sm text-brand-neutral">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gold/8">
                  <Icon className="h-3.5 w-3.5 text-brand-gold" strokeWidth={1.5} />
                </div>
                {b.text}
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
