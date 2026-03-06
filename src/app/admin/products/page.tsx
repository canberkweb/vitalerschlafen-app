import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAllProductsAdmin } from "@/server/repositories/products";
import { StockEditorRow } from "@/components/admin/StockEditorRow";
import { logoutAction } from "@/actions/logout";
import { Package, ArrowLeft, LogOut, ExternalLink } from "lucide-react";

export const metadata = { title: "Produkte verwalten" };
export const dynamic = "force-dynamic"; // always fresh data in admin

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  const products = await getAllProductsAdmin();

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ─── Admin header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-brand-neutral-light/10 bg-brand-bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-dark transition-colors hover:text-brand-gold-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Link>
            <span className="text-brand-neutral-light/50">/</span>
            <span className="flex items-center gap-1.5 text-sm text-brand-neutral">
              <Package className="h-3.5 w-3.5" />
              Produkte
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-brand-neutral transition-colors hover:text-brand-dark"
            >
              <ExternalLink className="h-3 w-3" />
              Zur Seite
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs text-brand-error transition-colors hover:text-brand-error/80"
              >
                <LogOut className="h-3 w-3" />
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ─── Content ───────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-heading text-2xl font-semibold text-brand-dark">
          Produkte & Bestand
        </h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        {products.length === 0 && (
          <p className="mt-10 text-sm text-brand-neutral">
            Keine Produkte vorhanden.
          </p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="mt-8 overflow-hidden rounded-2xl border border-brand-neutral-light/10 bg-white shadow-sm"
          >
            <div className="border-b border-brand-neutral-light/10 bg-brand-bg-white/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-brand-dark">
                {product.title}
              </h2>
              <p className="mt-0.5 text-xs text-brand-neutral">
                {product.category && (
                  <span className="mr-2 inline-flex items-center rounded-md bg-brand-gold/10 px-2 py-0.5 text-[10px] font-semibold text-brand-gold-dark">
                    {product.category.name}
                  </span>
                )}
                Slug: {product.slug} · {product.variants.length} Variante
                {product.variants.length !== 1 && "n"}
              </p>
            </div>

            {product.variants.length > 0 && (
              <div className="overflow-x-auto px-6 pb-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-brand-neutral-light/15 text-xs font-medium uppercase tracking-wider text-brand-neutral">
                      <th className="pb-3 pr-4 pt-4">Größe / Variante</th>
                      <th className="pb-3 pr-4 pt-4">SKU</th>
                      <th className="pb-3 pr-4 pt-4">Preis</th>
                      <th className="pb-3 pt-4">Bestand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v) => (
                      <StockEditorRow
                        key={v.id}
                        variant={{
                          id: v.id,
                          size: v.size,
                          lavenderIncluded: v.lavenderIncluded,
                          sku: v.sku,
                          priceCents: v.priceCents,
                          stock: v.stock,
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
