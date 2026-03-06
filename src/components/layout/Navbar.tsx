import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { SITE } from "@/config/site";
import { getCartItemCount } from "@/lib/cart";

export async function Navbar() {
  const cartCount = await getCartItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-neutral-light/10 bg-brand-bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]" aria-label={SITE.name}>
          <Image
            src="/images/logofinl.svg"
            alt={`${SITE.name} Logo`}
            width={56}
            height={56}
            className="h-12 w-auto"
            priority
          />
          <span className="font-heading text-xl font-semibold tracking-tight text-brand-dark">
            {SITE.name}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/product/hirsekissen"
            className="text-brand-neutral transition-colors duration-200 hover:text-brand-dark"
          >
            Hirsekissen
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 text-brand-neutral transition-colors duration-200 hover:text-brand-dark"
            aria-label={`Warenkorb${cartCount > 0 ? ` (${cartCount})` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className="rounded-lg border border-brand-neutral-light/20 bg-white px-4 py-2 text-brand-dark shadow-sm transition-all duration-200 hover:border-brand-gold/30 hover:shadow-md hover:shadow-brand-gold/5"
          >
            Konto
          </Link>
        </nav>
      </div>
    </header>
  );
}
