import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { SITE } from "@/config/site";
import { getCartItemCount } from "@/lib/cart";
import { getAllCategories } from "@/server/repositories/products";

export async function Navbar() {
  const [cartCount, categories] = await Promise.all([
    getCartItemCount(),
    getAllCategories(),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-neutral-light/10 bg-brand-bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02] sm:gap-3" aria-label={SITE.name}>
          <Image
            src="/images/logofinl.svg"
            alt={`${SITE.name} Logo`}
            width={56}
            height={56}
            className="h-10 w-auto sm:h-12"
            priority
          />
          <span className="font-heading text-lg font-semibold tracking-tight text-brand-dark sm:text-xl">
            {SITE.name}
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="hidden text-brand-neutral transition-colors duration-200 hover:text-brand-dark sm:block"
            >
              {cat.name}
            </Link>
          ))}
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
            className="flex items-center gap-1.5 rounded-lg border border-brand-neutral-light/20 bg-white px-3 py-2 text-brand-dark shadow-sm transition-all duration-200 hover:border-brand-gold/30 hover:shadow-md hover:shadow-brand-gold/5 sm:px-4"
          >
            <User className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Konto</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
