import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/server/repositories/orders";
import { formatPrice } from "@/lib/utils/format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowLeft,
  Package,
  Truck,
  FileText,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bestelldetails",
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

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/account/orders");

  const order = await getOrderById(orderId);
  if (!order) notFound();

  // Only owner or admin
  if (order.userId !== user.userId && user.role !== "ADMIN") {
    redirect("/account/orders");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/account/orders"
            className="flex items-center gap-1.5 text-sm text-brand-neutral transition-colors hover:text-brand-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Meine Bestellungen
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand-dark">
              Bestelldetails
            </h1>
            <p className="mt-1 font-mono text-xs text-brand-neutral">
              Nr. {order.id}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>

        <div className="mt-1 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        {/* Order card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-brand-neutral-light/10 bg-white shadow-sm">
          {/* Items */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-brand-gold" />
              <h2 className="text-sm font-semibold text-brand-dark">Artikel</h2>
            </div>
            <div className="space-y-3">
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
                      {item.variant.label} x {item.quantity}
                    </span>
                  </div>
                  <span className="tabular-nums text-brand-dark">
                    {formatPrice(item.unitCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-brand-neutral-light/10 px-6 py-4">
            <div className="space-y-2">
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
              <div className="flex justify-between pt-2 border-t border-brand-neutral-light/10 font-medium">
                <span className="text-brand-dark">Gesamtbetrag</span>
                <span className="font-heading text-lg tabular-nums text-brand-dark">
                  {formatPrice(order.totalCents)}
                </span>
              </div>
              <p className="text-right text-[11px] text-brand-neutral-light">inkl. MwSt.</p>
            </div>
          </div>

          {/* Shipping address */}
          <div className="border-t border-brand-neutral-light/10 px-6 py-5">
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

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="border-t border-brand-neutral-light/10 px-6 py-4">
              <div className="flex items-center gap-2 rounded-lg bg-brand-gold/5 px-3 py-2">
                <Truck className="h-4 w-4 text-brand-gold" />
                <p className="text-xs text-brand-dark">
                  Sendungsverfolgung:{" "}
                  <span className="font-mono font-medium">{order.trackingNumber}</span>
                </p>
              </div>
            </div>
          )}

          {/* Invoice download */}
          {order.invoiceNumber && (
            <div className="border-t border-brand-neutral-light/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <div>
                    <p className="text-sm font-medium text-brand-dark">Rechnung</p>
                    <p className="text-xs text-brand-neutral">{order.invoiceNumber}</p>
                  </div>
                </div>
                <a
                  href={`/api/invoice/${order.id}`}
                  download
                  className="flex items-center gap-1.5 rounded-lg bg-brand-dark px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-dark-soft"
                >
                  <Download className="h-3 w-3" />
                  PDF herunterladen
                </a>
              </div>
            </div>
          )}

          {/* Order meta */}
          <div className="border-t border-brand-neutral-light/10 bg-brand-bg-white/50 px-6 py-4">
            <dl className="space-y-1 text-xs">
              <div className="flex justify-between">
                <dt className="text-brand-neutral">Bestellt am</dt>
                <dd className="text-brand-dark">
                  {new Date(order.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-neutral">E-Mail</dt>
                <dd className="text-brand-dark">{order.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/account/orders"
            className="rounded-xl border border-brand-neutral-light/20 bg-white px-6 py-3 text-sm font-medium text-brand-dark shadow-sm transition-all duration-200 hover:border-brand-gold/30 hover:shadow-md"
          >
            Zurück zu Bestellungen
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-brand-neutral-light/20 bg-white px-6 py-3 text-sm font-medium text-brand-dark shadow-sm transition-all duration-200 hover:border-brand-gold/30 hover:shadow-md"
          >
            Weiter einkaufen
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
