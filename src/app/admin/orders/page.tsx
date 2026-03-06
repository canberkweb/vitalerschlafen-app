import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAllOrdersAdmin } from "@/server/repositories/orders";
import { formatPrice } from "@/lib/utils/format";
import { logoutAction } from "@/actions/logout";
import { OrderStatusEditor } from "@/components/admin/OrderStatusEditor";
import { Package, ArrowLeft, LogOut, ExternalLink } from "lucide-react";

export const metadata = { title: "Bestellungen verwalten" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Zahlung ausstehend",
  PAID: "Bezahlt",
  PREPARING: "In Vorbereitung",
  SHIPPED: "Versandt",
  DELIVERED: "Zugestellt",
  CANCELLED: "Storniert",
  REFUNDED: "Erstattet",
  MANUAL_REVIEW: "Manuelle Prüfung",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  PREPARING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-orange-100 text-orange-800",
  MANUAL_REVIEW: "bg-red-200 text-red-900",
};

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  const orders = await getAllOrdersAdmin();

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-brand-neutral-light/10 bg-brand-bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-dark transition-colors hover:text-brand-gold-dark"
            >
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <span className="text-brand-neutral-light/50">/</span>
            <span className="flex items-center gap-1.5 text-sm text-brand-neutral">
              <Package className="h-3.5 w-3.5" /> Bestellungen
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-brand-neutral transition-colors hover:text-brand-dark"
            >
              <ExternalLink className="h-3 w-3" /> Zur Seite
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs text-brand-error transition-colors hover:text-brand-error/80"
              >
                <LogOut className="h-3 w-3" /> Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-heading text-2xl font-semibold text-brand-dark">Bestellungen</h1>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

        {orders.length === 0 && (
          <p className="mt-10 text-sm text-brand-neutral">Noch keine Bestellungen vorhanden.</p>
        )}

        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-brand-neutral-light/10 bg-white shadow-sm"
            >
              {/* Order header */}
              <div className="border-b border-brand-neutral-light/10 bg-brand-bg-white/50 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-brand-dark">
                      Bestellung {order.id}
                    </h2>
                    <p className="mt-0.5 text-xs text-brand-neutral">
                      {new Date(order.createdAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {order.user && (
                        <> · {order.user.name ?? order.user.email}</>
                      )}
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
              </div>

              {/* Order items */}
              <div className="px-6 py-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-brand-dark">{item.variant.product.title}</span>
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

                {/* Shipping info */}
                <div className="mt-4 border-t border-brand-neutral-light/10 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-neutral">
                        Lieferadresse
                      </h3>
                      <p className="text-xs text-brand-dark">
                        {order.shippingName}<br />
                        {order.shippingAddress1}<br />
                        {order.shippingAddress2 && <>{order.shippingAddress2}<br /></>}
                        {order.shippingPostalCode} {order.shippingCity}<br />
                        {order.shippingCountry}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-neutral">
                        Details
                      </h3>
                      <dl className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <dt className="text-brand-neutral">E-Mail</dt>
                          <dd className="text-brand-dark">{order.email}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-brand-neutral">Versand</dt>
                          <dd className="text-brand-dark">
                            {order.shippingCents === 0 ? "Kostenlos" : formatPrice(order.shippingCents)}
                          </dd>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex justify-between">
                            <dt className="text-brand-neutral">Sendungsnr.</dt>
                            <dd className="font-mono text-brand-dark">{order.trackingNumber}</dd>
                          </div>
                        )}
                        {order.stripePaymentIntentId && (
                          <div className="flex justify-between">
                            <dt className="text-brand-neutral">Stripe PI</dt>
                            <dd className="max-w-[160px] truncate font-mono text-brand-dark" title={order.stripePaymentIntentId}>
                              {order.stripePaymentIntentId}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Status editor */}
                <div className="mt-4 border-t border-brand-neutral-light/10 pt-4">
                  <OrderStatusEditor
                    orderId={order.id}
                    currentStatus={order.status}
                    currentTrackingNumber={order.trackingNumber}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
