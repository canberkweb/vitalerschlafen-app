"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { formatPriceShort } from "@/lib/utils/format";

interface HeroSectionProps {
  lowestPrice?: number;
}

export function HeroSection({ lowestPrice }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-brand-bg px-6 py-32 text-center">
      {/* Subtle radial gradient bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(230,190,145,0.15) 0%, transparent 70%)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold-dark"
      >
        Handgefertigt in Deutschland
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative mx-auto max-w-2xl font-heading text-5xl font-semibold leading-[1.1] tracking-tight text-brand-dark md:text-6xl lg:text-7xl"
      >
        Schlafen Sie
        <br />
        <span className="bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light bg-clip-text text-transparent">
          vital
        </span>
        er.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative mx-auto mt-7 max-w-md text-lg leading-relaxed text-brand-neutral"
      >
        Premium Hirsekissen aus 100&nbsp;% biologischer Goldhirse —
        für erholsamen, natürlichen Schlaf.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative mt-10 flex items-center gap-5"
      >
        <Link
          href="/product/hirsekissen"
          className="group flex items-center gap-2 rounded-xl bg-brand-dark px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-300 hover:bg-brand-dark-soft hover:shadow-xl hover:shadow-brand-dark/20"
        >
          Jetzt entdecken
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        {lowestPrice && (
          <span className="text-sm font-medium text-brand-neutral">
            Ab {formatPriceShort(lowestPrice)}
          </span>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border-2 border-brand-neutral-light/30"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-gold"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
