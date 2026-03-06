import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Zahlung fehlgeschlagen",
};

export default function CheckoutErrorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-error/10">
          <XCircle className="h-8 w-8 text-brand-error" />
        </div>

        <h1 className="mt-6 font-heading text-2xl font-semibold text-brand-dark md:text-3xl">
          Zahlung fehlgeschlagen
        </h1>
        <p className="mt-2 max-w-md text-center text-sm text-brand-neutral">
          Leider konnte Ihre Zahlung nicht verarbeitet werden. Ihre Bestellung wurde nicht abgeschlossen.
          Bitte versuchen Sie es erneut oder verwenden Sie eine andere Zahlungsmethode.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/checkout"
            className="flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand-dark/15 transition-all duration-200 hover:bg-brand-dark-soft hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4" />
            Erneut versuchen
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-xl border border-brand-neutral-light/20 bg-white px-6 py-3 text-sm font-medium text-brand-dark shadow-sm transition-all duration-200 hover:border-brand-gold/30 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Zum Warenkorb
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
