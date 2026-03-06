"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

interface PaymentStepProps {
  orderId: string;
  totalCents: number;
  clientSecret: string;
}

export function PaymentStep({ orderId, totalCents }: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
      },
    });

    // This point is only reached if there's an immediate error
    // (e.g. card declined). Otherwise, Stripe redirects.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message ?? "Ein Fehler ist aufgetreten.");
      } else {
        setErrorMessage("Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    }

    setIsProcessing(false);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-2">
        <Lock className="h-5 w-5 text-brand-gold" />
        <h2 className="font-heading text-lg font-semibold text-brand-dark">
          Sichere Zahlung
        </h2>
      </div>

      {/* Total display */}
      <div className="mb-6 rounded-xl border border-brand-neutral-light/10 bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-neutral">Zu zahlender Betrag</span>
          <span className="font-heading text-xl font-bold tabular-nums text-brand-dark">
            {formatPrice(totalCents)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-brand-neutral-light">inkl. MwSt. und Versand</p>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 rounded-xl border border-brand-error/20 bg-brand-error/5 px-4 py-3">
          <p className="text-sm text-brand-error">{errorMessage}</p>
        </div>
      )}

      {/* Stripe Payment Element form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-brand-neutral-light/10 bg-white p-5">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-200 hover:bg-brand-dark-soft hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "Zahlung wird verarbeitet …" : `${formatPrice(totalCents)} bezahlen`}
        </button>
      </form>

      {/* Security note */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-brand-neutral-light/10 bg-white px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-success" />
        <p className="text-xs leading-relaxed text-brand-neutral">
          Ihre Zahlungsdaten werden sicher über Stripe verarbeitet. Wir speichern niemals Ihre Kartendaten.
        </p>
      </div>

      {/* Back link */}
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 flex items-center gap-1.5 text-sm text-brand-neutral transition-colors hover:text-brand-dark"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zur Lieferadresse
      </button>
    </div>
  );
}
