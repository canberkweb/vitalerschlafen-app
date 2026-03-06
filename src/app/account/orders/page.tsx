import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersByUserId } from "@/server/repositories/orders";
import { formatPrice } from "@/lib/utils/format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Package, ArrowLeft, Truck, FileText, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Meine Bestellungen",
};

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Zahlung ausstehend",
  PAID: "Bezahlt",
  PREPARING: "In Vorbereitung",
  SHIPPED: "Versandt",
  DELIVERED: "Zugestellt",
  CANCELLED: "Storniert",
  REFUNDED: "Erstattet",
  MANUAL_REVIEW: "Wird geprüft",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  PREPARING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-orange-100 text-orange-800",
  MANUAL_REVIEW: "bg-yellow-200 text-yellow-900",
};

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/account/orders");

  const orders = await getOrdersByUserId(user.userId);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="mb-2 flex items-center gap-2">
          <Link
            href="/account"
            className="flex items-center gap-1.5 text-sm text-brand-neutral transition-colors hover:text-brand-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Mein Konto
          </Link>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand-dark md:text-3xl">
          Meine Bestellungen
        </h1>
        <div className="mt-1 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        {orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold/8">
              <Package className="h-8 w-8 text-brand-gold" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-semibold text-brand-dark">
              Noch keine Bestellungen
            </h2>
            <p className="mt-2 text-sm text-brand-neutral">
              Entdecken Sie unser Premium-Hirsekissen.
            </p>
            <Link
              href="/product/hirsekissen"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition hover:bg-brand-dark-soft"
            >
              Zum Shop
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-brand-neutral-light/10 bg-white shadow-sm"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-neutral-light/10 bg-brand-bg-white/50 px-6 py-4">
                  <div>
                    <p className="text-xs text-brand-neutral">
                      Bestellt am{" "}
                      {new Date(order.createdAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-brand-neutral">
                      Nr. {order.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="font-heading text-lg font-bold tabular-nums text-brand-dark">
                      {formatPrice(order.totalCents)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div>
                          <Link
                            href={`/product/${item.variant.product.slug}`}
                            className="text-brand-dark underline-offset-2 hover:underline"
                          >
                            {item.variant.product.title}
                          </Link>
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

                  {/* Tracking info */}
                  {order.trackingNumber && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-gold/5 px-3 py-2">
                      <Truck className="h-4 w-4 text-brand-gold" />
                      <p className="text-xs text-brand-dark">
                        Sendungsverfolgung:{" "}
                        <span className="font-mono font-medium">{order.trackingNumber}</span>
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-brand-neutral-light/10 pt-4">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-brand-dark px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-dark-soft"
                    >
                      Details ansehen
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                    {order.invoiceNumber && (
                      <a
                        href={`/api/invoice/${order.id}`}
                        download
                        className="flex items-center gap-1.5 rounded-lg border border-brand-neutral-light/20 bg-white px-3 py-1.5 text-xs font-medium text-brand-dark transition-colors hover:bg-brand-bg"
                      >
                        <FileText className="h-3 w-3" />
                        Rechnung
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
