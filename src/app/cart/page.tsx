import type { Metadata } from "next";
import { getEnrichedCart } from "@/lib/cart";
import { CartClient } from "@/components/cart/CartClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Warenkorb — Vitalerschlafen",
  description: "Ihr Einkaufskorb bei Vitalerschlafen.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getEnrichedCart();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand-dark md:text-3xl">
          Warenkorb
        </h1>
        <div className="mt-1 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        <div className="mt-8">
          <CartClient cart={cart} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
