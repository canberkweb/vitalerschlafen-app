"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Flower2 } from "lucide-react";
import { formatPriceShort } from "@/lib/utils/format";

interface ProductCardProps {
  product: {
    title: string;
    slug: string;
    description: string | null;
    images: { url: string; alt: string | null }[];
    variants: { priceCents: number; lavenderIncluded: boolean }[];
  };
  /** Stagger index for animation delay */
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const lowestPrice = product.variants[0]?.priceCents;
  const hasLavender = product.variants.some((v) => v.lavenderIncluded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: index * 0.08,
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-brand-neutral-light/10 bg-white shadow-sm transition-all duration-300 hover:border-brand-gold/20 hover:shadow-lg hover:shadow-brand-gold/5"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-bg to-brand-bg-white">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt ?? product.title}
              width={480}
              height={480}
              className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-brand-neutral-light">Bild folgt</span>
            </div>
          )}

          {/* Lavender badge */}
          {hasLavender && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-600 shadow-sm">
              <Flower2 className="h-3 w-3" strokeWidth={2} />
              Lavendel optional
            </span>
          )}
        </div>

        {/* Copy */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-heading text-base font-semibold leading-snug text-brand-dark transition-colors group-hover:text-brand-gold-dark">
            {product.title}
          </h3>
          {product.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-brand-neutral">
              {product.description}
            </p>
          )}
          <div className="mt-auto pt-4">
            {lowestPrice !== undefined && (
              <p className="text-sm font-medium text-brand-dark">
                ab{" "}
                <span className="tabular-nums">
                  {formatPriceShort(lowestPrice)}
                </span>
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
