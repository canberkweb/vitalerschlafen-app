import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getEnrichedCart } from "@/lib/cart";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Kasse",
  description: "Schließen Sie Ihre Bestellung ab.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/checkout");

  const cart = await getEnrichedCart();
  if (cart.items.length === 0) redirect("/cart");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-brand-dark md:text-3xl">
          Kasse
        </h1>
        <div className="mt-1 h-[2px] w-10 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light" />
        <div className="mt-8">
          <CheckoutForm
            cart={cart}
            userEmail={user.email}
            userName={user.name ?? ""}
            stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
