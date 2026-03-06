"use client";

import { useState, useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ShieldCheck, Truck, CreditCard, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { EU_COUNTRIES } from "@/lib/shipping";
import { createCheckoutAction, type CheckoutResult } from "@/actions/checkout";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import type { EnrichedCart } from "@/lib/cart/schema";

interface CheckoutFormProps {
  cart: EnrichedCart;
  userEmail: string;
  userName: string;
  stripePublishableKey: string;
}

// ─── Shipping preview (mirrors server logic) ────────────────────────────────
function previewShippingCents(country: string, subtotalCents: number): number {
  if (country === "DE") {
    return subtotalCents >= 5000 ? 0 : 499;
  }
  return 999;
}

export function CheckoutForm({
  cart,
  userEmail,
  userName,
  stripePublishableKey,
}: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = useState("DE");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Payment step state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shippingCents = previewShippingCents(country, cart.subtotalCents);
  const totalCents = cart.subtotalCents + shippingCents;

  const stripePromise = loadStripe(stripePublishableKey);

  function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result: CheckoutResult = await createCheckoutAction(formData);

      if (!result.success) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        if (result.error) setError(result.error);
        return;
      }

      // Move to payment step
      setClientSecret(result.clientSecret!);
      setOrderId(result.orderId!);
    });
  }

  // ─── Payment step ─────────────────────────────────────────────────────
  if (clientSecret && orderId) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#1C1C1C",
              colorBackground: "#FFFFFF",
              colorText: "#1C1C1C",
              colorDanger: "#C0392B",
              fontFamily: "Inter, system-ui, sans-serif",
              borderRadius: "8px",
            },
          },
          locale: "de",
        }}
      >
        <PaymentStep
          orderId={orderId}
          totalCents={totalCents}
          clientSecret={clientSecret}
        />
      </Elements>
    );
  }

  // ─── Address + Summary form ───────────────────────────────────────────
  return (
    <form action={handleSubmit}>
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left: Shipping form */}
        <div className="space-y-8">
          {/* Stock warning */}
          {cart.hasStockWarning && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-700">
                Einige Artikel haben eine begrenzte Verfügbarkeit. Menge wurde angepasst.
              </p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="rounded-xl border border-brand-error/20 bg-brand-error/5 px-4 py-3">
              <p className="whitespace-pre-line text-sm text-brand-error">{error}</p>
            </div>
          )}

          {/* Shipping address section */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Truck className="h-5 w-5 text-brand-gold" />
              <h2 className="font-heading text-lg font-semibold text-brand-dark">
                Lieferadresse
              </h2>
            </div>

            <div className="space-y-4">
              {/* Full name */}
              <div>
                <label htmlFor="shippingName" className="mb-1.5 block text-sm font-medium text-brand-dark">
                  Vollständiger Name *
                </label>
                <input
                  id="shippingName"
                  name="shippingName"
                  type="text"
                  required
                  defaultValue={userName}
                  autoComplete="name"
                  className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Max Mustermann"
                />
                {fieldErrors.shippingName && (
                  <p className="mt-1 text-xs text-brand-error">{fieldErrors.shippingName[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-dark">
                  E-Mail-Adresse *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={userEmail}
                  autoComplete="email"
                  className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="max@beispiel.de"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-brand-error">{fieldErrors.email[0]}</p>
                )}
              </div>

              {/* Address line 1 */}
              <div>
                <label htmlFor="shippingAddress1" className="mb-1.5 block text-sm font-medium text-brand-dark">
                  Straße und Hausnummer *
                </label>
                <input
                  id="shippingAddress1"
                  name="shippingAddress1"
                  type="text"
                  required
                  autoComplete="address-line1"
                  className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Musterstraße 1"
                />
                {fieldErrors.shippingAddress1 && (
                  <p className="mt-1 text-xs text-brand-error">{fieldErrors.shippingAddress1[0]}</p>
                )}
              </div>

              {/* Address line 2 */}
              <div>
                <label htmlFor="shippingAddress2" className="mb-1.5 block text-sm font-medium text-brand-dark">
                  Adresszusatz
                </label>
                <input
                  id="shippingAddress2"
                  name="shippingAddress2"
                  type="text"
                  autoComplete="address-line2"
                  className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                  placeholder="Wohnung, Etage, etc. (optional)"
                />
              </div>

              {/* PLZ + City row */}
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <div>
                  <label htmlFor="shippingPostalCode" className="mb-1.5 block text-sm font-medium text-brand-dark">
                    PLZ *
                  </label>
                  <input
                    id="shippingPostalCode"
                    name="shippingPostalCode"
                    type="text"
                    required
                    autoComplete="postal-code"
                    className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                    placeholder="87700"
                  />
                  {fieldErrors.shippingPostalCode && (
                    <p className="mt-1 text-xs text-brand-error">{fieldErrors.shippingPostalCode[0]}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="shippingCity" className="mb-1.5 block text-sm font-medium text-brand-dark">
                    Ort *
                  </label>
                  <input
                    id="shippingCity"
                    name="shippingCity"
                    type="text"
                    required
                    autoComplete="address-level2"
                    className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                    placeholder="Memmingen"
                  />
                  {fieldErrors.shippingCity && (
                    <p className="mt-1 text-xs text-brand-error">{fieldErrors.shippingCity[0]}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="shippingCountry" className="mb-1.5 block text-sm font-medium text-brand-dark">
                  Land *
                </label>
                <select
                  id="shippingCountry"
                  name="shippingCountry"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country"
                  className="w-full rounded-lg border border-brand-neutral-light/40 bg-white px-4 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                >
                  {EU_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.shippingCountry && (
                  <p className="mt-1 text-xs text-brand-error">{fieldErrors.shippingCountry[0]}</p>
                )}
              </div>
            </div>
          </section>

          {/* Security note */}
          <div className="flex items-start gap-3 rounded-xl border border-brand-neutral-light/10 bg-white px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-success" />
            <p className="text-xs leading-relaxed text-brand-neutral">
              Ihre Daten werden verschlüsselt übertragen. Die Zahlungsabwicklung erfolgt sicher über Stripe.
            </p>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-brand-neutral-light/10 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-brand-dark">
              Bestellübersicht
            </h2>
            <div className="mt-1 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />

            {/* Items */}
            <div className="mt-5 space-y-3 border-b border-brand-neutral-light/10 pb-5">
              {cart.items.map((item) => (
                <div key={item.variantId} className="flex items-start justify-between text-sm">
                  <div className="flex-1 pr-3">
                    <p className="font-medium text-brand-dark">{item.productTitle}</p>
                    <p className="text-xs text-brand-neutral">
                      {item.variantLabel} × {item.quantity}
                    </p>
                  </div>
                  <span className="tabular-nums text-brand-dark">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal + shipping */}
            <div className="mt-4 space-y-2 border-b border-brand-neutral-light/10 pb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-neutral">Zwischensumme</span>
                <span className="tabular-nums text-brand-dark">
                  {formatPrice(cart.subtotalCents)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-neutral">Versand</span>
                <span className="tabular-nums text-brand-dark">
                  {shippingCents === 0 ? (
                    <span className="text-brand-success">Kostenlos</span>
                  ) : (
                    formatPrice(shippingCents)
                  )}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-heading text-base font-semibold text-brand-dark">
                Gesamtbetrag
              </span>
              <span className="font-heading text-xl font-bold tabular-nums text-brand-dark">
                {formatPrice(totalCents)}
              </span>
            </div>

            {/* VAT note */}
            <p className="mt-2 text-[11px] text-brand-neutral-light">
              Alle Preise inkl. MwSt.
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending || cart.hasStockWarning}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-200 hover:bg-brand-dark-soft hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              {isPending ? "Wird verarbeitet …" : "Zahlungspflichtig bestellen"}
            </button>

            {/* Free shipping notice for DE */}
            {country === "DE" && cart.subtotalCents < 5000 && (
              <p className="mt-3 text-center text-xs text-brand-neutral">
                Noch {formatPrice(5000 - cart.subtotalCents)} bis zum kostenlosen Versand
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
