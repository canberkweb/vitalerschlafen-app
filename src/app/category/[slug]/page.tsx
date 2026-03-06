import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getProductsByCategory,
} from "@/server/repositories/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// ─── Dynamic metadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} — ${SITE.name}`,
    description: `Entdecken Sie unsere ${category.name} — Premium Schlafprodukte von ${SITE.name}.`,
    openGraph: {
      title: `${category.name} — ${SITE.name}`,
      type: "website",
      locale: "de_DE",
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* ─── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-6 py-5">
        <nav
          className="flex items-center gap-2 text-xs text-brand-neutral"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-brand-dark">
            Startseite
          </Link>
          <span className="text-brand-neutral-light">/</span>
          <span className="font-medium text-brand-dark">{category.name}</span>
        </nav>
      </div>

      {/* ─── Content ─────────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-dark md:text-4xl">
          {category.name}
        </h1>
        <div className="mt-3 h-[2px] w-14 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        {products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gold/10">
              <span className="text-3xl">🛋️</span>
            </div>
            <h2 className="mt-6 font-heading text-xl font-semibold text-brand-dark">
              Bald verfügbar
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-neutral">
              Wir arbeiten mit Hochdruck an unserer {category.name}-Kollektion.
              Schauen Sie bald wieder vorbei!
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all hover:bg-brand-dark-soft hover:shadow-xl"
            >
              Zur Startseite
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
