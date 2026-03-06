"use client";

import { motion } from "motion/react";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductGridSectionProps {
  products: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    images: { url: string; alt: string | null }[];
    variants: { priceCents: number; lavenderIncluded: boolean }[];
  }[];
}

export function ProductGridSection({ products }: ProductGridSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-brand-neutral-light/10 bg-brand-bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-dark">
            Unsere Kollektion
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
            Premium Schlafkissen
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-neutral">
            Handgefertigt aus Bio Hirsenschalen — für erholsamen,
            natürlichen Schlaf. Optional mit beruhigendem Lavendel.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
