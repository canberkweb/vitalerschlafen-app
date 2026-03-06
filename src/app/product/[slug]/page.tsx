import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug } from "@/server/repositories/products";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { TrustBadges } from "@/components/product";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";

export const revalidate = 60;

// ─── Params type ─────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

// ─── Dynamic metadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const lowestPrice = product.variants[0]?.priceCents;
  return {
    title: product.title,
    description:
      product.description ??
      `${product.title} — Premium Hirsekissen von ${SITE.name}`,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
      type: "website",
      locale: "de_DE",
    },
    other: lowestPrice
      ? { "product:price:amount": String(lowestPrice / 100) }
      : undefined,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // JSON-LD structured data
  const lowestPrice = product.variants[0]?.priceCents ?? 0;
  const highestPrice =
    product.variants[product.variants.length - 1]?.priceCents ?? lowestPrice;
  const hasStock = product.variants.some((v) => v.stock > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: (lowestPrice / 100).toFixed(2),
      highPrice: (highestPrice / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* ─── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-6 py-5">
        <nav className="flex items-center gap-2 text-xs text-brand-neutral" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-brand-dark">
            Startseite
          </Link>
          <span className="text-brand-neutral-light">/</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category.slug}`}
                className="transition-colors hover:text-brand-dark"
              >
                {product.category.name}
              </Link>
              <span className="text-brand-neutral-light">/</span>
            </>
          )}
          <span className="font-medium text-brand-dark">{product.title}</span>
        </nav>
      </div>

      {/* ─── Product ───────────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ProductDetailClient
          productTitle={product.title}
          productDescription={product.description}
          variants={product.variants.map((v) => ({
            id: v.id,
            productId: v.productId,
            size: v.size,
            lavenderIncluded: v.lavenderIncluded,
            priceCents: v.priceCents,
            stock: v.stock,
            sku: v.sku,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
          }))}
          images={product.images.map((i) => ({
            id: i.id,
            productId: i.productId,
            url: i.url,
            alt: i.alt,
            sortOrder: i.sortOrder,
            createdAt: i.createdAt,
          }))}
        />

        {/* ─── Materials & care ──────────────────────────────────────── */}
        <section className="mt-20 grid gap-12 border-t border-brand-neutral-light/10 pt-14 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-semibold text-brand-dark">
              Materialien
            </h2>
            <div className="mt-2 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-brand-neutral">
              <li>
                <strong className="font-medium text-brand-dark">
                  Füllung:
                </strong>{" "}
                100&nbsp;% Bio Hirsenschalen aus kontrolliertem Anbau.
                Natürlich temperaturregulierend und stützend.
              </li>
              <li>
                <strong className="font-medium text-brand-dark">Bezug:</strong>{" "}
                100&nbsp;% Bionassel. Weich, atmungsaktiv,
                hautfreundlich.
              </li>
              <li>
                <strong className="font-medium text-brand-dark">
                  Verschluss:
                </strong>{" "}
                Hochwertiger Reißverschluss zum einfachen Nachfüllen.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-brand-dark">
              Pflege
            </h2>
            <div className="mt-2 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-brand-neutral">
              <li>
                Bezug bei 40&nbsp;°C waschbar. Trocknergeeignet auf niedriger
                Stufe.
              </li>
              <li>
                Hirsefüllung regelmäßig an der frischen Luft aufschütteln.
              </li>
              <li>
                Nicht chemisch reinigen. Füllung alle 1–2 Jahre austauschen für
                optimalen Komfort.
              </li>
            </ul>
          </div>
        </section>

        {/* ─── Reviews ───────────────────────────────────────────────── */}
        <ReviewsSection productId={product.id} />
      </main>

      {/* ─── Trust Badges ──────────────────────────────────────────────── */}
      <TrustBadges />

      <Footer />
    </div>
  );
}
