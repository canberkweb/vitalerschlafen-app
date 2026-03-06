"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ProductImageData } from "@/server/repositories/products";

interface ProductGalleryProps {
  images: ProductImageData[];
  productTitle: string;
}

const FALLBACK_IMAGE = "/images/placeholder-product.svg";

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: "fallback",
            url: FALLBACK_IMAGE,
            alt: productTitle,
            sortOrder: 0,
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const [isZoomed, setIsZoomed] = useState(false);
  const active = displayImages[activeIndex] ?? displayImages[0];

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > activeIndex ? 1 : -1);
      setActiveIndex(i);
    },
    [activeIndex],
  );

  const prev = useCallback(() => {
    const i = activeIndex === 0 ? displayImages.length - 1 : activeIndex - 1;
    goTo(i);
  }, [activeIndex, displayImages.length, goTo]);

  const next = useCallback(() => {
    const i = activeIndex === displayImages.length - 1 ? 0 : activeIndex + 1;
    goTo(i);
  }, [activeIndex, displayImages.length, goTo]);

  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-gradient-to-br from-brand-bg-white to-brand-bg shadow-sm ring-1 ring-brand-neutral-light/10"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <Image
              src={active.url}
              alt={active.alt ?? productTitle}
              fill
              className={cn(
                "object-contain p-8 transition-transform duration-500 ease-out",
                isZoomed && "scale-110",
              )}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Image counter indicator */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "w-6 bg-brand-gold"
                    : "w-1.5 bg-brand-neutral-light/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5">
          {displayImages.map((img, i) => (
            <motion.button
              key={img.id}
              type="button"
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative h-18 w-18 overflow-hidden rounded-xl border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-brand-gold shadow-md shadow-brand-gold/15 ring-2 ring-brand-gold/20"
                  : "border-transparent bg-brand-bg-white hover:border-brand-gold-light/50 hover:shadow-sm",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productTitle} ${i + 1}`}
                fill
                className="object-contain p-1.5"
                sizes="72px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
