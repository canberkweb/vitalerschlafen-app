import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/server/repositories/orders";
import { clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils/format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Bestellung erfolgreich",
};

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orderId = params.order;
  if (!orderId) redirect("/");

  const order = await getOrderById(orderId);
  if (!order || order.userId !== user.userId) redirect("/");

  // Clear the cart after successful payment
  await clearCart();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-success/10">
          <CheckCircle className="h-8 w-8 text-brand-success" />
        </div>

        <h1 className="mt-6 font-heading text-2xl font-semibold text-brand-dark md:text-3xl">
          Vielen Dank für Ihre Bestellung!
        </h1>
        <p className="mt-2 text-center text-sm text-brand-neutral">
          Ihre Zahlung wird verarbeitet. Sie erhalten in Kürze eine Bestätigung per E-Mail.
        </p>

        {/* Order summary card */}
        <div className="mt-8 w-full rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-5 w-5 text-brand-gold" />
            <h2 className="font-heading text-lg font-semibold text-brand-dark">
              Bestellübersicht
            </h2>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-neutral">Bestellnummer</dt>
              <dd className="font-mono text-xs font-medium text-brand-dark">{order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-neutral">Status</dt>
              <dd className="text-brand-dark">
                {order.status === "PAID" ? "Bezahlt" : "Zahlung wird verarbeitet"}
              </dd>
            </div>
          </dl>

          {/* Items */}
          <div className="mt-5 space-y-2 border-t border-brand-neutral-light/10 pt-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-brand-dark">
                    {item.variant.product.title}
                  </span>
                  <span className="ml-2 text-xs text-brand-neutral">
                    {item.variant.label} × {item.quantity}
                  </span>
                </div>
                <span className="tabular-nums text-brand-dark">
                  {formatPrice(item.unitCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-2 border-t border-brand-neutral-light/10 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-brand-neutral">Zwischensumme</span>
              <span className="tabular-nums text-brand-dark">{formatPrice(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-neutral">Versand</span>
              <span className="tabular-nums text-brand-dark">
                {order.shippingCents === 0 ? "Kostenlos" : formatPrice(order.shippingCents)}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-brand-dark">Gesamtbetrag</span>
              <span className="font-heading text-lg tabular-nums text-brand-dark">
                {formatPrice(order.totalCents)}
              </span>
            </div>
            <p className="text-right text-[11px] text-brand-neutral-light">inkl. MwSt.</p>
          </div>

          {/* Shipping address */}
          <div className="mt-5 border-t border-brand-neutral-light/10 pt-5">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-brand-neutral">
              Lieferadresse
            </h3>
            <p className="text-sm text-brand-dark">
              {order.shippingName}<br />
              {order.shippingAddress1}<br />
              {order.shippingAddress2 && <>{order.shippingAddress2}<br /></>}
              {order.shippingPostalCode} {order.shippingCity}<br />
              {order.shippingCountry}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/account/orders"
            className="flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-200 hover:bg-brand-dark-soft hover:shadow-xl"
          >
            Meine Bestellungen
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-brand-neutral-light/20 bg-white px-6 py-3 text-sm font-medium text-brand-dark shadow-sm transition-all duration-200 hover:border-brand-gold/30 hover:shadow-md"
          >
            Zurück zum Shop
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
