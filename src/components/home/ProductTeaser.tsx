"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Wheat, Ruler, Globe } from "lucide-react";
import { formatPriceShort } from "@/lib/utils/format";

interface ProductTeaserProps {
  product: {
    title: string;
    slug: string;
    description: string | null;
    images: { url: string; alt: string | null }[];
    variants: { priceCents: number }[];
  };
  lowestPrice?: number;
}

const FEATURES = [
  { icon: Wheat, text: "100\u00A0% Bio Hirsenschalen" },
  { icon: Ruler, text: "3 Größen verfügbar" },
  { icon: Globe, text: "EU-weiter Versand" },
] as const;

export function ProductTeaser({ product, lowestPrice }: ProductTeaserProps) {
  return (
    <section className="border-t border-brand-neutral-light/10 bg-brand-bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="group relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-brand-bg to-brand-bg-white shadow-sm ring-1 ring-brand-neutral-light/10"
          >
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.title}
                width={600}
                height={600}
                className="h-full w-full object-contain p-10 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <Image
                src="/images/placeholder-product.svg"
                alt="Produktbild folgt"
                width={600}
                height={600}
                className="h-full w-full object-contain p-10 opacity-40"
              />
            )}
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
          >
            <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-dark md:text-4xl">
              {product.title}
            </h2>
            <div className="mt-4 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
            <p className="mt-5 text-base leading-relaxed text-brand-neutral">
              {product.description}
            </p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-brand-neutral"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gold/10">
                      <Icon className="h-3.5 w-3.5 text-brand-gold" strokeWidth={1.5} />
                    </div>
                    {i === 1 && lowestPrice
                      ? `${f.text} — ab ${formatPriceShort(lowestPrice)}`
                      : f.text}
                  </motion.li>
                );
              })}
            </ul>

            <Link
              href={`/product/${product.slug}`}
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-brand-dark px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-300 hover:bg-brand-dark-soft hover:shadow-xl hover:shadow-brand-dark/20"
            >
              Zum Produkt
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
